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
    _listeners: Array<Function>;

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
        this._listeners = [];
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

    async onChange(event: string, filePath: string, key?: string, hash?: string) {
        console.log('[vusion-api] onChange:', event, filePath, key, hash);
        if (this.isOpen && fs.existsSync(this.fullPath))
            await this.forceOpen();
        // @TODO: if (this.isParsed)
        this._listeners.forEach((listener) => listener(event, filePath, this));
    }

    addChangedListener(listener: Function) {
        this._listeners.push(listener);
    }

    removeChangedListener(listener: Function) {
        const index = this._listeners.indexOf(listener);
        ~index && this._listeners.splice(index, 1);
    }

    /**
     * 缓存获取
     * @param fullPath
     * @param args
     */
    static fetch(fullPath: string, ...args: any[]) {
        const key = this.name + '-' + fullPath;
        if (_caches.has(key))
            return _caches.get(key);
        else {
            const fsEntry = new this(fullPath, ...args);
            fsEntry.isWatched = true;
            _caches.set(key, fsEntry);

            const hash = new Date().toJSON();

            const fsWatch = chokidar.watch(fullPath, {
                ignoreInitial: true,
                followSymlinks: false,
                depth: fsEntry.isVue ? 2 : 1,
            }).on('all', (event, filePath) => {
                if (fsEntry.isSaving)
                    return;
                if (!_caches.has(key))
                    fsWatch.unwatch(fullPath);

                // Remove directory or file
                if (filePath === fullPath) {
                    if (event === 'unlink' || event === 'unlinkDir') {
                        _caches.delete(key);
                        fsWatch.unwatch(fullPath);
                    } else
                        fsEntry.onChange(event, filePath, key, hash);
                } else {
                    if (fsEntry.isVue)
                        fsEntry.onChange(event, filePath, key, hash);
                    else {
                        const relativePath = path.relative(fullPath, filePath);
                        if (relativePath.includes('/'))
                            return;
                        else if (event !== 'change')
                            fsEntry.onChange(event, filePath, key, hash);
                    }
                }
            });

            return fsEntry;
        }
    }
}
