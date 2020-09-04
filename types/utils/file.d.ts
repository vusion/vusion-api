import { stringify } from 'javascript-stringify';
/**
 * 避免同名
 * @param dirPath 目录名
 * @param baseName 文件基本名，不带扩展名，如`u-sample`
 * @param extName 文件扩展名，如`.vue`
 * @return 新的组合路径
 */
export declare function avoidSameName(fullPath: string): string;
export declare function avoidSameName(dirPath: string, baseName: string, extName: string): string;
/**
 * 规范组件名
 * @param componentName 原组件名，可能是驼峰格式，也可能是中划线格式
 * @return baseName 为中划线格式，componentName 为驼峰格式
 */
export declare function normalizeName(componentName?: string): {
    baseName: string;
    componentName: string;
};
/**
 * 该模块有 eval，慎用，之后考虑去掉。
 */
export declare const JS: {
    parse(source: string): any;
    stringify: typeof stringify;
};
