import * as fs from 'fs-extra';
import * as path from 'path';
import { kebab2Camel, Camel2kebab } from './shared';
import { stringify } from 'javascript-stringify';

/**
 * 避免同名
 * @param dirPath 目录名
 * @param baseName 文件基本名，不带扩展名，如`u-sample`
 * @param extName 文件扩展名，如`.vue`
 * @return 新的组合路径
 */
export function avoidSameName(fullPath: string): string;
export function avoidSameName(dirPath: string, baseName: string, extName: string): string;
export function avoidSameName(dirPath: string, baseName?: string, extName?: string) {
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

/**
 * 规范组件名
 * @param componentName 原组件名，可能是驼峰格式，也可能是中划线格式
 * @return baseName 为中划线格式，componentName 为驼峰格式
 */
export function normalizeName(componentName?: string) {
    let baseName = componentName;
    if (componentName) {
        if (componentName.includes('-'))
            componentName = kebab2Camel(baseName);
        else
            baseName = Camel2kebab(componentName);
        return { baseName, componentName };
    } else
        return { baseName: 'u-sample', componentName: 'USample' };
}

/**
 * 该模块有 eval，慎用，之后考虑去掉。
 */
export const JS = {
    parse(source: string) {
        const content = source.trim().replace(/export default |module\.exports +=/, '');
        return eval('(function(){return ' + content + '})()');
    },
    stringify,
};