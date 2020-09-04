import * as MarkdownIt from 'markdown-it';
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
    props?: Array<{
        name: string;
        type: string;
        description?: string;
    }>;
}
export interface EventAPI {
    name: string;
    description?: string;
    params?: Array<{
        name: string;
        type: string;
        description?: string;
    }>;
}
export interface MethodAPI {
    name: string;
    type: string;
    default?: any;
    description?: string;
    params?: Array<{
        name: string;
        type: string;
        default?: string;
        description?: string;
    }>;
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
    docs?: {
        [name: string]: string;
    };
    options?: Array<OptionAPI>;
    attrs?: Array<AttrAPI>;
    data?: Array<DataAPI>;
    computed?: Array<ComputedAPI>;
    slots?: Array<SlotAPI>;
    events?: Array<EventAPI>;
    methods?: Array<MethodAPI>;
    aria?: Array<AriaAPI>;
}
export declare const enum ComponentAPISubtitle {
    options = "Options",
    attrs = "Props/Attrs",
    data = "Data",
    computed = "Computed",
    slots = "Slots",
    events = "Events",
    methods = "Methods",
    globalMethods = "Global Methods",
    aria = "ARIA and Keyboard"
}
export interface TOCLink {
    title: string;
    href?: string;
    to?: string | {
        path?: string;
        hash?: string;
    };
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
export declare enum APIShowTitle {
    /**
     * 需要时显示
     * 在有子组件的情况下才显示每个组件的完全标题
     */
    'as-needed' = "as-needed",
    /**
     * 简化显示
     * 在有子组件的情况下显示每个组件的完全标题，在没有的时候只显示`API`的字样
     */
    'simplified' = "simplified",
    /**
     * 总是显示完整标题
     */
    'always' = "always"
}
/**
 * 处理组件 API 的类
 * 用于修改、保存，以及生成 Markdown 文档等功能
 */
export default class APIHandler {
    content: string;
    json: Array<ComponentAPI>;
    fullPath: string;
    markdownIt: MarkdownIt;
    constructor(content: string, fullPath: string);
    /**
     * 解析 api.yaml 的内容
     * @param content api.yaml 的文件内容
     */
    parse(content: string): any;
    /**
     * 将处理类中的 json 对象重新转回 YAML 文件
     */
    generate(): string;
    /**
     * 将 API 中的 options 列表转换成 Markdown
     * @param options
     */
    markdownOptions(options: Array<OptionAPI>): string;
    /**
     * 将 API 中的 attrs 列表转换成 Markdown
     * @param attrs
     */
    markdownAttrs(attrs: Array<AttrAPI>): string;
    /**
     * 将 API 中的 data 列表转换成 Markdown
     * @param data
     */
    markdownData(data: Array<DataAPI>): string;
    /**
     * 将 API 中的 computed 列表转换成 Markdown
     * @param computed
     */
    markdownComputed(computed: Array<ComputedAPI>): string;
    /**
     * 将 API 中的 slots 列表转换成 Markdown
     * @param slots
     */
    markdownSlots(slots: Array<SlotAPI>): string;
    /**
     * 将 API 中的 events 列表转换成 Markdown
     * @param events
     */
    markdownEvents(events: Array<EventAPI>): string;
    /**
     * 将 API 中的 methods 列表转换成 Markdown
     * @param methods
     */
    markdownMethods(methods: Array<MethodAPI>, type?: string): string;
    /**
     * 将 API 中的 aria 列表转换成 Markdown
     * @param aria
     */
    markdownARIA(aria: Array<AriaAPI>): string;
    /**
     * 将组件 API 转换成 Markdown
     * @param showTitle 如何显示组件二级标题
     */
    markdownAPI(showTitle?: APIShowTitle): string;
    getTOCFromAPI(showTitle?: APIShowTitle): TOCLink[];
    getTOCFromContent(content: string, to?: string, options?: {
        maxLevel: number;
        minLevel: number;
    }): TOCLink[];
    getTOCFromFile(fullPath: string, to?: string, options?: {
        maxLevel: number;
        minLevel: number;
    }): Promise<TOCLink[]>;
    /**
     * 由目录链接树转换成 Markdown
     * 添加 link 时的去重操作不太方便，所以在这里操作
     */
    markdownTOC(tocLinks: Array<TOCLink>, vue?: boolean, level?: number, toHashMap?: Map<string, true>): string;
    /**
     * 生成多页面组件的顶级页面
     * 会读取组件目录下的 docs 子文档
     */
    markdownIndex(): Promise<string>;
    markdown(): Promise<string>;
    toVetur(): {
        tags: {
            [name: string]: VeturTag;
        };
        attributes: {
            [name: string]: VeturAttribute;
        };
    };
}
