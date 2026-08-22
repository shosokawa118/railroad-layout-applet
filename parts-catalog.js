// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義 (ジェネリック版)
// バージョン: VER-GENERIC-RENDER-O5
// =============================================================
const partsCatalog = {
    "KATO-248": {
        "name": "直線 S248", "width": 248, "height": 16,
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }
        ],
        // 直線を描画するためのパラメータ（長さ248）
        "shapes": [
            { "type": "line", "length": 248, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-S60": {
        "name": "直線 S60", "width": 60, "height": 16,
        "nodes": [
            { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
        ],
        "shapes": [
            { "type": "line", "length": 60, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-S64": {
        "name": "直線 S64", "width": 64, "height": 16,
        "nodes": [
            { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
        ],
        "shapes": [
            { "type": "line", "length": 64, "offsetX": 0, "offsetY": 0 }
        ]
    },
    "KATO-R315-45": {
        "type": "curve", "name": "曲線 R315-45(左右対称)", "width": 241.1, "height": 23.9,
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 11.95, "facingAngle": 157.5 },
            { "id": 1, "relX": 120.55,  "relY": 11.95, "facingAngle": 22.5 }
        ],
        // 円弧を描画するためのパラメータ (半径315, 角度45, スタート角度は接線方向)
        "shapes": [
            { "type": "arc", "radius": 315, "arcAngle": 45, "centerX": 0, "centerY": 326.95, "startAngle": 247.5 }
        ]
    },
    "KATO-R481-15": {
        "name": "曲線 R481-15(補助用)", "width": 125.0, "height": 4.1,
        "nodes": [
            { "id": 0, "relX": -62.5, "relY": 2.05, "facingAngle": 172.5 },
            { "id": 1, "relX": 62.5,  "relY": 2.05, "facingAngle": 7.5 }
        ],
        "shapes": [
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": 0, "centerY": 483.05, "startAngle": 262.5 }
        ]
    },
    "KATO-EP4-R": {
        "name": "電動ポイント4番(右)", "width": 126, "height": 24.5,
        "nodes": [
            { "id": 0, "name": "進入端", "relX": -63.0, "relY": -4.1, "facingAngle": 180 },
            { "id": 1, "name": "直進端", "relX": 63.0,  "relY": -4.1, "facingAngle": 0 },
            { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 12.4, "facingAngle": 15.0 }
        ],
        // ポイントは「直線1本」と「円弧1本」の複合シェイプとしてスマートに定義
        "shapes": [
            { "type": "line", "length": 126, "offsetX": 0, "offsetY": -4.1 },
            { "type": "arc", "radius": 481, "arcAngle": 15, "centerX": -63.0, "centerY": 476.9, "startAngle": 270 }
        ]
    }
};
console.log("パーツカタログ（幾何学パラメータ版）読み込み成功。");
