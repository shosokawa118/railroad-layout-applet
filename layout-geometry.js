// =============================================================
// 鉄道模型レイアウトジェネレータ - 幾何・座標計算
// バージョン: VER-LAYOUT-GEO-G1
// =============================================================
console.log("幾何・座標計算（JS）が読み込まれました: VER-LAYOUT-GEO-G1");

function generateGenericRailData(catalogItem) {
    const basePaths = [];
    const railPaths = [];
    
    const sys = catalogItem && catalogItem.systemId ? railCatalog.systems[catalogItem.systemId] : null;
    const BALLAST_WIDTH = sys ? sys.ballastWidth : 16;
    const halfW = BALLAST_WIDTH / 2;

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
        if (shape.type === "polygon" && Array.isArray(shape.points) && shape.points.length > 0) {
            let polyPath = "";
            shape.points.forEach((pt, idx) => {
                polyPath += (idx === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
                updateBounds(pt.x, pt.y);
            });
            polyPath += " Z";
            basePaths.push(polyPath);
        }
        else if (shape.type === "line") {
            const len = shape.length;
            const shapeAngle = shape.angle || 0;
            const rad = (shapeAngle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            const offX = shape.offsetX || 0;
            const offY = shape.offsetY || 0;

            const x1_loc = -len / 2, y1_loc = -halfW;
            const x2_loc =  len / 2, y2_loc = -halfW;
            const x3_loc =  len / 2, y3_loc =  halfW;
            const x4_loc = -len / 2, y4_loc =  halfW;

            const trans = (lx, ly) => ({
                x: offX + (lx * cos - ly * sin),
                y: offY + (lx * sin + ly * cos)
            });

            const p1 = trans(x1_loc, y1_loc);
            const p2 = trans(x2_loc, y2_loc);
            const p3 = trans(x3_loc, y3_loc);
            const p4 = trans(x4_loc, y4_loc);

            basePaths.push(`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`);
            
            updateBounds(p1.x, p1.y); updateBounds(p2.x, p2.y);
            updateBounds(p3.x, p3.y); updateBounds(p4.x, p4.y);

            if (shouldRenderRails) {
                const r1_start = trans(-len / 2, -halfGauge);
                const r1_end   = trans( len / 2, -halfGauge);
                const r2_start = trans(-len / 2,  halfGauge);
                const r2_end   = trans( len / 2,  halfGauge);

                railPaths.push(`M ${r1_start.x} ${r1_start.y} L ${r1_end.x} ${r1_end.y}`);
                railPaths.push(`M ${r2_start.x} ${r2_start.y} L ${r2_end.x} ${r2_end.y}`);
            }
        }
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
            const sweepIn  = arcAngle >= 0 ? 1 : 0;

            basePaths.push(`M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArcFlag} ${sweepOut} ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArcFlag} ${1 - sweepIn} ${x4} ${y4} Z`);
            
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

    const geoCenterX = (minX !== Infinity && maxX !== -Infinity) ? minX + (maxX - minX) / 2 : 0;
    const geoCenterY = (minY !== Infinity && maxY !== -Infinity) ? minY + (maxY - minY) / 2 : 0;

    return {
        basePaths: basePaths,
        railPaths: railPaths,
        centerX: geoCenterX,
        centerY: geoCenterY
    };
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

function canConnectNodes(railA, nodeAId, railB, nodeBId) {
    const itemA = railCatalog.items[railA.customData.partId];
    const itemB = railCatalog.items[railB.customData.partId];
    if (!itemA || !itemB) return false;

    const sysA = railCatalog.systems[itemA.systemId];
    const sysB = railCatalog.systems[itemB.systemId];
    if (!sysA || !sysB) return false;

    const connA = (itemA.nodes[nodeAId] && itemA.nodes[nodeAId].connectorType) || sysA.connectorType;
    const connB = (itemB.nodes[nodeBId] && itemB.nodes[nodeBId].connectorType) || sysB.connectorType;

    return connA === connB;
}

function getMovedRailIds(target) {
    if (!target) return [];
    if (target.customData && target.customData.isRail) return [target.customData.instanceId];
    if (target.type === 'activeSelection') {
        return target.getObjects().filter(o => o && o.customData && o.customData.isRail).map(o => o.customData.instanceId);
    }
    return [];
}
