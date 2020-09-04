import * as chokidar from 'chokidar';
export default class FSEntry {
    fullPath: string;
    fileName: string;
    baseName: string;
    extName: string;
    title: string;
    isDirectory: boolean;
    isVue: boolean;
    isOpen: boolean;
    isSaving: boolean;
    isWatched: boolean;
    _changeListeners: Array<Function>;
    _miniChangeListeners: Array<Function>;
    constructor(fullPath: string, isDirectory?: boolean);
    open(): void | Promise<void>;
    forceOpen(): void | Promise<void>;
    close(): void;
    save(): void | Promise<void>;
    /**
     * 删除当前文件
     * 该操作只删除实际文件，不清空文件内容。因此可以再次 save。
     */
    remove(): Promise<void>;
    onMiniChange(event: string, filePath: string, key?: string, hash?: string): Promise<void>;
    onChange(event: string, filePath: string, key?: string, hash?: string): void;
    addEventListener(eventName: string, listener: Function): void;
    removeEventListener(eventName: string, listener: Function): void;
    watch(listener: (eventName: string, filePath: string) => void): chokidar.FSWatcher;
    /**
     * 缓存获取
     * @deprecated
     * @param fullPath
     * @param args
     */
    static fetch(fullPath: string, ...args: any[]): FSEntry;
}
