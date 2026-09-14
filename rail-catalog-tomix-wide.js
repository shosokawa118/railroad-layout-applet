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
    "TOMIX-S280-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "標準",
        name: "S280-WP",
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
    "TOMIX-S158.5-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "端数・調整",
        name: "S158.5-WP",
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
    "TOMIX-S140-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "標準",
        name: "S140-WP",
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
    "TOMIX-S99-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "端数・調整",
        name: "S99-WP",
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
    "TOMIX-S33-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "端数・調整",
        name: "S33-WP",
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
    "TOMIX-S18.5-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "端数・調整",
        name: "S18.5-WP",
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
    "TOMIX-V70-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "端数・調整",
        name: "V70-WP",
        description: "バリアブルレール 70～90mm",
        dynamicType: "variable-straight",
        minLength: 70,
        maxLength: 90,
        defaultLength: 70,
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "relX":  35, "relY": 0, "facingAngle": 0 }
            // 可変長処理に対応していないため側面ジョイントは省略
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // 車止めレール
    "TOMIX-E-WI": {
        systemId: "TOMIX-WIDE-N",
        category: "straight",
        subCategory: "終端",
        name: "E-WI",
        description: "ワイドエンドレール E-WI(F)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -20, "relY": 0, "facingAngle": 180 },
            // --- 側面ジョイント ---
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -17, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -17, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
        ],
        shapes: [
            { "type": "line", "length": 37, "offsetX": -1.5, "offsetY": 0 },
            { "type": "rect", "width": 40, "height": 37, "offsetX": 0, "offsetY": 0 }
        ]
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
        category: "curve",
        subCategory: "C280",
        name: "CR280-22.5-WP",
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
        category: "curve",
        subCategory: "C280",
        name: "C280-45-WP",
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
        category: "curve",
        subCategory: "C280",
        name: "CL280-22.5-WP",
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
        category: "curve",
        subCategory: "C317",
        name: "CR317-22.5-WP",
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
        category: "curve",
        subCategory: "C317",
        name: "C317-45-WP",
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
        category: "curve",
        subCategory: "C317",
        name: "CL317-22.5-WP",
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
        category: "curve",
        subCategory: "C354",
        name: "CR354-22.5-WP",
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
        category: "curve",
        subCategory: "C354",
        name: "C354-45-WP",
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
        category: "curve",
        subCategory: "C354",
        name: "CL354-22.5-WP",
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
        category: "curve",
        subCategory: "C391",
        name: "CR391-22.5-WP",
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
        category: "curve",
        subCategory: "C391",
        name: "C391-45-WP",
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
        category: "curve",
        subCategory: "C391",
        name: "CL391-22.5-WP",
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

    // =========================================================
    // TOMIX ワイド化 電動複線両渡りポイント (N-PX280-WB)
    // =========================================================
    "TOMIX-N-PX280-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        subCategory: "渡り線",
        name: "PX280-WB",
        description: "ワイド化 電動複線両渡りポイント PX280",
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
    // TOMIX ワイド化 ポイントレール & 拡張バラストパーツ
    // =========================================================

    // --- 1. ポイント本体（右 PR541-15） ---
    "TOMIX-N-PR541-15-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        subCategory: "半径541",
        name: "PR541-15-WB",
        description: "ワイド化 電動ポイント (右)",
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
    "TOMIX-N-PL541-15-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        subCategory: "半径541",
        name: "PL541-15-WB",
        description: "ワイド化 電動ポイント (左)",
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

    // TOMIX 電動ポイント PR280-30-WB (右)
    "TOMIX-N-PR280-30-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        subCategory: "半径280",
        name: "PR280-30-WB",
        description: "ワイド化 電動ポイント PR280-30 (右)",
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
    "TOMIX-N-PL280-30-WB": {
        systemId: "TOMIX-WIDE-N",
        category: "turnout",
        subCategory: "半径280",
        name: "WPL280-30-WB",
        description: "ワイド化 電動ポイント PL280-30 (左)",
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

    // --- S280-WP（ポイント分岐用・片側道床版） ---
    "TOMIX-S280-WP-SINGLE": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "S280-WP(片側道床)",
        description: "ポイント分岐用 片側道床直線レール 280mm",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 140,  "relY": 0, "facingAngle": 0 },
            // 外付け道床用サイドノード (上側: Y = -27.75, 面角 270°)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "上側外付け道床(左)", "relX": -70.0, "relY": -9.25, "facingAngle": 270, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "上側外付け道床(右)", "relX":  70.0, "relY": -9.25, "facingAngle": 270, "polarity": 1 },
            // --- 側面ジョイント ---
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 137,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 下面右/右下 (+1)
            { "id": 5, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 3,    "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }, // 下面中右 (-1)
            { "id": 6, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -3,   "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 下面中左 (+1)
            { "id": 7, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -137, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 下面左/左下 (-1)
        ],
        shapes: [
            { "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 },
            { "type": "rect", "width": 280, "height": 18.5, "offsetX": 0, "offsetY": 9.25 }]
    },
    // --- S140-WP（ポイント分岐用・片側道床版本体） ---
    "TOMIX-N-S140-WP-SINGLE": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "S140-WP(片側道床)",
        description: "ポイント分岐用 片側道床直線レール 140mm",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "端点1", "relX": -70.0, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "端点2", "relX": 70.0,  "relY": 0, "facingAngle": 0 },
            // 外側バラスト接続 (極性: +1, 直線専用)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "外側バラスト接続", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 },
            // --- 側面ジョイント ---
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": 18.5,  "facingAngle": 90,  "polarity": 1 },  // 右下
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": 18.5,  "facingAngle": 90,  "polarity": -1 }  // 左下
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "rect", "width": 140, "height": 18.5, "offsetX": 0, "offsetY": 9.25 }
        ]
    },
    // --- 外付け道床パーツ：S140/S280 用 ---
    "TOMIX-BALLAST-S140": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "S140/280-WPバラスト",
        description: "ポイント補助用外付け道床 (S140/S280用)",
        ballastWidth: 9.25,
        nodes: [
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-straight", "name": "接続端", "relX": 0, "relY": -9.25, "facingAngle": 90, "polarity": -1 },
            // --- 側面ジョイント ---
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -67, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 67,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }  // 右上
        ],
        shapes: [
            {
                "type": "polygon",
                "points": [
                    { "x": -70, "y": -18.5 },
                    { "x": 70,  "y": -18.5 },
                    { "x": 70,  "y": -9.25 },
                    { "x": -70, "y": -9.25 }
                ]
            }
        ]
    },

    // --- S70-WP (片側道床本体) ---
    "TOMIX-S70-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "S70-WP(片側道床)",
        description: "片側道床直線レール S70-WP",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 35,  "relY": 0, "facingAngle": 0 },
            // 固定側面ジョイント (下側 Y=+18.5)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": 18.5, "facingAngle": 90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": 18.5, "facingAngle": 90, "polarity": -1 },
            // 外付けバラスト着脱用ノード (上側 Y=-9.25)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-S70", "name": "外付けバラスト接続", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "rect", "width": 70, "height": 27.75, "offsetX": 0, "offsetY": 4.625 }
        ]
    },
    // --- 外付け道床パーツ：S70 用 ---
    "TOMIX-BALLAST-S70": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "S70-WPバラスト",
        description: "ポイント補助用外付け道床 (S70用)",
        ballastWidth: 9.25,
        nodes: [
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-S70", "name": "接続端", "relX": 0, "relY": -9.25, "facingAngle": 90, "polarity": -1 },
            // --- 側面ジョイント ---
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -32, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 32,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }  // 右上
        ],
        shapes: [
            {
                "type": "polygon",
                "points": [
                    { "x": -35, "y": -18.5 },
                    { "x": 35,  "y": -18.5 },
                    { "x": 35,  "y": -9.25 },
                    { "x": -35, "y": -9.25 }
                ]
            }
        ]
    },

    // --- S72.5-WP (片側道床本体) ---
    "TOMIX-S72.5-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "S72.5-WP(片側道床)",
        description: "片側道床直線レール S72.5-WP",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -36.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "延伸端", "relX": 36.25,  "relY": 0, "facingAngle": 0 },
            // 固定側面ジョイント (下側 Y=+18.5)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": 18.5, "facingAngle": 90, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": 18.5, "facingAngle": 90, "polarity": -1 },
            // 外付けバラスト着脱用ノード (上側 Y=-9.25)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-S72.5", "name": "外付けバラスト接続", "relX": 0, "relY": -9.25, "facingAngle": 270, "polarity": 1 }
        ],
        shapes: [
            { "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 },
            { "type": "rect", "width": 72.5, "height": 27.75, "offsetX": 0, "offsetY": 4.625 }
        ]
    },
    // --- 外付け道床パーツ：S72.5 用 ---
    "TOMIX-BALLAST-S72.5": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "S72.5-WPバラスト",
        description: "ポイント補助用外付け道床 (S72.5用)",
        ballastWidth: 9.25,
        nodes: [
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-S72.5", "name": "接続端", "relX": 0, "relY": -9.25, "facingAngle": 90, "polarity": -1 },
            // --- 側面ジョイント ---
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": -33.25, "relY": -18.5, "facingAngle": -90, "polarity": 1 },  // 左上
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-straight", "relX": 33.25,  "relY": -18.5, "facingAngle": -90, "polarity": -1 }, // 右上
        ],
        shapes: [
            {
                "type": "polygon",
                "points": [
                    { "x": -36.25, "y": -18.5 },
                    { "x": 36.25,  "y": -18.5 },
                    { "x": 36.25,  "y": -9.25 },
                    { "x": -36.25, "y": -9.25 }
                ]
            }
        ]
    },

    // --- C541-15-WP（片側道床） ---
    "TOMIX-N-C541-15-WP": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
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
    // --- 外付け道床パーツ：カーブ C541-15 用（L/R共通部品） ---
    "TOMIX-N-BALLAST-C541-15": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
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
    },

    // --- C605-10-WP-A (外側バラスト着脱式本体) ---
    "TOMIX-C605-10-WP-A": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "C605-10-WP-A(内側道床)",
        description: "ワイドPCカーブレール C605-10-WP A (外側バラスト着脱式)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -52.68, "relY": -602.69, "facingAngle": 175.0 },
            { "id": 1, "jointType": "rail-end", "relX": 52.68,  "relY": -602.69, "facingAngle": 5.0 },
            // 内側固定側面ジョイント (R586.5)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": 44.86,  "relY": -584.78, "facingAngle": 94.386,  "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": -44.86, "relY": -584.78, "facingAngle": 85.614,  "polarity": -1 },
            // 外側バラスト着脱用ノード (R614.25側)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C605-A", "name": "外側バラスト接続", "relX": 0, "relY": -614.25, "facingAngle": 270, "polarity": 1 }
        ],
        shapes: [
            { "type": "arc", "radius": 605, "arcAngle": 10, "centerX": 0, "centerY": 0, "startAngle": 265.0 },
            {
                "type": "path",
                "pathData": "M -53.53 -611.91 L -51.12 -584.27 A 586.5 586.5 0 0 1 51.12 -584.27 L 53.53 -611.91 A 614.25 614.25 0 0 0 -53.53 -611.91 Z"
            }
        ]
    },
    // --- C605-10-WP-A 用外付け道床 (外側用) ---
    "TOMIX-BALLAST-C605-10-A": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "C605-10-WP 外側バラスト",
        description: "C605-10-WP A用 外付けバラスト (外側用)",
        ballastWidth: 9.25,
        nodes: [
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-C605-A", "name": "接続端", "relX": 0, "relY": -614.25, "facingAngle": 90, "polarity": -1 },
            // 外側固定側面ジョイント (R623.5)
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": -47.69, "relY": -621.67, "facingAngle": -94.386, "polarity": 1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": 47.69,  "relY": -621.67, "facingAngle": -85.614, "polarity": -1 }
        ],
        shapes: [
            {
                "type": "path",
                "pathData": "M -54.34 -621.13 L -53.53 -611.91 A 614.25 614.25 0 0 1 53.53 -611.91 L 54.34 -621.13 A 623.5 623.5 0 0 0 -54.34 -621.13 Z"
            }
        ]
    },
    // --- C605-10-WP-B (内側バラスト着脱式本体) ---
    "TOMIX-C605-10-WP-B": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "補助線路",
        name: "C605-10-WP-B(外側道床)",
        description: "ワイドPCカーブレール C605-10-WP B (内側バラスト着脱式)",
        ballastWidth: 18.5,
        nodes: [
            { "id": 0, "jointType": "rail-end", "relX": -52.68, "relY": -602.69, "facingAngle": 175.0 },
            { "id": 1, "jointType": "rail-end", "relX": 52.68,  "relY": -602.69, "facingAngle": 5.0 },
            // 外側固定側面ジョイント (R623.5)
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": -47.69, "relY": -621.67, "facingAngle": -94.386, "polarity": 1 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "wide-side-R623.5", "relX": 47.69,  "relY": -621.67, "facingAngle": -85.614, "polarity": -1 },
            // 内側バラスト着脱用ノード (R595.75側)
            { "id": 4, "jointType": "side-joiner", "jointGroup": "wide-ballast-C605-B", "name": "内側バラスト接続", "relX": 0, "relY": -595.75, "facingAngle": 90, "polarity": 1 }
        ],
        shapes: [
            { "type": "arc", "radius": 605, "arcAngle": 10, "centerX": 0, "centerY": 0, "startAngle": 265.0 },
            {
                "type": "path",
                "pathData": "M -51.92 -593.48 L -54.34 -621.13 A 623.5 623.5 0 0 1 54.34 -621.13 L 51.92 -593.48 A 595.75 595.75 0 0 0 -51.92 -593.48 Z"
            }
        ]
    },
    // --- C605-10-WP-B 用外付け道床 (内側用) ---
    "TOMIX-BALLAST-C605-10-B": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "C605-10-WP 内側バラスト",
        description: "C605-10-WP B用 外付けバラスト (内側用)",
        ballastWidth: 9.25,
        nodes: [
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-C605-B", "name": "接続端", "relX": 0, "relY": -595.75, "facingAngle": 270, "polarity": -1 },
            // 内側固定側面ジョイント (R586.5)
            { "id": 1, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": 44.86,  "relY": -584.78, "facingAngle": 94.386,  "polarity": 1 },
            { "id": 2, "jointType": "side-joiner", "jointGroup": "wide-side-R586.5", "relX": -44.86, "relY": -584.78, "facingAngle": 85.614,  "polarity": -1 },
        ],
        shapes: [
            {
                "type": "path",
                "pathData": "M -51.12 -584.27 L -51.92 -593.48 A 595.75 595.75 0 0 1 51.92 -593.48 L 51.12 -584.27 A 586.5 586.5 0 0 0 -51.12 -584.27 Z"
            }
        ]
    },

    // --- バラストパーツ L5（左ポイント後の隙間埋め用） ---
    "TOMIX-N-BALLAST-L5": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
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

    // --- バラストパーツ R5（右ポイント後の隙間埋め用） ---
    "TOMIX-N-BALLAST-R5": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
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

    // 外付け道床パーツ：カーブ C280-30 用（左右共通・修正版）
    "TOMIX-N-BALLAST-C280-30": {
        systemId: "TOMIX-WIDE-N",
        category: "other",
        subCategory: "バラスト",
        trackType: "ballast-only",
        name: "C280-30-WPバラスト",
        description: "ポイント分岐用外付け道床（C280-30用）",
        ballastWidth: 9.25,
        nodes: [
            // 原点(0,0)=円弧中心。外半径の受入面(Y = -270.75)に上向き(270°)のノードを配置
            { "id": 0, "jointType": "side-joiner", "jointGroup": "wide-ballast-C280", "name": "接続端", "relX": 0, "relY": -270.75, "facingAngle": 270.0, "polarity": -1 }
        ],
        shapes: [
            {
                // 外半径 R=270.75 から内側へ 9.25mm 狭まる内半径 R=261.50 の扇形
                "type": "path",
                "pathData": "M -70.08 -261.53 A 270.75 270.75 0 0 1 70.08 -261.53 L 67.68 -252.59 A 261.50 261.50 0 0 0 -67.68 -252.59 Z"
            }
        ]
    }

});
