"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../types/line-reader.d.ts" />
const fs = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const lineReader = require("line-reader");
const FSEntry_1 = require("./FSEntry");
const TemplateHandler_1 = require("./TemplateHandler");
const ScriptHandler_1 = require("./ScriptHandler");
const StyleHandler_1 = require("./StyleHandler");
const babel_traverse_1 = require("babel-traverse");
const fetchPartialContent = (content, tag) => {
    const reg = new RegExp(`<${tag}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].trim() + '\n' : '';
};
class VueFile extends FSEntry_1.default {
    constructor(fullPath) {
        super(fullPath, false);
        this.isVue = true;
    }
    /**
     * 提前检测 VueFile 文件类型，以及子组件等
     * 需要异步，否则可能会比较慢
     */
    preopen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                return;
            const stats = fs.statSync(this.fullPath);
            this.isDirectory = stats.isDirectory();
            if (this.isDirectory)
                yield this.loadDirectory();
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
                children.push(new VueFile(fullPath));
            });
            return children;
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen)
                return;
            yield this.load();
            this.isOpen = true;
        });
    }
    reopen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            this.isOpen = true;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}!`);
            // const stats = fs.statSync(this.fullPath);
            // this.isDirectory = stats.isDirectory();
            if (this.isDirectory) {
                if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                    this.script = yield fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
                else
                    throw new Error(`Cannot find 'index.js' in multifile Vue!`);
                if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                    this.template = yield fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
                if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                    this.style = yield fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
                if (fs.existsSync(path.join(this.fullPath, 'sample.vue'))) {
                    const sampleRaw = yield fs.readFile(path.join(this.fullPath, 'sample.vue'), 'utf8');
                    const templateRE = /<template.*?>([\s\S]*?)<\/template>/i;
                    const sample = sampleRaw.match(templateRE);
                    this.sample = sample && sample[1].trim();
                }
            }
            else {
                this.content = yield fs.readFile(this.fullPath, 'utf8');
                this.template = fetchPartialContent(this.content, 'template');
                this.script = fetchPartialContent(this.content, 'script');
                this.style = fetchPartialContent(this.content, 'style');
            }
            return this;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            shell.rm('-rf', this.fullPath);
            let template = this.template;
            let script = this.script;
            let style = this.style;
            if (this.templateHandler)
                template = this.templateHandler.generate();
            if (this.scriptHandler)
                script = this.scriptHandler.generate();
            if (this.styleHandler)
                style = this.styleHandler.generate();
            if (this.isDirectory) {
                shell.mkdir(this.fullPath);
                const promises = [];
                template && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.html'), template));
                script && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.js'), script));
                style && promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), style));
                return Promise.all(promises);
            }
            else {
                const contents = [];
                template && contents.push(`<template>\n${template}</template>`);
                script && contents.push(`<script>\n${script}</script>`);
                style && contents.push(`<style module>\n${style}</style>`);
                return fs.writeFile(this.fullPath, contents.join('\n\n') + '\n');
            }
        });
    }
    parseTemplate() {
        if (this.templateHandler)
            return;
        this.templateHandler = new TemplateHandler_1.default(this.template);
    }
    parseScript() {
        if (this.scriptHandler)
            return;
        this.scriptHandler = new ScriptHandler_1.default(this.script);
    }
    parseStyle() {
        if (this.styleHandler)
            return;
        this.styleHandler = new StyleHandler_1.default(this.style);
    }
    checkTransform() {
        if (!this.isDirectory)
            return true; // @TODO
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
        babel_traverse_1.default(this.scriptHandler.ast, {
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
}
exports.default = VueFile;
//# sourceMappingURL=VueFile.js.map