// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (データ完全分離版)
// バージョン: VER-FIX-PATH-L2
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-FIX-PATH-L2");

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

// 1. レールをCanvasに追加する共通関数
function addRailToCanvas(partId) {
    if (!canvas) return null;

    // 分離した parts-catalog.js からデータを読み込み
    const catalogItem = partsCatalog[partId];
    if (!catalogItem) {
        console.error("未定義のパーツです:", partId);
        return null;
    }

    const initialLeft = 200 + (railCount % 5) * 25;
    const initialTop = 450 + (railCount % 5) * 25;
    const currentId = `rail-${railCount}`;
    railCount++;

    let railObject;

    // すべての図形を「左上(0,0)」基準の絶対パス命令で描画し、原点ズレを完全に防ぐ
    if (catalogItem.type === "straight") {
        const straightPath = `M 0 8 L ${catalogItem.width} 8`;
        railObject = new fabric.Path(straightPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    } else if (catalogItem.type === "curve") {
        const r = partId === "KATO-R481-15" ? 481 : 315;
        const curvePath = `M 0 ${catalogItem.height} A ${r} ${r} 0 0 1 ${catalogItem.width} ${catalogItem.height}`;
        railObject = new fabric.Path(curvePath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    } else if (catalogItem.type === "turnout-right") {
        // 直線(高さ8固定) ＋ 分岐円弧(0,8からスタートして右下へ抜けるマルチパス)
        const turnoutPath = "M 0 8 L 126 8 M 0 8 A 481 481 0 0 1 124.9 24.5";
        railObject = new fabric.Path(turnoutPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    }

    // 回転・配置の基準を「左上（topLeft）」に固定し、Fabricの自動軸ズレを無効化
    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'left', originY: 'top', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

    railObject.customData = { instanceId: currentId, partId: partId, isRail: true };

    canvas.add(railObject);
    
    railObject.on('moving', function() {
        onGeneralMoving(this);
    });

    if (railCount === 1) {
        canvas.on('object:moving', function(options) {
            onGeneralMoving(options.target);
        });
    }

    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();
    
    return railObject;
}

// 2. 幾何学計算：ノードの「画面上の絶対座標」を計算 (ActiveSelection・左上原点基準対応)
function getAbsoluteNodePos(rail) {
    if (!rail || !rail.customData) return [];
    const catalog = partsCatalog[rail.customData.partId];
    if (!catalog) return [];
    
    // 複数選択グループ(ActiveSelection)の中の絶対座標変換
    if (rail.group && rail.group.type === 'activeSelection') {
        const angleRad = (rail.angle * Math.PI) / 180;
        return catalog.nodes.map(node => {
            const localX = rail.left + (node.relX * Math.cos(angleRad) - node.relY * Math.sin(angleRad));
            const localY = rail.top  + (node.relX * Math.sin(angleRad) + node.relY * Math.cos(angleRad));
            
            const point = new fabric.Point(localX, localY);
            const absPoint = fabric.util.transformPoint(point, rail.group.calcTransformMatrix());
            
            const absAngle = (rail.group.angle + rail.angle + node.facingAngle) % 360;
            return { nodeId: node.id, x: absPoint.x, y: absPoint.y, angle: absAngle };
        });
    }

    // 単体レールの絶対座標計算
    const angleRad = (rail.angle * Math.PI) / 180;
    return catalog.nodes.map(node => {
        const absX = rail.left + (node.relX * Math.cos(angleRad) - node.relY * Math.sin(angleRad));
        const absY = rail.top  + (node.relX * Math.sin(angleRad) + node.relY * Math.cos(angleRad));
        const absAngle = (rail.angle + node.facingAngle) % 360;
        return { nodeId: node.id, x: absX, y: absY, angle: absAngle };
    });
}

function isNodeOccupied(railId, nodeId) {
    return globalJoints.some(j => 
        (j.railA === railId && j.nodeA === nodeId) || 
        (j.railB === railId && j.nodeB === nodeId)
    );
}

function onGeneralMoving(target) {
    if (!target) return;
    if (isFirstMoveFrame) {
        const movedIds = getMovedRailIds(target);
        globalJoints = globalJoints.filter(j => {
            const hasA = movedIds.includes(j.railA);
            const hasB = movedIds.includes(j.railB);
            return (hasA && hasB) || (!hasA && !hasB);
        });
        isFirstMoveFrame = false;
    }
    updateJointIndicators();
}

function getMovedRailIds(target) {
    if (!target) return [];
    if (target.customData && target.customData.isRail) return [target.customData.instanceId];
    if (target.type === 'activeSelection') {
        return target.getObjects().filter(o => o && o.customData && o.customData.isRail).map(o => o.customData.instanceId);
    }
    return [];
}

// 3. ズームバグをガードしたインジケータ（丸）の再描画関数
function updateJointIndicators() {
    if (!canvas) return;
    
    const oldIndicators = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => canvas.remove(obj));

    const rails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    rails.forEach(rail => {
        const railId = rail.customData.instanceId;
        const absoluteNodes = getAbsoluteNodePos(rail);
        if (!absoluteNodes) return;

        absoluteNodes.forEach(node => {
            const isOccupied = isNodeOccupied(railId, node.nodeId);
            const color = isOccupied ? '#7cd21d' : '#ff3b30';
            const radius = isOccupied ? 3 : 5;

            const dot = new fabric.Circle({
                left: node.x, top: node.y, radius: radius, fill: color,
                stroke: '#ffffff', strokeWidth: 1, originX: 'center', originY: 'center',
                selectable: false, evented: false, customData: { isIndicator: true }
            });

            canvas.add(dot);
            canvas.bringToFront(dot);
        });
    });
}

// 4. サンプルレイアウトのロード関数 (分離した sample-data.js からデータを読み込み)
function loadDebugSampleLayout() {
    if (!canvas || typeof INITIAL_SAMPLE_LAYOUT === 'undefined') return;
    canvas.clear();
    globalJoints = [];
    railCount = 0;

    const instanceMap = {};
    INITIAL_SAMPLE_LAYOUT.rails.forEach(r => {
        const obj = addRailToCanvas(r.partId);
        if (obj) {
            obj.set({ left: r.x, top: r.y, angle: r.angle });
            obj.customData.instanceId = r.instanceId;
            obj.setCoords();
            instanceMap[r.instanceId] = obj;
        }
    });

    INITIAL_SAMPLE_LAYOUT.joints.forEach(j => {
        globalJoints.push({
            jointId: `j-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            railA: j.railA, nodeA: j.nodeA,
            railB: j.railB, nodeB: j.nodeB
        });
    });

    railCount = INITIAL_SAMPLE_LAYOUT.rails.length;
    
    canvas.setZoom(0.35);
    canvas.setViewportTransform([0.35, 0, 0, 0.35, 250, 100]);

    updateJointIndicators();
    canvas.requestRenderAll();
    console.log("[%s] サンプル小判型エンドレスの自動展開に成功しました！", CODE_VERSION);
}
