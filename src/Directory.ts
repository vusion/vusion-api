import * as fs from 'fs-extra';
import * as path from 'path';
import FSEntry from './FSEntry';
import File from './File';

export default class Directory extends FSEntry {
    // 子文件及文件夹，会先按文件类型再按文件名排序。
    // 为`undefined`表示未打开过，为数组表示已经打开。
    children: Array<FSEntry>;

    constructor(fullPath: string) {
        super(fullPath, true);
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
            throw new Error(`Cannot find: ${this.fullPath}`);

        const children: Array<FSEntry> = [];
        const fileNames = await fs.readdir(this.fullPath);

        fileNames.forEach((name) => {
            if (name === '.DS_Store' || name === '.git')
                return;

            const fullPath = path.join(this.fullPath, name);
            const isDirectory = fs.statSync(fullPath).isDirectory();

            const fsEntry = isDirectory ? new Directory(fullPath) : new File(fullPath);
            children.push(fsEntry);
        });

        children.sort((a, b) => {
            if (a.isDirectory === b.isDirectory)
                return a.fileName.localeCompare(b.fileName);
            else
                return a.isDirectory ? -1 : 1;
        });

        return this.children = children;
    }
}
