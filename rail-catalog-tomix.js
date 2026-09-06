/**
 * =============================================================================
 * RAIL PARTS CATALOG - DEFINITION GUIDE & NODE DESIGN RULES FOR AI / DEVELOPERS
 * =============================================================================
 * 
 * [AUTO-CONNECT NODE EVALUATION ORDER]
 * The auto-connection engine searches for open nodes based on the following algorithm:
 *   - Parent (Selected Rail): Evaluated in DESCENDING order (Max Node ID -> ... -> Node 0)
 *   - Child (New Added Rail): Evaluated in ASCENDING order (Node 0 -> ... -> Max Node ID)
 * 
 * [NODE ID ASSIGNMENT GUIDELINES (HIGHER NUMBERS = HIGHER PRIORITY)]
 * 1. Highest Node IDs (Primary Exit / Main Extension Target):
 *    - Main straight / forward exit direction where the user most likely wants to extend next.
 *    - Assign the MAXIMUM Node ID (e.g., Node 3 for 4-node parts, Node 5 for 6-node parts).
 *    - For turnouts or junctions, allocate the highest IDs to the primary straight exit route.
 * 
 * 2. Intermediate Node IDs (Secondary Exits & Branching Routes):
 *    - Branching curve exits, crossover paths, or secondary outer track exits.
 *    - Assign sequentially below the maximum ID.
 * 
 * 3. Node ID 0 & Lower IDs (Primary Entrances & Backside Nodes):
 *    - Entry nodes located on the backward/left side of the rail part.
 *    - Node ID 0 is assigned to the main entry point (lowest evaluation priority for parent).
 *    - This ensures that parent rails extend FORWARD from their highest exit nodes into 
 *      the child rail's entry nodes (starting at Node 0), preventing unwanted reverse connections.
 * 
 * [EXCEPTIONS]
 * Special symmetrical or non-directional geometries (e.g., turntables, balloon loops) 
 * can assign IDs based on their natural logical flow.
 * =============================================================================
 */

// =============================================================
// TOMIX ファイントラック / ミニカーブ パーツライブラリ
// =============================================================
registerRailParts({
    // =========================================================
    // TOMIX 直線レール (ファイントラック 兼 ミニカーブ共有)
    // =========================================================
    "TOMIX-S280": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S280",
        description: "ストレートPCレール 280mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 140,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S140": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S140",
        description: "ストレートPCレール 140mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S70": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S70",
        description: "ストレートPCレール 70mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 35,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // TOMIX その他直線レール
    // =========================================================
    "TOMIX-S72.5": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S72.5",
        description: "ストレート(15°)PCレール 72.5mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -36.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 36.25,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S99": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S99",
        description: "ストレート(45°)PCレール 99mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -49.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 49.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 99, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S33": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S33",
        description: "端数PCレール 33mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -16.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 16.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 33, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S18.5": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S18.5",
        description: "端数PCレール 18.5mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 9.25,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-BUMPER": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S70-B",
        description: "車止めレール 70mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // TOMIX 曲線レール
    // =========================================================
    "TOMIX-C280-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C280-45",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -107.15, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 107.15,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 45, "centerX": 0, "centerY": 258.68, "startAngle": 247.5 }]
    },
    "TOMIX-C317-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C317-45",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -121.32, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 121.32,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 45, "centerX": 0, "centerY": 292.86, "startAngle": 247.5 }]
    },
    "TOMIX-C243-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C243-45",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -92.99, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 92.99,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 243, "arcAngle": 45, "centerX": 0, "centerY": 224.50, "startAngle": 247.5 }]
    },
    "TOMIX-C541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C541-15",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.61, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "relX": 70.61,  "relY": 0, "facingAngle": 7.5 }
        ],
        shapes: [{ "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 536.36, "startAngle": 262.5 }]
    },
    
    // =========================================================
    // TOMIX ミニカーブ / スーパーミニカーブ (曲線レール)
    // =========================================================
    "TOMIX-C103-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C103-30",
        description: "スーパーミニカーブレール R103-30°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -26.66, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 26.66,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 99.49, "startAngle": 255.0 }]
    },
    "TOMIX-C103-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C103-60",
        description: "スーパーミニカーブレール R103-60°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -51.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 51.50,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 60, "centerX": 0, "centerY": 89.20, "startAngle": 240.0 }]
    },
    "TOMIX-C140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C140-30",
        description: "ミニカーブレール R140-30°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 36.23,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
    },
    "TOMIX-C140-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C140-60",
        description: "ミニカーブレール R140-60°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 70.00,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
    },
    "TOMIX-C177-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C177-30",
        description: "ミニカーブレール R177-30°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 45.81,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
    },
    "TOMIX-C177-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C177-60",
        description: "ミニカーブレール R177-60°",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 88.50,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
    },

    // =========================================================
    // TOMIX ミニカーブ用 ポイントレール (長さ70mm修正版)
    // =========================================================
    "TOMIX-N-PL140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "turnout",
        name: "PL140-30",
        description: "ミニ手動ポイント N-PL140-30 (左)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35.0, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 35.0,  "relY": 0,      "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 35.0,  "relY": -18.76, "facingAngle": -30.0 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -35.0, "centerY": -140.0, "startAngle": 90 }
        ]
    },
    "TOMIX-N-PR140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "turnout",
        name: "PR140-30",
        description: "ミニ手動ポイント N-PR140-30 (右)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 35.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 35.0,  "relY": 18.76, "facingAngle": 30.0 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": -35.0, "centerY": 140.0, "startAngle": 270 }
        ]
    },

    // =========================================================
    // TOMIX ポイントレール
    // =========================================================
    "TOMIX-N-PR541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "PR541-15",
        description: "電動合成枕木ポイント (右)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 68.7,  "relY": 18.3, "facingAngle": 15.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": -70.0, "centerY": 541.0, "startAngle": 270 }
        ]
    },
    "TOMIX-N-PL541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "PL541-15",
        description: "電動合成枕木ポイント (左)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 68.7,  "relY": -18.3, "facingAngle": -15.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": -15, "centerX": -70.0, "centerY": -541.0, "startAngle": 90 }
        ]
    },
    "TOMIX-5531": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "CPR317/280-45-PC",
        description: "カーブポイント C317/280-45 (右)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": 0, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "外軌(C317)", "relX": 225.74, "relY": 88.98, "facingAngle": 44 },
            { "id": 2, "jointType": "rail-end", "name": "内軌(C280)", "relX": 196.52, "relY": 85.50, "facingAngle": 46 }
        ],
        shapes: [
            { "type": "arc", "radius": 317, "arcAngle": 45, "centerX":  5.53, "centerY": 316.95, "startAngle": 269 },
            { "type": "arc", "radius": 280, "arcAngle": 45, "centerX": -4.89, "centerY": 279.96, "startAngle": 271 }
        ]
    },
    "TOMIX-5532": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "CPL317/280-45-PC",
        description: "カーブポイント C317/280-45 (左)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": 0, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "外軌(C317)", "relX": 225.74, "relY": -88.98, "facingAngle": 316 },
            { "id": 2, "jointType": "rail-end", "name": "内軌(C280)", "relX": 196.52, "relY": -85.50, "facingAngle": 314 }
        ],
        shapes: [
            { "type": "arc", "radius": 317, "arcAngle": -45, "centerX":  5.53, "centerY": -316.95, "startAngle": 91 },
            { "type": "arc", "radius": 280, "arcAngle": -45, "centerX": -4.89, "centerY": -279.96, "startAngle": 89 }
        ]
    },

    // ---------------------------------------------------------
    // 3方ポイント (subCategory: 分岐)
    // ---------------------------------------------------------
    "TOMIX-N-PLR541/280-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "N-PLR541/280-15-F",
        description: "電動3方ポイント (左R541/右R280)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端",   "relX": 0,      "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "左分岐R541","relX": 139.99, "relY": -18.38, "facingAngle": 345 },
            { "id": 2, "jointType": "rail-end", "name": "右分岐R280","relX": 140.00, "relY": 18.38,  "facingAngle": 15 },
            { "id": 3, "jointType": "rail-end", "name": "直進本線", "relX": 140.00, "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 70, "offsetY": 0 },
            { "type": "arc",  "radius": 541, "arcAngle": -15, "centerX": 0, "centerY": -541, "startAngle": 90 },
            { "type": "line", "length": 34.53, "offsetX": 17.265, "offsetY": 0 },
            { "type": "arc",  "radius": 280, "arcAngle": 15, "centerX": 34.53, "centerY": 280, "startAngle": 270 },
            { "type": "line", "length": 34.16, "offsetX": 123.50, "offsetY": 13.96, "angle": 15 }
        ]
    },
    "TOMIX-N-PRL541/280-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "N-PRL541/280-15-F",
        description: "電動3方ポイント (右R541/左R280)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端",   "relX": 0,      "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "右分岐R541","relX": 139.99, "relY": 18.38,  "facingAngle": 15 },
            { "id": 2, "jointType": "rail-end", "name": "左分岐R280","relX": 140.00, "relY": -18.38, "facingAngle": 345 },
            { "id": 3, "jointType": "rail-end", "name": "直進本線", "relX": 140.00, "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 70, "offsetY": 0 },
            { "type": "arc",  "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 541, "startAngle": 270 },
            { "type": "line", "length": 34.53, "offsetX": 17.265, "offsetY": 0 },
            { "type": "arc",  "radius": 280, "arcAngle": -15, "centerX": 34.53, "centerY": -280, "startAngle": 90 },
            { "type": "line", "length": 34.16, "offsetX": 123.50, "offsetY": -13.96, "angle": 345 }
        ]
    },

    // ---------------------------------------------------------
    // Y字ポイント (subCategory: 分岐)
    // ---------------------------------------------------------
    "TOMIX-N-PY280-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "N-PY280-15-F",
        description: "完全選択式 Y字ポイント (全長70mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35.0, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "左分岐", "relX": 32.47, "relY": -9.54,  "facingAngle": 345 },
            { "id": 2, "jointType": "rail-end", "name": "右分岐", "relX": 32.47, "relY": 9.54,   "facingAngle": 15 }
        ],
        shapes: [
            { "type": "arc", "radius": 280, "arcAngle": -15, "centerX": -35.0, "centerY": -280.0, "startAngle": 90 },
            { "type": "arc", "radius": 280, "arcAngle": 15,  "centerX": -35.0, "centerY": 280.0,  "startAngle": 270 }
        ]
    },

    // ---------------------------------------------------------
    // ダブルスリップポイント (R280複合カーブ仕様)
    // ---------------------------------------------------------
    "TOMIX-N-PXL140-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "N-PXL140-15-F",
        description: "電動ダブルスリップポイント (左)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "主線入口", "relX": -70,   "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "斜線入口", "relX": -70,   "relY": -18.76, "facingAngle": 195 },
            { "id": 2, "jointType": "rail-end", "name": "斜線出口", "relX": 70,    "relY": 18.76,  "facingAngle": 15 },
            { "id": 3, "jointType": "rail-end", "name": "主線出口", "relX": 70,    "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            // 主線・斜線（直進2本）
            { "type": "line", "length": 140,    "offsetX": 0, "offsetY": 0, "angle": 0 },
            { "type": "line", "length": 144.93, "offsetX": 0, "offsetY": 0, "angle": 15 },
            // 渡り線1 (下側: ノード0付近の直進 -> R280曲げ -> ノード2方向の直進)
            { "type": "arc",  "radius": 280,   "arcAngle": 15, "centerX": -36.23, "centerY": 280, "startAngle": 270 },
            // 渡り線2 (上側: ノード1方向の直進 -> R280曲げ -> ノード3付近の直進)
            { "type": "arc",  "radius": 280,   "arcAngle": 15, "centerX": 36.23,  "centerY": -280, "startAngle": 90 }
        ]
    },
    "TOMIX-N-PXR140-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "N-PXR140-15-F",
        description: "電動ダブルスリップポイント (右)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "主線入口", "relX": -70,   "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "斜線入口", "relX": -70,   "relY": 18.76,  "facingAngle": 165 },
            { "id": 2, "jointType": "rail-end", "name": "斜線出口", "relX": 70,    "relY": -18.76, "facingAngle": 345 },
            { "id": 3, "jointType": "rail-end", "name": "主線出口", "relX": 70,    "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            // 主線・斜線（直進2本）
            { "type": "line", "length": 140,    "offsetX": 0, "offsetY": 0, "angle": 0 },
            { "type": "line", "length": 144.93, "offsetX": 0, "offsetY": 0, "angle": 345 },
            // 渡り線1 (上側)
            { "type": "arc",  "radius": 280,   "arcAngle": -15, "centerX": -36.23, "centerY": -280, "startAngle": 90 },
            // 渡り線2 (下側)
            { "type": "arc",  "radius": 280,   "arcAngle": -15, "centerX": 36.23,  "centerY": 280, "startAngle": 270 }
        ]
    },

    // ---------------------------------------------------------
    // 交差レール (subCategory: 交差)
    // ---------------------------------------------------------
    "TOMIX-X72.5-30": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "X72.5-30-F",
        description: "交差レール X72.5-30",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "主線入口", "relX": -35.01, "relY": 9.38,  "facingAngle": 165 },
            { "id": 1, "jointType": "rail-end", "name": "交差入口", "relX": -35.01, "relY": -9.38, "facingAngle": 195 },
            { "id": 2, "jointType": "rail-end", "name": "交差出口", "relX": 35.01,  "relY": 9.38,  "facingAngle": 15 },
            { "id": 3, "jointType": "rail-end", "name": "主線出口", "relX": 35.01,  "relY": -9.38, "facingAngle": 345 }
        ],
        shapes: [
            { "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0, "angle": 345 },
            { "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0, "angle": 15 }
        ]
    },
    "TOMIX-XL140-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "XL140-15-F",
        description: "単一交差レール XL140-15 (左)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "主線入口", "relX": -71.48, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "交差入口", "relX": -69.04, "relY": -18.50, "facingAngle": 195 },
            { "id": 2, "jointType": "rail-end", "name": "交差出口", "relX": 69.04,  "relY": 18.50,  "facingAngle": 15 },
            { "id": 3, "jointType": "rail-end", "name": "主線出口", "relX": 71.48,  "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 142.96, "offsetX": 0, "offsetY": 0, "angle": 0 },
            { "type": "line", "length": 142.96, "offsetX": 0, "offsetY": 0, "angle": 15 }
        ]
    },
    "TOMIX-XR140-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "XR140-15-F",
        description: "単一交差レール XR140-15 (右)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "主線入口", "relX": -71.48, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "交差入口", "relX": -69.04, "relY": 18.50,  "facingAngle": 165 },
            { "id": 2, "jointType": "rail-end", "name": "交差出口", "relX": 69.04,  "relY": -18.50, "facingAngle": 345 },
            { "id": 3, "jointType": "rail-end", "name": "主線出口", "relX": 71.48,  "relY": 0,      "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 142.96, "offsetX": 0, "offsetY": 0, "angle": 0 },
            { "type": "line", "length": 142.96, "offsetX": 0, "offsetY": 0, "angle": 345 }
        ]
    },

    // ---------------------------------------------------------
    // エンドレールE (LEDタイプ2) - 短尺車止め
    // ---------------------------------------------------------
    "TOMIX-END-LED2": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "E-LED2-F",
        description: "エンドレールE (LEDタイプ2)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "接続端", "relX": 0, "relY": 0, "facingAngle": 180 }
        ],
        shapes: [
            { "type": "line", "length": 35, "offsetX": 17.5, "offsetY": 0 },
            {
                "type": "polygon",
                "points": [
                    { "x": 35, "y": -9 },
                    { "x": 50, "y": -9 },
                    { "x": 50, "y": 9 },
                    { "x": 35, "y": 9 }
                ]
            }
        ]
    }
});
