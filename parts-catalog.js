// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義 (完全幾何学データ版)
// バージョン: VER-GENERIC-OFFSET-Q8
// =============================================================
const partsCatalog = {
    "KATO-248": {
        "name": "直線 S248",
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 }, // 直線中心線上(Y:0)
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }    // 直線中心線上(Y:0)
        ],
        "shapes": [
            { "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 } // Y:0を走る直線
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
        // ★ご要望通り、人間が仕様書を見て一瞬で書ける、一切の歪みのない純粋な幾何学設計値！
        "nodes": [
            { "id": 0, "name": "進入端", "relX": -63.0, "relY": 0,    "facingAngle": 180 },  // 直線線上なので Y: 0
            { "id": 1, "name": "直進端", "relX": 63.0,  "relY": 0,    "facingAngle": 0 },    // 直線線上なので Y: 0
            { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 16.5, "facingAngle": 15.0 }  // 仕様書通り 16.5mm 下
        ],
        "shapes": [
            { "type": "line", "length": 126, "offsetX": 0, "offsetY": 0 }, // 直線側は Y: 0
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 481.0, "startAngle": 270 } // 481mm下を中心に回る
        ]
    }
};
console.log("パーツカタログ（完全幾何学データ版）読み込み成功。: VER-GENERIC-OFFSET-Q8");
