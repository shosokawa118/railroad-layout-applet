// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (ポイント対応版)
// バージョン: VER-TURNOUT-K1
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-TURNOUT-K1");

// 1. 新設パーツを完全網羅したカタログデータ
const partsCatalog = {
    "KATO-248": {
        "type": "straight", "name": "直線 S248", "width": 248, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-S60": {
        "type": "straight", "name": "直線 S60", "width": 60, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-S64": {
        "type": "straight", "name": "直線 S64", "width": 64, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-R315-45": {
        "type": "curve", "name": "曲線 R315-45(左右対称)", "width": 241.1, "height": 23.9,
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 11.95, "facingAngle": 157.5 },
            { "id": 1, "relX": 120.55,  "relY": 11.95, "facingAngle": 22.5 }
        ]
    },
    "KATO-R481-15": {
        "type": "curve", "name": "曲線 R481-15(補助用)", "width": 125.0, "height": 8.2,
        "nodes": [
            { "id": 0, "relX": -62.5, "relY": 4.1, "facingAngle": 172.5 },
            { "id": 1, "relX": 62.5,  "relY": 4.1, "facingAngle": 7.5 }
        ]
    },
    "KATO-EP4-R": {
        "type": "turnout-right", "name": "電動ポイント4番(右)", "width": 126, "height": 33,
        // ★進入、直進、右分岐の3つの接続点を幾何学マッピング
        "nodes": [
            { "id": 0, "relX": -63,  "relY": 0,    "facingAngle": 180 }, // 進入端(左)
            { "id": 1, "relX": 63,   "relY": 0,    "facingAngle": 0 },   // 直進端(右)
            { "id": 2, "relX": 61.9, "relY": 16.5, "facingAngle": 15.0 }  // 右分岐端(右下・15度)
        ]
    }
};

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

// 2. レールをCanvasに追加する共通関数
function addRailToCanvas(partId) {
    if (!canvas) return null;

    const catalogItem = partsCatalog[partId];
    const initialLeft = 200 + (railCount % 5) * 25;
    const initialTop = 450 + (railCount % 5) * 25;
    const currentId = `rail-${railCount}`;
    railCount++;

    let railObject;

    if (catalogItem.type === "straight") {
        railObject = new fabric.Rect({
            width: catalogItem.width, height: catalogItem.height,
            fill: catalogItem.fill, stroke: '#888', strokeWidth: 2
        });
    } else if (catalogItem.type === "curve") {
        // R315またはR481の円弧パス
        const r = partId === "KATO-R481-15" ? 481 : 315;
        const w2 = catalogItem.width / 2;
        const h2 = catalogItem.height / 2;
        const ballastedPath = `M ${-w2} ${h2} A ${r} ${r} 0 0 1 ${w2} ${h2}`;
        
        railObject = new fabric.Path(ballastedPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    } else if (catalogItem.type === "turnout-right") {
        // ★【大本命のバグ回避トリック】
        // グループ化を使わず、1つのパス文字列の中に「直線」と「15度の右分岐円弧」をスペース区切りで同時に刻み込む！
        // M:直線の開始(左端) L:直線の終了(右端) / M:分岐の開始(左端) A:半径481mmの右分岐円弧の終了(右下端)
        const turnoutPath = "M -63 0 L 63 0 M -63 0 A 481 481 0 0 1 61.9 16.5";
        
        railObject = new fabric.Path(turnoutPath, {
            fill: 'transparent',
            stroke: '#888888', // バラストを模したグレー太線
            strokeWidth: 16,
            strokeLineCap: 'butt'
        });
    }

    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'center', originY: 'center', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

    railObject.customData = { instanceId: currentId, partId: partId, isRail: true };

    canvas.add(railObject);
    
    railObject.on('moving', function() {
        onGeneralMoving(this);
    });

    if (railCount === 1) {
        canvas.on('object:moving', function(options) {
            onGeneralMoving(options.target);
        });
    }

    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();
    
    return railObject;
}

// 3. 幾何学計算：ノードの「画面上の絶対座標」を計算 (ActiveSelectionグループ対応)
function getAbsoluteNodePos(rail) {
    const catalog = partsCatalog[rail.customData.partId];
    
    if (rail.group && rail.group.type === 'activeSelection') {
        const angleRad = (rail.angle * Math.PI) / 180;
        return catalog.nodes.map(node => {
            const localX = rail.left + (node.relX * Math.cos(angleRad) - node.relY * Math.sin(angleRad));
            const localY = rail.top  + (node.relX * Math.sin(angleRad) + node.relY * Math.cos(angleRad));
            
            const point = new fabric.Point(localX, localY);
            const absPoint = fabric.util.transformPoint(point, rail.group.calcTransformMatrix());
            
            const absAngle = (rail.group.angle + rail.angle + node.facingAngle) % 360;
            return { nodeId: node.id, x: absPoint.x, y: absPoint.y, angle: absAngle };
        });
    }

    const angleRad = (rail.angle * Math.PI) / 180;
    return catalog.nodes.map(node => {
        const absX = rail.left + (node.relX * Math.cos(angleRad) - node.relY * Math.sin(angleRad));
        const absY = rail.top  + (node.relX * Math.sin(angleRad) + node.relY * Math.cos(angleRad));
        const absAngle = (rail.angle + node.facingAngle) % 360;
        return { nodeId: node.id, x: absX, y: absY, angle: absAngle };
    });
}

function isNodeOccupied(railId, nodeId) {
    return globalJoints.some(j => 
        (j.railA === railId && j.nodeA === nodeId) || 
        (j.railB === railId && j.nodeB === nodeId)
    );
}

function onGeneralMoving(target) {
    if (isFirstMoveFrame) {
        const movedIds = getMovedRailIds(target);
        globalJoints = globalJoints.filter(j => {
            const hasA = movedIds.includes(j.railA);
            const hasB = movedIds.includes(j.railB);
            return (hasA && hasB) || (!hasA && !hasB);
        });
        isFirstMoveFrame = false;
    }
    updateJointIndicators();
}

function getMovedRailIds(target) {
    if (!target) return [];
    if (target.customData && target.customData.isRail) return [target.customData.instanceId];
    if (target.type === 'activeSelection') {
        return target.getObjects().filter(o => o.customData && o.customData.isRail).map(o => o.customData.instanceId);
    }
    return [];
}

function updateJointIndicators() {
    if (!canvas) return;
    const oldIndicators = canvas.getObjects().filter(obj => obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => canvas.remove(obj));

    const rails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);

    rails.forEach(rail => {
        const railId = rail.customData.instanceId;
        const absoluteNodes = getAbsoluteNodePos(rail);

        absoluteNodes.forEach(node => {
            const isOccupied = isNodeOccupied(railId, node.nodeId);
            const color = isOccupied ? '#7cd21d' : '#ff3b30';
            const radius = isOccupied ? 3 : 5;

            const dot = new fabric.Circle({
                left: node.x, top: node.y, radius: radius, fill: color,
                stroke: '#ffffff', strokeWidth: 1, originX: 'center', originY: 'center',
                selectable: false, evented: false, customData: { isIndicator: true }
            });

            canvas.add(dot);
            canvas.bringToFront(dot);
        });
    });
}

// 初期配置データの読み込み (12本のエンドレス)
function loadDebugSampleLayout() {
    if (!canvas) return;
    canvas.clear();
    globalJoints = [];
    railCount = 0;

    const sampleData = {
        "rails": [
            { "instanceId": "rail-0", "partId": "KATO-248", "x": 282, "y": 397, "angle": 0 },
            { "instanceId": "rail-1", "partId": "KATO-R315-45", "x": 522, "y": 432, "angle": 23 },
            { "instanceId": "rail-2", "partId": "KATO-248", "x": 34, "y": 397, "angle": 0 },
            { "instanceId": "rail-3", "partId": "KATO-R315-45", "x": 686, "y": 596, "angle": 68 },
            { "instanceId": "rail-4", "partId": "KATO-R315-45", "x": 686, "y": 828, "angle": 113 },
            { "instanceId": "rail-5", "partId": "KATO-R315-45", "x": 522, "y": 992, "angle": 158 },
            { "instanceId": "rail-6", "partId": "KATO-248", "x": 282, "y": 1027, "angle": 180 },
            { "instanceId": "rail-7", "partId": "KATO-248", "x": 34, "y": 1027, "angle": 180 },
            { "instanceId": "rail-8", "partId": "KATO-R315-45", "x": -206, "y": 992, "angle": 203 },
            { "instanceId": "rail-9", "partId": "KATO-R315-45", "x": -370, "y": 828, "angle": 248 },
            { "instanceId": "rail-10", "partId": "KATO-R315-45", "x": -370, "y": 596, "angle": 293 },
            { "instanceId": "rail-11", "partId": "KATO-R315-45", "x": -206, "y": 432, "angle": 338 }
        ],
        "joints": [
            { "railA": "rail-8", "nodeA": 0, "railB": "rail-7", "nodeB": 1 },
            { "railA": "rail-9", "nodeA": 0, "railB": "rail-8", "nodeB": 1 },
            { "railA": "rail-10", "nodeA": 0, "railB": "rail-9", "nodeB": 1 },
            { "railA": "rail-11", "nodeA": 0, "railB": "rail-10", "nodeB": 1 },
            { "railA": "rail-11", "nodeA": 1, "railB": "rail-2", "nodeB": 0 },
            { "railA": "rail-0", "nodeA": 0, "railB": "rail-2", "nodeB": 1 },
            { "railA": "rail-6", "nodeA": 1, "railB": "rail-7", "nodeB": 0 },
            { "railA": "rail-1", "nodeA": 0, "railB": "rail-0", "nodeB": 1 },
            { "railA": "rail-5", "nodeA": 1, "railB": "rail-6", "nodeB": 0 },
            { "railA": "rail-3", "nodeA": 0, "railB": "rail-1", "nodeB": 1 },
            { "railA": "rail-4", "nodeA": 0, "railB": "rail-3", "nodeB": 1 },
            { "railA": "rail-4", "nodeA": 1, "railB": "rail-5", "nodeB": 0 }
        ]
    };

    const instanceMap = {};
    sampleData.rails.forEach(r => {
        const obj = addRailToCanvas(r.partId);
        if (obj) {
            obj.set({ left: r.x, top: r.y, angle: r.angle });
            obj.customData.instanceId = r.instanceId;
            obj.setCoords();
            instanceMap[r.instanceId] = obj;
        }
    });

    sampleData.joints.forEach(j => {
        globalJoints.push({
            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            railA: j.railA, nodeA: j.nodeA,
            railB: j.railB, nodeB: j.nodeB
        });
    });

    railCount = sampleData.rails.length;
    
    // 大規模配置を画面に収めるためカメラを引く
    canvas.setZoom(0.35);
    canvas.setViewportTransform([0.35, 0, 0, 0.35, 250, 100]);

    updateJointIndicators();
    canvas.requestRenderAll();
    console.log("[%s] サンプル小判型エンドレスの自動展開に成功しました！", CODE_VERSION);
}
