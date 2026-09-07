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
 * 
 * 2. Intermediate Node IDs (Secondary Exits & Branching Routes):
 *    - Branching curve exits, crossover paths, or secondary outer track exits.
 *    - Assign sequentially below the maximum ID.
 * 
 * 3. Node ID 0 & Lower IDs (Primary Entrances & Backside Nodes):
 *    - Entry nodes located on the backward/left side of the rail part.
 *    - Node ID 0 is assigned to the main entry point (lowest evaluation priority for parent).
 * 
 * =============================================================================
 */

/**
 * =============================================================================
 * TOMYTEC バスコレ走行システム 道路パーツライブラリ
 * =============================================================================
 * - TOMIX ワイドトラムレールと外装寸法（道床幅37mm）および側面接続の互換性を保持。
 * - 走行ラインは中央の磁石ガイド線1本（「単線レール」と同等扱い）。
 * - 接続爪は電気的接続のない専用品のため、jointGroup に "tomytec-road-joint" を割り当て。
 */

registerRailParts({
    // --- 直線道路 S70-RO ---
    "TOMYTEC-BUS-S70-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "straight",
        name: "S70-RO",
        description: "直線道路 S70-RO (長さ70mm)",
        nodes: [
            { "id": 0, "name": "進入", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "出口", "relX":  35, "relY": 0, "facingAngle": 0 },
            // 側面ジョイント（ワイドトラムと共通互換）
            { "id": 2, "name": "側面-北", "relX": 0, "relY": -18.5, "facingAngle": 270, "jointType": "side-joiner", "jointGroup": "tomix-side-joint" },
            { "id": 3, "name": "側面-南", "relX": 0, "relY":  18.5, "facingAngle": 90,  "jointType": "side-joiner", "jointGroup": "tomix-side-joint" }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }
        ]
    },

    // --- 曲線道路 C66-30-RO ---
    "TOMYTEC-BUS-C66-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C66-30-RO",
        description: "曲線道路 C66-30-RO (半径66mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "relX": -17.08, "relY": 8.84, "facingAngle": 195 },
            { "id": 1, "name": "出口", "relX":  17.08, "relY": 8.84, "facingAngle": -15 }
        ],
        shapes: [
            { "type": "arc", "radius": 66, "arcAngle": 30, "centerX": 0, "centerY": 66, "startAngle": 255 }
        ]
    },

    // --- 曲線道路 C103-30-RO ---
    "TOMYTEC-BUS-C103-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C103-30-RO",
        description: "曲線道路 C103-30-RO (半径103mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "relX": -26.66, "relY": 13.79, "facingAngle": 195 },
            { "id": 1, "name": "出口", "relX":  26.66, "relY": 13.79, "facingAngle": -15 }
        ],
        shapes: [
            { "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 103, "startAngle": 255 }
        ]
    },

    // --- 曲線道路 C140-30-RO ---
    "TOMYTEC-BUS-C140-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C140-30-RO",
        description: "曲線道路 C140-30-RO (半径140mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "relX": -36.23, "relY": 18.75, "facingAngle": 195 },
            { "id": 1, "name": "出口", "relX":  36.23, "relY": 18.75, "facingAngle": -15 }
        ],
        shapes: [
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 140, "startAngle": 255 }
        ]
    },

    // --- 曲線道路 C177-30-RO ---
    "TOMYTEC-BUS-C177-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C177-30-RO",
        description: "曲線道路 C177-30-RO (半径177mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "relX": -45.81, "relY": 23.71, "facingAngle": 195 },
            { "id": 1, "name": "出口", "relX":  45.81, "relY": 23.71, "facingAngle": -15 }
        ],
        shapes: [
            { "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 177, "startAngle": 255 }
        ]
    }
});
