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
 * - isNodePositionCompatible(nodeA: Object, nodeB: Object, maxDist?: number, maxAngleError?: number): boolean
 *   2つの絶対座標ノードの距離および向き（対向角）が許容値以内にあるか（近接して噛み合っているか）判定する。
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
// バージョン: VER-LAYOUT-FACING-E4
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

    // 裏で設定を保存
    saveUserSetting('jointDisplaySelect', mode);

    updateJointIndicators();
    canvas.requestRenderAll();
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

/**
 * コントロールハンドルの設定
 * @param {Object} fabricObj - Fabricオブジェクト
 */
function configureControls(fabricObj) {
    if (!fabricObj) return;

//    // フレキシブルレール本体 (flexible_bridge) の場合はコントロールを非表示にして手動変形を禁止する
//    if (fabricObj.customData && fabricObj.customData.railType === 'flexible_bridge') {
//        fabricObj.set({
//            hasControls: false,
//            lockScalingX: true,
//            lockScalingY: true
//        });
//        return;
//    }

    // 複数選択（activeSelection）の場合は一律で伸縮不可とする
    const isSelection = fabricObj.type === 'activeSelection';

    // カタログ定義オブジェクトを安全に参照する
    const catalogItem = (
        fabricObj.customData && 
        fabricObj.customData.partId && 
        railCatalog && 
        railCatalog.items
    ) ? railCatalog.items[fabricObj.customData.partId] : null;

    const railType = fabricObj.customData ? fabricObj.customData.railType : null;

    // 単一オブジェクトかつ可変長レール（variable-straight）または仮想レール端部（flexible_start/end）かどうかの判定（必ずboolean値にする）
    const isVariable = !isSelection && !!(
        (catalogItem && catalogItem.dynamicType === 'variable-straight') ||
        railType === 'flexible_start' ||
        railType === 'flexible_end'
    );

    fabricObj.set({
        hasControls: true,
        lockScalingX: !isVariable, // 可変長レール（単体）のみX軸スケーリング許可
        lockScalingY: true,
        lockUniScaling: true
    });

    fabricObj.setControlsVisibility({
        tl: false, 
        tr: false, 
        br: false, 
        bl: false,
        ml: isVariable, // 可変長レール（単体）のみ左右ハンドルを表示
        mt: false, 
        mr: isVariable, 
        mb: false,
        mtr: true
    });

    if (isSelection) {
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

    // --- 修正箇所: getEffectiveNodeDef を使用 ---
    const targetEffDef = getEffectiveNodeDef(newRail, targetNewNode);

    const targetAngle = (parentNode.angle + 180 - targetEffDef.facingAngle + 360) % 360;
    newRail.set({ angle: targetAngle });

    const lx = targetEffDef.relX - newCx;
    const ly = targetEffDef.relY - newCy;
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

                if (isNodePositionCompatible(nNode, oNode, 8, 5)) {
                    addGlobalJointIfFree(newId, nNode.nodeId, otherId, oNode.nodeId);
                }
            });
        });
    });

    return true;
}

/**
 * イベント登録
 */
function registerGlobalCanvasEvents() {
    if (globalEventsRegistered || !canvas) return;
    globalEventsRegistered = true;

    // --- 操作開始時の状態保持 ---
    canvas.on('mouse:down', (options) => {
        if (options && options.target) {
            captureDragStart(options.target);
            captureLockedBridgeDragStart(options.target);
        }
    });

    canvas.on('object:moving', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });

    canvas.on('object:rotating', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });

    // 変形開始前（固定端の記憶 ＆ 操作側の即時接続解除と色更新）
    canvas.on('before:transform', (options) => {
        if (!options || !options.transform) return;
        const target = options.transform.target;
        const action = options.transform.action;
        const corner = options.transform.corner;

        // 可変長レールの伸縮操作が始まる直前
        if (target && target.customData && (action === 'scale' || action === 'scaleX') && (corner === 'ml' || corner === 'mr')) {
            target.setCoords();
            
            // 1. 操作していない側の端（固定端）の座標を記録
            const fixedOriginX = (corner === 'mr') ? 'left' : 'right';
            target.customData.fixedPoint = target.getPointByOrigin(fixedOriginX, 'center');

            // 2. 移動・変形対象レールのジョイント情報を削除（切断）
            detachMovedRailJoints(target);

            // 3. ジョイント表示インジケータ（色・マーク）を更新
            updateJointIndicators();
            canvas.requestRenderAll();
        }
    });

    // 変形中（リアルタイム座標・スケール制御）
    canvas.on('object:scaling', (options) => {
        const target = options.target;
        if (target && target.customData && !target._resizeBefore) {
            // 変形開始時の初期状態を一度だけ保持
            target._resizeBefore = {
                x: target.left,
                y: target.top,
                angle: target.angle,
                partOptions: target.customData.partOptions ? JSON.parse(JSON.stringify(target.customData.partOptions)) : {},
                joints: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
            };
        }
        handleVariableRailScaling(options);
    });

    // 変形終了（最終確定とパス再生成）
    canvas.on('object:modified', (options) => {
        if (!options || !options.target) return;
        const target = options.target;
        const action = options.action; 
        const corner = options.transform ? options.transform.corner : null; 

        if ((action === 'scale' || action === 'scaleX') && (corner === 'ml' || corner === 'mr')) {
            handleVariableRailResizeEnd(target, corner);
        }
    });

    canvas.on('mouse:up', () => {
        const activeObj = canvas.getActiveObject();

        if (isDraggingRail) {
            isDraggingRail = false;
            applyClusterSnapLogic(activeObj);
        }

        // --- スナップ完了後・差分記録前に文字の向きを自動調整 ---
        if (activeObj) {
            updateRailTextOrientation(activeObj);
            canvas.requestRenderAll();
        }

        // --- 移動終了・スナップ完了後の差分記録 ---
        if (activeObj) {
            captureDragEnd(activeObj);
        }
    });

    // 選択イベント発生時の制御（単一のstart/end選択時は変形を許可し、範囲選択やbridge選択時のみ3点セットへ拡張します）
    const handleSelection = () => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;

        const customData = activeObject.customData;

        // 変形ロック状態（isLocked）の場合は、いかなる場合も3点セットへの選択拡張を行わない
        const isLocked = customData && customData.partOptions && customData.partOptions.isLocked;

        if (!isLocked) {
            if (activeObject.type === 'activeSelection') {
                // 範囲選択内にフレキシブルレール要素が含まれる場合は3点セット選択へ拡張
                const selectedObjects = activeObject.getObjects();
                const hasFlexible = selectedObjects.some(obj => obj && obj.customData && obj.customData.flexibleId);
                if (hasFlexible) {
                    expandFlexibleRailSelection(activeObject, canvas);
                }
            } else if (customData && customData.flexibleId) {
                // ブリッジ本体（flexible_bridge）が単一選択された場合のみ3点セット選択へ拡張
                if (customData.railType === 'flexible_bridge') {
                    expandFlexibleRailSelection(activeObject, canvas);
                }
                // flexible_start / flexible_end の単一選択時は拡張を行わない
            }
        }

        const currentActive = canvas.getActiveObject();
        if (currentActive) {
            configureControls(currentActive);
            canvas.requestRenderAll();
        }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
}

/**
 * 可変長レールの変形中リアルタイム制御
 */
function handleVariableRailScaling(e) {
    const target = e.target;
    if (!target || !target.customData || !e.transform) return;

    const rawCatalog = railCatalog.items[target.customData.partId];
    if (!rawCatalog) return;

    const railType = target.customData.railType;
    const isFlexibleComponent = railType === 'flexible_start' || railType === 'flexible_end';

    // カタログ取得およびフレキシブル端部の疑似カタログ置換
    let effectiveCatalogItem = rawCatalog;
    if (isFlexibleComponent) {
        if (typeof rawCatalog.maxLength !== 'number') {
            throw new TypeError(`catalogItem.maxLength is missing or not a number for flexible rail: ${target.customData.partId}`);
        }
        effectiveCatalogItem = {
            ...rawCatalog,
            dynamicType: 'variable-straight',
            minLength: 10,
            maxLength: rawCatalog.maxLength * (4/3/3.141592)
        };
    }

    // 対象タイプチェック
    if (effectiveCatalogItem.dynamicType !== 'variable-straight') return;

    const corner = e.transform.corner;
    if (corner !== 'ml' && corner !== 'mr') return;

    // 変形開始時の固定端座標が存在しない場合は処理しない
    const fixedPoint = target.customData.fixedPoint;
    if (!fixedPoint) return;

    // 上下限の取得（未定義時は処理しない）
    const minL = effectiveCatalogItem.minLength;
    const maxL = effectiveCatalogItem.maxLength;
    if (typeof minL !== 'number' || typeof maxL !== 'number') {
        throw new TypeError(`minLength or maxLength is missing in catalogItem for variable-straight rail: ${target.customData.partId}`);
    }

    // 基準長
    const baseLength = (target.customData.partOptions && typeof target.customData.partOptions.length === 'number')
        ? target.customData.partOptions.length
        : effectiveCatalogItem.defaultLength;
    if (typeof baseLength !== 'number') return;

    // 現在のマウスドラッグによる予測長さ
    const currentScaleX = Math.max(0.001, target.scaleX || 1);
    const rawLength = baseLength * currentScaleX;

    // 長さを上下限の範囲に制限（クランプ）
    const clampedLength = Math.max(minL, Math.min(maxL, rawLength));
    const clampedScaleX = clampedLength / baseLength;

    // 記憶しておいた「固定端」から、現在のクランプ後長さに合わせた新しい中心座標を計算
    const rad = ((target.angle || 0) * Math.PI) / 180;
    const halfLen = clampedLength / 2;
    const isRightHandle = (corner === 'mr');
    const centerVectorSign = isRightHandle ? 1 : -1;

    const newCenterX = fixedPoint.x + (halfLen * centerVectorSign) * Math.cos(rad);
    const newCenterY = fixedPoint.y + (halfLen * centerVectorSign) * Math.sin(rad);

    // Fabric.js の変形挙動を上書きして固定
    target.set({
        scaleX: clampedScaleX,
        scaleY: 1,
        flipX: false,
        flipY: false,
        originX: 'center',
        originY: 'center',
        left: newCenterX,
        top: newCenterY
    });

    target.setCoords();
}

/**
 * 可変長レールの伸縮完了時処理
 * @param {Object} rail - Fabricオブジェクト
 * @param {string} corner - 操作されたハンドル ('ml' または 'mr')
 */
function handleVariableRailResizeEnd(rail, corner) {
    if (!rail || !rail.customData) return;
    
    const catalogItem = railCatalog.items[rail.customData.partId];
    if (!catalogItem) return;

    const railType = rail.customData.railType;
    const isFlexibleComponent = railType === 'flexible_start' || railType === 'flexible_end';
    
    if (catalogItem.dynamicType !== 'variable-straight' && !isFlexibleComponent) return;

    // カタログから上下限を取得
    const minL = catalogItem.minLength || 1;
    const maxL = catalogItem.maxLength || 1000;

    // 基準長の取得
    const baseLength = (rail.customData.partOptions && typeof rail.customData.partOptions.length === 'number')
        ? rail.customData.partOptions.length
        : catalogItem.defaultLength;

    if (typeof baseLength !== 'number') return;

    // 変形開始時に記録した固定端座標の取得
    const fixedPoint = rail.customData.fixedPoint;
    if (!fixedPoint) return;

    // 1. スケール適用後の長さとクランプ処理
    const rawScaleX = Math.max(0.01, rail.scaleX || 1);
    let newLength = baseLength * rawScaleX;
    newLength = Math.max(minL, Math.min(maxL, newLength));

    // 2. 記憶していた「元の固定端」を起点に、新しい中心位置を計算
    const rad = ((rail.angle || 0) * Math.PI) / 180;
    const newHalfLen = newLength / 2;
    
    const isRightHandle = (corner === 'mr');
    const centerVectorSign = isRightHandle ? 1 : -1;
    
    const newCenterX = fixedPoint.x + (newHalfLen * centerVectorSign) * Math.cos(rad);
    const newCenterY = fixedPoint.y + (newHalfLen * centerVectorSign) * Math.sin(rad);

    // 変形開始時（object:scaling 初回）に記録された状態が存在しない場合はエラーとする
    if (!rail._resizeBefore) {
        throw new TypeError("handleVariableRailResizeEnd: 変形前状態 (_resizeBefore) が記録されていません。");
    }
    const fromState = {
        x: rail._resizeBefore.x,
        y: rail._resizeBefore.y,
        angle: rail._resizeBefore.angle,
        partOptions: JSON.parse(JSON.stringify(rail._resizeBefore.partOptions))
    };
    const jointsBefore = rail._resizeBefore.joints;

    // 3. プロパティ・スケール・位置の確定
    if (!rail.customData.partOptions) rail.customData.partOptions = {};
    rail.customData.partOptions.length = newLength;

    // 一時記録した位置情報を削除
    delete rail.customData.fixedPoint;

    rail.set({
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        originX: 'center',
        originY: 'center',
        left: newCenterX,
        top: newCenterY
    });

    // 4. 新しい長さに合わせたシェイプの再生成
    // フレキシブルレールの場合は、そのパーツ用の疑似カタログ定義が必要
    let renderCatalogItem = catalogItem;
    if (isFlexibleComponent) {
        renderCatalogItem = JSON.parse(JSON.stringify(catalogItem));
        renderCatalogItem.dynamicType = "variable-straight";
        renderCatalogItem.nodes = rail.customData.nodes;
    }
    rebuildVariableRailPaths(rail, renderCatalogItem);

    // 5. 新しいノード位置でのスナップ・接続判定
    applyClusterSnapLogic(rail);

    rail.setCoords();

    // 変更後の状態の構築
    const toState = {
        x: rail.left,
        y: rail.top,
        angle: rail.angle || 0,
        partOptions: JSON.parse(JSON.stringify(rail.customData.partOptions))
    };
    const jointsAfter = [...globalJoints];

    // RESIZEアクションの履歴記録
    recordAction({
        type: 'RESIZE',
        items: [{
            instanceId: rail.customData.instanceId,
            from: fromState,
            to: toState
        }],
        jointsBefore: jointsBefore,
        jointsAfter: jointsAfter
    });

    // ★ ここでの削除は行わない（後続の captureDragEnd に引き継ぐ）
    // delete rail._resizeBefore;

    updateJointIndicators();
    canvas.requestRenderAll();
}

/**
 * 可変長レールのグループ内パスを新長さに合わせて位置を壊さず再生成する
 */
function rebuildVariableRailPaths(rail, catalogItem) {
    // 元の位置・回転状態を保存
    const savedLeft = rail.left;
    const savedTop = rail.top;
    const savedAngle = rail.angle;

    // 新しい長さで幾何データを生成
    const options = { partOptions: rail.customData.partOptions };
    const geoData = generateGenericRailData(catalogItem, options);

    // 既存の子要素を安全にすべて削除
    const existingObjects = rail.getObjects();
    existingObjects.forEach(obj => rail.remove(obj));

    // 新しいベース描画オブジェクト・レール描画オブジェクトを作成
    const baseObjects = geoData.basePaths.map(pStr => 
        new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' })
    );
    const railObjects = geoData.railPaths.map(pStr => 
        new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' })
    );

    // テキストオブジェクトの作成
    const textObjects = [];
    if (typeof SHOW_RAIL_NAMES !== 'undefined' && SHOW_RAIL_NAMES && geoData.textDataList) {
        const fontSize = (typeof DEFAULT_RAIL_NAME_FONT_SIZE !== 'undefined') ? DEFAULT_RAIL_NAME_FONT_SIZE : 10;
        geoData.textDataList.forEach(tData => {
            const tObj = new fabric.Text(tData.text, {
                fontSize: fontSize,
                fill: '#111111',
                fontFamily: 'sans-serif',
                left: tData.x,
                top: tData.y,
                angle: tData.baseAngle,
                originX: 'center',
                originY: 'center',
                textBaseline: 'alphabetic'
            });
            tObj.isRailText = true;
            tObj.baseAngle = tData.baseAngle;
            textObjects.push(tObj);
        });
    }

    // 新しい要素をグループへ安全に追加し、サイズと原点を再計算
    [...baseObjects, ...railObjects, ...textObjects].forEach(obj => {
        rail.addWithUpdate(obj);
    });

    // グループ自体のスケール・位置・バウンディングボックスを更新
    rail.set({
        scaleX: 1,
        scaleY: 1,
        left: savedLeft,
        top: savedTop,
        angle: savedAngle
    });

    rail.setCoords();
}

// レール名描画設定
let DEFAULT_RAIL_NAME_FONT_SIZE = 8;
let SHOW_RAIL_NAMES = true;

/**
 * 対象のレール（単体 または 複数選択Group）内の文字向きを画面上で正しく読める向き（-90°〜90°）に正しく補正する
 */
function updateRailTextOrientation(target) {
    if (!target) return;

    const rails = (target.type === 'activeSelection') ? target.getObjects() : [target];

    rails.forEach((railGroup, idx) => {
        if (!railGroup || !railGroup.customData || !railGroup.customData.isRail || !railGroup._objects) return;

        const matrix = railGroup.calcTransformMatrix();
        const decomposed = fabric.util.qrDecompose(matrix);
        const globalRailAngle = decomposed.angle;

        railGroup._objects.forEach((obj, objIdx) => {
            if (obj.isRailText) {
                let absAngle = (globalRailAngle + obj.baseAngle) % 360;
                if (absAngle < 0) absAngle += 360;

                let flip = (absAngle > 90 && absAngle < 270) ? 180 : 0;
                let newLocalAngle = obj.baseAngle + flip;

                obj.set('angle', newLocalAngle);
            }
        });
    });
}

/**
 * キャンバスへレールを追加するメインルーチン
 * dynamicType が 'flexible' の場合はフレキシブルレール専用生成関数へ分岐させ、
 * 生成された複数オブジェクト（配列）または単一オブジェクトを呼び出し元へ返します。
 * 
 * @param {string} partId - カタログ上のパーツID
 * @param {Object} options - 配置オプション
 * @returns {fabric.Object|Array<fabric.Object>} 追加されたFabricオブジェクト（またはその配列）
 */
function addRailToCanvas(partId, options = {}) {
    if (!canvas) return null;

    const catalogItem = railCatalog.items[partId];
    if (!catalogItem) {
        console.error(`[${ENGINE_VERSION}] 該当パーツが見つかりません (partId: "${partId}")`);
        return null;
    }

    const jointsBefore = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];
    let railResult;

    // --- 1. オブジェクト生成（Factory分岐） ---
    if (catalogItem.dynamicType === 'flexible') {
        // フレキシブルレールの生成 (3点セット [start, bridge, end])
        // ※内部での canvas.add は addFlexibleRailToCanvas に任せる（現状の仕様維持）
        railResult = addFlexibleRailToCanvas(canvas, partId, options);
    } else {
        // 通常レールの生成
        const currentId = `rail-${railCount++}`;
        const geoData = generateGenericRailData(catalogItem, options);

        const baseObjects = geoData.basePaths.map(pStr => new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' }));
        const railObjects = geoData.railPaths.map(pStr => new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' }));

        // テキストオブジェクトの生成
        const textObjects = [];
        if (SHOW_RAIL_NAMES && geoData.textDataList) {
            const fontSize = options.fontSize || DEFAULT_RAIL_NAME_FONT_SIZE;
            geoData.textDataList.forEach(tData => {
                const tObj = new fabric.Text(tData.text, {
                    fontSize: fontSize,
                    fill: '#111111',
                    fontFamily: 'sans-serif',
                    left: tData.x,
                    top: tData.y,
                    angle: tData.baseAngle,
                    originX: 'center',
                    originY: 'center',
                    textBaseline: 'alphabetic'
                });
                tObj.isRailText = true;
                tObj.baseAngle = tData.baseAngle;
                textObjects.push(tObj);
            });
        }

        const railObject = new fabric.Group([...baseObjects, ...railObjects, ...textObjects], {
            left: 0, top: 0, originX: 'center', originY: 'center', angle: 0
        });

        // customData の設定
        railObject.customData = { 
            instanceId: currentId, 
            partId: partId, 
            isRail: true,
            geoCenterX: geoData.centerX,
            geoCenterY: geoData.centerY
        };

        // partOptions (可変レールの長さ等) の保持
        if (options.partOptions) {
            railObject.customData.partOptions = JSON.parse(JSON.stringify(options.partOptions));
        } else if (typeof options.partOptionslength === 'number') {
            railObject.customData.partOptions = { length: options.partOptions.length };
        }

        // コントロール設定
        configureControls(railObject);

        // キャンバスへ追加
        canvas.add(railObject);
        railResult = railObject;
    }

    // --- 2. 共通ライフサイクル処理 ---
    const isFlexible = Array.isArray(railResult);
    const mainRail = isFlexible ? railResult[0] : railResult; // 代表オブジェクト
    const allAddedObjects = isFlexible ? railResult : [railResult];

    // イベント監視登録 (移動・回転ハンドラ)
    allAddedObjects.forEach(obj => {
        if (obj.customData && obj.customData.isRail) {
            obj.on('moving', function() { 
                isDraggingRail = true; 
                onGeneralTransform(this); 
            });
            obj.on('rotating', function() { 
                isDraggingRail = true; 
                updateRailTextOrientation(this); 
                onGeneralTransform(this); 
            });
        }
    });

    // フレキシブルレールの構成パーツが個別に動かされた場合、または一括で動かされた場合にブリッジを再描画する監視
    if (isFlexible) {
        const [startRail, bridgePath, endRail] = railResult;
        const updateBridge = () => rebuildFlexibleRailBridge(bridgePath, startRail, endRail);
        
        startRail.on('moving', updateBridge);
        startRail.on('rotating', updateBridge);
        endRail.on('moving', updateBridge);
        endRail.on('rotating', updateBridge);
    }

    // オートコネクト処理
    if (!options.skipAutoConnect) {
        const activeObj = canvas.getActiveObject();
        const parentRail = (activeObj && activeObj.customData && activeObj.customData.isRail) ? activeObj : null;
        const targetNodeId = parentRail ? findTargetNodeForAutoConnect(parentRail) : null;

        // 移動・回転前の startRail (mainRail) の位置と角度を保持
        const prevStartX = mainRail.left;
        const prevStartY = mainRail.top;
        const prevStartAngle = mainRail.angle;

        let autoConnected = false;
        if (parentRail && targetNodeId !== null) {
            autoConnected = alignRailToParentNode(mainRail, parentRail, targetNodeId);
        }

        // 配置フォールバック (接続されなかった場合)
        if (!autoConnected) {
            if (parentRail) {
                mainRail.set({ left: parentRail.left + 30, top: parentRail.top + 30, angle: parentRail.angle });
            } else if (lastCanvasClickPos) {
                mainRail.set({ left: lastCanvasClickPos.x, top: lastCanvasClickPos.y, angle: 0 });
            } else {
                mainRail.set({ left: 250 + (railCount % 5) * 25, top: 450 + (railCount % 5) * 25, angle: 0 });
            }
            mainRail.setCoords();
        }

        // フレキシブルレールの場合は起点 (startRail) の移動および回転に合わせて終点 (endRail) の位置・向きを回転移動し、ブリッジを再構築する処理
        if (isFlexible) {
            const endRail = railResult[2];

            // 起点 (mainRail) の角度変化量を算出 (角度は時計回りが正)
            const dAngle = mainRail.angle - prevStartAngle;
            const rad = dAngle * (Math.PI / 180);

            // 起点から見た終点の移動前相対座標
            const rx = endRail.left - prevStartX;
            const ry = endRail.top - prevStartY;

            // 回転行列により回転後の相対座標を計算 (右:+X, 下:+Y, 時計回り正)
            const rotatedRx = rx * Math.cos(rad) - ry * Math.sin(rad);
            const rotatedRy = rx * Math.sin(rad) + ry * Math.cos(rad);

            // 起点（mainRail）の新しい位置と角度に合わせて終点（endRail）の座標と向きを更新
            endRail.set({
                left: mainRail.left + rotatedRx,
                top: mainRail.top + rotatedRy,
                angle: endRail.angle + dAngle
            });
            endRail.setCoords();

            // startRail/endRail 両方の位置・角度を確定させてからブリッジを再構築
            rebuildFlexibleRailBridge(railResult[1], railResult[0], railResult[2]);
        }
    }

    // 全局イベント監視登録
    registerGlobalCanvasEvents();

    // Undo / Redo 履歴登録
    if (!options.skipAutoConnect && !options.skipSelect) {
        // フレキシブルレールの場合は両端（flexible_start, flexible_end）のみを対象とし、中央曲線部 (flexible_bridge) を除外して記録
        const historyRails = allAddedObjects
            .filter(o => o && o.customData && (o.customData.isRail || o.customData.flexibleId))
            .filter(o => {
                const rType = o.customData ? o.customData.railType : null;
                const pId = o.customData ? o.customData.partId : null;
                return rType !== 'flexible_bridge' && pId !== 'flexible_bridge';
            })
            .map(obj => ({
                instanceId: obj.customData.instanceId,
                partId: obj.customData.partId,
                railType: obj.customData.railType,
                flexibleId: obj.customData.flexibleId,
                x: obj.left,
                y: obj.top,
                angle: obj.angle || 0,
                customData: {
                    partOptions: obj.customData.partOptions ? JSON.parse(JSON.stringify(obj.customData.partOptions)) : undefined
                }
            }));

        recordAction({
            type: 'ADD',
            rails: historyRails,
            jointsBefore: jointsBefore,
            jointsAfter: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
        });
    }

    // アクティブ選択設定
    if (!options.skipSelect) {
        if (isFlexible) {
            const sel = new fabric.ActiveSelection(allAddedObjects, { canvas: canvas });
            canvas.setActiveObject(sel);
        } else {
            canvas.setActiveObject(mainRail);
        }
    }

    // テキスト向き補正
    allAddedObjects.forEach(obj => updateRailTextOrientation(obj));

    // ジョイント描画更新 & キャンバス再描画
    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();

    return railResult;
}

/**
 * フレキシブルレールを構成する3点セット（startRail, bridgeGroup, endRail）を生成し、
 * キャンバスへ追加した上で一括管理用配列として返却する関数。
 * 仮想レール（startRail/endRail）の Fabric オブジェクト構築も関数内で直接行います。
 *
 * @param {fabric.Canvas} canvas - 追加対象のFabric.jsキャンバスインスタンス
 * @param {Object} partId - パーツID
 * @param {Object} [options={}] - 配置座標、回転角度、パーツオプション等の設定オブジェクト
 * @returns {Array<fabric.Object>} [startRail, bridgeGroup, endRail] のFabricオブジェクト配列
 */
function addFlexibleRailToCanvas(canvas, partId, options = {}) {
    const catalogItem = railCatalog.items[partId];

    // --- 0. 必須引数の存在判定 (Fail-First原則) ---
    if (!canvas) {
        throw new TypeError("canvas instance is required.");
    }
    if (!catalogItem) {
        throw new TypeError("catalogItem is required.");
    }

    // --- 1. 端部（仮想レール）の長さ（currentLength）決定 ---
    // 伸縮後の保持値（options）が存在すれば優先し、未指定なら catalogItem.defaultLength の半分を採用
    let currentStartLength;
    let currentEndLength;

    if (typeof options.startPartOptions?.length === 'number') {
        currentStartLength = options.startPartOptions.length;
    } else if (typeof catalogItem.defaultLength === 'number') {
        currentStartLength = catalogItem.defaultLength / 2;
    } else {
        throw new TypeError("catalogItem.defaultLength is not defined.");
    }

    if (typeof options.endPartOptions?.length === 'number') {
        currentEndLength = options.endPartOptions.length;
    } else if (typeof catalogItem.defaultLength === 'number') {
        currentEndLength = catalogItem.defaultLength / 2;
    } else {
        throw new TypeError("catalogItem.defaultLength is not defined.");
    }

    // --- 2. 道床幅 (ballastWidth) の決定 (Fail-First原則) ---
    // カタログ定義またはシステムライブラリ定義から道床幅を取得
    let defaultBallastWidth;
    if (typeof catalogItem.ballastWidth === 'number') {
        defaultBallastWidth = catalogItem.ballastWidth;
    } else {
        const sys = railCatalog.systems[catalogItem.systemId];
        if (sys && typeof sys.ballastWidth === 'number') {
            defaultBallastWidth = sys.ballastWidth;
        } else {
            throw new TypeError("ballastWidth is missing in both catalogItem and railCatalog system.");
        }
    }

    // --- 3. 3点セットを紐付ける共通の一意識別子 (flexibleId) の発行 ---
    const flexibleId = crypto.randomUUID();

    // --- 4. startRail 用の疑似 catalogItem 構築 ---
    // カタログ定義を複製し、バリアブル直線レールかつ左端ノード（nodes[0]）のみ保持する定義に変更
    const startPseudoItem = JSON.parse(JSON.stringify(catalogItem));
    startPseudoItem.dynamicType = "variable-straight";
    if (Array.isArray(catalogItem.nodes) && catalogItem.nodes.length > 0) {
        startPseudoItem.nodes = [catalogItem.nodes[0]];
    } else {
        throw new TypeError("catalogItem.nodes[0] is required for startRail.");
    }

    // --- 5. endRail 用の疑似 catalogItem 構築 ---
    // カタログ定義を複製し、バリアブル直線レールかつ右端ノード（nodes[1]）のみ保持する定義に変更
    const endPseudoItem = JSON.parse(JSON.stringify(catalogItem));
    endPseudoItem.dynamicType = "variable-straight";
    if (Array.isArray(catalogItem.nodes) && catalogItem.nodes.length > 1) {
        endPseudoItem.nodes = [catalogItem.nodes[1]];
    } else {
        throw new TypeError("catalogItem.nodes[1] is required for endRail.");
    }

    // --- 6. 端部描画データ (basePaths, railPaths 等) の生成 ---
    // 確定したオプション長さ（length）を渡して各端部のパスデータを取得
    const startRailData = generateGenericRailData(startPseudoItem, { length: currentStartLength });
    const endRailData = generateGenericRailData(endPseudoItem, { length: currentEndLength });

    // --- 7. 初期配置位置・角度および3次ベジェ制御点 (P0, P1, P2, P3) の計算 ---
    // HTML/SVG 座標系 (右:+X, 下:+Y, 時計回り角度) による単位方向ベクトルと各基準点を計算
    const originX = typeof options.x === 'number' ? options.x : 0;
    const originY = typeof options.y === 'number' ? options.y : 0;
    const baseAngle = typeof options.angle === 'number' ? options.angle : 0;

    const rad = (baseAngle * Math.PI) / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);

    // 初期生成時の中央ブリッジ隙間長
    const initialBridgeLength = Math.max(50, catalogItem.defaultLength || 100);

    // P0: startRail 左端 (外部接続ノード0 の位置)
    const p0X = originX;
    const p0Y = originY;

    // startRail の中心位置 (Fabric オブジェクトの基準座標)
    const startCenterX = p0X + (currentStartLength / 2) * dirX;
    const startCenterY = p0Y + (currentStartLength / 2) * dirY;

    // P1: startRail 右端 (ベジェ曲線の引き出し制御点1)
    const p1X = p0X + currentStartLength * dirX;
    const p1Y = p0Y + currentStartLength * dirY;

    // P2: endRail 左端 (ベジェ曲線の引き出し制御点2)
    const p2X = p1X + initialBridgeLength * dirX;
    const p2Y = p1Y + initialBridgeLength * dirY;

    // endRail の中心位置 (Fabric オブジェクトの基準座標)
    const endCenterX = p2X + (currentEndLength / 2) * dirX;
    const endCenterY = p2Y + (currentEndLength / 2) * dirY;

    // P3: endRail 右端 (外部接続ノード1 の位置)
    const p3X = p2X + currentEndLength * dirX;
    const p3Y = p2Y + currentEndLength * dirY;

	// --- 8. 中央ブリッジ (bridgeGroup) のカタログ準拠サンプリング構築 ---
    // モノレールや3線軌条などカタログ定義に沿った複数レール表現に対応するため、システム定義を取得
    const sys = railCatalog.systems[catalogItem.systemId];

    // まず、絶対座標系でブリッジ全体のバウンディングボックス（minX, maxX, minY, maxY）を算出する
    // ※fabric.Groupの内包パスはグループ中心(0,0)からの相対座標（ローカル座標）である必要があるため、
    //  一度絶対座標で全サンプル点を生成し、その中心を求めてからローカル座標に変換します。
    const steps = 100;
    const globalBridgeBasePaths = [];
    const globalBridgeRailPaths = [];
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;

    function updateBridgeBounds(x, y) {
        if (x < bMinX) bMinX = x;
        if (x > bMaxX) bMaxX = x;
        if (y < bMinY) bMinY = y;
        if (y > bMaxY) bMaxY = y;
    }

    catalogItem.shapes.forEach(shape => {
        const shapeBallastWidth = (typeof shape.ballastWidth === 'number') ? shape.ballastWidth : defaultBallastWidth;
        const halfW = shapeBallastWidth / 2;

        const effectiveGauge = (typeof shape.gauge === 'number') ? shape.gauge : (sys ? sys.gauge : null);
        const shouldRenderRails = (typeof effectiveGauge === 'number' && effectiveGauge > 0);
        const shouldRenderSingleCenterLine = (typeof effectiveGauge === 'number' && effectiveGauge === 0);
        
        const offsets = [];
        if (shouldRenderRails) {
            const halfGauge = effectiveGauge / 2;
            offsets.push(-halfGauge, halfGauge);
        } else if (shouldRenderSingleCenterLine) {
            offsets.push(0);
        }

        const leftBallastPts = [];
        const rightBallastPts = [];
        const railPointsMaps = offsets.map(() => []);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const mt = 1 - t;

            const bx = mt * mt * mt * p0X + 3 * mt * mt * t * p1X + 3 * mt * t * t * p2X + t * t * t * p3X;
            const by = mt * mt * mt * p0Y + 3 * mt * mt * t * p1Y + 3 * mt * t * t * p2Y + t * t * t * p3Y;

            const bdx = 3 * mt * mt * (p1X - p0X) + 6 * mt * t * (p2X - p1X) + 3 * t * t * (p3X - p2X);
            const bdy = 3 * mt * mt * (p1Y - p0Y) + 6 * mt * t * (p2Y - p1Y) + 3 * t * t * (p3Y - p2Y);

            const bLen = Math.sqrt(bdx * bdx + bdy * bdy);
            let nx = 0, ny = 0;
            if (bLen > 0.0001) {
                nx = -bdy / bLen;
                ny = bdx / bLen;
            }

            if (shapeBallastWidth > 0) {
                const lx = bx + nx * halfW;
                const ly = by + ny * halfW;
                const rx = bx - nx * halfW;
                const ry = by - ny * halfW;
                leftBallastPts.push({ x: lx, y: ly });
                rightBallastPts.push({ x: rx, y: ry });
                updateBridgeBounds(lx, ly);
                updateBridgeBounds(rx, ry);
            }

            offsets.forEach((offset, idx) => {
                const ox = bx + nx * offset;
                const oy = by + ny * offset;
                railPointsMaps[idx].push({ x: ox, y: oy });
                updateBridgeBounds(ox, oy);
            });
        }

        if (shapeBallastWidth > 0 && leftBallastPts.length > 0) {
            let ballastStr = `M ${leftBallastPts[0].x} ${leftBallastPts[0].y}`;
            for (let i = 1; i <= steps; i++) ballastStr += ` L ${leftBallastPts[i].x} ${leftBallastPts[i].y}`;
            for (let i = steps; i >= 0; i--) ballastStr += ` L ${rightBallastPts[i].x} ${rightBallastPts[i].y}`;
            ballastStr += ` Z`;
            globalBridgeBasePaths.push(ballastStr);
        }

        railPointsMaps.forEach(pts => {
            if (pts.length > 0) {
                let rStr = `M ${pts[0].x} ${pts[0].y}`;
                for (let i = 1; i <= steps; i++) {
                    rStr += ` L ${pts[i].x} ${pts[i].y}`;
                }
                globalBridgeRailPaths.push(rStr);
            }
        });
    });

    // ブリッジ全体の幾何学的中心座標を算出し、ローカル座標系（中心 = 0,0）へ変換する
    const bridgeCenterX = (bMinX + bMaxX) / 2;
    const bridgeCenterY = (bMinY + bMaxY) / 2;

    // パス文字列内の絶対座標からグループ中心を引いてローカル座標化するヘルパー関数
    function convertToLocalPath(pathStr, cx, cy) {
        return pathStr.replace(/([MLZ])\s*([-\d.]+)\s+([-\d.]+)/g, (match, cmd, x, y) => {
            if (cmd === 'Z') return 'Z';
            return `${cmd} ${parseFloat(x) - cx} ${parseFloat(y) - cy}`;
        });
    }

    const bridgeBaseObjects = globalBridgeBasePaths.map(pStr => 
        new fabric.Path(convertToLocalPath(pStr, bridgeCenterX, bridgeCenterY), { fill: '#cccccc', stroke: null, originX: 'center', originY: 'center' })
    );
    const bridgeRailObjects = globalBridgeRailPaths.map(pStr => 
        new fabric.Path(convertToLocalPath(pStr, bridgeCenterX, bridgeCenterY), { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' })
    );

    const bridgeGroup = new fabric.Group([...bridgeBaseObjects, ...bridgeRailObjects], {
        left: bridgeCenterX,
        top: bridgeCenterY,
        originX: 'center',
        originY: 'center',
        selectable: true
    });

    bridgeGroup.customData = {
        partId: partId, // 再構築時にカタログ定義を引くために保持
        railType: "flexible_bridge",
        flexibleId: flexibleId,
        partOptions: {
            isLocked: false
        }
    };

    // --- 9. 端部仮想レール1 (startRail) の Fabric グループ化構築 ---
    // startRailData からベース・レール線・テキストオブジェクトを組み立てる
    const startBaseObjects = startRailData.basePaths.map(pStr => 
        new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' })
    );
    const startRailObjects = startRailData.railPaths.map(pStr => 
        new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' })
    );
    const startTextObjects = [];
    if (typeof SHOW_RAIL_NAMES !== 'undefined' && SHOW_RAIL_NAMES && startRailData.textDataList) {
        const fontSize = options.fontSize || (typeof DEFAULT_RAIL_NAME_FONT_SIZE !== 'undefined' ? DEFAULT_RAIL_NAME_FONT_SIZE : 10);
        startRailData.textDataList.forEach(tData => {
            const tObj = new fabric.Text(tData.text, {
                fontSize: fontSize,
                fill: '#111111',
                fontFamily: 'sans-serif',
                left: tData.x,
                top: tData.y,
                angle: tData.baseAngle,
                originX: 'center',
                originY: 'center',
                textBaseline: 'alphabetic'
            });
            tObj.isRailText = true;
            tObj.baseAngle = tData.baseAngle;
            startTextObjects.push(tObj);
        });
    }

    // 初期生成時は非ロック、再生成時はオプション参照
    const startIsLocked = options.startPartOptions ? options.startPartOptions.isLocked : false;

    const startRail = new fabric.Group([...startBaseObjects, ...startRailObjects, ...startTextObjects], {
        left: startCenterX,
        top: startCenterY,
        angle: baseAngle,
        originX: 'center',
        originY: 'center',
        opacity: 0.5,
        visible: !startIsLocked,
        selectable: !startIsLocked,
        lockMovementX: startIsLocked,
        lockMovementY: startIsLocked
    });

    // exportLayoutData でシリアライズ・保存対象となるよう partOptions に長さおよびフレキシブル識別情報を保持させる
    startRail.customData = {
        instanceId: `rail-${railCount++}`,
        partId: partId,
        nodes: startPseudoItem.nodes, // 仮想パーツ用のノード定義を保持
        isRail: true,
        railType: "flexible_start",
        flexibleId: flexibleId,
        length: currentStartLength,
        geoCenterX: startRailData.centerX,
        geoCenterY: startRailData.centerY,
        partOptions: { 
            length: currentStartLength,
            flexibleId: flexibleId,
            railType: "flexible_start",
            isLocked: startIsLocked
        }
    };
    configureControls(startRail);
    if (startIsLocked) {
        startRail.hasControls = false;
    }

    // --- 10. 端部仮想レール2 (endRail) の Fabric グループ化構築 ---
    // endRailData からベース・レール線・テキストオブジェクトを組み立てる
    const endBaseObjects = endRailData.basePaths.map(pStr => 
        new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' })
    );
    const endRailObjects = endRailData.railPaths.map(pStr => 
        new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' })
    );
    const endTextObjects = [];
    if (typeof SHOW_RAIL_NAMES !== 'undefined' && SHOW_RAIL_NAMES && endRailData.textDataList) {
        const fontSize = options.fontSize || (typeof DEFAULT_RAIL_NAME_FONT_SIZE !== 'undefined' ? DEFAULT_RAIL_NAME_FONT_SIZE : 10);
        endRailData.textDataList.forEach(tData => {
            const tObj = new fabric.Text(tData.text, {
                fontSize: fontSize,
                fill: '#111111',
                fontFamily: 'sans-serif',
                left: tData.x,
                top: tData.y,
                angle: tData.baseAngle,
                originX: 'center',
                originY: 'center',
                textBaseline: 'alphabetic'
            });
            tObj.isRailText = true;
            tObj.baseAngle = tData.baseAngle;
            endTextObjects.push(tObj);
        });
    }

    // 初期生成時は非ロック、再生成時はオプション参照
    const endIsLocked = options.startPartOptions ? options.endPartOptions.isLocked : false;

    const endRail = new fabric.Group([...endBaseObjects, ...endRailObjects, ...endTextObjects], {
        left: endCenterX,
        top: endCenterY,
        angle: baseAngle,
        originX: 'center',
        originY: 'center',
        opacity: 0.5,
        visible: !endIsLocked,
        selectable: !endIsLocked,
        lockMovementX: endIsLocked,
        lockMovementY: endIsLocked
    });

    // exportLayoutData でシリアライズ・保存対象となるよう partOptions に長さおよびフレキシブル識別情報を保持させる
    endRail.customData = {
        instanceId: `rail-${railCount++}`,
        partId: partId,
        nodes: endPseudoItem.nodes, // 仮想パーツ用のノード定義を保持
        isRail: true,
        railType: "flexible_end",
        flexibleId: flexibleId,
        length: currentEndLength,
        geoCenterX: endRailData.centerX,
        geoCenterY: endRailData.centerY,
        partOptions: { 
            length: currentEndLength,
            flexibleId: flexibleId,
            railType: "flexible_end",
            isLocked: endIsLocked
        }
    };
    configureControls(endRail);
    if (endIsLocked) {
        endRail.hasControls = false;
    }

    // --- 11. キャンバスへの描画順序設定と追加 ---
    // 重なり順を維持するためブリッジグループを最下層にして追加
    canvas.add(bridgeGroup);
    canvas.add(startRail);
    canvas.add(endRail);

    // --- 12. 3点セット要素を配列形式で返却 ---
    return [startRail, bridgeGroup, endRail];
}

/**
 * 仮想レールの位置・角度・引き出し量に基づき、中央の bridgeGroup のベジェ曲線パス群を再構築
 * パス更新後に catalogItem の shapes 定義に沿ってサンプリング再計算を行い、グループ寸法や中心座標を正確に更新してズレを解消
 * 各レールオフセット（左右個別）ごとの実測長とカタログの maxLength との差分に基づき、独立したオーバーレイインジケータを描画・更新する
 * 
 * @param {fabric.Group} bridgeGroup 再構築対象のブリッジグループオブジェクト
 * @param {fabric.Object} startRail 左端の仮想レールオブジェクト
 * @param {fabric.Object} endRail 右端の仮想レールオブジェクト
 */
function rebuildFlexibleRailBridge(bridgeGroup, startRail, endRail) {
    if (!bridgeGroup) {
        throw new TypeError("rebuildFlexibleRailBridge: bridgeGroup が指定されていません。");
    }
    if (!startRail) {
        throw new TypeError("rebuildFlexibleRailBridge: startRail が指定されていません。");
    }
    if (!endRail) {
        throw new TypeError("rebuildFlexibleRailBridge: endRail が指定されていません。");
    }

    const startLength = startRail.customData.partOptions.length;
    const endLength = endRail.customData.partOptions.length;

    // グループ選択状態を考慮したキャンバス絶対座標・角度を取得
    const startTransform = getRailAbsoluteTransform(startRail);
    const endTransform = getRailAbsoluteTransform(endRail);

    const startRad = (startTransform.angle * Math.PI) / 180;
    const endRad = (endTransform.angle * Math.PI) / 180;

    // 1. 両端の接続点および引き出し制御点 (P0, P1, P2, P3) を計算
    const p0x = startTransform.left - Math.cos(startRad) * (startLength / 2);
    const p0y = startTransform.top - Math.sin(startRad) * (startLength / 2);

    const p1x = p0x + Math.cos(startRad) * startLength;
    const p1y = p0y + Math.sin(startRad) * startLength;

    const p3x = endTransform.left + Math.cos(endRad) * (endLength / 2);
    const p3y = endTransform.top + Math.sin(endRad) * (endLength / 2);

    const p2x = p3x - Math.cos(endRad) * endLength;
    const p2y = p3y - Math.sin(endRad) * endLength;

    // 2. カタログ定義 shapes 準拠のサンプリングによるブリッジ内部オブジェクト群の生成
    const partId = bridgeGroup.customData.partId || startRail.customData.partId;
    const catalogItem = railCatalog.items[partId];
    const sys = railCatalog.systems[catalogItem.systemId];

    let defaultBallastWidth;
    if (typeof catalogItem.ballastWidth === 'number') {
        defaultBallastWidth = catalogItem.ballastWidth;
    } else {
        defaultBallastWidth = sys.ballastWidth;
    }

    const steps = 100;
    const globalBridgeBasePaths = [];
    const globalBridgeRailPaths = [];
    let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;

    function updateBridgeBounds(x, y) {
        if (x < bMinX) bMinX = x;
        if (x > bMaxX) bMaxX = x;
        if (y < bMinY) bMinY = y;
        if (y > bMaxY) bMaxY = y;
    }

    // 各レールオフセットごとの両端位置および実測長を保持する配列
    const railIndicatorInfos = [];

    catalogItem.shapes.forEach(shape => {
        const shapeBallastWidth = (typeof shape.ballastWidth === 'number') ? shape.ballastWidth : defaultBallastWidth;
        const halfW = shapeBallastWidth / 2;

        const effectiveGauge = (typeof shape.gauge === 'number') ? shape.gauge : (sys ? sys.gauge : null);
        const shouldRenderRails = (typeof effectiveGauge === 'number' && effectiveGauge > 0);
        const shouldRenderSingleCenterLine = (typeof effectiveGauge === 'number' && effectiveGauge === 0);
        
        const offsets = [];
        if (shouldRenderRails) {
            const halfGauge = effectiveGauge / 2;
            offsets.push(-halfGauge, halfGauge);
        } else if (shouldRenderSingleCenterLine) {
            offsets.push(0);
        }

        const leftBallastPts = [];
        const rightBallastPts = [];
        const railPointsMaps = offsets.map(() => []);
        const railLengths = offsets.map(() => 0);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const mt = 1 - t;

            const bx = mt * mt * mt * p0x + 3 * mt * mt * t * p1x + 3 * mt * t * t * p2x + t * t * t * p3x;
            const by = mt * mt * mt * p0y + 3 * mt * mt * t * p1y + 3 * mt * t * t * p2y + t * t * t * p3y;

            const bdx = 3 * mt * mt * (p1x - p0x) + 6 * mt * t * (p2x - p1x) + 3 * t * t * (p3x - p2x);
            const bdy = 3 * mt * mt * (p1y - p0y) + 6 * mt * t * (p2y - p1y) + 3 * t * t * (p3y - p2y);

            const bLen = Math.sqrt(bdx * bdx + bdy * bdy);
            let nx = 0, ny = 0;
            if (bLen > 0.0001) {
                nx = -bdy / bLen;
                ny = bdx / bLen;
            }

            if (shapeBallastWidth > 0) {
                const lx = bx + nx * halfW;
                const ly = by + ny * halfW;
                const rx = bx - nx * halfW;
                const ry = by - ny * halfW;
                leftBallastPts.push({ x: lx, y: ly });
                rightBallastPts.push({ x: rx, y: ry });
                updateBridgeBounds(lx, ly);
                updateBridgeBounds(rx, ry);
            }

            offsets.forEach((offset, idx) => {
                const ox = bx + nx * offset;
                const oy = by + ny * offset;
                railPointsMaps[idx].push({ x: ox, y: oy });
                updateBridgeBounds(ox, oy);

                if (i > 0) {
                    const prevPt = railPointsMaps[idx][i - 1];
                    const dx = ox - prevPt.x;
                    const dy = oy - prevPt.y;
                    railLengths[idx] += Math.sqrt(dx * dx + dy * dy);
                }
            });
        }

        // 各オフセットごとの終端位置（端点）と実測長を登録
        offsets.forEach((offset, idx) => {
            const pts = railPointsMaps[idx];
            if (pts.length > 0) {
                const startPt = pts[0];
                const endPt = pts[pts.length - 1];
                railIndicatorInfos.push({
                    startPt: startPt,
                    endPt: endPt,
                    length: railLengths[idx]
                });
            }
        });

        if (shapeBallastWidth > 0 && leftBallastPts.length > 0) {
            let ballastStr = `M ${leftBallastPts[0].x} ${leftBallastPts[0].y}`;
            for (let i = 1; i <= steps; i++) ballastStr += ` L ${leftBallastPts[i].x} ${leftBallastPts[i].y}`;
            for (let i = steps; i >= 0; i--) ballastStr += ` L ${rightBallastPts[i].x} ${rightBallastPts[i].y}`;
            ballastStr += ` Z`;
            globalBridgeBasePaths.push(ballastStr);
        }

        railPointsMaps.forEach(pts => {
            if (pts.length > 0) {
                let rStr = `M ${pts[0].x} ${pts[0].y}`;
                for (let i = 1; i <= steps; i++) {
                    rStr += ` L ${pts[i].x} ${pts[i].y}`;
                }
                globalBridgeRailPaths.push(rStr);
            }
        });
    });

    // 3. パス全体の境界ボックスを基に幾何学的中心座標を特定し、ローカル座標に変換
    const bridgeCenterX = (bMinX + bMaxX) / 2;
    const bridgeCenterY = (bMinY + bMaxY) / 2;

    function convertToLocalPath(pathStr, cx, cy) {
        return pathStr.replace(/([MLZ])\s*([-\d.]+)\s+([-\d.]+)/g, (match, cmd, x, y) => {
            if (cmd === 'Z') return 'Z';
            return `${cmd} ${parseFloat(x) - cx} ${parseFloat(y) - cy}`;
        });
    }

    const bridgeBaseObjects = globalBridgeBasePaths.map(pStr => 
        new fabric.Path(convertToLocalPath(pStr, bridgeCenterX, bridgeCenterY), { fill: '#888888', stroke: null, originX: 'center', originY: 'center' })
    );
    const bridgeRailObjects = globalBridgeRailPaths.map(pStr => 
        new fabric.Path(convertToLocalPath(pStr, bridgeCenterX, bridgeCenterY), { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' })
    );

    // グループの内部オブジェクト群を更新
    bridgeGroup._objects = [...bridgeBaseObjects, ...bridgeRailObjects];

    // 4. グループの寸法・境界ボックスを再計算
    bridgeGroup.addWithUpdate();

    // 5. bridgeGroup がグループ（activeSelection等）に含まれている場合、キャンバス絶対座標をグループローカル相対座標に変換
    let targetLeft = bridgeCenterX;
    let targetTop = bridgeCenterY;
    let targetAngle = 0;

    if (bridgeGroup.group) {
        const invMatrix = fabric.util.invertTransform(bridgeGroup.group.calcTransformMatrix());
        const localPoint = fabric.util.transformPoint({ x: bridgeCenterX, y: bridgeCenterY }, invMatrix);
        targetLeft = localPoint.x;
        targetTop = localPoint.y;
        targetAngle = -bridgeGroup.group.angle;
    }

    // 6. 原点基準を中心 ('center') に指定し、中心座標 (left/top) と角度を同期
    bridgeGroup.set({
        originX: 'center',
        originY: 'center',
        left: targetLeft,
        top: targetTop,
        angle: targetAngle
    });

    // 7. コントロールハンドルの描画座標を最新の状態に確定
    bridgeGroup.setCoords();

    // --- 8. 左右個別ごとの残り長さ（オーバーレイ）インジケータの描画・更新 ---
    if (bridgeGroup.canvas) {
        const canvas = bridgeGroup.canvas;

        // 既存のインジケータ群があればすべて削除
        if (bridgeGroup.overlayIndicatorObjects && Array.isArray(bridgeGroup.overlayIndicatorObjects)) {
            bridgeGroup.overlayIndicatorObjects.forEach(obj => canvas.remove(obj));
        }
        bridgeGroup.overlayIndicatorObjects = [];

        // 変形ロック中（isLocked === true）の場合はインジケータを描画しない
        const isLocked = bridgeGroup.customData && bridgeGroup.customData.partOptions && bridgeGroup.customData.partOptions.isLocked;
        const maxLength = catalogItem.maxLength;

        if (!isLocked && typeof maxLength === 'number' && railIndicatorInfos.length > 0) {
            railIndicatorInfos.forEach(info => {
                const lRem = maxLength - info.length;
                const indicatorColor = lRem >= 0 ? '#22cc22' : '#cc2222';
                const drawLength = Math.abs(lRem);

                if (drawLength > 0.1) {
                    const indicatorSign = lRem >= 0 ? 1 : -1;
                    
                    // endRail の角度 (endRad) を基準に方向を決定
                    // endRail は右端の接続端子であるため、endRad の方向（外側）へ伸ばす
                    const dirX = Math.cos(endRad) * indicatorSign;
                    const dirY = Math.sin(endRad) * indicatorSign;

                    const endPt = info.endPt;
                    const startX = endPt.x;
                    const startY = endPt.y;
                    const endX = endPt.x + dirX * drawLength;
                    const endY = endPt.y + dirY * drawLength;

                    const indicatorLine = new fabric.Line([startX, startY, endX, endY], {
                        stroke: indicatorColor,
                        strokeWidth: 1.5,
                        strokeLineCap: 'round', 
                        selectable: false,
                        evented: false,
                        opacity: 0.8,
                        originX: 'center',
                        originY: 'center'
                    });

                    bridgeGroup.overlayIndicatorObjects.push(indicatorLine);
                    canvas.add(indicatorLine);
                }
            });
        }

        canvas.requestRenderAll();
    }
}

/**
 * レールオブジェクトのキャンバス上での絶対座標および絶対角度を取得
 * @param {fabric.Object} rail 対象のレールオブジェクト
 * @returns {{ left: number, top: number, angle: number }} キャンバス上の絶対位置と角度
 */
function getRailAbsoluteTransform(rail) {
    if (!rail) {
        throw new TypeError("getRailAbsoluteTransform: rail が指定されていません。");
    }

    // オブジェクトがグループ（activeSelection等）に含まれている場合は変換行列から絶対座標・角度を算出
    if (rail.group) {
        const matrix = rail.calcTransformMatrix();
        const absolutePoint = fabric.util.transformPoint({ x: 0, y: 0 }, matrix);

        let absoluteAngle = rail.angle;
        let parentGroup = rail.group;
        while (parentGroup) {
            absoluteAngle += parentGroup.angle;
            parentGroup = parentGroup.group;
        }
        absoluteAngle = (absoluteAngle % 360 + 360) % 360;

        return {
            left: absolutePoint.x,
            top: absolutePoint.y,
            angle: absoluteAngle
        };
    }

    // グループに含まれていない場合は自身のプロパティをそのまま返す
    return {
        left: rail.left,
        top: rail.top,
        angle: rail.angle
    };
}

/**
 * 選択中のレール群を削除
 * フレキシブルレールのパーツが含まれる場合は事前に3点セット全体へ選択を拡張して一括削除
 */
function deleteSelectedRails() {
    if (!canvas) return;

    let activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // 削除対象にフレキシブルレールが含まれている場合、事前に関連パーツ3点を一括選択へ拡張
    expandFlexibleRailSelection(activeObject, canvas);

    // 拡張後に最新のアクティブオブジェクトを取得し直す
    activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    let targetRails = [];
    const isSelectionGroup = activeObject.type === 'activeSelection';

    if (isSelectionGroup) {
        // フレキシブルレールの中央ブリッジ部など customData.isRail フラグが付与されていない構成パーツも確実に削除対象へ含める
        targetRails = activeObject.getObjects().filter(o => o && o.customData && (o.customData.isRail || o.customData.flexibleId));
    } else if (activeObject.customData && (activeObject.customData.isRail || activeObject.customData.flexibleId)) {
        targetRails = [activeObject];
    }

    if (targetRails.length === 0) return;

    // 【Undo履歴記録】中央曲線部 (flexible_bridge) を除外して履歴に記録
    const recordRails = targetRails.filter(r => {
        const rType = r.customData ? r.customData.railType : null;
        const pId = r.customData ? r.customData.partId : null;
        return rType !== 'flexible_bridge' && pId !== 'flexible_bridge';
    });

const railsToRecord = recordRails.map(r => {
        let absX = r.left;
        let absY = r.top;
        let absAngle = r.angle || 0;

        // 範囲選択時は相対座標になっているため、キャンバス絶対座標に変換する
        if (isSelectionGroup && r.group) {
            const matrix = r.calcTransformMatrix();
            const options = fabric.util.qrDecompose(matrix);
            absX = options.translateX;
            absY = options.translateY;
            absAngle = options.angle;
        }

        return {
            instanceId: r.customData.instanceId,
            partId: r.customData.partId,
            railType: r.customData.railType,
            flexibleId: r.customData.flexibleId,
            x: absX,
            y: absY,
            angle: absAngle,
            partOptions: r.customData.partOptions ? JSON.parse(JSON.stringify(r.customData.partOptions)) : null
        };
    });

    recordAction({
        type: 'DELETE',
        rails: railsToRecord,
        jointsBefore: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
    });

    const targetIds = targetRails.map(r => r.customData.instanceId).filter(Boolean);

    globalJoints = globalJoints.filter(j => 
        j && !targetIds.includes(j.railA) && !targetIds.includes(j.railB)
    );

    // キャンバスからは 3 点セット（start, end, bridge）すべてを削除（共通関数呼出）
    removeRailsFromCanvas(railsToRecord);
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

        // 基本座標のみを明示的に抽出
        const railData = {
            instanceId: rail.customData.instanceId,
            partId: partId,
            x: Math.round(rail.left * 100) / 100,
            y: Math.round(rail.top * 100) / 100,
            angle: Math.round(rail.angle * 100) / 100
        };

        // partOptions が存在する場合のみ追加
        if (rail.customData.partOptions && typeof rail.customData.partOptions === 'object') {
            railData.partOptions = JSON.parse(JSON.stringify(rail.customData.partOptions))
        }

        railList.push(railData);
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

// レイアウトデータの読み込み処理
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

        // 履歴のリセットおよび Clean 状態への更新
        if (Array.isArray(historyUndoStack)) historyUndoStack.length = 0;
        if (Array.isArray(historyRedoStack)) historyRedoStack.length = 0;
        markAsClean();
    }

    const createdObjects = [];
    const idToInstanceMap = {};
    const instanceMap = {};

    // フレキシブルレールのペアリング用マップおよび通常レール配列の分離
    const flexiblePairs = new Map();
    const normalRails = [];

    layoutData.rails.forEach((r, idx) => {
        if (!r || !r.partId) {
            console.warn(`[${ENGINE_VERSION}] レール定義不備 (Index: ${idx})`);
            return;
        }

        const railType = (r.partOptions ? r.partOptions.railType : null);
        const flexId = (r.partOptions ? r.partOptions.flexibleId : null);

        if (flexId) {
            if (!flexiblePairs.has(flexId)) {
                flexiblePairs.set(flexId, { partId: r.partId, start: null, end: null });
            }
            const pair = flexiblePairs.get(flexId);
            if (railType === 'flexible_start') {
                pair.start = r;
            } else if (railType === 'flexible_end') {
                pair.end = r;
            }
        } else {
            normalRails.push(r);
        }
    });

    // 1. 通常レールの生成・配置
    normalRails.forEach(r => {
        const addOptions = { skipAutoConnect: true, skipSelect: true };
        if (r.partOptions) {
            addOptions.partOptions = r.partOptions;
        }

        const addResult = addRailToCanvas(r.partId, addOptions);
        if (addResult) {
            const newObj = Array.isArray(addResult) ? addResult[0] : addResult;
            if (newObj) {
                newObj.set({ left: r.x, top: r.y, angle: r.angle });
                
                if (r.partOptions && typeof r.partOptions === 'object') {
                    const restoredOptions = JSON.parse(JSON.stringify(r.partOptions));
                    if (newObj.customData && newObj.customData.railType) {
                        restoredOptions.railType = newObj.customData.railType;
                    }
                    newObj.customData.partOptions = restoredOptions;
                }

                newObj.setCoords();
                updateRailTextOrientation(newObj);

                createdObjects.push(newObj);
                
                const realId = newObj.customData ? newObj.customData.instanceId : null;
                if (realId) {
                    instanceMap[realId] = newObj;
                }
                if (r.instanceId && newObj.customData) {
                    idToInstanceMap[r.instanceId] = newObj.customData.instanceId;
                }
            }
        }
    });

    // 2. フレキシブルレールの生成・配置（start と end のオプションを同時に指定）
    flexiblePairs.forEach((pair, flexId) => {
        if (!pair.start || !pair.end) {
            console.warn(`[${ENGINE_VERSION}] フレキシブルレールのペアが不完全です (flexId: ${flexId})`);
            return;
        }

        const addOptions = {
            skipAutoConnect: true,
            skipSelect: true,
            startPartOptions: pair.start.partOptions,
            endPartOptions: pair.end.partOptions
        };

        const addResult = addRailToCanvas(pair.partId, addOptions);
        if (addResult) {
            const newObjects = Array.isArray(addResult) ? addResult : [addResult];
            const startObj = newObjects.find(o => o.customData?.railType === 'flexible_start');
            const bridgeObj = newObjects.find(o => o.customData?.railType === 'flexible_bridge');
            const endObj = newObjects.find(o => o.customData?.railType === 'flexible_end');

            newObjects.forEach(newObj => {
                if (newObj.customData) {
                    newObj.customData.flexibleId = flexId;
                }
            });

            // start端の位置・角度・プロパティの復元（※instanceIdは上書きせず、マッピングのみに留める）
            if (startObj && pair.start) {
                startObj.set({ left: pair.start.x, top: pair.start.y, angle: pair.start.angle });
                if (pair.start.partOptions && typeof pair.start.partOptions === 'object') {
                    startObj.customData.partOptions = JSON.parse(JSON.stringify(pair.start.partOptions));
                }
                startObj.setCoords();
                updateRailTextOrientation(startObj);
                
                createdObjects.push(startObj);
                if (startObj.customData?.instanceId) {
                    instanceMap[startObj.customData.instanceId] = startObj;
                }
                // ★ 古い instanceId から新規発行された instanceId へのマッピング登録
                if (pair.start.instanceId && startObj.customData?.instanceId) {
                    idToInstanceMap[pair.start.instanceId] = startObj.customData.instanceId;
                }
            }

            // end端の位置・角度・プロパティの復元（※instanceIdは上書きせず、マッピングのみに留める）
            if (endObj && pair.end) {
                endObj.set({ left: pair.end.x, top: pair.end.y, angle: pair.end.angle });
                if (pair.end.partOptions && typeof pair.end.partOptions === 'object') {
                    endObj.customData.partOptions = JSON.parse(JSON.stringify(pair.end.partOptions));
                }
                endObj.setCoords();
                updateRailTextOrientation(endObj);
                
                createdObjects.push(endObj);
                if (endObj.customData?.instanceId) {
                    instanceMap[endObj.customData.instanceId] = endObj;
                }
                // ★ 古い instanceId から新規発行された instanceId へのマッピング登録
                if (pair.end.instanceId && endObj.customData?.instanceId) {
                    idToInstanceMap[pair.end.instanceId] = endObj.customData.instanceId;
                }
            }

            if (bridgeObj) {
                // コピー元から bridge の partOptions が取得できる場合はそれを反映（なければ start端等の状態をフォールバックとして採用）
                const bridgeIsLocked = pair.bridge?.partOptions?.isLocked ?? (pair.start?.partOptions?.isLocked || false);
                
                if (bridgeObj.customData) {
                    if (!bridgeObj.customData.partOptions) {
                        bridgeObj.customData.partOptions = {};
                    }
                    bridgeObj.customData.partOptions.isLocked = bridgeIsLocked;
                }

                // ロック状態に応じたコントロール表示の反映
                bridgeObj.set({
                    hasControls: !bridgeIsLocked
                });

                createdObjects.push(bridgeObj);
                if (bridgeObj.customData?.instanceId) {
                    instanceMap[bridgeObj.customData.instanceId] = bridgeObj;
                }
            }

            // 中央曲線部 (bridge) のベジェ曲線の計算・反映
            if (bridgeObj && startObj && endObj) {
                rebuildFlexibleRailBridge(bridgeObj, startObj, endObj);
            }
        }
    });

    // ジョイント接続の復元
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

    // 画面状態（UI）の更新
    updateUIState();
}

function onGeneralTransform(target) {
    if (!target) return;
    detachMovedRailJoints(target);

    // 操作対象が範囲選択 (activeSelection) の場合、含まれるすべてのフレキシブルレールのブリッジを更新
    if (target.type === 'activeSelection') {
        const targetFlexibleIds = new Set();
        target.getObjects().forEach(obj => {
            if (obj && obj.customData && obj.customData.flexibleId) {
                targetFlexibleIds.add(obj.customData.flexibleId);
            }
        });

        targetFlexibleIds.forEach(flexibleId => {
            updateFlexibleBridgeById(flexibleId);
        });
    } 
    // 操作対象が単体のフレキシブルレール構成パーツである場合、端部移動・回転に合わせてブリッジベジェ曲線を再計算
    else if (target.customData && target.customData.flexibleId) {
        updateFlexibleBridgeById(target.customData.flexibleId);
    }

    updateJointIndicators();
}

/**
 * 指定された flexibleId に対応するブリッジ・起点・終点オブジェクトを取得し、再構築または同期を実行する
 * @param {string} flexibleId 対象のフレキシブルレールID
 * @returns {void}
 */
function updateFlexibleBridgeById(flexibleId) {
    if (!flexibleId) {
        throw new Error("[updateFlexibleBridgeById] flexibleId is missing.");
    }

    const allObjects = canvas.getObjects();
    const bridge = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_bridge');
    const start = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_start');
    const end = allObjects.find(o => o.customData && o.customData.flexibleId === flexibleId && o.customData.railType === 'flexible_end');

    if (!bridge || !start || !end) {
        throw new Error(`[updateFlexibleBridgeById] Complete 3-piece set not found for flexibleId: ${flexibleId}`);
    }

    // 変形ロック中（isLocked === true）の判定
    const isLocked = bridge.customData?.partOptions?.isLocked || 
                     start.customData?.partOptions?.isLocked || 
                     end.customData?.partOptions?.isLocked;

    if (isLocked) {
        // ロック中は形状再構築ではなく、bridge の動きに沿って両端の仮想レールをリアルタイム同期する
        syncLockedFlexibleParts(bridge);
    }
    else {
        // ロック解除中の通常時は従来通りベジェ曲線を再構築
        rebuildFlexibleRailBridge(bridge, start, end);
    }
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
        
        // カタログからではなく customData.nodes を優先的に参照するように変更
        const nodesSource = rail.customData.nodes || (railCatalog.items[rail.customData.partId] ? railCatalog.items[rail.customData.partId].nodes : null);
        if (!nodesSource) return;

        const absoluteNodes = getAbsoluteNodePos(rail);

        absoluteNodes.forEach(node => {
            if (!node) return;

            // 修正: nodeSource から該当ノードを検索し、存在しない場合は描画をスキップ（仮想パーツ対応）
            const catalogNode = nodesSource.find(n => n.id === node.nodeId);
            if (!catalogNode) return;

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
                originX: 'center',
                originY: 'center',
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
        canvas.setZoom(0.5);
        canvas.setViewportTransform([0.5, 0, 0, 0.5, 400, 300]);
    }
}
