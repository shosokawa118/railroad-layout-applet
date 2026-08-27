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
            { "id": 0, "jointType": "rail-end", "relX": -124, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 124,  "relY": 0, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "relX": -93, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 93,  "relY": 0, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "relX": -62, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 62,  "relY": 0, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "relX": -31, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 31,  "relY": 0, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "relX": -32, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 32,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }]
    },
    "KATO-S60": {
        systemId: "KATO-UNITRACK-N",
        category: "straight",
        name: "S60",
        description: "端数線路 60mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -30, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 30,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }]
    },
    "KATO-S29": {
        systemId: "KATO-UNITRACK-N",
        category: "straight",
        name: "S29",
        description: "端数線路 29mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -14.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 14.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 29, "offsetX": 0, "offsetY": 0 }]
    },
    "KATO-S62J": {
        systemId: "KATO-UNITRACK-N",
        category: "straight",
        name: "S62J",
        description: "ジョイントレール 62mm (+10mm)",
        nodes: [
            // Node 0 (KATO端): カタログコアのdefaultJointGroupを自動継承
            { "id": 0, "jointType": "rail-end", "name": "KATO端",  "relX": -31.0, "relY": 0, "facingAngle": 180 },
            // Node 1 (TOMIX端): TOMIX規格のjointGroupを明示指定
            { "id": 1, "jointType": "rail-end", "name": "TOMIX端", "relX":  31.0, "relY": 0, "facingAngle": 0, "jointGroup": "tomix-clapper" }
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
            { "id": 0, "jointType": "rail-end", "relX": -32, "relY": 0, "facingAngle": 180 }
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
            { "id": 0, "jointType": "rail-end", "relX": -95.29, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 95.29,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 249, "arcAngle": 45, "centerX": 0, "centerY": 230.05, "startAngle": 247.5 }]
    },
    "KATO-R282-45": {
        systemId: "KATO-UNITRACK-N",
        category: "curve",
        name: "R282-45",
        description: "曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -107.92, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 107.92,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 282, "arcAngle": 45, "centerX": 0, "centerY": 260.53, "startAngle": 247.5 }]
    },
    "KATO-R315-45": {
        systemId: "KATO-UNITRACK-N",
        category: "curve",
        name: "R315-45",
        description: "曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -120.55, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 120.55,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 291.01, "startAngle": 247.5 }]
    },
    "KATO-R348-45": {
        systemId: "KATO-UNITRACK-N",
        category: "curve",
        name: "R348-45",
        description: "曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -133.17, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 133.17,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 348, "arcAngle": 45, "centerX": 0, "centerY": 321.50, "startAngle": 247.5 }]
    },
    "KATO-R481-15": {
        systemId: "KATO-UNITRACK-N",
        category: "curve",
        name: "R481-15",
        description: "曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -62.78, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "relX": 62.78,  "relY": 0, "facingAngle": 7.5 }
        ],
        shapes: [{ "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 476.87, "startAngle": 262.5 }]
    },
    "KATO-R718-15": {
        systemId: "KATO-UNITRACK-N",
        category: "curve",
        name: "R718-15",
        description: "曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -93.75, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "relX": 93.75,  "relY": 0, "facingAngle": 7.5 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -63.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 63.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 61.9,  "relY": -16.5, "facingAngle": -15.0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -63.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 63.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 61.9,  "relY": 16.5, "facingAngle": 15.0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -93.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 93.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 91.4,  "relY": -24.5, "facingAngle": -15.0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -93.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 93.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 91.4,  "relY": 24.5, "facingAngle": 15.0 }
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
            { "id": 0, "jointType": "rail-end", "relX": -44.77, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 44.77,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 117, "arcAngle": 45, "centerX": 0, "centerY": 108.09, "startAngle": 247.5 }]
    },
    "KATO-CV150-45": {
        systemId: "KATO-UNITRACK-COMPACT-N",
        category: "curve",
        name: "CV150-45",
        description: "コンパクト曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -57.40, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 57.40,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 150, "arcAngle": 45, "centerX": 0, "centerY": 138.58, "startAngle": 247.5 }]
    },
    "KATO-CV183-45": {
        systemId: "KATO-UNITRACK-COMPACT-N",
        category: "curve",
        name: "CV183-45",
        description: "コンパクト曲線線路",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.03, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "relX": 70.03,  "relY": 0, "facingAngle": 22.5 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -62.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 62.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 43.9,  "relY": -43.9, "facingAngle": -45.0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -62.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "直進端", "relX": 62.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "name": "分岐端", "relX": 43.9,  "relY": 43.9, "facingAngle": 45.0 }
        ],
        shapes: [
            { "type": "line", "length": 124, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 150, "arcAngle": 45, "centerX": -62.0, "centerY": 150.0, "startAngle": 270 }
        ]
    }
});
