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
// TOMIX ワイドトラムレール パーツライブラリ
// =============================================================
registerRailParts({
    // =========================================================
    // 直線レール
    // =========================================================
    "TOMIX-S140-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S140-WT",
        description: "ワイドトラムレール S140-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 60.75,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 60.75,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S70-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S70-WT",
        description: "ワイドトラムレール S70-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 35,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 25.75,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 25.75,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドトラム 端数直線レール
    // =========================================================
    "TOMIX-S47.5-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S47.5-WT",
        description: "ワイドトラムレール S47.5-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -23.75, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 23.75,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -14.5, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -14.5, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 14.5,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 14.5,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 47.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S37-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S37-WT",
        description: "ワイドトラムレール S37-WT(F) (側面ジョイントなし)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -18.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 18.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 37, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S18.5-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S18.5-WT",
        description: "ワイドトラムレール S18.5-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 9.25,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドトラム 交差線路
    // =========================================================
    "TOMIX-X37-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "X37-WT",
        description: "ワイドトラム交差レール X37-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -18.5, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 18.5,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": 0,     "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "rail-end", "relX": 0,     "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0 },
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0, "angle": 90 }
        ]
    },

    // =========================================================
    // 曲線レール
    // =========================================================
    "TOMIX-C103-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C103-30-WT",
        description: "ワイドトラムスーパーミニカーブレール C103-30-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -26.66, "relY": 0,  "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 26.66,  "relY": 0, "facingAngle": 15.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": -11.03, "relY": 15.72,  "facingAngle": 82.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": 11.03,  "relY": 15.72,  "facingAngle": 97.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -15.86, "relY": -20.97, "facingAngle": -97.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": 15.86,  "relY": -20.97, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 99.49, "startAngle": 255.0 }]
    },
    "TOMIX-C103-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C103-60-WT",
        description: "ワイドトラムスーパーミニカーブレール C103-60-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -51.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 51.50,  "relY": 0, "facingAngle": 30.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": -32.34, "relY": 10.69, "facingAngle": 67.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": 32.34,  "relY": 10.69, "facingAngle": 112.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -46.50, "relY": -22.84, "facingAngle": -112.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": 46.50,  "relY": -22.84, "facingAngle": -67.5 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 60, "centerX": 0, "centerY": 89.20, "startAngle": 240.0 }]
    },
    "TOMIX-C140-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C140-30-WT",
        description: "ワイドトラムミニカーブレール C140-30-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 36.23,  "relY": 0, "facingAngle": 15.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -15.86, "relY": 14.86, "facingAngle": 82.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": 15.86,  "relY": 14.86, "facingAngle": 97.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": -21.84, "facingAngle": -97.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": 20.69,  "relY": -21.84, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
    },
    "TOMIX-C140-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C140-60-WT",
        description: "ワイドトラムミニカーブレール C140-60-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 70.00,  "relY": 0, "facingAngle": 30.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -46.50, "relY": 8.92, "facingAngle": 67.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": 46.50,  "relY": 8.92, "facingAngle": 112.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -60.66, "relY": -25.07, "facingAngle": -112.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": 60.66,  "relY": -25.07, "facingAngle": -67.5 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
    },
    "TOMIX-C177-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C177-30-WT",
        description: "ワイドトラムミニカーブレール C177-30-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointType": "rail-end", "relX": 45.81,  "relY": 0, "facingAngle": 15.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": 13.91, "facingAngle": 82.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": 20.69,  "relY": 13.91, "facingAngle": 97.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": -25.52, "relY": -22.79, "facingAngle": -97.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": 25.52,  "relY": -22.79, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
    },
    "TOMIX-C177-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C177-60-WT",
        description: "ワイドトラムミニカーブレール C177-60-WT(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointType": "rail-end", "relX": 88.50,  "relY": 0, "facingAngle": 30.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -60.66, "relY": 7.15, "facingAngle": 67.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": 60.66,  "relY": 7.15, "facingAngle": 112.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": -74.82, "relY": -27.29, "facingAngle": -112.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": 74.82,  "relY": -27.29, "facingAngle": -67.5 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
    },

    // =========================================================
    // ポイントレール・分岐ユニット
    // =========================================================
    "TOMIX-WT-PL140-30": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-PL140-30",
        description: "ワイドトラム ミニポイント N-PL140-30(F) 相当品 (左分岐)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35.0, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 35.0,  "relY": 0,      "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": 35.0,  "relY": -18.76, "facingAngle": -30.0 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -35.0, "centerY": -140.0, "startAngle": 90 }
        ]
    },
    "TOMIX-WT-PR140-30": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-PR140-30",
        description: "ワイドトラム ミニポイント N-PR140-30(F) 相当品 (右分岐)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 35.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": 35.0,  "relY": 18.76, "facingAngle": 30.0 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": -35.0, "centerY": 140.0, "startAngle": 270 }
        ]
    },
    "TOMIX-WT-SIDING-L": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-SIDING-L",
        description: "ワイドトラム 待避線分岐ユニット (左 / 全長140mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 0,   "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 0,   "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": 70,  "relY": -37, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -70, "centerY": -140, "startAngle": 90 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": 70,  "centerY": 103,  "startAngle": 240 }
        ]
    },
    "TOMIX-WT-SIDING-R": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-SIDING-R",
        description: "ワイドトラム 待避線分岐ユニット (右 / 全長140mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 0,  "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 0,  "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": 70,  "relY": 37, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": -70, "centerY": 140,  "startAngle": 270 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": 70,  "centerY": -103, "startAngle": 120 }
        ]
    },
    "TOMIX-WT-CROSSOVER-LH": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-CROSSOVER-LH",
        description: "ワイドトラム 片渡り線ユニット (左上がり / 全長140mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 18.5,  "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 18.5,  "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": -70, "relY": -18.5, "facingAngle": 180 },
            { "id": 3, "jointType": "rail-end", "relX": 70,  "relY": -18.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 18.5 },
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": -18.5 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": -70, "centerY": 121.5,  "startAngle": 270 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": 70,  "centerY": -121.5, "startAngle": 120 }
        ]
    },
    "TOMIX-WT-CROSSOVER-RH": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-CROSSOVER-RH",
        description: "ワイドトラム 片渡り線ユニット (右上がり / 全長140mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70, "relY": 18.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX": 70,  "relY": 18.5, "facingAngle": 0 },
            { "id": 2, "jointType": "rail-end", "relX": -70, "relY": -18.5,  "facingAngle": 180 },
            { "id": 3, "jointType": "rail-end", "relX": 70,  "relY": -18.5,  "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 18.5 },
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": -18.5 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -70, "centerY": -121.5, "startAngle": 90 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": 70,  "centerY": 121.5,  "startAngle": 240 }
        ]
    }
});
