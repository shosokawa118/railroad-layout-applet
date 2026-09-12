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
