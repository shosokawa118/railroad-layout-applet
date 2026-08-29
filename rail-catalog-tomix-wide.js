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

/**
 * =============================================================================
 * RAIL PARTS CATALOG - TOMIX WIDE PC RAIL (SIDE JOINER ADJUSTED)
 * =============================================================================
 */
registerRailParts({
    // =========================================================
    // 直線レール
    // =========================================================
    "TOMIX-W280": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S280-WP(F)",
        description: "ワイドPCレール S280-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 140,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (140 - 3 = 137)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -137, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -137, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 137,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 137,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            // 中央±3mm
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -3,   "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -3,   "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 3,    "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 3,    "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W158.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S158.5-WP(F)",
        description: "ワイドPCレール S158.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -79.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 79.25,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (79.25 - 3 = 76.25)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -76.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -76.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 76.25,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 76.25,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 158.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W140": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S140-WP(F)",
        description: "ワイドPCレール S140-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 70,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (70 - 3 = 67)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W99": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S99-WP(F)",
        description: "ワイドPCレール S99-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -49.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 49.5,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (49.5 - 3 = 46.5)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -46.5, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -46.5, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 46.5,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 46.5,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 99, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W72.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S72.5-WP(F)",
        description: "ワイドPCレール S72.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -36.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 36.25,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (36.25 - 3 = 33.25)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W70": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S70-WP(F)",
        description: "ワイドPCレール S70-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 35,  "relY": 0, "facingAngle": 0 },
            // 両端3mm (35 - 3 = 32)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W33": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S33-WP(F)",
        description: "ワイドPC端数レール S33-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -16.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 16.5,  "relY": 0, "facingAngle": 0 },
            // 片側（進入側）3mmのみ
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -13.5, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -13.5, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 33, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W18.5": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "S18.5-WP(F)",
        description: "ワイドPC端数レール S18.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 9.25,  "relY": 0, "facingAngle": 0 },
            // 片側（進入側）3mmのみ
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -6.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -6.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // 曲線レール
    // =========================================================

    // --- R280 シリーズ ---
    "TOMIX-CR280-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CR280-22.5-WP(F)",
        description: "アプローチPCレール CR280-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -54.62, "relY": -274.62, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 54.62, "relY": -274.62, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -48.27, "relY": -256.99, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 48.27,  "relY": -256.99, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },
    "TOMIX-C280-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C280-45-WP(F)",
        description: "ワイドPCカーブレール C280-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -107.15, "relY": -258.68, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 107.15,  "relY": -258.68, "facingAngle": 22.5, "jointGroup": "tomix-cant", "polarity": -1 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -97.48, "relY": -242.67, "facingAngle": -68.114, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 97.48,  "relY": -242.67, "facingAngle": 68.114,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -111.27, "relY": -276.99, "facingAngle": 111.886, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 111.27,  "relY": -276.99, "facingAngle": -111.886, "polarity": -1 },
            // 中央
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -2.80, "relY": -261.48, "facingAngle": -89.386, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 2.80,  "relY": -261.48, "facingAngle": 89.386,  "polarity": 1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -3.20, "relY": -298.48, "facingAngle": 90.614,  "polarity": -1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 3.20,   "relY": -298.48, "facingAngle": -90.614, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }]
    },
    "TOMIX-CR280-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CL280-22.5-WP(F)",
        description: "アプローチPCレール CL280-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -54.62, "relY": -274.62, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 54.62, "relY": -274.62, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -48.27, "relY": -256.99, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 48.27,  "relY": -256.99, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },

    // --- R317 シリーズ ---
    "TOMIX-CR317-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CR317-22.5-WP(F)",
        description: "アプローチPCレール CR317-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -61.85, "relY": -310.91, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 61.85, "relY": -310.91, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },
    "TOMIX-C317-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C317-45-WP(F)",
        description: "ワイドPCカーブレール C317-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -121.32, "relY": -292.86, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 121.32,  "relY": -292.86, "facingAngle": 22.5, "jointGroup": "tomix-cant", "polarity": -1 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -111.27, "relY": -276.99, "facingAngle": -68.114, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 111.27,  "relY": -276.99, "facingAngle": 68.114,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -125.06, "relY": -311.31, "facingAngle": 111.886, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 125.06,  "relY": -311.31, "facingAngle": -111.886, "polarity": -1 },
            // 中央
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -3.20, "relY": -298.48, "facingAngle": -89.386, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 3.20,  "relY": -298.48, "facingAngle": 89.386,  "polarity": 1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -3.59, "relY": -335.48, "facingAngle": 90.614,  "polarity": -1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 3.59,  "relY": -335.48, "facingAngle": -90.614, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }]
    },
    "TOMIX-CR317-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CL317-22.5-WP(F)",
        description: "アプローチPCレール CL317-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -61.85, "relY": -310.91, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 61.85, "relY": -310.91, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },

    // --- R354 シリーズ ---
    "TOMIX-CR354-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CR354-22.5-WP(F)",
        description: "アプローチPCレール CR354-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -69.07, "relY": -347.20, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 69.07, "relY": -347.20, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },
    "TOMIX-C354-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C354-45-WP(F)",
        description: "ワイドPCカーブレール C354-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -135.47, "relY": -327.05, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 135.47,  "relY": -327.05, "facingAngle": 22.5, "jointGroup": "tomix-cant", "polarity": -1 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -125.06, "relY": -311.31, "facingAngle": -68.114, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 125.06,  "relY": -311.31, "facingAngle": 68.114,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -138.85, "relY": -345.62, "facingAngle": 111.886, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 138.85,  "relY": -345.62, "facingAngle": -111.886, "polarity": -1 },
            // 中央
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -3.59, "relY": -335.48, "facingAngle": -89.386, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 3.59,  "relY": -335.48, "facingAngle": 89.386,  "polarity": 1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -3.99, "relY": -372.48, "facingAngle": 90.614,  "polarity": -1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 3.99,  "relY": -372.48, "facingAngle": -90.614, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }]
    },
    "TOMIX-CR354-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CL354-22.5-WP(F)",
        description: "アプローチPCレール CL354-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -69.07, "relY": -347.20, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 69.07, "relY": -347.20, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 354, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },

    // --- R391 シリーズ ---
    "TOMIX-CR391-22.5-FLAT-CANT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CR391-22.5-WP(F)",
        description: "アプローチPCレール CR391-22.5-WP-F (水平→カント-)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -76.30, "relY": -383.49, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 76.30, "relY": -383.49, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -75.59, "relY": -402.44, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 75.59,  "relY": -402.44, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },
    "TOMIX-C391-45-V": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C391-45-WP(F)",
        description: "ワイドPCカーブレール C391-45-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -149.63, "relY": -361.23, "facingAngle": 157.5, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 149.63,  "relY": -361.23, "facingAngle": 22.5, "jointGroup": "tomix-cant", "polarity": -1 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -138.85, "relY": -345.62, "facingAngle": -68.114, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 138.85,  "relY": -345.62, "facingAngle": 68.114,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -152.64, "relY": -379.94, "facingAngle": 111.886, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 152.64,  "relY": -379.94, "facingAngle": -111.886, "polarity": -1 },
            // 中央
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -3.99, "relY": -372.48, "facingAngle": -89.386, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 3.99,  "relY": -372.48, "facingAngle": 89.386,  "polarity": 1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -4.39, "relY": -409.48, "facingAngle": 90.614,  "polarity": -1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 4.39,  "relY": -409.48, "facingAngle": -90.614, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }]
    },
    "TOMIX-CR391-22.5-CANT-FLAT": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "CL391-22.5-WP(F)",
        description: "アプローチPCレール CL391-22.5-WP-F (カント+→水平)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端", "relX": -76.30, "relY": -383.49, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": 1 },
            { "id": 1, "jointType": "rail-end", "name": "水平端", "relX": 76.30, "relY": -383.49, "facingAngle": 11.25, "polarity": "*" },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": -79.364, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": 79.364,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -75.59, "relY": -402.44, "facingAngle": 100.636, "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 75.59,  "relY": -402.44, "facingAngle": -100.636, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 391, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }]
    },

    // --- 緩曲線 シリーズ ---
    "TOMIX-C541-15-WP": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C541-15-WP(F)",
        description: "ワイドPCカーブレール C541-15-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -70.61, "relY": -536.36, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "relX": 70.61,  "relY": -536.36, "facingAngle": 7.5 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": -62.65, "relY": -518.73, "facingAngle": -83.114, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": 62.65,  "relY": -518.73, "facingAngle": 83.114,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": -67.08, "relY": -555.46, "facingAngle": 96.886,  "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": 67.08,  "relY": -555.46, "facingAngle": -96.886, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 0, "startAngle": 262.5 }]
    },
    "TOMIX-C605-10-WP": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "curve",
        name: "C605-10-WP(F)A・B",
        description: "ワイドPCカーブレール C605-10-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -52.68, "relY": -602.69, "facingAngle": 175.0 },
            { "id": 1, "jointType": "rail-end", "relX": 52.68,  "relY": -602.69, "facingAngle": 5.0 },
            // 両端
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": -44.86, "relY": -584.78, "facingAngle": -85.614, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": 44.86,  "relY": -584.78, "facingAngle": 85.614,  "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": -47.69, "relY": -621.67, "facingAngle": 94.386,  "polarity": -1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": 47.69,  "relY": -621.67, "facingAngle": -94.386, "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 605, "arcAngle": 10, "centerX": 0, "centerY": 0, "startAngle": 265.0 }]
    },

    // =========================================================
    // 車止めレール
    // =========================================================
    "TOMIX-E-WI": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-WIDE-N"],
        category: "straight",
        name: "E-WI-WP(F)",
        description: "ワイドエンドレール E-WI-WP(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": -18.5, "facingAngle": -90, "polarity": 1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    }
});
