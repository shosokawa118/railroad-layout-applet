// =========================================================
// フェーズ1: 編集基本機能（Undo/Redo, Copy/Paste, File D&D）
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
 * @param {Object} action - { type: 'MOVE'|'ADD'|'DELETE', ... }
 */
function recordAction(action) {
    historyUndoStack.push(action);
    if (historyUndoStack.length > MAX_HISTORY) {
        historyUndoStack.shift();
    }
    historyRedoStack.length = 0; // 新規操作でRedoクリア
}

/**
 * Undo (操作を取り消す)
 */
function undoLayout() {
    if (historyUndoStack.length === 0) return;
    const action = historyUndoStack.pop();
    historyRedoStack.push(action);
    executeAction(action, true);
}

/**
 * Redo (操作をやり直す)
 */
function redoLayout() {
    if (historyRedoStack.length === 0) return;
    const action = historyRedoStack.pop();
    historyUndoStack.push(action);
    executeAction(action, false);
}

/**
 * アクションを実行（逆実行/順実行）する
 */
function executeAction(action, isUndo) {
    if (!canvas) return;
    canvas.discardActiveObject();

    switch (action.type) {
        case 'MOVE': {
            action.items.forEach(item => {
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
 * IDからFabricオブジェクトを検索
 */
function findRailByInstanceId(instanceId) {
    if (!canvas) return null;
    return canvas.getObjects().find(obj => obj && obj.customData && obj.customData.instanceId === instanceId);
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
// 3. クリップボード（Copy / Paste / Duplicate）
// =========================================================

/**
 * 選択中レールをOSクリップボードへJSONコピー
 */
async function copySelectedRails() {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    let targetRails = [];
    if (activeObject.type === 'activeSelection') {
        targetRails = activeObject.getObjects().filter(o => o && o.customData && o.customData.isRail);
    } else if (activeObject.customData && activeObject.customData.isRail) {
        targetRails = [activeObject];
    }

    if (targetRails.length === 0) return;

    const baseRail = targetRails[0];
    const baseX = baseRail.left;
    const baseY = baseRail.top;

    const exportData = {
        type: "RAIL_LAYOUT_CLIPBOARD",
        rails: targetRails.map(rail => ({
            partId: rail.customData.partId,
            offsetX: rail.left - baseX,
            offsetY: rail.top - baseY,
            angle: rail.angle
        }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    try {
        await navigator.clipboard.writeText(jsonString);
        console.log("クリップボードにJSONをコピーしました。");
    } catch (err) {
        clipboardDataMemory = exportData.rails;
        console.warn("API非対応のためメモリに保存しました。", err);
    }
}

/**
 * クリップボードから貼り付け
 */
async function pasteRails() {
    let railsToPaste = null;

    try {
        const text = await navigator.clipboard.readText();
        const parsed = JSON.parse(text);
        if (parsed && parsed.type === "RAIL_LAYOUT_CLIPBOARD" && Array.isArray(parsed.rails)) {
            railsToPaste = parsed.rails;
        }
    } catch (err) {
        if (clipboardDataMemory) {
            railsToPaste = clipboardDataMemory;
        }
    }

    if (!railsToPaste || railsToPaste.length === 0) return;

    canvas.discardActiveObject();
    const newAddedObjects = [];

    let targetBaseX = 250;
    let targetBaseY = 250;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.left !== undefined) {
        targetBaseX = activeObj.left + 20;
        targetBaseY = activeObj.top + 20;
    }

    const jointsBefore = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];

    for (const item of railsToPaste) {
        if (typeof addRailToCanvas === 'function') {
            const newObj = addRailToCanvas(item.partId, { skipAutoConnect: true, skipSelect: true });
            if (newObj) {
                newObj.set({
                    left: targetBaseX + item.offsetX,
                    top: targetBaseY + item.offsetY,
                    angle: item.angle
                });
                newObj.setCoords();
                newAddedObjects.push(newObj);
            }
        }
    }

    if (newAddedObjects.length > 0) {
        if (newAddedObjects.length === 1) {
            canvas.setActiveObject(newAddedObjects[0]);
        } else {
            const sel = new fabric.ActiveSelection(newAddedObjects, { canvas: canvas });
            canvas.setActiveObject(sel);
        }

        recordAction({
            type: 'ADD',
            rails: newAddedObjects.map(obj => ({
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

    if (typeof updateJointIndicators === 'function') updateJointIndicators();
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
// 4. ブラウザ画面内へのファイルドラッグ＆ドロップ
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
                            console.log("JSONファイルを読み込みました。");
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
