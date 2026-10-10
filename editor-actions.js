const APP_TITLE = 'Railroad Layout Applet';

/**
 * タイトルバー（<title>）の表示を更新する
 */
function updateTitleBar() {
    document.title = isDirty() ? `* ${APP_TITLE}` : APP_TITLE;
}

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

// 保存時の状態（Clean状態）を特定するための参照
let savedAction = null; // null は「初期状態（スタック空）で保存された」ことを意味する

/**
 * 現在の状態が「未保存（dirty）」かどうかを判定する
 * @returns {boolean}
 */
function isDirty() {
    const currentTopAction = historyUndoStack.length > 0 
        ? historyUndoStack[historyUndoStack.length - 1] 
        : null;
    return currentTopAction !== savedAction;
}

/**
 * 現在の状態を「保存済み（clean）」として記録する
 */
function markAsClean() {
    savedAction = historyUndoStack.length > 0 
        ? historyUndoStack[historyUndoStack.length - 1] 
        : null;
    
    updateUIState();
}

// ページ離脱時に未保存の変更があれば警告を表示
window.addEventListener('beforeunload', (e) => {
    if (!isDirty()) return;
    e.preventDefault();
    e.returnValue = '';
});

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
    
    updateUIState();
}

/**
 * Undo (操作を取り消す)
 */
function undoLayout() {
    if (historyUndoStack.length === 0) return;
    const action = historyUndoStack.pop();
    historyRedoStack.push(action);
    executeAction(action, true);
    updateUIState();
}

/**
 * Redo (操作をやり直す)
 */
function redoLayout() {
    if (historyRedoStack.length === 0) return;
    const action = historyRedoStack.pop();
    historyUndoStack.push(action);
    executeAction(action, false);
    updateUIState();
}

/**
 * アクションを実行（逆実行/順実行）する
 */
function executeAction(action, isUndo) {
    canvas.discardActiveObject();

    // 影響を受けたフレキシブルIDを収集するセット
    const affectedFlexibleIds = new Set();

    switch (action.type) {
        case 'MOVE':
        case 'CYCLE_NODE': {
            const items = isUndo ? action.items : (action.itemsTo || action.items);
            items.forEach(item => {
                const railObj = findRailByInstanceId(item.instanceId);
                if (!railObj) {
                    throw new TypeError(`executeAction [${action.type}]: instanceId "${item.instanceId}" のレールが見つかりません。`);
                }
                const targetState = isUndo ? item.from : item.to;
                railObj.set({
                    left: targetState.x,
                    top: targetState.y,
                    angle: targetState.angle
                });
                railObj.setCoords();

                if (railObj.customData && railObj.customData.flexibleId) {
                    affectedFlexibleIds.add(railObj.customData.flexibleId);
                }
            });

            if (typeof globalJoints !== 'undefined') {
                globalJoints = isUndo ? [...action.jointsBefore] : [...action.jointsAfter];
            }

            // 影響を受けたフレキシブルブリッジのみ再描画
            affectedFlexibleIds.forEach(flexId => {
                refreshFlexibleBridgeById(flexId);
            });

            restoreSelection(action.items.map(i => i.instanceId));
            break;
        }

        case 'RESIZE': {
            const item = isUndo ? action.items[0] : (action.itemsTo ? action.itemsTo[0] : action.items[0]);
            if (!item) {
                throw new TypeError("executeAction [RESIZE]: 処理対象のアイテムが存在しません。");
            }
            
            const railObj = findRailByInstanceId(item.instanceId);
            if (!railObj) {
                throw new TypeError(`executeAction [RESIZE]: instanceId "${item.instanceId}" のレールが見つかりません。`);
            }
            
            const targetState = isUndo ? item.from : item.to;
            railObj.set({
                left: targetState.x,
                top: targetState.y,
                angle: targetState.angle
            });
            
            if (targetState.partOptions) {
                railObj.customData.partOptions = JSON.parse(JSON.stringify(targetState.partOptions));
            }
            railObj.setCoords();

            const catalogItem = railCatalog.items[railObj.customData.partId];
            if (!catalogItem) {
                throw new TypeError(`executeAction [RESIZE]: partId "${railObj.customData.partId}" がカタログに見つかりません。`);
            }

            const railType = railObj.customData.railType;
            const isFlexibleComponent = railType === 'flexible_start' || railType === 'flexible_end';
            
            let renderCatalogItem = catalogItem;
            if (isFlexibleComponent) {
                renderCatalogItem = JSON.parse(JSON.stringify(catalogItem));
                renderCatalogItem.dynamicType = "variable-straight";
                renderCatalogItem.nodes = railObj.customData.nodes;
            }
            rebuildVariableRailPaths(railObj, renderCatalogItem);

            if (typeof globalJoints !== 'undefined') {
                globalJoints = isUndo ? [...action.jointsBefore] : [...action.jointsAfter];
            }

            if (railObj.customData && railObj.customData.flexibleId) {
                refreshFlexibleBridgeById(railObj.customData.flexibleId);
            }

            restoreSelection([item.instanceId]);
            break;
        }

        case 'ADD': {
            if (isUndo) {
                // ADD の Undo: 追加されたレール群（関連フレキシブルパーツ含む）を削除
                removeRailsFromCanvas(action.rails);

                if (typeof globalJoints !== 'undefined' && action.jointsBefore) {
                    globalJoints = [...action.jointsBefore];
                }
                
                // 追加前の選択状態の自動復元
                if (action.selectionBefore && action.selectionBefore.length > 0) {
                    restoreSelection(action.selectionBefore);
                }
            } else {
                // ADD の Redo: レール群をキャンバスへ復元生成
                restoreRailsToCanvas(action.rails);

                if (typeof globalJoints !== 'undefined' && action.jointsAfter) {
                    globalJoints = [...action.jointsAfter];
                }
                restoreSelection(action.rails.map(r => r.instanceId));
            }
            break;
        }

        case 'DELETE': {
            if (isUndo) {
                // DELETE の Undo: 削除されたレール群をキャンバスへ復元生成
                restoreRailsToCanvas(action.rails);

                if (typeof globalJoints !== 'undefined' && action.jointsBefore) {
                    globalJoints = [...action.jointsBefore];
                }
                restoreSelection(action.rails.map(r => r.instanceId));
            } else {
                // DELETE の Redo: レール群（関連フレキシブルパーツ含む）を削除
                removeRailsFromCanvas(action.rails);

                if (typeof globalJoints !== 'undefined') {
                    const delIds = action.rails.map(r => r.instanceId);
                    globalJoints = globalJoints.filter(j => !delIds.includes(j.railA) && !delIds.includes(j.railB));
                }
            }
            break;
        }
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

/**
 * 指定された flexibleId に紐づくフレキシブルブリッジの再描画
 */
function refreshFlexibleBridgeById(flexibleId) {
    if (!flexibleId) {
        throw new TypeError("refreshFlexibleBridgeById: flexibleId が指定されていません。");
    }
    if (!canvas) {
        throw new TypeError("refreshFlexibleBridgeById: canvas が存在しません。");
    }

    const allObjs = canvas.getObjects();
    const startRail = allObjs.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_start');
    const endRail = allObjs.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_end');
    const bridgeObj = allObjs.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_bridge');

    if (bridgeObj) {
        if (!startRail) {
            throw new TypeError(`refreshFlexibleBridgeById: flexibleId "${flexibleId}" の flexible_start が見つかりません。`);
        }
        if (!endRail) {
            throw new TypeError(`refreshFlexibleBridgeById: flexibleId "${flexibleId}" の flexible_end が見つかりません。`);
        }
        rebuildFlexibleRailBridge(bridgeObj, startRail, endRail);
    }
}

/**
 * 履歴データに基づき通常レールおよびフレキシブルレールをキャンバスへ復元生成する共通関数
 */
function restoreRailsToCanvas(rails) {
    const standardRails = [];
    const flexibleMap = new Map();

    // 通常のレールとフレキシブルレールの構成パーツの分離
    rails.forEach(r => {
        if (r.flexibleId) {
            if (!flexibleMap.has(r.flexibleId)) {
                flexibleMap.set(r.flexibleId, []);
            }
            flexibleMap.get(r.flexibleId).push(r);
        } else {
            standardRails.push(r);
        }
    });

    // 1. 通常レールの復元
    standardRails.forEach(r => {
        const addResult = addRailToCanvas(r.partId, { skipAutoConnect: true, skipSelect: true });
        if (addResult) {
            const newObjects = Array.isArray(addResult) ? addResult : [addResult];

            newObjects.forEach(newObj => {
                newObj.customData.instanceId = r.instanceId;
                newObj.set({ left: r.x, top: r.y, angle: r.angle });
                
                if (r.customData.partOptions && typeof r.customData.partOptions === 'object') {
                    newObj.customData.partOptions = JSON.parse(JSON.stringify(r.customData.partOptions));
                }
                
                newObj.setCoords();
            });
        }
    });

    // 2. フレキシブルレールの復元（flexibleId単位の一括生成と中央曲線部の再計算）
    flexibleMap.forEach((parts, fid) => {
        const startData = parts.find(p => p.railType === 'flexible_start') || parts[0];
        const endData = parts.find(p => p.railType === 'flexible_end') || parts[1];

        // 履歴データからの有効なパーツID（partId）の取得
        const validPartObj = parts.find(p => p.partId && p.partId !== 'flexible_bridge');
        const catalogPartId = validPartObj ? validPartObj.partId : (startData ? startData.partId : undefined);

        if (!catalogPartId) {
            throw new TypeError(`flexibleRail復元エラー: flexibleId "${fid}" に対応する有効な partId が存在しません。`);
        }

        // start および end の partOptions を付与して3点セットを生成
        const addOptions = { 
            skipAutoConnect: true, 
            skipSelect: true,
            startPartOptions: startData.partOptions,
            endPartOptions: endData.partOptions
        };

        const addResult = addRailToCanvas(catalogPartId, addOptions);

        if (addResult) {
            const newObjects = Array.isArray(addResult) ? addResult : [addResult];

            const startObj = newObjects.find(o => o.customData && o.customData.railType === 'flexible_start');
            const endObj = newObjects.find(o => o.customData && o.customData.railType === 'flexible_end');
            const bridgeObj = newObjects.find(o => o.customData && o.customData.railType === 'flexible_bridge');

            newObjects.forEach(o => {
                if (o.customData) {
                    o.customData.flexibleId = fid;
                }
            });

            // start端の位置・角度・プロパティの復元
            if (startObj && startData) {
                if (startData.instanceId) startObj.customData.instanceId = startData.instanceId;
                startObj.set({ left: startData.x, top: startData.y, angle: startData.angle });
                if (startData.partOptions && typeof startData.partOptions === 'object') {
                    startObj.customData.partOptions = JSON.parse(JSON.stringify(startData.partOptions));
                }
                startObj.setCoords();
            }

            // end端の位置・角度・プロパティの復元および個別設定
            if (endObj && endData) {
                if (endData.instanceId) endObj.customData.instanceId = endData.instanceId;
                endObj.set({ left: endData.x, top: endData.y, angle: endData.angle });
                if (endData.partOptions && typeof endData.partOptions === 'object') {
                    endObj.customData.partOptions = JSON.parse(JSON.stringify(endData.partOptions));
                }
                endObj.setCoords();
            }

            // 中央曲線部 (bridge) のベジェ曲線の再計算・反映（end側の長さ変更を反映するため最後に実行）
            if (bridgeObj && startObj && endObj) {
                rebuildFlexibleRailBridge(bridgeObj, startObj, endObj);
            }
        }
    });
}

/**
 * キャンバスからの対象レール群および関連フレキシブルレールパーツの削除共通関数
 */
function removeRailsFromCanvas(rails) {
    if (!canvas) return;

    const targetInstanceIds = new Set();
    const flexibleIds = new Set();

    // 1. 引数の rails 配列から instanceId および flexibleId を抽出
    rails.forEach(r => {
        if (r.instanceId) targetInstanceIds.add(r.instanceId);
        if (r.flexibleId) flexibleIds.add(r.flexibleId);
        if (r.partOptions && r.partOptions.flexibleId) flexibleIds.add(r.partOptions.flexibleId);
    });

    const allCanvasObjects = canvas.getObjects();

    // 2. キャンバス上に存在する対象オブジェクトの customData から flexibleId を検索・補完抽出
    allCanvasObjects.forEach(obj => {
        if (!obj || !obj.customData) return;

        if (obj.customData.instanceId && targetInstanceIds.has(obj.customData.instanceId)) {
            if (obj.customData.flexibleId) {
                flexibleIds.add(obj.customData.flexibleId);
            }
        }
    });

    // 3. targetInstanceIds または flexibleIds に一致するキャンバス上の全オブジェクトを抽出
    const objectsToRemove = new Set();

    allCanvasObjects.forEach(obj => {
        if (!obj || !obj.customData) return;

        // instanceId による判定
        if (obj.customData.instanceId && targetInstanceIds.has(obj.customData.instanceId)) {
            objectsToRemove.add(obj);
        }

        // flexibleId による判定（関連する start, end, bridge の一括抽出）
        if (obj.customData.flexibleId && flexibleIds.has(obj.customData.flexibleId)) {
            objectsToRemove.add(obj);
        }
    });

    // 4. 抽出された全オブジェクトをキャンバスから一括削除
    objectsToRemove.forEach(obj => canvas.remove(obj));
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
    updateUIState();
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
    updateUIState();
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

    // タイトルバーの未保存（*）表示を連動更新
    updateTitleBar();
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
    const targetRails = rails.filter(r => r && r.customData && r.customData.isRail);

    if (targetRails.length === 0) {
        dragStartStates = [];
        dragStartJoints = [];
        return;
    }

    // キャンバス上の絶対座標を記録
    dragStartStates = targetRails.map(r => {
        // activeSelection 内でも正しい絶対位置を取得
        const matrix = r.calcTransformMatrix();
        const options = fabric.util.qrDecompose(matrix);

        return {
            instanceId: r.customData.instanceId,
            x: Math.round(options.translateX * 100) / 100,
            y: Math.round(options.translateY * 100) / 100,
            angle: Math.round(options.angle * 100) / 100
        };
    });

    dragStartJoints = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];
}

/**
 * 移動完了時の差分判定と記録（mouse:up時）
 */
function captureDragEnd(target) {
    if (!target || !dragStartStates || dragStartStates.length === 0) return;
    
    const rails = (target.type === 'activeSelection') ? target.getObjects() : [target];
    const targetRails = rails.filter(r => r && r.customData && r.customData.isRail);

    // 変形操作が行われていた場合はMOVEの記録を除外し、ここで _resizeBefore を片付ける
    const isResizingAction = targetRails.some(r => r && r._resizeBefore);
    if (isResizingAction) {
        targetRails.forEach(r => {
            if (r._resizeBefore) delete r._resizeBefore;
        });
        dragStartStates = [];
        dragStartJoints = [];
        return;
    }

    // キャンバス上の絶対座標を取得
    const dragEndStates = targetRails.map(r => {
        const matrix = r.calcTransformMatrix();
        const options = fabric.util.qrDecompose(matrix);

        return {
            instanceId: r.customData.instanceId,
            x: Math.round(options.translateX * 100) / 100,
            y: Math.round(options.translateY * 100) / 100,
            angle: Math.round(options.angle * 100) / 100
        };
    });

    // 位置・角度に変更があったか検証 (0.01px 以上の差分で比較)
    const hasMoved = dragStartStates.some((start) => {
        const end = dragEndStates.find(e => e.instanceId === start.instanceId);
        if (!end) return false;
        
        return Math.abs(start.x - end.x) > 0.01 ||
               Math.abs(start.y - end.y) > 0.01 ||
               Math.abs(start.angle - end.angle) > 0.01;
    });

    // ジョイント状態に変更があったか検証
    const currentJoints = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];
    const isJointChanged = JSON.stringify(dragStartJoints) !== JSON.stringify(currentJoints);

    // 位置変更、またはジョイント変更のいずれかがあれば記録
    if (hasMoved || isJointChanged) {
        const moveItems = dragStartStates.map((start) => {
            const end = dragEndStates.find(e => e.instanceId === start.instanceId);
            const finalTo = end ? { x: end.x, y: end.y, angle: end.angle } : { x: start.x, y: start.y, angle: start.angle };
            return {
                instanceId: start.instanceId,
                from: { x: start.x, y: start.y, angle: start.angle },
                to: finalTo
            };
        });

        recordAction({
            type: 'MOVE',
            items: moveItems,
            jointsBefore: dragStartJoints,
            jointsAfter: currentJoints
        });
    }

    dragStartStates = [];
    dragStartJoints = [];
}


// =========================================================
// 3. クリップボード（Copy / Cut / Paste / Duplicate）
// =========================================================

/*
 * 選択中レールをコピーした上で削除する（切り取り）
 */
async function cutSelectedRails() {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // 1. クリップボードへコピー
    await copySelectedRails();

    // 2. 削除を実行（履歴記録は deleteSelectedRails 内で行われます）
    deleteSelectedRails();
}

/**
 * 選択中レールおよび関係するジョイント群をJSON形式でクリップボードへコピー
 * フレキシブルレールのパーツが含まれる場合は事前に3点セット全体へ選択を拡張してコピー
 */
async function copySelectedRails() {
    if (!canvas) return;

    let activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // 選択対象にフレキシブルレールが含まれている場合、コピー前に3点セット選択へ拡張
    expandFlexibleRailSelection(activeObject, canvas);

    // 拡張後に最新のアクティブオブジェクトを取得し直す
    activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    let targetRails = [];
    if (activeObject.type === 'activeSelection') {
        // フレキシブル構成パーツを含めて選択対象を抽出
        targetRails = activeObject.getObjects().filter(o => o && o.customData && (o.customData.isRail || o.customData.flexibleId));
    } else if (activeObject.customData && (activeObject.customData.isRail || activeObject.customData.flexibleId)) {
        targetRails = [activeObject];
    }

    if (targetRails.length === 0) return;

    // 全レイアウトデータを取得し、選択対象のみを抽出
    const fullData = exportLayoutData();
    if (!fullData) return;

    // 選択オブジェクトからの instanceId および flexibleId の初期抽出
    const initialSelectedIds = targetRails.map(r => r.customData ? r.customData.instanceId : null).filter(Boolean);
    const selectedFlexibleIds = new Set();

    targetRails.forEach(r => {
        const flexId = r.customData.flexibleId;
        if (flexId) {
            selectedFlexibleIds.add(flexId);
        }
    });

    // fullData 内の関連する全フレキシブルパーツへの selectedIds の拡張
    const selectedIds = [...initialSelectedIds];
    if (selectedFlexibleIds.size > 0 && fullData && Array.isArray(fullData.rails)) {
        fullData.rails.forEach(r => {
            const flexId = r.flexibleId;
            if (flexId && selectedFlexibleIds.has(flexId) && !selectedIds.includes(r.instanceId)) {
                selectedIds.push(r.instanceId);
            }
        });
    }

    // 基準レールの絶対座標取得
    const baseRail = targetRails[0];
    const baseTransform = getRailAbsoluteTransform(baseRail);
    const baseX = baseTransform.left;
    const baseY = baseTransform.top;

    console.log('[DEBUG-COPY] 基準レールの絶対座標:', { instanceId: baseRail.customData?.instanceId, baseX, baseY });

    // 中央曲線部 (flexible_bridge) を除外してコピー対象のレールを抽出
    const filteredRails = fullData.rails
        .filter(r => {
            if (!selectedIds.includes(r.instanceId)) return false;
            const rType = r.railType || (r.partOptions ? r.partOptions.railType : null);
            const pId = r.partId;
            return rType !== 'flexible_bridge' && pId !== 'flexible_bridge';
        })
        .map(r => {
            // キャンバス上の実オブジェクトから絶対座標を直接算出してオフセット計算
            const targetObj = canvas.getObjects().find(o => o.customData?.instanceId === r.instanceId);
            let absX = r.x;
            let absY = r.y;
            if (targetObj) {
                const tf = getRailAbsoluteTransform(targetObj);
                absX = tf.left;
                absY = tf.top;
            }

            return {
                ...JSON.parse(JSON.stringify(r)), // 配下の拡張データを含むすべてのプロパティを丸ごと透過ディープコピー
                x: absX,
                y: absY,
                offsetX: absX - baseX,
                offsetY: absY - baseY
            };
        });

    console.log('[DEBUG-COPY] クリップボード用抽出レール一覧:', filteredRails);

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
 * クリップボードのデータを importLayoutData(..., false) で復元
 */
async function pasteRails() {
    console.log('[DEBUG-PASTE] --- pasteRails 開始 ---');

    let clipboardData = null;

    try {
        const text = await navigator.clipboard.readText();
        console.log('[DEBUG-PASTE] クリップボードテキスト:', text);
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.rails)) {
            clipboardData = parsed;
        }
    } catch (err) {
        console.warn('[DEBUG-PASTE] クリップボード読み込み失敗、メモリ参照を試みます:', err);
        clipboardData = clipboardDataMemory;
    }

    console.log('[DEBUG-PASTE] 解析済み clipboardData:', clipboardData);

    if (!clipboardData || !clipboardData.rails || clipboardData.rails.length === 0) {
        console.warn('[DEBUG-PASTE] 貼り付け対象のデータが空です');
        return;
    }

    let targetBaseX = 250;
    let targetBaseY = 250;
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
        const activeTransform = getRailAbsoluteTransform(activeObj);
        targetBaseX = activeTransform.left + 20;
        targetBaseY = activeTransform.top + 20;
    }

    console.log('[DEBUG-PASTE] 貼り付け基準絶対座標:', { targetBaseX, targetBaseY });

    const jointsBefore = [...globalJoints];
    
    // 貼り付け前のキャンバス上オブジェクト ID 一覧の取得
    const railsBeforeIds = canvas.getObjects()
        .filter(o => o && o.customData && (o.customData.isRail || o.customData.partOptions?.flexibleId))
        .map(o => o.customData.instanceId)
        .filter(Boolean);

    // フレキシブルレールの ID 衝突防止用再採番マップ
    const flexibleIdMap = new Map();
    const preparedRails = [];

    // クリップボードデータからのオフセット計算およびフレキシブルIDの再採番
    clipboardData.rails.forEach(r => {
        const { offsetX, offsetY, ...restData } = r;
        const newX = targetBaseX + (offsetX !== undefined ? offsetX : 0);
        const newY = targetBaseY + (offsetY !== undefined ? offsetY : 0);

        const origFlexibleId = r.partOptions ? r.partOptions.flexibleId : null;

        if (origFlexibleId) {
            if (!flexibleIdMap.has(origFlexibleId)) {
                flexibleIdMap.set(origFlexibleId, 'flex_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
            }
            const newFlexId = flexibleIdMap.get(origFlexibleId);

            // flexible_start / flexible_end ともに除外せず import 用配列へ追加
            preparedRails.push({
                ...restData,
                x: newX,
                y: newY,
                partOptions: {
                    ...restData.partOptions,
                    flexibleId: newFlexId
                }
            });
        } else {
            preparedRails.push({
                ...restData,
                x: newX,
                y: newY
            });
        }
    });

    const importPayload = {
        version: clipboardData.version,
        systems: clipboardData.systems,
        rails: preparedRails,
        joints: clipboardData.joints
    };

    console.log('[DEBUG-PASTE] importLayoutData に渡す Payload:', importPayload);

    // importLayoutData 内で位置、オプション、ブリッジ生成まですべて完了する
    await importLayoutData(importPayload, false);

    // 貼り付け処理によって新規追加されたオブジェクトの抽出
    const newlyAddedRails = canvas.getObjects().filter(o => 
        o && o.customData && (o.customData.isRail || o.customData.partOptions?.flexibleId) && !railsBeforeIds.includes(o.customData.instanceId)
    );

    // 各レールの移動・更新完了に伴うジョイント表示の再描画
    updateJointIndicators();

    if (newlyAddedRails.length > 0) {
        restoreSelection(newlyAddedRails.map(o => o.customData.instanceId).filter(Boolean));

        // 履歴記録対象からの中央曲線部 (flexible_bridge) の除外処理
        const recordRails = newlyAddedRails.filter(o => {
            const rType = o.customData?.railType || o.customData?.partOptions?.railType;
            const pId = o.customData?.partId || o.customData?.partOptions?.partId;
            return rType !== 'flexible_bridge' && pId !== 'flexible_bridge';
        });

        const actionRails = [];
        recordRails.forEach((obj) => {
            const railData = {
                instanceId: obj.customData.instanceId,
                partId: obj.customData.partId || obj.customData.partOptions?.partId,
                railType: obj.customData.railType || obj.customData.partOptions?.railType,
                flexibleId: obj.customData.flexibleId || obj.customData.partOptions?.flexibleId,
                x: obj.left,
                y: obj.top,
                angle: obj.angle || 0
            };

            if (obj.customData.partOptions && typeof obj.customData.partOptions === 'object') {
                railData.partOptions = JSON.parse(JSON.stringify(obj.customData.partOptions));
            }

            actionRails.push(railData);
        });

        recordAction({
            type: 'ADD',
            rails: actionRails,
            jointsBefore: jointsBefore,
            jointsAfter: [...globalJoints]
        });
    }

    canvas.requestRenderAll();
    console.log('[DEBUG-PASTE] --- pasteRails 終了 ---');
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
        const canConnect = isSelfA 
            ? canConnectNodes(activeObj, candidateNode.id, targetRailObj, targetNodeId)
            : canConnectNodes(targetRailObj, targetNodeId, activeObj, candidateNode.id);

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
    autoConnectNearbyNodes(activeObj, 8, 10);

    // 8. 履歴記録と表示更新
    itemBefore.to = { x: newSelfX, y: newSelfY, angle: newSelfAngle };
    recordAction({
        type: 'CYCLE_NODE',
        selectedInstanceIds: [selfId], // Undo時の選択復元用IDを追加
        items: [itemBefore],
        jointsBefore: jointsBefore,
        jointsAfter: JSON.parse(JSON.stringify(globalJoints))
    });

    updateJointIndicators();
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
            case 's':
                e.preventDefault();
                exportLayoutToFile();
                break;
            case 'o':
                e.preventDefault();
                importLayoutFromFile();
                break;
            case ',': // Ctrl + , でノード補正ダイアログを開く
                e.preventDefault();
                openNodeOffsetDialog();
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
        deleteSelectedRails();
    }
});

// =========================================================
// 6. ファイル入出力
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
                        await importLayoutData(jsonData, true);
                    } catch (err) {
                        alert("JSONの読み込みに失敗しました。ファイル形式を確認してください。");
                    }
                };
                reader.readAsText(file);
            }
        }
    }, false);
}

/**
 * レイアウトデータをJSONファイルとしてダウンロード保存する
 */
function exportLayoutToFile() {
    if (typeof exportLayoutData !== 'function') {
        console.error('exportLayoutData 関数が見つかりません');
        return;
    }
    const layoutData = exportLayoutData();
    if (!layoutData || !Array.isArray(layoutData.rails) || layoutData.rails.length === 0) {
        alert('保存するレイアウトデータがありません。');
        return;
    }

    const jsonString = JSON.stringify(layoutData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const timeStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `railroad-layout-${timeStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // ===== 保存完了後に Clean 状態として記録 =====
    markAsClean();
}

/**
 * ファイル選択ダイアログを開き、JSONファイルを読み込んでレイアウトを復元する
 */
function importLayoutFromFile() {
    if (typeof importLayoutData !== 'function') {
        console.error('importLayoutData 関数が見つかりません');
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';

    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target.result;
                const parsed = JSON.parse(text);

                if (!parsed || !Array.isArray(parsed.rails)) {
                    alert('無効なレイアウトデータファイルです。（railsデータが見つかりません）');
                    return;
                }

                // ファイル読み込み時は上書き (isOverwrite = true) で実行
                await importLayoutData(parsed, true);
                console.log('ファイルからの読み込みが完了しました');

            } catch (err) {
                console.error('JSON解析エラー:', err);
                alert('ファイルの読み込みに失敗しました。正しいJSONファイルかご確認ください。');
            }
        };

        reader.readAsText(file);
    };

    fileInput.click();
}


/**
 * フレキシブルレールのいずれかのパーツが選択された際、残りのパーツも含めた
 * 3点セット（startRail - bridgePath - endRail）へと選択状態を自動的に拡張する
 * 
 * @param {fabric.Object} target - 現在操作・選択されたFabricオブジェクト
 * @param {fabric.Canvas} canvas - 対象のFabricキャンバス
 */
let isSelectingExtension_dummy_flag = false; // 無限再帰防止用の処理中フラグ

function expandFlexibleRailSelection(target, canvas) {
    // 必須パラメータの欠落時はフォールバックせず TypeError を発生させる
    if (!canvas || !target) {
        throw new TypeError("expandFlexibleRailSelection: canvas または target が不正です。");
    }

    // 処理中フラグによる無限ループ（無限再帰）の防止ガードです
    if (isSelectingExtension_dummy_flag) return;

    const customData = target.customData;
    if (!customData || !customData.flexibleId) return;

    const targetFlexibleId = customData.flexibleId;

    try {
        isSelectingExtension_dummy_flag = true;

        const activeObj = canvas.getActiveObject();
        const allObjects = canvas.getObjects();
        const groupParts = allObjects.filter(obj => 
            obj && obj.customData && obj.customData.flexibleId === targetFlexibleId
        );

        if (groupParts.length === 3) {
            const currentSelected = (activeObj && activeObj.type === 'activeSelection') 
                ? activeObj.getObjects() 
                : [activeObj];

            const isAllSelected = groupParts.every(part => currentSelected.includes(part));

            if (!isAllSelected) {
                canvas.discardActiveObject();
                const sel = new fabric.ActiveSelection(groupParts, { canvas: canvas });
                canvas.setActiveObject(sel);
                canvas.requestRenderAll();
            }
        }
    } finally {
        isSelectingExtension_dummy_flag = false;
    }
}
