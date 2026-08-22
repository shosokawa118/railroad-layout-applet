// =============================================================
// 鉄道模型レイアウトジェネレータ - スナップ＆多重結合マネージャー
// バージョン: VER-MULTI-SNAP-I9
// =============================================================
console.log("スナップマネージャー（JS）が読み込まれました: VER-MULTI-SNAP-I9");

// マウスを離した瞬間に実行される、仕様①～④に基づく高度なクラスタ（グループ一体型）スナップ処理
function applyClusterSnapLogic(movedRail) {
    isFirstMoveFrame = true; // ドラッグ終了のためフラグをリセット

    const allRails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
    const movedRails = (movedRail.type === 'activeSelection') 
        ? movedRail.getObjects().filter(o => o.customData && o.customData.isRail)
        : [movedRail];

    const movedIds = movedRails.map(o => o.customData.instanceId);
    const SNAP_THRESHOLD = 30;

    let bestSnap = null;
    let minDistance = SNAP_THRESHOLD;

    // --- 【仕様①～③：すべての移動対象の「空いている端点（0個以上）」から、最も近い外部の空きを探す】 ---
    movedRails.forEach(mRail => {
        const mId = mRail.customData.instanceId;
        const mNodes = getAbsoluteNodePos(mRail); // 既にグループ内の絶対座標復元に対応済み

        allRails.forEach(otherRail => {
            const oId = otherRail.customData.instanceId;
            if (movedIds.includes(oId)) return; // 移動対象同士（クラスタ内）はスナップさせない（仕様①）

            const otherNodes = getAbsoluteNodePos(otherRail);

            mNodes.forEach(mNode => {
                if (isNodeOccupied(mId, mNode.nodeId)) return; // 間の結合済みジョイントは判定しない（仕様①）

                otherNodes.forEach(oNode => {
                    if (isNodeOccupied(oId, oNode.nodeId)) return; // 相手が満員なら割り込めない

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

    // --- 【仕様①～③：スナップ対象が見つかったら、グループ全体を枠ごと一体のままスナップさせる】 ---
    if (bestSnap) {
        console.log("[VER-MULTI-SNAP-I9] スナップを検知。グループ一体スナップを実行します。");

        const mRail = bestSnap.movedRail;
        const mCatalogNode = partsCatalog[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
        
        // 1. 接続した1本のレールが「本来向くべき絶対角度」を逆算
        let targetRailAngle = (bestSnap.oNode.angle - mCatalogNode.facingAngle + 180) % 360;
        if (targetRailAngle < 0) targetRailAngle += 360;

        // 2. 複数選択中(ActiveSelection)の場合：グループの枠自体を回転・移動させる
        if (movedRail.type === 'activeSelection') {
            // 現在のグループの角度から、このレールを正しい向きにするための回転差分（デルタ）を計算
            // グローバル絶対座標復元時、ノード角度 = group.angle + rail.angle + facingAngle
            const currentRailAbsAngle = (movedRail.angle + mRail.angle + mCatalogNode.facingAngle) % 360;
            let deltaAngle = (bestSnap.oNode.angle - currentRailAbsAngle + 180) % 360;
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;

            // グループ全体をひねる
            movedRail.set('angle', movedRail.angle + deltaAngle);
            movedRail.setCoords();

            // 回転した後の最新のノード座標を再取得し、相手ノードとの「平行移動の差分(デルタ)」を計算
            const rotatedNodes = getAbsoluteNodePos(mRail);
            const rotatedMNode = rotatedNodes.find(n => n.nodeId === bestSnap.mNode.nodeId);
            
            const deltaX = bestSnap.oNode.x - rotatedMNode.x;
            const deltaY = bestSnap.oNode.y - rotatedMNode.y;

            // グループ全体を平行移動
            movedRail.set({
                left: movedRail.left + deltaX,
                top: movedRail.top + deltaY
            });
            movedRail.setCoords();
        } else {
            // 単体移動の場合（従来通り）
            const newAngleRad = (targetRailAngle * Math.PI) / 180;
            const newLeft = bestSnap.oNode.x - (mCatalogNode.relX * Math.cos(newAngleRad) - mCatalogNode.relY * Math.sin(newAngleRad));
            const newTop  = bestSnap.oNode.y - (mCatalogNode.relX * Math.sin(newAngleRad) + mCatalogNode.relY * Math.cos(newAngleRad));

            mRail.set({ left: newLeft, top: newTop, angle: targetRailAngle });
            mRail.setCoords();
        }
        canvas.requestRenderAll();

        // 1箇所目の結合ジョイントを登録
        globalJoints.push({
            jointId: `j-${Date.now()}-1`,
            railA: mRail.customData.instanceId, nodeA: bestSnap.mNode.nodeId,
            railB: bestSnap.targetRail.customData.instanceId, nodeB: bestSnap.oNode.nodeId
        });

        // --- 【仕様①～④：移動完了後、残りのすべての端点に対して自動連動ロック（多重スナップ）】 ---
        // 無限ループを防ぐため、移動はさせずデータ上の結合（緑丸化）のみを追加（仕様④の端点0個にも自動対応）
        const postAllRails = canvas.getObjects().filter(obj => obj.customData && obj.customData.isRail);
        
        movedRails.forEach(rRail => {
            const rId = rRail.customData.instanceId;
            const rNodes = getAbsoluteNodePos(rRail);

            postAllRails.forEach(oRail => {
                const oId = oRail.customData.instanceId;
                if (movedIds.includes(oId)) return; // 内部同士は判定不要

                const oNodes = getAbsoluteNodePos(oRail);

                rNodes.forEach(mN => {
                    if (isNodeOccupied(rId, mN.nodeId)) return;

                    oNodes.forEach(oN => {
                        if (isNodeOccupied(oId, oN.nodeId)) return;

                        const dist = Math.sqrt(Math.pow(mN.x - oN.x, 2) + Math.pow(mN.y - oN.y, 2));
                        if (dist < 6) { // 累積誤差を考慮し少し広めの6px許容
                            globalJoints.push({
                                jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                                railA: rId, nodeA: mN.nodeId,
                                railB: oId, nodeB: oN.nodeId
                            });
                            console.log("[VER-MULTI-SNAP-I9] 🎉 自動連動ロック成立！ 端点ID:", rId, "->", oId);
                        }
                    });
                });
            });
        });
    }

    updateJointIndicators(); // インジケータを最終リフレッシュ
    canvas.requestRenderAll();
}

// 総合セーブデータエクスポート（HTMLのボタン用）
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
        version: "VER-MULTI-SNAP-I9",
        rails: railsData,
        joints: globalJoints
    };

    console.log("[VER-MULTI-SNAP-I9] ======= 総合セーブデータ(JSON) =======");
    console.log(JSON.stringify(completeSaveData, null, 2));
    alert("ブラウザのコンソール(F12)に統合JSONを出力しました！");
}
