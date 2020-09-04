import * as babel from '@babel/core';
import * as vfs from '../fs';
export * from './nuims';
export declare function addLayout(fullPath: string, nodePath: string, type: string): Promise<void>;
/**
 * 添加页面时初始化布局
 * @param fullPath Vue 文件路径
 * @param type 布局类型
 */
export declare function initLayout(fullPath: string, type: string): Promise<void>;
export declare function addCode(fullPath: string, nodePath: string, tpl: string): Promise<void>;
export declare function openFile(fullPath: string, content: string): Promise<string>;
export declare function saveFile(fullPath: string, content: string): Promise<void>;
export interface ViewInfo {
    fullPath: string;
    viewType: vfs.ViewType;
    routePath?: string;
}
export interface AddParams {
    name: string;
    title: string;
    ext?: string;
    layout?: string;
    crumb?: string;
}
export declare function saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View): Promise<void | {}>;
/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
export declare function loadViews(viewInfo: ViewInfo | vfs.View, moduleInfo?: ViewInfo | vfs.View): Promise<vfs.View[]>;
export declare function loadAllViews(viewInfo: ViewInfo | vfs.View): Promise<vfs.View>;
/**
 * 获取页面内容
 * @param viewInfo 父页面的信息
 */
export declare function getViewContent(viewInfo: ViewInfo | vfs.View): Promise<vfs.VueFile>;
/**
 * 保存页面内容
 * @param viewInfo 父页面的信息
 * @param content 页面代码内容
 */
export declare function saveViewContent(viewInfo: ViewInfo | vfs.View, content: string): Promise<void>;
/**
 * 保存 Vue 局部代码
 * @param fullPath Vue 文件全路径
 * @param type 内容类型
 * @param content 代码内容
 */
export declare function saveCode(fullPath: string, type: 'template' | 'script' | 'style', content: string): Promise<void>;
export declare function mergeCode(fullPath: string, content: string | vfs.VueFile, nodePath?: string): Promise<void>;
export declare function findRouteObjectAndParentArray(objectExpression: babel.types.ObjectExpression, relativePath: string | Array<string>, createChildrenArrayIfNeeded?: boolean, pos?: number): {
    routeObject: babel.types.ObjectExpression;
    parentArray: babel.types.ArrayExpression;
};
export declare function addLeafViewRoute(parent: vfs.View, module: vfs.View, params: AddParams): Promise<void>;
export declare function addLeafView(parent: vfs.View, params: AddParams): Promise<string>;
export declare function addLeafView(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export declare function addLeafView(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
export declare function addBranchViewRoute(parent: vfs.View, module: vfs.View, params: AddParams): Promise<void>;
export declare function addBranchView(parent: vfs.View, params: AddParams): Promise<string>;
export declare function addBranchView(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export declare function addBranchView(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
export declare function addBranchWrapper(parent: vfs.View, params: AddParams): Promise<string>;
export declare function addBranchWrapper(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export declare function addBranchWrapper(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
/**
 * @TODO remove page metaData
 */
export declare function removeView(view: vfs.View): Promise<void>;
export declare function removeView(view: vfs.View, module: vfs.View): Promise<void>;
export declare function removeView(viewInfo: ViewInfo, moduleInfo: ViewInfo): Promise<void>;
export interface ParseTypes {
    template?: boolean;
    script?: boolean;
    style?: boolean;
    api?: boolean;
    examples?: boolean;
}
export declare function loadExternalLibrary(fullPath: string, parseTypes?: ParseTypes): Promise<vfs.Library>;
/**
 * 获取服务信息
 */
export declare function loadServices(modulePath: string): Promise<vfs.Service[]>;
/**
 * @deprecated
 * @param fullPath
 * @param newName
 * @param name
 */
export declare function addOrRenameService(fullPath: string, newName: string, name: string): Promise<string>;
export declare function saveService(serviceInfo: vfs.Service): Promise<void>;
export declare function removeService(fullPath: string): Promise<void>;
/**
 * 组件或区块信息
 */
interface BlockInfo {
    name: string;
    title: string;
    tagName: string;
    dependencies: {
        [name: string]: string;
    };
    vusionDependencies: {
        [name: string]: string;
    };
    registry: string;
    uuid?: string;
}
/**
 * 添加区块
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export declare function addBlock(fullPath: string, blockInfo: BlockInfo): Promise<void>;
/**
 * 添加业务组件
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export declare function addCustomComponent(fullPath: string, libraryPath: string, blockInfo: BlockInfo, content: string): Promise<void>;
export declare function loadPackageJSON(rootPath: string): Promise<any>;
/**
 * 获取单个控件信息
 * @param fullPath 控件路径
 * @param parseTypes 需要获取的信息
 */
export declare function loadComponentData(fullPath: string, parseTypes?: ParseTypes): Promise<{}>;
/**
 * 获取自定义组件信息，packages.json中有的组件，并且是以.vue结尾
 * @param rootPath package.json所在的目录路径
 * @param parseTypes 需要获取的信息
 * @param baseName 组件信息，有该信息则获取该组件信息
 */
export declare function loadCustomComponentsData(rootPath: string, parseTypes?: ParseTypes, baseName?: string): Promise<{}[]>;
