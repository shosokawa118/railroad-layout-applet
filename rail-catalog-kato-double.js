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
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -124.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -124.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  124.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  124.0, "relY": -16.5, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -93.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -93.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  93.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  93.0, "relY": -16.5, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -62.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -62.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  62.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  62.0, "relY": -16.5, "facingAngle": 0 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -31.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -31.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  31.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  31.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  16.5 }
        ]
    },

    // =========================================================
    // KATO 複線カントアプローチ曲線線路 (22.5°: WR315/282)
    // =========================================================
    "KATO-CWR315-282-22.5A": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-22.5A",
        description: "複線カントアプローチ線路 22.5° 進入 (WR315/282)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX": -61.45, "relY": -308.96, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX": -55.01, "relY": -276.59, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  55.01, "relY": -276.59, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  61.45, "relY": -308.96, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 315, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 282, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },
    "KATO-CWR315-282-22.5E": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-22.5E",
        description: "複線カントアプローチ線路 22.5° 脱出 (WR315/282)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -61.45, "relY": -308.96, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -55.01, "relY": -276.59, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX":  55.01, "relY": -276.59, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX":  61.45, "relY": -308.96, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 315, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 282, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },

    // =========================================================
    // KATO 複線カント付き曲線線路 (45°: WR315/282)
    // =========================================================
    "KATO-CWR315-282-45": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR315/282-45C",
        description: "複線カント付き曲線線路 45° (WR315/282)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -120.55, "relY": -291.01, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -107.92, "relY": -260.53, "facingAngle": 157.5 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  107.92, "relY": -260.53, "facingAngle": 22.5 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  120.55, "relY": -291.01, "facingAngle": 22.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 },
            { "type": "arc", "radius": 282, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }
        ]
    },

    // =========================================================
    // KATO 複線カントアプローチ曲線線路 (22.5°: WR414/381)
    // =========================================================
    "KATO-CWR414-381-22.5A": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR414/381-22.5A",
        description: "複線カントアプローチ線路 22.5° 進入 (WR414/381)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX": -80.76, "relY": -406.07, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX": -74.33, "relY": -373.70, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  74.33, "relY": -373.70, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  80.76, "relY": -406.07, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 414, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 381, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },
    "KATO-CWR414-381-22.5E": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR414/381-22.5E",
        description: "複線カントアプローチ線路 22.5° 脱出 (WR414/381)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -80.76, "relY": -406.07, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -74.33, "relY": -373.70, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX":  74.33, "relY": -373.70, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX":  80.76, "relY": -406.07, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 414, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 381, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },

    // =========================================================
    // KATO 複線カント付き曲線線路 (45°: WR414/381)
    // =========================================================
    "KATO-CWR414-381-45": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR414/381-45C",
        description: "複線カント付き曲線線路 45° (WR414/381)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -158.43, "relY": -382.48, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -145.80, "relY": -352.00, "facingAngle": 157.5 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  145.80, "relY": -352.00, "facingAngle": 22.5 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  158.43, "relY": -382.48, "facingAngle": 22.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 414, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 },
            { "type": "arc", "radius": 381, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }
        ]
    },

    // =========================================================
    // KATO 複線カントアプローチ曲線線路 (22.5°: WR480/447)
    // =========================================================
    "KATO-CWR480-447-22.5A": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR480/447-22.5A",
        description: "複線カントアプローチ線路 22.5° 進入 (WR480/447)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX": -93.64, "relY": -470.80, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX": -87.21, "relY": -438.43, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  87.21, "relY": -438.43, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  93.64, "relY": -470.80, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 480, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 447, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },
    "KATO-CWR480-447-22.5E": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR480/447-22.5E",
        description: "複線カントアプローチ線路 22.5° 脱出 (WR480/447)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -93.64, "relY": -470.80, "facingAngle": 168.75 },
            { "id": 1, "jointType": "rail-end", "name": "カント端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -87.21, "relY": -438.43, "facingAngle": 168.75 },
            { "id": 2, "jointType": "rail-end", "name": "平坦端-内線", "jointGroup": "unijoiner-33mm", "relX":  87.21, "relY": -438.43, "facingAngle": 11.25 },
            { "id": 3, "jointType": "rail-end", "name": "平坦端-外線", "jointGroup": "unijoiner-33mm", "relX":  93.64, "relY": -470.80, "facingAngle": 11.25 }
        ],
        shapes: [
            { "type": "arc", "radius": 480, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 },
            { "type": "arc", "radius": 447, "arcAngle": 22.5, "centerX": 0, "centerY": 0, "startAngle": 258.75 }
        ]
    },

    // =========================================================
    // KATO 複線カント付き曲線線路 (45°: WR480/447)
    // =========================================================
    "KATO-CWR480-447-45": {
        systemId: "KATO-DOUBLETRACK-N",
        category: "curve",
        name: "WR480/447-45C",
        description: "複線カント付き曲線線路 45° (WR480/447)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端-外線", "jointGroup": "kato-cant", "polarity": 1, "relX": -183.69, "relY": -443.47, "facingAngle": 157.5 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-内線", "jointGroup": "kato-cant", "polarity": 1, "relX": -171.06, "relY": -413.00, "facingAngle": 157.5 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-内線", "jointGroup": "kato-cant", "polarity": -1, "relX":  171.06, "relY": -413.00, "facingAngle": 22.5 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-外線", "jointGroup": "kato-cant", "polarity": -1, "relX":  183.69, "relY": -443.47, "facingAngle": 22.5 }
        ],
        shapes: [
            { "type": "arc", "radius": 480, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 },
            { "type": "arc", "radius": 447, "arcAngle": 45, "centerX": 0, "centerY": 0, "startAngle": 247.5 }
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
            { "id": 0, "jointType": "rail-end", "name": "進入端-主線(上)", "relX": -155.0, "relY": -16.5, "facingAngle": 180 },
            { "id": 1, "jointType": "rail-end", "name": "進入端-副線(下)", "relX": -155.0, "relY":  16.5, "facingAngle": 180 },
            { "id": 2, "jointType": "rail-end", "name": "退出端-副線(下)", "relX":  155.0, "relY":  16.5, "facingAngle": 0 },
            { "id": 3, "jointType": "rail-end", "name": "退出端-主線(上)", "relX":  155.0, "relY": -16.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 310, "offsetX": 0, "offsetY": -16.5 },
            { "type": "line", "length": 310, "offsetX": 0, "offsetY":  16.5 },
            { "type": "line", "length": 46.67, "offsetX": 0, "offsetY": 0 }
        ]
    }
});
