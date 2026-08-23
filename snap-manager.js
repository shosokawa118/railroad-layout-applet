// =============================================================
// 鉄道模型レイアウトジェネレータ - スナップ＆多重結合マネージャー
// バージョン: VER-MULTI-SNAP-J2
// =============================================================
console.log("スナップマネージャー（JS）が読み込まれました: VER-MULTI-SNAP-J2");

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
        console.log("[VER-MULTI-SNAP-J2] スナップを検知。グループ一体スナップを実行します。");

        const mRail = bestSnap.movedRail;
        const mCatalogNode = partsCatalog[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
        
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
            // ★ 修正：単体スナップ時も中心オフセット(cx, cy)を適用して位置決め
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

        globalJoints.push({
            jointId: `j-${Date.now()}-1`,
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

                        const dist = Math.sqrt(Math.pow(mN.x - oN.x, 2) + Math.pow(mN.y - oN.y, 2));
                        if (dist < 6) {
                            globalJoints.push({
                                jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                                railA: rId, nodeA: mN.nodeId,
                                railB: oId, nodeB: oN.nodeId
                            });
                            console.log("[VER-MULTI-SNAP-J2] 🎉 自動連動ロック成立！ 端点ID:", rId, "->", oId);
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
            x: Math.round(obj.left), y: Math.round(obj.top), angle: Math.round(obj.angle)
        };
    });

    const completeSaveData = {
        version: "VER-MULTI-SNAP-J2",
        rails: railsData,
        joints: globalJoints
    };

    console.log("[VER-MULTI-SNAP-J2] ======= 総合セーブデータ(JSON) =======");
    console.log(JSON.stringify(completeSaveData, null, 2));
    alert("ブラウザのコンソール(F12)に統合JSONを出力しました！");
}
