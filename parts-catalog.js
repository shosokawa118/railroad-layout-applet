// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ (階層化・システム定義版)
// バージョン: VER-CATALOG-REFAC-C1
// =============================================================
const railCatalog = {
    systems: {
        "KATO-UNITRACK-N": {
            scale: "N",
            brand: "KATO",
            systemName: "ユニトラック (N)",
            ballastWidth: 25,
            connectorType: "kato-unijoiner"
        },
        "TOMIX-FINETRACK-N": {
            scale: "N",
            brand: "TOMIX",
            systemName: "ファイントラック (N)",
            ballastWidth: 18.5,
            connectorType: "tomix-clapper"
        }
    },
    items: {
        "KATO-248": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S248",
            nodes: [
                { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [
                { "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 }
            ]
        },
        "KATO-S60": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S60",
            nodes: [
                { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [
                { "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }
            ]
        },
        "KATO-S64": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S64",
            nodes: [
                { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [
                { "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }
            ]
        },
        "KATO-R315-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R315-45°",
            nodes: [
                { "id": 0, "relX": -120.55, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 120.55,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [
                { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 291.01, "startAngle": 247.5 }
            ]
        },
        "KATO-R481-15": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R481-15°",
            nodes: [
                { "id": 0, "relX": -62.78, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 62.78,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [
                { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 476.87, "startAngle": 262.5 }
            ]
        },
        "KATO-EP4-R": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "EP4番 (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -63.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 63.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 16.5, "facingAngle": 15.0 }
            ],
            shapes: [
                { "type": "line", "length": 126, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 481.0, "startAngle": 270 }
            ]
        }
    }
};

// 過去の参照との互換性を保持するためのエイリアス
const partsCatalog = railCatalog.items;
console.log("パーツカタログ（システム階層化版）読み込み成功。: VER-CATALOG-REFAC-C1");
