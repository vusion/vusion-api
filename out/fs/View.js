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
const FSEntry_1 = require("./FSEntry");
var ViewType;
(function (ViewType) {
    ViewType["root"] = "root";
    ViewType["page"] = "page";
    ViewType["module"] = "module";
    ViewType["wrapper"] = "wrapper";
    ViewType["vue"] = "vue";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
class View extends FSEntry_1.default {
    constructor(fullPath, viewType = ViewType.wrapper, isDirectory = true) {
        super(fullPath, isDirectory);
        this.viewType = viewType;
        this.routePath = '';
    }
    /**
     * 提前检测 View 文件类型，以及子 View 等
     * 需要异步，否则可能会比较慢
     */
    preOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.viewsPath = this.fullPath;
            const viewsPath = path.join(this.viewsPath, 'views');
            if (fs.existsSync(viewsPath))
                this.viewsPath = viewsPath;
            if (this.viewType === ViewType.root) {
                this.routePath = '/';
            }
            else if (this.viewType === ViewType.page) {
                this.vueFilePath = path.join(this.viewsPath, 'index.vue');
                this.routePath = this.parent.routePath + this.baseName + '#/';
            }
            else if (this.viewType === ViewType.module) {
                this.vueFilePath = path.join(this.viewsPath, 'index.vue');
                this.routePath = this.parent.routePath + this.baseName + '/';
            }
            else if (this.viewType === ViewType.wrapper) {
                this.vueFilePath = path.join(this.viewsPath, 'index.vue');
                this.routePath = this.parent.routePath + this.baseName + '/';
            }
            else {
                this.vueFilePath = this.fullPath;
                this.routePath = this.parent.routePath + this.baseName;
            }
            // this.alias = await this.readTitleInReadme();
        });
    }
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            yield this.preOpen();
            yield this.load();
            this.isOpen = true;
        });
    }
    close() {
        // this.alias = undefined;
        this.children = undefined;
        this.isOpen = false;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}`);
            if (this.viewType === ViewType.vue) // 没有打开的必要了
                return;
            const children = [];
            const fileNames = yield fs.readdir(this.viewsPath);
            fileNames.forEach((name) => {
                const fullPath = path.join(this.viewsPath, name);
                const isDirectory = fs.statSync(fullPath).isDirectory();
                if (!isDirectory && !name.endsWith('.vue'))
                    return;
                if (name === '.DS_Store' || name === '.git')
                    return;
                if (this.viewType !== ViewType.vue && name === 'index.vue')
                    return;
                let view = new View(fullPath, ViewType.wrapper, isDirectory);
                // if (this.isWatched)
                //     view = View.fetch(fullPath);
                // else
                if (fullPath.endsWith('.vue'))
                    view.viewType = ViewType.vue;
                else if (this.viewType === ViewType.root)
                    view.viewType = ViewType.page;
                else if (this.viewType === ViewType.page && fileNames.includes('modules.js'))
                    view.viewType = ViewType.module;
                view.parent = this;
                // view.isChild = true;
                children.push(view);
            });
            children.sort((a, b) => {
                if (a.isDirectory === b.isDirectory)
                    return a.fileName.localeCompare(b.fileName);
                else
                    return a.isDirectory ? -1 : 1;
            });
            return this.children = children;
        });
    }
    static fetch(fullPath) {
        return super.fetch(fullPath);
    }
}
exports.default = View;
//# sourceMappingURL=View.js.map