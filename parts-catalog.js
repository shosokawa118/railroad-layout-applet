// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ (スキーマ分離版)
// バージョン: VER-CATALOG-SCHEMA-V2
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
        // KATO 直線レール
        // =========================================================
        "KATO-248": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S248",
            description: "直線線路 248mm",
            nodes: [
                { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-186": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S186",
            description: "直線線路 186mm",
            nodes: [
                { "id": 0, "relX": -93, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 93,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-124": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S124",
            description: "直線線路 124mm",
            nodes: [
                { "id": 0, "relX": -62, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 62,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S62": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S62",
            description: "直線線路 62mm",
            nodes: [
                { "id": 0, "relX": -31, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 31,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 62, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S64": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S64",
            description: "直線線路 64mm",
            nodes: [
                { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S60": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S60",
            description: "端数線路 60mm",
            nodes: [
                { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S29": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S29",
            description: "端数線路 29mm",
            nodes: [
                { "id": 0, "relX": -14.5, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 14.5,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 29, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S62J": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S62J",
            description: "ジョイント線路 62mm",
            nodes: [
                { "id": 0, "relX": -31, "relY": 0, "facingAngle": 180, "connectorType": "kato-unijoiner" },
                { "id": 1, "relX": 31,  "relY": 0, "facingAngle": 0,   "connectorType": "tomix-clapper" }
            ],
            shapes: [
                { "type": "line", "length": 62, "offsetX": 0, "offsetY": 0 },
                { 
                    "type": "polygon", 
                    "points": [
                        { "x": 31, "y": -9.25 },
                        { "x": 41, "y": -9.25 },
                        { "x": 41, "y": 9.25 },
                        { "x": 31, "y": 9.25 }
                    ],
                    "fill": "#a39382",
                    "stroke": "#555555"
                }
            ]
        },
        "KATO-BUMPER": {
            systemId: "KATO-UNITRACK-N",
            category: "straight",
            name: "S64B",
            description: "車止め線路 64mm",
            nodes: [
                { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 }
            ],
            shapes: [{ "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }]
        },

        // =========================================================
        // KATO 曲線レール
        // =========================================================
        "KATO-R249-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R249-45",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -95.29, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 95.29,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 249, "arcAngle": 45, "centerX": 0, "centerY": 230.05, "startAngle": 247.5 }]
        },
        "KATO-R282-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R282-45",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -107.92, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 107.92,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 282, "arcAngle": 45, "centerX": 0, "centerY": 260.53, "startAngle": 247.5 }]
        },
        "KATO-R315-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R315-45",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -120.55, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 120.55,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 291.01, "startAngle": 247.5 }]
        },
        "KATO-R348-45": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R348-45",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -133.17, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 133.17,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 348, "arcAngle": 45, "centerX": 0, "centerY": 321.50, "startAngle": 247.5 }]
        },
        "KATO-R481-15": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R481-15",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -62.78, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 62.78,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [{ "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 476.87, "startAngle": 262.5 }]
        },
        "KATO-R718-15": {
            systemId: "KATO-UNITRACK-N",
            category: "curve",
            name: "R718-15",
            description: "曲線線路",
            nodes: [
                { "id": 0, "relX": -93.75, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 93.75,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [{ "type": "arc", "radius": 718, "arcAngle": 15, "centerX": 0, "centerY": 711.83, "startAngle": 262.5 }]
        },

        // =========================================================
        // KATO ポイントレール
        // =========================================================
        "KATO-EP4-L": {
            systemId: "KATO-UNITRACK-N",
            category: "turnout",
            name: "EP481-15L",
            description: "電動ポイント4番 (左)",
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
            name: "EP481-15R",
            description: "電動ポイント4番 (右)",
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
            name: "EP718-15L",
            description: "電動ポイント6番 (左)",
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
            name: "EP718-15R",
            description: "電動ポイント6番 (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -93.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 93.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 91.4,  "relY": 24.5, "facingAngle": 15.0 }
            ],
            shapes: [
                { "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 718, "arcAngle": 15, "centerX": -93.0, "centerY": 718.0, "startAngle": 270 }
            ]
        },

        // =========================================================
        // TOMIX 直線レール
        // =========================================================
        "TOMIX-S280": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S280-F",
            description: "ストレートPCレール 280mm",
            nodes: [
                { "id": 0, "relX": -140, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 140,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S140": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S140-F",
            description: "ストレートPCレール 140mm",
            nodes: [
                { "id": 0, "relX": -70, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 70,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S72.5": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S72.5-F",
            description: "ストレートPCレール 72.5mm",
            nodes: [
                { "id": 0, "relX": -36.25, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 36.25,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S70": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S70-F",
            description: "端数PCレール 70mm",
            nodes: [
                { "id": 0, "relX": -35, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 35,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S33": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S33-F",
            description: "端数PCレール 33mm",
            nodes: [
                { "id": 0, "relX": -16.5, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 16.5,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 33, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S18.5": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S18.5-F",
            description: "端数PCレール 18.5mm",
            nodes: [
                { "id": 0, "relX": -9.25, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 9.25,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-BUMPER": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S70-B-F",
            description: "車止めレール 70mm",
            nodes: [
                { "id": 0, "relX": -35, "relY": 0, "facingAngle": 180 }
            ],
            shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
        },

        // =========================================================
        // TOMIX 曲線レール
        // =========================================================
        "TOMIX-C280-45": {
            systemId: "TOMIX-FINETRACK-N",
            category: "curve",
            name: "C280-45-F",
            description: "カーブPCレール",
            nodes: [
                { "id": 0, "relX": -107.15, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 107.15,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 280, "arcAngle": 45, "centerX": 0, "centerY": 258.68, "startAngle": 247.5 }]
        },
        "TOMIX-C317-45": {
            systemId: "TOMIX-FINETRACK-N",
            category: "curve",
            name: "C317-45-F",
            description: "カーブPCレール",
            nodes: [
                { "id": 0, "relX": -121.32, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 121.32,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 317, "arcAngle": 45, "centerX": 0, "centerY": 292.86, "startAngle": 247.5 }]
        },
        "TOMIX-C243-45": {
            systemId: "TOMIX-FINETRACK-N",
            category: "curve",
            name: "C243-45-F",
            description: "カーブPCレール",
            nodes: [
                { "id": 0, "relX": -92.99, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 92.99,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 243, "arcAngle": 45, "centerX": 0, "centerY": 224.50, "startAngle": 247.5 }]
        },
        "TOMIX-C541-15": {
            systemId: "TOMIX-FINETRACK-N",
            category: "curve",
            name: "C541-15-F",
            description: "カーブPCレール",
            nodes: [
                { "id": 0, "relX": -70.61, "relY": 0, "facingAngle": 172.5 },
                { "id": 1, "relX": 70.61,  "relY": 0, "facingAngle": 7.5 }
            ],
            shapes: [{ "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 536.36, "startAngle": 262.5 }]
        },

        // =========================================================
        // TOMIX ポイントレール
        // =========================================================
        "TOMIX-N-PR541-15": {
            systemId: "TOMIX-FINETRACK-N",
            category: "turnout",
            name: "N-PR541-15-F",
            description: "電動合成枕木ポイント (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 68.7,  "relY": 18.3, "facingAngle": 15.0 }
            ],
            shapes: [
                { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": -70.0, "centerY": 541.0, "startAngle": 270 }
            ]
        },
        "TOMIX-N-PL541-15": {
            systemId: "TOMIX-FINETRACK-N",
            category: "turnout",
            name: "N-PL541-15-F",
            description: "電動合成枕木ポイント (左)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 68.7,  "relY": -18.3, "facingAngle": -15.0 }
            ],
            shapes: [
                { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": -70.0, "centerY": -541.0, "startAngle": 90 }
            ]
        }
    }
};

const partsCatalog = railCatalog.items;
console.log("スキーマ分離完了: VER-CATALOG-SCHEMA-V2");
