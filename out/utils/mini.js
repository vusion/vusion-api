"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueInMap = void 0;
function uniqueInMap(key, map, start = 1) {
    while (map.has(key))
        key = key.replace(/\d*$/, (m) => String(m === '' ? start : +m + 1));
    return key;
}
exports.uniqueInMap = uniqueInMap;
//# sourceMappingURL=mini.js.map