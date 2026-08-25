// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン
// バージョン: VER-DYNAMIC-WIDTH-U10
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-DYNAMIC-WIDTH-U10");

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

/**
 * コントロール（ハンドル）の可視性を設定する共通関数
 * 8箇所のサイズ変更用ハンドルを非表示にし、上部回転ハンドル(mtr)のみ表示する
 */
function configureControls(fabricObj) {
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
}

function generateGenericRailData(catalogItem) {
    const basePaths = [];
    const railPaths = [];
    
    const sys = catalogItem && catalogItem.systemId ? railCatalog.systems[catalogItem.systemId] : null;
    const BALLAST_WIDTH = sys ? sys.ballastWidth : 16;
    const halfW = BALLAST_WIDTH / 2;

    // --- システム & トラックタイプの判定 ---
    const trackType = (catalogItem && catalogItem.trackType) || (sys && sys.trackType) || 'standard';
    const gauge = sys ? sys.gauge : null;
    const shouldRenderRails = (trackType === 'standard') && (typeof gauge === 'number' && gauge > 0);
    const halfGauge = shouldRenderRails ? gauge / 2 : 0;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    function updateBounds(x, y) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
    }

    if (!catalogItem || !catalogItem.shapes) {
        return { basePaths: ["M 0 0 L 10 0"], railPaths: [], centerX: 0, centerY: 0 };
    }

    catalogItem.shapes.forEach(shape => {
        // --- 1. 多角形（Polygon） ---
        if (shape.type === "polygon" && Array.isArray(shape.points) && shape.points.length > 0) {
            let polyPath = "";
            shape.points.forEach((pt, idx) => {
                polyPath += (idx === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
                updateBounds(pt.x, pt.y);
            });
            polyPath += " Z";
            basePaths.push(polyPath);
        }
        // --- 2. 直線（Line） ---
        else if (shape.type === "line") {
            const x1 = (shape.offsetX || 0) - shape.length / 2;
            const x2 = (shape.offsetX || 0) + shape.length / 2;
            const y1 = (shape.offsetY || 0) - halfW;
            const y2 = (shape.offsetY || 0) + halfW;
            
            // 道床（面）
            basePaths.push(`M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z`);
            
            updateBounds(x1, y1); updateBounds(x2, y1);
            updateBounds(x2, y2); updateBounds(x1, y2);

            // 動的レール（線）
            if (shouldRenderRails) {
                const centerY = shape.offsetY || 0;
                const railY1 = centerY - halfGauge;
                const railY2 = centerY + halfGauge;
                railPaths.push(`M ${x1} ${railY1} L ${x2} ${railY1}`);
                railPaths.push(`M ${x1} ${railY2} L ${x2} ${railY2}`);
            }
        } 
        // --- 3. 曲線（Arc） ---
        else if (shape.type === "arc") {
            const r = shape.radius;
            const rOut = r + halfW;
            const rIn = Math.max(0, r - halfW);
            
            const startDeg = shape.startAngle;
            const arcAngle = shape.arcAngle;
            const endDeg = startDeg + arcAngle;
            const startRad = (startDeg * Math.PI) / 180;
            const endRad = (endDeg * Math.PI) / 180;
            
            const cX = shape.centerX || 0;
            const cY = shape.centerY || 0;

            const x1 = cX + rOut * Math.cos(startRad);
            const y1 = cY + rOut * Math.sin(startRad);
            const x2 = cX + rOut * Math.cos(endRad);
            const y2 = cY + rOut * Math.sin(endRad);
            const x3 = cX + rIn  * Math.cos(endRad);
            const y3 = cY + rIn  * Math.sin(endRad);
            const x4 = cX + rIn  * Math.cos(startRad);
            const y4 = cY + rIn  * Math.sin(startRad);

            const largeArcFlag = Math.abs(arcAngle) >= 180 ? 1 : 0;
            const sweepOut = arcAngle >= 0 ? 1 : 0;
            const sweepIn  = arcAngle >= 0 ? 0 : 1;

            // 道床（面）
            basePaths.push(`M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArcFlag} ${sweepOut} ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArcFlag} ${sweepIn} ${x4} ${y4} Z`);
            
            updateBounds(x1, y1); updateBounds(x2, y2);
            updateBounds(x3, y3); updateBounds(x4, y4);

            const ccwDistance = (fromDeg, toDeg) => ((toDeg - fromDeg) % 360 + 360) % 360;
            [0, 90, 180, 270].forEach(cardinal => {
                let contains = arcAngle >= 0 ? ccwDistance(startDeg, cardinal) <= arcAngle : ccwDistance(cardinal, startDeg) <= -arcAngle;
                if (contains) {
                    const rad = (cardinal * Math.PI) / 180;
                    updateBounds(cX + rOut * Math.cos(rad), cY + rOut * Math.sin(rad));
                    updateBounds(cX + rIn  * Math.cos(rad), cY + rIn  * Math.sin(rad));
                }
            });

            // 動的レール（線）
            if (shouldRenderRails) {
                const rRailIn = r - halfGauge;
                const rRailOut = r + halfGauge;

                const rx1 = cX + rRailOut * Math.cos(startRad);
                const ry1 = cY + rRailOut * Math.sin(startRad);
                const rx2 = cX + rRailOut * Math.cos(endRad);
                const ry2 = cY + rRailOut * Math.sin(endRad);

                const rx3 = cX + rRailIn * Math.cos(startRad);
                const ry3 = cY + rRailIn * Math.sin(startRad);
                const rx4 = cX + rRailIn * Math.cos(endRad);
                const ry4 = cY + rRailIn * Math.sin(endRad);

                railPaths.push(`M ${rx1} ${ry1} A ${rRailOut} ${rRailOut} 0 ${largeArcFlag} ${sweepOut} ${rx2} ${ry2}`);
                railPaths.push(`M ${rx3} ${ry3} A ${rRailIn} ${rRailIn} 0 ${largeArcFlag} ${sweepOut} ${rx4} ${ry4}`);
            }
        }
    });

    // BoundingBoxの幾何学中心を計算
    const geoCenterX = (minX !== Infinity && maxX !== -Infinity) ? minX + (maxX - minX) / 2 : 0;
    const geoCenterY = (minY !== Infinity && maxY !== -Infinity) ? minY + (maxY - minY) / 2 : 0;

    return {
        basePaths: basePaths,
        railPaths: railPaths,
        centerX: geoCenterX,
        centerY: geoCenterY
    };
}

function addRailToCanvas(partId) {
    if (!canvas) return null;

    const catalogItem = railCatalog.items[partId];
    if (!catalogItem) {
        console.error("未定義のパーツです:", partId);
        return null;
    }

    const initialLeft = 250 + (railCount % 5) * 25;
    const initialTop = 450 + (railCount % 5) * 25;
    const currentId = `rail-${railCount}`;
    railCount++;

    const geoData = generateGenericRailData(catalogItem);

    // 1. 道床オブジェクト (グレー塗潰し)
    const baseObjects = geoData.basePaths.map(pStr => {
        return new fabric.Path(pStr, {
            fill: '#888888',
            stroke: null,
            originX: 'center',
            originY: 'center'
        });
    });

    // 2. レールオブジェクト (暗色・線の太さ1.5)
    const railObjects = geoData.railPaths.map(pStr => {
        return new fabric.Path(pStr, {
            fill: null,
            stroke: '#222222',
            strokeWidth: 1.5,
            strokeLineCap: 'round',
            originX: 'center',
            originY: 'center'
        });
    });

    // Group オブジェクトとしてまとめる
    let railObject = new fabric.Group([...baseObjects, ...railObjects], {
        left: initialLeft, 
        top: initialTop,
        originX: 'center', 
        originY: 'center', 
        angle: 0
    });

    // 変形ロック＆スケーリングハンドルの非表示設定適用
    configureControls(railObject);

    railObject.customData = { 
        instanceId: currentId, 
        partId: partId, 
        isRail: true,
        geoCenterX: geoData.centerX,
        geoCenterY: geoData.centerY
    };

    canvas.add(railObject);
    
    railObject.on('moving', function() { onGeneralTransform(this); });
    railObject.on('rotating', function() { onGeneralTransform(this); });

    if (railCount === 1) {
        canvas.on('object:moving', function(options) { if (options && options.target) onGeneralTransform(options.target); });
        canvas.on('object:rotating', function(options) { if (options && options.target) onGeneralTransform(options.target); });
        
        // 範囲選択（複数選択）時のコントロール変形ロックをリスナーに登録
        const disableSelectionScaling = (e) => {
            const activeObject = e.target;
            if (activeObject && activeObject.type === 'activeSelection') {
                configureControls(activeObject);
            }
        };

        canvas.on('selection:created', disableSelectionScaling);
        canvas.on('selection:updated', disableSelectionScaling);
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
        targetRails = activeObject.getObjects().filter(o => o.customData && o.customData.isRail);
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

function importLayoutData(layoutData, isOverwrite = true) {
    if (!canvas || !layoutData || !Array.isArray(layoutData.rails)) {
        alert("無効なJSONフォーマットです。");
        return;
    }

    if (isOverwrite) {
        canvas.clear();
        globalJoints = [];
        railCount = 0;
    }

    const idMap = {};

    layoutData.rails.forEach(r => {
        if (!r || !r.partId) return;
        const newObj = addRailToCanvas(r.partId);
        if (newObj) {
            const newId = newObj.customData.instanceId;
            idMap[r.instanceId] = newId;

            newObj.set({ left: r.x, top: r.y, angle: r.angle });
            newObj.setCoords();
        }
    });

    if (Array.isArray(layoutData.joints)) {
        layoutData.joints.forEach(j => {
            if (!j) return;
            const mappedA = idMap[j.railA] || j.railA;
            const mappedB = idMap[j.railB] || j.railB;

            globalJoints.push({
                railA: mappedA, nodeA: j.nodeA,
                railB: mappedB, nodeB: j.nodeB
            });
        });
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

function getAbsoluteNodePos(rail) {
    if (!rail || !rail.customData) return [];
    const catalog = railCatalog.items[rail.customData.partId];
    if (!catalog) return [];
    
    const cx = rail.customData.geoCenterX || 0;
    const cy = rail.customData.geoCenterY || 0;
    
    if (rail.group && rail.group.type === 'activeSelection') {
        const angleRad = (rail.angle * Math.PI) / 180;
        return catalog.nodes.map(node => {
            const lx = node.relX - cx;
            const ly = node.relY - cy;

            const localX = rail.left + (lx * Math.cos(angleRad) - ly * Math.sin(angleRad));
            const localY = rail.top  + (lx * Math.sin(angleRad) + ly * Math.cos(angleRad));
            const point = new fabric.Point(localX, localY);
            const absPoint = fabric.util.transformPoint(point, rail.group.calcTransformMatrix());
            const absAngle = (rail.group.angle + rail.angle + node.facingAngle) % 360;
            return { nodeId: node.id, x: absPoint.x, y: absPoint.y, angle: absAngle };
        });
    }

    const angleRad = (rail.angle * Math.PI) / 180;
    return catalog.nodes.map(node => {
        const lx = node.relX - cx;
        const ly = node.relY - cy;

        const absX = rail.left + (lx * Math.cos(angleRad) - ly * Math.sin(angleRad));
        const absY = rail.top  + (lx * Math.sin(angleRad) + ly * Math.cos(angleRad));
        const absAngle = (rail.angle + node.facingAngle) % 360;
        return { nodeId: node.id, x: absX, y: absY, angle: absAngle };
    });
}

function isNodeOccupied(railId, nodeId) {
    return globalJoints.some(j => 
        j && ((j.railA === railId && j.nodeA === nodeId) || (j.railB === railId && j.nodeB === nodeId))
    );
}

function onGeneralTransform(target) {
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

function loadDebugSampleLayout() {
    if (!canvas || typeof INITIAL_SAMPLE_LAYOUT === 'undefined') return;
    importLayoutData(INITIAL_SAMPLE_LAYOUT, true);
    canvas.setZoom(0.35);
    canvas.setViewportTransform([0.35, 0, 0, 0.35, 250, 100]);
    console.log("[%s] サンプル小判型エンドレスを展開しました！", "VER-DYNAMIC-WIDTH-U10");
}
