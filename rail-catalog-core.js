// =============================================================
// 鉄道模型レイアウトジェネレータ - カタログコア
// =============================================================

/**
 * [DEFAULT JOINT GROUP INHERITANCE RULES]
 * 1. Node level: node.jointGroup (highest priority)
 * 2. System/Catalog level: catalog.defaultJointGroup
 * 3. Fallback level: Default single-track unijoiner array (supports 25mm, 33mm, single)
 * 
 * NOTE: Joint compatibility is evaluated SOLELY via `jointGroup`.
 */
const DEFAULT_UNIJOINER_SINGLE = [
    "unijoiner-single",
    "unijoiner-25mm",
    "unijoiner-33mm"
];

const railCatalog = {
    systems: {
        "KATO-UNITRACK-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラック (N)",
            gauge: 9, ballastWidth: 25,
            defaultJointGroup: DEFAULT_UNIJOINER_SINGLE,
            libraryFile: "rail-catalog-kato.js"
        },
        "KATO-UNITRACK-COMPACT-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラックコンパクト (N)",
            gauge: 9, ballastWidth: 25,
            defaultJointGroup: DEFAULT_UNIJOINER_SINGLE,
            libraryFile: "rail-catalog-kato.js"
        },
        "KATO-UNITRAM-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラム (N)",
            gauge: 9, ballastWidth: 37,
            defaultJointGroup: "unijoiner-25mm", // ユニトラムのデフォルトは25mm間隔複線
            libraryFile: "rail-catalog-unitram.js"
        },
        "TOMIX-FINETRACK-N": {
            scale: "N", brand: "TOMIX", systemName: "ファイントラック (N)",
            gauge: 9, ballastWidth: 18.5,
            defaultJointGroup: "tomix-clapper",
            libraryFile: "rail-catalog-tomix.js"
        },
        "TOMIX-MINICURVE-N": {
            scale: "N", brand: "TOMIX", systemName: "ミニカーブ (N)",
            gauge: 9, ballastWidth: 18.5,
            defaultJointGroup: "tomix-clapper",
            libraryFile: "rail-catalog-tomix.js"
        },
        "TOMIX-WIDETRAM-N": {
            scale: "N", brand: "TOMIX", systemName: "ワイドトラムレール (N)",
            gauge: 9, ballastWidth: 37,
            defaultJointGroup: "tomix-clapper", // ファイントラックと完全互換
            libraryFile: "rail-catalog-widetram.js"
        }
    },
    items: {}
};

/**
 * 各個別ライブラリファイルからパーツデータを追加登録するための共通関数
 */
function registerRailParts(partsMap) {
    Object.assign(railCatalog.items, partsMap);
}

/**
 * ノードの実効的な jointGroup 配列を取得する（フォールバック制御）
 */
function getEffectiveJointGroup(node, part) {
    const catalog = part ? railCatalog.systems[part.systemId] : null;

    const rawGroup = node.jointGroup 
        || catalog?.defaultJointGroup 
        || DEFAULT_UNIJOINER_SINGLE;

    return Array.isArray(rawGroup) ? rawGroup : [rawGroup];
}

/**
 * 2つのノード間の接合互換性を判定する（積集合判定）
 */
function isJointCompatible(nodeA, partA, nodeB, partB) {
    const groupA = getEffectiveJointGroup(nodeA, partA);
    const groupB = getEffectiveJointGroup(nodeB, partB);

    return groupA.some(g => groupB.includes(g));
}
