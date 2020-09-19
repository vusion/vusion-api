/**
 * 该模块在 Node.js 端和浏览器端均可运行
 */
/**
 * 中划线格式 -转-> 驼峰格式
 * @param name 原名称
 * @return 转换后的名称
 */
export declare const kebab2Camel: (name: string) => string;
/**
 * 驼峰格式 -转-> 中划线格式
 * @param name 原名称
 * @return 转换后的名称
 */
export declare const Camel2kebab: (name: string) => string;
export declare function uniqueInMap(key: string, map: Map<string, any> | Set<string>, start?: number): string;
