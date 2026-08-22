// =============================================================
// 鉄道模型レイアウトジェネレータ - パーツカタログ定義
// バージョン: VER-FIX-PATH-L2
// =============================================================
const partsCatalog = {
    "KATO-248": {
        "type": "straight", "name": "直線 S248", "width": 248, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": 0,   "relY": 8, "facingAngle": 180 },
            { "id": 1, "relX": 248, "relY": 8, "facingAngle": 0 }
        ]
    },
    "KATO-S60": {
        "type": "straight", "name": "直線 S60", "width": 60, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": 0,  "relY": 8, "facingAngle": 180 },
            { "id": 1, "relX": 60, "relY": 8, "facingAngle": 0 }
        ]
    },
    "KATO-S64": {
        "type": "straight", "name": "直線 S64", "width": 64, "height": 16, "fill": "#333333",
        "nodes": [
            { "id": 0, "relX": 0,  "relY": 8, "facingAngle": 180 },
            { "id": 1, "relX": 64, "relY": 8, "facingAngle": 0 }
        ]
    },
    "KATO-R315-45": {
        "type": "curve", "name": "曲線 R315-45(左右対称)", "width": 241.1, "height": 23.9,
        "nodes": [
            { "id": 0, "relX": 0,      "relY": 23.9, "facingAngle": 157.5 },
            { "id": 1, "relX": 241.1,  "relY": 23.9, "facingAngle": 22.5 }
        ]
    },
    "KATO-R481-15": {
        "type": "curve", "name": "曲線 R481-15(補助用)", "width": 125.0, "height": 8.2,
        "nodes": [
            { "id": 0, "relX": 0,     "relY": 8.2, "facingAngle": 172.5 },
            { "id": 1, "relX": 125.0, "relY": 8.2, "facingAngle": 7.5 }
        ]
    },
    "KATO-EP4-R": {
        "type": "turnout-right", "name": "電動ポイント4番(右)", "width": 126, "height": 33,
        "nodes": [
            { "id": 0, "relX": 0,   "relY": 8,    "facingAngle": 180 },
            { "id": 1, "relX": 126, "relY": 8,    "facingAngle": 0 },
            { "id": 2, "relX": 124.9,"relY": 24.5, "facingAngle": 15.0 }
        ]
    }
};
console.log("パーツカタログデータが読み込まれました。");
