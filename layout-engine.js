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

    // 複数選択（activeSelection）の場合は一律で伸縮不可とする
    const isSelection = fabricObj.type === 'activeSelection';

    // 単一オブジェクトかつ可変長レール（variable-straight）かどうかの判定（必ずboolean値にする）
    const isVariable = !isSelection && !!(
        fabricObj.customData && 
        fabricObj.customData.partId && 
        railCatalog && 
        railCatalog.items && 
        railCatalog.items[fabricObj.customData.partId] && 
        railCatalog.items[fabricObj.customData.partId].dynamicType === 'variable-straight'
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

    // --- 【追加】操作開始時の状態保持 ---
    canvas.on('mouse:down', (options) => {
        if (options && options.target) {
            captureDragStart(options.target);
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

        // --- 【追加】スナップ完了後・差分記録前に文字の向きを自動調整 ---
        if (activeObj) {
            updateRailTextOrientation(activeObj);
            canvas.requestRenderAll();
        }

        // --- 移動終了・スナップ完了後の差分記録 ---
        if (activeObj) {
            captureDragEnd(activeObj);
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

/**
 * 可変長レールの変形中リアルタイム制御
 */
function handleVariableRailScaling(e) {
    const target = e.target;
    if (!target || !target.customData || !e.transform) return;

    const catalogItem = railCatalog.items[target.customData.partId];
    if (!catalogItem || catalogItem.dynamicType !== 'variable-straight') return;

    const corner = e.transform.corner;
    if (corner !== 'ml' && corner !== 'mr') return;

    // 変形開始時の固定端座標が存在しない場合は処理しない
    const fixedPoint = target.customData.fixedPoint;
    if (!fixedPoint) return;

    // 上下限の取得（未定義時は処理しない）
    const minL = catalogItem.minLength;
    const maxL = catalogItem.maxLength;
    if (typeof minL !== 'number' || typeof maxL !== 'number') return;

    // 基準長
    const baseLength = (target.partOptions && typeof target.partOptions.length === 'number')
        ? target.partOptions.length
        : catalogItem.defaultLength;
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
    if (!catalogItem || catalogItem.dynamicType !== 'variable-straight') return;

    // カタログから上下限を取得（未定義時は警告して中断）
    const minL = catalogItem.minLength;
    const maxL = catalogItem.maxLength;
    if (typeof minL !== 'number' || typeof maxL !== 'number') {
        console.warn(`[${ENGINE_VERSION}] 可変長レールの上下限値(minLength/maxLength)が定義されていません: ${rail.customData.partId}`);
        return;
    }

    // 基準長の取得（未定義時は警告して中断）
    const baseLength = (rail.partOptions && typeof rail.partOptions.length === 'number')
        ? rail.partOptions.length
        : catalogItem.defaultLength;

    if (typeof baseLength !== 'number') {
        console.warn(`[${ENGINE_VERSION}] 可変長レールの基準長さ(length/defaultLength)が定義されていません: ${rail.customData.partId}`);
        return;
    }

    // 変形開始時に記録した固定端座標の取得
    const fixedPoint = rail.customData.fixedPoint;
    if (!fixedPoint) {
        console.warn(`[${ENGINE_VERSION}] 変形開始時の固定端座標が記録されていません: ${rail.customData.partId}`);
        return;
    }

    // 1. スケール適用後の長さとクランプ処理
    const oldLength = (rail.partOptions && typeof rail.partOptions.length === 'number')
        ? rail.partOptions.length
        : baseLength;
    
    const rawScaleX = Math.max(0.01, rail.scaleX || 1);
    let newLength = oldLength * rawScaleX;
    newLength = Math.max(minL, Math.min(maxL, newLength));

    // 2. 記憶していた「元の固定端」を起点に、新しい中心位置を計算
    const rad = ((rail.angle || 0) * Math.PI) / 180;
    const newHalfLen = newLength / 2;
    
    const isRightHandle = (corner === 'mr');
    const centerVectorSign = isRightHandle ? 1 : -1;
    
    const newCenterX = fixedPoint.x + (newHalfLen * centerVectorSign) * Math.cos(rad);
    const newCenterY = fixedPoint.y + (newHalfLen * centerVectorSign) * Math.sin(rad);

    // 3. プロパティ・スケール・位置の確定
    if (!rail.partOptions) rail.partOptions = {};
    rail.partOptions.length = newLength;

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
    rebuildVariableRailPaths(rail, catalogItem);

    // 5. 新しいノード位置でのスナップ・接続判定
    applyClusterSnapLogic(rail);

    rail.setCoords();
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
    const options = { partOptions: rail.partOptions };
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

// キャンバスにレールを追加する関数
function addRailToCanvas(partId, options = {}) {
    if (!canvas) return null;

    const catalogItem = railCatalog.items[partId];
    if (!catalogItem) {
        console.error(`[${ENGINE_VERSION}] 該当パーツが見つかりません (partId: "${partId}")`);
        return null;
    }

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

    // 1. customData の設定
    railObject.customData = { 
        instanceId: currentId, 
        partId: partId, 
        isRail: true,
        geoCenterX: geoData.centerX,
        geoCenterY: geoData.centerY
    };

    // 2. partOptions (可変レールの長さ等) が渡されていた場合は保持
    if (options.partOptions) {
        railObject.partOptions = JSON.parse(JSON.stringify(options.partOptions));
    } else if (typeof options.length === 'number') {
        railObject.partOptions = { length: options.length };
    }

    // 3. データ設定が完了した後にコントロールの設定を実行
    configureControls(railObject);

    const jointsBefore = typeof globalJoints !== 'undefined' ? [...globalJoints] : [];

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

    // キャンバスへ追加（位置・角度決定後）
    canvas.add(railObject);
    
    railObject.on('moving', function() { isDraggingRail = true; onGeneralTransform(this); });
    railObject.on('rotating', function() { 
        isDraggingRail = true; 
        updateRailTextOrientation(this); // 回転中も向きを更新
        onGeneralTransform(this); 
    });

    registerGlobalCanvasEvents();

    if (!options.skipAutoConnect && !options.skipSelect) {
        recordAction({
            type: 'ADD',
            rails: [{
                instanceId: railObject.customData.instanceId,
                partId: partId,
                x: railObject.left,
                y: railObject.top,
                angle: railObject.angle,
                partOptions: railObject.partOptions ? JSON.parse(JSON.stringify(railObject.partOptions)) : undefined
            }],
            jointsBefore: jointsBefore,
            jointsAfter: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
        });
    }

    if (!options.skipSelect) {
        canvas.setActiveObject(railObject);
    }

    // キャンバス追加と選択状態確定後にテキスト向きの補正を実行
    updateRailTextOrientation(railObject);

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
    const isSelectionGroup = activeObject.type === 'activeSelection';

    if (isSelectionGroup) {
        targetRails = activeObject.getObjects().filter(o => o && o.customData && o.customData.isRail);
    } else if (activeObject.customData && activeObject.customData.isRail) {
        targetRails = [activeObject];
    }

    if (targetRails.length === 0) return;

    // --- 【追加】削除実行前のUndo履歴記録 ---
    recordAction({
        type: 'DELETE',
        rails: targetRails.map(r => {
            let absX = r.left;
            let absY = r.top;
            let absAngle = r.angle;

            // 範囲選択時は相対座標になっているため、キャンバス絶対座標に変換する
            if (isSelectionGroup) {
                const matrix = r.calcTransformMatrix();
                const options = fabric.util.qrDecompose(matrix);
                absX = options.translateX;
                absY = options.translateY;
                absAngle = options.angle;
            }

            return {
                instanceId: r.customData.instanceId,
                partId: r.customData.partId,
                x: absX,
                y: absY,
                angle: absAngle
            };
        }),
        jointsBefore: typeof globalJoints !== 'undefined' ? [...globalJoints] : []
    });

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

        // ===== 修正: 基本座標のみを明示的に抽出 =====
        const railData = {
            instanceId: rail.customData.instanceId,
            partId: partId,
            x: Math.round(rail.left * 100) / 100,
            y: Math.round(rail.top * 100) / 100,
            angle: Math.round(rail.angle * 100) / 100
        };

        // ===== 修正: partOptions が存在する場合のみ追加 =====
        if (rail.partOptions && typeof rail.partOptions === 'object') {
            railData.partOptions = JSON.parse(JSON.stringify(rail.partOptions));
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

// レイアウトデータを読み込む関数
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

        // ===== 履歴をリセットして Clean 状態にする =====
        if (Array.isArray(historyUndoStack)) historyUndoStack.length = 0;
        if (Array.isArray(historyRedoStack)) historyRedoStack.length = 0;
        markAsClean();
    }

    const createdObjects = [];
    const idToInstanceMap = {};
    const instanceMap = {};

    layoutData.rails.forEach((r, idx) => {
        if (!r || !r.partId) {
            console.warn(`[${ENGINE_VERSION}] レール定義不備 (Index: ${idx})`);
            return;
        }
        
        // partOptions を addRailToCanvas に引き継いで動的サイズを適用して描画
        const addOptions = { skipAutoConnect: true, skipSelect: true };
        if (r.partOptions) {
            addOptions.partOptions = r.partOptions;
        }

        const newObj = addRailToCanvas(r.partId, addOptions);
        if (newObj) {
            newObj.set({ left: r.x, top: r.y, angle: r.angle });
            
            // ===== partOptions が存在する場合のみ復元 =====
            if (r.partOptions && typeof r.partOptions === 'object') {
                newObj.partOptions = JSON.parse(JSON.stringify(r.partOptions));
            }

            newObj.setCoords();

            // 読込データの角度 (r.angle) 適用後にテキストの向きを再計算
            updateRailTextOrientation(newObj);

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

    // 画面状態（UI）の更新
    updateUIState();
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
