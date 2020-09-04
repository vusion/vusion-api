import FSEntry from './FSEntry';
export default class Directory extends FSEntry {
    children: Array<FSEntry>;
    constructor(fullPath: string);
    forceOpen(): Promise<void>;
    close(): void;
    protected load(): Promise<FSEntry[]>;
    find(relativePath: string, openIfNotLoaded?: boolean): Promise<FSEntry>;
    static fetch(fullPath: string): Directory;
}
