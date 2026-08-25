// =============================================================
// TOMIX ファイントラック / ミニカーブ パーツライブラリ
// =============================================================
registerRailParts({
    // =========================================================
    // TOMIX 直線レール (ファイントラック 兼 ミニカーブ共有)
    // =========================================================
    "TOMIX-S280": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S280-F",
        description: "ストレートPCレール 280mm",
        nodes: [
            { "id": 0, "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 140,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S140": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S140-F",
        description: "ストレートPCレール 140mm",
        nodes: [
            { "id": 0, "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 70,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S70": {
        systemId: "TOMIX-FINETRACK-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-MINICURVE-N"],
        category: "straight",
        name: "S70-F",
        description: "ストレートPCレール 70mm",
        nodes: [
            { "id": 0, "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 35,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // TOMIX その他直線レール
    // =========================================================
    "TOMIX-S72.5": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S72.5-F",
        description: "ストレート(15°)PCレール 72.5mm",
        nodes: [
            { "id": 0, "relX": -36.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 36.25,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 72.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S99": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S99-F",
        description: "ストレート(45°)PCレール 99mm",
        nodes: [
            { "id": 0, "relX": -49.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 49.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 99, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S33": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S33-F",
        description: "端数PCレール 33mm",
        nodes: [
            { "id": 0, "relX": -16.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 16.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 33, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S18.5": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S18.5-F",
        description: "端数PCレール 18.5mm",
        nodes: [
            { "id": 0, "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 9.25,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-BUMPER": {
        systemId: "TOMIX-FINETRACK-N",
        category: "straight",
        name: "S70-B-F",
        description: "車止めレール 70mm",
        nodes: [
            { "id": 0, "relX": -35, "relY": 0, "facingAngle": 180 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // TOMIX 曲線レール
    // =========================================================
    "TOMIX-C280-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C280-45-F",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "relX": -107.15, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "relX": 107.15,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 280, "arcAngle": 45, "centerX": 0, "centerY": 258.68, "startAngle": 247.5 }]
    },
    "TOMIX-C317-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C317-45-F",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "relX": -121.32, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "relX": 121.32,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 45, "centerX": 0, "centerY": 292.86, "startAngle": 247.5 }]
    },
    "TOMIX-C243-45": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C243-45-F",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "relX": -92.99, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "relX": 92.99,  "relY": 0, "facingAngle": 22.5 }
        ],
        shapes: [{ "type": "arc", "radius": 243, "arcAngle": 45, "centerX": 0, "centerY": 224.50, "startAngle": 247.5 }]
    },
    "TOMIX-C541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "curve",
        name: "C541-15-F",
        description: "カーブPCレール",
        nodes: [
            { "id": 0, "relX": -70.61, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "relX": 70.61,  "relY": 0, "facingAngle": 7.5 }
        ],
        shapes: [{ "type": "arc", "radius": 541, "arcAngle": 15, "centerX": 0, "centerY": 536.36, "startAngle": 262.5 }]
    },
    
    // =========================================================
    // TOMIX ミニカーブ / スーパーミニカーブ (曲線レール)
    // =========================================================
    "TOMIX-C103-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C103-30-F",
        description: "スーパーミニカーブレール R103-30°",
        nodes: [
            { "id": 0, "relX": -26.66, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "relX": 26.66,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 30, "centerX": 0, "centerY": 99.49, "startAngle": 255.0 }]
    },
    "TOMIX-C103-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C103-60-F",
        description: "スーパーミニカーブレール R103-60°",
        nodes: [
            { "id": 0, "relX": -51.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "relX": 51.50,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 103, "arcAngle": 60, "centerX": 0, "centerY": 89.20, "startAngle": 240.0 }]
    },
    "TOMIX-C140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C140-30-F",
        description: "ミニカーブレール R140-30°",
        nodes: [
            { "id": 0, "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "relX": 36.23,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
    },
    "TOMIX-C140-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C140-60-F",
        description: "ミニカーブレール R140-60°",
        nodes: [
            { "id": 0, "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "relX": 70.00,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
    },
    "TOMIX-C177-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C177-30-F",
        description: "ミニカーブレール R177-30°",
        nodes: [
            { "id": 0, "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "relX": 45.81,  "relY": 0, "facingAngle": 15.0 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
    },
    "TOMIX-C177-60": {
        systemId: "TOMIX-MINICURVE-N",
        category: "curve",
        name: "C177-60-F",
        description: "ミニカーブレール R177-60°",
        nodes: [
            { "id": 0, "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "relX": 88.50,  "relY": 0, "facingAngle": 30.0 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
    },

    // =========================================================
    // TOMIX ミニカーブ用 ポイントレール
    // =========================================================
    "TOMIX-N-PL140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "turnout",
        name: "N-PL140-30-F",
        description: "ミニ手動ポイント N-PL140-30 (左)",
        nodes: [
            { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 51.2,  "relY": -37.5, "facingAngle": -30.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -70.0, "centerY": -140.0, "startAngle": 90 }
        ]
    },
    "TOMIX-N-PR140-30": {
        systemId: "TOMIX-MINICURVE-N",
        category: "turnout",
        name: "N-PR140-30-F",
        description: "ミニ手動ポイント N-PR140-30 (右)",
        nodes: [
            { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 51.2,  "relY": 37.5, "facingAngle": 30.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": -70.0, "centerY": 140.0, "startAngle": 270 }
        ]
    },

    // =========================================================
    // TOMIX ポイントレール
    // =========================================================
    "TOMIX-N-PR541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "N-PR541-15-F",
        description: "電動合成枕木ポイント (右)",
        nodes: [
            { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 68.7,  "relY": 18.3, "facingAngle": 15.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": 15, "centerX": -70.0, "centerY": 541.0, "startAngle": 270 }
        ]
    },
    "TOMIX-N-PL541-15": {
        systemId: "TOMIX-FINETRACK-N",
        category: "turnout",
        name: "N-PL541-15-F",
        description: "電動合成枕木ポイント (左)",
        nodes: [
            { "id": 0, "name": "進入端", "relX": -70.0, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 70.0,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 68.7,  "relY": -18.3, "facingAngle": -15.0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 541, "arcAngle": -15, "centerX": -70.0, "centerY": -541.0, "startAngle": 90 }
        ]
    }
});
