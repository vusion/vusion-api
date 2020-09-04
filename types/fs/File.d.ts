/// <reference types="node" />
import FSEntry from './FSEntry';
export default class File extends FSEntry {
    content: Buffer | string;
    constructor(fullPath: string);
    forceOpen(): Promise<void>;
    close(): void;
    protected load(): Promise<Buffer>;
    save(): Promise<void>;
    static fetch(fullPath: string): File;
}
