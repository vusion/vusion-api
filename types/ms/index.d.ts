import * as vfs from '../fs';
import * as download from './download';
import FormData = require('form-data');
import Block from './Block';
import Component from './Component';
import Template from './Template';
export { download, Block, Component, Template };
export declare function getCacheDir(subPath?: string): string;
export declare function getRunControl(): string;
export interface FormFile {
    name: string;
    path: string;
    [prop: string]: any;
}
export declare const upload: {
    getFormData(files: string | FormFile | Array<string | FormFile>): FormData;
    nos(files: string | FormFile | Array<string | FormFile>): Promise<any>;
    micro(files: string | FormFile | Array<string | FormFile>, prefix?: string): Promise<any>;
    framework(files: string | FormFile | Array<string | FormFile>, framework: string): Promise<any>;
};
/**
 * 获取最新的区块模板
 */
export declare function fetchLatestBlockTemplate(): Promise<string>;
/**
 * 获取最新的组件模板
 */
export declare function fetchLatestComponentTemplate(): Promise<string>;
export declare function formatTemplate(src: string, params?: object, formatter?: (content: string, params: object) => string): Promise<void[]>;
export declare function formatTemplateTo(src: string, dest: string, params?: object, formatter?: (content: string, params: object) => string): Promise<void[]>;
export interface MaterialSource {
    type: string;
    registry: string;
    name: string;
    path?: string;
    version?: string;
    commit?: string;
    fileName?: string;
    baseName?: string;
}
export interface MaterialOptions {
    /**
     * file: ./templates/componentA
     * file: /Users/alice/templates/componentA
     * npm: s-basic-form
     * npm: s-basic-form.vue
     * npm: s-basic-form.vue@0.3.2
     * disable: npm: s-basic-form.vue@0.3.2:some/directory
     * npm: @cloud-ui/s-basic-form.vue
     * npm: @cloud-ui/s-basic-form.vue:some/directory
     * cnpm: cnpm:@cloud-ui/s-basic-form.vue
     * nnpm: nnpm:@cloud-ui/s-basic-form.vue
     * github: github:user/repo
     * disable: gitlab: gitlab:user/repo#master:some/directory
     */
    source: string | MaterialSource;
    target: string;
    name: string;
    title?: string;
}
export interface ProcessedMaterialOptions {
    /**
     * file: ./templates/componentA
     * file: /Users/alice/templates/componentA
     * npm: s-basic-form
     * npm: s-basic-form.vue
     * npm: s-basic-form.vue@0.3.2
     * disable: npm: s-basic-form.vue@0.3.2:some/directory
     * npm: @cloud-ui/s-basic-form.vue
     * npm: @cloud-ui/s-basic-form.vue:some/directory
     * cnpm: cnpm:@cloud-ui/s-basic-form.vue
     * nnpm: nnpm:@cloud-ui/s-basic-form.vue
     * github: github:user/repo
     * disable: gitlab: gitlab:user/repo#master:some/directory
     */
    source: MaterialSource;
    target: string;
    name: string;
    title?: string;
}
export declare function processOptions(options: MaterialOptions): ProcessedMaterialOptions;
export declare function getTemplate(packageName: string): Promise<Template>;
export declare function getBlock(packageName: string): Promise<Block>;
export declare function getBlocks(): Promise<Block[]>;
export declare function getComponent(packageName: string): Promise<Component>;
export declare function getComponents(): Promise<Component[]>;
export declare function teamExist(teamName: string): Promise<any>;
export declare function publishBlock(params: object): Promise<any>;
export declare function publishComponent(params: object): Promise<any>;
export declare function publishTemplate(params: object): Promise<any>;
export declare function recordMicroVersionURL(data: object, params: object, prefix?: string): Promise<any>;
export declare function recordMicroAppVersion(params: object): Promise<any>;
export declare function refreshMicroVersion(params: object): Promise<any>;
export declare function createBlockPackage(dir: string, options: {
    name: string;
    title?: string;
    category?: string;
    team?: string;
    access?: string;
    inVusionProject?: boolean;
    [prop: string]: string | boolean;
}): Promise<string>;
export declare function fetchBlock(options: MaterialOptions): Promise<string>;
/**
 * 添加代码为外部区块
 * @param blockVue 刚下载后的 Block Vue 文件
 * @param target 目标路径
 * @param name 区块名称
 */
export declare function addBlockExternally(blockVue: vfs.VueFile, target: string, name: string): Promise<vfs.VueFile>;
/**
 * For vusion cli
 */
export declare function addBlock(options: MaterialOptions): Promise<void>;
export declare function removeBlock(vueFilePath: string, baseName: string): Promise<vfs.VueFile>;
export declare function createComponentPackage(dir: string, options: {
    name: string;
    title?: string;
    category?: string;
    access?: string;
    team?: string;
    inVusionProject?: boolean;
    [prop: string]: string | boolean;
}): Promise<string>;
export declare function createMultiFile(dir: string, componentName?: string): Promise<string>;
export declare function createMultiFileWithSubdocs(dir: string, componentName?: string): Promise<string>;
/**
 * vusion install，默认安装到 vusion_packages
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param cwd 项目目录
 */
export declare function install(info: {
    registry?: string;
    name: string;
    version?: string;
}, cwd?: string, save?: boolean): Promise<string>;
