import * as fs from 'fs-extra';
import FSEntry from './FSEntry';

export default class File extends FSEntry {
    // 原文件内容
    // 为`undefined`表示未打开过
    content: Buffer | string;

    constructor(fullPath: string) {
        super(fullPath, false);
    }

    async forceOpen(): Promise<void> {
        this.close();
        await this.load();
        this.isOpen = true;
    }

    close(): void {
        this.content = undefined;
        this.isOpen = false;
    }

    protected async load() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}`);

        return this.content = await fs.readFile(this.fullPath);
    }

    async save(): Promise<void> {
        this.isSaving = true;
        await fs.writeFile(this.fullPath, this.content !== undefined ? this.content : '');
        super.save();
    }

    static fetch(fullPath: string) {
        return super.fetch(fullPath) as File;
    }
}
