// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (デバッグロード付き)
// バージョン: VER-MULTI-SNAP-I9
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-MULTI-SNAP-I9");

// 1. パーツライブラリ（カタログ）
const partsCatalog = {
    "KATO-248": {
        "type": "straight", "name": "直線 S248", "width": 248, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-R315-45": {
        "type": "curve", "name": "曲線 R315-45(左右対称)", "width": 241.1, "height": 23.9,
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 11.95, "facingAngle": 157.5 },
            { "id": 1, "relX": 120.55,  "relY": 11.95, "facingAngle": 22.5 }
        ]
    }
};

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true; // ドラッグ開始検知フラグ

// 2. レールをCanvasに追加する関数
function addRailToCanvas(partId) {
    if (!canvas) {
        if (typeof initCanvas === 'function') initCanvas();
    }
    if (!canvas) return null;

    const catalogItem = partsCatalog[partId];
    const initialLeft = 250 + (railCount % 5) * 20;
    const initialTop = 250 + (railCount % 5) * 20;
    const currentId = `rail-${railCount}`;
    railCount++;

    let railObject;

    if (catalogItem.type === "straight") {
        railObject = new fabric.Rect({
            width: catalogItem.width, height: catalogItem.height,
            fill: catalogItem.fill, stroke: '#888', strokeWidth: 2
        });
    } else if (catalogItem.type === "curve") {
        const ballastedPath = "M -120.55 11.95 A 315 315 0 0 1 120.55 11.95";
        railObject = new fabric.Path(ballastedPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    }

    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'center', originY: 'center', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

    railObject.customData = { instanceId: currentId, partId: partId, isRail: true };

    canvas.add(railObject);
    
    // 単体ドラッグ移動イベント
    railObject.on('moving', function() {
        onGeneralMoving(this);
    });

    // 複数選択グループ（ActiveSelection）の移動監視を1回だけ登録
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

// 3. 幾何学計算：ノードの「画面上の絶対座標」を計算 (ActiveSelectionグループ内の相対座標を絶対座標に変換するガード付き)
function getAbsoluteNodePos(rail) {
    const catalog = partsCatalog[rail.customData.partId];
    
    // ★Fabric.jsの重要仕様：複数選択グループ(ActiveSelection)の中にいる場合、
    // left/top/angleがグループ内のローカル座標系になっているため、全体の絶対座標に変換して戻す
    if (rail.group && rail.group.type === 'activeSelection') {
        const angleRad = (rail.angle * Math.PI) / 180;
        return catalog.nodes.map(node => {
            // 1. まずグループ中心からの「レール内ローカル座標」を「グループ内相対座標」に変える
            const localX = rail.left + (node.relX * Math.cos(angleRad) - node.relY * Math.sin(angleRad));
            const localY = rail.top  + (node.relX * Math.sin(angleRad) + node.relY * Math.cos(angleRad));
            
            // 2. Fabricの公式行列変換を使い、グループ内相対座標を画面全体の「絶対XY」に完全復元する
            const point = new fabric.Point(localX, localY);
            const absPoint = fabric.util.transformPoint(point, rail.group.calcTransformMatrix());
            
            // 角度もグループ全体の角度を合算
            const absAngle = (rail.group.angle + rail.angle + node.facingAngle) % 360;
            return { nodeId: node.id, x: absPoint.x, y: absPoint.y, angle: absAngle };
        });
    }

    // 単体レールの場合は従来通りのシンプルな絶対座標計算
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

// 4. 移動中のリアルタイムハンドラ（引き裂きルール①〜④の実行）
function onGeneralMoving(target) {
    if (isFirstMoveFrame) {
        const movedIds = getMovedRailIds(target);
        
        // 境界ジョイントのみを引き裂く（仕様①〜④）
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

// 5. インジケータ（丸）を再描画する関数
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

// ★新設：ご提示いただいた「完璧なエンドレス」を起動時に自動で展開するデバッグ用関数
function loadDebugSampleLayout() {
    if (!canvas) return;
    canvas.clear();
    globalJoints = [];
    railCount = 0;

    // ご提示いただいたサンプルJSONデータ
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

    // レールインスタンスの生成
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

    // ジョイント関係の完全復元
    sampleData.joints.forEach(j => {
        globalJoints.push({
            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            railA: j.railA, nodeA: j.nodeA,
            railB: j.railB, nodeB: j.nodeB
        });
    });

    railCount = sampleData.rails.length;
    
    // カメラの初期位置をエンドレス全体が見える位置に少し引く(ズームアウト)
    canvas.setZoom(0.5);
    canvas.setViewportTransform([0.5, 0, 0, 0.5, 250, 50]);

    updateJointIndicators();
    canvas.requestRenderAll();
    console.log("[VER-MULTI-SNAP-I9] デバッグサンプルレイアウト(12本)のロードに成功しました！");
}
