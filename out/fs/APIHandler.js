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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIShowTitle = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const YAML = __importStar(require("yaml"));
const utils = __importStar(require("../utils"));
const MarkdownIt = require("markdown-it");
const uslug = require("uslug");
const uslugify = (s) => uslug(s);
/**
 * 此 API 为了在 vusion、vue-cli-plugin-vusion 和 @vusion/doc-loader 三者之间共用
 * 所以需要提取到 vusion-api 中
 */
function escape(name = '') {
    if (typeof name !== 'string')
        name = String(name);
    return name.replace(/\\?([[\]<>|])/g, '\\$1');
}
function formatValue(type, value) {
    if (value === null || value === undefined) {
        return '';
    }
    else if (Array.isArray(value))
        return `\`[${escape(value.join(', '))}]\``;
    else if (typeof value === 'string') {
        return `\`'${escape(value)}'\``;
    }
    else if (value.name) {
        return `\`'${escape(value.name)}'\` (${escape(value.description)})`;
    }
    else
        return `\`${value}\``;
}
/**
 * 如何显示组件二级标题
 */
var APIShowTitle;
(function (APIShowTitle) {
    /**
     * 需要时显示
     * 在有子组件的情况下才显示每个组件的完全标题
     */
    APIShowTitle["as-needed"] = "as-needed";
    /**
     * 简化显示
     * 在有子组件的情况下显示每个组件的完全标题，在没有的时候只显示`API`的字样
     */
    APIShowTitle["simplified"] = "simplified";
    /**
     * 总是显示完整标题
     */
    APIShowTitle["always"] = "always";
})(APIShowTitle = exports.APIShowTitle || (exports.APIShowTitle = {}));
/**
 * 处理组件 API 的类
 * 用于修改、保存，以及生成 Markdown 文档等功能
 */
class APIHandler {
    constructor(content = '', fullPath) {
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
    parse(content) {
        try {
            return YAML.parse(content);
        }
        catch (e) {
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
    markdownOptions(options) {
        const outputs = [];
        outputs.push('### ' + "Options" /* options */);
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
    markdownAttrs(attrs) {
        const outputs = [];
        outputs.push('### ' + "Props/Attrs" /* attrs */);
        outputs.push('');
        outputs.push('| Prop/Attr | Type | Options | Default | Description |');
        outputs.push('| --------- | ---- | ------- | ------- | ----------- |');
        attrs.forEach((attr) => {
            let name = attr.name;
            if (attr.sync)
                name += '.sync';
            if (attr.model)
                name += ', v-model';
            outputs.push(`| ${name} | ${escape(attr.type)} | ${attr.options ? attr.options.map((option) => formatValue(attr.type, option)).join('<br/>') : ''} | ${formatValue(attr.type, attr.default)} | ${attr.description} |`);
        });
        outputs.push('');
        return outputs.join('\n');
    }
    /**
     * 将 API 中的 data 列表转换成 Markdown
     * @param data
     */
    markdownData(data) {
        const outputs = [];
        outputs.push('### ' + "Data" /* data */);
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
    markdownComputed(computed) {
        const outputs = [];
        outputs.push('### ' + "Computed" /* computed */);
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
    markdownSlots(slots) {
        const outputs = [];
        outputs.push('### ' + "Slots" /* slots */);
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
    markdownEvents(events) {
        const outputs = [];
        outputs.push('### ' + "Events" /* events */);
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
    markdownMethods(methods, type) {
        const outputs = [];
        outputs.push('### ' + type === 'global' ? "Global Methods" /* globalMethods */ : "Methods" /* methods */);
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
    markdownARIA(aria) {
        const outputs = [];
        outputs.push('### ' + "ARIA and Keyboard" /* aria */);
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
    markdownAPI(showTitle = APIShowTitle['as-needed']) {
        const api = this.json;
        const outputs = [];
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
            }
            else {
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
    }
    ;
    getTOCFromAPI(showTitle = APIShowTitle['simplified']) {
        const api = this.json;
        const tocLinks = [];
        api.forEach(({ name, options, attrs, data, computed, slots, events, methods, aria }) => {
            // if (showTitle === APIShowTitle['as-needed']) {
            //     const title = `${utils.kebab2Camel(name)} API`;
            //     api.length > 1 && tocLinks.push({ title, to: { hash: '#' + uslugify(title) }, children: [] });
            // }
            let parentLink;
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
            options && parentLink.children.push({ title: "Options" /* options */, to: { path: 'api', hash: '#' + uslugify("Options" /* options */) } });
            attrs && parentLink.children.push({ title: "Props/Attrs" /* attrs */, to: { path: 'api', hash: '#' + uslugify("Props/Attrs" /* attrs */) } });
            data && parentLink.children.push({ title: "Data" /* data */, to: { path: 'api', hash: '#' + uslugify("Data" /* data */) } });
            computed && parentLink.children.push({ title: "Computed" /* computed */, to: { path: 'api', hash: '#' + uslugify("Computed" /* computed */) } });
            slots && parentLink.children.push({ title: "Slots" /* slots */, to: { path: 'api', hash: '#' + uslugify("Slots" /* slots */) } });
            events && parentLink.children.push({ title: "Events" /* events */, to: { path: 'api', hash: '#' + uslugify("Events" /* events */) } });
            methods && parentLink.children.push({ title: "Methods" /* methods */, to: { path: 'api', hash: '#' + uslugify("Methods" /* methods */) } });
            aria && parentLink.children.push({ title: "ARIA and Keyboard" /* aria */, to: { path: 'api', hash: '#' + uslugify("ARIA and Keyboard" /* aria */) } });
        });
        return tocLinks;
    }
    getTOCFromContent(content, to, options = { maxLevel: 3, minLevel: 3 }) {
        const tocLinks = [];
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
            let parentLink = { title: '', children: tocLinks };
            while (parentLink && level > options.maxLevel) {
                parentLink = parentLink.children[parentLink.children.length - 1];
                parentLink && (parentLink.children = parentLink.children || []);
                level--;
            }
            parentLink && parentLink.children.push(link);
        });
        return tocLinks;
    }
    getTOCFromFile(fullPath, to, options = { maxLevel: 3, minLevel: 3 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield fs.readFile(fullPath, 'utf8');
            return this.getTOCFromContent(content, to, options);
        });
    }
    /**
     * 由目录链接树转换成 Markdown
     * 添加 link 时的去重操作不太方便，所以在这里操作
     */
    markdownTOC(tocLinks, vue = false, level = 0, toHashMap = new Map()) {
        const indent = (l) => ' '.repeat(l * 4);
        const unique = ({ path, hash }) => {
            let uniq = `${path}${hash}`;
            let i = 2;
            while (toHashMap.has(uniq))
                uniq = `${path}${hash}-${i++}`;
            toHashMap.set(uniq, true);
            return uniq.slice(String(path).length);
        };
        const outputs = [];
        if (vue) {
            level === 0 && outputs.push(`<u-toc>`);
            tocLinks.forEach((link) => {
                if (typeof link.to === 'object')
                    link.to.hash = unique(link.to);
                const start = indent(level + 1) + `<u-toc-item${link.development ? ' v-if="NODE_ENV === \'development\'"' : ''} label="${link.title}" ${typeof link.to === 'object' ? ':to=\'' + JSON.stringify(link.to) + '\'' : 'to="' + link.to + '"'}>`;
                if (link.children && link.children.length) {
                    outputs.push(start);
                    outputs.push(this.markdownTOC(link.children, vue, level + 1, toHashMap));
                    outputs.push(indent(level + 1) + '</u-toc-item>');
                }
                else {
                    outputs.push(start + '</u-toc-item>');
                }
            });
            level === 0 && outputs.push(indent(level) + '</u-toc>');
        }
        else {
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
    markdownIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const docsDir = path.join(this.fullPath, '../docs');
            let docs = [];
            if (fs.existsSync(docsDir))
                docs = yield fs.readdir(docsDir);
            const api = this.json;
            /**
             * 最终 Markdown 输出
             */
            const outputs = [];
            /**
             * 生成文档目录
             * 从二级标题开始
             */
            const tocRoot = [];
            const addSubdoc = (fileName, title, to, development = false) => __awaiter(this, void 0, void 0, function* () {
                const tocLinks = yield this.getTOCFromFile(path.resolve(docsDir, fileName), to);
                const link = { title, to, development, children: tocLinks };
                tocRoot.push(link);
                outputs.push(`    <u-h2-tab${development ? ' v-if="NODE_ENV === \'development\'"' : ''} title="${title}" to="${to}"></u-h2-tab>`);
            });
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
                const indexContent = yield fs.readFile(indexPath, 'utf8');
                outputs.push(indexContent);
                const tocLinks = yield this.getTOCFromContent(indexContent);
                tocLinks.length && tocRoot.push({ title: '概述', children: tocLinks });
            }
            outputs.push(`<u-h2-tabs router>`);
            if (docs.includes('examples.md'))
                yield addSubdoc('examples.md', '基础示例', 'examples');
            if (docs.includes('setup.md'))
                yield addSubdoc('setup.md', '安装配置', 'setup');
            if (mainComponent.docs) {
                const names = Object.keys(mainComponent.docs);
                for (const name of names) {
                    if (docs.includes(name + '.md'))
                        yield addSubdoc(name + '.md', mainComponent.docs[name], name);
                }
            }
            if (docs.includes('blocks.md'))
                yield addSubdoc('blocks.md', '内置区块', 'blocks', true);
            if (docs.includes('cases.md'))
                yield addSubdoc('cases.md', '测试用例', 'cases', true);
            if (docs.includes('faq.md'))
                yield addSubdoc('faq.md', '常见问题', 'faq');
            {
                const link = { title: 'API', to: 'api' };
                tocRoot.push(...this.getTOCFromAPI());
                outputs.push(`    <u-h2-tab title="${link.title}" to="${link.to}"></u-h2-tab>`);
            }
            const changelogPath = path.resolve(this.fullPath, '../CHANGELOG.md');
            if (fs.existsSync(changelogPath)) {
                const link = { title: '更新日志', to: 'changelog' };
                tocRoot.push(link);
                outputs.push(`    <u-h2-tab title="${link.title}" to="${link.to}"></u-h2-tab>`);
            }
            outputs.push(`</u-h2-tabs>`);
            outputs.push('<router-view></router-view>');
            // 插入目录
            outputs.splice(4, 0, this.markdownTOC(tocRoot, true), '');
            return outputs.join('\n') + '\n';
        });
    }
    ;
    markdown() {
        return __awaiter(this, void 0, void 0, function* () {
            const docsDir = path.join(this.fullPath, '../docs');
            let docs = [];
            if (fs.existsSync(docsDir))
                docs = yield fs.readdir(docsDir);
            const api = this.json;
            /**
             * 最终 Markdown 输出
             */
            const outputs = [];
            /**
             * 生成文档目录
             * 从二级标题开始
             */
            const tocRoot = [];
            const addSubdoc = (fileName, title) => __awaiter(this, void 0, void 0, function* () {
                const filePath = path.resolve(docsDir, fileName);
                const content = yield fs.readFile(filePath, 'utf8');
                outputs.push('## ' + title);
                outputs.push(content);
                const tocLinks = this.getTOCFromContent(content);
                const link = { title, to: uslugify(title), children: tocLinks };
                tocRoot.push(link);
            });
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
                const indexContent = yield fs.readFile(indexPath, 'utf8');
                outputs.push(indexContent);
                const tocLinks = yield this.getTOCFromContent(indexContent);
                tocLinks.length && tocRoot.push({ title: '概述', children: tocLinks });
            }
            if (docs.includes('setup.md'))
                yield addSubdoc('setup.md', '安装配置');
            if (docs.includes('examples.md'))
                yield addSubdoc('examples.md', !mainComponent.docs ? '示例' : '基础示例');
            if (mainComponent.docs) {
                const names = Object.keys(mainComponent.docs);
                for (const name of names) {
                    if (docs.includes(name + '.md'))
                        yield addSubdoc(name + '.md', mainComponent.docs[name]);
                }
            }
            if (docs.includes('faq.md'))
                yield addSubdoc('faq.md', '常见问题');
            outputs.push(this.markdownAPI(APIShowTitle.simplified));
            tocRoot.push(...this.getTOCFromAPI());
            // 插入目录
            outputs.splice(4, 0, this.markdownTOC(tocRoot), '');
            return outputs.join('\n') + '\n';
        });
    }
    ;
    toVetur() {
        const api = this.json;
        const vetur = {
            tags: {},
            attributes: {},
        };
        api.forEach((component, index) => {
            const veturTag = {
                attributes: [],
                description: component.description,
            };
            let hasVModel = false;
            if (component.attrs) {
                component.attrs.forEach((attr) => {
                    if (attr.name.startsWith('**'))
                        return;
                    const attrName = attr.name.split(/,\s+/g)[0].replace(/\.sync/, '');
                    if (attr.name.includes('v-model'))
                        hasVModel = true;
                    veturTag.attributes.push(attrName);
                    const veturAttribute = {
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
exports.default = APIHandler;
//# sourceMappingURL=APIHandler.js.map