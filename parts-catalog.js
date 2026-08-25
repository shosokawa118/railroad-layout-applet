// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ (コンパクト対応版)
// バージョン: VER-CATALOG-COMPACT-V1
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
        "KATO-UNITRACK-COMPACT-N": {
            scale: "N",
            brand: "KATO",
            systemName: "ユニトラックコンパクト (N)",
            ballastWidth: 25,
            connectorType: "kato-unijoiner"
        },
        "KATO-UNITRAM-N": {
            scale: "N",
            brand: "KATO",
            systemName: "ユニトラム (N)",
            ballastWidth: 37,
            connectorType: "kato-unijoiner"
        },
        "TOMIX-FINETRACK-N": {
            scale: "N",
            brand: "TOMIX",
            systemName: "ファイントラック (N)",
            ballastWidth: 18.5,
            connectorType: "tomix-clapper"
        },
        "TOMIX-MINICURVE-N": {
            scale: "N",
            brand: "TOMIX",
            systemName: "ミニカーブ / スーパーミニカーブ (N)",
            ballastWidth: 18.5,
            connectorType: "tomix-clapper"
        }
    },
    items: {
        // =========================================================
        // KATO 直線レール (通常 兼 コンパクト共有線路)
        // =========================================================
        "KATO-248": {
            systemId: "KATO-UNITRACK-N",
            compatibleSystems: ["KATO-UNITRACK-N", "KATO-UNITRACK-COMPACT-N"],
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
            compatibleSystems: ["KATO-UNITRACK-N", "KATO-UNITRACK-COMPACT-N"],
            category: "straight",
            name: "S186",
            description: "直線線路 186mm (3/4)",
            nodes: [
                { "id": 0, "relX": -93, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 93,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 186, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-124": {
            systemId: "KATO-UNITRACK-N",
            compatibleSystems: ["KATO-UNITRACK-N", "KATO-UNITRACK-COMPACT-N"],
            category: "straight",
            name: "S124",
            description: "直線線路 124mm (1/2)",
            nodes: [
                { "id": 0, "relX": -62, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 62,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 }]
        },
        "KATO-S62": {
            systemId: "KATO-UNITRACK-N",
            compatibleSystems: ["KATO-UNITRACK-N", "KATO-UNITRACK-COMPACT-N"],
            category: "straight",
            name: "S62",
            description: "直線線路 62mm (1/4)",
            nodes: [
                { "id": 0, "relX": -31, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 31,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 62, "offsetX": 0, "offsetY": 0 }]
        },
    
        // =========================================================
        // KATO その他直線レール
        // =========================================================
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
            description: "ジョイントレール 62mm (+10mm)",
            nodes: [
                { "id": 0, "name": "KATO端",  "relX": -31.0, "relY": 0, "facingAngle": 180, "connectorType": "kato-unijoiner" },
                { "id": 1, "name": "TOMIX端", "relX":  31.0, "relY": 0, "facingAngle": 0,   "connectorType": "tomix-clapper" }
            ],
            shapes: [
                {
                    "type": "polygon",
                    "points": [
                        { "x": -31, "y": -12.5 },
                        { "x":  41, "y": -12.5 },
                        { "x":  41, "y":  -9.5 },
                        { "x":  31, "y":  -9.5 },
                        { "x":  31, "y":   9.5 },
                        { "x":  41, "y":   9.5 },
                        { "x":  41, "y":  12.5 },
                        { "x": -31, "y":  12.5 }
                    ]
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
                { "type": "arc", "radius": 481, "arcAngle": -15, "centerX": -63.0, "centerY": -481.0, "startAngle": 90 }
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
                { "type": "arc", "radius": 718, "arcAngle": -15, "centerX": -93.0, "centerY": -718.0, "startAngle": 90 }
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
        // KATO ユニトラックコンパクト専用 曲線レール
        // =========================================================
        "KATO-CV117-45": {
            systemId: "KATO-UNITRACK-COMPACT-N",
            category: "curve",
            name: "CV117-45",
            description: "コンパクト曲線線路",
            nodes: [
                { "id": 0, "relX": -44.77, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 44.77,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 117, "arcAngle": 45, "centerX": 0, "centerY": 108.09, "startAngle": 247.5 }]
        },
        "KATO-CV150-45": {
            systemId: "KATO-UNITRACK-COMPACT-N",
            category: "curve",
            name: "CV150-45",
            description: "コンパクト曲線線路",
            nodes: [
                { "id": 0, "relX": -57.40, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 57.40,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 150, "arcAngle": 45, "centerX": 0, "centerY": 138.58, "startAngle": 247.5 }]
        },
        "KATO-CV183-45": {
            systemId: "KATO-UNITRACK-COMPACT-N",
            category: "curve",
            name: "CV183-45",
            description: "コンパクト曲線線路",
            nodes: [
                { "id": 0, "relX": -70.03, "relY": 0, "facingAngle": 157.5 },
                { "id": 1, "relX": 70.03,  "relY": 0, "facingAngle": 22.5 }
            ],
            shapes: [{ "type": "arc", "radius": 183, "arcAngle": 45, "centerX": 0, "centerY": 169.07, "startAngle": 247.5 }]
        },

        // =========================================================
        // KATO ユニトラックコンパクト専用 ポイントレール
        // =========================================================
        "KATO-EP150-45L": {
            systemId: "KATO-UNITRACK-COMPACT-N",
            category: "turnout",
            name: "EP150-45L",
            description: "電動ポイント150mm (左)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -62.0, "relY": 0,     "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 62.0,  "relY": 0,     "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 43.9,  "relY": -43.9, "facingAngle": -45.0 }
            ],
            shapes: [
                { "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 150, "arcAngle": -45, "centerX": -62.0, "centerY": -150.0, "startAngle": 90 }
            ]
        },
        "KATO-EP150-45R": {
            systemId: "KATO-UNITRACK-COMPACT-N",
            category: "turnout",
            name: "EP150-45R",
            description: "電動ポイント150mm (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -62.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 62.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 43.9,  "relY": 43.9, "facingAngle": 45.0 }
            ],
            shapes: [
                { "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 150, "arcAngle": 45, "centerX": -62.0, "centerY": 150.0, "startAngle": 270 }
            ]
        },

        // =========================================================
        // KATO ユニトラム (複線プレート・25mm間隔)
        // =========================================================
        
        // --- 直線軌道プレート (複線) ---
        "KATO-UNITRAM-S186D": {
            systemId: "KATO-UNITRAM-N",
            compatibleSystems: ["KATO-UNITRAM-N", "KATO-UNITRACK-N"],
            category: "straight",
            name: "複線直線軌道 186mm",
            description: "186mm 複線プレート (軌道間隔25mm)",
            nodes: [
                { "id": 0, "name": "内軌-左", "relX": -93, "relY": -12.5, "facingAngle": 180 },
                { "id": 1, "name": "外軌-左", "relX": -93, "relY":  12.5, "facingAngle": 180 },
                { "id": 2, "name": "内軌-右", "relX":  93, "relY": -12.5, "facingAngle": 0 },
                { "id": 3, "name": "外軌-右", "relX":  93, "relY":  12.5, "facingAngle": 0 }
            ],
            shapes: [
                { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
                { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 }
            ]
        },
        "KATO-UNITRAM-S124D": {
            systemId: "KATO-UNITRAM-N",
            compatibleSystems: ["KATO-UNITRAM-N", "KATO-UNITRACK-N"],
            category: "straight",
            name: "複線直線軌道 124mm",
            description: "124mm 複線プレート (軌道間隔25mm)",
            nodes: [
                { "id": 0, "name": "内軌-左", "relX": -62, "relY": -12.5, "facingAngle": 180 },
                { "id": 1, "name": "外軌-左", "relX": -62, "relY":  12.5, "facingAngle": 180 },
                { "id": 2, "name": "内軌-右", "relX":  62, "relY": -12.5, "facingAngle": 0 },
                { "id": 3, "name": "外軌-右", "relX":  62, "relY":  12.5, "facingAngle": 0 }
            ],
            shapes: [
                { "type": "line", "length": 124, "offsetX": 0, "offsetY": -12.5 },
                { "type": "line", "length": 124, "offsetX": 0, "offsetY":  12.5 }
            ]
        },

        // =========================================================
        // KATO ユニトラム (曲線・ポイント・交差点)
        // =========================================================

        // --- 曲線軌道プレート L ---
        "KATO-UNITRAM-C-L": {
            systemId: "KATO-UNITRAM-N",
            category: "curve",
            name: "複線交差点/交差角 曲線 L",
            description: "交差点 曲線軌道 (内線25mm+R180 / 外線50mm+R180)",
            nodes: [
                { "id": 0, "name": "直線側-内軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
                { "id": 1, "name": "直線側-外軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
                { "id": 2, "name": "45°頂点-内軌", "relX":  90.28, "relY": -65.22, "facingAngle": -45 },
                { "id": 3, "name": "45°頂点-外軌", "relX": 115.28, "relY": -40.22, "facingAngle": -45 }
            ],
            shapes: [
                { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": -12.5 },
                { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -37.0, "centerY": -192.5, "startAngle": 90 },
                { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": 12.5 },
                { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -12.0, "centerY": -167.5, "startAngle": 90 }
            ]
        },

        // --- 曲線軌道プレート R ---
        "KATO-UNITRAM-C-R": {
            systemId: "KATO-UNITRAM-N",
            category: "curve",
            name: "複線交差点/交差角 曲線 R",
            description: "交差点 曲線軌道 (内線25mm+R180 / 外線50mm+R180)",
            nodes: [
                { "id": 0, "name": "直線側-内軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
                { "id": 1, "name": "直線側-外軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
                { "id": 2, "name": "45°頂点-内軌", "relX":  90.28, "relY":  65.22, "facingAngle": 45 },
                { "id": 3, "name": "45°頂点-外軌", "relX": 115.28, "relY":  40.22, "facingAngle": 45 }
            ],
            shapes: [
                { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": 12.5 },
                { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -37.0, "centerY": 192.5, "startAngle": 270 },
                { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": -12.5 },
                { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -12.0, "centerY": 167.5, "startAngle": 270 }
            ]
        },

        // --- 複線分岐ポイント L ---
        "KATO-UNITRAM-TURNOUT-L": {
            systemId: "KATO-UNITRAM-N",
            category: "turnout",
            name: "複線分岐ポイント L",
            description: "電動複線分岐ポイント (124mm直進 + C-L曲線分岐)",
            nodes: [
                { "id": 0, "name": "進入-内軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
                { "id": 1, "name": "進入-外軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
                { "id": 2, "name": "直進-内軌", "relX":  62.0, "relY": -12.5, "facingAngle": 0 },
                { "id": 3, "name": "直進-外軌", "relX":  62.0, "relY":  12.5, "facingAngle": 0 },
                { "id": 4, "name": "分岐-内軌", "relX":  90.28, "relY": -65.22, "facingAngle": -45 },
                { "id": 5, "name": "分岐-外軌", "relX": 115.28, "relY": -40.22, "facingAngle": -45 }
            ],
            shapes: [
                { "type": "line", "length": 124, "offsetX": 0, "offsetY": -12.5 },
                { "type": "line", "length": 124, "offsetX": 0, "offsetY":  12.5 },
                { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": -12.5 },
                { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -37.0, "centerY": -192.5, "startAngle": 90 },
                { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": 12.5 },
                { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -12.0, "centerY": -167.5, "startAngle": 90 }
            ]
        },

        // --- 複線分岐ポイント R ---
        "KATO-UNITRAM-TURNOUT-R": {
            systemId: "KATO-UNITRAM-N",
            category: "turnout",
            name: "複線分岐ポイント R",
            description: "電動複線分岐ポイント (124mm直進 + C-R曲線分岐)",
            nodes: [
                { "id": 0, "name": "進入-内軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
                { "id": 1, "name": "進入-外軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
                { "id": 2, "name": "直進-内軌", "relX":  62.0, "relY":  12.5, "facingAngle": 0 },
                { "id": 3, "name": "直進-外軌", "relX":  62.0, "relY": -12.5, "facingAngle": 0 },
                { "id": 4, "name": "分岐-内軌", "relX":  90.28, "relY":  65.22, "facingAngle": 45 },
                { "id": 5, "name": "分岐-外軌", "relX": 115.28, "relY":  40.22, "facingAngle": 45 }
            ],
            shapes: [
                { "type": "line", "length": 124, "offsetX": 0, "offsetY": -12.5 },
                { "type": "line", "length": 124, "offsetX": 0, "offsetY":  12.5 },
                { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": 12.5 },
                { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -37.0, "centerY": 192.5, "startAngle": 270 },
                { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": -12.5 },
                { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -12.0, "centerY": 167.5, "startAngle": 270 }
            ]
        },

        // --- 十字軌道 62mm (複線) ---
        "KATO-UNITRAM-CROSS-62D": {
            systemId: "KATO-UNITRAM-N",
            category: "turnout",
            name: "複線十字軌道 62mm",
            description: "62mm×62mm 複線十字交差点軌道",
            nodes: [
                // 西 (左)
                { "id": 0, "name": "西-内軌", "relX": -31, "relY": -12.5, "facingAngle": 180 },
                { "id": 1, "name": "西-外軌", "relX": -31, "relY":  12.5, "facingAngle": 180 },
                // 東 (右)
                { "id": 2, "name": "東-内軌", "relX":  31, "relY": -12.5, "facingAngle": 0 },
                { "id": 3, "name": "東-外軌", "relX":  31, "relY":  12.5, "facingAngle": 0 },
                // 北 (上)
                { "id": 4, "name": "北-内軌", "relX":  12.5, "relY": -31, "facingAngle": 270 },
                { "id": 5, "name": "北-外軌", "relX": -12.5, "relY": -31, "facingAngle": 270 },
                // 南 (下)
                { "id": 6, "name": "南-内軌", "relX":  12.5, "relY":  31, "facingAngle": 90 },
                { "id": 7, "name": "南-外軌", "relX": -12.5, "relY":  31, "facingAngle": 90 }
            ],
            shapes: [
                // 東西 複線
                { "type": "line", "length": 62, "offsetX": 0, "offsetY": -12.5 },
                { "type": "line", "length": 62, "offsetX": 0, "offsetY":  12.5 },
                // 南北 複線 (Polygon表現)
                {
                    "type": "polygon",
                    "points": [
                        { "x": -12.5, "y": -31 }, { "x": -10.5, "y": -31 },
                        { "x": -10.5, "y":  31 }, { "x": -12.5, "y":  31 }
                    ]
                },
                {
                    "type": "polygon",
                    "points": [
                        { "x": 10.5, "y": -31 }, { "x": 12.5, "y": -31 },
                        { "x": 12.5, "y":  31 }, { "x": 10.5, "y":  31 }
                    ]
                }
            ]
        },

        // =========================================================
        // TOMIX 直線レール (ファイントラック 兼 ミニカーブ共有)
        // =========================================================
        "TOMIX-S280": {
            systemId: "TOMIX-FINETRACK-N",
            compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
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
            compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
            category: "straight",
            name: "S140-F",
            description: "ストレートPCレール 140mm",
            nodes: [
                { "id": 0, "relX": -70, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 70,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S70": {
            systemId: "TOMIX-FINETRACK-N",
            compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
            category: "straight",
            name: "S70-F",
            description: "ストレートPCレール 70mm",
            nodes: [
                { "id": 0, "relX": -35, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 35,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
        },

        // =========================================================
        // TOMIX その他直線レール
        // =========================================================
        "TOMIX-S72.5": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S72.5-F",
            description: "ストレート(15°)PCレール 72.5mm",
            nodes: [
                { "id": 0, "relX": -36.25, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 36.25,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
        },
        "TOMIX-S99": {
            systemId: "TOMIX-FINETRACK-N",
            category: "straight",
            name: "S99-F",
            description: "ストレート(45°)PCレール 99mm",
            nodes: [
                { "id": 0, "relX": -49.5, "relY": 0, "facingAngle": 180 },
                { "id": 1, "relX": 49.5,  "relY": 0, "facingAngle": 0 }
            ],
            shapes: [{ "type": "line", "length": 99, "offsetX": 0, "offsetY": 0 }]
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
        // TOMIX ミニカーブ / スーパーミニカーブ (曲線レール)
        // =========================================================
        "TOMIX-C103-30": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C103-30-F",
            description: "スーパーミニカーブレール R103-30°",
            nodes: [
                { "id": 0, "relX": -26.66, "relY": 0, "facingAngle": 165.0 },
                { "id": 1, "relX": 26.66,  "relY": 0, "facingAngle": 15.0 }
            ],
            shapes: [{ "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 99.49, "startAngle": 255.0 }]
        },
        "TOMIX-C103-60": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C103-60-F",
            description: "スーパーミニカーブレール R103-60°",
            nodes: [
                { "id": 0, "relX": -51.50, "relY": 0, "facingAngle": 150.0 },
                { "id": 1, "relX": 51.50,  "relY": 0, "facingAngle": 30.0 }
            ],
            shapes: [{ "type": "arc", "radius": 103, "arcAngle": 60, "centerX": 0, "centerY": 89.20, "startAngle": 240.0 }]
        },
        "TOMIX-C140-30": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C140-30-F",
            description: "ミニカーブレール R140-30°",
            nodes: [
                { "id": 0, "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
                { "id": 1, "relX": 36.23,  "relY": 0, "facingAngle": 15.0 }
            ],
            shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
        },
        "TOMIX-C140-60": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C140-60-F",
            description: "ミニカーブレール R140-60°",
            nodes: [
                { "id": 0, "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
                { "id": 1, "relX": 70.00,  "relY": 0, "facingAngle": 30.0 }
            ],
            shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
        },
        "TOMIX-C177-30": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C177-30-F",
            description: "ミニカーブレール R177-30°",
            nodes: [
                { "id": 0, "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
                { "id": 1, "relX": 45.81,  "relY": 0, "facingAngle": 15.0 }
            ],
            shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
        },
        "TOMIX-C177-60": {
            systemId: "TOMIX-MINICURVE-N",
            category: "curve",
            name: "C177-60-F",
            description: "ミニカーブレール R177-60°",
            nodes: [
                { "id": 0, "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
                { "id": 1, "relX": 88.50,  "relY": 0, "facingAngle": 30.0 }
            ],
            shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
        },

        // =========================================================
        // TOMIX ミニカーブ用 ポイントレール (PL140-30 / PR140-30)
        // =========================================================
        "TOMIX-N-PL140-30": {
            systemId: "TOMIX-MINICURVE-N",
            category: "turnout",
            name: "N-PL140-30-F",
            description: "ミニ手動ポイント N-PL140-30 (左)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 51.2,  "relY": -37.5, "facingAngle": -30.0 }
            ],
            shapes: [
                { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -70.0, "centerY": -140.0, "startAngle": 90 }
            ]
        },
        "TOMIX-N-PR140-30": {
            systemId: "TOMIX-MINICURVE-N",
            category: "turnout",
            name: "N-PR140-30-F",
            description: "ミニ手動ポイント N-PR140-30 (右)",
            nodes: [
                { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
                { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },
                { "id": 2, "name": "分岐端", "relX": 51.2,  "relY": 37.5, "facingAngle": 30.0 }
            ],
            shapes: [
                { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
                { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": -70.0, "centerY": 140.0, "startAngle": 270 }
            ]
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
                { "type": "arc", "radius": 541, "arcAngle": -15, "centerX": -70.0, "centerY": -541.0, "startAngle": 90 }
            ]
        }
    }
};

const partsCatalog = railCatalog.items;
console.log("スキーマ分離完了: VER-CATALOG-SCHEMA-V2");
