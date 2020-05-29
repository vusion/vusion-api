"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = exports.avoidSameName = exports.Camel2kebab = exports.kebab2Camel = void 0;
const fs = require("fs-extra");
const path = require("path");
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
function avoidSameName(dirPath, baseName, extName) {
    if (baseName === undefined && extName === undefined) {
        extName = path.extname(dirPath);
        baseName = path.basename(dirPath, extName);
        dirPath = path.dirname(dirPath);
    }
    let dest = path.join(dirPath, `${baseName}${extName}`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.join(dirPath, `${baseName}-${count++}${extName}`);
    return dest;
}
exports.avoidSameName = avoidSameName;
/**
 * 规范组件名
 * @param componentName 原组件名，可能是驼峰格式，也可能是中划线格式
 * @return baseName 为中划线格式，componentName 为驼峰格式
 */
function normalizeName(componentName) {
    let baseName = componentName;
    if (componentName) {
        if (componentName.includes('-'))
            componentName = exports.kebab2Camel(baseName);
        else
            baseName = exports.Camel2kebab(componentName);
        return { baseName, componentName };
    }
    else
        return { baseName: 'u-sample', componentName: 'USample' };
}
exports.normalizeName = normalizeName;
//# sourceMappingURL=index.js.map