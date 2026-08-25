// =============================================================
// 鉄道模型レイアウトジェネレータ - カタログコア
// =============================================================
const railCatalog = {
    systems: {
        "KATO-UNITRACK-N": {
            scale: "N", brand: "KATO", systemName: "ユニトラック (N)",
            gauge: 9, ballastWidth: 25, connectorType: "kato-unijoiner",
            libraryFile: "rail-catalog-kato.js" // ← ここに統合
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

// ロード状態の管理
const loadedLibraries = new Set();
const loadingPromises = {};

/**
 * ライブラリからのパーツ登録用関数
 */
function registerRailParts(partsMap) {
    Object.assign(railCatalog.items, partsMap);
}

/**
 * 指定されたシステムのライブラリをオンデマンド読み込みする関数
 */
function loadSystemLibrary(systemId) {
    const system = railCatalog.systems[systemId];
    
    if (!system) {
        return Promise.reject(`未定義のシステムIDです: ${systemId}`);
    }
    
    const fileName = system.libraryFile;
    if (!fileName) {
        return Promise.reject(`システム ${systemId} に libraryFile が設定されていません`);
    }

    // 既にロード済みの場合は即時解決
    if (loadedLibraries.has(fileName)) {
        return Promise.resolve();
    }

    // 読み込み中の場合は既存のPromiseを返す（重複防止）
    if (loadingPromises[fileName]) {
        return loadingPromises[fileName];
    }

    // 動的 script タグ生成
    loadingPromises[fileName] = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = fileName;
        script.async = true;

        script.onload = () => {
            loadedLibraries.add(fileName);
            delete loadingPromises[fileName];
            console.log(`ライブラリ読込完了: ${fileName}`);
            resolve();
        };

        script.onerror = () => {
            delete loadingPromises[fileName];
            reject(new Error(`ライブラリの読み込みに失敗しました: ${fileName}`));
        };

        document.head.appendChild(script);
    });

    return loadingPromises[fileName];
}
