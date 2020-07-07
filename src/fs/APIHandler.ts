import * as fs from 'fs-extra';
import * as path from 'path';
import * as YAML from 'yaml';
import * as utils from '../utils';
import MarkdownIt = require('markdown-it');
import uslug = require('uslug');
const uslugify = (s: string) => uslug(s);

/**
 * 此 API 为了在 vusion、vue-cli-plugin-vusion 和 @vusion/doc-loader 三者之间共用
 * 所以需要提取到 vusion-api 中
 */

function escape(name: string = '') {
    if (typeof name !== 'string')
        name = String(name);
    return name.replace(/\\?([[\]<>|])/g, '\\$1');
}

function formatValue(type: string, value: string) {
    if (value === null || value === undefined) {
        return '';
    } else if (Array.isArray(value))
        return `\`[${escape(value.join(', '))}]\``;
    else if (typeof value === 'string') {
        return `\`'${escape(value)}'\``;
    } else
        return `\`${value}\``;
}

export interface OptionAPI {
    name: string;
    type: string;
    default?: any;
    description?: string;
}

export interface AttrAPI {
    name: string;
    sync?: boolean;
    model?: boolean;
    type: string;
    options?: Array<any>;
    default?: any;
    description?: string;
}

export interface ComputedAPI {
    name: string;
    type: string;
    description?: string;
}

export interface DataAPI {
    name: string;
    type: string;
    default?: any;
    description?: string;
}

export interface SlotAPI {
    name: string;
    type: string;
    default?: any;
    description?: string;
    props?: Array<{ name: string, type: string; description?: string }>;
}

export interface EventAPI {
    name: string;
    description?: string;
    params?: Array<{ name: string, type: string; description?: string }>;
}

export interface MethodAPI {
    name: string;
    type: string;
    default?: any;
    description?: string;
    params?: Array<{ name: string, type: string; default?: string, description?: string }>;
}

export interface AriaAPI {
    key: string;
    description?: string;
}

export interface ComponentAPI {
    name: string;
    title?: string;
    labels: Array<string>;
    description?: string;
    docs?: { [name: string]: string };
    options?: Array<OptionAPI>;
    attrs?: Array<AttrAPI>;
    data?: Array<DataAPI>;
    computed?: Array<ComputedAPI>;
    slots?: Array<SlotAPI>;
    events?: Array<EventAPI>;
    methods?: Array<MethodAPI>;
    aria?: Array<AriaAPI>;
}

export const enum ComponentAPISubtitle {
    options = 'Options',
    attrs = 'Props/Attrs',
    data = 'Data',
    computed = 'Computed',
    slots = 'Slots',
    events = 'Events',
    methods = 'Methods',
    globalMethods = 'Global Methods',
    aria = 'ARIA and Keyboard',
}

export interface TOCLink {
    title: string;
    href?: string;
    to?: string | { path?: string, hash?: string };
    development?: boolean;
    children?: Array<TOCLink>;
}

export interface VeturTag {
    attributes?: Array<string>;
    subtags?: Array<string>;
    defaults?: Array<string>;
    description?: string;
}

export interface VeturAttribute {
    version?: string;
    type?: string;
    options?: Array<string>;
    description?: string;
}

/**
 * 如何显示组件二级标题
 */
export enum APIShowTitle {
    /**
     * 需要时显示
     * 在有子组件的情况下才显示每个组件的完全标题
     */
    'as-needed' = 'as-needed',
    /**
     * 简化显示
     * 在有子组件的情况下显示每个组件的完全标题，在没有的时候只显示`API`的字样
     */
    'simplified' = 'simplified',
    /**
     * 总是显示完整标题
     */
    'always' = 'always',
}

/**
 * 处理组件 API 的类
 * 用于修改、保存，以及生成 Markdown 文档等功能
 */
export default class APIHandler {
    content: string;
    json: Array<ComponentAPI>;
    // json: ComponentAPI | Array<ComponentAPI>;
    fullPath: string;
    markdownIt: MarkdownIt;

    constructor(content: string = '', fullPath: string) {
        this.fullPath = fullPath;
        this.content = content;
        this.json = this.parse(content);
        this.markdownIt = new MarkdownIt({
            html: true,
            langPrefix: 'lang-',
        });
    }

    /**
     * 解析 api.yaml 的内容
     * @param content api.yaml 的文件内容
     */
    parse(content: string) {
        try {
            return YAML.parse(content);
        } catch(e) {
            console.error(this.fullPath);
            console.error(e);
        }
    }

    /**
     * 将处理类中的 json 对象重新转回 YAML 文件
     */
    generate() {
        return YAML.stringify(this.json);
    }

    /**
     * 将 API 中的 options 列表转换成 Markdown
     * @param options
     */
    markdownOptions(options: Array<OptionAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.options);
        outputs.push('');
        outputs.push('| Option | Type | Default | Description |');
        outputs.push('| ------ | ---- | ------- | ----------- |');

        options.forEach((option) => {
            outputs.push(`| ${option.name} | ${escape(option.type)} | ${formatValue(option.type, option.default)} | ${option.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 attrs 列表转换成 Markdown
     * @param attrs
     */
    markdownAttrs(attrs: Array<AttrAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.attrs);
        outputs.push('');
        outputs.push('| Prop/Attr | Type | Options | Default | Description |');
        outputs.push('| --------- | ---- | ------- | ------- | ----------- |');

        attrs.forEach((attr) => {
            let name = attr.name;
            if (attr.sync)
                name += '.sync';
            if (attr.model)
                name += ', v-model';
            outputs.push(`| ${name} | ${escape(attr.type)} | ${attr.options ? attr.options.map((option) => formatValue(attr.type, option)).join(', ') : ''} | ${formatValue(attr.type, attr.default)} | ${attr.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 data 列表转换成 Markdown
     * @param data
     */
    markdownData(data: Array<DataAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.data);
        outputs.push('');
        outputs.push('| Data | Type | Default | Description |');
        outputs.push('| ---- | ---- | ------- | ----------- |');

        data.forEach((item) => {
            outputs.push(`| ${item.name} | ${escape(item.type)} | ${formatValue(item.type, item.default)} | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 computed 列表转换成 Markdown
     * @param computed
     */
    markdownComputed(computed: Array<ComputedAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.computed);
        outputs.push('');
        outputs.push('| Computed | Type | Description |');
        outputs.push('| -------- | ---- | ----------- |');

        computed.forEach((item) => {
            outputs.push(`| ${item.name} | ${escape(item.type)} | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 slots 列表转换成 Markdown
     * @param slots
     */
    markdownSlots(slots: Array<SlotAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.slots);
        outputs.push('');

        slots.forEach((slot) => {
            outputs.push('#### ' + (slot.name === 'default' ? '(default)' : slot.name));
            outputs.push('');
            outputs.push(slot.description);
            outputs.push('');

            if (slot.props) {
                outputs.push('| Prop | Type | Description |');
                outputs.push('| ---- | ---- | ----------- |');

                slot.props.forEach((prop) => {
                    outputs.push(`| ${prop.name} | ${escape(prop.type)} | ${prop.description} |`);
                });
                outputs.push('');
            }
        });

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 events 列表转换成 Markdown
     * @param events
     */
    markdownEvents(events: Array<EventAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.events);
        outputs.push('');

        events.forEach((event) => {
            outputs.push('#### @' + (event.name));
            outputs.push('');
            outputs.push(event.description);
            outputs.push('');

            if (event.params) {
                outputs.push('| Param | Type | Description |');
                outputs.push('| ----- | ---- | ----------- |');

                event.params.forEach((param) => {
                    outputs.push(`| ${param.name} | ${escape(param.type)} | ${param.description} |`);
                });
                outputs.push('');
            }
        });

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 methods 列表转换成 Markdown
     * @param methods
     */
    markdownMethods(methods: Array<MethodAPI>, type?: string) {
        const outputs = [];

        outputs.push('### ' + type === 'global' ? ComponentAPISubtitle.globalMethods : ComponentAPISubtitle.methods);
        outputs.push('');

        methods.forEach((method) => {
            let methodName = method.name;
            if (!methodName.includes('(')) {
                methodName = `${method.name}(${(method.params || []).map((param) => param.name).join(', ')})`;
            }

            outputs.push('#### ' + methodName);
            outputs.push('');
            outputs.push(method.description);
            outputs.push('');

            if (method.params) {
                outputs.push('| Param | Type | Default | Description |');
                outputs.push('| ----- | ---- | ------- | ----------- |');

                method.params.forEach((param) => {
                    outputs.push(`| ${param.name} | ${escape(param.type)} | ${formatValue(param.type, param.default)} | ${param.description} |`);
                });
                outputs.push('');
            }
        });

        return outputs.join('\n');
    }

    /**
     * 将 API 中的 aria 列表转换成 Markdown
     * @param aria
     */
    markdownARIA(aria: Array<AriaAPI>) {
        const outputs = [];

        outputs.push('### ' + ComponentAPISubtitle.aria);
        outputs.push('');
        outputs.push('| Key | Description |');
        outputs.push('| --- | ----------- |');

        aria.forEach((item) => {
            outputs.push(`| <kdb>${item.key}</kdb> | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    /**
     * 将组件 API 转换成 Markdown
     * @param showTitle 如何显示组件二级标题
     */
    markdownAPI(showTitle: APIShowTitle = APIShowTitle['as-needed']) {
        const api = this.json;

        const outputs: Array<string> = [];

        api.forEach(({ name, options, attrs, data, computed, slots, events, methods, aria }) => {
            if (showTitle === APIShowTitle['as-needed'])
                api.length > 1 && outputs.push(`## ${utils.kebab2Camel(name)} API`);
            else if (showTitle === APIShowTitle.simplified)
                outputs.push(api.length > 1 ? `## ${utils.kebab2Camel(name)} API` : '## API');
            else if (showTitle === APIShowTitle.always)
                outputs.push(`## ${utils.kebab2Camel(name)} API`);

            if (!(options || attrs || data || computed || slots || events || methods || aria)) {
                outputs.push('');
                outputs.push('暂无');
                // outputs.push('');
            } else {
                options && outputs.push(this.markdownOptions(options));
                attrs && outputs.push(this.markdownAttrs(attrs));
                data && outputs.push(this.markdownData(data));
                computed && outputs.push(this.markdownComputed(computed));
                slots && outputs.push(this.markdownSlots(slots));
                events && outputs.push(this.markdownEvents(events));
                methods && outputs.push(this.markdownMethods(methods));
                aria && outputs.push(this.markdownARIA(aria));
            }
        });

        return outputs.join('\n');
    };

    getTOCFromAPI(showTitle: APIShowTitle = APIShowTitle['simplified']) {
        const api = this.json;

        const tocLinks: Array<TOCLink> = [];

        api.forEach(({ name, options, attrs, data, computed, slots, events, methods, aria }) => {
            // if (showTitle === APIShowTitle['as-needed']) {
            //     const title = `${utils.kebab2Camel(name)} API`;
            //     api.length > 1 && tocLinks.push({ title, to: { hash: '#' + uslugify(title) }, children: [] });
            // }
            let parentLink: TOCLink;
            if (showTitle === APIShowTitle.simplified) {
                const title = api.length > 1 ? `${utils.kebab2Camel(name)} API` : 'API';
                parentLink = { title, to: { path: 'api', hash: api.length > 1 ? '#' + uslugify(title) : '' }, children: [] };
                tocLinks.push(parentLink);
            }
            else if (showTitle === APIShowTitle.always) {
                const title = `## ${utils.kebab2Camel(name)} API`;
                parentLink = { title, to: { path: 'api', hash: '#' + uslugify(title) }, children: [] };
                tocLinks.push(parentLink);
            }

            options && parentLink.children.push({ title: ComponentAPISubtitle.options, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.options) } });
            attrs && parentLink.children.push({ title: ComponentAPISubtitle.attrs, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.attrs) } });
            data && parentLink.children.push({ title: ComponentAPISubtitle.data, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.data) } });
            computed && parentLink.children.push({ title: ComponentAPISubtitle.computed, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.computed) } });
            slots && parentLink.children.push({ title: ComponentAPISubtitle.slots, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.slots) } });
            events && parentLink.children.push({ title: ComponentAPISubtitle.events, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.events) } });
            methods && parentLink.children.push({ title: ComponentAPISubtitle.methods, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.methods) } });
            aria && parentLink.children.push({ title: ComponentAPISubtitle.aria, to: { path: 'api', hash: '#' + uslugify(ComponentAPISubtitle.aria) } });
        });

        return tocLinks;
    }

    getTOCFromContent(content: string, to?: string, options = { maxLevel: 3, minLevel: 3 }) {
        const tocLinks: Array<TOCLink> = [];

        const tokens = this.markdownIt.parse(content, {});
        tokens.forEach((token, index) => {
            if (token.type !== 'heading_close')
                return;
            const inline = tokens[index - 1];
            if (!(inline && inline.type === 'inline'))
                return;
            let level = +token.tag.slice(1);
            if (level < options.maxLevel || level > options.minLevel)
                return;

            const title = inline.content.trim();
            const link = { title, to: { path: to, hash: '#' + uslugify(title) } };

            let parentLink: TOCLink = { title: '', children: tocLinks };
            while (parentLink && level > options.maxLevel) {
                parentLink = parentLink.children[parentLink.children.length - 1];
                parentLink && (parentLink.children = parentLink.children || []);
                level--;
            }
            parentLink && parentLink.children.push(link);
        });

        return tocLinks;
    }

    async getTOCFromFile(fullPath: string, to?: string, options = { maxLevel: 3, minLevel: 3 }) {
        const content = await fs.readFile(fullPath, 'utf8');
        return this.getTOCFromContent(content, to, options);
    }

    /**
     * 由目录链接树转换成 Markdown
     * 添加 link 时的去重操作不太方便，所以在这里操作
     */
    markdownTOC(tocLinks: Array<TOCLink>, vue: boolean = false, level: number = 0, toHashMap: Map<string, true> = new Map()) {
        const indent = (l: number) => ' '.repeat(l * 4);
        const unique = ({ path, hash }: { path?: string, hash?: string }) => {
            let uniq = `${path}${hash}`;
            let i = 2;
            while (toHashMap.has(uniq))
                uniq = `${path}${hash}-${i++}`;
            toHashMap.set(uniq, true);
            return uniq.slice(String(path).length);
        }
        const outputs = [];

        if (vue) {
            level === 0 && outputs.push(`<u-toc>`);
            tocLinks.forEach((link) => {
                if (typeof link.to === 'object')
                    link.to.hash = unique(link.to);
                const start = indent(level + 1) + `<u-toc-item${ link.development ? ' v-if="NODE_ENV === \'development\'"' : ''} label="${link.title}" ${typeof link.to === 'object' ? ':to=\'' + JSON.stringify(link.to) + '\'' : 'to="' + link.to + '"'}>`;
                if (link.children && link.children.length) {
                    outputs.push(start);
                    outputs.push(this.markdownTOC(link.children, vue, level + 1, toHashMap));
                    outputs.push(indent(level + 1) + '</u-toc-item>');
                } else {
                    outputs.push(start + '</u-toc-item>');
                }
            });
            level === 0 && outputs.push(indent(level) + '</u-toc>');
        } else {
            tocLinks.forEach((link) => {
                if (typeof link.to === 'object')
                    link.to.hash = unique(link.to);
                outputs.push(indent(level) + `- [${link.title}](${typeof link.to === 'object' ? link.to.hash : '#' + link.to})`);
                link.children && outputs.push(this.markdownTOC(link.children, vue, level + 1, toHashMap));
            });
        }

        return outputs.join('\n');
    }

    /**
     * 生成多页面组件的顶级页面
     * 会读取组件目录下的 docs 子文档
     */
    async markdownIndex() {
        const docsDir = path.join(this.fullPath, '../docs');
        let docs: Array<string> = [];
        if (fs.existsSync(docsDir))
            docs = await fs.readdir(docsDir);

        const api = this.json;

        /**
         * 最终 Markdown 输出
         */
        const outputs: Array<string> = [];
        /**
         * 生成文档目录
         * 从二级标题开始
         */
        const tocRoot: Array<TOCLink> = [];
        const addSubdoc = async (fileName: string, title: string, to: string, development = false) => {
            const tocLinks = await this.getTOCFromFile(path.resolve(docsDir, fileName), to);
            const link: TOCLink = { title, to, development, children: tocLinks };
            tocRoot.push(link);
            outputs.push(`    <u-h2-tab${ development ? ' v-if="NODE_ENV === \'development\'"' : ''} title="${title}" to="${to}"></u-h2-tab>`);
        }
        /**
         * API 中的主组件
         */
        const mainComponent = api[0];

        // Title
        outputs.push(`<!-- 该 README.md 根据 api.yaml 和 docs/*.md 自动生成，为了方便在 GitHub 和 NPM 上查阅。如需修改，请查看源文件 -->`);
        outputs.push('');
        outputs.push(`# ${utils.kebab2Camel(mainComponent.name)}${mainComponent.title ? ' ' + mainComponent.title : ''}`);
        outputs.push('');

        if (mainComponent.labels) {
            outputs.push(`<s-component-labels :labels='${JSON.stringify(mainComponent.labels)}'></s-component-labels>`);
            outputs.push('');
        }

        if (mainComponent.description) {
            outputs.push(mainComponent.description);
            outputs.push('');
        }

        if (docs.includes('index.md')) {
            const indexPath = path.join(docsDir, 'index.md');
            const indexContent = await fs.readFile(indexPath, 'utf8');
            outputs.push(indexContent);
            const tocLinks = await this.getTOCFromContent(indexContent);
            tocLinks.length && tocRoot.push({ title: '概述', children: tocLinks });
        }

        outputs.push(`<u-h2-tabs router>`);
        if (docs.includes('examples.md'))
            await addSubdoc('examples.md', '基础示例', 'examples');

        if (docs.includes('setup.md'))
            await addSubdoc('setup.md', '安装配置', 'setup');

        if (mainComponent.docs) {
            const names = Object.keys(mainComponent.docs);
            for (const name of names) {
                if (docs.includes(name + '.md'))
                    await addSubdoc(name + '.md', mainComponent.docs[name], name);
            }
        }

        if (docs.includes('blocks.md'))
            await addSubdoc('blocks.md', '内置区块', 'blocks', true);

        if (docs.includes('cases.md'))
            await addSubdoc('cases.md', '测试用例', 'cases', true);

        if (docs.includes('faq.md'))
            await addSubdoc('faq.md', '常见问题', 'faq');

        {
            const link: TOCLink = { title: 'API', to: 'api' };
            tocRoot.push(...this.getTOCFromAPI());
            outputs.push(`    <u-h2-tab title="${link.title}" to="${link.to}"></u-h2-tab>`);
        }

        const changelogPath = path.resolve(this.fullPath, '../CHANGELOG.md');
        if (fs.existsSync(changelogPath)) {
            const link: TOCLink = { title: '更新日志', to: 'changelog' };
            tocRoot.push(link);
            outputs.push(`    <u-h2-tab title="${link.title}" to="${link.to}"></u-h2-tab>`);
        }

        outputs.push(`</u-h2-tabs>`);

        outputs.push('<router-view></router-view>');

        // 插入目录
        outputs.splice(4, 0, this.markdownTOC(tocRoot, true), '');

        return outputs.join('\n') + '\n';
    };

    async markdown() {
        const docsDir = path.join(this.fullPath, '../docs');
        let docs: Array<string> = [];
        if (fs.existsSync(docsDir))
            docs = await fs.readdir(docsDir);

        const api = this.json;

        /**
         * 最终 Markdown 输出
         */
        const outputs: Array<string> = [];
        /**
         * 生成文档目录
         * 从二级标题开始
         */
        const tocRoot: Array<TOCLink> = [];
        const addSubdoc = async (fileName: string, title: string) => {
            const filePath = path.resolve(docsDir, fileName);
            const content = await fs.readFile(filePath, 'utf8');
            outputs.push('## ' + title);
            outputs.push(content);
            const tocLinks = this.getTOCFromContent(content);
            const link: TOCLink = { title, to: uslugify(title), children: tocLinks };
            tocRoot.push(link);
        }
        /**
         * API 中的主组件
         */
        const mainComponent = api[0];

        // Title
        outputs.push(`<!-- 该 README.md 根据 api.yaml 和 docs/*.md 自动生成，为了方便在 GitHub 和 NPM 上查阅。如需修改，请查看源文件 -->`);
        outputs.push('');
        outputs.push(`# ${utils.kebab2Camel(mainComponent.name)}${mainComponent.title ? ' ' + mainComponent.title : ''}`);
        outputs.push('');

        if (mainComponent.labels) {
            outputs.push(mainComponent.labels.map((label) => `**${label}**`).join(', '));
            outputs.push('');
        }

        if (mainComponent.description) {
            outputs.push(mainComponent.description);
            outputs.push('');
        }

        if (docs.includes('index.md')) {
            const indexPath = path.join(docsDir, 'index.md');
            const indexContent = await fs.readFile(indexPath, 'utf8');
            outputs.push(indexContent);
            const tocLinks = await this.getTOCFromContent(indexContent);
            tocLinks.length && tocRoot.push({ title: '概述', children: tocLinks });
        }

        if (docs.includes('setup.md'))
            await addSubdoc('setup.md', '安装配置');

        if (docs.includes('examples.md'))
            await addSubdoc('examples.md', !mainComponent.docs ? '示例' : '基础示例');

        if (mainComponent.docs) {
            const names = Object.keys(mainComponent.docs);
            for (const name of names) {
                if (docs.includes(name + '.md'))
                    await addSubdoc(name + '.md', mainComponent.docs[name]);
            }
        }

        if (docs.includes('faq.md'))
            await addSubdoc('faq.md', '常见问题');

        outputs.push(this.markdownAPI(APIShowTitle.simplified));
        tocRoot.push(...this.getTOCFromAPI());

        // 插入目录
        outputs.splice(4, 0, this.markdownTOC(tocRoot), '');

        return outputs.join('\n') + '\n';
    };

    toVetur() {
        const api = this.json;

        const vetur: {
            tags: { [name: string]: VeturTag },
            attributes: { [name: string]: VeturAttribute },
        } = {
            tags: {},
            attributes: {},
        };

        api.forEach((component, index) => {
            const veturTag: VeturTag = {
                attributes: [],
                description: component.description,
            }

            let hasVModel = false;
            if (component.attrs) {
                component.attrs.forEach((attr) => {
                    if (attr.name.startsWith('**'))
                        return;
                    const attrName = attr.name.split(/,\s+/g)[0].replace(/\.sync/, '');
                    if (attr.name.includes('v-model'))
                        hasVModel = true;

                    veturTag.attributes.push(attrName);

                    const veturAttribute: VeturAttribute = {
                        type: attr.type,
                        options: attr.options,
                        description: attr.description,
                    };
                    vetur.attributes[`${component.name}/${attrName}`] = veturAttribute;
                });
            }

            if (hasVModel)
                veturTag.defaults = ['v-model'];

            // @TODO: subsubComponent
            if (index === 0 && api.length > 1)
                veturTag.subtags = api.slice(1).map((sub) => sub.name);

            // @TODO: defaults

            vetur.tags[component.name] = veturTag;
        });

        return vetur;
    }
}
