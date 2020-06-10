"use strict";
/**
 * 该模块在 Node.js 端和浏览器端均可运行
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueInMap = exports.Camel2kebab = exports.kebab2Camel = void 0;
/**
 * 中划线格式 -转-> 驼峰格式
 * @param name 原名称
 * @return 转换后的名称
 */
exports.kebab2Camel = (name) => name.replace(/(?:^|-)([a-zA-Z0-9])/g, (m, $1) => $1.toUpperCase());
/**
 * 驼峰格式 -转-> 中划线格式
 * @param name 原名称
 * @return 转换后的名称
 */
exports.Camel2kebab = (name) => name.replace(/([A-Z]|[0-9]+)/g, (m, $1, offset) => (offset ? '-' : '') + $1.toLowerCase());
function uniqueInMap(key, map, start = 1) {
    while (map.has(key))
        key = key.replace(/\d*$/, (m) => String(m === '' ? start : +m + 1));
    return key;
}
exports.uniqueInMap = uniqueInMap;
//# sourceMappingURL=shared.js.map