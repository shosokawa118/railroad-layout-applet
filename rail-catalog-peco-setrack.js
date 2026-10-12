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
// PECO Setrack N Gauge (Code 80) Rail Catalog
// =============================================================================

registerRailParts({
    // --- 直線レール ---
    "PECO-ST-1": {
        systemId: "PECO-SETRACK-N",
        category: "straight",
        name: "ST-1",
        description: "Standard Straight 87mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -43.5, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 43.5, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 87, offsetX: 0, offsetY: 0 }]
    },
    "PECO-ST-2": {
        systemId: "PECO-SETRACK-N",
        category: "straight",
        subCategory: "端数",
        name: "ST-2",
        description: "Short Straight 58mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -29, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 29, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 58, offsetX: 0, offsetY: 0 }]
    },
    "PECO-ST-10": {
        systemId: "PECO-SETRACK-N",
        category: "straight",
        subCategory: "給電",
        name: "ST-10",
        description: "Power Connecting Clip Track 87mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -43.5, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 43.5, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 87, offsetX: 0, offsetY: 0 }]
    },
    "PECO-ST-11": {
        systemId: "PECO-SETRACK-N",
        category: "straight",
        name: "ST-11",
        description: "Double Straight 174mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -87, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 87, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 174, offsetX: 0, offsetY: 0 }]
    },
    "PECO-ST-8": {
        systemId: "PECO-SETRACK-N",
        category: "straight",
        subCategory: "終端",
        name: "ST-8",
        description: "Buffer Stop",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 }
        ],
        shapes: [{ type: "rect", width: 15, height: 20, offsetX: -7.5, offsetY: 0 }]
    },

    // --- 1st Radius (R228.6mm) ---
    "PECO-ST-3": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "1st",
        name: "ST-3",
        description: "Standard Curve 1st Radius (R228.6mm / 22.5°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -44.59, relY: -224.21, facingAngle: 168.75 },
            { id: 1, jointType: "rail-end", relX: 44.59, relY: -224.21, facingAngle: 11.25 }
        ],
        shapes: [
            { type: "arc", radius: 228.6, arcAngle: 22.5, centerX: 0, centerY: 0, startAngle: 258.75 }
        ]
    },
    "PECO-ST-12": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "1st",
        name: "ST-12",
        description: "Double Curve 1st Radius (R228.6mm / 45°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -87.48, relY: -211.20, facingAngle: 157.5 },
            { id: 1, jointType: "rail-end", relX: 87.48, relY: -211.20, facingAngle: 22.5 }
        ],
        shapes: [
            { type: "arc", radius: 228.6, arcAngle: 45, centerX: 0, centerY: 0, startAngle: 247.5 }
        ]
    },

    // --- 2nd Radius (R263.5mm) ---
    "PECO-ST-14": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "2nd",
        name: "ST-14",
        description: "Standard Curve 2nd Radius (R263.5mm / 22.5°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -51.40, relY: -258.43, facingAngle: 168.75 },
            { id: 1, jointType: "rail-end", relX: 51.40, relY: -258.43, facingAngle: 11.25 }
        ],
        shapes: [
            { type: "arc", radius: 263.5, arcAngle: 22.5, centerX: 0, centerY: 0, startAngle: 258.75 }
        ]
    },
    "PECO-ST-15": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "2nd",
        name: "ST-15",
        description: "Double Curve 2nd Radius (R263.5mm / 45°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -100.84, relY: -243.44, facingAngle: 157.5 },
            { id: 1, jointType: "rail-end", relX: 100.84, relY: -243.44, facingAngle: 22.5 }
        ],
        shapes: [
            { type: "arc", radius: 263.5, arcAngle: 45, centerX: 0, centerY: 0, startAngle: 247.5 }
        ]
    },

    // --- 3rd Radius (R298.5mm) ---
    "PECO-ST-16": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "3rd",
        name: "ST-16",
        description: "Standard Curve 3rd Radius (R298.5mm / 22.5°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -58.23, relY: -292.76, facingAngle: 168.75 },
            { id: 1, jointType: "rail-end", relX: 58.23, relY: -292.76, facingAngle: 11.25 }
        ],
        shapes: [
            { type: "arc", radius: 298.5, arcAngle: 22.5, centerX: 0, centerY: 0, startAngle: 258.75 }
        ]
    },
    "PECO-ST-17": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "3rd",
        name: "ST-17",
        description: "Double Curve 3rd Radius (R298.5mm / 45°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -114.23, relY: -275.78, facingAngle: 157.5 },
            { id: 1, jointType: "rail-end", relX: 114.23, relY: -275.78, facingAngle: 22.5 }
        ],
        shapes: [
            { type: "arc", radius: 298.5, arcAngle: 45, centerX: 0, centerY: 0, startAngle: 247.5 }
        ]
    },

    // --- 4th Radius (R333.4mm) ---
    "PECO-ST-18": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "4th",
        name: "ST-18",
        description: "Standard Curve 4th Radius (R333.4mm / 22.5°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -65.04, relY: -326.98, facingAngle: 168.75 },
            { id: 1, jointType: "rail-end", relX: 65.04, relY: -326.98, facingAngle: 11.25 }
        ],
        shapes: [
            { type: "arc", radius: 333.4, arcAngle: 22.5, centerX: 0, centerY: 0, startAngle: 258.75 }
        ]
    },
    "PECO-ST-19": {
        systemId: "PECO-SETRACK-N",
        category: "curve",
        subCategory: "4th",
        name: "ST-19",
        description: "Double Curve 4th Radius (R333.4mm / 45°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -127.58, relY: -308.02, facingAngle: 157.5 },
            { id: 1, jointType: "rail-end", relX: 127.58, relY: -308.02, facingAngle: 22.5 }
        ],
        shapes: [
            { type: "arc", radius: 333.4, arcAngle: 45, centerX: 0, centerY: 0, startAngle: 247.5 }
        ]
    },

    // --- ポイント・交差レール（進入端: X=0） ---
    "PECO-ST-5": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "ST-5",
        description: "Right Hand Turnout L87mm / 22.5deg",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 87, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", relX: 228 * Math.sin(22.5 * Math.PI / 180), relY: 228 * (1 - Math.cos(22.5 * Math.PI / 180)), facingAngle: 22.5 }
        ],
        shapes: [
            { type: "line", length: 87, offsetX: 43.5, offsetY: 0 },
            { type: "arc", radius: 228, startAngle: 270, arcAngle: 22.5, centerX: 0, centerY: 228 }
        ]
    },
    "PECO-ST-6": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "ST-6",
        description: "Left Hand Turnout L87mm / 22.5deg",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 87, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", relX: 228 * Math.sin(22.5 * Math.PI / 180), relY: -228 * (1 - Math.cos(22.5 * Math.PI / 180)), facingAngle: -22.5 }
        ],
        shapes: [
            { type: "line", length: 87, offsetX: 43.5, offsetY: 0 },
            { type: "arc", radius: 228, startAngle: 90, arcAngle: -22.5, centerX: 0, centerY: -228 }
        ]
    },
    "PECO-ST-7": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "ST-7",
        description: "Short Crossing L91.5mm / 22.5deg",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -91.5 / 2, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX:  91.5 / 2, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "rail-end", relX: -91.5 * Math.cos(22.5 * Math.PI / 180) / 2, relY:  91.5 * Math.sin(22.5 * Math.PI / 180) / 2, facingAngle: 157.5 },
            { id: 3, jointType: "rail-end", relX:  91.5 * Math.cos(22.5 * Math.PI / 180) / 2, relY: -91.5 * Math.sin(22.5 * Math.PI / 180) / 2, facingAngle: -22.5 }
        ],
        shapes: [
            { type: "line", length: 91.5, offsetX: 0, offsetY: 0 },
            { type: "line", length: 91.5, offsetX: 0, offsetY: 0, angle: -22.5 }
        ]
    },
    "PECO-ST-43": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "補助",
        name: "ST-43",
        description: "Extra Short Straight 22mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -11, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 11, relY: 0, facingAngle: 0 }
        ],
        shapes: [{ type: "line", length: 22, offsetX: 0, offsetY: 0 }]
    },
    "PECO-ST-47": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "補助",
        name: "ST-47",
        description: "Special Short Curve R2 (263.5mm / 11.25°)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 263.5 * Math.sin(11.25 * Math.PI / 180), relY: 263.5 * (1 - Math.cos(11.25 * Math.PI / 180)), facingAngle: 11.25 }
        ],
        shapes: [
            { type: "arc", radius: 263.5, centerX: 0, centerY: 263.5, startAngle: 270, arcAngle: 11.25 }
        ]
    },
    "PECO-ST-44": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "ST-44",
        description: "curve Turnout Right (R2-33.75° / R3-22.5°複合)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 263.5 * Math.sin(33.75 * Math.PI / 180), relY: 263.5 * (1 - Math.cos(33.75 * Math.PI / 180)), facingAngle: 33.75 },
            { id: 2, jointType: "rail-end", relX: 35 + 263.5 * Math.sin(22.5 * Math.PI / 180), relY: 263.5 * (1 - Math.cos(22.5 * Math.PI / 180)), facingAngle: 22.5 }
        ],
        shapes: [
            { type: "arc", radius: 263.5, centerX: 0, centerY: 263.5, startAngle: 270, arcAngle: 33.75 },
            { type: "arc", radius: 263.5, centerX: 35, centerY: 263.5, startAngle: 270, arcAngle: 22.5 },
            { type: "line", length: 35, offsetX: 17.5, offsetY: 0 }
        ]
    },
    "PECO-ST-45": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "分岐",
        name: "ST-45",
        description: "curve Turnout Left (R2-33.75° / R3-22.5°複合)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 263.5 * Math.sin(33.75 * Math.PI / 180), relY: -263.5 * (1 - Math.cos(33.75 * Math.PI / 180)), facingAngle: 326.25 },
            { id: 2, jointType: "rail-end", relX: 35 + 263.5 * Math.sin(22.5 * Math.PI / 180), relY: -263.5 * (1 - Math.cos(22.5 * Math.PI / 180)), facingAngle: 337.5 }
        ],
        shapes: [
            { type: "arc", radius: 263.5, centerX: 0, centerY: -263.5, startAngle: 90, arcAngle: -33.75 },
            { type: "arc", radius: 263.5, centerX: 35, centerY: -263.5, startAngle: 90, arcAngle: -22.5 },
            { type: "line", length: 35, offsetX: 17.5, offsetY: 0 }
        ]
    },
    "PECO-ST-50": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "ST-50",
        description: "Right Hand Crossing L87mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 0, relY: 43.5 * Math.tan(22.5 * Math.PI / 180), facingAngle: 157.5 },
            { id: 2, jointType: "rail-end", relX: 87, relY: -43.5 * Math.tan(22.5 * Math.PI / 180), facingAngle: -22.5 },
            { id: 3, jointType: "rail-end", relX: 87, relY: 0, facingAngle: 0 }
        ],
        shapes: [
            { type: "line", length: 87, offsetX: 43.5, offsetY: 0 },
            { type: "line", length: 87 / Math.cos(22.5 * Math.PI / 180), offsetX: 43.5, offsetY: 0, angle: -22.5 }
        ]
    },
    "PECO-ST-51": {
        systemId: "PECO-SETRACK-N",
        category: "turnout",
        subCategory: "交差",
        name: "ST-51",
        description: "Left Hand Crossing L87mm",
        nodes: [
            { id: 0, jointType: "rail-end", relX: 0, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 0, relY: -43.5 * Math.tan(22.5 * Math.PI / 180), facingAngle: -157.5 },
            { id: 2, jointType: "rail-end", relX: 87, relY: 43.5 * Math.tan(22.5 * Math.PI / 180), facingAngle: 22.5 },
            { id: 3, jointType: "rail-end", relX: 87, relY: 0, facingAngle: 0 }
        ],
        shapes: [
            { type: "line", length: 87, offsetX: 43.5, offsetY: 0 },
            { type: "line", length: 87 / Math.cos(22.5 * Math.PI / 180), offsetX: 43.5, offsetY: 0, angle: 22.5 }
        ]
    },

    // --- アクセサリ ---
/*
    "PECO-ST-9": {
        systemId: "PECO-SETRACK-N",
        category: "other",
        name: "ST-9",
        description: "Power Connecting Clips (ダミー表示)",
        nodes: [],
        shapes: [{ type: "rect", width: 10, height: 16.5, offsetX: 0, offsetY: 0 }]
    },
*/
    "PECO-ST-21": {
        systemId: "PECO-SETRACK-N",
        category: "other",
        subCategory: "踏切",
        name: "ST-21",
        description: "Level Crossing Add-On Straight 87mm (踏板幅35mm)",
        nodes: [
            { id: 0, jointType: "rail-end", relX: -43.5, relY: 0, facingAngle: 180 },
            { id: 1, jointType: "rail-end", relX: 43.5, relY: 0, facingAngle: 0 },
            { id: 2, jointType: "side-attachment", relX: 0, relY: -17.5, facingAngle: 270 },
            { id: 3, jointType: "side-attachment", relX: 0, relY: 17.5, facingAngle: 90 }
        ],
        shapes: [
            { type: "line", length: 87, offsetX: 0, offsetY: 0 },
            { type: "rect", width: 76, height: 35, offsetX: 0, offsetY: 0 }
        ]
    },
    "PECO-ST-20": {
        systemId: "PECO-SETRACK-N",
        category: "other",
        subCategory: "踏切",
        name: "ST-20",
        description: "Level Crossing Slope Part (幅20.5mm)",
        nodes: [
            { id: 0, jointType: "side-attachment", relX: 0, relY: 0, facingAngle: 270 }
        ],
        shapes: [
            { type: "rect", width: 76, height: 20.5, offsetX: 0, offsetY: 10.25 }
        ]
    }
});