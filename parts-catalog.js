// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義 (完全中心原点回帰)
// バージョン: VER-PERFECT-M3
// =============================================================
const partsCatalog = {
    "KATO-248": {
        "type": "straight", "name": "直線 S248", "width": 248, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -124, "relY": 0, "facingAngle": 180 }, // 左端
            { "id": 1, "relX": 124,  "relY": 0, "facingAngle": 0 }    // 右端
        ]
    },
    "KATO-S60": {
        "type": "straight", "name": "直線 S60", "width": 60, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -30, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 30,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-S64": {
        "type": "straight", "name": "直線 S64", "width": 64, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": -32, "relY": 0, "facingAngle": 180 },
            { "id": 1, "relX": 32,  "relY": 0, "facingAngle": 0 }
        ]
    },
    "KATO-R315-45": {
        "type": "curve", "name": "曲線 R315-45(左右対称)", "width": 241.1, "height": 23.9,
        "nodes": [
            { "id": 0, "relX": -120.55, "relY": 11.95, "facingAngle": 157.5 }, // 左端（左斜め下）
            { "id": 1, "relX": 120.55,  "relY": 11.95, "facingAngle": 22.5 }    // 右端（右斜め下）
        ]
    },
    "KATO-R481-15": {
        "type": "curve", "name": "曲線 R481-15(補助用)", "width": 125.0, "height": 8.2,
        "nodes": [
            { "id": 0, "relX": -62.5, "relY": 4.1, "facingAngle": 172.5 },
            { "id": 1, "relX": 62.5,  "relY": 4.1, "facingAngle": 7.5 }
        ]
    },
    "KATO-EP4-R": {
        "type": "turnout-right", "name": "電動ポイント4番(右)", "width": 126, "height": 24.5,
        // ★完全なパーツ図心の中心(0,0)から、3つの先端への正確な相対座標(KATO幾何学)
        "nodes": [
            { "id": 0, "name": "進入端", "relX": -63.0, "relY": -4.1, "facingAngle": 180 },  // 左端
            { "id": 1, "name": "直進端", "relX": 63.0,  "relY": -4.1, "facingAngle": 0 },    // 右端直進
            { "id": 2, "name": "分岐端", "relX": 61.9,  "relY": 12.4, "facingAngle": 15.0 }  // 右下分岐
        ]
    }
};
console.log("パーツカタログデータが読み込まれました。");
