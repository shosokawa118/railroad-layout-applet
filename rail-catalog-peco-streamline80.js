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

// =============================================================================
// PECO Streamline CODE80 (N)
// =============================================================================

registerRailParts({
// ===== PECO Streamline CODE80 (N) =====

    // フレキシブルレール
    "PECO-SL-300": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "straight",
        subCategory: "フレキシブル",
        name: "SL-300",
        description: "Flexible Track Wooden Sleeper 914mm",
        dynamicType: "flexible",
        maxLength: 914,
        defaultLength: 124,
        nodes: [
            { id: 0, jointType: "rail-end", relX: -62, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 62, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 124, offsetX: 0, offsetY: 0 }]
    },
    "PECO-SL-302": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "straight",
        subCategory: "フレキシブル",
        name: "SL-302",
        description: "Flexible Track Concrete Sleeper 914mm",
        dynamicType: "flexible",
        maxLength: 914,
        defaultLength: 124,
        nodes: [
            { id: 0, jointType: "rail-end", relX: -62, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 62, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 124, offsetX: 0, offsetY: 0 }]
    },

    // 車止め
    "PECO-SL-340": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "straight",
        subCategory: "車止め",
        name: "SL-340",
        description: "Buffer Stop Wooden Type L25mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 }
        ],
        shapes: [{ type: "line", length: 25, offsetX: 12.5, offsetY: 0 }]
    },

    // 中形ポイント (Medium Radius / 長さ 123.7mm / 分岐 R457mm / 角度 12度)
    "PECO-SL-395": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "中形ポイント",
        name: "SL(E)-395",
        description: "Medium Radius Turnout Right Hand L123.7mm",
        nodes: [
            { id: 0, jointType: "rail-end", "name": "進入端", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", "name": "直進端", relX: 123.7, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", "name": "分岐端", relX: 123.7, relY: 457 * (1 - Math.cos(12 * Math.PI / 180)) + (123.7 - 457 * Math.sin(12 * Math.PI / 180)) * Math.tan(12 * Math.PI / 180), facingAngle: 12 }
        ],
        shapes: [
            { type: "line", length: 123.7, offsetX: 61.85, offsetY: 0 },
            { type: "arc", radius: 457, startAngle: 270, arcAngle: 12, centerX: 0, centerY: 457 },
            { type: "line", length: (123.7 - 457 * Math.sin(12 * Math.PI / 180)) / Math.cos(12 * Math.PI / 180), angle: 12, offsetX: (457 * Math.sin(12 * Math.PI / 180) + 123.7) / 2, offsetY: (457 * (1 - Math.cos(12 * Math.PI / 180)) + 457 * (1 - Math.cos(12 * Math.PI / 180)) + (123.7 - 457 * Math.sin(12 * Math.PI / 180)) * Math.tan(12 * Math.PI / 180)) / 2 }
        ]
    },
    "PECO-SL-396": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "中形ポイント",
        name: "SL(E)-396",
        description: "Medium Radius Turnout Left Hand L123.7mm",
        nodes: [
            { id: 0, jointType: "rail-end", "name": "進入端", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", "name": "直進端", relX: 123.7, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", "name": "分岐端", relX: 123.7, relY: -(457 * (1 - Math.cos(12 * Math.PI / 180)) + (123.7 - 457 * Math.sin(12 * Math.PI / 180)) * Math.tan(12 * Math.PI / 180)), facingAngle: -12 }
        ],
        shapes: [
            { type: "line", length: 123.7, offsetX: 61.85, offsetY: 0 },
            { type: "arc", radius: 457, startAngle: 90, arcAngle: -12, centerX: 0, centerY: -457 },
            { type: "line", length: (123.7 - 457 * Math.sin(12 * Math.PI / 180)) / Math.cos(12 * Math.PI / 180), angle: -12, offsetX: (457 * Math.sin(12 * Math.PI / 180) + 123.7) / 2, offsetY: -(457 * (1 - Math.cos(12 * Math.PI / 180)) + 457 * (1 - Math.cos(12 * Math.PI / 180)) + (123.7 - 457 * Math.sin(12 * Math.PI / 180)) * Math.tan(12 * Math.PI / 180)) / 2 }
        ]
    },

    // 大形ポイント (Large Radius / 長さ 160mm / 分岐 R914mm / 角度 8°)
    "PECO-SL-388": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "大形ポイント",
        name: "SL(E)-388",
        description: "Large Radius Turnout Right Hand L160mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 160, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", relX: 160, relY: 914 * (1 - Math.cos(8 * Math.PI / 180)) + (160 - 914 * Math.sin(8 * Math.PI / 180)) * Math.tan(8 * Math.PI / 180), facingAngle: 8 }
        ],
        shapes: [
            { type: "line", length: 160, offsetX: 80, offsetY: 0 },
            { type: "arc", radius: 914, startAngle: 270, arcAngle: 8, centerX: 0, centerY: 914 },
            { type: "line", length: (160 - 914 * Math.sin(8 * Math.PI / 180)) / Math.cos(8 * Math.PI / 180), angle: 8, offsetX: (914 * Math.sin(8 * Math.PI / 180) + 160) / 2, offsetY: (914 * (1 - Math.cos(8 * Math.PI / 180)) + 914 * (1 - Math.cos(8 * Math.PI / 180)) + (160 - 914 * Math.sin(8 * Math.PI / 180)) * Math.tan(8 * Math.PI / 180)) / 2 }
        ]
    },
    "PECO-SL-389": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "大形ポイント",
        name: "SL(E)-389",
        description: "Large Radius Turnout Left Hand L160mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 160, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", relX: 160, relY: -(914 * (1 - Math.cos(8 * Math.PI / 180)) + (160 - 914 * Math.sin(8 * Math.PI / 180)) * Math.tan(8 * Math.PI / 180)), facingAngle: -8 }
        ],
        shapes: [
            { type: "line", length: 160, offsetX: 80, offsetY: 0 },
            { type: "arc", radius: 914, startAngle: 90, arcAngle: -8, centerX: 0, centerY: -914 },
            { type: "line", length: (160 - 914 * Math.sin(8 * Math.PI / 180)) / Math.cos(8 * Math.PI / 180), angle: -8, offsetX: (914 * Math.sin(8 * Math.PI / 180) + 160) / 2, offsetY: -(914 * (1 - Math.cos(8 * Math.PI / 180)) + 914 * (1 - Math.cos(8 * Math.PI / 180)) + (160 - 914 * Math.sin(8 * Math.PI / 180)) * Math.tan(8 * Math.PI / 180)) / 2 }
        ]
    },

    // Y字ポイント (Medium Y / 全長 127mm / 半径 R762mm / 交差角 8度：左右各±4度)
    "PECO-SL-397": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "Y字ポイント",
        name: "SL(E)-397",
        description: "Medium Y Turnout L127mm 8 deg (R762mm)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 127, relY: -(762 * (1 - Math.cos(4 * Math.PI / 180)) + (127 - 762 * Math.sin(4 * Math.PI / 180)) * Math.tan(4 * Math.PI / 180)), facingAngle: -4 },
            { id: 2, jointType: "rail-end", relX: 127, relY: 762 * (1 - Math.cos(4 * Math.PI / 180)) + (127 - 762 * Math.sin(4 * Math.PI / 180)) * Math.tan(4 * Math.PI / 180), facingAngle: 4 }
        ],
        shapes: [
            // 上分岐（CCW -4°）：円弧 + 直線アプローチ
            { type: "arc", radius: 762, startAngle: 90, arcAngle: -4, centerX: 0, centerY: -762 },
            { type: "line", length: (127 - 762 * Math.sin(4 * Math.PI / 180)) / Math.cos(4 * Math.PI / 180), angle: -4, offsetX: (762 * Math.sin(4 * Math.PI / 180) + 127) / 2, offsetY: -(762 * (1 - Math.cos(4 * Math.PI / 180)) + (762 * (1 - Math.cos(4 * Math.PI / 180)) + (127 - 762 * Math.sin(4 * Math.PI / 180)) * Math.tan(4 * Math.PI / 180))) / 2 },
            // 下分岐（CW +4°）：円弧 + 直線アプローチ
            { type: "arc", radius: 762, startAngle: 270, arcAngle: 4, centerX: 0, centerY: 762 },
            { type: "line", length: (127 - 762 * Math.sin(4 * Math.PI / 180)) / Math.cos(4 * Math.PI / 180), angle: 4, offsetX: (762 * Math.sin(4 * Math.PI / 180) + 127) / 2, offsetY: (762 * (1 - Math.cos(4 * Math.PI / 180)) + (762 * (1 - Math.cos(4 * Math.PI / 180)) + (127 - 762 * Math.sin(4 * Math.PI / 180)) * Math.tan(4 * Math.PI / 180))) / 2 }
        ]
    },

    // カーブポイント (外 R914mm / 内 R457mm)
    "PECO-SL-386": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "カーブポイント",
        name: "SL(E)-386",
        description: "Curved Turnout Right Hand Outer R914 Inner R457",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 914 * Math.sin(10 * Math.PI / 180), relY: 914 * (1 - Math.cos(10 * Math.PI / 180)), facingAngle: 10 },
            { id: 2, jointType: "rail-end", relX: 457 * Math.sin(20 * Math.PI / 180), relY: 457 * (1 - Math.cos(20 * Math.PI / 180)), facingAngle: 20 }
        ],
        shapes: [
            { type: "arc", radius: 914, startAngle: 270, arcAngle: 10, centerX: 0, centerY: 914 },
            { type: "arc", radius: 457, startAngle: 270, arcAngle: 20, centerX: 0, centerY: 457 }
        ]
    },
    "PECO-SL-387": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "カーブポイント",
        name: "SL(E)-387",
        description: "Curved Turnout Left Hand Outer R914 Inner R457",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 914 * Math.sin(10 * Math.PI / 180), relY: -914 * (1 - Math.cos(10 * Math.PI / 180)), facingAngle: -10 },
            { id: 2, jointType: "rail-end", relX: 457 * Math.sin(20 * Math.PI / 180), relY: -457 * (1 - Math.cos(20 * Math.PI / 180)), facingAngle: -20 }
        ],
        shapes: [
            { type: "arc", radius: 914, startAngle: 90, arcAngle: -10, centerX: 0, centerY: -914 },
            { type: "arc", radius: 457, startAngle: 90, arcAngle: -20, centerX: 0, centerY: -457 }
        ]
    },

    // 平面交差 (Short Crossing / 全長 91mm / 交差角 25度：各±12.5度傾斜、中央原点)
    "PECO-SL-393": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "交差",
        name: "SL-393",
        description: "Short Crossing L91mm 25 deg",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -45.5 * Math.cos(12.5 * Math.PI / 180), relY: -45.5 * Math.sin(12.5 * Math.PI / 180), facingAngle: 192.5 },
            { id: 1, jointType: "rail-end", relX: -45.5 * Math.cos(12.5 * Math.PI / 180), relY: 45.5 * Math.sin(12.5 * Math.PI / 180), facingAngle: 167.5 },
            { id: 2, jointType: "rail-end", relX: 45.5 * Math.cos(12.5 * Math.PI / 180), relY: -45.5 * Math.sin(12.5 * Math.PI / 180), facingAngle: -12.5 },
            { id: 3, jointType: "rail-end", relX: 45.5 * Math.cos(12.5 * Math.PI / 180), relY: 45.5 * Math.sin(12.5 * Math.PI / 180), facingAngle: 12.5 }
        ],
        shapes: [
            { type: "line", length: 91, offsetX: 0, offsetY: 0, angle: 12.5 },
            { type: "line", length: 91, offsetX: 0, offsetY: 0, angle: -12.5 }
        ]
    },

    // 平面交差 (Long Crossing / 全長 187mm / 交差角 8度：各±4度傾斜、中央原点)
    "PECO-SL-394": {
        systemId: "PECO-STREAMLINE-N-C80",
        category: "turnout",
        subCategory: "交差",
        name: "SL-394",
        description: "Long Crossing L187mm 8 deg",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -93.5 * Math.cos(4 * Math.PI / 180), relY: -93.5 * Math.sin(4 * Math.PI / 180), facingAngle: 184 },
            { id: 1, jointType: "rail-end", relX: -93.5 * Math.cos(4 * Math.PI / 180), relY: 93.5 * Math.sin(4 * Math.PI / 180), facingAngle: 176 },
            { id: 2, jointType: "rail-end", relX: 93.5 * Math.cos(4 * Math.PI / 180), relY: -93.5 * Math.sin(4 * Math.PI / 180), facingAngle: -4 },
            { id: 3, jointType: "rail-end", relX: 93.5 * Math.cos(4 * Math.PI / 180), relY: 93.5 * Math.sin(4 * Math.PI / 180), facingAngle: 4 }
        ],
        shapes: [
            { type: "line", length: 187, offsetX: 0, offsetY: 0, angle: 4 },
            { type: "line", length: 187, offsetX: 0, offsetY: 0, angle: -4 }
        ]
    }
});
