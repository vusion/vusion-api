import * as fs from 'fs-extra';
import FSEntry from './FSEntry';

export default class File extends FSEntry {
    // 原文件内容
    // 为`undefined`表示未打开过
    content: Buffer;

    constructor(fullPath: string) {
        super(fullPath, false);
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

        return this.content = await fs.readFile(this.fullPath);
    }
}
