// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義 (純粋幾何学仕様版)
// バージョン: VER-CLEAN-CATALOG-W1
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
        // ★ 人工的なYオフセット(11.95)を全削除。両端点を Y: 0 に完全統一
        // relX = 315 * sin(22.5°) = 120.55
        // centerY = 315 * cos(22.5°) = 291.01
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 0, "facingAngle": 157.5 },
            { "id": 1, "relX": 120.55,  "relY": 0, "facingAngle": 22.5 }
        ],
        "shapes": [
            { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 291.01, "startAngle": 247.5 }
        ]
    },
    "KATO-R481-15": {
        "name": "曲線 R481-15(補助用)",
        // ★ 人工的なYオフセット(2.05)を全削除。両端点を Y: 0 に完全統一
        // relX = 481 * sin(7.5°) = 62.78
        // centerY = 481 * cos(7.5°) = 476.87
        "nodes": [
            { "id": 0, "relX": -62.78, "relY": 0, "facingAngle": 172.5 },
            { "id": 1, "relX": 62.78,  "relY": 0, "facingAngle": 7.5 }
        ],
        "shapes": [
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 476.87, "startAngle": 262.5 }
        ]
    },
    "KATO-EP4-R": {
        "name": "電動ポイント4番(右)",
        "nodes": [
            { "id": 0, "name": "進入端", "relX": -63.0, "relY": 0,    "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 63.0,  "relY": 0,    "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 16.5, "facingAngle": 15.0 }
        ],
        "shapes": [
            { "type": "line", "length": 126, "offsetX": 0, "offsetY": 0 },
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 481.0, "startAngle": 270 }
        ]
    }
};
console.log("パーツカタログ（純粋幾何学仕様版）読み込み成功。: VER-CLEAN-CATALOG-W1");
