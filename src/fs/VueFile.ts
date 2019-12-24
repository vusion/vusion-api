/// <reference path="../../types/line-reader.d.ts" />
import * as fs from 'fs-extra';
import * as path from 'path';
import * as shell from 'shelljs';
import * as lineReader from 'line-reader';
import * as pluralize from 'pluralize';
import { kebab2Camel, Camel2kebab } from '../utils';

import FSEntry from './FSEntry';
import TemplateHandler from './TemplateHandler';
import ScriptHandler from './ScriptHandler';
import StyleHandler from './StyleHandler';

import traverse from '@babel/traverse';
import PackageJSON from '../types/PackageJSON';

const fetchPartialContent = (content: string, tag: string) => {
    const reg = new RegExp(`<${tag}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].replace(/^\n+/, '') : '';
};

export enum VueFileExtendMode {
    style = 'style',
    script = 'script',
    template = 'template',
    all = 'all',
};

export default class VueFile extends FSEntry {
    tagName: string; // 中划线名称
    componentName: string; // 驼峰名称
    alias: string;
    // 子组件
    // 为`undefined`表示未打开过，为数组表示已经打开。
    parent: VueFile;
    children: VueFile[];
    isChild: boolean;

    // 单文件内容
    // 为`undefined`表示未打开过
    content: string;
    template: string;
    script: string;
    style: string;
    sample: string;
    package: PackageJSON;

    templateHandler: TemplateHandler; // 为`undefined`表示还未解析
    scriptHandler: ScriptHandler; // 为`undefined`表示还未解析
    styleHandler: StyleHandler; // 为`undefined`表示还未解析

    constructor(fullPath: string) {
        if (!fullPath.endsWith('.vue'))
            throw new Error('Not a vue file: ' + fullPath);
        super(fullPath, undefined);
        this.isVue = true;
        this.tagName = VueFile.resolveTagName(fullPath);
        this.componentName = kebab2Camel(this.tagName);
    }

    /**
     * 提前检测 VueFile 文件类型，以及子组件等
     * 需要异步，否则可能会比较慢
     */
    async preOpen() {
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
    }

    async forceOpen() {
        this.close();
        await this.preOpen();
        await this.load();
        this.isOpen = true;
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
        this.sample = undefined;
        this.package = undefined;

        this.templateHandler = undefined;
        this.scriptHandler = undefined;
        this.styleHandler = undefined;

        this.isOpen = false;
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
            if (fs.existsSync(path.join(this.fullPath, 'package.json'))) {
                const content = await fs.readFile(path.join(this.fullPath, 'package.json'), 'utf8');
                // try {
                this.package = JSON.parse(content);
                // } catch (e) {}
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
        this.isSaving = true;

        if (fs.existsSync(this.fullPath) && fs.statSync(this.fullPath).isDirectory() !== this.isDirectory)
            shell.rm('-rf', this.fullPath);

        let template = this.template;
        let script = this.script;
        let style = this.style;

        if (this.templateHandler)
            this.template = template = this.templateHandler.generate();
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

            result = await Promise.all(promises);
        } else {
            const contents = [];
            template && contents.push(`<template>\n${template}</template>`);
            script && contents.push(`<script>\n${script}</script>`);
            style && contents.push(`<style module>\n${style}</style>`);

            result = await fs.writeFile(this.fullPath, contents.join('\n\n') + '\n');
        }

        super.save();
        return result;
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

        if (!isDirectory && !this.script) {
            this.script = 'export default {};\n';
        }

        console.log(this.template.match(/^ */)[0]);
        if (!isDirectory && this.template) {
            const tabs = this.template.match(/^ */)[0];
            console.log(tabs.length);
            if (tabs)
                this.template = this.template.replace(new RegExp('^' + tabs, 'mg'), '');
        }

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

    extend(mode: VueFileExtendMode, fullPath: string, fromPath: string) {
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

    private static _splitPath(fullPath: string) {
        const arr = fullPath.split(path.sep);
        let pos = arr.length - 1; // root Vue 的位置
        while(arr[pos] && arr[pos].endsWith('.vue'))
            pos--;
        pos++;

        return { arr, pos };
    }

    /**
     * 计算根组件所在的目录
     * @param fullPath 完整路径
     */
    static resolveRootVueDir(fullPath: string) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        return arr.slice(0, pos).join(path.sep);
    }

    static resolveTagName(fullPath: string) {
        const { arr, pos } = VueFile._splitPath(fullPath);
        const vueNames = arr.slice(pos);

        let result: Array<string> = [];
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

    static fetch(fullPath: string) {
        return super.fetch(fullPath) as VueFile;
    }
}
