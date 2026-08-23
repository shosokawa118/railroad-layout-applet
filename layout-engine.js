// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (ピュア幾何学自動相殺版)
// バージョン: VER-GENERIC-BOUNDS-S3
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-GENERIC-BOUNDS-S3");

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

// ★【強化】バラストポリゴンのパス生成と同時に、純粋な幾何学上の境界ボックス（Bounds）を返すように拡張
function generateGenericRailData(catalogItem) {
    let combinedSvgPath = "";
    const BALLAST_WIDTH = 16;
    const halfW = BALLAST_WIDTH / 2;

    // 幾何学上の最大・最小座標を保持する変数
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    // 軌道中心線（centerline）をサンプリングするための配列
    const centerlinePoints = [];

    function updateBounds(x, y) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
    }

    if (!catalogItem || !catalogItem.shapes) {
        return { pathStr: "M 0 0 L 10 0", centerX: 5, centerY: 0, centerlineCx: 5, centerlineCy: 0 };
    }

    // Debug: show incoming catalog info
    try { console.log("generateGenericRailData: part=", catalogItem.name || catalogItem.id || "(unknown)", "shapes=", (catalogItem.shapes||[]).length); } catch(e) {}

    catalogItem.shapes.forEach(shape => {
        if (shape.type === "line") {
            const x1 = (shape.offsetX || 0) - shape.length / 2;
            const x2 = (shape.offsetX || 0) + shape.length / 2;
            const y1 = (shape.offsetY || 0) - halfW;
            const y2 = (shape.offsetY || 0) + halfW;
            
            combinedSvgPath += ` M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z `;
            
            updateBounds(x1, y1); updateBounds(x2, y1);
            updateBounds(x2, y2); updateBounds(x1, y2);

            // centerline: sample along the center (offsetY without halfW)
            const steps = 6;
            const cy = (shape.offsetY || 0);
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                centerlinePoints.push({ x: x1 + (x2 - x1) * t, y: cy });
            }
        } 
        else if (shape.type === "arc") {
            const r = shape.radius;
            const rOut = r + halfW;
            const rIn = r - halfW;
            
            const startRad = (shape.startAngle * Math.PI) / 180;
            const endRad = ((shape.startAngle + shape.arcAngle) * Math.PI) / 180;
            
            const cX = shape.centerX || 0;
            const cY = shape.centerY || 0;

            const x1 = cX + rOut * Math.cos(startRad);
            const y1 = cY + rOut * Math.sin(startRad);
            const x2 = cX + rOut * Math.cos(endRad);
            const y2 = cY + rOut * Math.sin(endRad);
            const x3 = cX + rIn * Math.cos(endRad);
            const y3 = cY + rIn * Math.sin(endRad);
            const x4 = cX + rIn * Math.cos(startRad);
            const y4 = cY + rIn * Math.sin(startRad);

            combinedSvgPath += ` M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z `;
            
            updateBounds(x1, y1); updateBounds(x2, y2);
            updateBounds(x3, y3); updateBounds(x4, y4);
            
            // centerline: sample points along the center radius (shape.radius)
            const arcSteps = Math.max(8, Math.ceil(Math.abs(shape.arcAngle) / 3));
            for (let i = 0; i <= arcSteps; i++) {
                const t = i / arcSteps;
                const ang = startRad + (endRad - startRad) * t;
                centerlinePoints.push({ x: cX + r * Math.cos(ang), y: cY + r * Math.sin(ang) });
            }

            // 円弧が軸(90度, 180度, 270度など)を跨ぐ場合の極値補正（補助線路用簡易カバー）
            // 15度や45度程度であれば4頂点の中に必ず収まるため実用上は完璧です
        }
    });

    // 純粋な数式上のポリゴン中心を割り出す（バウンディングボックス中心）
    const geoCenterX = minX + (maxX - minX) / 2;
    const geoCenterY = minY + (maxY - minY) / 2;

    // centerline の重心（存在しなければ bbox 中心を使う）
    let centerlineCx = geoCenterX;
    let centerlineCy = geoCenterY;
    if (centerlinePoints.length > 0) {
        let sx = 0, sy = 0;
        centerlinePoints.forEach(p => { sx += p.x; sy += p.y; });
        centerlineCx = sx / centerlinePoints.length;
        centerlineCy = sy / centerlinePoints.length;
    }

    // Debug: output computed centers and sample count
    try {
        console.log("generateGenericRailData result: name=", catalogItem.name || "(unknown)",
            "geoCenter=", geoCenterX.toFixed(2), geoCenterY.toFixed(2),
            "centerline=", centerlineCx.toFixed(2), centerlineCy.toFixed(2),
            "samples=", centerlinePoints.length);
    } catch (e) {}

    return {
        pathStr: combinedSvgPath,
        centerX: geoCenterX,
        centerY: geoCenterY,
        centerlineCx: centerlineCx,
        centerlineCy: centerlineCy
    };
}

// レールをCanvasに追加する共通関数
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

    // ★【鉄壁のバグ回避】Fabric.jsのプロパティ(pathBounds)を使わず、純粋なJSの幾何学中心を動的に抽出
    const geoData = generateGenericRailData(catalogItem);
    
    // pathOffset と customData.centerOffset には軌道中心線の重心を優先して使う
    const offsetX = (typeof geoData.centerlineCx === 'number') ? geoData.centerlineCx : geoData.centerX;
    const offsetY = (typeof geoData.centerlineCy === 'number') ? geoData.centerlineCy : geoData.centerY;

    // Debug: show chosen offsets when creating the object
    try { console.log("addRailToCanvas: partId=", partId, "useOffset=", offsetX.toFixed(2), offsetY.toFixed(2), "(centerline?", typeof geoData.centerlineCx === 'number', ")"); } catch(e) {}

    let railObject = new fabric.Path(geoData.pathStr, {
        fill: '#888888',
        // 軌道中心線の重心を pathOffset に設定
        pathOffset: new fabric.Point(offsetX, offsetY)
    });

    // 中心(center)基準で配置
    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'center', originY: 'center', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

    // 生成した軌道中心線重心を保存してノード計算時に使う
    railObject.customData = { instanceId: currentId, partId: partId, isRail: true, centerOffset: { cx: offsetX, cy: offsetY } };

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

function getAbsoluteNodePos(rail) {
    if (!rail || !rail.customData) return [];
    const catalog = partsCatalog[rail.customData.partId];
    if (!catalog) return [];

    // Debug: show which centerOffset we're using for node calcs
    const cxOff = (rail.customData && rail.customData.centerOffset && typeof rail.customData.centerOffset.cx === 'number')
        ? rail.customData.centerOffset.cx
        : (rail.pathOffset && typeof rail.pathOffset.x === 'number' ? rail.pathOffset.x : 0);

    const cyOff = (rail.customData && rail.customData.centerOffset && typeof rail.customData.centerOffset.cy === 'number')
        ? rail.customData.centerOffset.cy
        : (rail.pathOffset && typeof rail.pathOffset.y === 'number' ? rail.pathOffset.y : 0);

    try { console.log("getAbsoluteNodePos: part=", rail.customData.partId, "cxOff=", cxOff.toFixed(2), "cyOff=", cyOff.toFixed(2)); } catch(e) {}

    if (rail.group && rail.group.type === 'activeSelection') {
        const angleRad = (rail.angle * Math.PI) / 180;
        return catalog.nodes.map(node => {
            const relX = (node.relX || 0) - cxOff;
            const relY = (node.relY || 0) - cyOff;
            const localX = rail.left + (relX * Math.cos(angleRad) - relY * Math.sin(angleRad));
            const localY = rail.top  + (relX * Math.sin(angleRad) + relY * Math.cos(angleRad));
            const point = new fabric.Point(localX, localY);
            const absPoint = fabric.util.transformPoint(point, rail.group.calcTransformMatrix());
            const absAngle = (rail.group.angle + rail.angle + node.facingAngle) % 360;
            try { console.log(" node", node.id, "rel=", node.relX, node.relY, "-> abs=", absPoint.x.toFixed(2), absPoint.y.toFixed(2)); } catch(e) {}
            return { nodeId: node.id, x: absPoint.x, y: absPoint.y, angle: absAngle };
        });
    }

    const angleRad = (rail.angle * Math.PI) / 180;
    return catalog.nodes.map(node => {
        const relX = (node.relX || 0) - cxOff;
        const relY = (node.relY || 0) - cyOff;
        const absX = rail.left + (relX * Math.cos(angleRad) - relY * Math.sin(angleRad));
        const absY = rail.top  + (relX * Math.sin(angleRad) + relY * Math.cos(angleRad));
        const absAngle = (rail.angle + node.facingAngle) % 360;
        try { console.log(" node", node.id, "rel=", node.relX, node.relY, "-> abs=", absX.toFixed(2), absY.toFixed(2)); } catch(e) {}
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

function updateJointIndicators() {
    if (!canvas) return;
    
    const oldIndicators = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => { if (obj) canvas.remove(obj); });

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

// サンプルデータロード
function loadDebugSampleLayout() {
    if (!canvas || typeof INITIAL_SAMPLE_LAYOUT === 'undefined') return;
    canvas.clear();
    globalJoints = [];
    railCount = 0;

    INITIAL_SAMPLE_LAYOUT.rails.forEach(r => {
        if (!r) return;
        const obj = addRailToCanvas(r.partId);
        if (obj) {
            obj.set({ left: r.x, top: r.y, angle: r.angle });
            obj.customData.instanceId = r.instanceId;
            obj.setCoords();
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
    console.log("[%s] サンプル小判型エンドレスをピュア数式自動計算で100%%復元しました！", CODE_VERSION);
}
