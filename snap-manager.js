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
        const rNodes = getAbsoluteNodePos(rRail);

        allRails.forEach(oRail => {
            const oId = oRail.customData.instanceId;
            // 同一オブジェクトまたは移動対象グループ内同士の重複判定を回避
            if (targetIds.includes(oId)) return;

            const oNodes = getAbsoluteNodePos(oRail);

            rNodes.forEach(mN => {
                if (isNodeOccupied(rId, mN.nodeId)) return;

                oNodes.forEach(oN => {
                    if (isNodeOccupied(oId, oN.nodeId)) return;
                    
                    const canConnect = canConnectNodes(rRail, mN.nodeId, oRail, oN.nodeId);

                    if (canConnect) {
                        if (isNodePositionCompatible(mN, oN, distTol, angleTol)) {
                            addGlobalJointIfFree(rId, mN.nodeId, oId, oN.nodeId);
                        }
                    }
                });
            });
        });
    });
}

function applyClusterSnapLogic(movedRail) {
    if (!movedRail) {
        throw new TypeError("[applyClusterSnapLogic] movedRail is missing.");
    }

    const allObjects = canvas.getObjects();
    const allRails = allObjects.filter(obj => obj.customData && obj.customData.isRail);
    
    // 選択されたオブジェクト群を取得（activeSelection または単体）
    const rawMovedRails = (movedRail.type === 'activeSelection') 
        ? movedRail.getObjects()
        : [movedRail];

    const movedRails = [];
    const lockedFlexibleIds = new Set();

    // ロック中のブリッジが含まれている場合、スナップ判定用として start / end に展開する
    rawMovedRails.forEach(mRail => {
        if (!mRail || !mRail.customData) return;

        const isLockedBridge = mRail.customData.railType === 'flexible_bridge' && 
                               mRail.customData.partOptions?.isLocked === true;

        if (isLockedBridge) {
            const flexId = mRail.customData.flexibleId;
            if (!flexId) {
                throw new Error("[applyClusterSnapLogic] flexible_bridge lacks flexibleId.");
            }

            const bridge = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_bridge');
            const start = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_start');
            const end = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_end');

            if (!bridge || !start || !end) {
                throw new Error(`[applyClusterSnapLogic] Complete 3-piece set not found for locked flexibleId: ${flexId}`);
            }

            lockedFlexibleIds.add(flexId);

            // --- スナップ探索の前に、変形ロック中の仮想レールを確実に最新位置に同期させる ---
            syncLockedFlexibleParts(bridge);

            // スナップ計算のMovedRailsに両端の仮想レールを追加（bridge自体はノードを持たないため除外）
            movedRails.push(start, end);
        } else if (mRail.customData.isRail === true) {
            movedRails.push(mRail);
        }
    });

    if (movedRails.length === 0) return;

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
        const isLockedFlexibleRail = mRail.customData && 
                                     (mRail.customData.railType === 'flexible_start' || mRail.customData.railType === 'flexible_end') &&
                                     mRail.customData.flexibleId;

        if (isLockedFlexibleRail) {
            // --- 変形ロック中のフレキシブルレールの吸着処理 ---
            const flexId = mRail.customData.flexibleId;
            const bridge = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_bridge');
            const start = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_start');
            const end = allObjects.find(o => o.customData && o.customData.flexibleId === flexId && o.customData.railType === 'flexible_end');

            if (!bridge || !start || !end) {
                throw new Error(`[applyClusterSnapLogic] Complete 3-piece set not found for locked flexibleId: ${flexId}`);
            }

            const mCatalogNode = railCatalog.items[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
            const mEffDef = getEffectiveNodeDef(mRail, mCatalogNode);

            // 相手ノードの角度から、この仮想レールが向くべき目標角度を算出
            let targetAngle = (bestSnap.oNode.angle - mEffDef.facingAngle + 180) % 360;
            if (targetAngle < 0) targetAngle += 360;

            const currentAngle = mRail.angle || 0;
            let deltaAngle = targetAngle - currentAngle;
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;

            // まず bridge 自体を回転させる
            bridge.set('angle', (bridge.angle || 0) + deltaAngle);
            bridge.setCoords();

            // 回転後の仮想レールのノード位置を再計算し、相手ノードとの位置のズレ（デルタ）を算出
            syncLockedFlexibleParts(bridge);
            
            const rotatedNodes = getAbsoluteNodePos(mRail);
            const rotatedMNode = rotatedNodes.find(n => n.nodeId === bestSnap.mNode.nodeId);
            if (!rotatedMNode) {
                throw new Error(`[applyClusterSnapLogic] Failed to find rotated node for nodeId: ${bestSnap.mNode.nodeId}`);
            }

            const deltaX = bestSnap.oNode.x - rotatedMNode.x;
            const deltaY = bestSnap.oNode.y - rotatedMNode.y;

            // bridge を平行移動させて位置を完全に一致させる
            bridge.set({
                left: bridge.left + deltaX,
                top: bridge.top + deltaY
            });
            bridge.setCoords();

            // 最終的な全体同期を実行
            syncLockedFlexibleParts(bridge);

        } else if (movedRail.type === 'activeSelection') {
            // --- 通常の activeSelection 吸着処理 ---
            const mCatalogNode = railCatalog.items[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
            const mEffDef = getEffectiveNodeDef(mRail, mCatalogNode);
            
            let targetRailAngle = (bestSnap.oNode.angle - mEffDef.facingAngle + 180) % 360;
            if (targetRailAngle < 0) targetRailAngle += 360;

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
            // --- 通常の単体レール吸着処理 ---
            const mCatalogNode = railCatalog.items[mRail.customData.partId].nodes[bestSnap.mNode.nodeId];
            const mEffDef = getEffectiveNodeDef(mRail, mCatalogNode);
            
            let targetRailAngle = (bestSnap.oNode.angle - mEffDef.facingAngle + 180) % 360;
            if (targetRailAngle < 0) targetRailAngle += 360;

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

        // ジョイントの登録
        addGlobalJointIfFree(
            bestSnap.movedRail.customData.instanceId, bestSnap.mNode.nodeId,
            bestSnap.targetRail.customData.instanceId, bestSnap.oNode.nodeId
        );

        // 3. 届いた他ノードを多重ロック
        autoConnectNearbyNodes(movedRails, 8, 10);
    }

    // --- 4. 移動・スナップしたレールに含まれるフレキシブルレールのブリッジを更新 ---
    const hasLockedFlexible = lockedFlexibleIds.size > 0;
    if (!hasLockedFlexible) {
        updateFlexibleBridgesForRails(movedRails);
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

/**
 * 指定されたレール群に含まれるフレキシブルレールのブリッジを再構築するヘルパー関数
 * @param {Array} rails - 移動・変更されたFabricレールの配列
 */
function updateFlexibleBridgesForRails(rails) {
    if (!rails || rails.length === 0) return;

    // 重複を防ぐため Set で flexibleId を収集
    const targetFlexibleIds = new Set();
    rails.forEach(r => {
        if (r.customData && r.customData.flexibleId) {
            targetFlexibleIds.add(r.customData.flexibleId);
        }
    });

    if (targetFlexibleIds.size === 0) return;

    const allObjects = canvas.getObjects();
    targetFlexibleIds.forEach(fid => {
        const bridge = allObjects.find(o => o.customData && o.customData.flexibleId === fid && o.customData.railType === 'flexible_bridge');
        const start = allObjects.find(o => o.customData && o.customData.flexibleId === fid && o.customData.railType === 'flexible_start');
        const end = allObjects.find(o => o.customData && o.customData.flexibleId === fid && o.customData.railType === 'flexible_end');

        if (bridge && start && end) {
            rebuildFlexibleRailBridge(bridge, start, end);
        }
    });
}

// 変形ロック中のブリッジの初期状態を保持するマップ
const lockedBridgeStartStates = new Map();

/**
 * 変形ロック中の flexible_bridge の移動開始時状態を記録（mouse:down時）
 * @param {fabric.Object} target 選択されたターゲット（activeSelection含む）
 * @returns {void}
 */
function captureLockedBridgeDragStart(target) {
    if (!target) return;
    const items = (target.type === 'activeSelection') ? target.getObjects() : [target];

    // 変形ロック中の flexible_bridge のみを厳密に抽出
    const targetBridges = items.filter(r => {
        return r && r.customData && 
               r.customData.railType === 'flexible_bridge' && 
               r.customData.partOptions && 
               r.customData.partOptions.isLocked === true;
    });

    if (targetBridges.length === 0) return;

    // 各ブリッジおよび両端の仮想レールの初期状態を Map に記録
    targetBridges.forEach(bridge => {
        const flexibleId = bridge.customData.flexibleId;
        if (!flexibleId) {
            throw new Error("[captureLockedBridgeDragStart] flexible_bridge lacks flexibleId.");
        }

        const canvas = bridge.canvas;
        if (!canvas) {
            throw new TypeError("[captureLockedBridgeDragStart] Canvas reference missing on bridge.");
        }

        const allObjects = canvas.getObjects();
        const startRail = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_start');
        const endRail = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_end');

        if (!startRail) {
            throw new Error(`[captureLockedBridgeDragStart] Corresponding flexible_start rail not found for flexibleId: ${flexibleId}`);
        }
        if (!endRail) {
            throw new Error(`[captureLockedBridgeDragStart] Corresponding flexible_end rail not found for flexibleId: ${flexibleId}`);
        }

        const bridgeOpt = fabric.util.qrDecompose(bridge.calcTransformMatrix());
        const startOpt = fabric.util.qrDecompose(startRail.calcTransformMatrix());
        const endOpt = fabric.util.qrDecompose(endRail.calcTransformMatrix());

        lockedBridgeStartStates.set(flexibleId, {
            bridge: { x: bridgeOpt.translateX, y: bridgeOpt.translateY, angle: bridgeOpt.angle },
            start: { x: startOpt.translateX, y: startOpt.translateY, angle: startOpt.angle },
            end: { x: endOpt.translateX, y: endOpt.translateY, angle: endOpt.angle }
        });
    });
}

/**
 * 変形ロック時、中央の曲線部 (bridge) の位置・回転の変化（差分・公転）に合わせて、
 * 非表示の両端仮想レール (start, end) を形を崩さずに剛体として同期・追従させる
 * @param {fabric.Object} bridgePath 中央曲線オブジェクト
 * @returns {void}
 */
function syncLockedFlexibleParts(bridgePath) {
    if (!bridgePath || !bridgePath.canvas) {
        throw new TypeError("[syncLockedFlexibleParts] Invalid bridgePath or canvas is missing.");
    }

    const customData = bridgePath.customData;
    if (!customData || !customData.flexibleId) {
        throw new Error("[syncLockedFlexibleParts] bridgePath lacks customData.flexibleId.");
    }

    const flexibleId = customData.flexibleId;
    const startState = lockedBridgeStartStates.get(flexibleId);

    if (!startState) {
        throw new Error(`[syncLockedFlexibleParts] No drag start state recorded for flexibleId: ${flexibleId}`);
    }

    const canvas = bridgePath.canvas;
    const allObjects = canvas.getObjects();

    const startRail = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_start');
    const endRail = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_end');

    if (!startRail) {
        throw new Error(`[syncLockedFlexibleParts] Corresponding flexible_start rail not found for flexibleId: ${flexibleId}`);
    }
    if (!endRail) {
        throw new Error(`[syncLockedFlexibleParts] Corresponding flexible_end rail not found for flexibleId: ${flexibleId}`);
    }

    // 現在の bridge のワールド変換マトリックスを取得
    const currentOpt = fabric.util.qrDecompose(bridgePath.calcTransformMatrix());

    // 差分の算出
    const deltaAngle = currentOpt.angle - startState.bridge.angle;
    const rad = deltaAngle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // 基準となる bridge の初期中心座標
    const bx0 = startState.bridge.x;
    const by0 = startState.bridge.y;
    // 現在の bridge の中心座標
    const bx = currentOpt.translateX;
    const by = currentOpt.translateY;

    // --- startRail の同期計算（公転 ＋ 自転） ---
    const sx0 = startState.start.x;
    const sy0 = startState.start.y;
    const dsx = sx0 - bx0; // bridge初期中心から見た start の相対X
    const dsy = sy0 - by0; // bridge初期中心から見た start の相対Y

    // 回転を適用した相対位置 ＋ 現在の bridge 中心
    const newStartX = bx + (dsx * cos - dsy * sin);
    const newStartY = by + (dsx * sin + dsy * cos);
    const newStartAngle = startState.start.angle + deltaAngle;

    startRail.set({
        left: newStartX,
        top: newStartY,
        angle: newStartAngle
    });
    startRail.setCoords();

    // --- endRail の同期計算（公転 ＋ 自転） ---
    const ex0 = startState.end.x;
    const ey0 = startState.end.y;
    const dex = ex0 - bx0; // bridge初期中心から見た end の相対X
    const dey = ey0 - by0; // bridge初期中心から見た end の相対Y

    // 回転を適用した相対位置 ＋ 現在の bridge 中心
    const newEndX = bx + (dex * cos - dey * sin);
    const newEndY = by + (dex * sin + dey * cos);
    const newEndAngle = startState.end.angle + deltaAngle;

    endRail.set({
        left: newEndX,
        top: newEndY,
        angle: newEndAngle
    });
    endRail.setCoords();
}
