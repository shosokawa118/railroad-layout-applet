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
 * - 端部接続爪は専用品のため jointGroup に "tomytec-road-joint" を割り当て。
 * - 側面ジョイントはワイドトラムと互換性を持たせるため、同じ jointGroup 名を設定。
 */

registerRailParts({
    // --- 直線道路 S70-RO ---
    "TOMYTEC-BUS-S70-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "straight",
        name: "S70-RO",
        description: "直線道路 S70-RO (長さ70mm)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  35, "relY": 0, "facingAngle": 0 },
            // 側面ジョイント（ワイドトラム互換）
            { "id": 2, "name": "側面-北1", "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "name": "側面-南1", "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -25.75, "relY":  18.5, "facingAngle":  90 },
            { "id": 4, "name": "側面-北2", "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX":  25.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "name": "側面-南2", "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX":  25.75, "relY":  18.5, "facingAngle":  90 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }
        ]
    },
    // --- バス道路 直線端数 74mm (S74-RO) ---
    "TOMYTEC-BUS-S74-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "straight",
        name: "S74-RO",
        description: "直線道路 S74-RO (74mm)",
        nodes: [
            { "id": 0, "name": "左端", "relX": -37, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX":  37, "relY": 0, "facingAngle":   0 },
            // 側面ジョイント（端から 9.25mm）
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -27.75, "relY": -18.5, "facingAngle": 270 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": -27.75, "relY":  18.5, "facingAngle":  90 },
            { "id": 4, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX":  27.75, "relY": -18.5, "facingAngle": 270 },
            { "id": 5, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX":  27.75, "relY":  18.5, "facingAngle":  90 }
        ],
        shapes: [
            { "type": "line", "length": 74, "offsetX": 0, "offsetY": 0, "angle": 0 }
        ]
    },
    // --- バス道路 直線端数 37mm (S37-RO) ---
    "TOMYTEC-BUS-S37-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "straight",
        name: "S37-RO",
        description: "直線道路 S37-RO (37mm) (側面ジョイントなし)",
        nodes: [
            { "id": 0, "name": "左端", "relX": -18.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX":  18.5, "relY": 0, "facingAngle":   0 }
        ],
        shapes: [
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0, "angle": 0 }
        ]
    },
    // --- バス道路 直線端数 18.5mm (S18.5-RO) ---
    "TOMYTEC-BUS-S18.5-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "straight",
        name: "S18.5-RO",
        description: "直線道路 S18.5-RO (18.5mm)",
        nodes: [
            { "id": 0, "name": "左端", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX":  9.25, "relY": 0, "facingAngle":   0 },
            // 側面ジョイント（中央 X=0）
            { "id": 2, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 0, "relY": -18.5, "facingAngle": 270 },
            { "id": 3, "jointType": "side-joiner", "jointGroup": "widetram-side-straight", "relX": 0, "relY":  18.5, "facingAngle":  90 }
        ],
        shapes: [
            { "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0, "angle": 0 }
        ]
    },

    // --- トラムレール付き交差点パーツ (X37-WT-RO) ---
    "TOMYTEC-BUS-X37-WT-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "turnout",
        name: "S37-WT",
        description: "ワイドトラムレール S37-WT(F) (側面道路ジョイント付)",
        nodes: [
            // 左右方向：標準のバス道路用ジョイント
            { "id": 0, "name": "左端", "relX": -18.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX":  18.5, "relY": 0, "facingAngle": 0 },
            // 上下方向：トラム(Nゲージ)用ジョイント
            { "id": 2, "name": "上端", "jointGroup": "tomix-clapper", "relX": 0, "relY": -18.5, "facingAngle": 270 },
            { "id": 3, "name": "下端", "jointGroup": "tomix-clapper", "relX": 0, "relY":  18.5, "facingAngle": 90 }
        ],
        shapes: [
            // 主線（左右方向）：バス道路（システム既定の gauge: 0 で1本線描画）
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0, "angle": 0 },
            // 副線（上下方向）：トラム用線路（gauge: 9 を指定して2本線描画）
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0, "angle": 90, "gauge": 9 }
        ]
    },

    // --- 曲線道路 C66-30-RO ---
    "TOMYTEC-BUS-C66-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C66-30-RO",
        description: "曲線道路 C66-30-RO (半径66mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -17.08, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  17.08, "relY": 0, "facingAngle": 15.0 },
            // 側面ジョイント (内側: R47.5 / 外側: R84.5)
            { "id": 2, "name": "側面-内1", "jointType": "side-joiner", "jointGroup": "widetram-side-R47.5", "relX": -6.20, "relY": 14.98, "facingAngle": 82.5 },
            { "id": 3, "name": "側面-内2", "jointType": "side-joiner", "jointGroup": "widetram-side-R47.5", "relX":  6.20, "relY": 14.98, "facingAngle": 97.5 },
            { "id": 4, "name": "側面-外1", "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": -11.03, "relY": -18.89, "facingAngle": -97.5 },
            { "id": 5, "name": "側面-外2", "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX":  11.03, "relY": -18.89, "facingAngle": -82.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 66, "arcAngle": 30, "centerX": 0, "centerY": 63.75, "startAngle": 255.0 }
        ]
    },

    // --- 曲線道路 C103-30-RO ---
    "TOMYTEC-BUS-C103-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C103-30-RO",
        description: "曲線道路 C103-30-RO (半径103mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -26.66, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  26.66, "relY": 0, "facingAngle": 15.0 },
            // 側面ジョイント (内側: R84.5 / 外側: R121.5)
            { "id": 2, "name": "側面-内1", "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX": -11.03, "relY": 15.72, "facingAngle": 82.5 },
            { "id": 3, "name": "側面-内2", "jointType": "side-joiner", "jointGroup": "widetram-side-R84.5", "relX":  11.03, "relY": 15.72, "facingAngle": 97.5 },
            { "id": 4, "name": "側面-外1", "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -15.86, "relY": -20.97, "facingAngle": -97.5 },
            { "id": 5, "name": "側面-外2", "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX":  15.86, "relY": -20.97, "facingAngle": -82.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 99.49, "startAngle": 255.0 }
        ]
    },

    // --- 曲線道路 C140-30-RO ---
    "TOMYTEC-BUS-C140-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C140-30-RO",
        description: "曲線道路 C140-30-RO (半径140mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  36.23, "relY": 0, "facingAngle": 15.0 },
            // 側面ジョイント (内側: R121.5 / 外側: R158.5)
            { "id": 2, "name": "側面-内1", "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX": -15.86, "relY": 14.86, "facingAngle": 82.5 },
            { "id": 3, "name": "側面-内2", "jointType": "side-joiner", "jointGroup": "widetram-side-R121.5", "relX":  15.86, "relY": 14.86, "facingAngle": 97.5 },
            { "id": 4, "name": "側面-外1", "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": -21.84, "facingAngle": -97.5 },
            { "id": 5, "name": "側面-外2", "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX":  20.69, "relY": -21.84, "facingAngle": -82.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }
        ]
    },

    // --- 曲線道路 C177-30-RO ---
    "TOMYTEC-BUS-C177-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C177-30-RO",
        description: "曲線道路 C177-30-RO (半径177mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  45.81, "relY": 0, "facingAngle": 15.0 },
            // 側面ジョイント (内側: R158.5 / 外側: R195.5)
            { "id": 2, "name": "側面-内1", "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": 13.91, "facingAngle": 82.5 },
            { "id": 3, "name": "側面-内2", "jointType": "side-joiner", "jointGroup": "widetram-side-R158.5", "relX":  20.69, "relY": 13.91, "facingAngle": 97.5 },
            { "id": 4, "name": "側面-外1", "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": -25.52, "relY": -22.79, "facingAngle": -97.5 },
            { "id": 5, "name": "側面-外2", "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX":  25.52, "relY": -22.79, "facingAngle": -82.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }
        ]
    },

    // --- 曲線道路 C214-30-RO ---
    "TOMYTEC-BUS-C214-30-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "curve",
        name: "C214-30-RO",
        description: "曲線道路 C214-30-RO (半径214mm 角度30°)",
        nodes: [
            { "id": 0, "name": "進入", "jointType": "rail-end", "relX": -55.39, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "name": "出口", "jointType": "rail-end", "relX":  55.39, "relY": 0, "facingAngle": 15.0 },
            // 側面ジョイント (内側: R195.5 / 外側: R232.5)
            { "id": 2, "name": "側面-内1", "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX": -25.52, "relY": 12.92, "facingAngle": 82.5 },
            { "id": 3, "name": "側面-内2", "jointType": "side-joiner", "jointGroup": "widetram-side-R195.5", "relX":  25.52, "relY": 12.92, "facingAngle": 97.5 },
            { "id": 4, "name": "側面-外1", "jointType": "side-joiner", "jointGroup": "widetram-side-R232.5", "relX": -30.35, "relY": -23.71, "facingAngle": -97.5 },
            { "id": 5, "name": "側面-外2", "jointType": "side-joiner", "jointGroup": "widetram-side-R232.5", "relX":  30.35, "relY": -23.71, "facingAngle": -82.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 214, "arcAngle": 30, "centerX": 0, "centerY": 206.71, "startAngle": 255.0 }
        ]
    },
    // --- 交差点 L字型単体ユニット (X121.5-A-RO) ---
    "TOMYTEC-BUS-X121.5-A-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "turnout",
        name: "X121.5-A-RO",
        description: "交差点道路 L字型 (121.5mm×121.5mm)",
        nodes: [
            // 主線 (左 ⇄ 右)
            { "id": 0, "name": "左端", "relX": -103, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX": 18.5, "relY": 0, "facingAngle":   0 },
            // 副線 (下 ⇄ 上)
            { "id": 2, "name": "下端", "relX": 0, "relY": 18.5, "facingAngle":  90 },
            { "id": 3, "name": "上端", "relX": 0, "relY": -103, "facingAngle": 270 }
        ],
        shapes: [
            // 主線（横方向直線）
            { "type": "line", "length": 121.5, "offsetX": -42.75, "offsetY": 0, "angle": 0 },
            // 副線（縦方向直線）
            { "type": "line", "length": 121.5, "offsetX": 0, "offsetY": -42.75, "angle": 90 },
            // 左折用カーブ (R66mm)
            { "type": "arc", "radius": 66, "arcAngle": -90, "centerX": -66, "centerY": -66, "startAngle": 90 },
            // 右折用カーブ（ballastWidth: 0 により道路面を描かずガイド線のみ描画）
            { "type": "arc", "radius": 66, "arcAngle":  45, "centerX": -66, "centerY":  66, "startAngle": 270, "ballastWidth": 0 },
            { "type": "arc", "radius": 66, "arcAngle": -45, "centerX":  66, "centerY": -66, "startAngle": 180, "ballastWidth": 0 },
            // 対向車線の斜め横断線（ballastWidth: 0 により道路面を描かずガイド線のみ描画）
            { "type": "line", "length": 50, "offsetX": 0, "offsetY": 0, "angle": -45, "ballastWidth": 0 }
        ]
    },
    // --- 丁字路用 I字型 進入側 (X121.5-C-RO) ---
    "TOMYTEC-BUS-X121.5-C-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "turnout",
        name: "X121.5-C-RO",
        description: "交差点道路 丁字路用 I字型（進入側）",
        nodes: [
            { "id": 0, "name": "左端", "relX": -103, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX": 18.5, "relY": 0, "facingAngle":   0 }
        ],
        shapes: [
            // 主線（37mm幅の道路面＋直線ガイド線を描画）
            { "type": "line", "length": 121.5, "offsetX": -42.75, "offsetY": 0, "angle": 0 },

            // 分岐用カーブ（ballastWidth: 0 により道路面を描かずガイド線のみ描画）
            { "type": "arc", "radius": 66, "arcAngle": 45, "centerX": -66, "centerY": 66, "startAngle": 270, "ballastWidth": 0 },
        ]
    },
    // --- 丁字路用 I字型 退出側 (X121.5-D-RO) ---
    "TOMYTEC-BUS-X121.5-D-RO": {
        systemId: "TOMYTEC-BUS-N",
        category: "turnout",
        name: "X121.5-D-RO",
        description: "交差点道路 丁字路用 I字型（退出側）",
        nodes: [
            { "id": 0, "name": "左端", "relX": -18.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "name": "右端", "relX":   103, "relY": 0, "facingAngle":   0 }
        ],
        shapes: [
            // 主線（37mm幅の道路面＋直線ガイド線を描画）
            { "type": "line", "length": 121.5, "offsetX": 42.75, "offsetY": 0, "angle": 0 },

            // 合流用カーブ（ballastWidth: 0 により道路面を描かずガイド線のみ描画）
            { "type": "arc", "radius": 66, "arcAngle": -45, "centerX": 66, "centerY": 66, "startAngle": 270, "ballastWidth": 0 }
        ]
    }
});
