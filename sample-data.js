// =============================================================
// 鉄道模型レイアウトジェネレータ - 初期サンプルデータ (jointId撤去版)
// バージョン: VER-SAMPLE-COMPLEX-S3
// =============================================================
const INITIAL_SAMPLE_LAYOUT = {
  "version": "VER-SAMPLE-COMPLEX-S3",
  "rails": [
    { "instanceId": "rail-0", "partId": "KATO-248", "x": 214.19, "y": 220.62, "angle": 0 },
    { "instanceId": "rail-1", "partId": "KATO-R315-45", "x": 704.54, "y": 222.22, "angle": 22.5 },
    { "instanceId": "rail-2", "partId": "KATO-248", "x": 214.39, "y": 187.62, "angle": 0 },
    { "instanceId": "rail-3", "partId": "KATO-R315-45", "x": 868.8, "y": 386.48, "angle": 67.5 },
    { "instanceId": "rail-4", "partId": "KATO-R315-45", "x": 868.8, "y": 618.78, "angle": 112.5 },
    { "instanceId": "rail-5", "partId": "KATO-R315-45", "x": 704.54, "y": 783.03, "angle": 157.5 },
    { "instanceId": "rail-6", "partId": "KATO-248", "x": 464.39, "y": 817.64, "angle": 180 },
    { "instanceId": "rail-7", "partId": "KATO-248", "x": 216.39, "y": 817.64, "angle": 180 },
    { "instanceId": "rail-8", "partId": "KATO-R315-45", "x": -23.76, "y": 783.03, "angle": 202.5 },
    { "instanceId": "rail-9", "partId": "KATO-R315-45", "x": -190.01, "y": 618.78, "angle": 247.5 },
    { "instanceId": "rail-10", "partId": "KATO-R315-45", "x": -190.01, "y": 386.48, "angle": 292.5 },
    { "instanceId": "rail-11", "partId": "KATO-R315-45", "x": -25.76, "y": 222.22, "angle": 337.5 },
    { "instanceId": "rail-12", "partId": "KATO-EP4-R", "x": 402.26, "y": 195.6, "angle": 0 },
    { "instanceId": "rail-13", "partId": "KATO-EP4-R", "x": 524.33, "y": 212.63, "angle": 180 },
    { "instanceId": "rail-14", "partId": "KATO-124", "x": 526.39, "y": 187.62, "angle": 0 },
    { "instanceId": "rail-15", "partId": "KATO-124", "x": 400.19, "y": 220.62, "angle": 0 },
    { "instanceId": "rail-16", "partId": "KATO-R282-45", "x": 692.19, "y": 251.56, "angle": 22.5 },
    { "instanceId": "rail-17", "partId": "KATO-R282-45", "x": 839.26, "y": 398.63, "angle": 67.5 },
    { "instanceId": "rail-18", "partId": "KATO-R282-45", "x": 839.26, "y": 606.62, "angle": 112.5 },
    { "instanceId": "rail-19", "partId": "KATO-R282-45", "x": 692.19, "y": 753.69, "angle": 157.5 },
    { "instanceId": "rail-20", "partId": "KATO-248", "x": 464.19, "y": 784.63, "angle": 180 },
    { "instanceId": "rail-22", "partId": "KATO-248", "x": 216.19, "y": 784.63, "angle": 180 },
    { "instanceId": "rail-23", "partId": "KATO-R282-45", "x": -11.8, "y": 753.69, "angle": 202.5 },
    { "instanceId": "rail-24", "partId": "KATO-R282-45", "x": -158.88, "y": 606.62, "angle": 247.5 },
    { "instanceId": "rail-25", "partId": "KATO-R282-45", "x": -158.88, "y": 398.63, "angle": 292.5 },
    { "instanceId": "rail-26", "partId": "KATO-R282-45", "x": -11.8, "y": 251.56, "angle": 337.5 }
  ],
  "joints": [
    { "railA": "rail-12", "nodeA": 0, "railB": "rail-2", "nodeB": 1 },
    { "railA": "rail-14", "nodeA": 0, "railB": "rail-12", "nodeB": 1 },
    { "railA": "rail-13", "nodeA": 2, "railB": "rail-12", "nodeB": 2 },
    { "railA": "rail-15", "nodeA": 1, "railB": "rail-13", "nodeB": 1 },
    { "railA": "rail-0", "nodeA": 1, "railB": "rail-15", "nodeB": 0 },
    { "railA": "rail-1", "nodeA": 0, "railB": "rail-14", "nodeB": 1 },
    { "railA": "rail-3", "nodeA": 0, "railB": "rail-1", "nodeB": 1 },
    { "railA": "rail-4", "nodeA": 0, "railB": "rail-3", "nodeB": 1 },
    { "railA": "rail-5", "nodeA": 0, "railB": "rail-4", "nodeB": 1 },
    { "railA": "rail-6", "nodeA": 0, "railB": "rail-5", "nodeB": 1 },
    { "railA": "rail-7", "nodeA": 0, "railB": "rail-6", "nodeB": 1 },
    { "railA": "rail-11", "nodeA": 1, "railB": "rail-2", "nodeB": 0 },
    { "railA": "rail-16", "nodeA": 0, "railB": "rail-13", "nodeB": 0 },
    { "railA": "rail-10", "nodeA": 1, "railB": "rail-11", "nodeB": 0 },
    { "railA": "rail-9", "nodeA": 1, "railB": "rail-10", "nodeB": 0 },
    { "railA": "rail-8", "nodeA": 0, "railB": "rail-7", "nodeB": 1 },
    { "railA": "rail-8", "nodeA": 1, "railB": "rail-9", "nodeB": 0 },
    { "railA": "rail-17", "nodeA": 0, "railB": "rail-16", "nodeB": 1 },
    { "railA": "rail-18", "nodeA": 0, "railB": "rail-17", "nodeB": 1 },
    { "railA": "rail-19", "nodeA": 0, "railB": "rail-18", "nodeB": 1 },
    { "railA": "rail-20", "nodeA": 0, "railB": "rail-19", "nodeB": 1 },
    { "railA": "rail-22", "nodeA": 0, "railB": "rail-20", "nodeB": 1 },
    { "railA": "rail-23", "nodeA": 0, "railB": "rail-22", "nodeB": 1 },
    { "railA": "rail-24", "nodeA": 0, "railB": "rail-23", "nodeB": 1 },
    { "railA": "rail-25", "nodeA": 0, "railB": "rail-24", "nodeB": 1 },
    { "railA": "rail-26", "nodeA": 0, "railB": "rail-25", "nodeB": 1 },
    { "railA": "rail-26", "nodeA": 1, "railB": "rail-0", "nodeB": 0 }
  ]
};

console.log("初期サンプルデータ（jointId撤去版）更新完了: VER-SAMPLE-COMPLEX-S3");
