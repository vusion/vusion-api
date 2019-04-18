import * as fs from 'fs-extra';
import FSObject from './FSObject';

export default class File extends FSObject {
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
