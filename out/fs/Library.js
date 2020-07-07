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
exports.LibraryType = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
const VueFile_1 = __importDefault(require("./VueFile"));
const JSFile_1 = __importDefault(require("./JSFile"));
const _1 = require("./");
const __1 = require("..");
var LibraryType;
(function (LibraryType) {
    LibraryType["internal"] = "internal";
    LibraryType["external"] = "external";
    LibraryType["other"] = "other";
})(LibraryType = exports.LibraryType || (exports.LibraryType = {}));
/**
 * Library
 * libraryPath 指向包含多种类型的文件夹，比如`./src`，用于快速索引目录
 */
class Library {
    constructor(fullPath, libraryType) {
        this.fullPath = fullPath;
        this.libraryType = libraryType;
        this.fileName = path.basename(fullPath);
        this.extName = path.extname(this.fileName);
        this.baseName = path.basename(this.fileName, this.extName);
        this.title = this.baseName;
        this.isOpen = false;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen)
                return;
            return this.forceOpen();
        });
    }
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            this.isOpen = true;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}!`);
            const packageJSONPath = path.resolve(this.fullPath, 'package.json');
            if (!fs.existsSync(packageJSONPath))
                return;
            this.package = JSON.parse(yield fs.readFile(packageJSONPath, 'utf8'));
            this.config = __1.config.resolve(this.fullPath);
            this.libraryPath = path.resolve(this.fullPath, this.config.libraryPath);
            if (typeof this.config.docs === 'object' && this.config.docs.components) {
                this.docsComponentsInfoMap = new Map();
                this.config.docs.components.forEach((componentInfo) => {
                    this.docsComponentsInfoMap.set(componentInfo.name, componentInfo);
                });
            }
            /* 在 package.json 中查找 .vusion 或 .vue 的依赖项 */
            const vusionDeps = [];
            const vueDeps = [];
            Object.keys(this.package.dependencies).forEach((dep) => {
                if (dep.endsWith('.vusion'))
                    vusionDeps.push(dep);
                else if (dep.endsWith('.vue'))
                    vueDeps.push(dep);
            });
            // @TODO: 我们就这么几个库，先写死
            let superLibraryName = vusionDeps[0];
            if (vusionDeps.includes('vusion-ui.vusion'))
                superLibraryName = 'vusion-ui.vusion';
            else if (vusionDeps.includes('cloud-ui.vusion'))
                superLibraryName = 'cloud-ui.vusion';
            this.superLibraries = vusionDeps.map((dep) => new Library(path.resolve(this.fullPath, 'node_modules', dep), LibraryType.external));
            this.superLibrary = this.superLibraries.find((library) => library.fileName === superLibraryName);
            this.otherComponents = vueDeps.map((dep) => new VueFile_1.default(path.resolve(this.fullPath, 'node_modules', dep)));
            if (this.libraryType === LibraryType.internal) {
                this.componentsDirectory = __1.Directory.fetch(path.resolve(this.libraryPath, 'components'));
                const componentsIndexPath = path.resolve(this.componentsDirectory.fullPath, 'index.js');
                if (fs.existsSync(componentsIndexPath))
                    this.componentsIndexFile = JSFile_1.default.fetch(componentsIndexPath);
            }
            else if (this.libraryType === LibraryType.external) {
                if (semver.lt(this.package.version, '0.4.0-alpha'))
                    this.componentsDirectory = new __1.Directory(path.resolve(this.libraryPath));
                else
                    this.componentsDirectory = new __1.Directory(path.resolve(this.libraryPath, 'components'));
                const componentsIndexPath = path.resolve(this.componentsDirectory.fullPath, 'index.js');
                if (fs.existsSync(componentsIndexPath))
                    this.componentsIndexFile = new JSFile_1.default(componentsIndexPath);
            }
            if (this.componentsDirectory) {
                this.components = _1.listAllFiles(this.componentsDirectory.fullPath, {
                    dot: false,
                    patterns: ['!**/node_modules', '!**/.git'],
                    includes: /\.vue$/,
                    excludes: /\.vue[\\/]/,
                }).map((fullPath) => new VueFile_1.default(fullPath));
            }
        });
    }
    forceOpenOthers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}!`);
            const packageJSONPath = path.resolve(this.fullPath, 'package.json');
            if (!fs.existsSync(packageJSONPath))
                return;
            this.package = JSON.parse(yield fs.readFile(packageJSONPath, 'utf8'));
            /* 在 package.json 中查找 .vusion 或 .vue 的依赖项 */
            const vueDeps = [];
            Object.keys(this.package.dependencies).forEach((dep) => {
                if (dep.endsWith('.vue'))
                    vueDeps.push(dep);
            });
            this.otherComponents = vueDeps.map((dep) => new VueFile_1.default(path.resolve(this.fullPath, 'node_modules', dep)));
        });
    }
}
exports.default = Library;
//# sourceMappingURL=Library.js.map