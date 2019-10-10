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

    async forceOpen() {
        this.close();
        await this.load();
        this.isOpen = true;
    }

    close() {
        this.children = undefined;
        this.isOpen = false;
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

            let fsEntry: FSEntry;
            if (this.isWatched)
                fsEntry = isDirectory ? Directory.fetch(fullPath) : File.fetch(fullPath);
            else
                fsEntry = isDirectory ? new Directory(fullPath) : new File(fullPath);
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

    async find(relativePath: string, openIfNotLoaded: boolean = false): Promise<FSEntry> {
        if (!this.children) {
            if (openIfNotLoaded)
                await this.open();
            else
                return;
        }

        relativePath = path.normalize(relativePath);
        const arr = relativePath.split(path.sep);
        const next = arr[0];
        if (!next)
            throw new Error('Starting root / is not allowed!');

        const nextEntry = this.children.find((fsEntry) => fsEntry.fileName === next);
        if (arr.length === 0)
            throw new Error('Error path: ' + relativePath);
        else if (arr.length === 1)
            return nextEntry;
        else if (!nextEntry.isDirectory)
            throw new Error('Not a directory: ' + nextEntry.fullPath);
        else
            return (nextEntry as Directory).find(arr.slice(1).join(path.sep), openIfNotLoaded);
    }

    static fetch(fullPath: string) {
        return super.fetch(fullPath) as Directory;
    }
}
