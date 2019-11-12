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
    children: View[];
    vueFile: VueFile;

    constructor(fullPath: string, viewType: ViewType = ViewType.wrapper, isDirectory: boolean = true) {
        super(fullPath, isDirectory);

        this.viewType = viewType;
    }

    /**
     * 提前检测 View 文件类型，以及子 View 等
     * 需要异步，否则可能会比较慢
     */
    async preOpen() {
        // this.alias = await this.readTitleInReadme();
    }


    async forceOpen() {
        this.close();
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

        const children: Array<View> = [];
        this.viewsPath = this.fullPath;
        let fileNames = await fs.readdir(this.viewsPath);
        if (fileNames.includes('views')) {
            this.viewsPath = path.join(this.viewsPath, 'views');
            fileNames = await fs.readdir(this.viewsPath);
        }

        fileNames.forEach((name) => {
            const fullPath = path.join(this.viewsPath, name);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            if (!isDirectory && !name.endsWith('.vue'))
                return;
            if (name === '.DS_Store' || name === '.git')
                return;

            let view: View = new View(fullPath, ViewType.wrapper, isDirectory);
            // if (this.isWatched)
            //     view = View.fetch(fullPath);
            // else
            if (fullPath.endsWith('.vue'))
                view.viewType = ViewType.vue;
            else if (this.viewType === ViewType.root)
                view.viewType = ViewType.page;
            else if (fs.readdirSync(fullPath).includes('module'))
                view.viewType = ViewType.module;

            // view.parent = this;
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
