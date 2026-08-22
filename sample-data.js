// =============================================================
// 鉄道模型レイアウトジェネレータ - 初期ロード用サンプルデータ
// バージョン: VER-FIX-PATH-L2
// =============================================================
const INITIAL_SAMPLE_LAYOUT = {
    "rails": [
        { "instanceId": "rail-0", "partId": "KATO-248", "x": 282, "y": 397, "angle": 0 },
        { "instanceId": "rail-1", "partId": "KATO-R315-45", "x": 522, "y": 432, "angle": 23 },
        { "instanceId": "rail-2", "partId": "KATO-248", "x": 34, "y": 397, "angle": 0 },
        { "instanceId": "rail-3", "partId": "KATO-R315-45", "x": 686, "y": 596, "angle": 68 },
        { "instanceId": "rail-4", "partId": "KATO-R315-45", "x": 686, "y": 828, "angle": 113 },
        { "instanceId": "rail-5", "partId": "KATO-R315-45", "x": 522, "y": 992, "angle": 158 },
        { "instanceId": "rail-6", "partId": "KATO-248", "x": 282, "y": 1027, "angle": 180 },
        { "instanceId": "rail-7", "partId": "KATO-248", "x": 34, "y": 1027, "angle": 180 },
        { "instanceId": "rail-8", "partId": "KATO-R315-45", "x": -206, "y": 992, "angle": 203 },
        { "instanceId": "rail-9", "partId": "KATO-R315-45", "x": -370, "y": 828, "angle": 248 },
        { "instanceId": "rail-10", "partId": "KATO-R315-45", "x": -370, "y": 596, "angle": 293 },
        { "instanceId": "rail-11", "partId": "KATO-R315-45", "x": -206, "y": 432, "angle": 338 }
    ],
    "joints": [
        { "railA": "rail-8", "nodeA": 0, "railB": "rail-7", "nodeB": 1 },
        { "railA": "rail-9", "nodeA": 0, "railB": "rail-8", "nodeB": 1 },
        { "railA": "rail-10", "nodeA": 0, "railB": "rail-9", "nodeB": 1 },
        { "railA": "rail-11", "nodeA": 0, "railB": "rail-10", "nodeB": 1 },
        { "railA": "rail-11", "nodeA": 1, "railB": "rail-2", "nodeB": 0 },
        { "railA": "rail-0", "nodeA": 0, "railB": "rail-2", "nodeB": 1 },
        { "railA": "rail-6", "nodeA": 1, "railB": "rail-7", "nodeB": 0 },
        { "railA": "rail-1", "nodeA": 0, "railB": "rail-0", "nodeB": 1 },
        { "railA": "rail-5", "nodeA": 1, "railB": "rail-6", "nodeB": 0 },
        { "railA": "rail-3", "nodeA": 0, "railB": "rail-1", "nodeB": 1 },
        { "railA": "rail-4", "nodeA": 0, "railB": "rail-3", "nodeB": 1 },
        { "railA": "rail-4", "nodeA": 1, "railB": "rail-5", "nodeB": 0 }
    ]
};
console.log("サンプルレイアウトデータが読み込まれました。");
