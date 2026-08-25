// =============================================================
// KATO ユニトラム (複線プレート・25mm間隔) パーツライブラリ
// =============================================================
registerRailParts({
    // --- 複線直線軌道 186mm ---
    "KATO-UNITRAM-S186D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 186mm",
        description: "186mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左", "relX": -93, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "外軌-左", "relX": -93, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "内軌-右", "relX":  93, "relY": -12.5, "facingAngle": 0 },
            { "id": 3, "name": "外軌-右", "relX":  93, "relY":  12.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線直線軌道 124mm ---
    "KATO-UNITRAM-S124D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 124mm",
        description: "124mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左", "relX": -62, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "外軌-左", "relX": -62, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "内軌-右", "relX":  62, "relY": -12.5, "facingAngle": 0 },
            { "id": 3, "name": "外軌-右", "relX":  62, "relY":  12.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 124, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 124, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線直線軌道 62mm ---
    "KATO-UNITRAM-S62D": {
        systemId: "KATO-UNITRAM-N",
        category: "straight",
        name: "複線直線軌道 62mm",
        description: "62mm 複線プレート (軌道間隔25mm)",
        nodes: [
            { "id": 0, "name": "内軌-左", "relX": -31, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "外軌-左", "relX": -31, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "内軌-右", "relX":  31, "relY": -12.5, "facingAngle": 0 },
            { "id": 3, "name": "外軌-右", "relX":  31, "relY":  12.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  12.5 }
        ]
    },

    // --- 複線曲線軌道 L (左) ---
    "KATO-UNITRAM-C-L": {
        systemId: "KATO-UNITRAM-N",
        category: "curve",
        name: "複線交差点/交差角 曲線 L",
        description: "交差点 曲線軌道 (内線25mm+R180 / 外線50mm+R180)",
        nodes: [
            { "id": 0, "name": "直線側-内軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "直線側-外軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "45°頂点-内軌", "relX":  90.28, "relY": -65.22, "facingAngle": -45 },
            { "id": 3, "name": "45°頂点-外軌", "relX": 115.28, "relY": -40.22, "facingAngle": -45 }
        ],
        shapes: [
            { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -37.0, "centerY": -192.5, "startAngle": 90 },
            { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -12.0, "centerY": -167.5, "startAngle": 90 }
        ]
    },

    // --- 複線曲線軌道 R (右) ---
    "KATO-UNITRAM-C-R": {
        systemId: "KATO-UNITRAM-N",
        category: "curve",
        name: "複線交差点/交差角 曲線 R",
        description: "交差点 曲線軌道 (内線25mm+R180 / 外線50mm+R180)",
        nodes: [
            { "id": 0, "name": "直線側-内軌", "relX": -62.0, "relY":  12.5, "facingAngle": 180 },
            { "id": 1, "name": "直線側-外軌", "relX": -62.0, "relY": -12.5, "facingAngle": 180 },
            { "id": 2, "name": "45°頂点-内軌", "relX":  90.28, "relY":  65.22, "facingAngle": 45 },
            { "id": 3, "name": "45°頂点-外軌", "relX": 115.28, "relY":  40.22, "facingAngle": 45 }
        ],
        shapes: [
            { "type": "line", "length": 25, "offsetX": -49.5, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -37.0, "centerY": 192.5, "startAngle": 270 },
            { "type": "line", "length": 50, "offsetX": -37.0, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -12.0, "centerY": 167.5, "startAngle": 270 }
        ]
    },

    // --- 複線分岐ポイント L (左) ---
    "KATO-UNITRAM-TURNOUT-L": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線分岐ポイント L",
        description: "電動複線分岐ポイント (186mm直進 + C-L曲線分岐)",
        nodes: [
            { "id": 0, "name": "進入-内軌", "relX": -93.0, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "進入-外軌", "relX": -93.0, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "直進-内軌", "relX":  93.0, "relY": -12.5, "facingAngle": 0 },
            { "id": 3, "name": "直進-外軌", "relX":  93.0, "relY":  12.5, "facingAngle": 0 },
            { "id": 4, "name": "分岐-内軌", "relX":  59.28, "relY": -65.22, "facingAngle": -45 },
            { "id": 5, "name": "分岐-外軌", "relX":  84.28, "relY": -40.22, "facingAngle": -45 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 },
            { "type": "line", "length": 25, "offsetX": -80.5, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -68.0, "centerY": -192.5, "startAngle": 90 },
            { "type": "line", "length": 50, "offsetX": -68.0, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": -45, "centerX": -43.0, "centerY": -167.5, "startAngle": 90 }
        ]
    },

    // --- 複線分岐ポイント R (右) ---
    "KATO-UNITRAM-TURNOUT-R": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線分岐ポイント R",
        description: "電動複線分岐ポイント (186mm直進 + C-R曲線分岐)",
        nodes: [
            { "id": 0, "name": "進入-内軌", "relX": -93.0, "relY":  12.5, "facingAngle": 180 },
            { "id": 1, "name": "進入-外軌", "relX": -93.0, "relY": -12.5, "facingAngle": 180 },
            { "id": 2, "name": "直進-内軌", "relX":  93.0, "relY":  12.5, "facingAngle": 0 },
            { "id": 3, "name": "直進-外軌", "relX":  93.0, "relY": -12.5, "facingAngle": 0 },
            { "id": 4, "name": "分岐-内軌", "relX":  59.28, "relY":  65.22, "facingAngle": 45 },
            { "id": 5, "name": "分岐-外軌", "relX":  84.28, "relY":  40.22, "facingAngle": 45 }
        ],
        shapes: [
            { "type": "line", "length": 186, "offsetX": 0, "offsetY": -12.5 },
            { "type": "line", "length": 186, "offsetX": 0, "offsetY":  12.5 },
            { "type": "line", "length": 25, "offsetX": -80.5, "offsetY": 12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -68.0, "centerY": 192.5, "startAngle": 270 },
            { "type": "line", "length": 50, "offsetX": -68.0, "offsetY": -12.5 },
            { "type": "arc", "radius": 180, "arcAngle": 45, "centerX": -43.0, "centerY": 167.5, "startAngle": 270 }
        ]
    },

    // --- 複線十字軌道 62mm ---
    "KATO-UNITRAM-CROSS-62D": {
        systemId: "KATO-UNITRAM-N",
        category: "turnout",
        name: "複線十字軌道 62mm",
        description: "62mm×62mm 複線十字交差点軌道",
        nodes: [
            { "id": 0, "name": "西-内軌", "relX": -31, "relY": -12.5, "facingAngle": 180 },
            { "id": 1, "name": "西-外軌", "relX": -31, "relY":  12.5, "facingAngle": 180 },
            { "id": 2, "name": "東-内軌", "relX":  31, "relY": -12.5, "facingAngle": 0 },
            { "id": 3, "name": "東-外軌", "relX":  31, "relY":  12.5, "facingAngle": 0 },
            { "id": 4, "name": "北-内軌", "relX":  12.5, "relY": -31, "facingAngle": 270 },
            { "id": 5, "name": "北-外軌", "relX": -12.5, "relY": -31, "facingAngle": 270 },
            { "id": 6, "name": "南-内軌", "relX":  12.5, "relY":  31, "facingAngle": 90 },
            { "id": 7, "name": "南-外軌", "relX": -12.5, "relY":  31, "facingAngle": 90 }
        ],
        shapes: [
            { "type": "line", "length": 62, "offsetX": 0, "offsetY": -12.5, "angle": 0 },
            { "type": "line", "length": 62, "offsetX": 0, "offsetY":  12.5, "angle": 0 },
            { "type": "line", "length": 62, "offsetX": -12.5, "offsetY": 0, "angle": 90 },
            { "type": "line", "length": 62, "offsetX":  12.5, "offsetY": 0, "angle": 90 }
        ]
    }
});
