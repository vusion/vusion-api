"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const semver = require("semver");
const VueFile_1 = require("./VueFile");
const _1 = require(".");
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
            yield this.load();
            this.isOpen = true;
        });
    }
    reopen() {
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
            this.package = require(packageJSONPath);
            this.config = _1.resolveConfig(this.fullPath);
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
            if (this.libraryType === LibraryType.external && semver.lt(this.package.version, '0.4.0-alpha'))
                this.componentsDirectory = new _1.Directory(path.resolve(this.libraryPath));
            else
                this.componentsDirectory = new _1.Directory(path.resolve(this.libraryPath, 'components'));
        });
    }
}
exports.default = Library;
//# sourceMappingURL=Library.js.map