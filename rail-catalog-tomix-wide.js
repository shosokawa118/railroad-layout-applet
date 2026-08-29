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
    // 直線レール
    // =========================================================
    "TOMIX-W280": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S280-WP(F)",
        description: "ワイドPCレール S280-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 140,  "relY": 0, "facingAngle": 0 },
            // 側面ジョイント (wide-side-straight)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -100, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -100, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0,    "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0,    "relY": 18.5,  "facingAngle": 90 },
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 100,  "relY": -18.5, "facingAngle": -90 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 100,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W158.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S158.5-WP(F)",
        description: "ワイドPCレール S158.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -79.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 79.25,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -40, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -40, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 40,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 40,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 158.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W140": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S140-WP(F)",
        description: "ワイドPCレール S140-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 70,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -35, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -35, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 35,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 35,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W99": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "S99-WP(F)",
        description: "ワイドPCレール S99-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -49.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 49.5,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 99, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W72.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "S72.5-WP(F)",
        description: "ワイドPCレール S72.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -36.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 36.25,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W70": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "S70-WP(F)",
        description: "ワイドPCレール S70-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 35,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W33": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "S33-WP(F)",
        description: "ワイドPC端数レール S33-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -16.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 16.5,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 33, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W18.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "S18.5-WP(F)",
        description: "ワイドPC端数レール S18.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 9.25,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // 曲線レール (カント付きセット：小半径順)
    // =========================================================
    
    // --- R280 シリーズ ---
    "TOMIX-CR280-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR280-22.5-WP(F)",
        description: "アプローチPCレール CR280-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -52.57, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 52.57, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -24.87, "relY": 17.06,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 24.87,  "relY": 17.06,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -28.39, "relY": -19.47, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 28.39,  "relY": -19.47, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 22.5, "centerX": 0, "centerY": 274.52, "startAngle": 258.75 }]
    },
    "TOMIX-C280-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C280-45-WP(F)",
        description: "ワイドPCカーブレール C280-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -107.15, "relY": 0, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 107.15,  "relY": 0, "facingAngle": 22.5,  "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -67.27, "relY": 16.08, "facingAngle": 56.25 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 67.27,  "relY": 16.08, "facingAngle": 123.75 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -76.78, "relY": -18.35, "facingAngle": -123.75 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 76.78,  "relY": -18.35, "facingAngle": -56.25 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 45, "centerX": 0, "centerY": 258.68, "startAngle": 247.5 }]
    },
    "TOMIX-CR280-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CL280-22.5-WP(F)",
        description: "アプローチPCレール CL280-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -52.57, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 52.57, "relY": 0, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -24.87, "relY": 17.06,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 24.87,  "relY": 17.06,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -28.39, "relY": -19.47, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 28.39,  "relY": -19.47, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 22.5, "centerX": 0, "centerY": 274.52, "startAngle": 258.75 }]
    },

    // --- R317 シリーズ ---
    "TOMIX-CR317-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR317-22.5-WP(F)",
        description: "アプローチPCレール CR317-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -59.51, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 59.51, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -28.39, "relY": 16.27,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 28.39,  "relY": 16.27,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -31.91, "relY": -18.28, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 31.91,  "relY": -18.28, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.81, "startAngle": 258.75 }]
    },
    "TOMIX-C317-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C317-45-WP(F)",
        description: "ワイドPCカーブレール C317-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -121.32, "relY": 0, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 121.32,  "relY": 0, "facingAngle": 22.5,  "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -76.78, "relY": 15.34, "facingAngle": 56.25 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 76.78,  "relY": 15.34, "facingAngle": 123.75 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -86.29, "relY": -17.24, "facingAngle": -123.75 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 86.29,  "relY": -17.24, "facingAngle": -56.25 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 45, "centerX": 0, "centerY": 292.86, "startAngle": 247.5 }]
    },
    "TOMIX-CR317-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CL317-22.5-WP(F)",
        description: "アプローチPCレール CL317-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -59.51, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 59.51, "relY": 0, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -28.39, "relY": 16.27,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 28.39,  "relY": 16.27,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -31.91, "relY": -18.28, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 31.91,  "relY": -18.28, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.81, "startAngle": 258.75 }]
    },

    // --- R354 シリーズ ---
    "TOMIX-CR354-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR354-22.5-WP(F)",
        description: "アプローチPCレール CR354-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -66.45, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 66.45, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -31.91, "relY": 15.61,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 31.91,  "relY": 15.61,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -35.43, "relY": -17.33, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 35.43,  "relY": -17.33, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 22.5, "centerX": 0, "centerY": 347.09, "startAngle": 258.75 }]
    },
    "TOMIX-C354-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C354-45-WP(F)",
        description: "ワイドPCカーブレール C354-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -135.47, "relY": 0, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 135.47,  "relY": 0, "facingAngle": 22.5,  "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -86.29, "relY": 14.71, "facingAngle": 56.25 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 86.29,  "relY": 14.71, "facingAngle": 123.75 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -95.80, "relY": -16.34, "facingAngle": -123.75 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 95.80,  "relY": -16.34, "facingAngle": -56.25 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 45, "centerX": 0, "centerY": 327.05, "startAngle": 247.5 }]
    },
    "TOMIX-CR354-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CL354-22.5-WP(F)",
        description: "アプローチPCレール CL354-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -66.45, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 66.45, "relY": 0, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -31.91, "relY": 15.61,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 31.91,  "relY": 15.61,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -35.43, "relY": -17.33, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 35.43,  "relY": -17.33, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 22.5, "centerX": 0, "centerY": 347.09, "startAngle": 258.75 }]
    },

    // --- R391 シリーズ ---
    "TOMIX-CR391-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CR391-22.5-WP(F)",
        description: "アプローチPCレール CR391-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -73.39, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 73.39, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -35.43, "relY": 15.06,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 35.43,  "relY": 15.06,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -38.95, "relY": -16.55, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 38.95,  "relY": -16.55, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 22.5, "centerX": 0, "centerY": 383.38, "startAngle": 258.75 }]
    },
    "TOMIX-C391-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C391-45-WP(F)",
        description: "ワイドPCカーブレール C391-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -149.63, "relY": 0, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 149.63,  "relY": 0, "facingAngle": 22.5,  "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -95.80, "relY": 14.19, "facingAngle": 56.25 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 95.80,  "relY": 14.19, "facingAngle": 123.75 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -105.31, "relY": -15.60, "facingAngle": -123.75 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 105.31,  "relY": -15.60, "facingAngle": -56.25 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 45, "centerX": 0, "centerY": 361.23, "startAngle": 247.5 }]
    },
    "TOMIX-CR391-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "CL391-22.5-WP(F)",
        description: "アプローチPCレール CL391-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -73.39, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 73.39, "relY": 0, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -35.43, "relY": 15.06,  "facingAngle": 78.75 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 35.43,  "relY": 15.06,  "facingAngle": 101.25 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -38.95, "relY": -16.55, "facingAngle": -101.25 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 38.95,  "relY": -16.55, "facingAngle": -78.75 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 22.5, "centerX": 0, "centerY": 383.38, "startAngle": 258.75 }]
    },

    // =========================================================
    // 緩曲線レール (平坦系)
    // =========================================================
    "TOMIX-C541-15-WP": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "C541-15-WP(F)",
        description: "ワイドPCカーブレール C541-15-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.61, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "relX": 70.61,  "relY": 0, "facingAngle": 7.5 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": -34.12, "relY": 13.79,  "facingAngle": 82.5 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": 34.12,  "relY": 13.79,  "facingAngle": 97.5 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": -36.54, "relY": -14.77, "facingAngle": -97.5 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": 36.54,  "relY": -14.77, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 536.36, "startAngle": 262.5 }]
    },
    "TOMIX-C605-10-WP": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "curve",
        name: "C605-10-WP(F)A・B",
        description: "ワイドPCカーブレール C605-10-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -52.68, "relY": 0, "facingAngle": 175.0 },
            { "id": 1, "jointType": "rail-end", "relX": 52.68,  "relY": 0, "facingAngle": 5.0 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": -25.56, "relY": 13.77,  "facingAngle": 85.0 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": 25.56,  "relY": 13.77,  "facingAngle": 95.0 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": -27.18, "relY": -14.64, "facingAngle": -95.0 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": 27.18,  "relY": -14.64, "facingAngle": -85.0 }
        ],
        shapes: [{ "type": "arc", "radius": 605, "arcAngle": 10, "centerX": 0, "centerY": 602.69, "startAngle": 265.0 }]
    },

    // =========================================================
    // 車止めレール
    // =========================================================
    "TOMIX-E-WI": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N"],
        category: "straight",
        name: "E-WI-WP(F)",
        description: "ワイドエンドレール E-WI-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    }
});
