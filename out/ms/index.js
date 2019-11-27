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
const compiler = require("vue-template-compiler");
const fs = require("fs-extra");
const os = require("os");
const vfs = require("../fs");
const utils = require("../utils");
const compressing = require("compressing");
const rc = require("../rc");
const axios_1 = require("axios");
let platformAxios;
const getPlatformAxios = () => {
    return new Promise((res, rej) => {
        if (platformAxios)
            return res(platformAxios);
        const config = rc.configurator.load();
        platformAxios = axios_1.default.create({
            baseURL: config.platform + '/internal',
            headers: {
                'access-token': config.access_token,
            }
        });
        res(platformAxios);
    });
};
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
        // const fileName = result.source.fileName = path.basename(result.source.name);
        // result.source.baseName = path.basename(fileName, path.extname(fileName));
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
function getBlock(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('block/info', {
            params: {
                name: packageName,
            },
        }).then((res) => res.data.result);
    });
}
exports.getBlock = getBlock;
function getBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('block/list')
            .then((res) => res.data.result.rows);
    });
}
exports.getBlocks = getBlocks;
function publishBlock(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('block/publish', params)
            .then((res) => res.data);
    });
}
exports.publishBlock = publishBlock;
function publishComponent(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('component/publish', params)
            .then((res) => res.data);
    });
}
exports.publishComponent = publishComponent;
function publishTemplate(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('template/publish', params)
            .then((res) => res.data);
    });
}
exports.publishTemplate = publishTemplate;
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
        const blockCacheDir = getCacheDir('blocks');
        const tempPath = yield downloadPackage(opts.source.registry, opts.source.name, blockCacheDir);
        // if (fs.statSync(opts.target).isFile())
        const vueFile = new vfs.VueFile(opts.target);
        yield vueFile.open();
        if (!vueFile.isDirectory) {
            vueFile.transform();
            yield vueFile.save();
        }
        const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
        const dest = path.join(localBlocksPath, opts.name + '.vue');
        yield fs.ensureDir(localBlocksPath);
        yield fs.move(tempPath, dest);
        vueFile.parseScript();
        vueFile.parseTemplate();
        const relativePath = './blocks/' + opts.name + '.vue';
        const { componentName } = utils.normalizeName(opts.name);
        const body = vueFile.scriptHandler.ast.program.body;
        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (node.type !== 'ImportDeclaration') {
                const importDeclaration = babel.template(`import ${componentName} from '${relativePath}'`)();
                body.splice(i, 0, importDeclaration);
                break;
            }
        }
        babel.traverse(vueFile.scriptHandler.ast, {
            ExportDefaultDeclaration(nodePath) {
                const declaration = nodePath.node.declaration;
                if (declaration && declaration.type === 'ObjectExpression') {
                    let pos = 0;
                    const propertiesBefore = [
                        'el',
                        'name',
                        'parent',
                        'functional',
                        'delimiters',
                        'comments',
                    ];
                    let componentsProperty = declaration.properties.find((property, index) => {
                        if (property.type === 'ObjectProperty' && propertiesBefore.includes(property.key.name))
                            pos = index;
                        return property.type === 'ObjectProperty' && property.key.name === 'components';
                    });
                    const blockProperty = babel.types.objectProperty(babel.types.identifier(componentName), babel.types.identifier(componentName));
                    if (!componentsProperty) {
                        componentsProperty = babel.types.objectProperty(babel.types.identifier('components'), babel.types.objectExpression([]));
                        declaration.properties.splice(pos, 0, componentsProperty);
                    }
                    componentsProperty.value.properties.push(blockProperty);
                }
            },
        });
        const rootEl = vueFile.templateHandler.ast;
        rootEl.children.unshift(compiler.compile(`<${opts.name}></${opts.name}>`).ast);
        yield vueFile.save();
    });
}
exports.addBlock = addBlock;
/**
 *
 * @param registry For example: https://registry.npm.taobao.org
 * @param packageName For example: lodash
 * @param saveDir For example: ./blocks
 */
function downloadPackage(registry, packageName, saveDir, clearCache) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: pkgInfo } = yield axios_1.default.get(`${registry}/${packageName}/latest`);
        const dest = path.join(saveDir, pkgInfo.name.replace(/\//, '__') + '@' + pkgInfo.version);
        if (fs.existsSync(dest) && !clearCache)
            return dest;
        const tgzURL = pkgInfo.dist.tarball;
        const response = yield axios_1.default.get(tgzURL, {
            responseType: 'stream',
        });
        const temp = path.resolve(os.tmpdir(), packageName + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
        yield compressing.tgz.uncompress(response.data, temp);
        yield fs.move(path.join(temp, 'package'), dest);
        fs.removeSync(temp);
        fs.removeSync(path.resolve(dest, 'screenshots'));
        fs.removeSync(path.resolve(dest, 'public'));
        fs.removeSync(path.resolve(dest, 'docs'));
        fs.removeSync(path.resolve(dest, 'package.json'));
        fs.removeSync(path.resolve(dest, 'README.md'));
        return dest;
    });
}
exports.downloadPackage = downloadPackage;
//# sourceMappingURL=index.js.map