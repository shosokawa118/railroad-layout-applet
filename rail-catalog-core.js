// =============================================================
// 鉄道模型レイアウトジェネレータ - カタログコア
// =============================================================

/**
 * [DEFAULT JOINT GROUP INHERITANCE RULES]
 * 1. Node level: node.jointGroup (highest priority)
 * 2. System/Catalog level: catalog.defaultJointGroup
 * 3. Fallback level: Default single-track unijoiner array (supports 25mm, 33mm, single, cant)
 * 
 * NOTE: Joint compatibility is evaluated via `jointGroup` intersection and `polarity` complementarity.
 */
const DEFAULT_UNIJOINER_SINGLE = [
    "unijoiner-single",
    "unijoiner-25mm",
    "unijoiner-33mm",
    "kato-cant" // 単線レールがカント複線に接続できるように追加
];

const railCatalog = {
    systems: {
        "KATO-UNITRACK-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラック (N)",
            gauge: 9, ballastWidth: 25,
            defaultJointGroup: DEFAULT_UNIJOINER_SINGLE,
            libraryFile: "rail-catalog-kato.js"
        },
        "KATO-DOUBLETRACK-N": { // 新設: KATO 複線専用システム
            scale: "N", brand: "KATO", systemName: "複線ユニトラック (N)",
            gauge: 9, ballastWidth: 33,
            defaultJointGroup: "unijoiner-33mm",
            libraryFile: "rail-catalog-kato-double.js"
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
            defaultJointGroup: "tomix-clapper",
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
 * ノードの実効的な polarity（極性）を取得する（デフォルト: ワイルドカード "*"）
 */
function getEffectivePolarity(node) {
    // 明示的な指定があればそれを返し、未定義（undefined）なら単線・水平互換の "*" を返す
    return node.polarity ?? "*";
}

/**
 * 2つのノード間の接合互換性を判定する（規格の積集合判定 ＋ 極性の相補性判定）
 */
function isJointCompatible(nodeA, partA, nodeB, partB) {
    // 1. ジョイント規格（jointGroup）の互換性チェック（いずれか1つでも一致すればOK）
    const groupA = getEffectiveJointGroup(nodeA, partA);
    const groupB = getEffectiveJointGroup(nodeB, partB);
    const hasMatchingGroup = groupA.some(g => groupB.includes(g));

    if (!hasMatchingGroup) {
        return false;
    }

    // 2. 極性（polarity）の相補性チェック
    const polA = getEffectivePolarity(nodeA);
    const polB = getEffectivePolarity(nodeB);

    // どちらかがワイルドカード（*）であれば無条件で極性チェックをパス（単線・水平など）
    if (polA === "*" || polB === "*") {
        return true;
    }

    // 両方が数値型（カント複線など）の場合: 和が 0 であること (+1 と -1)
    if (typeof polA === "number" && typeof polB === "number") {
        return (polA + polB) === 0;
    }

    // 将来の拡張用（文字列の相補対判定など）
    return polA === polB;
}
