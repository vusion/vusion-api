import FSEntry from './FSEntry';
export declare enum ViewType {
    root = "root",
    entry = "entry",
    module = "module",
    branch = "branch",
    vue = "vue",
    md = "md"
}
export declare const KEYWORD_DIRS: string[];
export declare const HOLDER_DIRS: string[];
export default class View extends FSEntry {
    viewType: ViewType;
    viewsPath: string;
    parent: View;
    children: View[];
    routePath: string;
    vueFilePath: string;
    routeMeta: Object;
    constructor(fullPath: string, viewType?: ViewType, isDirectory?: boolean, routePath?: string);
    /**
     * 提前检测 View 文件类型，以及子 View 等
     * 需要异步，否则可能会比较慢
     */
    preOpen(): Promise<void>;
    forceOpen(): Promise<void>;
    close(): void;
    protected load(): Promise<View[]>;
    /**
     *
     * @param relativePath
     * @example rootView.find('dashboard')
     * @example rootView.find('dashboard/views/notice/detail.vue')
     */
    findByRealPath(relativePath: string, openIfNotLoaded?: boolean, alwaysFindOne?: boolean): Promise<View>;
    findByRoute(relativePath: string, openIfNotLoaded?: boolean): Promise<View>;
    static fetch(fullPath: string, viewType?: ViewType, isDirectory?: boolean): View;
}
