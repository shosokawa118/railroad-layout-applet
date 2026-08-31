// =============================================================
// 鉄道模型レイアウトジェネレータ - 幾何・座標計算
// バージョン: VER-LAYOUT-GEO-G1
// =============================================================
console.log("幾何・座標計算（JS）が読み込まれました: VER-LAYOUT-GEO-G1");

function generateGenericRailData(catalogItem) {
    const basePaths = [];
    const railPaths = [];
    
    const sys = catalogItem && catalogItem.systemId ? railCatalog.systems[catalogItem.systemId] : null;
    
    // パーツ個別の ballastWidth オーバーライドを優先取得
    const BALLAST_WIDTH = (catalogItem && typeof catalogItem.ballastWidth === 'number')
        ? catalogItem.ballastWidth
        : (sys ? sys.ballastWidth : 16);

    const halfW = BALLAST_WIDTH / 2;

    const gauge = sys ? sys.gauge : null;
    const shouldRenderRails = (typeof gauge === 'number' && gauge > 0);
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
        else if (shape.type === "path" && shape.pathData) {
            basePaths.push(shape.pathData);

            const commandRegex = /([a-zA-Z])([^a-zA-Z]*)/g;
            let match;
            let currentX = 0, currentY = 0;

            while ((match = commandRegex.exec(shape.pathData)) !== null) {
                const cmd = match[1];
                const isRel = (cmd === cmd.toLowerCase());
                const upperCmd = cmd.toUpperCase();
                const args = match[2].trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
                
                if (args.length === 0) continue;

                if (upperCmd === 'M' || upperCmd === 'L') {
                    for (let i = 0; i < args.length - 1; i += 2) {
                        const x = isRel ? currentX + args[i] : args[i];
                        const y = isRel ? currentY + args[i + 1] : args[i + 1];
                        updateBounds(x, y);
                        currentX = x;
                        currentY = y;
                    }
                } else if (upperCmd === 'A' && args.length >= 7) {
                    for (let i = 0; i <= args.length - 7; i += 7) {
                        const rx = args[i];
                        const ry = args[i + 1];
                        const largeArcFlag = args[i + 3];
                        const sweepFlag = args[i + 4];
                        const endX = isRel ? currentX + args[i + 5] : args[i + 5];
                        const endY = isRel ? currentY + args[i + 6] : args[i + 6];

                        // 1. 終点を bounds に追加（中心点座標は updateBounds に追加しない）
                        updateBounds(endX, endY);

                        // 2. 始点と終点から円弧の中心 (cx, cy) を逆算
                        const startX = currentX;
                        const startY = currentY;
                        const mx = (startX + endX) / 2;
                        const my = (startY + endY) / 2;
                        const dx = (startX - endX) / 2;
                        const dy = (startY - endY) / 2;

                        const dSq = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
                        if (dSq < 1 && rx > 0 && ry > 0) {
                            const factor = Math.sqrt(Math.max(0, 1 / dSq - 1)) * (largeArcFlag === sweepFlag ? -1 : 1);
                            const cx = mx + factor * (-dy * (rx / ry));
                            const cy = my + factor * (dx * (ry / rx));

                            // 始点角と終点角（ラジアン）を算出
                            const startAngle = Math.atan2((startY - cy) / ry, (startX - cx) / rx);
                            const endAngle = Math.atan2((endY - cy) / ry, (endX - cx) / rx);

                            // 3. 真右(0), 真下(PI/2), 真左(PI), 真上(3PI/2) の4方向の極値を判定
                            const cardinals = [
                                { angle: 0,           px: cx + rx, py: cy },       // 真右 (0°)
                                { angle: Math.PI / 2, px: cx,      py: cy + ry },  // 真下 (90°)
                                { angle: Math.PI,     px: cx - rx, py: cy },       // 真左 (180°)
                                { angle: 3 * Math.PI / 2, px: cx,  py: cy - ry }   // 真上 (270°)
                            ];

                            cardinals.forEach(card => {
                                let inArc = false;
                                if (sweepFlag === 1) { // 時計回り
                                    let diff = endAngle - startAngle;
                                    if (diff < 0) diff += 2 * Math.PI;
                                    let aDiff = card.angle - startAngle;
                                    if (aDiff < 0) aDiff += 2 * Math.PI;
                                    inArc = aDiff <= diff;
                                } else { // 反時計回り
                                    let diff = startAngle - endAngle;
                                    if (diff < 0) diff += 2 * Math.PI;
                                    let aDiff = startAngle - card.angle;
                                    if (aDiff < 0) aDiff += 2 * Math.PI;
                                    inArc = aDiff <= diff;
                                }

                                // 範囲内に含まれていれば極値座標のみを bounds に追加
                                if (inArc) {
                                    updateBounds(card.px, card.py);
                                }
                            });
                        }

                        currentX = endX;
                        currentY = endY;
                    }
                }
            }
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
    if (!railA || !railB || !railCatalog || !railCatalog.items) return false;

    const catalogA = railCatalog.items[railA.customData.partId];
    const catalogB = railCatalog.items[railB.customData.partId];
    if (!catalogA || !catalogB) return false;

    const nodeA = catalogA.nodes.find(n => n.id === nodeAId);
    const nodeB = catalogB.nodes.find(n => n.id === nodeBId);
    if (!nodeA || !nodeB) return false;

    // カタログコアの判定関数を呼び出す（ジオメトリ側に重複ロジックは不要）
    return isJointCompatible(nodeA, catalogA, nodeB, catalogB);
}

function getMovedRailIds(target) {
    if (!target) return [];
    if (target.customData && target.customData.isRail) return [target.customData.instanceId];
    if (target.type === 'activeSelection') {
        return target.getObjects().filter(o => o && o.customData && o.customData.isRail).map(o => o.customData.instanceId);
    }
    return [];
}

/**
 * 2つの絶対座標ノードの位置および向き（対向角）が接続許容範囲内にあるか判定する
 * @param {Object} nodeA - ノードA (x, y, angle)
 * @param {Object} nodeB - ノードB (x, y, angle)
 * @param {number} maxDist - 許容最大距離 (px)
 * @param {number} maxAngleError - 許容最大角度誤差 (度)
 * @returns {boolean}
 */
function isNodePositionCompatible(nodeA, nodeB, maxDist = 8, maxAngleError = 10) {
    if (!nodeA || !nodeB) return false;

    const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
    if (dist > maxDist) return false;

    let angleDiff = Math.abs((nodeA.angle - nodeB.angle) % 360);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;

    const angleError = Math.abs(180 - angleDiff);

    return angleError <= maxAngleError;
}
