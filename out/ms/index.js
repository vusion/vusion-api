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
const path = require("path");
const babel = require("@babel/core");
const fs = require("fs-extra");
const os = require("os");
const vfs = require("../fs");
const utils = require("../utils");
const compressing = require("compressing");
const axios_1 = require("axios");
const platformAxios = axios_1.default.create({
    baseURL: 'http://akos.test.netease.com:7001/internal',
    headers: {
        'access_token': 'f2224e629a7e24423e6b1bf6f7a08ea0a549fb975bbd86b2111a9f74f2fa8bc3b66530a79a4cf910429595ba56a7bbbf34baacf843446f0f6ca2cc6ab961f360',
    }
});
function getCacheDir(subPath = '') {
    const cacheDir = path.join(os.homedir(), '.vusion', subPath);
    if (!fs.existsSync(cacheDir))
        fs.ensureDirSync(cacheDir);
    return cacheDir;
}
exports.getCacheDir = getCacheDir;
function getRunControl() {
    const rcPath = path.join(os.homedir(), '.vusion');
    return rcPath;
}
exports.getRunControl = getRunControl;
;
;
;
function processOptions(options) {
    const result = {
        source: {
            type: 'file',
            registry: '',
            name: '',
            path: '',
            version: '',
            commit: '',
            fileName: '',
            baseName: '',
        },
        target: options.target,
        name: options.name,
        title: options.title,
    };
    let source = options.source;
    if (typeof source !== 'string') {
        result.source = source;
        const fileName = result.source.fileName = path.basename(result.source.name);
        result.source.baseName = path.basename(fileName, path.extname(fileName));
        return result;
    }
    if (source[0] === '.' || source[0] === '~' || source[0] === '/') {
        result.source.type = 'file';
        result.source.path = source;
        const fileName = result.source.fileName = path.basename(source);
        result.source.baseName = path.basename(fileName, path.extname(fileName));
    }
    else {
        const repoRE = /^\w+:/;
        const cap = repoRE.exec(source);
        if (cap) {
            result.source.type = cap[0].slice(0, -1);
            source = source.slice(cap[0].length);
        }
        else
            result.source.type = 'npm';
        const arr = source.split(':');
        result.source.path = arr[1];
        let name = arr[0];
        if (name.includes('#')) {
            const arr2 = name.split('#');
            result.source.name = arr2[0];
            result.source.commit = arr2[1];
        }
        else if (name.includes('@')) {
            const arr2 = name.split('@');
            result.source.name = arr2[0];
            result.source.version = arr2[1];
        }
        else {
            result.source.name = name;
        }
        const fileName = result.source.fileName = path.basename(result.source.name);
        result.source.baseName = path.basename(fileName, path.extname(fileName));
    }
    return result;
}
exports.processOptions = processOptions;
/**
 * 从业务模板中添加模块
 */
function addModule(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        const moduleCacheDir = getCacheDir('modules');
        yield fs.emptyDir(moduleCacheDir);
        if (opts.source.type === 'file') {
            const temp = path.resolve(moduleCacheDir, opts.source.fileName + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
            const dest = path.resolve(opts.target, opts.name);
            yield fs.copy(path.resolve(opts.source.path), temp);
            yield vfs.batchReplace(vfs.listAllFiles(moduleCacheDir, {
                type: 'file',
            }), [
                [/sample/g, opts.name],
                [/Sample/g, utils.kebab2Camel(opts.name)],
                [/样本/g, opts.title],
            ]);
            yield fs.move(temp, dest);
            // 修改 modules.order 配置
            const modulesOrderPath = path.resolve(opts.target, 'modules.order.js');
            if (fs.existsSync(modulesOrderPath)) {
                const jsFile = new vfs.JSFile(modulesOrderPath);
                yield jsFile.open();
                jsFile.parse();
                let changed = false;
                babel.traverse(jsFile.handler.ast, {
                    ExportDefaultDeclaration(nodePath) {
                        const declaration = nodePath.node.declaration;
                        if (declaration && declaration.type === 'ArrayExpression') {
                            const element = Object.assign(babel.types.stringLiteral(opts.name), { raw: `'${opts.name}'` });
                            declaration.elements.push(element);
                            changed = true;
                        }
                    }
                });
                if (changed)
                    yield jsFile.save();
            }
        }
    });
}
exports.addModule = addModule;
function removeModule(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = path.resolve(options.target, options.name);
        yield fs.remove(dest);
        // 修改 modules.order 配置
        const modulesOrderPath = path.resolve(options.target, 'modules.order.js');
        if (fs.existsSync(modulesOrderPath)) {
            const jsFile = new vfs.JSFile(modulesOrderPath);
            yield jsFile.open();
            jsFile.parse();
            let changed = false;
            babel.traverse(jsFile.handler.ast, {
                ExportDefaultDeclaration(nodePath) {
                    const declaration = nodePath.node.declaration;
                    if (declaration && declaration.type === 'ArrayExpression') {
                        for (let i = 0; i < declaration.elements.length; i++) {
                            const element = declaration.elements[i];
                            if (element.type === 'StringLiteral' && element.value === options.name) {
                                declaration.elements.splice(i, 1);
                                changed = true;
                                break;
                            }
                        }
                    }
                }
            });
            yield jsFile.save();
        }
    });
}
exports.removeModule = removeModule;
function getBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        return platformAxios.get('block/list')
            .then((res) => res.data.result.rows);
    });
}
exports.getBlocks = getBlocks;
function publishBlock(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return platformAxios.post('block/publish', params)
            .then((res) => res.data);
    });
}
exports.publishBlock = publishBlock;
function createBlock(dir, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(name);
        const dest = vfs.handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/s-block.vue'), dest);
        yield vfs.batchReplace(vfs.listAllFiles(dest, {
            type: 'file',
        }), [
            [/s-block/g, normalized.baseName],
            [/SBlock/g, normalized.componentName],
            [/区块/g, title || '区块'],
        ]);
        return dest;
    });
}
exports.createBlock = createBlock;
function createBlockInLibrary(dir, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(name);
        const dest = vfs.handleSame(dir, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../../templates/s-library-block.vue'), dest);
        yield vfs.batchReplace(vfs.listAllFiles(dest, {
            type: 'file',
        }), [
            [/s-block/g, normalized.baseName],
            [/SBlock/g, normalized.componentName],
            [/区块/g, title || '区块'],
        ]);
        return dest;
    });
}
exports.createBlockInLibrary = createBlockInLibrary;
function addBlock(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        // if (opts.source.type === 'npm')
        const blockCacheDir = getCacheDir('block');
        const dest = yield downloadPackage(opts.source.registry, opts.source.name, blockCacheDir);
        // if (fs.statSync(opts.target).isFile())
        const vueFile = new vfs.VueFile(opts.target);
        yield vueFile.open();
        if (!vueFile.isDirectory)
            vueFile.transform();
        yield vueFile.save();
        const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
        yield fs.ensureDir(localBlocksPath);
        yield fs.move(dest, path.join(localBlocksPath, opts.source.name));
    });
}
exports.addBlock = addBlock;
/**
 *
 * @param registry For example: https://registry.npm.taobao.org
 * @param packageName For example: lodash
 * @param saveDir For example: ./blocks
 */
function downloadPackage(registry, packageName, saveDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: pkgInfo } = yield axios_1.default.get(`${registry}/${packageName}/latest`);
        const tgzURL = pkgInfo.dist.tarball;
        const response = yield axios_1.default.get(tgzURL, {
            responseType: 'stream',
        });
        const temp = path.resolve(os.tmpdir(), packageName + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
        yield compressing.tgz.uncompress(response.data, temp);
        const dest = path.join(saveDir, pkgInfo.name + '@' + pkgInfo.version);
        yield fs.move(path.join(temp, 'package'), dest);
        yield fs.rmdir(temp);
        return dest;
    });
}
exports.downloadPackage = downloadPackage;
//# sourceMappingURL=index.js.map