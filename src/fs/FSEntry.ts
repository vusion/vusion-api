import * as fs from 'fs-extra';
import * as path from 'path';
import * as chokidar from 'chokidar';

const _caches: Map<string, FSEntry> = new Map(); // 文件缓存

export default class FSEntry {
    fullPath: string; // 完整路径
    fileName: string; // 完整的文件名
    // fileType:
    baseName: string; // 不带扩展名的文件名
    extName: string; // 扩展名，带`.`
    title: string; // 标题，用于显示的名称
    isDirectory: boolean; // 是否为文件夹。部分子类需要在`preopen`之后才是准确的判断
    isVue: boolean; //
    isOpen: boolean; // 是否已经打开
    // isParsed: boolean; // 是否已经解析
    isSaving: boolean; // 是否正在保存
    isWatched: boolean; // 是否监听变更
    _changeListeners: Array<Function>;
    _miniChangeListeners: Array<Function>;

    constructor(fullPath: string, isDirectory: boolean = false) {
        this.fullPath = fullPath;
        this.fileName = path.basename(fullPath);
        this.extName = path.extname(this.fileName);
        this.baseName = path.basename(this.fileName, this.extName);
        this.title = this.baseName;
        this.isDirectory = isDirectory;
        this.isVue = false;
        this.isOpen = false;
        // this.isParsed = false;
        this.isSaving = false;
        this._changeListeners = [];
        this._miniChangeListeners = [];
    }

    open() {
        if (this.isOpen)
            return;
        return this.forceOpen();
    }

    forceOpen() {
        this.close();
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    save() {
        this.isSaving = true;
        setTimeout(() => this.isSaving = false, 1200); // 避免自身保存引发 watch
    }

    async onMiniChange(event: string, filePath: string, key?: string, hash?: string) {
        console.log('[vusion-api] onMiniChange:', event, filePath, key, hash);
        if (this.isOpen && fs.existsSync(this.fullPath))
            await this.forceOpen();
        // @TODO: if (this.isParsed)
        this._miniChangeListeners.forEach((listener) => listener(event, filePath, this));
    }

    onChange(event: string, filePath: string, key?: string, hash?: string) {
        this._changeListeners.forEach((listener) => listener(event, filePath, this));
    }

    addEventListener(eventName: string, listener: Function) {
        let listeners;
        if (eventName === 'change')
            listeners = this._changeListeners;
        else if (eventName === 'mini-change')
            listeners = this._miniChangeListeners;
        else
            throw new TypeError('Unknown eventName ' + eventName);

        listeners.push(listener);
    }

    removeEventListener(eventName: string, listener: Function) {
        let listeners;
        if (eventName === 'change')
            listeners = this._changeListeners;
        else if (eventName === 'mini-change')
            listeners = this._miniChangeListeners;
        else
            throw new TypeError('Unknown eventName ' + eventName);

        const index = listeners.indexOf(listener);
        ~index && listeners.splice(index, 1);
    }

    /**
     * 缓存获取
     * @param fullPath
     * @param args
     */
    static fetch(fullPath: string, ...args: any[]) {
        // this.name 是 constructor 的 name
        const key = this.name + '-' + fullPath;
        if (_caches.has(key))
            return _caches.get(key);
        else {
            const fsEntry = new this(fullPath, ...args);
            fsEntry.isWatched = true;
            _caches.set(key, fsEntry);

            const hash = new Date().toJSON();

            const fsWatch = chokidar.watch(fullPath, {
                ignored: [path.join(fullPath, 'node_modules/**'), path.join(fullPath, '.git/**')],
                ignoreInitial: true,
                followSymlinks: false,
                depth: 1,
            }).on('all', async (event, filePath) => {
                if (fsEntry.isSaving)
                    return;
                if (!_caches.has(key))
                    fsWatch.unwatch(fullPath);

                // 触发 forceOpen 的 miniChange
                if (filePath === fullPath) {
                    // Remove directory or file
                    if (event === 'unlink' || event === 'unlinkDir') {
                        _caches.delete(key);
                        fsWatch.unwatch(fullPath);
                    } else
                        await fsEntry.onMiniChange(event, filePath, key, hash);
                } else {
                    if (fsEntry.isVue)
                        await fsEntry.onMiniChange(event, filePath, key, hash);
                    else {
                        const relativePath = path.relative(fullPath, filePath);
                        if (relativePath.includes('/'))
                            return fsEntry.onChange(event, filePath, key, hash);
                        else if (event !== 'change')
                            await fsEntry.onMiniChange(event, filePath, key, hash);
                    }
                }

                return fsEntry.onChange(event, filePath, key, hash);
            });

            return fsEntry;
        }
    }
}
