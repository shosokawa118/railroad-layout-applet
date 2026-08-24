// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ (KATO標準ラインナップ拡張版)
// バージョン: VER-CATALOG-KATO-EXP1
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
        // =========================================================
        // 直線レール (Straight Rails)
        // =========================================================
        "KATO-248": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S248 (直線 248mm)",
            nodes: [
                { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-186": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S186 (直線 186mm)",
            nodes: [
                { "id": 0, "relX": -93, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 93,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-124": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S124 (直線 124mm)",
            nodes: [
                { "id": 0, "relX": -62, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 62,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S64": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S64 (直線 64mm)",
            nodes: [
                { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S60": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S60 (端数 60mm)",
            nodes: [
                { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S29": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S29 (端数 29mm)",
            nodes: [
                { "id": 0, "relX": -14.5, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 14.5,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 29, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S62J": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S62J (ジョイント線路 62mm)",
            nodes: [
                { "id": 0, "relX": -31, "relY": 0, "facingAngle": 180, "connectorType": "kato-unijoiner" },
                { "id": 1, "relX": 31,  "relY": 0, "facingAngle": 0,   "connectorType": "tomix-clapper" }
            ],
            shapes: [{ "type": "line", "length": 62, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-BUMPER": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S64B (車止め線路 64mm)",
            nodes: [
                { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 }
                // 終端側は接続ノードなし
            ],
            shapes: [{ "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }]
        },

        // =========================================================
        // 曲線レール (Curved Rails)
        // =========================================================
        "KATO-R249-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R249-45°",
            nodes: [
                { "id": 0, "relX": -95.29, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 95.29,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 249, "arcAngle": 45, "centerX": 0, "centerY": 230.05, "startAngle": 247.5 }]
        },
        "KATO-R282-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R282-45°",
            nodes: [
                { "id": 0, "relX": -107.92, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 107.92,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 282, "arcAngle": 45, "centerX": 0, "centerY": 260.53, "startAngle": 247.5 }]
        },
        "KATO-R315-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R315-45°",
            nodes: [
                { "id": 0, "relX": -120.55, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 120.55,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 291.01, "startAngle": 247.5 }]
        },
        "KATO-R348-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R348-45°",
            nodes: [
                { "id": 0, "relX": -133.17, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 133.17,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 348, "arcAngle": 45, "centerX": 0, "centerY": 321.50, "startAngle": 247.5 }]
        },
        "KATO-R481-15": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R481-15° (ポイント調整等)",
            nodes: [
                { "id": 0, "relX": -62.78, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 62.78,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [{ "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 476.87, "startAngle": 262.5 }]
        },
        "KATO-R718-15": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R718-15° (大半径・ポイント用)",
            nodes: [
                { "id": 0, "relX": -93.75, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 93.75,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [{ "type": "arc", "radius": 718, "arcAngle": 15, "centerX": 0, "centerY": 711.83, "startAngle": 262.5 }]
        },

        // =========================================================
        // ポイントレール (Turnouts)
        // =========================================================
        "KATO-EP4-L": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "電動ポイント4番 (左)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -63.0, "relY": 0,     "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 63.0,  "relY": 0,     "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": -16.5, "facingAngle": -15.0 }
            ],
            shapes: [
                { "type": "line", "length": 126, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": -481.0, "startAngle": 90 }
            ]
        },
        "KATO-EP4-R": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "電動ポイント4番 (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -63.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 63.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 16.5, "facingAngle": 15.0 }
            ],
            shapes: [
                { "type": "line", "length": 126, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 481.0, "startAngle": 270 }
            ]
        },
        "KATO-EP6-L": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "電動ポイント6番 (左)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -93.0, "relY": 0,     "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 93.0,  "relY": 0,     "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 91.4,  "relY": -24.5, "facingAngle": -15.0 }
            ],
            shapes: [
                { "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 718, "arcAngle": 15, "centerX": -93.0, "centerY": -718.0, "startAngle": 90 }
            ]
        },
        "KATO-EP6-R": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "電動ポイント6番 (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -93.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 93.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 91.4,  "relY": 24.5, "facingAngle": 15.0 }
            ],
            shapes: [
                { "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 718, "arcAngle": 15, "centerX": -93.0, "centerY": 718.0, "startAngle": 270 }
            ]
        }
    }
};

const partsCatalog = railCatalog.items;
console.log("KATO標準ラインナップ一括追加完了: VER-CATALOG-KATO-EXP1");
