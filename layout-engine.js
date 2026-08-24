// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン (動的道床幅描画版)
// バージョン: VER-DYNAMIC-WIDTH-U4
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-DYNAMIC-WIDTH-U4");

let globalJoints = [];
let railCount = 0;
let isFirstMoveFrame = true;

function generateGenericRailData(catalogItem) {
    let combinedSvgPath = "";
    
    // ★ システム定義から道床幅を取得（デフォルト: 16）
    const sys = catalogItem && catalogItem.systemId ? railCatalog.systems[catalogItem.systemId] : null;
    const BALLAST_WIDTH = sys ? sys.ballastWidth : 16;
    const halfW = BALLAST_WIDTH / 2;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    function updateBounds(x, y) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
    }

    if (!catalogItem || !catalogItem.shapes) {
        return { pathStr: "M 0 0 L 10 0", centerX: 5, centerY: 0 };
    }

    catalogItem.shapes.forEach(shape => {
        if (shape.type === "line") {
            const x1 = (shape.offsetX || 0) - shape.length / 2;
            const x2 = (shape.offsetX || 0) + shape.length / 2;
            const y1 = (shape.offsetY || 0) - halfW;
            const y2 = (shape.offsetY || 0) + halfW;
            
            combinedSvgPath += ` M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z `;
            
            updateBounds(x1, y1); updateBounds(x2, y1);
            updateBounds(x2, y2); updateBounds(x1, y2);
        } 
        else if (shape.type === "arc") {
            const r = shape.radius;
            const rOut = r + halfW;
            const rIn = r - halfW;
            
            const startDeg = shape.startAngle;
            const endDeg = shape.startAngle + shape.arcAngle;
            const startRad = (startDeg * Math.PI) / 180;
            const endRad = (endDeg * Math.PI) / 180;
            
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

            [0, 90, 180, 270].forEach(cardinal => {
                let normStart = ((startDeg % 360) + 360) % 360;
                let normEnd = normStart + shape.arcAngle;
                let target = cardinal;
                if (target < normStart) target += 360;

                if (target >= normStart && target <= normEnd) {
                    const rad = (cardinal * Math.PI) / 180;
                    updateBounds(cX + rOut * Math.cos(rad), cY + rOut * Math.sin(rad));
                    updateBounds(cX + rIn * Math.cos(rad), cY + rIn * Math.sin(rad));
                }
            });
        }
    });

    const geoCenterX = minX + (maxX - minX) / 2;
    const geoCenterY = minY + (maxY - minY) / 2;

    return {
        pathStr: combinedSvgPath,
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
    
    let railObject = new fabric.Path(geoData.pathStr, {
        fill: '#888888',
        pathOffset: new fabric.Point(geoData.centerX, geoData.centerY)
    });

    railObject.set({
        left: initialLeft, top: initialTop,
        originX: 'center', originY: 'center', angle: 0,
        hasControls: true, lockScalingX: true, lockScalingY: true
    });

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
    console.log("[%s] サンプル小判型エンドレスをピュア数式自動計算で100%%復元しました！", "VER-DYNAMIC-WIDTH-U4");
}
