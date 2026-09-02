// =========================================================
// フェーズ1: 編集基本機能（Undo/Redo, Copy/Cut/Paste, File D&D）
// =========================================================

// --- 履歴（Undo/Redo）管理変数 ---
const historyUndoStack = [];
const historyRedoStack = [];
const MAX_HISTORY = 50;

// ドラッグ移動開始時の状態を保持するスタック
let dragStartStates = [];
let dragStartJoints = [];

// クリップボードフォールバック用メモリ
let clipboardDataMemory = null;

// =========================================================
// 1. 差分ログ（コマンド）管理ロジック
// =========================================================

/**
 * 履歴アクションを記録する
 * @param {Object} action - { type: 'MOVE'|'ADD'|'DELETE'|'CYCLE_NODE', ... }
 */
function recordAction(action) {
    // 操作直前の選択状態（instanceId一覧）を自動記録
    if (!action.selectionBefore && canvas) {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
            const selectedRails = (activeObj.type === 'activeSelection') ? activeObj.getObjects() : [activeObj];
            action.selectionBefore = selectedRails
                .filter(r => r && r.customData && r.customData.isRail)
                .map(r => r.customData.instanceId);
        } else {
            action.selectionBefore = [];
        }
    }

    historyUndoStack.push(action);
    if (historyUndoStack.length > MAX_HISTORY) {
        historyUndoStack.shift();
    }
    historyRedoStack.length = 0; // 新規操作でRedoクリア
    
    if (typeof updateUIState === 'function') updateUIState();
}

/**
 * Undo (操作を取り消す)
 */
function undoLayout() {
    if (historyUndoStack.length === 0) return;
    const action = historyUndoStack.pop();
    historyRedoStack.push(action);
    executeAction(action, true);
    if (typeof updateUIState === 'function') updateUIState();
}

/**
 * Redo (操作をやり直す)
 */
function redoLayout() {
    if (historyRedoStack.length === 0) return;
    const action = historyRedoStack.pop();
    historyUndoStack.push(action);
    executeAction(action, false);
    if (typeof updateUIState === 'function') updateUIState();
}

/**
 * アクションを実行（逆実行/順実行）する
 */
function executeAction(action, isUndo) {
    if (!canvas) return;
    canvas.discardActiveObject();

    switch (action.type) {
        case 'MOVE':
        case 'CYCLE_NODE': {
            const items = isUndo ? action.items : (action.itemsTo || action.items);
            items.forEach(item => {
                const railObj = findRailByInstanceId(item.instanceId);
                if (railObj) {
                    const targetState = isUndo ? item.from : item.to;
                    railObj.set({
                        left: targetState.x,
                        top: targetState.y,
                        angle: targetState.angle
                    });
                    railObj.setCoords();
                }
            });
            if (typeof globalJoints !== 'undefined') {
                globalJoints = isUndo ? [...action.jointsFrom] : [...action.jointsTo];
            }
            restoreSelection(action.items.map(i => i.instanceId));
            break;
        }

        case 'ADD': {
            if (isUndo) {
                action.rails.forEach(r => {
                    const obj = findRailByInstanceId(r.instanceId);
                    if (obj) canvas.remove(obj);
                });
                if (typeof globalJoints !== 'undefined' && action.jointsBefore) {
                    globalJoints = [...action.jointsBefore];
                }
                
                // 追加前の選択状態（＝直前に繋げていた先端レール）を自動復元
                if (action.selectionBefore && action.selectionBefore.length > 0) {
                    restoreSelection(action.selectionBefore);
                }
            } else {
                action.rails.forEach(r => {
                    if (typeof addRailToCanvas === 'function') {
                        const newObj = addRailToCanvas(r.partId, { skipAutoConnect: true, skipSelect: true });
                        if (newObj) {
                            newObj.customData.instanceId = r.instanceId;
                            newObj.set({ left: r.x, top: r.y, angle: r.angle });
                            newObj.setCoords();
                        }
                    }
                });
                if (typeof globalJoints !== 'undefined' && action.jointsAfter) {
                    globalJoints = [...action.jointsAfter];
                }
                restoreSelection(action.rails.map(r => r.instanceId));
            }
            break;
        }

        case 'DELETE': {
            if (isUndo) {
                action.rails.forEach(r => {
                    if (typeof addRailToCanvas === 'function') {
                        const newObj = addRailToCanvas(r.partId, { skipAutoConnect: true, skipSelect: true });
                        if (newObj) {
                            newObj.customData.instanceId = r.instanceId;
                            newObj.set({ left: r.x, top: r.y, angle: r.angle });
                            newObj.setCoords();
                        }
                    }
                });
                if (typeof globalJoints !== 'undefined' && action.jointsBefore) {
                    globalJoints = [...action.jointsBefore];
                }
                restoreSelection(action.rails.map(r => r.instanceId));
            } else {
                action.rails.forEach(r => {
                    const obj = findRailByInstanceId(r.instanceId);
                    if (obj) canvas.remove(obj);
                });
                if (typeof globalJoints !== 'undefined') {
                    const delIds = action.rails.map(r => r.instanceId);
                    globalJoints = globalJoints.filter(j => !delIds.includes(j.railA) && !delIds.includes(j.railB));
                }
            }
            break;
        }
    }

    if (typeof updateJointIndicators === 'function') updateJointIndicators();
    canvas.requestRenderAll();
}

/**
 * 指定されたinstanceId群のレールを選択状態にするヘルパー関数
 */
function restoreSelection(instanceIds) {
    if (!canvas || !instanceIds || instanceIds.length === 0) {
        return;
    }

    const targetObjects = instanceIds
        .map(id => findRailByInstanceId(id))
        .filter(obj => obj !== null && obj !== undefined);

    try {
        if (targetObjects.length === 1) {
            canvas.setActiveObject(targetObjects[0]);
        } else if (targetObjects.length > 1) {
            const sel = new fabric.ActiveSelection(targetObjects, { canvas: canvas });
            canvas.setActiveObject(sel);
        }
    } catch (err) {
        // 例外防止用ハンドラ
    }
}

/**
 * IDからFabricオブジェクトを検索
 */
function findRailByInstanceId(instanceId) {
    if (!canvas) return null;
    return canvas.getObjects().find(obj => obj && obj.customData && obj.customData.instanceId === instanceId);
}

/**
 * キャンバス上のすべてのレールを一括選択する
 */
function selectAllRails() {
    if (!canvas) return;

    const allRails = canvas.getObjects().filter(o => o && o.customData && o.customData.isRail);
    if (allRails.length === 0) return;

    canvas.discardActiveObject();

    if (allRails.length === 1) {
        canvas.setActiveObject(allRails[0]);
    } else {
        const sel = new fabric.ActiveSelection(allRails, { canvas: canvas });
        canvas.setActiveObject(sel);
    }

    canvas.requestRenderAll();
    if (typeof updateUIState === 'function') updateUIState();
}

/**
 * 現在選択中のレールからジョイントで繋がっている全パーツ（連結ネットワーク全体）を一括選択する
 */
function selectConnectedRails() {
    if (!canvas || typeof globalJoints === 'undefined') return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    let selectedRails = [];
    if (activeObj.type === 'activeSelection') {
        selectedRails = activeObj.getObjects().filter(o => o && o.customData && o.customData.isRail);
    } else if (activeObj.customData && activeObj.customData.isRail) {
        selectedRails = [activeObj];
    }

    if (selectedRails.length === 0) return;

    // 隣接リスト（グラフ）の構築
    const adjacencyList = new Map();
    globalJoints.forEach(joint => {
        const a = joint.railA;
        const b = joint.railB;
        if (!adjacencyList.has(a)) adjacencyList.set(a, []);
        if (!adjacencyList.has(b)) adjacencyList.set(b, []);
        adjacencyList.get(a).push(b);
        adjacencyList.get(b).push(a);
    });

    // 幅優先探索 (BFS) で接続されているすべてのレールIDを収集
    const visited = new Set();
    const queue = selectedRails.map(r => r.customData.instanceId);

    queue.forEach(id => visited.add(id));

    while (queue.length > 0) {
        const currentId = queue.shift();
        const neighbors = adjacencyList.get(currentId) || [];
        neighbors.forEach(neighborId => {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push(neighborId);
            }
        });
    }

    // 発見されたIDのオブジェクトを取得して一括選択
    const connectedObjects = Array.from(visited)
        .map(id => findRailByInstanceId(id))
        .filter(obj => obj !== null && obj !== undefined);

    if (connectedObjects.length === 0) return;

    canvas.discardActiveObject();

    if (connectedObjects.length === 1) {
        canvas.setActiveObject(connectedObjects[0]);
    } else {
        const sel = new fabric.ActiveSelection(connectedObjects, { canvas: canvas });
        canvas.setActiveObject(sel);
    }

    canvas.requestRenderAll();
    if (typeof updateUIState === 'function') updateUIState();
}

/**
 * UIの各ボタンや操作の有効/無効（グレーアウト）状態を一元更新する
 */
function updateUIState() {
    if (!canvas) return;

    const hasSelection = !!canvas.getActiveObject();
    const canUndo = historyUndoStack.length > 0;
    const canRedo = historyRedoStack.length > 0;
    const hasRails = canvas.getObjects().some(o => o && o.customData && o.customData.isRail);

    // 画面上部ボタン
    const btnUndo = document.getElementById('btnUndo');
    const btnCut = document.getElementById('btnCut');
    const btnCopy = document.getElementById('btnCopy');
    const btnDelete = document.getElementById('btnDelete');

    if (btnUndo) btnUndo.disabled = !canUndo;
    if (btnCut) btnCut.disabled = !hasSelection;
    if (btnCopy) btnCopy.disabled = !hasSelection;
    if (btnDelete) btnDelete.disabled = !hasSelection;

    // コンテキストメニュー側ボタン
    const menuSelectConnected = document.getElementById('menuSelectConnected');
    const menuSelectAll = document.getElementById('menuSelectAll');
    const menuUndo = document.getElementById('menuUndo');
    const menuRedo = document.getElementById('menuRedo');
    const menuCut = document.getElementById('menuCut');
    const menuCopy = document.getElementById('menuCopy');
    const menuDuplicate = document.getElementById('menuDuplicate');
    const menuDelete = document.getElementById('menuDelete');
    const menuOptions = document.getElementById('menuOptions');
    const activeObj = canvas ? canvas.getActiveObject() : null;
    const isSingleRailSelected = !!(activeObj && activeObj.type !== 'activeSelection' && activeObj.customData && activeObj.customData.isRail);

    if (menuSelectConnected) menuSelectConnected.disabled = !hasSelection;
    if (menuSelectAll) menuSelectAll.disabled = !hasRails;
    if (menuUndo) menuUndo.disabled = !canUndo;
    if (menuRedo) menuRedo.disabled = !canRedo;
    if (menuCut) menuCut.disabled = !hasSelection;
    if (menuCopy) menuCopy.disabled = !hasSelection;
    if (menuDuplicate) menuDuplicate.disabled = !hasSelection;
    if (menuDelete) menuDelete.disabled = !hasSelection;
    if (menuOptions) menuOptions.disabled = !isSingleRailSelected;

}


// =========================================================
// 2. ドラッグ移動（mouse:down / mouse:up）の記録フック
// =========================================================

/**
 * 移動開始時の状態を記録（mouse:down時）
 */
function captureDragStart(target) {
    if (!target) return;
    const rails = (target.type === 'activeSelection') ? target.getObjects() : [target];
    dragStartStates = rails.filter(r => r && r.customData && r.customData.isRail).map(r => ({
        instanceId: r.customData.instanceId,
        x: r.left,
        y: r.top,
        angle: r.angle
    }));
    dragStartJoints = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];
}

/**
 * 移動完了時の差分判定と記録（mouse:up時）
 */
function captureDragEnd(target) {
    if (!target || dragStartStates.length === 0) return;
    const rails = (target.type === 'activeSelection') ? target.getObjects() : [target];
    const targetRails = rails.filter(r => r && r.customData && r.customData.isRail);

    const dragEndStates = targetRails.map(r => ({
        instanceId: r.customData.instanceId,
        x: r.left,
        y: r.top,
        angle: r.angle
    }));

    // 位置・角度に変更があったか検証
    const hasMoved = dragStartStates.some((start) => {
        const end = dragEndStates.find(e => e.instanceId === start.instanceId);
        if (!end) return false;
        return start.x !== end.x || start.y !== end.y || start.angle !== end.angle;
    });

    if (hasMoved) {
        const moveItems = dragStartStates.map((start) => {
            const end = dragEndStates.find(e => e.instanceId === start.instanceId);
            return {
                instanceId: start.instanceId,
                from: { x: start.x, y: start.y, angle: start.angle },
                to: { x: end.x, y: end.y, angle: end.angle }
            };
        });

        recordAction({
            type: 'MOVE',
            items: moveItems,
            jointsFrom: dragStartJoints,
            jointsTo: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
        });
    }

    dragStartStates = [];
    dragStartJoints = [];
}


// =========================================================
// 3. クリップボード（Copy / Cut / Paste / Duplicate）
// =========================================================

/**
 * 選択中レールおよび関係するジョイント群をJSON形式でクリップボードへコピー
 */
async function copySelectedRails() {
    if (!canvas || typeof exportLayoutData !== 'function') return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    let targetRails = [];
    if (activeObject.type === 'activeSelection') {
        targetRails = activeObject.getObjects().filter(o => o && o.customData && o.customData.isRail);
    } else if (activeObject.customData && activeObject.customData.isRail) {
        targetRails = [activeObject];
    }

    if (targetRails.length === 0) return;

    // 全レイアウトデータを取得し、選択対象のみを抽出
    const fullData = exportLayoutData();
    if (!fullData) return;

    const selectedIds = targetRails.map(r => r.customData.instanceId);
    const baseRail = targetRails[0];
    const baseX = baseRail.left;
    const baseY = baseRail.top;

    const filteredRails = fullData.rails
        .filter(r => selectedIds.includes(r.instanceId))
        .map(r => ({
            ...r,
            offsetX: r.x - baseX,
            offsetY: r.y - baseY
        }));

    const filteredJoints = (fullData.joints || []).filter(j => 
        selectedIds.includes(j.railA) && selectedIds.includes(j.railB)
    );

    const exportData = {
        type: "RAIL_LAYOUT_CLIPBOARD",
        version: fullData.version,
        systems: fullData.systems,
        rails: filteredRails,
        joints: filteredJoints
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    try {
        await navigator.clipboard.writeText(jsonString);
    } catch (err) {
        clipboardDataMemory = exportData;
    }
}

/**
 * 選択中レールをコピーした上で削除する（切り取り）
 */
async function cutSelectedRails() {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // 1. クリップボードへコピー
    await copySelectedRails();

    // 2. 削除を実行（履歴記録は deleteSelectedRails 内で行われます）
    if (typeof deleteSelectedRails === 'function') {
        deleteSelectedRails();
    }
}

/**
 * クリップボードのデータを importLayoutData(..., false) で復元
 */
async function pasteRails() {
    if (typeof importLayoutData !== 'function') return;

    let clipboardData = null;

    try {
        const text = await navigator.clipboard.readText();
        const parsed = JSON.parse(text);
        if (parsed && parsed.type === "RAIL_LAYOUT_CLIPBOARD" && Array.isArray(parsed.rails)) {
            clipboardData = parsed;
        }
    } catch (err) {
        if (clipboardDataMemory) {
            clipboardData = clipboardDataMemory;
        }
    }

    if (!clipboardData || !clipboardData.rails || clipboardData.rails.length === 0) return;

    // 貼り付け先の基準オフセット位置を計算
    let targetBaseX = 250;
    let targetBaseY = 250;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.left !== undefined) {
        targetBaseX = activeObj.left + 20;
        targetBaseY = activeObj.top + 20;
    }

    const jointsBefore = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];
    const railsBeforeIds = canvas.getObjects()
        .filter(o => o && o.customData && o.customData.isRail)
        .map(o => o.customData.instanceId);

    // オフセット計算を実座標(x, y)に適用した一時データを作成
    const importPayload = {
        version: clipboardData.version,
        systems: clipboardData.systems,
        rails: clipboardData.rails.map(r => ({
            instanceId: r.instanceId,
            partId: r.partId,
            x: targetBaseX + (r.offsetX !== undefined ? r.offsetX : 0),
            y: targetBaseY + (r.offsetY !== undefined ? r.offsetY : 0),
            angle: r.angle
        })),
        joints: clipboardData.joints
    };

    // importLayoutDataの追加モード (isOverwrite = false) を呼び出して安全に復元
    await importLayoutData(importPayload, false);

    // 新規追加されたオブジェクト群の特定と選択状態・Undo履歴の登録
    const newlyAddedRails = canvas.getObjects().filter(o => 
        o && o.customData && o.customData.isRail && !railsBeforeIds.includes(o.customData.instanceId)
    );

    if (newlyAddedRails.length > 0) {
        restoreSelection(newlyAddedRails.map(o => o.customData.instanceId));

        recordAction({
            type: 'ADD',
            rails: newlyAddedRails.map(obj => ({
                instanceId: obj.customData.instanceId,
                partId: obj.customData.partId,
                x: obj.left,
                y: obj.top,
                angle: obj.angle
            })),
            jointsBefore: jointsBefore,
            jointsAfter: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
        });
    }

    canvas.requestRenderAll();
}

/**
 * 選択中レールの複製
 */
async function duplicateSelectedRails() {
    await copySelectedRails();
    await pasteRails();
}


// =========================================================
// 4. ノード接続の切り替え（[ / ] キー）
// =========================================================

/**
 * 選択中パーツの接続ノード番号を変更して回転・再配置する
 * @param {number} direction - +1 (アップ: [ ) または -1 (ダウン: ] )
 */
function cycleSelectedRailNode(direction) {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || !activeObj.customData || !activeObj.customData.isRail) return;

    const selfId = activeObj.customData.instanceId;
    const partId = activeObj.customData.partId;
    
    if (typeof globalJoints === 'undefined') return;

    // 1. 現在の接続ジョイントを検索
    const jointIndex = globalJoints.findIndex(j => j.railA === selfId || j.railB === selfId);
    if (jointIndex === -1) return;

    const joint = globalJoints[jointIndex];
    const isSelfA = joint.railA === selfId;
    const targetRailId = isSelfA ? joint.railB : joint.railA;
    
    const targetNodeId = isSelfA ? joint.nodeB : joint.nodeA;
    const selfNodeId = isSelfA ? joint.nodeA : joint.nodeB;

    const targetRailObj = findRailByInstanceId(targetRailId);
    if (!targetRailObj) return;

    // 2. カタログデータおよびノード定義の取得
    const catalogData = (typeof railCatalog !== 'undefined') ? railCatalog : (window.railCatalog || null);
    if (!catalogData || !catalogData.items) return;

    const selfCatalog = catalogData.items[partId];
    const targetCatalog = catalogData.items[targetRailObj.customData.partId];

    if (!selfCatalog || !targetCatalog || !selfCatalog.nodes || !targetCatalog.nodes) return;

    // 配列・オブジェクトどちらの型にも対応してノードリストを取得
    const isSelfArray = Array.isArray(selfCatalog.nodes);
    const selfNodesList = isSelfArray ? selfCatalog.nodes : Object.values(selfCatalog.nodes);
    if (selfNodesList.length <= 1) return;

    const isTargetArray = Array.isArray(targetCatalog.nodes);
    const targetNodesList = isTargetArray ? targetCatalog.nodes : Object.values(targetCatalog.nodes);

    const targetNodeDef = targetNodesList.find(n => String(n.id) === String(targetNodeId));
    if (!targetNodeDef) return;

    // 3. 次の接続可能ノードを探索（互換性がないノードはスキップ）
    const currentIdx = selfNodesList.findIndex(n => String(n.id) === String(selfNodeId));
    let baseIdx = currentIdx === -1 ? 0 : currentIdx;

    let nextIdx = baseIdx;
    let nextSelfNodeDef = null;

    for (let i = 0; i < selfNodesList.length; i++) {
        nextIdx = (nextIdx + direction) % selfNodesList.length;
        if (nextIdx < 0) nextIdx += selfNodesList.length;

        const candidateNode = selfNodesList[nextIdx];
        
        // canConnectNodes を用いて接続互換性を確認（親と子を正しく判定）
        const canConnect = (typeof canConnectNodes === 'function')
            ? (isSelfA 
                ? canConnectNodes(activeObj, candidateNode.id, targetRailObj, targetNodeId)
                : canConnectNodes(targetRailObj, targetNodeId, activeObj, candidateNode.id))
            : true;

        if (canConnect) {
            nextSelfNodeDef = candidateNode;
            break;
        }
    }

    if (!nextSelfNodeDef) return;

    // 4. 座標・角度計算
    const itemBefore = {
        instanceId: selfId,
        from: { x: activeObj.left, y: activeObj.top, angle: activeObj.angle }
    };
    const jointsBefore = JSON.parse(JSON.stringify(globalJoints));

    const targetWorldAngle = (targetRailObj.angle + targetNodeDef.facingAngle) % 360;
    const newSelfAngle = (targetWorldAngle + 180 - nextSelfNodeDef.facingAngle + 360) % 360;

    const targetNodeWorldPos = getAbsoluteNodePosition(targetRailObj, targetNodeDef);

    const selfGeoCX = activeObj.customData.geoCenterX || 0;
    const selfGeoCY = activeObj.customData.geoCenterY || 0;
    const selfLx = nextSelfNodeDef.relX - selfGeoCX;
    const selfLy = nextSelfNodeDef.relY - selfGeoCY;

    const selfNodeOffsetRotated = rotateVector(selfLx, selfLy, newSelfAngle);

    const newSelfX = targetNodeWorldPos.x - selfNodeOffsetRotated.x;
    const newSelfY = targetNodeWorldPos.y - selfNodeOffsetRotated.y;

    if (isNaN(newSelfX) || isNaN(newSelfY) || isNaN(newSelfAngle)) return;

    // 5. Fabricオブジェクトの更新
    activeObj.set({
        left: newSelfX,
        top: newSelfY,
        angle: newSelfAngle
    });
    activeObj.setCoords();

    // 6. 主対象ジョイントのノードIDを更新
    if (isSelfA) {
        globalJoints[jointIndex].nodeA = nextSelfNodeDef.id;
    } else {
        globalJoints[jointIndex].nodeB = nextSelfNodeDef.id;
    }

    // 7. 位置不整合ジョイントの削除 ＆ 接触した近傍ノードの自動結合
    if (typeof getAbsoluteNodePos === 'function' && typeof isNodePositionCompatible === 'function') {
        const currentSelfAbsNodes = getAbsoluteNodePos(activeObj);
        
        // A. 回転後に離れた不整合ジョイントを削除
        for (let i = globalJoints.length - 1; i >= 0; i--) {
            const j = globalJoints[i];
            if (j.railA !== selfId && j.railB !== selfId) continue;
            if (i === jointIndex) continue;

            const checkSelfIsA = (j.railA === selfId);
            const checkSelfNodeId = checkSelfIsA ? j.nodeA : j.nodeB;
            const checkOtherRailId = checkSelfIsA ? j.railB : j.railA;
            const checkOtherNodeId = checkSelfIsA ? j.nodeB : j.nodeA;

            const otherObj = findRailByInstanceId(checkOtherRailId);
            if (!otherObj) {
                globalJoints.splice(i, 1);
                continue;
            }

            const otherAbsNodes = getAbsoluteNodePos(otherObj);
            const selfNodeAbs = currentSelfAbsNodes.find(n => String(n.nodeId) === String(checkSelfNodeId));
            const otherNodeAbs = otherAbsNodes.find(n => String(n.nodeId) === String(checkOtherNodeId));

            if (!isNodePositionCompatible(selfNodeAbs, otherNodeAbs)) {
                globalJoints.splice(i, 1);
            }
        }

        // B. 回転後に新たに接触した近傍ノードの自動結合（共通関数呼出）
        if (typeof autoConnectNearbyNodes === 'function') {
            autoConnectNearbyNodes(activeObj, 8, 10);
        }
    }

    // 8. 履歴記録と表示更新
    itemBefore.to = { x: newSelfX, y: newSelfY, angle: newSelfAngle };
    if (typeof recordAction === 'function') {
        recordAction({
            type: 'CYCLE_NODE',
            selectedInstanceIds: [selfId], // Undo時の選択復元用IDを追加
            items: [itemBefore],
            jointsFrom: jointsBefore,
            jointsTo: JSON.parse(JSON.stringify(globalJoints))
        });
    }

    if (typeof updateJointIndicators === 'function') updateJointIndicators();
    canvas.requestRenderAll();
}

/**
 * ノードの絶対座標計算ヘルパー
 */
function getAbsoluteNodePosition(railObj, nodeDef) {
    const cx = railObj.customData ? (railObj.customData.geoCenterX || 0) : 0;
    const cy = railObj.customData ? (railObj.customData.geoCenterY || 0) : 0;
    
    const lx = nodeDef.relX - cx;
    const ly = nodeDef.relY - cy;
    
    const rotated = rotateVector(lx, ly, railObj.angle);
    return {
        x: railObj.left + rotated.x,
        y: railObj.top + rotated.y
    };
}

/**
 * 2Dベクトルの回転計算ヘルパー
 */
function rotateVector(x, y, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: x * Math.cos(rad) - y * Math.sin(rad),
        y: x * Math.sin(rad) + y * Math.cos(rad)
    };
}

// =========================================================
// 5. キーボードショートカットイベントの管理
// =========================================================
document.addEventListener('keydown', (e) => {
    // 入力フォーム等での操作時はショートカットを無効化
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    const isCtrl = e.ctrlKey || e.metaKey;

    // ノード番号の単体切替（ [ でアップ、] でダウン ）
    if (!isCtrl) {
        if (e.key === '[') {
            e.preventDefault();
            cycleSelectedRailNode(1);
            return;
        } else if (e.key === ']') {
            e.preventDefault();
            cycleSelectedRailNode(-1);
            return;
        }
    }

    if (isCtrl) {
        switch (e.key.toLowerCase()) {
            case ',': // Ctrl + , でノード補正ダイアログを開く
                e.preventDefault();
                if (typeof openNodeOffsetDialog === 'function') {
                    openNodeOffsetDialog();
                }
                break;
            case 'a':
                e.preventDefault();
                if (e.shiftKey) {
                    // Ctrl + Shift + A で接続レール全体を選択
                    selectConnectedRails();
                } else {
                    // Ctrl + A で画面上の全レールを選択
                    selectAllRails();
                }
                break;
            case 'z':
                e.preventDefault();
                undoLayout();
                break;
            case 'y':
                e.preventDefault();
                redoLayout();
                break;
            case 'x':
                e.preventDefault();
                cutSelectedRails();
                break;
            case 'c':
                e.preventDefault();
                copySelectedRails();
                break;
            case 'v':
                e.preventDefault();
                pasteRails();
                break;
            case 'd':
                e.preventDefault();
                duplicateSelectedRails();
                break;
        }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        // 履歴記録および削除処理は deleteSelectedRails() 側に一任します
        if (typeof deleteSelectedRails === 'function') deleteSelectedRails();
    }
});


// =========================================================
// 6. ブラウザ画面内へのファイルドラッグ＆ドロップ
// =========================================================

/**
 * ドロップエリアの設定
 * @param {HTMLElement} targetElement - ドロップを受け付ける要素
 */
function setupFileDropZone(targetElement) {
    if (!targetElement) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        targetElement.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    targetElement.addEventListener('drop', e => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.json') || file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = async function(event) {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        if (typeof importLayoutData === 'function') {
                            await importLayoutData(jsonData, true);
                        }
                    } catch (err) {
                        alert("JSONの読み込みに失敗しました。ファイル形式を確認してください。");
                    }
                };
                reader.readAsText(file);
            }
        }
    }, false);
}
