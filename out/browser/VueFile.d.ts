import { default as TemplateHandler, TemplateOptions } from '../fs/TemplateHandler';
import ScriptHandler from '../fs/ScriptHandler';
import StyleHandler from '../fs/StyleHandler';
import PackageJSON from '../types/PackageJSON';
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
export default class VueFile {
    fullPath: string;
    filePath: string;
    isOpen: boolean;
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
    /**
     * 文档示例处理器
     */
    /**
     * 定义处理器
     */
    definitionHandler: void;
    /**
     * @param filePath Vue 文件路径，在浏览器模式中仅作记录
     * @param content Vue 的内容
     */
    constructor(filePath: string, content: string);
    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    preOpen(): Promise<void>;
    open(): Promise<void>;
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
    preload(): Promise<void>;
    loadScript(): Promise<string>;
    loadTemplate(): Promise<string>;
    loadStyle(): Promise<string>;
    loadAPI(): Promise<string>;
    loadExamples(from?: string): Promise<void>;
    loadDefinition(): Promise<string>;
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
    saveAs(fullPath: string): Promise<void>;
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
    mergeDefinition(that: VueFile): {
        [key: string]: {
            [old: string]: string;
        };
    };
    private static _splitPath;
    static resolveTagName(fullPath: string): string;
}
