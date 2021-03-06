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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendToLibrary = exports.extendToPath = exports.addPackage = exports.addDocs = exports.addAPI = exports.addModuleCSS = exports.createMultiFilePackage = exports.createMultiFileWithScreenshots = exports.createMultiFileWithSubdocs = exports.createMultiFile = exports.createSingleFile = exports.rename = exports.deleteFile = exports.moveFileToTrash = exports.createDirectory = exports.listAllFiles = exports.listFiles = exports.batchReplace = exports.handleSame = exports.FileExistsError = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const babel = __importStar(require("@babel/core"));
const globby = __importStar(require("globby"));
const utils_1 = require("../utils");
const _1 = require(".");
class FileExistsError extends Error {
    constructor(fullPath) {
        super(fullPath);
        this.name = 'FileExistsError';
        this.message = `文件"${fullPath}"已经存在！`;
    }
}
exports.FileExistsError = FileExistsError;
function handleSame(dir, baseName = 'u-sample') {
    let dest = path.resolve(dir, `${baseName}.vue`);
    if (fs.existsSync(dest))
        throw new FileExistsError(dest);
    return dest;
}
exports.handleSame = handleSame;
function batchReplace(src, replacers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof src === 'string')
            src = [src];
        return Promise.all(src.map((fullPath) => fs.readFile(fullPath, 'utf8').then((content) => {
            replacers.forEach((replacer) => content = content.replace(...replacer));
            return fs.writeFile(fullPath, content);
        })));
    });
}
exports.batchReplace = batchReplace;
;
function listFiles(dir = '', filters = {}, recursive = false) {
    dir = dir.replace(/\\/g, '/');
    const pattern = recursive ? '**' : '*';
    // globby 只支持 /
    return globby.sync([dir ? dir + '/' + pattern : pattern].concat(filters.patterns || []), {
        dot: filters.dot,
        onlyFiles: false,
    }).filter((filePath) => {
        if (filters.type) {
            const stat = fs.statSync(filePath);
            if (filters.type === 'file' && !stat.isFile())
                return false;
            if (filters.type === 'directory' && !stat.isDirectory())
                return false;
            if (filters.type === 'link' && !stat.isSymbolicLink())
                return false;
        }
        if (filters.includes) {
            if (!Array.isArray(filters.includes))
                filters.includes = [filters.includes];
            if (!filters.includes.every((include) => {
                if (typeof include === 'string')
                    return filePath.includes(include);
                else
                    return include.test(filePath);
            }))
                return false;
        }
        if (filters.excludes) {
            if (!Array.isArray(filters.excludes))
                filters.excludes = [filters.excludes];
            if (filters.excludes.some((exclude) => {
                if (typeof exclude === 'string')
                    return filePath.includes(exclude);
                else
                    return exclude.test(filePath);
            }))
                return false;
        }
        if (filters.filters) {
            if (!Array.isArray(filters.filters))
                filters.filters = [filters.filters];
            if (!filters.filters.every((filter) => filter(filePath)))
                return false;
        }
        return true;
    });
}
exports.listFiles = listFiles;
function listAllFiles(dir, filters = {}) {
    return listFiles(dir, filters, true);
}
exports.listAllFiles = listAllFiles;
/* 以下代码复制粘贴写得冗余了一点，不过之后可能各部分功能会有差异，所以先不整合 */
function createDirectory(dir, dirName) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = path.resolve(dir, dirName);
        if (fs.existsSync(dest))
            throw new FileExistsError(dest);
        yield fs.mkdir(dest);
        return dest;
    });
}
exports.createDirectory = createDirectory;
function moveFileToTrash(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // @TODO: Windows, Linux
        const fileName = path.basename(fullPath);
        let dest = path.resolve(process.env.HOME, '.Trash', fileName);
        if (fs.existsSync(dest)) {
            const date = new Date();
            dest = dest.replace(/(\.[a-zA-Z]+$|$)/, `.${date.toTimeString().split(' ')[0].replace(/:/g, '-')}-${date.getMilliseconds()}$1`);
        }
        yield fs.move(fullPath, dest);
        return dest;
    });
}
exports.moveFileToTrash = moveFileToTrash;
function deleteFile(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // @TODO: Windows, Linux
        yield fs.remove(fullPath);
    });
}
exports.deleteFile = deleteFile;
function rename(fullPath, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = path.join(path.dirname(fullPath), newName);
        if (dest === fullPath)
            return dest;
        if (fs.existsSync(dest))
            throw new FileExistsError(dest);
        yield fs.move(fullPath, dest);
        return dest;
    });
}
exports.rename = rename;
function createSingleFile(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils_1.normalizeName(componentName);
        const dest = handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/u-single-file.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace(dest, [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createSingleFile = createSingleFile;
function createMultiFile(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils_1.normalizeName(componentName);
        const dest = handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/u-multi-file.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'README.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFile = createMultiFile;
/**
 * @deprecated
 **/
function createMultiFileWithSubdocs(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils_1.normalizeName(componentName);
        const dest = handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/u-multi-file-with-subdocs.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'docs/api.md'),
                path.join(dest, 'docs/examples.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
/**
 * @deprecated
 **/
function createMultiFileWithScreenshots(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils_1.normalizeName(componentName);
        const dest = handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/u-multi-file-with-screenshots.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'README.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFileWithScreenshots = createMultiFileWithScreenshots;
/**
 * @deprecated
 **/
function createMultiFilePackage(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils_1.normalizeName(componentName);
        const dest = handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/u-multi-file-package.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'README.md'),
                path.join(dest, 'package.json'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFilePackage = createMultiFilePackage;
function addModuleCSS(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding functional block in single vue file!');
        const dest = path.resolve(vuePath, 'module.css');
        if (fs.existsSync(dest))
            throw new Error('File module.css exists!');
        yield fs.copy(path.resolve(__dirname, '../../templates/u-fully-functional.vue/module.css'), dest);
        return dest;
    });
}
exports.addModuleCSS = addModuleCSS;
function addAPI(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding functional block in single vue file!');
        const dest = path.resolve(vuePath, 'api.yaml');
        if (fs.existsSync(dest))
            throw new Error('File api.yaml exists!');
        yield fs.copy(path.resolve(__dirname, '../../templates/u-fully-functional.vue/api.yaml'), dest);
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        yield batchReplace(dest, [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        return dest;
    });
}
exports.addAPI = addAPI;
function addDocs(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding functional block in single vue file!');
        const dest = path.resolve(vuePath, 'docs');
        if (fs.existsSync(dest))
            throw new FileExistsError('Directory docs exists!');
        yield fs.copy(path.resolve(__dirname, '../../templates/u-fully-functional.vue/docs'), dest);
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        yield batchReplace(listAllFiles(dest), [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        return dest;
    });
}
exports.addDocs = addDocs;
function addPackage(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding functional block in single vue file!');
        const dest = path.resolve(vuePath, 'package.json');
        if (fs.existsSync(dest))
            throw new FileExistsError('File package.json exists!');
        yield fs.copy(path.resolve(__dirname, '../../templates/u-fully-functional.vue/package.json'), dest);
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        yield batchReplace(dest, [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        return dest;
    });
}
exports.addPackage = addPackage;
/**
 * 扩展到新的路径中
 * @param vueFile 原组件库需要扩展的组件，一级、二级组件均可
 * @param from 原来的库，或者 VueFile 本身的路径
 * @param to 新的路径
 */
function extendToPath(vueFile, from, to, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        let importFrom;
        if (from instanceof _1.Library) {
            importFrom = from.fileName;
        }
        else {
            importFrom = from;
        }
        const dest = to;
        const destDir = path.dirname(dest);
        if (fs.existsSync(dest))
            throw new FileExistsError(dest);
        if (!fs.existsSync(destDir))
            fs.mkdirSync(destDir);
        const newVueFile = vueFile.extend(mode, dest, importFrom);
        yield newVueFile.save();
        return newVueFile;
    });
}
exports.extendToPath = extendToPath;
/**
 * 扩展到新的库中
 * @param vueFile 原组件库需要扩展的组件，一级、二级组件均可
 * @param from 原来的库，或者 VueFile 本身的路径
 * @param to 需要扩展到的组件库，比如 internalLibrary
 */
function extendToLibrary(vueFile, from, to, mode, subDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let importFrom;
        if (from instanceof _1.Library) {
            if (subDir === undefined)
                subDir = to.config.type !== 'library' && to.config.type !== 'repository' ? from.baseName : ''; // @example 'cloud-ui';
            importFrom = from.fileName;
        }
        else {
            if (subDir === undefined)
                subDir = to.config.type !== 'library' && to.config.type !== 'repository' ? 'other' : '';
            importFrom = from;
        }
        const arr = vueFile.fullPath.split(path.sep);
        let pos = arr.length - 1; // root Vue 的位置
        while (arr[pos] && arr[pos].endsWith('.vue'))
            pos--;
        pos++;
        const basePath = arr.slice(0, pos).join(path.sep);
        const fromRelativePath = path.relative(basePath, vueFile.fullPath);
        const toRelativePath = subDir ? `./${subDir}/${fromRelativePath}` : `./${fromRelativePath}`;
        const toPath = to.componentsDirectory.fullPath;
        const destDir = path.resolve(toPath, subDir);
        const dest = path.resolve(toPath, toRelativePath);
        const parentDest = path.dirname(dest);
        // 如果为子组件，且父组件不存在的话，先创建父组件
        if (vueFile.isChild && !fs.existsSync(parentDest))
            yield extendToLibrary(vueFile.parent, from, to, _1.VueFileExtendMode.script, subDir);
        if (fs.existsSync(dest))
            throw new FileExistsError(dest);
        if (!fs.existsSync(destDir))
            fs.mkdirSync(destDir);
        const newVueFile = vueFile.extend(mode, dest, importFrom);
        yield newVueFile.save();
        // 子组件在父组件中添加，根组件在 index.js 中添加
        if (vueFile.isChild) {
            // VueFile.save() 会清掉子组件
            // const parentFile = new VueFile(parentDest);
            // await parentFile.open();
            // parentFile.parseScript();
            const parentIndexFile = _1.JSFile.fetch(path.join(parentDest, 'index.js'));
            yield parentIndexFile.open();
            parentIndexFile.parse();
            yield vueFile.open();
            vueFile.parseScript();
            const relativePath = './' + vueFile.fileName;
            // const getExportSpecifiers = () => {
            const exportNames = [];
            babel.traverse(vueFile.scriptHandler.ast, {
                ExportNamedDeclaration(nodeInfo) {
                    if (nodeInfo.node.declaration) {
                        nodeInfo.node.declaration.declarations.forEach((declaration) => {
                            exportNames.push(declaration.id.name);
                        });
                    }
                    if (nodeInfo.node.specifiers) {
                        nodeInfo.node.specifiers.forEach((specifier) => {
                            exportNames.push(specifier.exported.name);
                        });
                    }
                },
            });
            // }
            const createExportNamed = () => {
                const exportNamedDeclaration = babel.template(`export { ${exportNames.join(', ')} } from "${relativePath}"`)();
                // 要逃避 typescript
                // Object.assign(exportNamedDeclaration.source, { raw: `'${relativePath}'` });
                return exportNamedDeclaration;
            };
            let exportNamed;
            babel.traverse(parentIndexFile.handler.ast, {
                enter(nodeInfo) {
                    // 只遍历顶级节点
                    if (nodeInfo.parentPath && nodeInfo.parentPath.isProgram())
                        nodeInfo.skip();
                    if (nodeInfo.isExportAllDeclaration() || nodeInfo.isExportNamedDeclaration()) {
                        if (!nodeInfo.node.source) {
                            // 有可能是 declarations
                        }
                        else if (relativePath === nodeInfo.node.source.value) {
                            if (nodeInfo.isExportAllDeclaration) {
                                exportNamed = createExportNamed();
                                nodeInfo.replaceWith(exportNamed);
                            }
                            else {
                                // exportNamed = nodeInfo.node;
                            }
                            nodeInfo.stop();
                        }
                        else if (relativePath < nodeInfo.node.source.value) {
                            exportNamed = createExportNamed();
                            nodeInfo.insertBefore(exportNamed);
                            nodeInfo.stop();
                        }
                    }
                    else if (nodeInfo.isExportDefaultDeclaration() && !exportNamed) {
                        exportNamed = createExportNamed();
                        nodeInfo.insertBefore(exportNamed);
                        nodeInfo.stop();
                    }
                },
            });
            yield parentIndexFile.save();
        }
        else if (to.componentsIndexFile) {
            const indexFile = to.componentsIndexFile;
            yield indexFile.open();
            indexFile.parse();
            const createExportAll = () => {
                const exportAllDeclaration = babel.types.exportAllDeclaration(babel.types.stringLiteral(toRelativePath));
                // 要逃避 typescript
                Object.assign(exportAllDeclaration.source, { raw: `'${toRelativePath}'` });
                return exportAllDeclaration;
            };
            let exportAll;
            babel.traverse(indexFile.handler.ast, {
                enter(nodeInfo) {
                    // 只遍历顶级节点
                    if (nodeInfo.parentPath && nodeInfo.parentPath.isProgram())
                        nodeInfo.skip();
                    if (nodeInfo.isExportAllDeclaration()) {
                        if (!nodeInfo.node.source) {
                            // 有可能是 declarations
                        }
                        else if (toRelativePath === nodeInfo.node.source.value) {
                            exportAll = nodeInfo.node;
                            nodeInfo.stop();
                        }
                        else if (toRelativePath < nodeInfo.node.source.value) {
                            exportAll = createExportAll();
                            nodeInfo.insertBefore(exportAll);
                            nodeInfo.stop();
                        }
                    }
                },
                exit(nodeInfo) {
                    if (nodeInfo.isProgram() && !exportAll) {
                        exportAll = createExportAll();
                        nodeInfo.node.body.push(exportAll);
                    }
                },
            });
            yield indexFile.save();
        }
        return newVueFile;
    });
}
exports.extendToLibrary = extendToLibrary;
//# sourceMappingURL=fs.js.map