"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOLDER_DIRS = exports.KEYWORD_DIRS = exports.ViewType = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const FSEntry_1 = __importDefault(require("./FSEntry"));
var ViewType;
(function (ViewType) {
    ViewType["root"] = "root";
    ViewType["entry"] = "entry";
    ViewType["module"] = "module";
    ViewType["branch"] = "branch";
    ViewType["vue"] = "vue";
    ViewType["md"] = "md";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
exports.KEYWORD_DIRS = [
    'assets',
    'components',
    'directives',
    'filters',
    'mixins',
    'utils',
    'styles',
    'service',
    'module',
];
exports.HOLDER_DIRS = [
    'views',
    'layout',
];
class View extends FSEntry_1.default {
    constructor(fullPath, viewType = ViewType.branch, isDirectory = true, routePath) {
        super(fullPath, isDirectory);
        this.viewType = viewType;
        this.viewsPath = '';
        this.routePath = routePath;
    }
    /**
     * 提前检测 View 文件类型，以及子 View 等
     * 需要异步，否则可能会比较慢
     */
    preOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(path.join(this.fullPath, 'views')))
                this.viewsPath = 'views';
            if (this.viewType === ViewType.root) {
            }
            else if (this.viewType === ViewType.entry) {
                this.vueFilePath = path.join(this.fullPath, this.viewsPath, 'index.vue');
            }
            else if (this.viewType === ViewType.module) {
                this.vueFilePath = path.join(this.fullPath, this.viewsPath, 'index.vue');
            }
            else if (this.viewType === ViewType.branch) {
                this.vueFilePath = path.join(this.fullPath, this.viewsPath, 'index.vue');
            }
            else {
                this.vueFilePath = this.fullPath;
            }
            if (this.routePath === undefined) {
                const parentRoutePath = this.parent ? this.parent.routePath : '/';
                if (this.viewType === ViewType.root) {
                    this.routePath = '/';
                }
                else if (this.viewType === ViewType.entry) {
                    this.routePath = parentRoutePath + this.baseName + '#/';
                }
                else if (this.viewType === ViewType.module) {
                    this.routePath = parentRoutePath + this.baseName + '/';
                }
                else if (this.viewType === ViewType.branch) {
                    this.routePath = parentRoutePath + this.baseName + '/';
                }
                else {
                    this.routePath = parentRoutePath + this.baseName;
                }
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
            if (this.viewType === ViewType.vue || this.viewType === ViewType.md) // 没有打开的必要了
                return;
            const children = [];
            const fileNames = yield fs.readdir(path.join(this.fullPath, this.viewsPath));
            fileNames.forEach((name) => {
                const fullPath = path.join(this.fullPath, this.viewsPath, name);
                const isDirectory = fs.statSync(fullPath).isDirectory();
                if (!(isDirectory || name.endsWith('.vue') || name.endsWith('.md')))
                    return;
                if (name === '.DS_Store' || name === '.git')
                    return;
                if (exports.KEYWORD_DIRS.includes(name) || exports.HOLDER_DIRS.includes(name))
                    return;
                if (isDirectory && name.endsWith('.blocks'))
                    return;
                if (name === 'index.vue' || name === 'index.md')
                    return;
                let view;
                // if (this.isWatched)
                //     view = View.fetch(fullPath, ViewType.branch, isDirectory);
                // else
                view = new View(fullPath, ViewType.branch, isDirectory);
                if (fullPath.endsWith('.vue'))
                    view.viewType = ViewType.vue;
                else if (fullPath.endsWith('.md'))
                    view.viewType = ViewType.md;
                else if (this.viewType === ViewType.root)
                    view.viewType = ViewType.entry;
                else if (this.viewType === ViewType.entry && fs.existsSync(path.join(fullPath, 'module/base.js')))
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
    /**
     *
     * @param relativePath
     * @example rootView.find('dashboard')
     * @example rootView.find('dashboard/views/notice/detail.vue')
     */
    findByRealPath(relativePath, openIfNotLoaded = false, alwaysFindOne = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.children) {
                if (openIfNotLoaded)
                    yield this.open();
                else
                    return;
            }
            relativePath = path.normalize(relativePath);
            const arr = relativePath.split(path.sep);
            if (arr[0] === 'views')
                arr.shift();
            const next = arr[0];
            if (!next)
                throw new Error('Starting root / is not allowed!');
            if (!this.children || !this.children.length || next === 'index.vue' || next === 'index.md')
                return this;
            const childView = this.children.find((view) => view.fileName === next);
            if (arr.length === 0)
                throw new Error('Error path: ' + relativePath);
            else {
                if (!childView)
                    return alwaysFindOne ? this : childView;
                else if (arr.length === 1)
                    return childView;
                else
                    return childView.findByRealPath(arr.slice(1).join(path.sep), openIfNotLoaded, alwaysFindOne);
            }
        });
    }
    findByRoute(relativePath, openIfNotLoaded = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.children) {
                if (openIfNotLoaded)
                    yield this.open();
                else
                    return;
            }
            relativePath = path.normalize(relativePath);
            const arr = relativePath.split(path.sep);
            const next = arr[0];
            if (!next)
                throw new Error('Starting root / is not allowed!');
            const childView = this.children.find((view) => view.baseName === next);
            if (arr.length === 0)
                throw new Error('Error path: ' + relativePath);
            else if (arr.length === 1)
                return childView;
            else if (!childView.isDirectory)
                throw new Error('Not a directory: ' + childView.fullPath);
            else
                return childView.findByRoute(arr.slice(1).join(path.sep), openIfNotLoaded);
        });
    }
    static fetch(fullPath, viewType = ViewType.branch, isDirectory = true) {
        return super.fetch(fullPath, viewType, isDirectory);
    }
}
exports.default = View;
//# sourceMappingURL=View.js.map