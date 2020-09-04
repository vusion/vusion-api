/**
 * 下载 NPM 包，默认以 package@version 的文件名命名
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param dir For example: ./blocks
 * @param name If you want to rename. Defaults to package@version
 * @param clearExisting
 */
export declare function npm(info: {
    registry?: string;
    name: string;
    version?: string;
}, dir: string, name?: string, clearExisting?: boolean): Promise<string>;
/**
 * 下载 Git 仓库
 * @param info.url For example: https://registry.npm.taobao.org
 * @param info.branch For example: dev
 * @param dest For example: ./blocks/xxx
 * @param clearExisting
 */
export declare function git(info: {
    url: string;
    branch?: string;
}, dest: string, clearExisting?: boolean, keepGit?: boolean): Promise<string>;
