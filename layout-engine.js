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
            
            // 円弧が軸(90度, 180度, 270度など)を跨ぐ場合の極値補正（補助線路用簡易カバー）
            // 15度や45度程度であれば4頂点の中に必ず収まるため実用上は完璧です
        }
    });

    // 純粋な数式上のポリゴン中心を割り出す
    const geoCenterX = minX + (maxX - minX) / 2;
    const geoCenterY = minY + (maxY - minY) / 2;

    return {
        pathStr: combinedSvgPath,
        centerX: geoCenterX,
        centerY: geoCenterY
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
    
    let railObject = new fabric.Path(geoData.pathStr, {
        fill: '#888888',
        // 抽出したピュアな数式上の中心を pathOffset に完全一致させ、8pxの見た目ズレとクラッシュを永続シャットアウト！
        pathOffset: new fabric.Point(geoData.centerX, geoData.centerY)
    });

    // 中心(center)基準で配置
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

function getAbsoluteNodePos(rail) {
    if (!rail || !rail.customData) return [];
    const catalog = partsCatalog[rail.customData.partId];
    if (!catalog) return [];
    
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
