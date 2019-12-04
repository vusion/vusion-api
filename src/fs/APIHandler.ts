import * as fs from 'fs-extra';
import * as path from 'path';
import * as YAML from 'yaml';
import * as utils from '../utils';

/**
 * 此 API 为了在 vusion、vue-cli-plugin-vusion 和 @vusion/doc-loader 三者之间共用
 * 所以需要提取到 vusion-api 中
 */

function escape(name: string = '') {
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

export enum MarkdownAPIShowTitle {
    'as-needed' = 'as-needed',
    'simplified' = 'simplified',
    'always' = 'always',
}

export default class APIHandler {
    content: string;
    json: Array<ComponentAPI>;
    // json: ComponentAPI | Array<ComponentAPI>;
    fullPath: string;

    constructor(content: string = '', fullPath: string) {
        this.fullPath = fullPath;
        this.content = content;
        this.json = this.parse(content);
    }

    parse(content: string) {
        try {
            return YAML.parse(content);
        } catch(e) {
            console.error(this.fullPath);
            console.error(e);
        }
    }

    generate() {
        return YAML.stringify(this.json);
    }

    markdownOptions(options: Array<OptionAPI>) {
        const outputs = [];

        outputs.push('### Options');
        outputs.push('');
        outputs.push('| Option | Type | Default | Description |');
        outputs.push('| ------ | ---- | ------- | ----------- |');

        options.forEach((option) => {
            outputs.push(`| ${option.name} | ${escape(option.type)} | ${formatValue(option.type, option.default)} | ${option.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    markdownAttrs(attrs: Array<AttrAPI>) {
        const outputs = [];

        outputs.push('### Props/Attrs');
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

    markdownData(data: Array<DataAPI>) {
        const outputs = [];

        outputs.push('### Data');
        outputs.push('');
        outputs.push('| Data | Type | Default | Description |');
        outputs.push('| ---- | ---- | ------- | ----------- |');

        data.forEach((item) => {
            outputs.push(`| ${item.name} | ${escape(item.type)} | ${formatValue(item.type, item.default)} | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    markdownComputed(computed: Array<ComputedAPI>) {
        const outputs = [];

        outputs.push('### Computed');
        outputs.push('');
        outputs.push('| Computed | Type | Description |');
        outputs.push('| -------- | ---- | ----------- |');

        computed.forEach((item) => {
            outputs.push(`| ${item.name} | ${escape(item.type)} | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    markdownSlots(slots: Array<SlotAPI>) {
        const outputs = [];

        outputs.push('### Slots');
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

    markdownEvents(events: Array<EventAPI>) {
        const outputs = [];

        outputs.push('### Events');
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

    markdownMethods(methods: Array<MethodAPI>, type?: string) {
        const outputs = [];

        outputs.push(`### ${type === 'global' ? 'Global ' : ''}Methods`);
        outputs.push('');

        methods.forEach((method) => {
            outputs.push('#### ' + (method.name));
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

    markdownARIA(aria: Array<AriaAPI>) {
        const outputs = [];

        outputs.push('### ARIA and Keyboard');
        outputs.push('');
        outputs.push('| Key | Description |');
        outputs.push('| --- | ----------- |');

        aria.forEach((item) => {
            outputs.push(`| ${item.key} | ${item.description} |`);
        });
        outputs.push('');

        return outputs.join('\n');
    }

    markdownAPI(showTitle: MarkdownAPIShowTitle = MarkdownAPIShowTitle['as-needed']) {
        const api = this.json;

        const outputs: Array<string> = [];

        api.forEach(({ name, options, attrs, data, computed, slots, events, methods, aria }) => {
            if (showTitle === MarkdownAPIShowTitle['as-needed'])
                api.length > 1 && outputs.push(`## ${utils.kebab2Camel(name)} API`);
            else if (showTitle === MarkdownAPIShowTitle.simplified)
                outputs.push(api.length > 1 ? `## ${utils.kebab2Camel(name)} API` : '## API');
            else if (showTitle === MarkdownAPIShowTitle.always)
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


    async markdownIndex() {
        const docsDir = path.join(this.fullPath, '../docs');
        let docs: Array<string> = [];
        if (fs.existsSync(docsDir))
            docs = await fs.readdir(docsDir);

        const api = this.json;

        const outputs: Array<string> = [];
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
            outputs.push(await fs.readFile(path.join(docsDir, 'index.md'), 'utf8'));
        }

        outputs.push(`<u-h2-tabs router>`);
        if (docs.includes('examples.md'))
            outputs.push(`<u-h2-tab title="基础示例" to="examples"></u-h2-tab>`);
        if (docs.includes('setup.md'))
            outputs.push(`<u-h2-tab title="安装配置" to="setup"></u-h2-tab>`);
        if (docs.includes('cases.md'))
            outputs.push(`<u-h2-tab v-if="NODE_ENV === \'development\'" title="测试用例" to="cases"></u-h2-tab>`);

        if (mainComponent.docs) {
            Object.keys(mainComponent.docs).forEach((name) => {
                if (docs.includes(name + '.md'))
                    outputs.push(`<u-h2-tab title="${mainComponent.docs[name]}" to="${name}"></u-h2-tab>`);
            });
        }

        if (docs.includes('faq.md'))
            outputs.push(`<u-h2-tab title="常见问题" to="faq"></u-h2-tab>`);

        outputs.push(`<u-h2-tab title="API" to="api"></u-h2-tab>`);
        outputs.push(`</u-h2-tabs>`);

        outputs.push('<router-view></router-view>');

        return outputs.join('\n');
    };

    async markdown() {
        const docsDir = path.join(this.fullPath, '../docs');
        let docs: Array<string> = [];
        if (fs.existsSync(docsDir))
            docs = await fs.readdir(docsDir);

        const api = this.json;

        const outputs: Array<string> = [];
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
            outputs.push(await fs.readFile(path.join(docsDir, 'index.md'), 'utf8'));
        }

        if (docs.includes('setup.md')) {
            outputs.push('## 安装配置');
            outputs.push(await fs.readFile(path.join(docsDir, 'setup.md'), 'utf8'));
        }

        if (docs.includes('examples.md')) {
            outputs.push(!mainComponent.docs ? `## 示例` : `## 基础示例`);
            outputs.push(await fs.readFile(path.join(docsDir, 'examples.md'), 'utf8'));
        }

        if (mainComponent.docs) {
            const names = Object.keys(mainComponent.docs);
            for (const name of names) {
                if (docs.includes(name + '.md')) {
                    outputs.push('## ' + mainComponent.docs[name]);
                    outputs.push(await fs.readFile(path.join(docsDir, name + '.md'), 'utf8'));
                }
            }
        }

        if (docs.includes('faq.md')) {
            outputs.push(`## 常见问题`);
            outputs.push(await fs.readFile(path.join(docsDir, 'faq.md'), 'utf8'));
        }

        outputs.push(this.markdownAPI(MarkdownAPIShowTitle.simplified));

        return outputs.join('\n');
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
