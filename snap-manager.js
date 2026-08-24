// =============================================================
// 鉄道模型レイアウトジェネレータ - スナップ＆多重結合マネージャー (jointId撤去・軽量化版)
// バージョン: VER-CLEAN-JOINTS-J5
// =============================================================
console.log("スナップマネージャー（JS）が読み込まれました: VER-CLEAN-JOINTS-J5");

function canConnectNodes(railA, nodeAId, railB, nodeBId) {
    const itemA = railCatalog.items[railA.customData.partId];
    const itemB = railCatalog.items[railB.customData.partId];
    if (!itemA || !itemB) return false;

    const sysA = railCatalog.systems[itemA.systemId];
    const sysB = railCatalog.systems[itemB.systemId];
    if (!sysA || !sysB) return false;

    const connA = (itemA.nodes[nodeAId] && itemA.nodes[nodeAId].connectorType) || sysA.connectorType;
    const connB = (itemB.nodes[nodeBId] && itemB.nodes[nodeBId].connectorType) || sysB.connectorType;

    return connA === connB;
}

function applyClusterSnapLogic(movedRail) {
    isFirstMoveFrame = true;

    const allRails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    const movedRails = (movedRail.type === 'activeSelection') 
        ? movedRail.getObjects().filter(o => o.customData && o.customData.isRail)
        : [movedRail];

    const movedIds = movedRails.map(o => o.customData.instanceId);
    const SNAP_THRESHOLD = 30;

    let bestSnap = null;
    let minDistance = SNAP_THRESHOLD;

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
                        bestSnap = {
                            movedRail: mRail, mNode: mNode,
                            targetRail: otherRail, oNode: oNode
                        };
                    }
                });
            });
        });
    });

    if (bestSnap) {
        console.log("[VER-CLEAN-JOINTS-J5] スナップを検知。グループ一体スナップを実行します。");

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
            
            const deltaX = bestSnap.oNode.x - rotatedMNode.x;
            const deltaY = bestSnap.oNode.y - rotatedMNode.y;

            movedRail.set({
                left: movedRail.left + deltaX,
                top: movedRail.top + deltaY
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
        canvas.requestRenderAll();

        // ★ jointId を除外したシンプル形式で追加
        globalJoints.push({
            railA: mRail.customData.instanceId, nodeA: bestSnap.mNode.nodeId,
            railB: bestSnap.targetRail.customData.instanceId, nodeB: bestSnap.oNode.nodeId
        });

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

                        const dist = Math.sqrt(Math.pow(mN.x - oN.x, 2) + Math.pow(mN.y - oN.y, 2));
                        if (dist < 6) {
                            globalJoints.push({
                                railA: rId, nodeA: mN.nodeId,
                                railB: oId, nodeB: oN.nodeId
                            });
                            console.log("[VER-CLEAN-JOINTS-J5] 🎉 自動連動ロック成立！ 端点ID:", rId, "->", oId);
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
    if (!canvas) return;
    const objects = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    
    const railsData = objects.map(obj => {
        return {
            instanceId: obj.customData.instanceId,
            partId: obj.customData.partId,
            x: Math.round(obj.left * 100) / 100,
            y: Math.round(obj.top * 100) / 100,
            angle: Math.round(obj.angle * 100) / 100
        };
    });

    const completeSaveData = {
        version: "VER-CLEAN-JOINTS-J5",
        rails: railsData,
        joints: globalJoints
    };

    const jsonString = JSON.stringify(completeSaveData, null, 2);

    console.log("[VER-CLEAN-JOINTS-J5] ======= 総合セーブデータ(JSON) =======");
    console.log(jsonString);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonString).then(() => {
            alert("レイアウトデータ(JSON)をクリップボードにコピーしました！");
        }).catch(err => {
            console.warn("クリップボード書き込み失敗。コンソール出力のみ行いました。", err);
            alert("コンソール(F12)にJSONを出力しました！");
        });
    } else {
        alert("コンソール(F12)にJSONを出力しました！");
    }
}
