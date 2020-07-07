"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JS = exports.normalizeName = exports.avoidSameName = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const shared_1 = require("./shared");
const javascript_stringify_1 = require("javascript-stringify");
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
            componentName = shared_1.kebab2Camel(baseName);
        else
            baseName = shared_1.Camel2kebab(componentName);
        return { baseName, componentName };
    }
    else
        return { baseName: 'u-sample', componentName: 'USample' };
}
exports.normalizeName = normalizeName;
/**
 * 该模块有 eval，慎用，之后考虑去掉。
 */
exports.JS = {
    parse(source) {
        const content = source.trim().replace(/export default |module\.exports +=/, '');
        return eval('(function(){return ' + content + '})()');
    },
    stringify: javascript_stringify_1.stringify,
};
//# sourceMappingURL=file.js.map