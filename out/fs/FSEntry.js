"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const _caches = new Map(); // 文件缓存
class FSEntry {
    constructor(fullPath, isDirectory = false) {
        this.fullPath = fullPath;
        this.fileName = path.basename(fullPath);
        this.extName = path.extname(this.fileName);
        this.baseName = path.basename(this.fileName, this.extName);
        this.title = this.baseName;
        this.isDirectory = isDirectory;
        this.isVue = false;
        this.isOpen = false;
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
    onChange(event, filePath, key, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[vusion-api] onChange:', event, filePath, key, hash);
            if (this.isOpen && fs.existsSync(this.fullPath))
                yield this.forceOpen();
            this._listeners.forEach((listener) => listener(event, filePath, this));
        });
    }
    addChangedListener(listener) {
        this._listeners.push(listener);
    }
    removeChangedListener(listener) {
        const index = this._listeners.indexOf(listener);
        ~index && this._listeners.splice(index, 1);
    }
    /**
     * 缓存获取
     * @param fullPath
     * @param args
     */
    static fetch(fullPath, ...args) {
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
                    }
                    else
                        fsEntry.onChange(event, filePath, key, hash);
                }
                else {
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
exports.default = FSEntry;
//# sourceMappingURL=FSEntry.js.map