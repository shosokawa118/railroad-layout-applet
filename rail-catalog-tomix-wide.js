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
// TOMIX ワイドPCレール パーツライブラリ (rail-catalog-tomix-wide.js)
// =============================================================
registerRailParts({
    // =========================================================
    // ワイドPC直線レール (S280-WP / S140-WP)
    // =========================================================
    "TOMIX-W280": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S280-WP-F",
        description: "ワイドPCレール S280-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 140,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W140": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S140-WP-F",
        description: "ワイドPCレール S140-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 70,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドPCアプローチレール (水平 ↔ カント 傾斜変化用)
    // =========================================================
    "TOMIX-CR317-22.5-V-L": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR317-22.5-WP-F(L)",
        description: "ワイドPCアプローチレール CR317-22.5-WP (左カント入り口)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": 1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    },
    "TOMIX-CR317-22.5-V-R": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR317-22.5-WP-F(R)",
        description: "ワイドPCアプローチレール CR317-22.5-WP (右カント入り口)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    },

    // =========================================================
    // ワイドPCカント曲線レール (固定傾斜角)
    // =========================================================
    "TOMIX-C317-22.5-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C317-22.5-WP-F",
        description: "ワイドPCカント曲線レール C317-22.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": 1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    }
});
