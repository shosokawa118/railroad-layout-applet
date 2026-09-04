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
 *
 * [JOINT GROUP OVERRIDE RULES FOR UNITRAM]
 * - System Default: "unijoiner-25mm" (Applied automatically to standard 25mm nodes)
 * - Node Level Override: Explicitly add `"jointGroup": "unijoiner-33mm"` ONLY to 33mm nodes.
 *   This prevents 33mm nodes from incorrectly connecting to 25mm straight tracks via `isJointCompatible`.
 * =============================================================================
 */

// =============================================================
// KATO ユニトラム (複線プレート・25mm/33mm間隔) パーツライブラリ
// =============================================================
registerRailParts({
    // --- 複線直線軌道 186mm ---
    "KATO-UNITRAM-S186D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 186mm",
        description: "186mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左(進入)", "relX": -93, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "外軌-左(進入)", "relX": -93, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            { "id": 2, "name": "外軌-右(出口)", "relX":  93, "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 3, "name": "内軌-右(出口)", "relX":  93, "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線直線軌道 124mm ---
    "KATO-UNITRAM-S124D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 124mm",
        description: "124mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左(進入)", "relX": -62, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "外軌-左(進入)", "relX": -62, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            { "id": 2, "name": "外軌-右(出口)", "relX":  62, "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 3, "name": "内軌-右(出口)", "relX":  62, "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 124, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 124, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線直線軌道 62mm ---
    "KATO-UNITRAM-S62D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 62mm",
        description: "62mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左(進入)", "relX": -31, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "外軌-左(進入)", "relX": -31, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            { "id": 2, "name": "外軌-右(出口)", "relX":  31, "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 3, "name": "内軌-右(出口)", "relX":  31, "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線曲線軌道 L (左) ---
    "KATO-UNITRAM-C-L": {
        systemId: "KATO-UNITRAM-N",
        category: "curve",
        name: "複線交差点/交差角 曲線 L",
        description: "交差点 曲線軌道 (進入25mm / 出口33mm+R180)",
        nodes: [
            { "id": 0, "name": "直線側-内軌(進入)", "relX": -62.0, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "直線側-外軌(進入)", "relX": -62.0, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            // 出口側の33mmノードに jointGroup を明示指定して上書き
            { "id": 2, "name": "45°頂点-外軌(出口)", "relX": 115.28, "relY": -40.22, "facingAngle": -45, "jointGroup": "unijoiner-33mm", "polarity": 1 },
            { "id": 3, "name": "45°頂点-内軌(出口)", "relX":  90.28, "relY": -65.22, "facingAngle": -45, "jointGroup": "unijoiner-33mm", "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -37.0, "centerY": -192.5, "startAngle": 90 },
            { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -12.0, "centerY": -167.5, "startAngle": 90 }
        ]
    },

    // --- 複線曲線軌道 R (右) ---
    "KATO-UNITRAM-C-R": {
        systemId: "KATO-UNITRAM-N",
        category: "curve",
        name: "複線交差点/交差角 曲線 R",
        description: "交差点 曲線軌道 (進入25mm / 出口33mm+R180)",
        nodes: [
            { "id": 0, "name": "直線側-外軌(進入)", "relX": -62.0, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "直線側-内軌(進入)", "relX": -62.0, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            // 出口側の33mmノードに jointGroup を明示指定して上書き
            { "id": 2, "name": "45°頂点-内軌(出口)", "relX":  90.28, "relY":  65.22, "facingAngle": 45, "jointGroup": "unijoiner-33mm", "polarity": 1 },
            { "id": 3, "name": "45°頂点-外軌(出口)", "relX": 115.28, "relY":  40.22, "facingAngle": 45, "jointGroup": "unijoiner-33mm", "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -37.0, "centerY": 192.5, "startAngle": 270 },
            { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -12.0, "centerY": 167.5, "startAngle": 270 }
        ]
    },

    // --- 複線分岐ポイント L (左) ---
    "KATO-UNITRAM-TURNOUT-L": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線分岐ポイント L",
        description: "電動複線分岐ポイント (186mm直進25mm + C-L曲線分岐33mm)",
        nodes: [
            { "id": 0, "name": "進入-内軌", "relX": -93.0, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "進入-外軌", "relX": -93.0, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            // 分岐側の33mmノードに jointGroup を明示指定して上書き
            { "id": 2, "name": "分岐-外軌", "relX":  84.28, "relY": -40.22, "facingAngle": -45, "jointGroup": "unijoiner-33mm", "polarity": 1 },
            { "id": 3, "name": "分岐-内軌", "relX":  59.28, "relY": -65.22, "facingAngle": -45, "jointGroup": "unijoiner-33mm", "polarity": -1 },
            { "id": 4, "name": "直進-外軌", "relX":  93.0,  "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 5, "name": "直進-内軌", "relX":  93.0,  "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 },
            { "type": "line", "length": 25, "offsetX": -80.5, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -68.0, "centerY": -192.5, "startAngle": 90 },
            { "type": "line", "length": 50, "offsetX": -68.0, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -43.0, "centerY": -167.5, "startAngle": 90 }
        ]
    },

    // --- 複線分岐ポイント R (右) ---
    "KATO-UNITRAM-TURNOUT-R": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線分岐ポイント R",
        description: "電動複線分岐ポイント (186mm直進25mm + C-R曲線分岐33mm)",
        nodes: [
            { "id": 0, "name": "進入-外軌", "relX": -93.0, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "進入-内軌", "relX": -93.0, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            // 分岐側の33mmノードに jointGroup を明示指定して上書き
            { "id": 2, "name": "分岐-内軌", "relX":  59.28, "relY":  65.22, "facingAngle": 45, "jointGroup": "unijoiner-33mm", "polarity": 1 },
            { "id": 3, "name": "分岐-外軌", "relX":  84.28, "relY":  40.22, "facingAngle": 45, "jointGroup": "unijoiner-33mm", "polarity": -1 },
            { "id": 4, "name": "直進-外軌", "relX":  93.0,  "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 5, "name": "直進-内軌", "relX":  93.0,  "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 },
            { "type": "line", "length": 25, "offsetX": -80.5, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -68.0, "centerY": 192.5, "startAngle": 270 },
            { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -43.0, "centerY": 167.5, "startAngle": 270 }
        ]
    },

    // --- 複線十字軌道 62mm ---
    "KATO-UNITRAM-CROSS-62D": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線十字軌道 62mm",
        description: "62mm×62mm 複線十字交差点軌道 (全ノード25mm間隔)",
        nodes: [
            { "id": 0, "name": "西-内軌(進入)", "relX": -31, "relY": -12.5, "facingAngle": 180, "polarity": 1 },
            { "id": 1, "name": "西-外軌(進入)", "relX": -31, "relY":  12.5, "facingAngle": 180, "polarity": -1 },
            { "id": 2, "name": "南-外軌(出口)", "relX": -12.5, "relY":  31, "facingAngle": 90, "polarity": 1 },
            { "id": 3, "name": "南-内軌(出口)", "relX":  12.5, "relY":  31, "facingAngle": 90, "polarity": -1 },
            { "id": 4, "name": "北-内軌(進入)", "relX":  12.5, "relY": -31, "facingAngle": 270, "polarity": 1 },
            { "id": 5, "name": "北-外軌(進入)", "relX": -12.5, "relY": -31, "facingAngle": 270, "polarity": -1 },
            { "id": 6, "name": "東-外軌(出口)", "relX":  31, "relY":  12.5, "facingAngle": 0, "polarity": 1 },
            { "id": 7, "name": "東-内軌(出口)", "relX":  31, "relY": -12.5, "facingAngle": 0, "polarity": -1 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -12.5, "angle": 0 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  12.5, "angle": 0 },
            { "type": "line", "length": 62, "offsetX": -12.5, "offsetY": 0, "angle": 90 },
            { "type": "line", "length": 62, "offsetX":  12.5, "offsetY": 0, "angle": 90 }
        ]
    }
});
