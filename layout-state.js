// =============================================================
// 鉄道模型レイアウトジェネレータ - データ＆状態マネージャー
// バージョン: VER-LAYOUT-STATE-S1
// =============================================================
console.log("データ＆状態マネージャー（JS）が読み込まれました: VER-LAYOUT-STATE-S1");

let globalJoints = [];
let railCount = 0;

function addGlobalJointIfFree(railAId, nodeAId, railBId, nodeBId) {
    if (!railAId || !railBId || nodeAId === undefined || nodeBId === undefined) return false;

    const exists = globalJoints.some(j => 
        j && (
            (j.railA === railAId && j.nodeA === nodeAId && j.railB === railBId && j.nodeB === nodeBId) ||
            (j.railA === railBId && j.nodeA === nodeBId && j.railB === railAId && j.nodeB === nodeAId)
        )
    );
    if (exists) return false;

    if (isNodeOccupied(railAId, nodeAId) || isNodeOccupied(railBId, nodeBId)) return false;

    globalJoints.push({
        railA: railAId, nodeA: nodeAId, railB: railBId, nodeB: nodeBId
    });
    return true;
}

function isNodeOccupied(railId, nodeId) {
    return globalJoints.some(j => 
        j && ((j.railA === railId && j.nodeA === nodeId) || (j.railB === railId && j.nodeB === nodeId))
    );
}

function detachMovedRailJoints(target) {
    if (!target) return;
    const movedIds = getMovedRailIds(target);
    if (movedIds.length === 0) return;

    globalJoints = globalJoints.filter(j => {
        if (!j) return false;
        const hasA = movedIds.includes(j.railA);
        const hasB = movedIds.includes(j.railB);
        return (hasA && hasB) || (!hasA && !hasB);
    });
}

function exportLayoutData() {
    if (!canvas) return null;
    const objects = canvas.getObjects().filter(obj => obj && obj.customData && obj.customData.isRail);

    const railsData = [];
    const instanceIdToIndexMap = {};

    objects.forEach((obj, index) => {
        instanceIdToIndexMap[obj.customData.instanceId] = index;
        railsData.push({
            partId: obj.customData.partId,
            x: Math.round(obj.left * 100) / 100,
            y: Math.round(obj.top * 100) / 100,
            angle: Math.round(obj.angle * 100) / 100
        });
    });

    const mappedJoints = [];
    globalJoints.forEach(j => {
        if (!j) return;
        const indexA = instanceIdToIndexMap[j.railA];
        const indexB = instanceIdToIndexMap[j.railB];

        if (indexA !== undefined && indexB !== undefined) {
            mappedJoints.push({
                railA: indexA,
                nodeA: j.nodeA,
                railB: indexB,
                nodeB: j.nodeB
            });
        }
    });

    return {
        version: "VER-LAYOUT-STATE-S1",
        rails: railsData,
        joints: mappedJoints
    };
}
