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

// =============================================================
// KATO 複線ユニトラック (カント付き含む) パーツライブラリ
// =============================================================
registerRailParts({

    // =========================================================
    // KATO 複線直線レール
    // =========================================================
    "KATO-WS248PC": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "straight",
        name: "WS248PC",
        description: "複線直線線路 248mm (PCまくら木)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線", "relX": -124.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線", "relX": -124.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線", "relX":  124.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線", "relX":  124.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 248, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 248, "offsetX": 0, "offsetY":  16.5 }
        ]
    },
    "KATO-WS186PC": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "straight",
        name: "WS186PC",
        description: "複線直線線路 186mm (PCまくら木)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線", "relX": -93.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線", "relX": -93.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線", "relX":  93.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線", "relX":  93.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  16.5 }
        ]
    },
    "KATO-WS124PC": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "straight",
        name: "WS124PC",
        description: "複線直線線路 124mm (PCまくら木)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線", "relX": -62.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線", "relX": -62.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線", "relX":  62.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線", "relX":  62.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 124, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 124, "offsetX": 0, "offsetY":  16.5 }
        ]
    },
    "KATO-WS62PC": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "straight",
        name: "WS62PC",
        description: "複線直線線路 62mm (PCまくら木)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線", "relX": -31.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線", "relX": -31.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線", "relX":  31.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線", "relX":  31.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  16.5 }
        ]
    },

    // =========================================================
    // KATO 複線カントアプローチ曲線線路 (22.5°)
    // =========================================================
    "KATO-CWR315-282-22.5A": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-22.5A",
        description: "複線カントアプローチ線路 22.5° 進入 (WR315/282)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX": -58.24, "relY": -15.86, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX": -64.68, "relY": -17.14, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  64.68, "relY":  17.14, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  58.24, "relY":  15.86, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 282, "arcAngle": 22.5, "centerX": 0, "centerY": 260.53, "startAngle": 258.75 },
            { "type": "arc", "radius": 315, "arcAngle": 22.5, "centerX": 0, "centerY": 291.01, "startAngle": 258.75 }
        ]
    },
    "KATO-CWR315-282-22.5E": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-22.5E",
        description: "複線カントアプローチ線路 22.5° 脱出 (WR315/282)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -58.24, "relY": -15.86, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -64.68, "relY": -17.14, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX":  64.68, "relY":  17.14, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX":  58.24, "relY":  15.86, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 282, "arcAngle": 22.5, "centerX": 0, "centerY": 260.53, "startAngle": 258.75 },
            { "type": "arc", "radius": 315, "arcAngle": 22.5, "centerX": 0, "centerY": 291.01, "startAngle": 258.75 }
        ]
    },

    // =========================================================
    // KATO 複線カント付き曲線線路 (45°)
    // 円弧中心を (0,0) とした基準定義
    // =========================================================
    "KATO-CWR315-282-45": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-45C",
        description: "複線カント付き曲線線路 45° (WR315/282)",
        nodes: [
            // --- 左端 (角度: 247.5° / facingAngle: 157.5) ---
            { "id": 0, "jointType": "rail-end", "name": "進入端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -107.92, "relY": -260.53, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -120.55, "relY": -291.01, "facingAngle": 157.5 },
            // --- 右端 (角度: 292.5° / facingAngle: 22.5) ---
            { "id": 2, "jointType": "rail-end", "name": "退出端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  120.55, "relY": -291.01, "facingAngle": 22.5 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  107.92, "relY": -260.53, "facingAngle": 22.5 }
        ],
        shapes: [
            // 円弧中心はどちらも (0, 0)
            { "type": "arc", "radius": 282, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 },
            { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }
        ]
    },

    // =========================================================
    // KATO 複線両渡りポイント (両渡り渡り線 310mm)
    // =========================================================
    "KATO-WX310": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "turnout",
        name: "WX310",
        description: "複線両渡りポイント 310mm",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-下線", "relX": -155.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-上線", "relX": -155.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-上線", "relX":  155.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-下線", "relX":  155.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 310, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 310, "offsetX": 0, "offsetY":  16.5 },
            { "type": "line", "length": 46.67, "offsetX": 0, "offsetY": 0 }
        ]
    }
});
