/**
 * =============================================================================
 * TOMIX ワイドPCレール パーツライブラリ (rail-catalog-tomix-wide.js)
 * =============================================================================
 * 
 * [仕様方針]
 * - TOMIXパーツは全て共通の「爪（tomix-clapper）」で結合可能なため、
 *   標準ノードには jointGroup を明示せずシステムデフォルト（tomix-clapper）を適用。
 * - カント接続端のみ jointGroup: "tomix-cant" と polarity (+1 / -1) を指定。
 * - 側壁・着脱道床用のサブジョイント等を追加する場合は jointType を区別する。
 * =============================================================================
 */

registerRailParts({
    // =========================================================
    // ワイドPC直線レール (S280-WP / S140-WP)
    // =========================================================
    "TOMIX-W280": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "wide-straight",
        name: "S280-WP-F",
        description: "ワイドPCレール S280-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -140, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "side-joiner", "name": "左側ジョイント", "relX": 0, "relY": -18.5, "facingAngle": 270, "jointGroup": "tomix-wide-side" },
            { "id": 2, "jointType": "side-joiner", "name": "右側ジョイント", "relX": 0, "relY": 18.5, "facingAngle": 90, "jointGroup": "tomix-wide-side" },
            { "id": 3, "jointType": "rail-end", "name": "延伸端", "relX": 140, "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 280, "offsetX": 0, "offsetY": 0 }]
    },
    "TOMIX-W140": {
        systemId: "TOMIX-WIDE-N",
        compatibleSystems: ["TOMIX-FINETRACK-N", "TOMIX-WIDE-N", "TOMIX-WIDETRAM-N"],
        category: "wide-straight",
        name: "S140-WP-F",
        description: "ワイドPCレール S140-WP (幅37mm)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "進入端", "relX": -70, "relY": 0, "facingAngle": 180 },
            { "id": 1, "jointType": "side-joiner", "name": "左側ジョイント", "relX": 0, "relY": -18.5, "facingAngle": 270, "jointGroup": "tomix-wide-side" },
            { "id": 2, "jointType": "side-joiner", "name": "右側ジョイント", "relX": 0, "relY": 18.5, "facingAngle": 90, "jointGroup": "tomix-wide-side" },
            { "id": 3, "jointType": "rail-end", "name": "延伸端", "relX": 70, "relY": 0, "facingAngle": 0 }
        ],
        shapes: [{ "type": "line", "length": 140, "offsetX": 0, "offsetY": 0 }]
    },

    // =========================================================
    // ワイドPCアプローチレール (水平 ↔ カント 傾斜変化用)
    // =========================================================
    "TOMIX-CR317-22.5-V-L": {
        systemId: "TOMIX-WIDE-N",
        category: "wide-cant-approach",
        name: "CR317-22.5-WP-F(L)",
        description: "ワイドPCアプローチレール CR317-22.5-WP (左カント入り口)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": 1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    },
    "TOMIX-CR317-22.5-V-R": {
        systemId: "TOMIX-WIDE-N",
        category: "wide-cant-approach",
        name: "CR317-22.5-WP-F(R)",
        description: "ワイドPCアプローチレール CR317-22.5-WP (右カント入り口)",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "水平端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "polarity": "*" },
            { "id": 1, "jointType": "rail-end", "name": "カント端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": -1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    },

    // =========================================================
    // ワイドPCカント曲線レール (固定傾斜角)
    // =========================================================
    "TOMIX-C317-22.5-V": {
        systemId: "TOMIX-WIDE-N",
        category: "wide-cant-curve",
        name: "C317-22.5-WP-F",
        description: "ワイドPCカント曲線レール C317-22.5-WP",
        nodes: [
            { "id": 0, "jointType": "rail-end", "name": "カント流入端", "relX": -59.5, "relY": 0, "facingAngle": 168.75, "jointGroup": "tomix-cant", "polarity": -1 },
            { "id": 1, "jointType": "rail-end", "name": "カント流出端", "relX": 59.5, "relY": 0, "facingAngle": 11.25, "jointGroup": "tomix-cant", "polarity": 1 }
        ],
        shapes: [{ "type": "arc", "radius": 317, "arcAngle": 22.5, "centerX": 0, "centerY": 310.8, "startAngle": 258.75 }]
    }
});
