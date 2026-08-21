// =============================================================
// 鉄道模型レイアウトジェネレータ - 配置・幾何学ロジック (複数選択ガード版)
// バージョン: VER-MULTI-SELECT-G7
// =============================================================
console.log("ロジックエンジン（JS）が読み込まれました: VER-MULTI-SELECT-G7");

// 1. パーツライブラリ
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
    
    railObject.on('moving', function() {
        onRailMoving(this);
    });

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

// レールを掴んでドラッグ移動している真っ最中のリアルタイム処理
function onRailMoving(movedRail) {
    // ★追加ガード：複数選択中の一時グループオブジェクトの場合は、エラーを防ぐためリアルタイム更新をパス
    if (!movedRail.customData || !movedRail.customData.isRail) return;

    const movedId = movedRail.customData.instanceId;

    // 動かし始めた瞬間に、このレールに関わる古いジョイント（結合）をリアルタイムに即座に破棄
    globalJoints = globalJoints.filter(j => j.railA !== movedId && j.railB !== movedId);
    updateJointIndicators();
}

// 4. ジョイント管理機能付きスナップメインロジック（マウスを離した瞬間に実行）
function applySnapAndJointLogic(movedRail) {
    // ★追加ガード：もし離されたのが「複数選択の一時グループ」だった場合
    if (movedRail.type === 'activeSelection') {
        console.log("[VER-MULTI-SELECT-G7] 複数レールの同時移動を検知しました。個別再判定を行います。");
        // グループの中に入っている本物のレールたちを1本ずつ取り出す
        const selectedObjects = movedRail.getObjects();
        selectedObjects.forEach(rail => {
            if (rail.customData && rail.customData.isRail) {
                // グループ座標系からグローバル絶対座標系にFabricが内部変換した後の最新位置で個別にロジックを実行
                applySnapAndJointLogic(rail);
            }
        });
        return; // グループとしての処理はここで終了
    }

    // ここから先は本物のレール1本に対する従来の正常なロジック
    if (!movedRail.customData || !movedRail.customData.isRail) return;

    const allObjects = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    const SNAP_THRESHOLD = 30;
    const movedId = movedRail.customData.instanceId;

    globalJoints = globalJoints.filter(j => j.railA !== movedId && j.railB !== movedId);

    const movedNodes = getAbsoluteNodePos(movedRail);
    let bestSnap = null;
    let minDistance = SNAP_THRESHOLD;

    allObjects.forEach(otherRail => {
        if (otherRail === movedRail) return;
        const otherId = otherRail.customData.instanceId;
        const otherNodes = getAbsoluteNodePos(otherRail);

        movedNodes.forEach(mNode => {
            if (isNodeOccupied(movedId, mNode.nodeId)) return;

            otherNodes.forEach(oNode => {
                if (isNodeOccupied(otherId, oNode.nodeId)) return;

                const dist = Math.sqrt(Math.pow(mNode.x - oNode.x, 2) + Math.pow(mNode.y - oNode.y, 2));
                if (dist < minDistance) {
                    minDistance = dist;
                    bestSnap = { movedNode: mNode, targetNode: oNode, targetRail: otherRail };
                }
            });
        });
    });

    if (bestSnap) {
        const targetRail = bestSnap.targetRail;
        const targetId = targetRail.customData.instanceId;
        const mCatalogNode = partsCatalog[movedRail.customData.partId].nodes[bestSnap.movedNode.nodeId];
        
        let newAngle = (bestSnap.targetNode.angle - mCatalogNode.facingAngle + 180) % 360;
        if (newAngle < 0) newAngle += 360;
        movedRail.set('angle', newAngle);

        const newAngleRad = (newAngle * Math.PI) / 180;
        const newLeft = bestSnap.targetNode.x - (mCatalogNode.relX * Math.cos(newAngleRad) - mCatalogNode.relY * Math.sin(newAngleRad));
        const newTop  = bestSnap.targetNode.y - (mCatalogNode.relX * Math.sin(newAngleRad) + mCatalogNode.relY * Math.cos(newAngleRad));

        movedRail.set({ left: newLeft, top: newTop });
        movedRail.setCoords();

        globalJoints.push({
            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            railA: movedId, nodeA: bestSnap.movedNode.nodeId,
            railB: targetId, nodeB: bestSnap.targetNode.nodeId
        });
        console.log("[VER-MULTI-SELECT-G7] 1箇所目のジョイント結合成功");

        const postMovedNodes = getAbsoluteNodePos(movedRail);
        allObjects.forEach(otherRail => {
            if (otherRail === movedRail) return;
            const otherId = otherRail.customData.instanceId;
            const otherNodes = getAbsoluteNodePos(otherRail);

            postMovedNodes.forEach(mNode => {
                if (isNodeOccupied(movedId, mNode.nodeId)) return;
                otherNodes.forEach(oNode => {
                    if (isNodeOccupied(otherId, oNode.nodeId)) return;

                    const dist = Math.sqrt(Math.pow(mNode.x - oNode.x, 2) + Math.pow(mNode.y - oNode.y, 2));
                    if (dist < 5) {
                        globalJoints.push({
                            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                            railA: movedId, nodeA: mNode.nodeId,
                            railB: otherId, nodeB: oNode.nodeId
                        });
                        console.log("[VER-MULTI-SELECT-G7] 🎉 同時結合成功！");
                    }
                });
            });
        });
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

// 画面上のすべての接続点の状態をスキャンし、インジケータ（丸）を再描画する関数
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

// 5. 総合データエクスポート
function exportLayoutJSON() {
    if (!canvas) return;
    const objects = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    
    const railsData = objects.map(obj => {
        return {
            instanceId: obj.customData.instanceId,
            partId: obj.customData.partId,
            x: Math.round(obj.left), y: Math.round(obj.top), angle: Math.round(obj.angle)
        };
    });

    const completeSaveData = {
        version: "VER-MULTI-SELECT-G7",
        rails: railsData,
        joints: globalJoints
    };

    console.log("[VER-MULTI-SELECT-G7] ======= 総合セーブデータ(JSON) =======");
    console.log(JSON.stringify(completeSaveData, null, 2));
    alert("ブラウザのコンソール(F12)に統合JSONを出力しました！");
}
