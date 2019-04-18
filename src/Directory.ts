import * as fs from 'fs-extra';
import * as path from 'path';
import FSObject from './FSObject';
import File from './File';

export default class Directory extends FSObject {
    children: FSObject[];

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
            const stats = fs.statSync(fullPath);

            const fsObject = stats.isDirectory() ? new Directory(fullPath) : new File(fullPath);
            this.children.push(fsObject);
        });

        this.children.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) {
                if (a.fileName === b.fileName)
                    return 0;
                else
                    return a.fileName < b.fileName ? -1 : 1;
            } else
                return a.isDirectory ? -1 : 1;
        });
    }
}
