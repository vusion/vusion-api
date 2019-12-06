import * as fs from 'fs-extra';
import * as path from 'path';

import FSEntry from './FSEntry';
import VueFile from './VueFile';

export enum ViewType {
    root = 'root',
    page = 'page',
    module = 'module',
    wrapper = 'wrapper',
    vue = 'vue',
}

export default class View extends FSEntry {
    viewType: ViewType;
    viewsPath: string;
    parent: View;
    children: View[];
    // vueFile: VueFile;
    routePath: string;
    vueFilePath: string;

    constructor(fullPath: string, viewType: ViewType = ViewType.wrapper, isDirectory: boolean = true) {
        super(fullPath, isDirectory);

        this.viewType = viewType;
        this.routePath = '';
    }

    /**
     * 提前检测 View 文件类型，以及子 View 等
     * 需要异步，否则可能会比较慢
     */
    async preOpen() {
        this.viewsPath = this.fullPath;
        const viewsPath = path.join(this.viewsPath, 'views');
        if (fs.existsSync(viewsPath))
            this.viewsPath = viewsPath;

        if (this.viewType === ViewType.root) {
            this.routePath = '/';
        } else if (this.viewType === ViewType.page) {
            this.vueFilePath = path.join(this.viewsPath, 'index.vue');
            this.routePath = this.parent.routePath + this.baseName + '#/';
        } else if (this.viewType === ViewType.module) {
            this.vueFilePath = path.join(this.viewsPath, 'index.vue');
            this.routePath = this.parent.routePath + this.baseName + '/';
        } else if (this.viewType === ViewType.wrapper) {
            this.vueFilePath = path.join(this.viewsPath, 'index.vue');
            this.routePath = this.parent.routePath + this.baseName + '/';
        } else {
            this.vueFilePath = this.fullPath;
            this.routePath = this.parent.routePath + this.baseName;
        }
        // this.alias = await this.readTitleInReadme();
    }


    async forceOpen() {
        this.close();
        await this.preOpen();
        await this.load();
        this.isOpen = true;
    }

    close() {
        // this.alias = undefined;
        this.children = undefined;

        this.isOpen = false;
    }

    protected async load() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}`);

        if (this.viewType === ViewType.vue) // 没有打开的必要了
            return;

        const children: Array<View> = [];

        const fileNames = await fs.readdir(this.viewsPath);
        fileNames.forEach((name) => {
            const fullPath = path.join(this.viewsPath, name);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            if (!isDirectory && !name.endsWith('.vue'))
                return;
            if (name === '.DS_Store' || name === '.git')
                return;
            if (this.viewType !== ViewType.vue && name === 'index.vue')
                return;

            let view: View = new View(fullPath, ViewType.wrapper, isDirectory);
            // if (this.isWatched)
            //     view = View.fetch(fullPath);
            // else
            if (fullPath.endsWith('.vue'))
                view.viewType = ViewType.vue;
            else if (this.viewType === ViewType.root)
                view.viewType = ViewType.page;
            else if (this.viewType === ViewType.page && fileNames.includes('modules.js'))
                view.viewType = ViewType.module;

            view.parent = this;
            // view.isChild = true;

            children.push(view);
        });

        children.sort((a, b) => {
            if (a.isDirectory === b.isDirectory)
                return a.fileName.localeCompare(b.fileName);
            else
                return a.isDirectory ? -1 : 1;
        });

        return this.children = children;
    }

    static fetch(fullPath: string) {
        return super.fetch(fullPath) as View;
    }
}
