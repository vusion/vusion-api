"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SUBFILE_LIST = exports.VueFileExtendMode = void 0;
/// <reference path="../types/line-reader.d.ts" />
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const shell = __importStar(require("shelljs"));
const lineReader = __importStar(require("line-reader"));
const pluralize = require("pluralize");
const utils_1 = require("../utils");
const FSEntry_1 = __importDefault(require("./FSEntry"));
const TemplateHandler_1 = __importDefault(require("./TemplateHandler"));
const ScriptHandler_1 = __importDefault(require("./ScriptHandler"));
const StyleHandler_1 = __importDefault(require("./StyleHandler"));
const APIHandler_1 = __importDefault(require("./APIHandler"));
const ExamplesHandler_1 = __importDefault(require("./ExamplesHandler"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const fs_1 = require("./fs");
const shared_1 = require("../utils/shared");
const fetchPartialContent = (content, tag, attrs = '') => {
    const reg = new RegExp(`<${tag}${attrs ? ' ' + attrs : ''}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].replace(/^\n+/, '') : '';
};
var VueFileExtendMode;
(function (VueFileExtendMode) {
    VueFileExtendMode["style"] = "style";
    VueFileExtendMode["script"] = "script";
    VueFileExtendMode["template"] = "template";
    VueFileExtendMode["all"] = "all";
})(VueFileExtendMode = exports.VueFileExtendMode || (exports.VueFileExtendMode = {}));
;
exports.SUBFILE_LIST = [
    'index.html',
    'index.js',
    'module.css',
    'index.vue',
    'README.md',
    'CHANGELOG.md',
    'api.yaml',
    'package.json',
    'node_modules',
    'vusion_packages',
    'assets',
    'docs',
    'i18n',
    'dist',
    'public',
    'screenshots',
    'vetur',
];
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
class VueFile extends FSEntry_1.default {
    /**
     * @param fullPath 完整路径，必须以`.vue`结尾。也可以是一个相对的虚拟路径
     */
    constructor(fullPath) {
        if (!fullPath.endsWith('.vue'))
            throw new Error('Not a vue file: ' + fullPath);
        super(fullPath, undefined);
        this.isVue = true;
        this.isComposed = true;
        this.tagName = VueFile.resolveTagName(fullPath);
        this.componentName = utils_1.kebab2Camel(this.tagName);
    }
    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    preOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                return;
            const stats = fs.statSync(this.fullPath);
            this.isDirectory = stats.isDirectory();
            if (this.isDirectory) {
                yield this.loadDirectory();
                this.isComposed = fs.existsSync(path.join(this.fullPath, 'index.vue'));
            }
            else {
                this.subfiles = [];
                this.children = [];
            }
            this.alias = yield this.readTitleInReadme();
        });
    }
    /**
     * 尝试读取 README.md 的标题行
     * 在前 10 行中查找
     */
    readTitleInReadme() {
        return __awaiter(this, void 0, void 0, function* () {
            const readmePath = path.join(this.fullPath, 'README.md');
            if (!fs.existsSync(readmePath))
                return;
            const titleRE = /^#\s+\w+\s*(.*?)$/;
            let count = 0;
            let title;
            return new Promise((resolve, reject) => {
                lineReader.eachLine(readmePath, { encoding: 'utf8' }, (line, last) => {
                    line = line.trim();
                    const cap = titleRE.exec(line);
                    if (cap) {
                        title = cap[1];
                        return false;
                    }
                    else {
                        count++;
                        if (count > 10)
                            return false;
                    }
                }, (err) => {
                    err ? reject(err) : resolve(title);
                });
            });
        });
    }
    /**
     * 加载多文件目录
     */
    loadDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}`);
            const children = [];
            this.subfiles = yield fs.readdir(this.fullPath);
            this.subfiles.forEach((name) => {
                if (!name.endsWith('.vue') || name === 'index.vue')
                    return;
                const fullPath = path.join(this.fullPath, name);
                let vueFile;
                // if (this.isWatched)
                //     vueFile = VueFile.fetch(fullPath);
                // else
                vueFile = new VueFile(fullPath);
                vueFile.parent = this;
                vueFile.isChild = true;
                children.push(vueFile);
            });
            return this.children = children;
        });
    }
    /**
     * 强制重新打开
     */
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            yield this.preOpen();
            yield this.load();
            this.isOpen = true;
        });
    }
    /**
     * 关闭文件
     */
    close() {
        this.isDirectory = undefined;
        this.alias = undefined;
        this.subfiles = undefined;
        this.children = undefined;
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
        this.apiHandler = undefined;
        this.examplesHandler = undefined;
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
            yield this.loadPackage();
            yield this.loadAPI();
            yield this.loadExamples();
            yield this.loadDefinition();
        });
    }
    /**
    * 预加载
    * 只加载 content
    */
    preload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}!`);
            if (!this.isDirectory)
                return this.content = yield fs.readFile(this.fullPath, 'utf8');
            else if (this.isComposed)
                return this.content = yield fs.readFile(path.join(this.fullPath, 'index.vue'), 'utf8');
        });
    }
    loadScript() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory && !this.isComposed) {
                if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                    return this.script = yield fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
                else
                    throw new Error(`Cannot find 'index.js' in multifile Vue ${this.fullPath}!`);
            }
            else {
                return this.script = fetchPartialContent(this.content, 'script');
            }
        });
    }
    loadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory && !this.isComposed) {
                if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                    return this.template = yield fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
            }
            else {
                return this.template = fetchPartialContent(this.content, 'template');
            }
        });
    }
    loadStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory && !this.isComposed) {
                if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                    return this.style = yield fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
            }
            else {
                return this.style = fetchPartialContent(this.content, 'style');
            }
        });
    }
    loadPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'package.json'))) {
                    const content = yield fs.readFile(path.join(this.fullPath, 'package.json'), 'utf8');
                    return this.package = JSON.parse(content);
                }
            }
        });
    }
    loadAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'api.yaml')))
                    return this.api = yield fs.readFile(path.join(this.fullPath, 'api.yaml'), 'utf8');
            }
            else {
                return this.api = fetchPartialContent(this.content, 'api');
            }
        });
    }
    // @TODO
    // loadDocs()
    loadExamples(from) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (!from) {
                    if (fs.existsSync(path.join(this.fullPath, 'docs/blocks.md')))
                        from = 'blocks.md';
                    else if (fs.existsSync(path.join(this.fullPath, 'docs/examples.md')))
                        from = 'examples.md';
                    else
                        return;
                }
                return this.examples = yield fs.readFile(path.join(this.fullPath, 'docs/' + from), 'utf8');
            }
            else {
                if (!from) {
                    if (fetchPartialContent(this.content, 'doc', `name="blocks.md"`))
                        from = 'blocks.md';
                    else if (fetchPartialContent(this.content, 'doc', `name="examples.md"`))
                        from = 'examples.md';
                    else
                        return;
                }
                this.examples = fetchPartialContent(this.content, 'doc', `name="${from}"`);
            }
        });
    }
    loadDefinition() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'definition.json')))
                    return this.definition = yield fs.readFile(path.join(this.fullPath, 'definition.json'), 'utf8');
            }
            else {
                return this.definition = fetchPartialContent(this.content, 'definition');
            }
        });
    }
    hasAssets() {
        return !!this.subfiles && this.subfiles.includes('assets');
    }
    /**
     * 是否有额外的
     */
    hasExtra() {
        return !!this.subfiles && this.subfiles.some((file) => file[0] !== '.' && !exports.SUBFILE_LIST.includes(file));
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
    // @TODO 其它 has 需要吗？
    warnIfNotOpen() {
        if (!this.isOpen)
            console.warn(`[vusion.VueFile] File ${this.fileName} seems not open.`);
    }
    parseAll() {
        this.warnIfNotOpen();
        this.parseTemplate();
        this.parseScript();
        this.parseStyle();
        this.parseAPI();
        this.parseExamples();
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
    parseAPI() {
        if (this.apiHandler)
            return this.apiHandler;
        else
            return this.apiHandler = new APIHandler_1.default(this.api, path.join(this.fullPath, 'api.yaml'));
    }
    parseExamples() {
        if (this.examplesHandler)
            return this.examplesHandler;
        else
            return this.examplesHandler = new ExamplesHandler_1.default(this.examples);
    }
    generate(options) {
        let template = this.template;
        let script = this.script;
        let style = this.style;
        let definition = this.definition;
        if (this.templateHandler) {
            if (!this.isDirectory)
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
        const vueFile = new VueFile(this.fullPath);
        vueFile.fullPath = this.fullPath;
        vueFile.fileName = this.fileName;
        vueFile.extName = this.extName;
        vueFile.baseName = this.baseName;
        vueFile.title = this.title;
        vueFile.isDirectory = this.isDirectory;
        vueFile.isVue = this.isVue;
        vueFile.isComposed = this.isComposed;
        vueFile.isOpen = this.isOpen;
        vueFile.isSaving = this.isSaving;
        vueFile.tagName = this.tagName;
        vueFile.componentName = this.componentName;
        vueFile.alias = this.alias;
        vueFile.subfiles = this.subfiles && Array.from(this.subfiles);
        vueFile.children = this.children && Array.from(this.children);
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
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.warnIfNotOpen();
            this.isSaving = true;
            // 只有 isDirectory 不相同的时候才删除，因为可能有其它额外的文件
            if (fs.existsSync(this.fullPath) && fs.statSync(this.fullPath).isDirectory() !== this.isDirectory)
                shell.rm('-rf', this.fullPath);
            this.generate();
            if (this.isDirectory) {
                fs.ensureDirSync(this.fullPath);
                if (this.isComposed)
                    yield fs.writeFile(path.join(this.fullPath, 'index.vue'), this.content);
                else {
                    const promises = [];
                    this.template && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.html'), this.template));
                    this.script && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.js'), this.script));
                    this.style && promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), this.style));
                    this.definition && promises.push(fs.writeFile(path.resolve(this.fullPath, 'definition.json'), this.definition));
                    if (this.package && typeof this.package === 'object')
                        promises.push(fs.writeFile(path.resolve(this.fullPath, 'package.json'), JSON.stringify(this.package, null, 2) + '\n'));
                    yield Promise.all(promises);
                }
            }
            else {
                yield fs.writeFile(this.fullPath, this.content);
            }
            _super.save.call(this);
        });
    }
    /**
     * 另存为，保存到另一个路径
     * 会克隆所有内容参数，但 handler 引用会被排除
     * @param fullPath
     */
    saveAs(fullPath, isDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            this.warnIfNotOpen();
            if (fs.existsSync(fullPath))
                throw new fs_1.FileExistsError(fullPath);
            if (this.templateHandler) {
                if (!this.isDirectory)
                    this.templateHandler.options.startLevel = 1;
                this.template = this.templateHandler.generate();
            }
            if (this.scriptHandler)
                this.script = this.scriptHandler.generate();
            if (this.styleHandler)
                this.style = this.styleHandler.generate();
            // 只有 isDirectory 相同的时候会拷贝原文件，否则重新生成
            if (this.isDirectory && fs.existsSync(this.fullPath) && fs.statSync(this.fullPath).isDirectory())
                yield fs.copy(this.fullPath, fullPath);
            const vueFile = new VueFile(fullPath);
            // vueFile.fullPath = this.fullPath;
            // vueFile.fileName = this.fileName;
            // vueFile.extName = this.extName;
            // vueFile.baseName = this.baseName;
            // vueFile.title = this.title;
            vueFile.isDirectory = isDirectory === undefined ? this.isDirectory : isDirectory;
            vueFile.isVue = this.isVue;
            vueFile.isComposed = this.isComposed;
            vueFile.isOpen = this.isOpen;
            vueFile.isSaving = this.isSaving;
            // vueFile.tagName = this.tagName;
            // vueFile.componentName = this.componentName;
            vueFile.alias = this.alias;
            vueFile.subfiles = this.subfiles && Array.from(this.subfiles);
            vueFile.children = this.children && Array.from(this.children);
            vueFile.content = this.content;
            vueFile.template = this.template;
            vueFile.script = this.script;
            vueFile.style = this.style;
            vueFile.api = this.api;
            vueFile.examples = this.examples;
            vueFile.definition = this.definition;
            vueFile.package = this.package && Object.assign({}, this.package);
            vueFile.save();
            return vueFile;
        });
    }
    // @TODO
    // async saveTemplate() {
    // }
    checkTransform() {
        if (!this.isDirectory)
            return true;
        else {
            const files = fs.readdirSync(this.fullPath);
            const normalBlocks = ['index.html', 'index.js', 'module.css'];
            const extraBlocks = [];
            files.forEach((file) => {
                if (!normalBlocks.includes(file))
                    extraBlocks.push(file);
            });
            return extraBlocks.length ? extraBlocks : true;
        }
    }
    transform() {
        const isDirectory = this.isDirectory;
        if (!isDirectory && !this.script) {
            this.script = 'export default {};\n';
        }
        if (!isDirectory && this.template) {
            const tabs = this.template.match(/^ */)[0];
            if (tabs)
                this.template = this.template.replace(new RegExp('^' + tabs, 'mg'), '');
        }
        this.parseScript();
        this.parseStyle();
        // this.parseTemplate();
        function shortenPath(filePath) {
            if (filePath.startsWith('../')) {
                let newPath = filePath.replace(/^\.\.\//, '');
                if (!newPath.startsWith('../'))
                    newPath = './' + newPath;
                return newPath;
            }
            else
                return filePath;
        }
        function lengthenPath(filePath) {
            if (filePath.startsWith('.'))
                return path.join('../', filePath);
            else
                return filePath;
        }
        traverse_1.default(this.scriptHandler.ast, {
            ImportDeclaration(nodeInfo) {
                if (nodeInfo.node.source)
                    nodeInfo.node.source.value = isDirectory ? shortenPath(nodeInfo.node.source.value) : lengthenPath(nodeInfo.node.source.value);
            },
            ExportAllDeclaration(nodeInfo) {
                if (nodeInfo.node.source)
                    nodeInfo.node.source.value = isDirectory ? shortenPath(nodeInfo.node.source.value) : lengthenPath(nodeInfo.node.source.value);
            },
            ExportNamedDeclaration(nodeInfo) {
                if (nodeInfo.node.source)
                    nodeInfo.node.source.value = isDirectory ? shortenPath(nodeInfo.node.source.value) : lengthenPath(nodeInfo.node.source.value);
            },
        });
        this.styleHandler.ast.walkAtRules((node) => {
            if (node.name !== 'import')
                return;
            const value = node.params.slice(1, -1);
            node.params = `'${isDirectory ? shortenPath(value) : lengthenPath(value)}'`;
        });
        this.styleHandler.ast.walkDecls((node) => {
            const re = /url\((['"])(.+?)['"]\)/;
            const cap = re.exec(node.value);
            if (cap) {
                node.value = node.value.replace(re, (m, quote, url) => {
                    url = isDirectory ? shortenPath(url) : lengthenPath(url);
                    return `url(${quote}${url}${quote})`;
                });
            }
        });
        this.isDirectory = !this.isDirectory;
        this.isComposed = !this.isComposed;
    }
    transformExportStyle() {
        this.parseScript();
        const exportDefault = this.$js.export().default();
        if (exportDefault.is('id')) {
            const name = exportDefault.node.name;
            // const object = this.$js.variables().get(name);
            const body = this.$js.variables().body;
            let object;
            const index = body.findIndex((node) => {
                if (node.type !== 'ExportNamedDeclaration')
                    return false;
                if (node.declaration.type === 'VariableDeclaration') {
                    let declarator = node.declaration.declarations.find((declarator) => declarator.id.name === name);
                    if (declarator) {
                        object = declarator.init;
                        return true;
                    }
                }
            });
            if (!~index)
                return;
            Object.assign(exportDefault.node, object);
            for (let i = body.length - 1; i >= 0; i--) {
                const node = body[i];
                if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') {
                    body.splice(i, 1);
                    i++;
                }
            }
        }
    }
    /**
     * 只验证将分解式转换为合并式
     * 不打算支持逆向了
     */
    transformDecomposed() {
        if (this.isComposed)
            return;
        shell.rm('-rf', path.join(this.fullPath, 'index.js'));
        shell.rm('-rf', path.join(this.fullPath, 'index.html'));
        shell.rm('-rf', path.join(this.fullPath, 'module.css'));
        this.transformExportStyle();
        if (this.children.length) {
            const content = [];
            content.push(`import ${this.componentName} from './index.vue';`);
            this.children.forEach((child) => content.push(`import ${child.componentName} from './${child.fileName}';`));
            content.push('');
            content.push('export {');
            content.push(`    ${this.componentName},`);
            this.children.forEach((child) => content.push(`    ${child.componentName},`));
            content.push('};');
            content.push('');
            content.push(`export default ${this.componentName};`);
            fs.writeFileSync(path.join(this.fullPath, 'index.js'), content.join('\n') + '\n');
        }
        this.isComposed = true;
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
        const thisDefinition = JSON.parse(this.definition || '{}');
        thisDefinition.variables = thisDefinition.variables || [];
        thisDefinition.logics = thisDefinition.logics || [];
        const thatDefinition = JSON.parse(that.definition || '{}');
        thatDefinition.variables = thatDefinition.variables || [];
        thatDefinition.logics = thatDefinition.logics || [];
        const replacements = { data2: {}, logic: {} };
        const thisParamKeys = new Set();
        thisDefinition.variables.forEach((variable) => thisParamKeys.add(variable.name));
        thatDefinition.variables.forEach((variable) => {
            const newName = shared_1.uniqueInMap(variable.name, thisParamKeys);
            if (newName !== variable.name)
                replacements['data2'][variable.name] = newName;
            thisDefinition.variables.push(Object.assign(variable, {
                name: newName,
            }));
        });
        const thisLogicKeys = new Set();
        thisDefinition.logics.forEach((logic) => thisLogicKeys.add(logic.name));
        thatDefinition.logics.forEach((logic) => {
            const newName = shared_1.uniqueInMap(logic.name, thisLogicKeys);
            if (newName !== logic.name)
                replacements['logic'][logic.name] = newName;
            thisDefinition.logics.push(Object.assign(logic, {
                name: newName,
            }));
        });
        this.definition = JSON.stringify(thisDefinition) + '\n';
        return replacements;
    }
    extend(mode, fullPath, fromPath) {
        const vueFile = new VueFile(fullPath);
        vueFile.isDirectory = true;
        vueFile.isComposed = true;
        // JS
        const tempComponentName = this.componentName.replace(/^[A-Z]/, 'O');
        vueFile.script = fromPath.endsWith('.vue')
            ? `import ${this.componentName === vueFile.componentName ? tempComponentName : this.componentName} from '${fromPath}';`
            : `import { ${this.componentName}${this.componentName === vueFile.componentName ? ' as ' + tempComponentName : ''} } from '${fromPath}';`;
        vueFile.script += `\n
export const ${vueFile.componentName} = {
    name: '${vueFile.tagName}',
    extends: ${this.componentName === vueFile.componentName ? tempComponentName : this.componentName},
};

export default ${vueFile.componentName};
`;
        if (mode === VueFileExtendMode.style || mode === VueFileExtendMode.all)
            vueFile.style = `@extend;\n`;
        if (mode === VueFileExtendMode.template || mode === VueFileExtendMode.all)
            vueFile.template = this.template;
        return vueFile;
    }
    /**
     * 根据 extends 查找基类组件
     */
    findSuper() {
        const $js = this.parseScript();
        const exportDefault = $js.export().default();
        let vueObject = exportDefault;
        if (exportDefault.is('id'))
            vueObject = $js.variables().get(exportDefault.node.name);
        if (!vueObject.is('object'))
            throw new TypeError('Cannot find Vue object!');
        const extendsName = vueObject.get('extends').name();
        // $js.imports()
    }
    static _splitPath(fullPath) {
        const arr = fullPath.split(path.sep);
        let pos = arr.length - 1; // root Vue 的位置
        while (arr[pos] && arr[pos].endsWith('.vue'))
            pos--;
        pos++;
        return { arr, pos };
    }
    /**
     * 计算根组件所在的目录
     * @param fullPath 完整路径
     */
    static resolveRootVueDir(fullPath) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        return arr.slice(0, pos).join(path.sep);
    }
    static resolveTagName(fullPath) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        const vueNames = arr.slice(pos);
        let result = [];
        vueNames.forEach((vueName) => {
            const baseName = path.basename(vueName, '.vue');
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
    static fetch(fullPath) {
        return super.fetch(fullPath);
    }
    /**
     * 从代码创建临时的 VueFile 文件
     * 相关于跳过 preOpen 和 open 阶段，但路径是虚拟的
     * @param code 代码
     */
    static from(code, fileName = 'temp.vue') {
        const vueFile = new VueFile('temp.vue');
        vueFile.isOpen = true;
        vueFile.isDirectory = false;
        vueFile.isComposed = true;
        vueFile.subfiles = [];
        vueFile.children = [];
        vueFile.content = code;
        vueFile.script = fetchPartialContent(vueFile.content, 'script');
        vueFile.template = fetchPartialContent(vueFile.content, 'template');
        vueFile.style = fetchPartialContent(vueFile.content, 'style');
        vueFile.api = fetchPartialContent(vueFile.content, 'api');
        vueFile.examples = fetchPartialContent(vueFile.content, 'doc', 'name="blocks"');
        if (!vueFile.examples)
            vueFile.examples = fetchPartialContent(vueFile.content, 'doc', 'name="examples"');
        vueFile.definition = fetchPartialContent(vueFile.content, 'definition');
        return vueFile;
    }
}
exports.default = VueFile;
//# sourceMappingURL=VueFile.js.map