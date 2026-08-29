// =============================================================
// 鉄道模型レイアウトジェネレータ - スナップ＆多重結合マネージャー
// バージョン: VER-SNAP-SIDE-SNAP-S11
// 
// [ノード探索・接続優先順位ルール]
// - 被スナップ（親）ノード: Node Max -> ... -> Node 0 (降順評価)
// - 移動側（子）ノード    : Node 0 -> ... -> Node Max (昇順評価)
// - ジョイント互換性      : jointGroup による判定 (isJointCompatible)
// - ノードタイプ区分      : jointType ('rail-end' | 'side-joiner')
// =============================================================

console.log("スナップマネージャー（JS）が読み込まれました: VER-SNAP-FACING-A0");

function applyClusterSnapLogic(movedRail) {
    if (!movedRail) return;

    const allRails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    const movedRails = (movedRail.type === 'activeSelection') 
        ? movedRail.getObjects().filter(o => o.customData && o.customData.isRail)
        : [movedRail];

    const movedIds = movedRails.map(o => o.customData.instanceId);
    const SNAP_THRESHOLD = 30;

    let bestSnap = null;
    let minDistance = SNAP_THRESHOLD;

    // 1. 最も近い「最初のスナップ候補」を探索
    movedRails.forEach(mRail => {
        const mId = mRail.customData.instanceId;
        const mNodes = getAbsoluteNodePos(mRail);

        allRails.forEach(otherRail => {
            const oId = otherRail.customData.instanceId;
            if (movedIds.includes(oId)) return;

            const otherNodes = getAbsoluteNodePos(otherRail);

            mNodes.forEach(mNode => {
                if (isNodeOccupied(mId, mNode.nodeId)) return;

                otherNodes.forEach(oNode => {
                    if (isNodeOccupied(oId, oNode.nodeId)) return;
                    if (!canConnectNodes(mRail, mNode.nodeId, otherRail, oNode.nodeId)) return;

                    const dist = Math.sqrt(Math.pow(mNode.x - oNode.x, 2) + Math.pow(mNode.y - oNode.y, 2));
                    if (dist < minDistance) {
                        minDistance = dist;
                        bestSnap = { movedRail: mRail, mNode: mNode, targetRail: otherRail, oNode: oNode };
                    }
                });
            });
        });
    });

    // 2. 1箇所目の吸着（位置合わせ・回転）を実行
    if (bestSnap) {
        const mRail = bestSnap.movedRail;
        const mCatalogNode = railCatalog.items[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
        
        let targetRailAngle = (bestSnap.oNode.angle - mCatalogNode.facingAngle + 180) % 360;
        if (targetRailAngle < 0) targetRailAngle += 360;

        if (movedRail.type === 'activeSelection') {
            const currentRailAbsAngle = (movedRail.angle + mRail.angle + mCatalogNode.facingAngle) % 360;
            let deltaAngle = (bestSnap.oNode.angle - currentRailAbsAngle + 180) % 360;
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;

            movedRail.set('angle', movedRail.angle + deltaAngle);
            movedRail.setCoords();

            const rotatedNodes = getAbsoluteNodePos(mRail);
            const rotatedMNode = rotatedNodes.find(n => n.nodeId === bestSnap.mNode.nodeId);
            
            movedRail.set({
                left: movedRail.left + (bestSnap.oNode.x - rotatedMNode.x),
                top: movedRail.top + (bestSnap.oNode.y - rotatedMNode.y)
            });
            movedRail.setCoords();
        } else {
            const cx = mRail.customData.geoCenterX || 0;
            const cy = mRail.customData.geoCenterY || 0;
            const lx = mCatalogNode.relX - cx;
            const ly = mCatalogNode.relY - cy;

            const newAngleRad = (targetRailAngle * Math.PI) / 180;
            const newLeft = bestSnap.oNode.x - (lx * Math.cos(newAngleRad) - ly * Math.sin(newAngleRad));
            const newTop  = bestSnap.oNode.y - (lx * Math.sin(newAngleRad) + ly * Math.cos(newAngleRad));

            mRail.set({ left: newLeft, top: newTop, angle: targetRailAngle });
            mRail.setCoords();
        }

        addGlobalJointIfFree(
            mRail.customData.instanceId, bestSnap.mNode.nodeId,
            bestSnap.targetRail.customData.instanceId, bestSnap.oNode.nodeId
        );

        // 3. 届いた他ノードを多重ロック
        const postAllRails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
        
        movedRails.forEach(rRail => {
            const rId = rRail.customData.instanceId;
            const rNodes = getAbsoluteNodePos(rRail);

            postAllRails.forEach(oRail => {
                const oId = oRail.customData.instanceId;
                if (movedIds.includes(oId)) return;

                const oNodes = getAbsoluteNodePos(oRail);

                rNodes.forEach(mN => {
                    if (isNodeOccupied(rId, mN.nodeId)) return;

                    oNodes.forEach(oN => {
                        if (isNodeOccupied(oId, oN.nodeId)) return;
                        if (!canConnectNodes(rRail, mN.nodeId, oRail, oN.nodeId)) return;
                        
                        if (isNodePositionCompatible(mN, oN, 8, 10)) {
                            addGlobalJointIfFree(rId, mN.nodeId, oId, oN.nodeId);
                        }
                    });
                });
            });
        });
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

function exportLayoutJSON() {
    const completeSaveData = exportLayoutData();
    if (!completeSaveData) return;

    const jsonString = JSON.stringify(completeSaveData, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonString).then(() => {
            alert("レイアウトデータ(JSON)をクリップボードにコピーしました！");
        }).catch(() => {
            alert("コンソール(F12)にJSONを出力しました！");
        });
    } else {
        alert("コンソール(F12)にJSONを出力しました！");
    }
}
