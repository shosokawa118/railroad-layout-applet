// =============================================================
// 鉄道模型レイアウトジェネレータ - カタログコア
// =============================================================
const railCatalog = {
    systems: {
        "KATO-UNITRACK-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラック (N)",
            gauge: 9, ballastWidth: 25, connectorType: "kato-unijoiner",
            libraryFile: "rail-catalog-kato.js"
        },
        "KATO-UNITRACK-COMPACT-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラックコンパクト (N)",
            gauge: 9, ballastWidth: 25, connectorType: "kato-unijoiner",
            libraryFile: "rail-catalog-kato.js"
        },
        "KATO-UNITRAM-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラム (N)",
            gauge: 9, ballastWidth: 37, connectorType: "kato-unijoiner",
            libraryFile: "rail-catalog-unitram.js"
        },
        "TOMIX-FINETRACK-N": {
            scale: "N", brand: "TOMIX", systemName: "ファイントラック (N)",
            gauge: 9, ballastWidth: 18.5, connectorType: "tomix-clapper",
            libraryFile: "rail-catalog-tomix.js"
        },
        "TOMIX-MINICURVE-N": {
            scale: "N", brand: "TOMIX", systemName: "ミニカーブ (N)",
            gauge: 9, ballastWidth: 18.5, connectorType: "tomix-clapper",
            libraryFile: "rail-catalog-tomix.js"
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
