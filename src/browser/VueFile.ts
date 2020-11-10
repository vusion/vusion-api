import pluralize = require('pluralize');

import { default as TemplateHandler, TemplateOptions } from '../fs/TemplateHandler';
import ScriptHandler from '../fs/ScriptHandler';
import StyleHandler from '../fs/StyleHandler';
// import APIHandler from '../fs/APIHandler';
// import ExamplesHandler from '../fs/ExamplesHandler';

import traverse from '@babel/traverse';
import PackageJSON from '../types/PackageJSON';
import { kebab2Camel, Camel2kebab, uniqueInMap } from '../utils/shared';

const fetchPartialContent = (content: string, tag: string, attrs: string = '') => {
    const reg = new RegExp(`<${tag}${attrs ? ' ' + attrs : ''}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].replace(/^\n+/, '') : '';
};

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
    // apiHandler: APIHandler;
    /**
     * 文档示例处理器
     */
    // examplesHandler: ExamplesHandler;
    /**
     * 定义处理器
     */
    definitionHandler: void;

    /**
     * @param filePath Vue 文件路径，在浏览器模式中仅作记录
     * @param content Vue 的内容
     */
    constructor(filePath: string, content: string) {
        this.fullPath = this.filePath = filePath;
        this.content = content;
        this.tagName = VueFile.resolveTagName(filePath);
        this.componentName = kebab2Camel(this.tagName);
    }

    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    async preOpen(): Promise<void> {
        //
    }

    async open(): Promise<void> {
        if (this.isOpen)
            return;
        return this.forceOpen();
    }

    /**
     * 强制重新打开
     */
    async forceOpen(): Promise<void> {
        // this.close();
        await this.preOpen();
        await this.load();
    }

    /**
     * 关闭文件
     */
    close(): void {
        this.alias = undefined;

        // 单文件内容
        this.content = undefined;
        this.template = undefined;
        this.script = undefined;
        this.style = undefined;
        this.api = undefined;
        this.examples = undefined;
        this.definition = undefined;
        this.package = undefined;

        this.templateHandler = undefined;
        this.$html = undefined;
        this.scriptHandler = undefined;
        this.$js = undefined;
        this.styleHandler = undefined;
        this.$css = undefined;
        // this.apiHandler = undefined;
        // this.examplesHandler = undefined;
        this.definitionHandler = undefined;

        this.isOpen = false;
    }

    /**
     * 加载所有内容
     */
    protected async load(): Promise<void> {
        await this.loadScript();
        await this.loadTemplate();
        await this.loadStyle();
        // await this.loadAPI();
        // await this.loadExamples();
        await this.loadDefinition();
    }

     /**
     * 预加载
     * 只加载 content
     */
    async preload() {
        //
    }

    async loadScript() {
        return this.script = fetchPartialContent(this.content, 'script');
    }

    async loadTemplate() {
        return this.template = fetchPartialContent(this.content, 'template');
    }

    async loadStyle() {
        return this.style = fetchPartialContent(this.content, 'style');
    }

    async loadAPI() {
        return this.api = fetchPartialContent(this.content, 'api');
    }

    // @TODO
    // loadDocs()
    async loadExamples(from?: string) {
    }

    async loadDefinition() {
        return this.definition = fetchPartialContent(this.content, 'definition');
    }
    
    /**
     * 是否有模板
     * @param simplify 简化模式。在此模式下，`<div></div>`视为没有模板
     */
    hasTemplate(simplify: boolean) {
        const template = this.template;
        if (!simplify)
            return !!template;
        else
            return !!template && template.trim() !== '<div></div>';
    }

    /**
     * 是否有 JS 脚本
     * @param simplify 简化模式。在此模式下，`export default {};`视为没有 JS 脚本
     */
    hasScript(simplify: boolean) {
        const script = this.script;
        if (!simplify)
            return !!script;
        else
            return !!script && script.trim().replace(/\s+/g, ' ').replace(/\{ \}/g, '{}') !== 'export default {};';
    }

    /**
     * 是否有 CSS 样式
     * @param simplify 简化模式。在此模式下，`.root {}`视为没有 CSS 样式
     */
    hasStyle(simplify: boolean) {
        const style = this.style;
        if (!simplify)
            return !!style;
        else
            return !!style && style.trim().replace(/\s+/g, ' ').replace(/\{ \}/g, '{}') !== '.root {}';
    }

    warnIfNotOpen() {
        //
    }

    parseAll(): void {
        this.warnIfNotOpen();

        this.parseTemplate();
        this.parseScript();
        this.parseStyle();
        // this.parseAPI();
        // this.parseExamples();
        // this.parseDefinition();
    }

    parseTemplate() {
        if (this.templateHandler)
            return this.templateHandler;
        else
            return this.$html = this.templateHandler = new TemplateHandler(this.template);
    }

    parseScript() {
        if (this.scriptHandler)
            return this.scriptHandler;
        else
            return this.$js = this.scriptHandler = new ScriptHandler(this.script);
    }

    parseStyle() {
        if (this.styleHandler)
            return this.styleHandler;
        else
            return this.$css = this.styleHandler = new StyleHandler(this.style);
    }

    // parseAPI() {
    //     if (this.apiHandler)
    //         return this.apiHandler;
    //     else
    //         return this.apiHandler = new APIHandler(this.api, path.join(this.fullPath, 'api.yaml'));
    // }

    // parseExamples() {
    //     if (this.examplesHandler)
    //         return this.examplesHandler;
    //     else
    //         return this.examplesHandler = new ExamplesHandler(this.examples);
    // }

    generate(options?: TemplateOptions) {
        let template = this.template;
        let script = this.script;
        let style = this.style;
        let definition = this.definition;

        if (this.templateHandler) {
            this.templateHandler.options.startLevel = 1;
            this.template = template = this.templateHandler.generate(options);
        }
        if (this.scriptHandler)
            this.script = script = this.scriptHandler.generate();
        if (this.styleHandler)
            this.style = style = this.styleHandler.generate();

        const contents = [];
        template && contents.push(`<template>\n${template}</template>`);
        script && contents.push(`<script>\n${script}</script>`);
        style && contents.push(`<style module>\n${style}</style>`);
        definition && contents.push(`<definition>\n${definition}</definition>`);

        return this.content = contents.join('\n\n') + '\n';
    }

    /**
     * 克隆 VueFile 对象
     * 克隆所有参数，但 handler 引用会被排除
     */
    clone() {
        this.warnIfNotOpen();
        const vueFile = new VueFile(this.fullPath, this.content);

        vueFile.tagName = this.tagName;
        vueFile.componentName = this.componentName;
        vueFile.alias = this.alias;
        vueFile.content = this.content;
        vueFile.template = this.template;
        vueFile.script = this.script;
        vueFile.style = this.style;
        vueFile.api = this.api;
        vueFile.examples = this.examples;
        vueFile.definition = this.definition;
        vueFile.package = this.package && Object.assign({}, this.package);

        return vueFile;
    }

    /**
     * await vueFile.save();
     * 仅依赖 this.fullPath 和 this.isDirectory 两个变量
     * - 如果有解析，先根据解析器生成内容，再保存
     * - 根据 isDirectory 判断是否保存单多文件
     */
    async save(): Promise<void> {
        this.warnIfNotOpen();
        this.generate();
    }

    /**
     * 另存为，保存到另一个路径
     * 会克隆所有内容参数，但 handler 引用会被排除
     * @param fullPath
     */
    async saveAs(fullPath: string) {
        this.warnIfNotOpen();
        console.log('[vusion-api] no need saveAs in browser mode.');
    }

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
    merge(that: VueFile, route: string | number | { line: number, character: number } = '') {
        const scriptReplacements = this.scriptHandler.merge(that.scriptHandler);
        const styleReplacements = this.styleHandler.merge(that.styleHandler);
        const definitionReplacements = this.mergeDefinition(that);
        const replacements = { ...scriptReplacements, ...styleReplacements, ...definitionReplacements };

        this.templateHandler.merge(that.templateHandler, route, replacements);
        return replacements;
    }

    mergeDefinition(that: VueFile) {
        type PartialNode = { [key: string]: any };

        function traverse(
            node: PartialNode,
            func: (node: PartialNode, parent?: PartialNode, index?: number) => any,
            parent: PartialNode = null,
            index?: number
        ) {
            func(node, parent, index);
            Object.values(node).forEach((value) => {
                if (Array.isArray(value)) {
                    value.forEach((child, index) => child && traverse(child, func, node, index));
                } else if (typeof value === 'object')
                    value && traverse(value, func, node, index);
            });
        }

        const thisDefinition = JSON.parse(this.definition || '{}');
        thisDefinition.params = thisDefinition.params || [];
        thisDefinition.variables = thisDefinition.variables || [];
        thisDefinition.lifecycles = thisDefinition.lifecycles || [];
        thisDefinition.logics = thisDefinition.logics || [];
        const thatDefinition = JSON.parse(that.definition || '{}');
        thatDefinition.params = thatDefinition.params || [];
        thatDefinition.variables = thatDefinition.variables || [];
        thatDefinition.lifecycles = thatDefinition.lifecycles || [];
        thatDefinition.logics = thatDefinition.logics || [];
        
        const replacements: { [key: string]: { [old: string]: string } } = { 'data2': {}, logic: {} };

        const thisParamKeys: Set<string> = new Set();
        thisDefinition.params.forEach((param: { name: string }) => thisParamKeys.add(param.name));
        thisDefinition.variables.forEach((variable: { name: string }) => thisParamKeys.add(variable.name));

        thatDefinition.params.forEach((param: { name: string }) => {
            const newName = uniqueInMap(param.name, thisParamKeys);
            if (newName !== param.name)
                replacements['data2'][param.name] = newName;
            thisDefinition.params.push(Object.assign(param, {
                name: newName,
            }));
        });
        thatDefinition.variables.forEach((variable: { name: string }) => {
            const newName = uniqueInMap(variable.name, thisParamKeys);
            if (newName !== variable.name)
                replacements['data2'][variable.name] = newName;
            thisDefinition.variables.push(Object.assign(variable, {
                name: newName,
            }));
        });

        thatDefinition.lifecycles.forEach((thatLC: { name: string }) => {
            if (thisDefinition.lifecycles.find((thisLC: { name: string }) => thisLC.name == thatLC.name))
                return;

            thisDefinition.lifecycles.push(thatLC);
        });

        const thisLogicKeys: Set<string> = new Set();
        thisDefinition.logics.forEach((logic: { name: string }) => thisLogicKeys.add(logic.name));
        thatDefinition.logics.forEach((logic: { name: string }) => {
            const newName = uniqueInMap(logic.name, thisLogicKeys);
            if (newName !== logic.name)
                replacements['logic'][logic.name] = newName;
            
            logic.name = newName;
            thisDefinition.logics.push(logic);
        });

        const identifierMap = { ...replacements['data2'], ...replacements['logic'] };
        thatDefinition.logics.forEach((logic: { name: string }) => {
            traverse(logic, (node) => {
                if (node.level === 'expressionNode' && node.type === 'Identifier') {
                    if (identifierMap[node.name])
                        node.name = identifierMap[node.name];
                }
            });
        });

        this.definition = JSON.stringify(thisDefinition, null, 4) + '\n';

        return replacements;
    }

    private static _splitPath(fullPath: string) {
        const arr = fullPath.split('/');
        let pos = arr.length - 1; // root Vue 的位置
        while(arr[pos] && arr[pos].endsWith('.vue'))
            pos--;
        pos++;

        return { arr, pos };
    }

    static resolveTagName(fullPath: string) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        const vueNames = arr.slice(pos);

        let result: Array<string> = [];
        vueNames.forEach((vueName) => {
            const baseName = vueName.split('/').pop().replace(/\.vue$/, '');
            const arr = baseName.split('-');
            if (arr[0].length === 1) // u-navbar
                result = arr;
            else if (pluralize(baseName) === result[result.length - 1]) // 如果是前一个的单数形式，u-actions -> action，u-checkboxes -> checkbox
                result[result.length - 1] = baseName;
            else
                result.push(baseName);
        });
        return result.join('-');
    }
}
