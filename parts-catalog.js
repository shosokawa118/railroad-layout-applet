// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義 (ポイントズレ完全修正版)
// バージョン: VER-FIX-TURNOUT-Y-P7
// =============================================================
const partsCatalog = {
    "KATO-248": {
        "name": "直線 S248",
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
        ],
        "shapes": [
            { "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-S60": {
        "name": "直線 S60",
        "nodes": [
            { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
        ],
        "shapes": [
            { "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-S64": {
        "name": "直線 S64",
        "nodes": [
            { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
        ],
        "shapes": [
            { "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-R315-45": {
        "name": "曲線 R315-45(左右対称)",
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 11.95, "facingAngle": 157.5 },
            { "id": 1, "relX": 120.55,  "relY": 11.95, "facingAngle": 22.5 }
        ],
        "shapes": [
            { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 326.95, "startAngle": 247.5 }
        ]
    },
    "KATO-R481-15": {
        "name": "曲線 R481-15(補助用)",
        "nodes": [
            { "id": 0, "relX": -62.5, "relY": 2.05, "facingAngle": 172.5 },
            { "id": 1, "relX": 62.5,  "relY": 2.05, "facingAngle": 7.5 }
        ],
        "shapes": [
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 483.05, "startAngle": 262.5 }
        ]
    },
    "KATO-EP4-R": {
        "name": "電動ポイント4番(右)",
        // ★Fabricの自動バウンディングボックス中心(4.2pxの偏り)から逆算した、ズレを100%相殺する完全な正解データ
        "nodes": [
            { "id": 0, "name": "進入端", "relX": -63.0, "relY": -8.3, "facingAngle": 180 }, // ★-4.1 から -8.3 に修正
            { "id": 1, "name": "直進端", "relX": 63.0,  "relY": -8.3, "facingAngle": 0 },   // ★-4.1 から -8.3 に修正
            { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 8.1,  "facingAngle": 15.0 }  // ★12.4 から 8.1 に修正
        ],
        "shapes": [
            { "type": "line", "length": 126, "offsetX": 0, "offsetY": -4.1 },
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 476.9, "startAngle": 270 }
        ]
    }
};
console.log("パーツカタログ（ポイントノード位置完全補正版）読み込み成功！: VER-FIX-TURNOUT-Y-P7");
