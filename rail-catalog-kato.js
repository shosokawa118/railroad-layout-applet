/**
 * =============================================================================
 * RAIL PARTS CATALOG - DEFINITION GUIDE & NODE DESIGN RULES FOR AI / DEVELOPERS
 * =============================================================================
 * 
 * [AUTO-CONNECT NODE EVALUATION ORDER]
 * The auto-connection engine searches for open nodes in the following priority order:
 *   Node 1 -> Node 2 -> ... -> Max Node ID -> Node 0
 * 
 * [NODE ASSIGNMENT GUIDELINES]
 * 1. Node ID 0 (Primary Entrance / Facing Left / Lowest Priority):
 *    - Main entry node on the LEFT side of the part.
 *    - Assigned the lowest priority (evaluated last) to prevent reverse auto-connections.
 * 
 * 2. Node ID 1 (Primary Exit / Mainline / Highest Priority):
 *    - Main straight/forward exit corresponding to Node 0.
 *    - Chosen first for standard linear auto-connection.
 *    - For curved turnouts lacking a pure straight track, designate the main route
 *      (e.g., larger curve radius) as Node 1 based on editor discretion.
 * 
 * 3. Node ID 2 to N (Secondary Exits & Right-Side Nodes):
 *    - Branching exits or additional nodes on the RIGHT side (same side as Node 1).
 *    - Assign sequentially from TOP to BOTTOM (Node 2, 3, 4...).
 * 
 * 4. Highest Node IDs (Secondary Entrances & Left-Side Nodes):
 *    - Additional entry nodes on the LEFT side (same side as Node 0, e.g., double tracks/crossovers).
 *    - Assign sequentially from BOTTOM to TOP.
 *    - This ensures that after evaluating all right-side exits, the engine falls back
 *      to the remaining left-side entrances from bottom to top, finishing at Node 0.
 * 
 * [EXCEPTIONS]
 * Special geometries like turntables or balloon loops do not strictly require this rule.
 * Assign node priorities based on their primary intended usage flow.
 * =============================================================================
 */

// =============================================================
// KATO ユニトラック / ユニトラックコンパクト パーツライブラリ
// =============================================================
registerRailParts({
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
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": 0 },
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
    }
});
