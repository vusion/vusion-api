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
    onMiniChange(event, filePath, key, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[vusion-api] onMiniChange:', event, filePath, key, hash);
            if (this.isOpen && fs.existsSync(this.fullPath))
                yield this.forceOpen();
            // @TODO: if (this.isParsed)
            this._miniChangeListeners.forEach((listener) => listener(event, filePath, this));
        });
    }
    onChange(event, filePath, key, hash) {
        this._changeListeners.forEach((listener) => listener(event, filePath, this));
    }
    addEventListener(eventName, listener) {
        let listeners;
        if (eventName === 'change')
            listeners = this._changeListeners;
        else if (eventName === 'mini-change')
            listeners = this._miniChangeListeners;
        else
            throw new TypeError('Unknown eventName ' + eventName);
        listeners.push(listener);
    }
    removeEventListener(eventName, listener) {
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
                ignored: [path.join(fullPath, 'node_modules/**'), path.join(fullPath, '.git/**')],
                ignoreInitial: true,
                followSymlinks: false,
                depth: 1,
            }).on('all', (event, filePath) => __awaiter(this, void 0, void 0, function* () {
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
                    }
                    else
                        yield fsEntry.onMiniChange(event, filePath, key, hash);
                }
                else {
                    if (fsEntry.isVue)
                        yield fsEntry.onMiniChange(event, filePath, key, hash);
                    else {
                        const relativePath = path.relative(fullPath, filePath);
                        if (relativePath.includes('/'))
                            return fsEntry.onChange(event, filePath, key, hash);
                        else if (event !== 'change')
                            yield fsEntry.onMiniChange(event, filePath, key, hash);
                    }
                }
                return fsEntry.onChange(event, filePath, key, hash);
            }));
            return fsEntry;
        }
    }
}
exports.default = FSEntry;
//# sourceMappingURL=FSEntry.js.map