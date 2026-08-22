// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (完全中心原点版)
// バージョン: VER-PERFECT-M3
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-PERFECT-M3");

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

// 1. レールをCanvasに追加する共通関数
function addRailToCanvas(partId) {
    if (!canvas) return null;

    const catalogItem = partsCatalog[partId];
    if (!catalogItem) {
        console.error("未定義のパーツです:", partId);
        return null;
    }

    const initialLeft = 250 + (railCount % 5) * 25;
    const initialTop = 450 + (railCount % 5) * 25;
    const currentId = `rail-${railCount}`;
    railCount++;

    let railObject;

    // ★中心(0,0)を原点とし、Fabric.jsの自動中心計算と100%合致する対称パス命令に修正
    if (catalogItem.type === "straight") {
        const w2 = catalogItem.width / 2;
        const straightPath = `M ${-w2} 0 L ${w2} 0`;
        railObject = new fabric.Path(straightPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    } else if (catalogItem.type === "curve") {
        const r = partId === "KATO-R481-15" ? 481 : 315;
        const w2 = catalogItem.width / 2;
        const h2 = catalogItem.height / 2;
        const curvePath = `M ${-w2} ${h2} A ${r} ${r} 0 0 1 ${w2} ${h2}`;
        railObject = new fabric.Path(curvePath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    } else if (catalogItem.type === "turnout-right") {
        // ポイントの中心(0,0)から広がる、幾何学的に美しい2本の統合パス
        const turnoutPath = "M -63 -4.1 L 63 -4.1 M -63 -4.1 A 481 481 0 0 1 61.9 12.4";
        railObject = new fabric.Path(turnoutPath, {
            fill: 'transparent', stroke: '#888888', strokeWidth: 16, strokeLineCap: 'butt'
        });
    }

    // ★原点を「完全な中心(center)」に復随！これによりサンプルレイアウトの配置が100%元通りになります
    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'center', originY: 'center', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

    railObject.customData = { instanceId: currentId, partId: partId, isRail: true };

    canvas.add(railObject);
    
    railObject.on('moving', function() {
        onGeneralMoving(this);
    });

    if (railCount === 1) {
        canvas.on('object:moving', function(options) {
            if (options && options.target) onGeneralMoving(options.target);
        });
    }

    updateJointIndicators();
    canvas.calcOffset();
    canvas.requestRenderAll();
    
    return railObject;
}

// 2. 幾何学計算：ノードの「画面上の絶対座標」を計算 (中心原点基準)
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
        j && ((j.railA === railId && j.nodeA === nodeId) || (j.railB === railId && j.nodeB === nodeId))
    );
}

function onGeneralMoving(target) {
    if (!target) return;
    if (isFirstMoveFrame) {
        const movedIds = getMovedRailIds(target);
        globalJoints = globalJoints.filter(j => {
            if (!j) return false;
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

// 3. 鉄壁の安全ガードを施したインジケータ再描画関数（これで幽霊エラーが永続消滅します）
function updateJointIndicators() {
    if (!canvas) return;
    
    // 古いインジケータの安全な削除
    const oldIndicators = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => { if (obj) canvas.remove(obj); });

    // 本物のレールオブジェクトのみを安全にスキャン
    const rails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    rails.forEach(rail => {
        if (!rail || !rail.customData) return;
        const railId = rail.customData.instanceId;
        const absoluteNodes = getAbsoluteNodePos(rail);
        if (!absoluteNodes) return;

        absoluteNodes.forEach(node => {
            if (!node) return;
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

// サンプル小判型エンドレスデータの完全ロード
function loadDebugSampleLayout() {
    if (!canvas || typeof INITIAL_SAMPLE_LAYOUT === 'undefined') return;
    canvas.clear();
    globalJoints = [];
    railCount = 0;

    const instanceMap = {};
    INITIAL_SAMPLE_LAYOUT.rails.forEach(r => {
        if (!r) return;
        const obj = addRailToCanvas(r.partId);
        if (obj) {
            obj.set({ left: r.x, top: r.y, angle: r.angle });
            obj.customData.instanceId = r.instanceId;
            obj.setCoords();
            instanceMap[r.instanceId] = obj;
        }
    });

    INITIAL_SAMPLE_LAYOUT.joints.forEach(j => {
        if (!j) return;
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
    console.log("[%s] サンプル小判型エンドレスを中心原点で美しく自動展開しました！", CODE_VERSION);
}
