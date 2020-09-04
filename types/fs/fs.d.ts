import { VueFile, Library, VueFileExtendMode } from '.';
export declare class FileExistsError extends Error {
    constructor(fullPath: string);
}
export declare function handleSame(dir: string, baseName?: string): string;
export declare type Replacer = [RegExp, string];
export declare function batchReplace(src: string | Array<string>, replacers: Array<Replacer>): Promise<void[]>;
export interface ListFilesFilters {
    type?: string;
    dot?: boolean;
    patterns?: Array<string>;
    includes?: string | RegExp | Array<string | RegExp>;
    excludes?: string | RegExp | Array<string | RegExp>;
    filters?: ((fullPath: string) => boolean) | Array<(fullPath: string) => boolean>;
}
export declare function listFiles(dir?: string, filters?: ListFilesFilters, recursive?: boolean): string[];
export declare function listAllFiles(dir?: string, filters?: ListFilesFilters): string[];
export declare function createDirectory(dir: string, dirName: string): Promise<string>;
export declare function moveFileToTrash(fullPath: string): Promise<string>;
export declare function deleteFile(fullPath: string): Promise<void>;
export declare function rename(fullPath: string, newName: string): Promise<string>;
export declare function createSingleFile(dir: string, componentName?: string): Promise<string>;
export declare function createMultiFile(dir: string, componentName?: string): Promise<string>;
/**
 * @deprecated
 **/
export declare function createMultiFileWithSubdocs(dir: string, componentName?: string): Promise<string>;
/**
 * @deprecated
 **/
export declare function createMultiFileWithScreenshots(dir: string, componentName?: string): Promise<string>;
/**
 * @deprecated
 **/
export declare function createMultiFilePackage(dir: string, componentName?: string): Promise<string>;
export declare function addModuleCSS(vuePath: string): Promise<string>;
export declare function addAPI(vuePath: string): Promise<string>;
export declare function addDocs(vuePath: string): Promise<string>;
export declare function addPackage(vuePath: string): Promise<string>;
/**
 * 扩展到新的路径中
 * @param vueFile 原组件库需要扩展的组件，一级、二级组件均可
 * @param from 原来的库，或者 VueFile 本身的路径
 * @param to 新的路径
 */
export declare function extendToPath(vueFile: VueFile, from: Library | string, to: string, mode: VueFileExtendMode): Promise<VueFile>;
/**
 * 扩展到新的库中
 * @param vueFile 原组件库需要扩展的组件，一级、二级组件均可
 * @param from 原来的库，或者 VueFile 本身的路径
 * @param to 需要扩展到的组件库，比如 internalLibrary
 */
export declare function extendToLibrary(vueFile: VueFile, from: Library | string, to: Library, mode: VueFileExtendMode, subDir?: string): Promise<VueFile>;
