// =============================================================
// TOMIX ワイドトラムレール パーツライブラリ
// バージョン: VER-CATALOG-WIDETRAM-SIDE-S12
// (端数レール・交差線路 追加版)
// =============================================================
registerRailParts({
    // =========================================================
    // 直線レール
    // =========================================================
    "TOMIX-S140-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S140-WT",
        description: "ワイドトラムレール S140-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointGroup": "widetram-side-straight", "relX": 60.75,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointGroup": "widetram-side-straight", "relX": 60.75,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S70-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S70-WT",
        description: "ワイドトラムレール S70-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 35,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointGroup": "widetram-side-straight", "relX": 25.75,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointGroup": "widetram-side-straight", "relX": 25.75,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドトラム 端数直線レール (追加分)
    // =========================================================
    "TOMIX-S47.5-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S47.5-WT",
        description: "ワイドトラムレール S47.5-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -23.75, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 23.75,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": -14.5, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": -14.5, "relY": 18.5,  "facingAngle": 90 },
            { "id": 4, "jointGroup": "widetram-side-straight", "relX": 14.5,  "relY": -18.5, "facingAngle": -90 },
            { "id": 5, "jointGroup": "widetram-side-straight", "relX": 14.5,  "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 47.5, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S37-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S37-WT",
        description: "ワイドトラムレール S37-WT(F) (側面ジョイントなし)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -18.5, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 18.5,  "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 37, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S18.5-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "straight",
        name: "S18.5-WT",
        description: "ワイドトラムレール S18.5-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -9.25, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 9.25,  "relY": 0, "facingAngle": 0 },
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": 0, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": 0, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 18.5, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドトラム 交差線路 (追加分)
    // =========================================================
    "TOMIX-X37-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "X37-WT",
        description: "ワイドトラム交差レール X37-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -18.5, "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 18.5,  "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": 0,     "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "rail-end", "relX": 0,     "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0 },
            { "type": "line", "length": 37, "offsetX": 0, "offsetY": 0, "angle": 90 }
        ]
    },

    // =========================================================
    // 曲線レール (C140 / C177)
    // =========================================================
    "TOMIX-C140-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C140-30-WT",
        description: "ワイドトラムミニカーブレール C140-30-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 36.23,  "relY": 0, "facingAngle": 15.0 },
            { "id": 2, "jointGroup": "widetram-side-R121.5", "relX": -15.86, "relY": 14.86, "facingAngle": 82.5 },
            { "id": 3, "jointGroup": "widetram-side-R121.5", "relX": 15.86,  "relY": 14.86, "facingAngle": 97.5 },
            { "id": 4, "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": -21.84, "facingAngle": -97.5 },
            { "id": 5, "jointGroup": "widetram-side-R158.5", "relX": 20.69,  "relY": -21.84, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
    },
    "TOMIX-C140-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C140-60-WT",
        description: "ワイドトラムミニカーブレール C140-60-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70.00,  "relY": 0, "facingAngle": 30.0 },
            { "id": 2, "jointGroup": "widetram-side-R121.5", "relX": -46.50, "relY": 8.92, "facingAngle": 67.5 },
            { "id": 3, "jointGroup": "widetram-side-R121.5", "relX": 46.50,  "relY": 8.92, "facingAngle": 112.5 },
            { "id": 4, "jointGroup": "widetram-side-R158.5", "relX": -60.66, "relY": -25.07, "facingAngle": -112.5 },
            { "id": 5, "jointGroup": "widetram-side-R158.5", "relX": 60.66,  "relY": -25.07, "facingAngle": -67.5 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
    },
    "TOMIX-C177-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C177-30-WT",
        description: "ワイドトラムミニカーブレール C177-30-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 45.81,  "relY": 0, "facingAngle": 15.0 },
            { "id": 2, "jointGroup": "widetram-side-R158.5", "relX": -20.69, "relY": 13.91, "facingAngle": 82.5 },
            { "id": 3, "jointGroup": "widetram-side-R158.5", "relX": 20.69,  "relY": 13.91, "facingAngle": 97.5 },
            { "id": 4, "jointGroup": "widetram-side-R195.5", "relX": -25.52, "relY": -22.79, "facingAngle": -97.5 },
            { "id": 5, "jointGroup": "widetram-side-R195.5", "relX": 25.52,  "relY": -22.79, "facingAngle": -82.5 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
    },
    "TOMIX-C177-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "curve",
        name: "C177-60-WT",
        description: "ワイドトラムミニカーブレール C177-60-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 88.50,  "relY": 0, "facingAngle": 30.0 },
            { "id": 2, "jointGroup": "widetram-side-R158.5", "relX": -60.66, "relY": 7.15, "facingAngle": 67.5 },
            { "id": 3, "jointGroup": "widetram-side-R158.5", "relX": 60.66,  "relY": 7.15, "facingAngle": 112.5 },
            { "id": 4, "jointGroup": "widetram-side-R195.5", "relX": -74.82, "relY": -27.29, "facingAngle": -112.5 },
            { "id": 5, "jointGroup": "widetram-side-R195.5", "relX": 74.82,  "relY": -27.29, "facingAngle": -67.5 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
    },

    // =========================================================
    // ポイントレール相当品（ミニポイント＋路面パーツ） (追加分)
    // =========================================================
    "TOMIX-WT-PL140-30": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-PL140-30",
        description: "ワイドトラム ミニポイント N-PL140-30(F) 相当品",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -35,   "relY": 0,      "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 35,    "relY": 0,      "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": 14.24, "relY": -18.76, "facingAngle": -30 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -35, "centerY": 140, "startAngle": 90 }
        ]
    },
    "TOMIX-WT-PR140-30": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-PR140-30",
        description: "ワイドトラム ミニポイント N-PR140-30(F) 相当品",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -35,   "relY": 0,     "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 35,    "relY": 0,     "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": 14.24, "relY": 18.76, "facingAngle": 30 }
        ],
        shapes: [
            { "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30, "centerX": -35, "centerY": -140, "startAngle": 270 }
        ]
    },
    "TOMIX-WT-SIDING-L": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-SIDING-L",
        description: "ワイドトラム 待避線分岐ユニット (左 / 全長140mm)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70, "relY": 0,   "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70,  "relY": 0,   "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": 70,  "relY": -37, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -70,   "centerY": 140,     "startAngle": 90 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": 51.24, "centerY": -102.49, "startAngle": 210 }
        ]
    },
    "TOMIX-WT-SIDING-R": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-SIDING-R",
        description: "ワイドトラム 待避線分岐ユニット (右 / 全長140mm)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70, "relY": 0,  "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70,  "relY": 0,  "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": 70,  "relY": 37, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 140, "arcAngle": 30,  "centerX": -70,   "centerY": -140,   "startAngle": 270 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": 51.24, "centerY": 102.49, "startAngle": 330 }
        ]
    },
    "TOMIX-WT-CROSSOVER-LH": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N"],
        category: "turnout",
        name: "WT-CROSSOVER-LH",
        description: "ワイドトラム 片渡り線ユニット (左上がり / 全長140mm)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70, "relY": 18.5,  "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70,  "relY": 18.5,  "facingAngle": 0 },
            { "id": 2, "jointGroup": "rail-end", "relX": -70, "relY": -18.5, "facingAngle": 180 },
            { "id": 3, "jointGroup": "rail-end", "relX": 70,  "relY": -18.5, "facingAngle": 0 }
        ],
        shapes: [
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": 18.5 },
            { "type": "line", "length": 140, "offsetX": 0, "offsetY": -18.5 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": -35, "centerY": 158.5,  "startAngle": 90 },
            { "type": "arc", "radius": 140, "arcAngle": -30, "centerX": 35,  "centerY": -158.5, "startAngle": 270 }
        ]
    }
});
