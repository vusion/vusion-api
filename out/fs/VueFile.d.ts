/// <reference path="../../src/types/line-reader.d.ts" />
import FSEntry from './FSEntry';
import { default as TemplateHandler, TemplateOptions } from './TemplateHandler';
import ScriptHandler from './ScriptHandler';
import StyleHandler from './StyleHandler';
import APIHandler from './APIHandler';
import ExamplesHandler from './ExamplesHandler';
import PackageJSON from '../types/PackageJSON';
export declare enum VueFileExtendMode {
    style = "style",
    script = "script",
    template = "template",
    all = "all"
}
export declare const SUBFILE_LIST: string[];
/**
 * 用于处理单/多 Vue 文件的类
 *
 * ### 主要功能
 *
 * #### 打开：一般分为四个阶段
 * - const vueFile = new VueFile(fullPath); // 根据路径创建对象，可以为虚拟路径。
 * - await vueFile.preOpen(); // 异步方法。获取 isDirectory，获取子组件、标题信息。
 * - await vueFile.open(); // 异步方法。如果已经打开则不会重新打开，如果没有 preOpen 会先执行 preOpen。获取常用操作的内容块：script, template, style, api, examples, definition, package。
 * - vueFile.parseAll(); // 解析全部内容块
 *
 * #### 保存：
 * - await vueFile.save();
 * - 如果有解析，先根据解析器 generate() 内容，再保存
 * - 根据 isDirectory 判断是否保存单多文件
 *
 * #### 另存为：
 * - await vueFile.saveAs(fullPath);
 */
export default class VueFile extends FSEntry {
    /**
     * 标签名称/中划线名称
     */
    tagName: string;
    /**
     * import 组件名称/大驼峰名称
     */
    componentName: string;
    /**
     * 别名，用于信息提示等
     */
    alias: string;
    /**
     * 父 VueFile
     */
    parent: VueFile;
    /**
     * 多文件组件的子文件
     */
    subfiles: string[];
    /**
     * 该组件的子组件
     * 为`undefined`时表示未 preOpen 过，为数组表示已经打开。
     */
    children: VueFile[];
    /**
     * 是否为子组件
     */
    isChild: boolean;
    /**
     * 是否为完全分解的形式
     */
    isComposed: boolean;
    /**
     * 单文件读取的内容，或者 generate() 后的内容
     * 为`undefined`表示未打开过
     */
    content: string;
    template: string;
    script: string;
    style: string;
    api: string;
    examples: string;
    definition: string;
    package: PackageJSON;
    /**
     * 模板处理器
     * 为`undefined`表示还未解析
     */
    templateHandler: TemplateHandler;
    /**
     * Alias of templateHandler
     */
    $html: TemplateHandler;
    /**
     * 脚本处理器
     * 为`undefined`表示还未解析
     */
    scriptHandler: ScriptHandler;
    /**
     * Alias of scriptHandler
     */
    $js: ScriptHandler;
    /**
     * 样式处理器
     * 为`undefined`表示还未解析
     */
    styleHandler: StyleHandler;
    /**
     * Alias of styleHandler
     */
    $css: StyleHandler;
    /**
     * API 处理器
     */
    apiHandler: APIHandler;
    /**
     * 文档示例处理器
     */
    examplesHandler: ExamplesHandler;
    /**
     * 定义处理器
     */
    definitionHandler: void;
    /**
     * @param fullPath 完整路径，必须以`.vue`结尾。也可以是一个相对的虚拟路径
     */
    constructor(fullPath: string);
    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    preOpen(): Promise<void>;
    /**
     * 尝试读取 README.md 的标题行
     * 在前 10 行中查找
     */
    readTitleInReadme(): Promise<string>;
    /**
     * 加载多文件目录
     */
    loadDirectory(): Promise<VueFile[]>;
    /**
     * 强制重新打开
     */
    forceOpen(): Promise<void>;
    /**
     * 关闭文件
     */
    close(): void;
    /**
     * 加载所有内容
     */
    protected load(): Promise<void>;
    /**
    * 预加载
    * 只加载 content
    */
    preload(): Promise<string>;
    loadScript(): Promise<string>;
    loadTemplate(): Promise<string>;
    loadStyle(): Promise<string>;
    loadPackage(): Promise<any>;
    loadAPI(): Promise<string>;
    loadExamples(from?: string): Promise<string>;
    loadDefinition(): Promise<string>;
    hasAssets(): boolean;
    /**
     * 是否有额外的
     */
    hasExtra(): boolean;
    /**
     * 是否有模板
     * @param simplify 简化模式。在此模式下，`<div></div>`视为没有模板
     */
    hasTemplate(simplify: boolean): boolean;
    /**
     * 是否有 JS 脚本
     * @param simplify 简化模式。在此模式下，`export default {};`视为没有 JS 脚本
     */
    hasScript(simplify: boolean): boolean;
    /**
     * 是否有 CSS 样式
     * @param simplify 简化模式。在此模式下，`.root {}`视为没有 CSS 样式
     */
    hasStyle(simplify: boolean): boolean;
    warnIfNotOpen(): void;
    parseAll(): void;
    parseTemplate(): TemplateHandler;
    parseScript(): ScriptHandler;
    parseStyle(): StyleHandler;
    parseAPI(): APIHandler;
    parseExamples(): ExamplesHandler;
    generate(options?: TemplateOptions): string;
    /**
     * 克隆 VueFile 对象
     * 克隆所有参数，但 handler 引用会被排除
     */
    clone(): VueFile;
    /**
     * await vueFile.save();
     * 仅依赖 this.fullPath 和 this.isDirectory 两个变量
     * - 如果有解析，先根据解析器生成内容，再保存
     * - 根据 isDirectory 判断是否保存单多文件
     */
    save(): Promise<void>;
    /**
     * 另存为，保存到另一个路径
     * 会克隆所有内容参数，但 handler 引用会被排除
     * @param fullPath
     */
    saveAs(fullPath: string, isDirectory?: boolean): Promise<VueFile>;
    checkTransform(): true | string[];
    transform(): void;
    transformExportStyle(): void;
    /**
     * 只验证将分解式转换为合并式
     * 不打算支持逆向了
     */
    transformDecomposed(): void;
    /**
     * 与另一个 Vue 文件合并模板、逻辑和样式
     * 两个 VueFile 必须先 parseAll()
     * @param that 另一个 VueFile
     * @param route 插入的节点路径，最后一位表示节点位置，为空表示最后，比如 /1/2/1 表示插入到根节点的第1个子节点的第2个子节点的第1个位置
     * - merge(that, '') 指根节点本身
     * - merge(that, '/') 指根节点本身
     * - merge(that, '/0') 指第0个子节点
     * - merge(that, '/2/1') 指第2个子节点的第1个子节点
     * - merge(that, '/2/') 指第2个子节点的最后
     */
    merge(that: VueFile, route?: string | number | {
        line: number;
        character: number;
    }): {
        class: {
            [old: string]: string;
        };
    };
    extend(mode: VueFileExtendMode, fullPath: string, fromPath: string): VueFile;
    /**
     * 根据 extends 查找基类组件
     */
    findSuper(): void;
    private static _splitPath;
    /**
     * 计算根组件所在的目录
     * @param fullPath 完整路径
     */
    static resolveRootVueDir(fullPath: string): string;
    static resolveTagName(fullPath: string): string;
    static fetch(fullPath: string): VueFile;
    /**
     * 从代码创建临时的 VueFile 文件
     * 相关于跳过 preOpen 和 open 阶段，但路径是虚拟的
     * @param code 代码
     */
    static from(code: string, fileName?: string): VueFile;
}
