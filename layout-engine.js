// =============================================================
// 鉄道模型レイアウトジェネレータ - 基本エンジン
// バージョン: VER-LAYOUT-AUTOCONNECT-E22-REFACTORED
// =============================================================
console.log("基本エンジン（JS）が読み込まれました: VER-LAYOUT-AUTOCONNECT-E22-REFACTORED");

let lastCanvasClickPos = null;
let isDraggingRail = false;
let globalEventsRegistered = false;

// --- ライブラリ動的ローダー ---
const loadedLibraries = new Set();
const loadingPromises = {};

function loadSystemLibrary(systemId) {
    if (!railCatalog || !railCatalog.systems) return Promise.reject("railCatalogが定義されていません");
    const system = railCatalog.systems[systemId];
    if (!system) return Promise.reject(`未定義のシステムIDです: ${systemId}`);

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
            resolve();
        };

        script.onerror = () => {
            delete loadingPromises[fileName];
            reject(new Error(`読み込み失敗: ${fileName}`));
        };

        document.head.appendChild(script);
    });

    return loadingPromises[fileName];
}

function configureControls(fabricObj) {
    if (!fabricObj) return;

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

    if (fabricObj.type === 'activeSelection') {
        const mtrControl = fabricObj.controls.mtr;
        fabricObj.controls = { mtr: mtrControl };
    }
}

function findTargetNodeForAutoConnect(parentRail) {
    if (!parentRail || !parentRail.customData) return null;
    const catalog = railCatalog.items[parentRail.customData.partId];
    if (!catalog || !catalog.nodes || catalog.nodes.length === 0) return null;

    const nodes = catalog.nodes;
    const searchOrder = nodes.slice(1).map(n => n.id);
    searchOrder.push(nodes[0].id);

    const railId = parentRail.customData.instanceId;
    for (let nodeId of searchOrder) {
        if (!isNodeOccupied(railId, nodeId)) return nodeId;
    }

    return null;
}

function alignRailToParentNode(newRail, parentRail, parentNodeId) {
    const parentNodes = getAbsoluteNodePos(parentRail);
    const parentNode = parentNodes.find(n => n.nodeId === parentNodeId);
    if (!parentNode) return;

    const newCatalog = railCatalog.items[newRail.customData.partId];
    if (!newCatalog || !newCatalog.nodes || newCatalog.nodes.length === 0) return;

    const newNode0 = newCatalog.nodes[0];
    const newCx = newRail.customData.geoCenterX || 0;
    const newCy = newRail.customData.geoCenterY || 0;

    const targetAngle = (parentNode.angle + 180 - newNode0.facingAngle + 360) % 360;
    newRail.set({ angle: targetAngle });

    const lx = newNode0.relX - newCx;
    const ly = newNode0.relY - newCy;
    const rad = (targetAngle * Math.PI) / 180;

    const newLeft = parentNode.x - (lx * Math.cos(rad) - ly * Math.sin(rad));
    const newTop  = parentNode.y - (lx * Math.sin(rad) + ly * Math.cos(rad));

    newRail.set({ left: newLeft, top: newTop });
    newRail.setCoords();

    addGlobalJointIfFree(
        parentRail.customData.instanceId, parentNodeId,
        newRail.customData.instanceId, newNode0.id
    );

    const allRails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);
    const newId = newRail.customData.instanceId;
    const newNodes = getAbsoluteNodePos(newRail);

    allRails.forEach(otherRail => {
        if (!otherRail || !otherRail.customData) return;
        const otherId = otherRail.customData.instanceId;
        if (otherId === newId) return;

        const otherNodes = getAbsoluteNodePos(otherRail);

        newNodes.forEach(nNode => {
            if (isNodeOccupied(newId, nNode.nodeId)) return;

            otherNodes.forEach(oNode => {
                if (isNodeOccupied(otherId, oNode.nodeId)) return;
                if (!canConnectNodes(newRail, nNode.nodeId, otherRail, oNode.nodeId)) return;

                const dist = Math.sqrt(Math.pow(nNode.x - oNode.x, 2) + Math.pow(nNode.y - oNode.y, 2));
                if (dist < 8) {
                    addGlobalJointIfFree(newId, nNode.nodeId, otherId, oNode.nodeId);
                }
            });
        });
    });
}

function registerGlobalCanvasEvents() {
    if (globalEventsRegistered || !canvas) return;
    globalEventsRegistered = true;

    canvas.on('object:moving', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });

    canvas.on('object:rotating', (options) => { 
        isDraggingRail = true;
        if (options && options.target) onGeneralTransform(options.target); 
    });
    
    canvas.on('mouse:up', () => {
        if (isDraggingRail) {
            isDraggingRail = false;
            const activeObj = canvas.getActiveObject();
            if (activeObj && typeof applyClusterSnapLogic === 'function') {
                applyClusterSnapLogic(activeObj);
            }
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

function addRailToCanvas(partId) {
    if (!canvas) return null;

    const catalogItem = railCatalog.items[partId];
    if (!catalogItem) return null;

    const currentId = `rail-${railCount++}`;
    const geoData = generateGenericRailData(catalogItem);

    const baseObjects = geoData.basePaths.map(pStr => new fabric.Path(pStr, { fill: '#888888', stroke: null, originX: 'center', originY: 'center' }));
    const railObjects = geoData.railPaths.map(pStr => new fabric.Path(pStr, { fill: null, stroke: '#222222', strokeWidth: 1.5, strokeLineCap: 'round', originX: 'center', originY: 'center' }));

    const railObject = new fabric.Group([...baseObjects, ...railObjects], {
        left: 0, top: 0, originX: 'center', originY: 'center', angle: 0
    });

    configureControls(railObject);

    railObject.customData = { 
        instanceId: currentId, 
        partId: partId, 
        isRail: true,
        geoCenterX: geoData.centerX,
        geoCenterY: geoData.centerY
    };

    const activeObj = canvas.getActiveObject();
    const parentRail = (activeObj && activeObj.customData && activeObj.customData.isRail) ? activeObj : null;
    const targetNodeId = parentRail ? findTargetNodeForAutoConnect(parentRail) : null;

    if (parentRail && targetNodeId !== null) {
        alignRailToParentNode(railObject, parentRail, targetNodeId);
    } else if (lastCanvasClickPos) {
        railObject.set({ left: lastCanvasClickPos.x, top: lastCanvasClickPos.y, angle: 0 });
        railObject.setCoords();
    } else {
        railObject.set({ left: 250 + (railCount % 5) * 25, top: 450 + (railCount % 5) * 25, angle: 0 });
        railObject.setCoords();
    }

    canvas.add(railObject);
    
    railObject.on('moving', function() { isDraggingRail = true; onGeneralTransform(this); });
    railObject.on('rotating', function() { isDraggingRail = true; onGeneralTransform(this); });

    registerGlobalCanvasEvents();
    canvas.setActiveObject(railObject);

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
        targetRails = activeObject.getObjects().filter(o => o && o.customData && o.customData.isRail);
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

    const createdObjects = [];

    // 1. レールを配置順に追加（インデックス順）
    layoutData.rails.forEach(r => {
        if (!r || !r.partId) return;
        const newObj = addRailToCanvas(r.partId);
        if (newObj) {
            newObj.set({ left: r.x, top: r.y, angle: r.angle });
            newObj.setCoords();
            createdObjects.push(newObj);
        }
    });

    // 2. 案3（配列インデックス）または旧仕様（ID参照）のいずれでもジョイント復元
    if (Array.isArray(layoutData.joints)) {
        layoutData.joints.forEach(j => {
            if (!j) return;
            
            let railAId = typeof j.railA === 'number' ? createdObjects[j.railA]?.customData.instanceId : j.railA;
            let railBId = typeof j.railB === 'number' ? createdObjects[j.railB]?.customData.instanceId : j.railB;

            if (railAId && railBId) {
                addGlobalJointIfFree(railAId, j.nodeA, railBId, j.nodeB);
            }
        });
    }

    updateJointIndicators();
    canvas.requestRenderAll();
}

function onGeneralTransform(target) {
    if (!target) return;
    detachMovedRailJoints(target);
    updateJointIndicators();
}

function updateJointIndicators() {
    if (!canvas) return;
    
    const oldIndicators = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isIndicator);
    oldIndicators.forEach(obj => canvas.remove(obj));

    const rails = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    rails.forEach(rail => {
        if (!rail || !rail.customData) return;
        const railId = rail.customData.instanceId;
        const absoluteNodes = getAbsoluteNodePos(rail);

        absoluteNodes.forEach(node => {
            if (!node) return;
            const isOccupied = isNodeOccupied(railId, node.nodeId);

            const dot = new fabric.Circle({
                left: node.x, top: node.y, radius: 4,
                fill: isOccupied ? '#7cd21d' : '#ff3b30',
                stroke: '#ffffff', strokeWidth: 1, originX: 'center', originY: 'center',
                selectable: false, evented: false, customData: { isIndicator: true }
            });

            canvas.add(dot);
            canvas.bringToFront(dot);
        });
    });
}
