// =============================================================
// 鉄道模型レイアウトジェネレータ - 配置・幾何学ロジック
// バージョン: VER-SPLIT-A1
// =============================================================
console.log("ロジックエンジン（JS）が読み込まれました: VER-SPLIT-A1");

// 1. パーツライブラリ（不変のカタログデータ）
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

// 現在レイアウト上でカチッと結合しているジョイントのグローバルリスト
let globalJoints = [];
let railCount = 0;

// 2. レールをCanvasに追加する関数（HTMLのボタンから呼ばれる）
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

    railObject.customData = { 
        instanceId: currentId,
        partId: partId 
    };

    canvas.add(railObject);
    canvas.setActiveObject(railObject);
    canvas.calcOffset();
    canvas.requestRenderAll();
    console.log("[VER-SPLIT-A1] レール追加完了 ID:", currentId);
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

// 特定のノードがすでに結合済みかチェックする関数
function isNodeOccupied(railId, nodeId) {
    return globalJoints.some(j => 
        (j.railA === railId && j.nodeA === nodeId) || 
        (j.railB === railId && j.nodeB === nodeId)
    );
}

// 4. ジョイント管理機能付きスナップメインロジック（Canvasのmodifiedイベントから呼ばれる）
function applySnapAndJointLogic(movedRail) {
    const allObjects = canvas.getObjects();
    const SNAP_THRESHOLD = 30;
    const movedId = movedRail.customData.instanceId;

    // 動かしたレールの古いジョイントを一度解除
    const previousJointCount = globalJoints.length;
    globalJoints = globalJoints.filter(j => j.railA !== movedId && j.railB !== movedId);
    if (globalJoints.length < previousJointCount) {
        console.log("[VER-SPLIT-A1] ジョイント解除。残数:", globalJoints.length);
    }

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
        canvas.requestRenderAll();

        const newJoint = {
            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            railA: movedId, nodeA: bestSnap.movedNode.nodeId,
            railB: targetId, nodeB: bestSnap.targetNode.nodeId
        };
        
        globalJoints.push(newJoint);
        console.log("[VER-SPLIT-A1] 🤝 ジョイント成立！:", newJoint.railA, "->", newJoint.railB);
    }
}

// 5. 総合データエクスポート（HTMLから呼ばれる）
function exportLayoutJSON() {
    if (!canvas) return;
    const objects = canvas.getObjects();
    
    const railsData = objects.map(obj => {
        return {
            instanceId: obj.customData.instanceId,
            partId: obj.customData.partId,
            x: Math.round(obj.left), y: Math.round(obj.top), angle: Math.round(obj.angle)
        };
    });

    const completeSaveData = {
        version: "VER-SPLIT-A1",
        rails: railsData,
        joints: globalJoints
    };

    console.log("[VER-SPLIT-A1] ======= 総合セーブデータ(JSON) =======");
    console.log(JSON.stringify(completeSaveData, null, 2));
    alert("ブラウザのコンソール(F12)に統合JSONを出力しました！");
}
