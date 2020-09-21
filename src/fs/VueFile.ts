/// <reference path="../types/line-reader.d.ts" />
import * as fs from 'fs-extra';
import * as path from 'path';
import * as shell from 'shelljs';
import * as lineReader from 'line-reader';
import pluralize = require('pluralize');
import { kebab2Camel, Camel2kebab } from '../utils';

import FSEntry from './FSEntry';
import { default as TemplateHandler, TemplateOptions } from './TemplateHandler';
import ScriptHandler from './ScriptHandler';
import StyleHandler from './StyleHandler';
import APIHandler from './APIHandler';
import ExamplesHandler from './ExamplesHandler';

import traverse from '@babel/traverse';
import PackageJSON from '../types/PackageJSON';
import { FileExistsError } from './fs';
import { uniqueInMap } from '../utils/shared';

const fetchPartialContent = (content: string, tag: string, attrs: string = '') => {
    const reg = new RegExp(`<${tag}${attrs ? ' ' + attrs : ''}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].replace(/^\n+/, '') : '';
};

export enum VueFileExtendMode {
    style = 'style',
    script = 'script',
    template = 'template',
    all = 'all',
};

export const SUBFILE_LIST = [
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
    constructor(fullPath: string) {
        if (!fullPath.endsWith('.vue'))
            throw new Error('Not a vue file: ' + fullPath);
        super(fullPath, undefined);
        this.isVue = true;
        this.isComposed = true;
        this.tagName = VueFile.resolveTagName(fullPath);
        this.componentName = kebab2Camel(this.tagName);
    }

    /**
     * 提前打开
     * 检测 VueFile 文件类型，以及子组件等
     * 一般用于在列表中快速获取信息，相比直接 open 读取文件内容来说，少耗一些性能
     */
    async preOpen(): Promise<void> {
        if (!fs.existsSync(this.fullPath))
            return;
        const stats = fs.statSync(this.fullPath);
        this.isDirectory = stats.isDirectory();
        if (this.isDirectory) {
            await this.loadDirectory();
            this.isComposed = fs.existsSync(path.join(this.fullPath, 'index.vue'));
        } else {
            this.subfiles = [];
            this.children = [];
        }

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

    /**
     * 加载多文件目录
     */
    async loadDirectory() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}`);

        const children: Array<VueFile> = [];
        this.subfiles = await fs.readdir(this.fullPath);

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
    }

    /**
     * 强制重新打开
     */
    async forceOpen(): Promise<void> {
        this.close();
        await this.preOpen();
        await this.load();
        this.isOpen = true;
    }

    /**
     * 关闭文件
     */
    close(): void {
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
    protected async load(): Promise<void> {
        await this.loadScript();
        await this.loadTemplate();
        await this.loadStyle();
        await this.loadPackage();
        await this.loadAPI();
        await this.loadExamples();
        await this.loadDefinition();
    }

     /**
     * 预加载
     * 只加载 content
     */
    async preload() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}!`);

        if (!this.isDirectory)
            return this.content = await fs.readFile(this.fullPath, 'utf8');
        else if (this.isComposed)
            return this.content = await fs.readFile(path.join(this.fullPath, 'index.vue'), 'utf8');
    }

    async loadScript() {
        await this.preload();

        if (this.isDirectory && !this.isComposed) {
            if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                return this.script = await fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
            else
                throw new Error(`Cannot find 'index.js' in multifile Vue ${this.fullPath}!`);
        } else {
            return this.script = fetchPartialContent(this.content, 'script');
        }
    }

    async loadTemplate() {
        await this.preload();

        if (this.isDirectory && !this.isComposed) {
            if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                return this.template = await fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
        } else {
            return this.template = fetchPartialContent(this.content, 'template');
        }
    }

    async loadStyle() {
        await this.preload();

        if (this.isDirectory && !this.isComposed) {
            if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                return this.style = await fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
        } else {
            return this.style = fetchPartialContent(this.content, 'style');
        }
    }

    async loadPackage() {
        await this.preload();

        if (this.isDirectory) {
            if (fs.existsSync(path.join(this.fullPath, 'package.json'))) {
                const content = await fs.readFile(path.join(this.fullPath, 'package.json'), 'utf8');
                return this.package = JSON.parse(content);
            }
        }
    }

    async loadAPI() {
        await this.preload();

        if (this.isDirectory) {
            if (fs.existsSync(path.join(this.fullPath, 'api.yaml')))
                return this.api = await fs.readFile(path.join(this.fullPath, 'api.yaml'), 'utf8');
        } else {
            return this.api = fetchPartialContent(this.content, 'api');
        }
    }

    // @TODO
    // loadDocs()
    async loadExamples(from?: string) {
        await this.preload();

        if (this.isDirectory) {
            if (!from) {
                if (fs.existsSync(path.join(this.fullPath, 'docs/blocks.md')))
                    from = 'blocks.md';
                else if (fs.existsSync(path.join(this.fullPath, 'docs/examples.md')))
                    from = 'examples.md';
                else
                    return;
            }
            return this.examples = await fs.readFile(path.join(this.fullPath, 'docs/' + from), 'utf8');
        } else {
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
    }

    async loadDefinition() {
        await this.preload();

        if (this.isDirectory) {
            if (fs.existsSync(path.join(this.fullPath, 'definition.json')))
                return this.definition = await fs.readFile(path.join(this.fullPath, 'definition.json'), 'utf8');
        } else {
            return this.definition = fetchPartialContent(this.content, 'definition');
        }
    }

    hasAssets() {
        return !!this.subfiles && this.subfiles.includes('assets');
    }

    /**
     * 是否有额外的
     */
    hasExtra() {
        return !!this.subfiles && this.subfiles.some((file) => file[0] !== '.' && !SUBFILE_LIST.includes(file));
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

    // @TODO 其它 has 需要吗？

    warnIfNotOpen() {
        if (!this.isOpen)
            console.warn(`[vusion.VueFile] File ${this.fileName} seems not open.`);
    }

    parseAll(): void {
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

    parseAPI() {
        if (this.apiHandler)
            return this.apiHandler;
        else
            return this.apiHandler = new APIHandler(this.api, path.join(this.fullPath, 'api.yaml'));
    }

    parseExamples() {
        if (this.examplesHandler)
            return this.examplesHandler;
        else
            return this.examplesHandler = new ExamplesHandler(this.examples);
    }

    generate(options?: TemplateOptions) {
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
    async save(): Promise<void> {
        this.warnIfNotOpen();
        this.isSaving = true;

        // 只有 isDirectory 不相同的时候才删除，因为可能有其它额外的文件
        if (fs.existsSync(this.fullPath) && fs.statSync(this.fullPath).isDirectory() !== this.isDirectory)
            shell.rm('-rf', this.fullPath);

        this.generate();

        if (this.isDirectory) {
            fs.ensureDirSync(this.fullPath);

            if (this.isComposed)
                await fs.writeFile(path.join(this.fullPath, 'index.vue'), this.content);
            else {
                const promises = [];

                this.template && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.html'), this.template));
                this.script && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.js'), this.script));
                this.style && promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), this.style));
                this.definition && promises.push(fs.writeFile(path.resolve(this.fullPath, 'definition.json'), this.definition));
                if (this.package && typeof this.package === 'object')
                    promises.push(fs.writeFile(path.resolve(this.fullPath, 'package.json'), JSON.stringify(this.package, null, 2) + '\n'));
    
                await Promise.all(promises);
            }
        } else {
            await fs.writeFile(this.fullPath, this.content);
        }

        super.save();
    }

    /**
     * 另存为，保存到另一个路径
     * 会克隆所有内容参数，但 handler 引用会被排除
     * @param fullPath
     */
    async saveAs(fullPath: string, isDirectory?: boolean) {
        this.warnIfNotOpen();
        if (fs.existsSync(fullPath))
            throw new FileExistsError(fullPath);

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
            await fs.copy(this.fullPath, fullPath);

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

        if (!isDirectory && this.template) {
            const tabs = this.template.match(/^ */)[0];
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
            const name = (exportDefault.node as babel.types.Identifier).name;
            // const object = this.$js.variables().get(name);
            
            const body = this.$js.variables().body;
            let object: babel.types.Expression;
            const index = body.findIndex((node) => {
                if (node.type !== 'ExportNamedDeclaration')
                    return false;
                
                if (node.declaration.type === 'VariableDeclaration') {
                    let declarator = node.declaration.declarations.find((declarator: babel.types.VariableDeclarator) => (declarator.id as babel.types.Identifier).name === name);
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
    merge(that: VueFile, route: string | number | { line: number, character: number } = '') {
        const scriptReplacements = this.scriptHandler.merge(that.scriptHandler);
        const styleReplacements = this.styleHandler.merge(that.styleHandler);
        const definitionReplacements = this.mergeDefinition(that);
        const replacements = { ...scriptReplacements, ...styleReplacements, ...definitionReplacements };

        this.templateHandler.merge(that.templateHandler, route, replacements);
        return replacements;
    }

    mergeDefinition(that: VueFile) {
        const thisDefinition = JSON.parse(this.definition || '{}');
        thisDefinition.params = thisDefinition.params || [];
        thisDefinition.logics = thisDefinition.logics || [];
        const thatDefinition = JSON.parse(that.definition || '{}');
        thatDefinition.params = thatDefinition.params || [];
        thatDefinition.logics = thatDefinition.logics || [];
        
        const replacements: { [key: string]: { [old: string]: string } } = { data2: {}, logic: {} };

        const thisParamKeys: Set<string> = new Set();
        thisDefinition.params.forEach((param: { name: string }) => thisParamKeys.add(param.name));
        thatDefinition.params.forEach((param: { name: string }) => {
            const newName = uniqueInMap(param.name, thisParamKeys);
            if (newName !== param.name)
                replacements['data2'][param.name] = newName;
            thisDefinition.params.push(Object.assign(param, {
                name: newName,
            }));
        });

        const thisLogicKeys: Set<string> = new Set();
        thisDefinition.logics.forEach((logic: { name: string }) => thisLogicKeys.add(logic.name));
        thatDefinition.logics.forEach((logic: { name: string }) => {
            const newName = uniqueInMap(logic.name, thisLogicKeys);
            if (newName !== logic.name)
                replacements['logic'][logic.name] = newName;
            thisDefinition.logics.push(Object.assign(logic, {
                name: newName,
            }));
        });

        this.definition = JSON.stringify(thisDefinition) + '\n';

        return replacements;
    }

    extend(mode: VueFileExtendMode, fullPath: string, fromPath: string) {
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
            vueObject = $js.variables().get((exportDefault.node as babel.types.Identifier).name);
        if (!vueObject.is('object'))
            throw new TypeError('Cannot find Vue object!');

        const extendsName = vueObject.get('extends').name();

        // $js.imports()
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

    /**
     * 从代码创建临时的 VueFile 文件
     * 相关于跳过 preOpen 和 open 阶段，但路径是虚拟的
     * @param code 代码
     */
    static from(code: string, fileName: string = 'temp.vue') {
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
