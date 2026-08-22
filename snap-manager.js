// =============================================================
// 鉄道模型レイアウトジェネレータ - スナップ＆多重結合マネージャー
// バージョン: VER-SPLIT-H8
// =============================================================
console.log("スナップマネージャー（JS）が読み込まれました: VER-SPLIT-H8");

// マウスを離した瞬間に実行される、仕様①～④に基づく高度なクラスタスナップ処理
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
        const mNodes = getAbsoluteNodePos(mRail); // layout-engine.jsの関数を呼び出し

        allRails.forEach(otherRail => {
            const oId = otherRail.customData.instanceId;
            if (movedIds.includes(oId)) return; // 移動対象同士（クラスタ内）はスナップさせない（仕様①）

            const otherNodes = getAbsoluteNodePos(otherRail);

            mNodes.forEach(mNode => {
                if (isNodeOccupied(mId, mNode.nodeId)) return; // 間の結合済みジョイントは判定しない（仕様①）

                otherNodes.forEach(oNode => {
                    if (isNodeOccupied(oId, oNode.nodeId)) return; // 満員なら割り込めない

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

    // --- 【仕様①～③：スナップ対象が見つかったら、レール群全体を同じだけ一斉に並行移動させる】 ---
    if (bestSnap) {
        console.log("[VER-SPLIT-H8] スナップを検知。クラスタ並行移動を実行します。");

        const mRail = bestSnap.movedRail;
        const mCatalogNode = partsCatalog[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
        
        // A. 基準となる1本の新しい角度と座標を割り出す
        let newAngle = (bestSnap.oNode.angle - mCatalogNode.facingAngle + 180) % 360;
        if (newAngle < 0) newAngle += 360;
        
        const newAngleRad = (newAngle * Math.PI) / 180;
        const newLeft = bestSnap.oNode.x - (mCatalogNode.relX * Math.cos(newAngleRad) - mCatalogNode.relY * Math.sin(newAngleRad));
        const newTop  = bestSnap.oNode.y - (mCatalogNode.relX * Math.sin(newAngleRad) + mCatalogNode.relY * Math.cos(newAngleRad));

        // B. 基準レールの移動量（デルタベクトル）を計算する
        const deltaX = newLeft - mRail.left;
        const deltaY = newTop - mRail.top;
        const deltaAngle = newAngle - mRail.angle;

        // C. ★【重要】選択されたグループ（クラスタ）内のすべてのレールを「同じ量だけ」芋づる式に平行移動
        if (movedRail.type === 'activeSelection') {
            // 複数選択グループ自体の座標を動かすことで、内部のレールを一斉移動（Fabricの仕様に最適化）
            movedRail.set({
                left: movedRail.left + deltaX,
                top: movedRail.top + deltaY,
                angle: movedRail.angle + deltaAngle
            });
            movedRail.setCoords();
        } else {
            // 単体移動の場合
            mRail.set({ left: newLeft, top: newTop, angle: newAngle });
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
                            console.log("[VER-SPLIT-H8] 🎉 自動連動ロック成立！ 端点ID:", rId, "->", oId);
                        }
                    });
                });
            });
        });
    }

    updateJointIndicators(); // インジケータを最終リフレッシュ
    canvas.requestRenderAll();
}

// 総合セーブデータエクスポート（HTMLのボタン用、ここに統合）
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
        version: "VER-SPLIT-H8",
        rails: railsData,
        joints: globalJoints
    };

    console.log("[VER-SPLIT-H8] ======= 総合セーブデータ(JSON) =======");
    console.log(JSON.stringify(completeSaveData, null, 2));
    alert("ブラウザのコンソール(F12)に統合JSONを出力しました！");
}
