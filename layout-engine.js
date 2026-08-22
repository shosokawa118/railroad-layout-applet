// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン
// バージョン: VER-SPLIT-H8
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-SPLIT-H8");

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
    if (!canvas) return;

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
    canvas.setActiveObject(railObject);
    
    // 単体ドラッグ移動イベント
    railObject.on('moving', function() {
        onGeneralMoving(this);
    });

    // 複数選択グループ（ActiveSelection）の移動監視を1回だけ登録
    if (railCount === 1) {
        canvas.on('object:moving', function(options) {
            onGeneralMoving(options.target);
        });
        // マウスを離した瞬間のスナップイベントを新規のマネージャー側にバイパス
        canvas.on('object:modified', function(options) {
            if (typeof applyClusterSnapLogic === 'function') {
                applyClusterSnapLogic(options.target);
            }
        });
    }

    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();
}

// 3. 幾何学計算：ノードの「画面上の絶対座標」を計算
function getAbsoluteNodePos(rail) {
    const catalog = partsCatalog[rail.customData.partId];
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
    // 画像バッファ処理中につき、丸ぽちの最新追従のみを最軽量で実行
    updateJointIndicators();
}

// 現在移動しているレールのIDを取得するヘルパー
function getMovedRailIds(target) {
    if (!target) return [];
    if (target.customData && target.customData.isRail) {
        return [target.customData.instanceId];
    }
    if (target.type === 'activeSelection') {
        return target.getObjects().filter(o => o.customData && o.customData.isRail).map(o => o.customData.instanceId);
    }
    return [];
}

// 5. 画面上のすべての接続点インジケータ（丸）を再描画する関数
function updateJointIndicators() {
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
