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
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../types/line-reader.d.ts" />
const fs = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const lineReader = require("line-reader");
const pluralize = require("pluralize");
const utils_1 = require("../utils");
const FSEntry_1 = require("./FSEntry");
const TemplateHandler_1 = require("./TemplateHandler");
const ScriptHandler_1 = require("./ScriptHandler");
const StyleHandler_1 = require("./StyleHandler");
const APIHandler_1 = require("./APIHandler");
const ExamplesHandler_1 = require("./ExamplesHandler");
const traverse_1 = require("@babel/traverse");
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
class VueFile extends FSEntry_1.default {
    constructor(fullPath) {
        if (!fullPath.endsWith('.vue'))
            throw new Error('Not a vue file: ' + fullPath);
        super(fullPath, undefined);
        this.isVue = true;
        this.tagName = VueFile.resolveTagName(fullPath);
        this.componentName = utils_1.kebab2Camel(this.tagName);
    }
    /**
     * 提前检测 VueFile 文件类型，以及子组件等
     * 需要异步，否则可能会比较慢
     */
    preOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                return;
            const stats = fs.statSync(this.fullPath);
            this.isDirectory = stats.isDirectory();
            if (this.isDirectory)
                this.children = yield this.loadDirectory();
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
    loadDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}`);
            const children = [];
            const fileNames = yield fs.readdir(this.fullPath);
            fileNames.forEach((name) => {
                if (!name.endsWith('.vue'))
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
            return children;
        });
    }
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            yield this.preOpen();
            yield this.load();
            this.isOpen = true;
        });
    }
    close() {
        this.isDirectory = undefined;
        this.alias = undefined;
        this.children = undefined;
        // 单文件内容
        this.content = undefined;
        this.template = undefined;
        this.script = undefined;
        this.style = undefined;
        this.api = undefined;
        this.examples = undefined;
        this.package = undefined;
        this.templateHandler = undefined;
        this.scriptHandler = undefined;
        this.styleHandler = undefined;
        this.apiHandler = undefined;
        this.examplesHandler = undefined;
        this.isOpen = false;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadScript();
            yield this.loadTemplate();
            yield this.loadStyle();
            yield this.loadPackage();
            yield this.loadAPI();
            yield this.loadExamples();
            return this;
        });
    }
    preload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}!`);
            if (!this.isDirectory)
                this.content = yield fs.readFile(this.fullPath, 'utf8');
        });
    }
    loadScript() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                    this.script = yield fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
                else
                    throw new Error(`Cannot find 'index.js' in multifile Vue!`);
            }
            else {
                this.script = fetchPartialContent(this.content, 'script');
            }
        });
    }
    loadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                    this.template = yield fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
            }
            else {
                this.template = fetchPartialContent(this.content, 'template');
            }
        });
    }
    loadStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                    this.style = yield fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
            }
            else {
                this.style = fetchPartialContent(this.content, 'style');
            }
        });
    }
    loadPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'package.json'))) {
                    const content = yield fs.readFile(path.join(this.fullPath, 'package.json'), 'utf8');
                    this.package = JSON.parse(content);
                }
            }
        });
    }
    loadAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'api.yaml')))
                    this.api = yield fs.readFile(path.join(this.fullPath, 'api.yaml'), 'utf8');
            }
            else {
                this.api = fetchPartialContent(this.content, 'api');
            }
        });
    }
    // @TODO
    // loadDocs()
    loadExamples() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.preload();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'docs/blocks.md')))
                    this.examples = yield fs.readFile(path.join(this.fullPath, 'docs/blocks.md'), 'utf8');
                else if (fs.existsSync(path.join(this.fullPath, 'docs/examples.md')))
                    this.examples = yield fs.readFile(path.join(this.fullPath, 'docs/examples.md'), 'utf8');
            }
            else {
                this.examples = fetchPartialContent(this.content, 'doc', 'name="blocks"');
                if (!this.examples)
                    this.examples = fetchPartialContent(this.content, 'doc', 'name="examples"');
            }
        });
    }
    parse() {
        this.parseTemplate();
        this.parseScript();
        this.parseStyle();
        this.parseAPI();
        this.parseExamples();
    }
    parseTemplate() {
        if (this.templateHandler)
            return;
        return this.templateHandler = new TemplateHandler_1.default(this.template);
    }
    parseScript() {
        if (this.scriptHandler)
            return;
        return this.scriptHandler = new ScriptHandler_1.default(this.script);
    }
    parseStyle() {
        if (this.styleHandler)
            return;
        return this.styleHandler = new StyleHandler_1.default(this.style);
    }
    parseAPI() {
        if (this.apiHandler)
            return;
        return this.apiHandler = new APIHandler_1.default(this.api, path.join(this.fullPath, 'api.yaml'));
    }
    parseExamples() {
        if (this.examplesHandler)
            return;
        return this.examplesHandler = new ExamplesHandler_1.default(this.examples);
    }
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.isSaving = true;
            // 只有 isDirectory 不相同的时候才删除
            if (fs.existsSync(this.fullPath) && fs.statSync(this.fullPath).isDirectory() !== this.isDirectory)
                shell.rm('-rf', this.fullPath);
            let template = this.template;
            let script = this.script;
            let style = this.style;
            if (this.templateHandler) {
                if (!this.isDirectory)
                    this.templateHandler.options.startLevel = 1;
                this.template = template = this.templateHandler.generate();
            }
            if (this.scriptHandler)
                this.script = script = this.scriptHandler.generate();
            if (this.styleHandler)
                this.style = style = this.styleHandler.generate();
            let result;
            if (this.isDirectory) {
                fs.ensureDirSync(this.fullPath);
                const promises = [];
                template && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.html'), template));
                script && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.js'), script));
                style && promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), style));
                if (this.package && typeof this.package === 'object')
                    promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), JSON.stringify(this.package, null, 2)));
                result = yield Promise.all(promises);
            }
            else {
                const contents = [];
                template && contents.push(`<template>\n${template}</template>`);
                script && contents.push(`<script>\n${script}</script>`);
                style && contents.push(`<style module>\n${style}</style>`);
                result = yield fs.writeFile(this.fullPath, contents.join('\n\n') + '\n');
            }
            _super.save.call(this);
            return result;
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
            ImportDeclaration(nodePath) {
                if (nodePath.node.source)
                    nodePath.node.source.value = isDirectory ? shortenPath(nodePath.node.source.value) : lengthenPath(nodePath.node.source.value);
            },
            ExportAllDeclaration(nodePath) {
                if (nodePath.node.source)
                    nodePath.node.source.value = isDirectory ? shortenPath(nodePath.node.source.value) : lengthenPath(nodePath.node.source.value);
            },
            ExportNamedDeclaration(nodePath) {
                if (nodePath.node.source)
                    nodePath.node.source.value = isDirectory ? shortenPath(nodePath.node.source.value) : lengthenPath(nodePath.node.source.value);
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
    }
    extend(mode, fullPath, fromPath) {
        const vueFile = new VueFile(fullPath);
        vueFile.isDirectory = true;
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
}
exports.default = VueFile;
//# sourceMappingURL=VueFile.js.map