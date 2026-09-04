// =============================================================
// 鉄道模型レイアウトジェネレータ - 初期サンプルデータ
// バージョン: VER-SAMPLE-C541-15-WP
// =============================================================
const INITIAL_SAMPLE_LAYOUT = {
  "version": "VER-LAYOUT-SIDE-SNAP-E34",
  "systems": [
    "TOMIX-FINETRACK-N"
  ],
  "rails": [
    {
      "instanceId": "rail-57",
      "partId": "TOMIX-S280",
      "x": -160.89,
      "y": -279.42,
      "angle": 0
    },
    {
      "instanceId": "rail-58",
      "partId": "TOMIX-S280",
      "x": 119.11,
      "y": -279.42,
      "angle": 0
    },
    {
      "instanceId": "rail-59",
      "partId": "TOMIX-C280-45",
      "x": 362.32,
      "y": -248.59,
      "angle": 22.5
    },
    {
      "instanceId": "rail-60",
      "partId": "TOMIX-5531",
      "x": 510.57,
      "y": -85.8,
      "angle": 44,
      "partOptions": {
        "nodeOffsets": {
          "0": {
            "angle": -1
          }
        }
      }
    },
    {
      "instanceId": "rail-61",
      "partId": "TOMIX-C280-45",
      "x": 508.24,
      "y": 103.82,
      "angle": 112.5
    },
    {
      "instanceId": "rail-62",
      "partId": "TOMIX-C280-45",
      "x": 362.28,
      "y": 249.78,
      "angle": 157.5
    },
    {
      "instanceId": "rail-63",
      "partId": "TOMIX-S280",
      "x": 119.07,
      "y": 280.61,
      "angle": 180
    },
    {
      "instanceId": "rail-64",
      "partId": "TOMIX-S280",
      "x": -160.93,
      "y": 280.61,
      "angle": 180
    },
    {
      "instanceId": "rail-65",
      "partId": "TOMIX-C280-45",
      "x": -404.14,
      "y": 249.78,
      "angle": 202.5
    },
    {
      "instanceId": "rail-66",
      "partId": "TOMIX-C280-45",
      "x": -550.1,
      "y": 103.82,
      "angle": 247.5
    },
    {
      "instanceId": "rail-67",
      "partId": "TOMIX-C280-45",
      "x": -550.1,
      "y": -102.6,
      "angle": 292.5
    },
    {
      "instanceId": "rail-68",
      "partId": "TOMIX-C280-45",
      "x": -404.14,
      "y": -248.56,
      "angle": 337.5
    },
    {
      "instanceId": "rail-69",
      "partId": "TOMIX-5532",
      "x": 532.21,
      "y": 110.76,
      "angle": 314,
      "partOptions": {
        "nodeOffsets": {
          "0": {
            "angle": -1
          }
        }
      }
    },
    {
      "instanceId": "rail-70",
      "partId": "TOMIX-C317-45",
      "x": 375.33,
      "y": 282.08,
      "angle": 157.5
    },
    {
      "instanceId": "rail-71",
      "partId": "TOMIX-S280",
      "x": 118.49,
      "y": 317.02,
      "angle": 180
    },
    {
      "instanceId": "rail-72",
      "partId": "TOMIX-S280",
      "x": -161.51,
      "y": 317.02,
      "angle": 180
    },
    {
      "instanceId": "rail-73",
      "partId": "TOMIX-C317-45",
      "x": -418.35,
      "y": 282.08,
      "angle": 202.5
    },
    {
      "instanceId": "rail-74",
      "partId": "TOMIX-C317-45",
      "x": -583.59,
      "y": 116.84,
      "angle": 247.5
    },
    {
      "instanceId": "rail-75",
      "partId": "TOMIX-C317-45",
      "x": -583.59,
      "y": -116.84,
      "angle": 292.5
    },
    {
      "instanceId": "rail-76",
      "partId": "TOMIX-C317-45",
      "x": -418.35,
      "y": -282.08,
      "angle": 337.5
    },
    {
      "instanceId": "rail-77",
      "partId": "TOMIX-S280",
      "x": -161.51,
      "y": -317.02,
      "angle": 0
    },
    {
      "instanceId": "rail-78",
      "partId": "TOMIX-S280",
      "x": 118.49,
      "y": -317.02,
      "angle": 0
    },
    {
      "instanceId": "rail-79",
      "partId": "TOMIX-C317-45",
      "x": 375.33,
      "y": -282.08,
      "angle": 22.5
    },
    {
      "instanceId": "rail-80",
      "partId": "TOMIX-C317-45",
      "x": 540.57,
      "y": -116.84,
      "angle": 67.5
    }
  ],
  "joints": [
    {
      "railA": "rail-57",
      "nodeA": 1,
      "railB": "rail-58",
      "nodeB": 0
    },
    {
      "railA": "rail-58",
      "nodeA": 1,
      "railB": "rail-59",
      "nodeB": 0
    },
    {
      "railA": "rail-60",
      "nodeA": 0,
      "railB": "rail-59",
      "nodeB": 1
    },
    {
      "railA": "rail-61",
      "nodeA": 0,
      "railB": "rail-60",
      "nodeB": 2
    },
    {
      "railA": "rail-62",
      "nodeA": 0,
      "railB": "rail-61",
      "nodeB": 1
    },
    {
      "railA": "rail-63",
      "nodeA": 0,
      "railB": "rail-62",
      "nodeB": 1
    },
    {
      "railA": "rail-64",
      "nodeA": 0,
      "railB": "rail-63",
      "nodeB": 1
    },
    {
      "railA": "rail-64",
      "nodeA": 1,
      "railB": "rail-65",
      "nodeB": 0
    },
    {
      "railA": "rail-65",
      "nodeA": 1,
      "railB": "rail-66",
      "nodeB": 0
    },
    {
      "railA": "rail-66",
      "nodeA": 1,
      "railB": "rail-67",
      "nodeB": 0
    },
    {
      "railA": "rail-67",
      "nodeA": 1,
      "railB": "rail-68",
      "nodeB": 0
    },
    {
      "railA": "rail-68",
      "nodeA": 1,
      "railB": "rail-57",
      "nodeB": 0
    },
    {
      "railA": "rail-60",
      "nodeA": 1,
      "railB": "rail-69",
      "nodeB": 2
    },
    {
      "railA": "rail-70",
      "nodeA": 0,
      "railB": "rail-69",
      "nodeB": 0
    },
    {
      "railA": "rail-70",
      "nodeA": 1,
      "railB": "rail-71",
      "nodeB": 0
    },
    {
      "railA": "rail-71",
      "nodeA": 1,
      "railB": "rail-72",
      "nodeB": 0
    },
    {
      "railA": "rail-72",
      "nodeA": 1,
      "railB": "rail-73",
      "nodeB": 0
    },
    {
      "railA": "rail-73",
      "nodeA": 1,
      "railB": "rail-74",
      "nodeB": 0
    },
    {
      "railA": "rail-74",
      "nodeA": 1,
      "railB": "rail-75",
      "nodeB": 0
    },
    {
      "railA": "rail-75",
      "nodeA": 1,
      "railB": "rail-76",
      "nodeB": 0
    },
    {
      "railA": "rail-76",
      "nodeA": 1,
      "railB": "rail-77",
      "nodeB": 0
    },
    {
      "railA": "rail-77",
      "nodeA": 1,
      "railB": "rail-78",
      "nodeB": 0
    },
    {
      "railA": "rail-78",
      "nodeA": 1,
      "railB": "rail-79",
      "nodeB": 0
    },
    {
      "railA": "rail-79",
      "nodeA": 1,
      "railB": "rail-80",
      "nodeB": 0
    },
    {
      "railA": "rail-80",
      "nodeA": 1,
      "railB": "rail-69",
      "nodeB": 1
    }
  ]
};

console.log("初期サンプルデータ更新完了: VER-SAMPLE-C541-15-WP");
