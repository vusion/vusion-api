import * as fs from 'fs-extra';
import * as path from 'path';
import FSEntry from './FSEntry';
import File from './File';

export default class Directory extends FSEntry {
    children: FSEntry[];

    constructor(fullPath: string) {
        super(fullPath, true);

        this.children = [];
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

    async load() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}`);

        this.children = [];
        const fileNames = await fs.readdir(this.fullPath);

        fileNames.forEach((name) => {
            if (name === '.DS_Store' || name === '.git')
                return;

            const fullPath = path.join(this.fullPath, name);
            const isDirectory = fs.statSync(fullPath).isDirectory();

            const fsEntry = isDirectory ? new Directory(fullPath) : new File(fullPath);
            this.children.push(fsEntry);
        });

        this.children.sort((a, b) => {
            if (a.isDirectory === b.isDirectory)
                return a.fileName.localeCompare(b.fileName);
            else
                return a.isDirectory ? -1 : 1;
        });
    }
}
