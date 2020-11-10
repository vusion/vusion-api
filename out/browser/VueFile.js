"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const TemplateHandler_1 = __importDefault(require("../fs/TemplateHandler"));
const ScriptHandler_1 = __importDefault(require("../fs/ScriptHandler"));
const StyleHandler_1 = __importDefault(require("../fs/StyleHandler"));
const shared_1 = require("../utils/shared");
const fetchPartialContent = (content, tag, attrs = '') => {
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
class VueFile {
    /**
     * @param filePath Vue 文件路径，在浏览器模式中仅作记录
     * @param content Vue 的内容
     */
    constructor(filePath, content) {
        this.fullPath = this.filePath = filePath;
        this.content = content;
        this.tagName = VueFile.resolveTagName(filePath);
        this.componentName = shared_1.kebab2Camel(this.tagName);
    }
    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    preOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen)
                return;
            return this.forceOpen();
        });
    }
    /**
     * 强制重新打开
     */
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.close();
            yield this.preOpen();
            yield this.load();
        });
    }
    /**
     * 关闭文件
     */
    close() {
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
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadScript();
            yield this.loadTemplate();
            yield this.loadStyle();
            // await this.loadAPI();
            // await this.loadExamples();
            yield this.loadDefinition();
        });
    }
    /**
    * 预加载
    * 只加载 content
    */
    preload() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    loadScript() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.script = fetchPartialContent(this.content, 'script');
        });
    }
    loadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.template = fetchPartialContent(this.content, 'template');
        });
    }
    loadStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.style = fetchPartialContent(this.content, 'style');
        });
    }
    loadAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api = fetchPartialContent(this.content, 'api');
        });
    }
    // @TODO
    // loadDocs()
    loadExamples(from) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    loadDefinition() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.definition = fetchPartialContent(this.content, 'definition');
        });
    }
    /**
     * 是否有模板
     * @param simplify 简化模式。在此模式下，`<div></div>`视为没有模板
     */
    hasTemplate(simplify) {
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
    hasScript(simplify) {
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
    hasStyle(simplify) {
        const style = this.style;
        if (!simplify)
            return !!style;
        else
            return !!style && style.trim().replace(/\s+/g, ' ').replace(/\{ \}/g, '{}') !== '.root {}';
    }
    warnIfNotOpen() {
        //
    }
    parseAll() {
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
            return this.$html = this.templateHandler = new TemplateHandler_1.default(this.template);
    }
    parseScript() {
        if (this.scriptHandler)
            return this.scriptHandler;
        else
            return this.$js = this.scriptHandler = new ScriptHandler_1.default(this.script);
    }
    parseStyle() {
        if (this.styleHandler)
            return this.styleHandler;
        else
            return this.$css = this.styleHandler = new StyleHandler_1.default(this.style);
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
    generate(options) {
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
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.warnIfNotOpen();
            this.generate();
        });
    }
    /**
     * 另存为，保存到另一个路径
     * 会克隆所有内容参数，但 handler 引用会被排除
     * @param fullPath
     */
    saveAs(fullPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.warnIfNotOpen();
            console.log('[vusion-api] no need saveAs in browser mode.');
        });
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
    merge(that, route = '') {
        const scriptReplacements = this.scriptHandler.merge(that.scriptHandler);
        const styleReplacements = this.styleHandler.merge(that.styleHandler);
        const definitionReplacements = this.mergeDefinition(that);
        const replacements = Object.assign(Object.assign(Object.assign({}, scriptReplacements), styleReplacements), definitionReplacements);
        this.templateHandler.merge(that.templateHandler, route, replacements);
        return replacements;
    }
    mergeDefinition(that) {
        function traverse(node, func, parent = null, index) {
            func(node, parent, index);
            Object.values(node).forEach((value) => {
                if (Array.isArray(value)) {
                    value.forEach((child, index) => child && traverse(child, func, node, index));
                }
                else if (typeof value === 'object')
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
        const replacements = { 'data2': {}, logic: {} };
        const thisParamKeys = new Set();
        thisDefinition.params.forEach((param) => thisParamKeys.add(param.name));
        thisDefinition.variables.forEach((variable) => thisParamKeys.add(variable.name));
        thatDefinition.params.forEach((param) => {
            const newName = shared_1.uniqueInMap(param.name, thisParamKeys);
            if (newName !== param.name)
                replacements['data2'][param.name] = newName;
            thisDefinition.params.push(Object.assign(param, {
                name: newName,
            }));
        });
        thatDefinition.variables.forEach((variable) => {
            const newName = shared_1.uniqueInMap(variable.name, thisParamKeys);
            if (newName !== variable.name)
                replacements['data2'][variable.name] = newName;
            thisDefinition.variables.push(Object.assign(variable, {
                name: newName,
            }));
        });
        thatDefinition.lifecycles.forEach((thatLC) => {
            if (thisDefinition.lifecycles.find((thisLC) => thisLC.name == thatLC.name))
                return;
            thisDefinition.lifecycles.push(thatLC);
        });
        const thisLogicKeys = new Set();
        thisDefinition.logics.forEach((logic) => thisLogicKeys.add(logic.name));
        thatDefinition.logics.forEach((logic) => {
            const newName = shared_1.uniqueInMap(logic.name, thisLogicKeys);
            if (newName !== logic.name)
                replacements['logic'][logic.name] = newName;
            logic.name = newName;
            thisDefinition.logics.push(logic);
        });
        const identifierMap = Object.assign(Object.assign({}, replacements['data2']), replacements['logic']);
        thatDefinition.logics.forEach((logic) => {
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
    static _splitPath(fullPath) {
        const arr = fullPath.split('/');
        let pos = arr.length - 1; // root Vue 的位置
        while (arr[pos] && arr[pos].endsWith('.vue'))
            pos--;
        pos++;
        return { arr, pos };
    }
    static resolveTagName(fullPath) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        const vueNames = arr.slice(pos);
        let result = [];
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
exports.default = VueFile;
//# sourceMappingURL=VueFile.js.map