// =============================================================================
// EXTERNAL FUNCTION INDEX & DELEGATION MAP (API SPECIFICATION)
// DO NOT RE-IMPLEMENT OR DUPLICATE FUNCTIONS LISTED BELOW IN THIS FILE.
// =============================================================================

/**
 * [layout-geometry.js] - 幾何計算・座標系・システム互換性判定
 * 
 * - generateGenericRailData(catalogItem: Object): { basePaths: Array, railPaths: Array, centerX: number, centerY: number }
 *   レール型番のカタログデータからFabric描画用パスデータと幾何中心座標を生成。
 * 
 * - getAbsoluteNodePos(rail: fabric.Object): Array<{ nodeId: number, x: number, y: number, angle: number }>
 *   Fabricオブジェクトの現在位置・回転角から、各接続ノードのキャンバス絶対座標および絶対対向角を算出。
 * 
 * - canConnectNodes(railA: fabric.Object, nodeAId: number, railB: fabric.Object, nodeBId: number): boolean
 *   2つのレールオブジェクトとそのノードIDを受け取り、内部でノードデータとカタログ（`railCatalog.items`）を取り出して
 *   `isJointCompatible(nodeA, catalogA, nodeB, catalogB)` へ委譲。系統・ジョイナー・システムの互換性を判定する。
 * 
 * - getMovedRailIds(target: fabric.Object): Array<string>
 *   アクティブセレクションまたは単一操作対象のレールインスタンスID配列を取得。
 */

/**
 * [layout-state.js] - グローバル状態管理・ジョイント接続データ
 * 
 * - globalJoints: Array<{ railA: string, nodeA: number, railB: string, nodeB: number }>
 *   全キャンバス上の接続状態を保持するグローバル配列。
 * 
 * - addGlobalJointIfFree(railAId: string, nodeAId: number, railBId: string, nodeBId: number): boolean
 *   指定ノード間が未接続（空き）であればグローバル接続情報として登録。
 * 
 * - isNodeOccupied(railId: string, nodeId: number): boolean
 *   指定したレールのノードが既に他のレールと接続済みか判定。
 * 
 * - detachMovedRailJoints(target: fabric.Object): void
 *   ドラッグ等の移動操作対象となったレールに紐づくすべてのジョイントを解除。
 */

/**
 * [snap-manager.js] - スナップ吸着 & クラスタ一括移動制御
 * 
 * - applyClusterSnapLogic(movedRail: fabric.Object): void
 *   移動終了時に周辺ノードとの近接判定、角度合わせ、マルチロック（剛体群スナップ）を一括実行。
 * 
 * - exportLayoutJSON(): void
 *   レイアウト構造体をJSON文字列化してクリップボードにコピー。
 */

// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン
// バージョン: VER-LAYOUT-SIDE-SNAP-E34
// =============================================================

// --- 共通設定・フラグ定義 ---
const ENGINE_VERSION = "VER-LAYOUT-SIDE-SNAP-E34";

// ジョイントインジケータの表示モード ('all' | 'rail-end' | 'none')
// デフォルト: 'rail-end' (レールエンドのみ表示)
let jointDisplayMode = 'rail-end';

/**
 * ジョイント表示モードを変更し、キャンバスを再描画する
 * @param {string} mode - 'all', 'rail-end', 'none'
 */
function setJointDisplayMode(mode) {
    jointDisplayMode = mode;
    updateJointIndicators();
    if (canvas) {
        canvas.requestRenderAll();
    }
}

console.log(`基本エンジン（JS）が読み込まれました: ${ENGINE_VERSION}`);

let lastCanvasClickPos = null;
let isDraggingRail = false;
let globalEventsRegistered = false;

// NOTE: canConnectNodes is delegated to layout-geometry.js

// --- ライブラリ動的ローダー ---
const loadedLibraries = new Set();
const loadingPromises = {};

function loadSystemLibrary(systemId) {
    if (!railCatalog || !railCatalog.systems) return Promise.reject("railCatalogが定義されていません");
    const system = railCatalog.systems[systemId];
    if (!system) {
        console.warn(`[${ENGINE_VERSION}] 未定義のシステムIDです: ${systemId}`);
        return Promise.resolve();
    }

    const fileName = system.libraryFile;
    if (!fileName || loadedLibraries.has(fileName)) return Promise.resolve();
    if (loadingPromises[fileName]) return loadingPromises[fileName];

    loadingPromises[fileName] = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = fileName;
        script.async = true;

        script.onload = () => {
            loadedLibraries.add(fileName);
            delete loadingPromises[fileName];
            console.log(`[${ENGINE_VERSION}] ライブラリロード完了: ${fileName}`);
            resolve();
        };

        script.onerror = () => {
            delete loadingPromises[fileName];
            console.error(`[${ENGINE_VERSION}] ライブラリ読み込み失敗: ${fileName}`);
            resolve();
        };

        document.head.appendChild(script);
    });

    return loadingPromises[fileName];
}

function configureControls(fabricObj) {
    if (!fabricObj) return;

    fabricObj.set({
        hasControls: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true
    });

    fabricObj.setControlsVisibility({
        tl: false, tr: false, br: false, bl: false,
        ml: false, mt: false, mr: false, mb: false,
        mtr: true
    });

    if (fabricObj.type === 'activeSelection') {
        const mtrControl = fabricObj.controls.mtr;
        fabricObj.controls = { mtr: mtrControl };
    }
}

/**
 * Finds the optimal open target node on the parent rail for auto-connecting a newly added rail.
 * 
 * DESIGN INTENT & NODE PRIORITY RULES:
 * - Filter by `jointType === 'rail-end'` to ensure side/accessory joiners are ignored.
 * - Parent node evaluation: DESCENDING order (Max Node ID -> ... -> Node 0).
 * - Highest Node ID represents the primary exit (highest priority).
 * - Node 0 represents the entry side (lowest priority).
 *
 * @param {Object} parentRail - The fabric object of the currently selected parent rail.
 * @returns {number|null} The node ID to attach to, or null if no open 'rail-end' nodes exist.
 */
function findTargetNodeForAutoConnect(parentRail) {
    if (!parentRail || !parentRail.customData) return null;
    const catalog = railCatalog.items[parentRail.customData.partId];
    if (!catalog || !catalog.nodes || catalog.nodes.length === 0) return null;

    const railId = parentRail.customData.instanceId;
    
    // 1. 'rail-end' タイプのノード（標準端点）のみを抽出
    const endNodes = catalog.nodes.filter(n => (n.jointType || 'rail-end') === 'rail-end');

    // 2. 親ノードの探索順序：降順（最大値 -> ... -> 0）にソート
    endNodes.sort((a, b) => b.id - a.id);

    // 3. 優先順位（最大ID順）に従って空きノードを返却
    for (let node of endNodes) {
        if (!isNodeOccupied(railId, node.id)) return node.id;
    }

    return null;
}

/**
 * Align and auto-connect a newly spawned rail to an existing parent rail's node.
 * 
 * @param {fabric.Object} newRail 
 * @param {fabric.Object} parentRail 
 * @param {number} parentNodeId 
 * @returns {boolean} True if successfully connected; false if compatibility check failed or nodes missing.
 */
function alignRailToParentNode(newRail, parentRail, parentNodeId) {
    const parentNodes = getAbsoluteNodePos(parentRail);
    const parentNode = parentNodes.find(n => n.nodeId === parentNodeId);
    if (!parentNode) return false;

    const newCatalog = railCatalog.items[newRail.customData.partId];
    if (!newCatalog || !newCatalog.nodes || newCatalog.nodes.length === 0) return false;

    const newRailNodes = newCatalog.nodes;
    
    // 1. 接続互換性のあるノードのみを昇順（Node 0優先）で探索（'rail-end' 優先）
    const sortedNewNodes = [...newRailNodes].sort((a, b) => a.id - b.id);
    const targetNewNode = sortedNewNodes.find(n => (n.jointType || 'rail-end') === 'rail-end' && canConnectNodes(parentRail, parentNodeId, newRail, n.id)) 
                        || sortedNewNodes.find(n => canConnectNodes(parentRail, parentNodeId, newRail, n.id));

    // 互換性のあるノードが存在しない（異システムやカント逆相接続等）場合は接続せずに失敗を返す
    if (!targetNewNode) {
        console.warn(`[${ENGINE_VERSION}] 互換性のある接続ノードが見つからないため、オートコネクトをキャンセルしました。`);
        return false;
    }

    const newCx = newRail.customData.geoCenterX || 0;
    const newCy = newRail.customData.geoCenterY || 0;

    const targetAngle = (parentNode.angle + 180 - targetNewNode.facingAngle + 360) % 360;
    newRail.set({ angle: targetAngle });

    const lx = targetNewNode.relX - newCx;
    const ly = targetNewNode.relY - newCy;
    const rad = (targetAngle * Math.PI) / 180;

    const newLeft = parentNode.x - (lx * Math.cos(rad) - ly * Math.sin(rad));
    const newTop  = parentNode.y - (lx * Math.sin(rad) + ly * Math.cos(rad));

    newRail.set({ left: newLeft, top: newTop });
    newRail.setCoords();

    // 主接続ノードを結合登録
    addGlobalJointIfFree(
        parentRail.customData.instanceId, parentNodeId,
        newRail.customData.instanceId, targetNewNode.id
    );

    // 複線等の場合、同時にピッタリ合わさる全ノードペアを一括ロック
    const allRails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);
    const newId = newRail.customData.instanceId;
    const updatedNewNodes = getAbsoluteNodePos(newRail);

    allRails.forEach(otherRail => {
        if (!otherRail || !otherRail.customData) return;
        const otherId = otherRail.customData.instanceId;
        if (otherId === newId) return;

        const otherNodes = getAbsoluteNodePos(otherRail);

        updatedNewNodes.forEach(nNode => {
            if (isNodeOccupied(newId, nNode.nodeId)) return;

            otherNodes.forEach(oNode => {
                if (isNodeOccupied(otherId, oNode.nodeId)) return;
                if (!canConnectNodes(newRail, nNode.nodeId, otherRail, oNode.nodeId)) return;

                const dist = Math.sqrt(Math.pow(nNode.x - oNode.x, 2) + Math.pow(nNode.y - oNode.y, 2));
                
                // 角度差（対向チェック: 180度反転差がほぼ0か）を計算
                let angleDiff = Math.abs((nNode.angle - oNode.angle + 540) % 360 - 180);
                if (angleDiff > 180) angleDiff = 360 - angleDiff;

                // 距離判定だけでなく facingAngle（対向角）も適合しているか検証
                if (dist < 8 && angleDiff < 5) {
                    addGlobalJointIfFree(newId, nNode.nodeId, otherId, oNode.nodeId);
                }
            });
        });
    });

    return true;
}

function registerGlobalCanvasEvents() {
    if (globalEventsRegistered || !canvas) return;
    globalEventsRegistered = true;

    canvas.on('object:moving', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });

    canvas.on('object:rotating', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });
    
    canvas.on('mouse:up', () => {
        if (isDraggingRail) {
            isDraggingRail = false;
            const activeObj = canvas.getActiveObject();
            if (activeObj && typeof applyClusterSnapLogic === 'function') {
                applyClusterSnapLogic(activeObj);
            }
        }
    });

    const handleSelection = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            configureControls(activeObject);
            canvas.requestRenderAll();
        }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
}

function addRailToCanvas(partId, options = {}) {
    if (!canvas) return null;

    const catalogItem = railCatalog.items[partId];
    if (!catalogItem) {
        console.error(`[${ENGINE_VERSION}] 該当パーツが見つかりません (partId: "${partId}")`);
        return null;
    }

    const currentId = `rail-${railCount++}`;
    const geoData = generateGenericRailData(catalogItem);

    const baseObjects = geoData.basePaths.map(pStr => new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' }));
    const railObjects = geoData.railPaths.map(pStr => new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' }));

    const railObject = new fabric.Group([...baseObjects, ...railObjects], {
        left: 0, top: 0, originX: 'center', originY: 'center', angle: 0
    });

    configureControls(railObject);

    railObject.customData = { 
        instanceId: currentId, 
        partId: partId, 
        isRail: true,
        geoCenterX: geoData.centerX,
        geoCenterY: geoData.centerY
    };

    if (!options.skipAutoConnect) {
        const activeObj = canvas.getActiveObject();
        const parentRail = (activeObj && activeObj.customData && activeObj.customData.isRail) ? activeObj : null;
        const targetNodeId = parentRail ? findTargetNodeForAutoConnect(parentRail) : null;

        let autoConnected = false;
        if (parentRail && targetNodeId !== null) {
            autoConnected = alignRailToParentNode(railObject, parentRail, targetNodeId);
        }

        // オートコネクト未実施または接続不可（異システム等）の場合の配置フォールバック
        if (!autoConnected) {
            if (parentRail) {
                // 接続失敗時：選択中（親）レールの近傍（オフセット位置）に落とす
                railObject.set({ 
                    left: parentRail.left + 30, 
                    top: parentRail.top + 30, 
                    angle: parentRail.angle 
                });
                railObject.setCoords();
            } else if (lastCanvasClickPos) {
                railObject.set({ left: lastCanvasClickPos.x, top: lastCanvasClickPos.y, angle: 0 });
                railObject.setCoords();
            } else {
                railObject.set({ left: 250 + (railCount % 5) * 25, top: 450 + (railCount % 5) * 25, angle: 0 });
                railObject.setCoords();
            }
        }
    }

    canvas.add(railObject);
    
    railObject.on('moving', function() { isDraggingRail = true; onGeneralTransform(this); });
    railObject.on('rotating', function() { isDraggingRail = true; onGeneralTransform(this); });

    registerGlobalCanvasEvents();

    if (!options.skipSelect) {
        canvas.setActiveObject(railObject);
    }

    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();
    
    return railObject;
}

function deleteSelectedRails() {
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

    const targetIds = targetRails.map(r => r.customData.instanceId);

    globalJoints = globalJoints.filter(j => 
        j && !targetIds.includes(j.railA) && !targetIds.includes(j.railB)
    );

    targetRails.forEach(r => canvas.remove(r));
    canvas.discardActiveObject();

    updateJointIndicators();
    canvas.requestRenderAll();
}

function exportLayoutData() {
    if (!canvas) return null;

    const rails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);
    const systemSet = new Set();
    const railList = [];

    rails.forEach((rail) => {
        const partId = rail.customData ? rail.customData.partId : null;
        const catalogItem = (railCatalog && railCatalog.items) ? railCatalog.items[partId] : null;

        if (catalogItem && catalogItem.systemId) {
            systemSet.add(catalogItem.systemId);
        }

        railList.push({
            instanceId: rail.customData.instanceId,
            partId: partId,
            x: Math.round(rail.left * 100) / 100,
            y: Math.round(rail.top * 100) / 100,
            angle: Math.round(rail.angle * 100) / 100
        });
    });

    return {
        version: ENGINE_VERSION,
        systems: Array.from(systemSet),
        rails: railList,
        joints: globalJoints.map(j => ({
            railA: j.railA,
            nodeA: j.nodeA,
            railB: j.railB,
            nodeB: j.nodeB
        }))
    };
}

async function importLayoutData(layoutData, isOverwrite = true) {
    if (!canvas) return;
    if (!layoutData || !Array.isArray(layoutData.rails)) {
        console.error(`[${ENGINE_VERSION}] 読み込みデータのフォーマットが不正です。`, layoutData);
        return;
    }

    if (Array.isArray(layoutData.systems) && layoutData.systems.length > 0) {
        console.log(`[${ENGINE_VERSION}] 必要ライブラリの事前読み込み中:`, layoutData.systems);
        const loadTasks = layoutData.systems.map(sysId => loadSystemLibrary(sysId));
        await Promise.all(loadTasks);
    }

    if (isOverwrite) {
        canvas.clear();
        globalJoints = [];
        railCount = 0;
    }

    const createdObjects = [];
    const idToInstanceMap = {};
    const instanceMap = {};

    layoutData.rails.forEach((r, idx) => {
        if (!r || !r.partId) {
            console.warn(`[${ENGINE_VERSION}] レール定義不備 (Index: ${idx})`);
            return;
        }
        
        const newObj = addRailToCanvas(r.partId, { skipAutoConnect: true, skipSelect: true });
        if (newObj) {
            newObj.set({ left: r.x, top: r.y, angle: r.angle });
            newObj.setCoords();
            createdObjects.push(newObj);
            
            const realId = newObj.customData.instanceId;
            instanceMap[realId] = newObj;

            if (r.instanceId) {
                idToInstanceMap[r.instanceId] = realId;
            }
        }
    });

    if (Array.isArray(layoutData.joints)) {
        layoutData.joints.forEach((j, idx) => {
            if (!j) return;
            
            let railAId = null;
            let railBId = null;

            if (typeof j.railA === 'number') {
                railAId = createdObjects[j.railA]?.customData.instanceId;
            } else if (typeof j.railA === 'string') {
                railAId = idToInstanceMap[j.railA] || j.railA;
            }

            if (typeof j.railB === 'number') {
                railBId = createdObjects[j.railB]?.customData.instanceId;
            } else if (typeof j.railB === 'string') {
                railBId = idToInstanceMap[j.railB] || j.railB;
            }

            const railObjA = instanceMap[railAId];
            const railObjB = instanceMap[railBId];

            if (!railObjA || !railObjB) {
                console.warn(`[${ENGINE_VERSION}] ジョイント接続対象のレールが見つかりません (Joint Index: ${idx})`);
                return;
            }

            const absoluteNodesA = getAbsoluteNodePos(railObjA);
            const absoluteNodesB = getAbsoluteNodePos(railObjB);

            const nodeAData = absoluteNodesA.find(n => n.nodeId === j.nodeA);
            const nodeBData = absoluteNodesB.find(n => n.nodeId === j.nodeB);

            if (!nodeAData || !nodeBData) {
                console.warn(`[${ENGINE_VERSION}] ジョイント接続対象のノードが存在しません (Joint Index: ${idx})`);
                return;
            }

            const dist = Math.sqrt(Math.pow(nodeAData.x - nodeBData.x, 2) + Math.pow(nodeAData.y - nodeBData.y, 2));
            const maxAllowedDist = 8;

            if (dist > maxAllowedDist) {
                console.warn(`[${ENGINE_VERSION}] ジョイント接続対象が離れすぎています (Joint Index: ${idx}, 距離: ${dist.toFixed(2)}px > 許容: ${maxAllowedDist}px)`);
                return;
            }

            addGlobalJointIfFree(railAId, j.nodeA, railBId, j.nodeB);
        });
    }

    canvas.discardActiveObject();
    updateJointIndicators();
    canvas.requestRenderAll();
}

function onGeneralTransform(target) {
    if (!target) return;
    detachMovedRailJoints(target);
    updateJointIndicators();
}

function updateJointIndicators() {
    if (!canvas) return;
    
    // 既存のインジケータをクリア
    const oldIndicators = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => canvas.remove(obj));

    // 全非表示モードの場合は描画処理自体をスキップして終了
    if (jointDisplayMode === 'none') {
        return;
    }

    const rails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    rails.forEach(rail => {
        if (!rail || !rail.customData) return;
        const railId = rail.customData.instanceId;
        const catalogItem = railCatalog.items[rail.customData.partId];
        const absoluteNodes = getAbsoluteNodePos(rail);

        absoluteNodes.forEach(node => {
            if (!node) return;

            // ジョイントタイプの取得 (デフォルト: 'rail-end')
            const catalogNode = catalogItem ? catalogItem.nodes.find(n => n.id === node.nodeId) : null;
            const jointType = (catalogNode && catalogNode.jointType) ? catalogNode.jointType : 'rail-end';

            // レールエンドのみ表示モードの場合、'rail-end' 以外の描画をスキップ
            if (jointDisplayMode === 'rail-end' && jointType !== 'rail-end') {
                return;
            }

            const isOccupied = isNodeOccupied(railId, node.nodeId);

            const dot = new fabric.Circle({
                left: node.x, top: node.y, radius: 4,
                fill: isOccupied ? '#7cd21d' : '#ff3b30',
                stroke: '#ffffff', strokeWidth: 1, originX: 'center', originY: 'center',
                selectable: false, evented: false, customData: { isIndicator: true }
            });

            // facingAngleの向きを示す視覚化ライン（長距離12pxの細い赤/緑の線）
            const lineLen = 12;
            const rad = (node.angle * Math.PI) / 180;
            const line = new fabric.Line([
                node.x, 
                node.y, 
                node.x + lineLen * Math.cos(rad), 
                node.y + lineLen * Math.sin(rad)
            ], {
                stroke: isOccupied ? '#7cd21d' : '#ff3b30',
                strokeWidth: 1.5,
                selectable: false,
                evented: false,
                customData: { isIndicator: true }
            });

            canvas.add(dot);
            canvas.add(line);
            canvas.bringToFront(dot);
            canvas.bringToFront(line);
        });
    });
}

async function loadDebugSampleLayout() {
    if (typeof INITIAL_SAMPLE_LAYOUT === 'undefined') {
        console.error(`[${ENGINE_VERSION}] INITIAL_SAMPLE_LAYOUT が読み込まれていません。`);
        return;
    }
    await importLayoutData(INITIAL_SAMPLE_LAYOUT, true);
    if (canvas) {
        canvas.setZoom(0.35);
        canvas.setViewportTransform([0.35, 0, 0, 0.35, 250, 100]);
    }
}
