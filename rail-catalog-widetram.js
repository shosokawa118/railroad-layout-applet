// =============================================================
// TOMIX ワイドトラムレール パーツライブラリ
// =============================================================
registerRailParts({
    // =========================================================
    // 直線レール
    // =========================================================
    "TOMIX-S140-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-FINETRACK-N"],
        category: "straight",
        name: "S140-WT",
        description: "ワイドトラムレール S140-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70,  "relY": 0, "facingAngle": 0 },
            // 直線用側面ジョイント（端から9.25mm位置：relX = -70 + 9.25 = -60.75）
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": -60.75, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-S70-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-FINETRACK-N"],
        category: "straight",
        name: "S70-WT",
        description: "ワイドトラムレール S70-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -35, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointGroup": "rail-end", "relX": 35,  "relY": 0, "facingAngle": 0 },
            // 直線用側面ジョイント（端から9.25mm位置：relX = -35 + 9.25 = -25.75）
            { "id": 2, "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": -18.5, "facingAngle": -90 },
            { "id": 3, "jointGroup": "widetram-side-straight", "relX": -25.75, "relY": 18.5,  "facingAngle": 90 }
        ],
        shapes: [{ "type": "line", "length": 70, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // 曲線レール (C140 / C177)
    // =========================================================
    "TOMIX-C140-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-MINICURVE-N"],
        category: "curve",
        name: "C140-30-WT",
        description: "ワイドトラムミニカーブレール C140-30-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -36.23, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 36.23,  "relY": 0, "facingAngle": 15.0 },
            // 内側 (R=121.5) 将来拡張用
            { "id": 2, "jointGroup": "widetram-side-R121.5", "relX": 0, "relY": 4.77, "facingAngle": 90 },
            // 外側 (R=158.5) ★C177内側と共通
            { "id": 3, "jointGroup": "widetram-side-R158.5", "relX": 0, "relY": -4.77, "facingAngle": -90 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 30, "centerX": 0, "centerY": 135.23, "startAngle": 255.0 }]
    },
    "TOMIX-C140-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-MINICURVE-N"],
        category: "curve",
        name: "C140-60-WT",
        description: "ワイドトラムミニカーブレール C140-60-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -70.00, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 70.00,  "relY": 0, "facingAngle": 30.0 },
            // 内側 (R=121.5) 将来拡張用
            { "id": 2, "jointGroup": "widetram-side-R121.5", "relX": 0, "relY": 18.76, "facingAngle": 90 },
            // 外側 (R=158.5) ★C177内側と共通
            { "id": 3, "jointGroup": "widetram-side-R158.5", "relX": 0, "relY": -18.76, "facingAngle": -90 }
        ],
        shapes: [{ "type": "arc", "radius": 140, "arcAngle": 60, "centerX": 0, "centerY": 121.24, "startAngle": 240.0 }]
    },
    "TOMIX-C177-30-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-MINICURVE-N"],
        category: "curve",
        name: "C177-30-WT",
        description: "ワイドトラムミニカーブレール C177-30-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -45.81, "relY": 0, "facingAngle": 165.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 45.81,  "relY": 0, "facingAngle": 15.0 },
            // 内側 (R=158.5) ★C140外側と共通
            { "id": 2, "jointGroup": "widetram-side-R158.5", "relX": 0, "relY": 6.03, "facingAngle": 90 },
            // 外側 (R=195.5) 将来拡張用
            { "id": 3, "jointGroup": "widetram-side-R195.5", "relX": 0, "relY": -6.03, "facingAngle": -90 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 30, "centerX": 0, "centerY": 170.97, "startAngle": 255.0 }]
    },
    "TOMIX-C177-60-WT": {
        systemId: "TOMIX-WIDETRAM-N",
        compatibleSystems: ["TOMIX-WIDETRAM-N", "TOMIX-MINICURVE-N"],
        category: "curve",
        name: "C177-60-WT",
        description: "ワイドトラムミニカーブレール C177-60-WT(F)",
        nodes: [
            { "id": 0, "jointGroup": "rail-end", "relX": -88.50, "relY": 0, "facingAngle": 150.0 },
            { "id": 1, "jointGroup": "rail-end", "relX": 88.50,  "relY": 0, "facingAngle": 30.0 },
            // 内側 (R=158.5) ★C140外側と共通
            { "id": 2, "jointGroup": "widetram-side-R158.5", "relX": 0, "relY": 23.71, "facingAngle": 90 },
            // 外側 (R=195.5) 将来拡張用
            { "id": 3, "jointGroup": "widetram-side-R195.5", "relX": 0, "relY": -23.71, "facingAngle": -90 }
        ],
        shapes: [{ "type": "arc", "radius": 177, "arcAngle": 60, "centerX": 0, "centerY": 153.29, "startAngle": 240.0 }]
    }
});
