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
    // 時計回り: 上面/外側（左→右） ➔ 下面/内側（右→左）
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
            // --- 側面ジョイント（左上スタート ➔ 時計回り ➔ 左下ゴール） ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -137, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 上面左/左上 (+1)
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -3,   "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 上面中左 (-1)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 3,    "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 上面中右 (+1)
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 137,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 上面右/右上 (-1)
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 137,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 下面右/右下 (+1)
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 3,    "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }, // 下面中右 (-1)
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -3,   "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 下面中左 (+1)
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -137, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 下面左/左下 (-1)
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -76.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 76.25,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 76.25,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -76.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -46.5, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 46.5,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 46.5,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -46.5, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -13.5, "relY": -18.5, "facingAngle": -90, "polarity": 1 }, // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -13.5, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 } // 左下
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -6.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 }, // 左上
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -6.25, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 } // 左下
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // 曲線レール（修正版）
    // facingAngle定義:
    //   外周 (R_outer): 中心(0,0)から外側に向くベクトル = atan2(relY, relX)
    //   内周 (R_inner): 外側から中心(0,0)に向くベクトル = atan2(relY, relX) + 180°
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": -100.636, "polarity": 1 },  // 外周左
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": -79.364,  "polarity": -1 },  // 外周右
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 48.27,  "relY": -256.99, "facingAngle": 100.636,  "polarity": 1 },  // 内周右
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -48.27, "relY": -256.99, "facingAngle": 79.364,   "polarity": -1 }   // 内周左
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -111.27, "relY": -276.99, "facingAngle": -111.886, "polarity": 1 }, // 外周左 (左上)
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -3.20,   "relY": -298.48, "facingAngle": -90.614,  "polarity": -1 }, // 外周中左
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 3.20,    "relY": -298.48, "facingAngle": -89.386,  "polarity": 1 },  // 外周中右
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 111.27,  "relY": -276.99, "facingAngle": -68.114,  "polarity": -1 }, // 外周右 (右上)
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 97.48,   "relY": -242.67, "facingAngle": 111.886,  "polarity": 1 },  // 内周右 (右下)
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 2.80,    "relY": -261.48, "facingAngle": 90.614,   "polarity": -1 }, // 内周中右
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -2.80,   "relY": -261.48, "facingAngle": 89.386,   "polarity": 1 },  // 内周中左
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -97.48,  "relY": -242.67, "facingAngle": 68.114,   "polarity": -1 }  // 内周左 (左下)
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": 48.27,  "relY": -256.99, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R261.5", "relX": -48.27, "relY": -256.99, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -125.06, "relY": -311.31, "facingAngle": -111.886, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -3.59,   "relY": -335.48, "facingAngle": -90.614,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 3.59,    "relY": -335.48, "facingAngle": -89.386,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 125.06,  "relY": -311.31, "facingAngle": -68.114,  "polarity": -1 },
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 111.27,  "relY": -276.99, "facingAngle": 111.886,  "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 3.20,    "relY": -298.48, "facingAngle": 90.614,   "polarity": -1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -3.20,   "relY": -298.48, "facingAngle": 89.386,   "polarity": 1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -111.27, "relY": -276.99, "facingAngle": 68.114,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": 55.10,  "relY": -293.36, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R298.5", "relX": -55.10, "relY": -293.36, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -138.85, "relY": -345.62, "facingAngle": -111.886, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -3.99,   "relY": -372.48, "facingAngle": -90.614,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 3.99,    "relY": -372.48, "facingAngle": -89.386,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 138.85,  "relY": -345.62, "facingAngle": -68.114,  "polarity": -1 },
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 125.06,  "relY": -311.31, "facingAngle": 111.886,  "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 3.59,    "relY": -335.48, "facingAngle": 90.614,   "polarity": -1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -3.59,   "relY": -335.48, "facingAngle": 89.386,   "polarity": 1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -125.06, "relY": -311.31, "facingAngle": 68.114,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": 61.93,  "relY": -329.72, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R335.5", "relX": -61.93, "relY": -329.72, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -75.59, "relY": -402.44, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 75.59,  "relY": -402.44, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -152.64, "relY": -379.94, "facingAngle": -111.886, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -4.39,   "relY": -409.48, "facingAngle": -90.614,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 4.39,    "relY": -409.48, "facingAngle": -89.386,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 152.64,  "relY": -379.94, "facingAngle": -68.114,  "polarity": -1 },
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 138.85,  "relY": -345.62, "facingAngle": 111.886,  "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 3.99,    "relY": -372.48, "facingAngle": 90.614,   "polarity": -1 },
            { "id": 8, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -3.99,   "relY": -372.48, "facingAngle": 89.386,   "polarity": 1 },
            { "id": 9, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -138.85, "relY": -345.62, "facingAngle": 68.114,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": -75.59, "relY": -402.44, "facingAngle": -100.636, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R409.5", "relX": 75.59,  "relY": -402.44, "facingAngle": -79.364,  "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": 68.76,  "relY": -366.08, "facingAngle": 100.636,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R372.5", "relX": -68.76, "relY": -366.08, "facingAngle": 79.364,   "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": -67.08, "relY": -555.46, "facingAngle": -96.886, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R559.5", "relX": 67.08,  "relY": -555.46, "facingAngle": -83.114, "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": 62.65,  "relY": -518.73, "facingAngle": 96.886,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R522.5", "relX": -62.65, "relY": -518.73, "facingAngle": 83.114,  "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": -47.69, "relY": -621.67, "facingAngle": -94.386, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": 47.69,  "relY": -621.67, "facingAngle": -85.614, "polarity": -1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": 44.86,  "relY": -584.78, "facingAngle": 94.386,  "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": -44.86, "relY": -584.78, "facingAngle": 85.614,  "polarity": -1 }
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
            // --- 側面ジョイント ---
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // TOMIX ワイドPC電動複線両渡りポイント (N-PX280-WB)
    // =========================================================
    "TOMIX-N-PX280-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "N-PX280-WB",
        description: "ワイドPC電動複線両渡りポイント PX280",
        ballastWidth: 18.5,
        nodes: [
            // レール端点ノード
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -140.0, "relY": -18.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -140.0, "relY":  18.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  140.0, "relY":  18.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  140.0, "relY": -18.5, "facingAngle": 0 },

            // 外付け道床用サイドノード (上側: Y = -27.75, 面角 270°)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "上側外付け道床(左)", "relX": -70.0, "relY": -27.75, "facingAngle": 270, "polarity": 1 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "上側外付け道床(右)", "relX":  70.0, "relY": -27.75, "facingAngle": 270, "polarity": 1 },

            // 外付け道床用サイドノード (下側: Y = +27.75, 面角 90°)
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "下側外付け道床(左)", "relX": -70.0, "relY":  27.75, "facingAngle": 90, "polarity": 1 },
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "下側外付け道床(右)", "relX":  70.0, "relY":  27.75, "facingAngle": 90, "polarity": 1 }
        ],
        shapes: [
            // 1. 複線間のバラスト領域 (Y: -18.5 ～ +18.5)
            {
                "type": "polygon",
                "points": [
                    { "x": -140.0, "y": -18.5 },
                    { "x":  140.0, "y": -18.5 },
                    { "x":  140.0, "y":  18.5 },
                    { "x": -140.0, "y":  18.5 }
                ]
            },

            // 2. 直線主線・副線 (全長 280mm)
            { "type": "line", "length": 280, "offsetX": 0, "offsetY": -18.5 },
            { "type": "line", "length": 280, "offsetX": 0, "offsetY":  18.5 },

            // 3. 渡り線 (C541 / 15.0° 中央交差点接続)
            // 上の線 (Y = -18.5) から分岐する円弧
            { "type": "arc", "radius": 541, "arcAngle": 15.0, "centerX": -140.0, "centerY": 522.5, "startAngle": 270 },
            { "type": "arc", "radius": 541, "arcAngle": -15.0, "centerX": 140.0, "centerY": 522.5, "startAngle": 270 },

            // 下の線 (Y = +18.5) から分岐する円弧
            { "type": "arc", "radius": 541, "arcAngle": -15.0, "centerX": -140.0, "centerY": -522.5, "startAngle": 90 },
            { "type": "arc", "radius": 541, "arcAngle": 15.0, "centerX": 140.0, "centerY": -522.5, "startAngle": 90 }
        ]
    },

    // =========================================================
    // TOMIX ワイドPCポイントレール & 拡張バラストパーツ
    // =========================================================

    // --- 1. ポイント本体（右 PR541-15） ---
    "TOMIX-N-WPR541-15": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "N-WPR541-15-WB",
        description: "ワイドPC電動ポイント (右)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "分岐端", "relX": 70.02, "relY": 18.44, "facingAngle": 15.0 },
            { "id": 2, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },

            // 外付け道床接続用サイドノード (極性: +1)
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側着脱用ノード(左)", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541",     "name": "カーブ側着脱用ノード(内)", "relX": -0.59, "relY": 13.79, "facingAngle": 97.5, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": -70.0, "centerY": 541.0, "startAngle": 270 }
        ]
    },

    // --- 2. ポイント本体（左 PL541-15） ---
    "TOMIX-N-WPL541-15": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "N-WPL541-15-WB",
        description: "ワイドPC電動ポイント (左)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "分岐端", "relX": 70.02, "relY": -18.44, "facingAngle": -15.0 },
            { "id": 2, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },

            // 外付け道床接続用サイドノード (極性: +1)
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側着脱用ノード(右)", "relX": 0, "relY": 9.25, "facingAngle": 90, "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541",     "name": "カーブ側着脱用ノード(内)", "relX": -0.59, "relY": -13.79, "facingAngle": 262.5, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": -15, "centerX": -70.0, "centerY": -541.0, "startAngle": 90 }
        ]
    },

    // --- 3. C541-15-WP（片側道床版） ---
    "TOMIX-N-C541-15-WP-SINGLE": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "C541-15-WP(片側道床)",
        description: "ポイント接続用片側道床カーブ基幹レール",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "端点1", "relX": -70.58, "relY": 4.62, "facingAngle": 172.5 },
            { "id": 1, "jointType": "rail-end", "name": "端点2", "relX": 70.58, "relY": 4.62, "facingAngle": 7.5 },
            // 内側バラスト接続 (極性: +1, C541専用)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541", "name": "内側バラスト接続", "relX": 0, "relY": 9.25, "facingAngle": 90, "polarity": 1 }
        ],
        shapes: [
            { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 541.0, "startAngle": 262.5 },
            {
                "type": "path",
                "pathData": "M -69.38 13.78 L -73.0 -13.62 A 559.5 559.5 0 0 1 73.0 -13.62 L 69.38 13.78 A 531.75 531.75 0 0 0 -69.38 13.78 Z"
            }
        ]
    },

    // --- 4. S140-WP（ポイント分岐用・片側道床版） ---
    "TOMIX-N-S140-WP-SINGLE": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "S140-WP(片側道床)",
        description: "ポイント分岐用片側道床直線レール",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "端点1", "relX": -70.0, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "端点2", "relX": 70.0,  "relY": 0, "facingAngle": 0 },
            // 外側バラスト接続 (極性: +1, 直線専用)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "外側バラスト接続", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "path", "pathData": "M -70 18.5 L 70 18.5 L 70 0 L -70 0 Z" }
        ]
    },

    // TOMIX 電動ポイント PR280-30-WB (右)
    "TOMIX-N-WPR280-30": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "N-WPR280-30-WB",
        description: "ワイドPC電動ポイント PR280-30 (右)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "分岐端", "relX": 70.0,  "relY": 37.51, "facingAngle": 30.0 },
            { "id": 2, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },

            // 外付け道床用サイドノード
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側着脱用ノード(上)", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C280",     "name": "カーブ側着脱用ノード(内)", "relX": 0.08, "relY": 18.48, "facingAngle": 105.0, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 280, "arcAngle": 30.0, "centerX": -70.0, "centerY": 280.0, "startAngle": 270 }
        ]
    },

    // TOMIX 電動ポイント PL280-30-WB (左)
    "TOMIX-N-WPL280-30": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        name: "N-WPL280-30-WB",
        description: "ワイドPC電動ポイント PL280-30 (左)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70.0, "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "分岐端", "relX": 70.0,  "relY": -37.51, "facingAngle": -30.0 },
            { "id": 2, "jointType": "rail-end", "name": "直進端", "relX": 70.0,  "relY": 0,      "facingAngle": 0 },

            // 外付け道床用サイドノード
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側着脱用ノード(下)", "relX": 0, "relY": 9.25, "facingAngle": 90, "polarity": 1 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C280",     "name": "カーブ側着脱用ノード(内)", "relX": 0.08, "relY": -18.48, "facingAngle": 255.0, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 280, "arcAngle": -30.0, "centerX": -70.0, "centerY": -280.0, "startAngle": 90 }
        ]
    },

    // 外付け道床パーツ：カーブ C280-30 用（左右共通）
    "TOMIX-N-BALLAST-C280-30": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        trackType: "ballast-only",
        name: "C280-30-WPバラスト",
        description: "ポイント分岐用外付け道床（C280-30用）",
        ballastWidth: 9.25,
        nodes: [
            // 原点(0,0)=円弧の中心。ジョイントは真上(Y = -270.75)、面角は内側(下向き 90°)
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-C280", "name": "接続端", "relX": 0, "relY": -270.75, "facingAngle": 90.0, "polarity": -1 }
        ],
        shapes: [
            {
                // 円弧の中心 (0,0) を基準としたパス
                // 内径 R=270.75, 外径 R=289.25 (θ = -15° ～ +15°)
                "type": "path",
                "pathData": "M -70.08 -261.53 A 270.75 270.75 0 0 1 70.08 -261.53 L 74.87 -279.39 A 289.25 289.25 0 0 0 -74.87 -279.39 Z"
            }
        ]
    },

    // --- 3. バラストパーツ L5（左ポイント後の隙間埋め用） ---
    "TOMIX-N-BALLAST-L5": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        trackType: "ballast-only",
        name: "バラストパーツ L5",
        description: "ポイント分岐・渡り用隙間埋めバラスト(L)",
        ballastWidth: 9.25,
        nodes: [
            // 直線側接続ジョイント
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側接続", "relX": 0, "relY": 9.25, "facingAngle": 90, "polarity": -1 },
            // カーブ側接続ジョイント（第二の原点経由で厳密計算した新座標）
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541",     "name": "カーブ側接続", "relX": -0.59, "relY": -4.71, "facingAngle": 262.5, "polarity": -1 }
        ],
        shapes: [
            // 元の正しい path を維持
            { "type": "path", "pathData": "M -70 9.25 L 70 9.25 L 70 -9.25 A 531.75 531.75 0 0 0 -70 9.25 Z" }
        ]
    },

    // --- 4. バラストパーツ R5（右ポイント後の隙間埋め用） ---
    "TOMIX-N-BALLAST-R5": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        trackType: "ballast-only",
        name: "バラストパーツ R5",
        description: "ポイント分岐・渡り用隙間埋めバラスト(R)",
        ballastWidth: 9.25,
        nodes: [
            // 直線側接続ジョイント
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "直線側接続", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": -1 },
            // カーブ側接続ジョイント（第二の原点経由で厳密計算した新座標）
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541",     "name": "カーブ側接続", "relX": -0.59, "relY": 4.71, "facingAngle": 97.5, "polarity": -1 }
        ],
        shapes: [
            // 元の正しい path を維持
            { "type": "path", "pathData": "M -70 -9.25 L 70 -9.25 L 70 9.25 A 531.75 531.75 0 0 1 -70 -9.25 Z" }
        ]
    },
    
    // --- 5. 外付け道床パーツ：直線 S140 用 ---
    "TOMIX-N-BALLAST-S140": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        trackType: "ballast-only",
        name: "S140-WPバラスト",
        description: "ポイント分岐用外付け道床（直線用）",
        ballastWidth: 9.25,
        nodes: [
            // 直線バラスト受入ノード (極性: -1)
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "接続端", "relX": 0, "relY": 4.625, "facingAngle": 90, "polarity": -1 }
        ],
        shapes: [
            {
                "type": "polygon",
                "points": [
                    { "x": -70, "y": -4.625 },
                    { "x": 70, "y": -4.625 },
                    { "x": 70, "y": 4.625 },
                    { "x": -70, "y": 4.625 }
                ]
            }
        ]
    },

    // --- 6. 外付け道床パーツ：カーブ C541-15 用（L/R共通部品） ---
    "TOMIX-N-BALLAST-C541-15": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        trackType: "ballast-only",
        name: "C541-15-WPバラスト",
        description: "ポイント分岐用外付け道床（カーブ用）",
        ballastWidth: 9.25,
        nodes: [
            // C541バラスト受入ノード (極性: -1)
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-C541", "name": "接続端", "relX": 0, "relY": -531.75, "facingAngle": 270, "polarity": -1 }
        ],
        shapes: [
            {
                "type": "path",
                "pathData": "M -68.2 -518.03 L -69.41 -527.21 A 531.75 531.75 0 0 1 69.41 -527.21 L 68.2 -518.03 A 522.5 522.5 0 0 0 -68.2 -518.03 Z"
            }
        ]
    }

});
