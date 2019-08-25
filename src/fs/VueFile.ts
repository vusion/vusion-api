/// <reference path="../../types/line-reader.d.ts" />
import * as fs from 'fs-extra';
import * as path from 'path';
import * as shell from 'shelljs';
import * as lineReader from 'line-reader';

import FSEntry from './FSEntry';
import TemplateHandler from './TemplateHandler';
import ScriptHandler from './ScriptHandler';
import StyleHandler from './StyleHandler';

import traverse from '@babel/traverse';

const fetchPartialContent = (content: string, tag: string) => {
    const reg = new RegExp(`<${tag}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].trim() + '\n' : '';
};

export default class VueFile extends FSEntry {
    componentName: string;
    alias: string;
    // 子组件
    // 为`undefined`表示未打开过，为数组表示已经打开。
    children: VueFile[];
    isChild: boolean;

    // 单文件内容
    // 为`undefined`表示未打开过
    content: string;
    template: string;
    script: string;
    style: string;
    sample: string;

    templateHandler: TemplateHandler; // 为`undefined`表示还未解析
    scriptHandler: ScriptHandler; // 为`undefined`表示还未解析
    styleHandler: StyleHandler; // 为`undefined`表示还未解析

    constructor(fullPath: string) {
        super(fullPath, false);
        this.isVue = true;
    }

    /**
     * 提前检测 VueFile 文件类型，以及子组件等
     * 需要异步，否则可能会比较慢
     */
    async preopen() {
        if (!fs.existsSync(this.fullPath))
            return;
        const stats = fs.statSync(this.fullPath);
        this.isDirectory = stats.isDirectory();
        if (this.isDirectory)
            this.children = await this.loadDirectory();

        this.alias = await this.readTitleInReadme();
    }

    /**
     * 尝试读取 README.md 的标题行
     * 在前 10 行中查找
     */
    async readTitleInReadme(): Promise<string> {
        const readmePath = path.join(this.fullPath, 'README.md');
        if (!fs.existsSync(readmePath))
            return;

        const titleRE = /^#\s+\w+\s*(.*?)$/;
        let count = 0;
        let title: string;
        return new Promise((resolve, reject) => {
            lineReader.eachLine(readmePath, { encoding: 'utf8' }, (line, last) => {
                line = line.trim();
                const cap = titleRE.exec(line);
                if (cap) {
                    title = cap[1];
                    return false;
                } else {
                    count++;
                    if (count > 10)
                        return false;
                }
            }, (err) => {
                err? reject(err) : resolve(title);
            });
        });
    }

    async loadDirectory() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}`);

        const children: Array<VueFile> = [];
        const fileNames = await fs.readdir(this.fullPath);

        fileNames.forEach((name) => {
            if (!name.endsWith('.vue'))
                return;

            const fullPath = path.join(this.fullPath, name);
            const vueFile = new VueFile(fullPath);
            vueFile.isChild = true;
            children.push(vueFile);
        });

        return children;
    }

    async open() {
        if (this.isOpen)
            return;

        await this.load();
        this.isOpen = true;
    }

    async reopen() {
        await this.load();
        this.isOpen = true;
    }

    protected async load() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}!`);

        // const stats = fs.statSync(this.fullPath);
        // this.isDirectory = stats.isDirectory();

        if (this.isDirectory) {
            if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                this.script = await fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
            else
                throw new Error(`Cannot find 'index.js' in multifile Vue!`);

            if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                this.template = await fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
            if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                this.style = await fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
            if (fs.existsSync(path.join(this.fullPath, 'sample.vue'))) {
                const sampleRaw = await fs.readFile(path.join(this.fullPath, 'sample.vue'), 'utf8');
                const templateRE = /<template.*?>([\s\S]*?)<\/template>/i;
                const sample = sampleRaw.match(templateRE);
                this.sample = sample && sample[1].trim();
            }
        } else {
            this.content = await fs.readFile(this.fullPath, 'utf8');
            this.template = fetchPartialContent(this.content, 'template');
            this.script = fetchPartialContent(this.content, 'script');
            this.style = fetchPartialContent(this.content, 'style');
        }

        return this;
    }

    async save() {
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
        } else {
            const contents = [];
            template && contents.push(`<template>\n${template}</template>`);
            script && contents.push(`<script>\n${script}</script>`);
            style && contents.push(`<style module>\n${style}</style>`);

            return fs.writeFile(this.fullPath, contents.join('\n\n') + '\n');
        }
    }

    parseTemplate() {
        if (this.templateHandler)
            return;

        this.templateHandler = new TemplateHandler(this.template);
    }

    parseScript() {
        if (this.scriptHandler)
            return;

        this.scriptHandler = new ScriptHandler(this.script);
    }

    parseStyle() {
        if (this.styleHandler)
            return;

        this.styleHandler = new StyleHandler(this.style);
    }

    checkTransform() {
        if (!this.isDirectory)
            return true; // @TODO
        else {
            const files = fs.readdirSync(this.fullPath);
            const normalBlocks = ['index.html', 'index.js', 'module.css'];
            const extraBlocks: Array<string> = [];
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

        function shortenPath(filePath: string) {
            if (filePath.startsWith('../')) {
                let newPath = filePath.replace(/^\.\.\//, '');
                if (!newPath.startsWith('../'))
                    newPath = './' + newPath;
                return newPath;
            } else
                return filePath;
        }

        function lengthenPath(filePath: string) {
            if (filePath.startsWith('.'))
                return path.join('../', filePath);
            else
                return filePath;
        }

        traverse(this.scriptHandler.ast, {
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
