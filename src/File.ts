import * as fs from 'fs-extra';
import FSEntry from './FSEntry';

export default class File extends FSEntry {
    content: Buffer;

    constructor(fullPath: string) {
        super(fullPath, false);

        this.content = undefined;
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

        this.content = await fs.readFile(this.fullPath);
    }
}
