import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * 中划线格式 -转-> 驼峰格式
 * @param name 原名称
 * @return 转换后的名称
 */
export const kebab2Camel = (name: string) => name.replace(/(?:^|-)([a-zA-Z0-9])/g, (m, $1) => $1.toUpperCase());

/**
 * 驼峰格式 -转-> 中划线格式
 * @param name 原名称
 * @return 转换后的名称
 */
export const Camel2kebab = (name: string) => name.replace(/([A-Z]|[0-9]+)/g, (m, $1, offset) => (offset ? '-' : '') + $1.toLowerCase());

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

export function uniqueInMap(key: string, map: Map<string, any>, start: number = 1) {
    while (map.has(key))
        key = key.replace(/\d*$/, (m) => String(m === '' ? start : +m + 1));
    return key;
}
