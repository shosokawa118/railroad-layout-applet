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

/**
 * 指定されたレール群（または単一レール）の近接・接触ノードを自動検出して一括結合する（共通関数）
 * @param {Object|Array} targetRails - 対象のFabricレールオブジェクト、または配列
 * @param {number} [distTol=8] - 許容位置誤差(px)
 * @param {number} [angleTol=10] - 許容角度誤差(deg)
 */
function autoConnectNearbyNodes(targetRails, distTol = 8, angleTol = 10) {
    if (!canvas) return;
    
    const rails = Array.isArray(targetRails) ? targetRails : [targetRails];
    const validRails = rails.filter(r => r && r.customData && r.customData.isRail);
    if (validRails.length === 0) return;

    const targetIds = validRails.map(r => r.customData.instanceId);
    const allRails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    validRails.forEach(rRail => {
        const rId = rRail.customData.instanceId;
        if (typeof getAbsoluteNodePos !== 'function') return;
        
        const rNodes = getAbsoluteNodePos(rRail);

        allRails.forEach(oRail => {
            const oId = oRail.customData.instanceId;
            // 同一オブジェクトまたは移動対象グループ内同士の重複判定を回避
            if (targetIds.includes(oId)) return;

            const oNodes = getAbsoluteNodePos(oRail);

            rNodes.forEach(mN => {
                if (typeof isNodeOccupied === 'function' && isNodeOccupied(rId, mN.nodeId)) return;

                oNodes.forEach(oN => {
                    if (typeof isNodeOccupied === 'function' && isNodeOccupied(oId, oN.nodeId)) return;
                    
                    const canConnect = (typeof canConnectNodes === 'function') 
                        ? canConnectNodes(rRail, mN.nodeId, oRail, oN.nodeId) 
                        : true;

                    if (canConnect && typeof isNodePositionCompatible === 'function') {
                        if (isNodePositionCompatible(mN, oN, distTol, angleTol)) {
                            if (typeof addGlobalJointIfFree === 'function') {
                                addGlobalJointIfFree(rId, mN.nodeId, oId, oN.nodeId);
                            }
                        }
                    }
                });
            });
        });
    });
}

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
        
        // --- 修正箇所: getEffectiveNodeDef を使用 ---
        const mEffDef = getEffectiveNodeDef(mRail, mCatalogNode);
        
        let targetRailAngle = (bestSnap.oNode.angle - mEffDef.facingAngle + 180) % 360;
        if (targetRailAngle < 0) targetRailAngle += 360;

        if (movedRail.type === 'activeSelection') {
            const currentRailAbsAngle = (movedRail.angle + mRail.angle + mEffDef.facingAngle) % 360;
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
            const lx = mEffDef.relX - cx;
            const ly = mEffDef.relY - cy;

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

        // 3. 届いた他ノードを多重ロック（共通化関数を実行）
        autoConnectNearbyNodes(movedRails, 8, 10);
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
