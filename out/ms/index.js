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
const rc = require("../rc");
const download = require("./download");
exports.download = download;
const _ = require("lodash");
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
/**
 * 获取最新的区块模板
 */
function fetchLatestBlockTemplate() {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheDir = getCacheDir('templates');
        return download.npm({
            registry: rc.configurator.getDownloadRegistry(),
            name: '@vusion-templates/block',
        }, cacheDir);
    });
}
exports.fetchLatestBlockTemplate = fetchLatestBlockTemplate;
/**
 * 获取最新的组件模板
 */
function fetchLatestComponentTemplate() {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheDir = getCacheDir('templates');
        return download.npm({
            registry: rc.configurator.getDownloadRegistry(),
            name: '@vusion-templates/component',
        }, cacheDir);
    });
}
exports.fetchLatestComponentTemplate = fetchLatestComponentTemplate;
const defaultFormatter = (content, params) => {
    return _.template(content)(params);
};
function formatTemplate(src, params = {}, formatter = defaultFormatter) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(vfs.listAllFiles(src, {
            type: 'file',
            dot: true,
            patterns: ['!**/node_modules', '!**/.git'],
        }).map((filePath) => {
            return fs.readFile(filePath, 'utf8').then((content) => {
                try {
                    content = formatter(content, params);
                }
                catch (e) {
                    throw new Error(filePath + '\n' + e);
                }
                return fs.writeFile(filePath, content);
            });
        }));
    });
}
exports.formatTemplate = formatTemplate;
function formatTemplateTo(src, dest, params = {}, formatter = defaultFormatter) {
    return Promise.all(vfs.listAllFiles(src, {
        type: 'file',
        dot: true,
        patterns: ['!**/node_modules', '!**/.git'],
    }).map((filePath) => {
        return fs.readFile(filePath, 'utf8').then((content) => {
            try {
                content = formatter(content, params);
            }
            catch (e) {
                throw new Error(filePath + '\n' + e);
            }
            return fs.outputFile(path.join(dest, path.relative(src, filePath)), content);
        });
    }));
}
exports.formatTemplateTo = formatTemplateTo;
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
            // 先在临时文件地方处理掉，防止 Webpack 加载多次
            yield fs.copy(path.resolve(opts.source.path), temp);
            yield formatTemplate(moduleCacheDir, {
                name: opts.name,
                camelName: utils.kebab2Camel(opts.name),
                title: opts.title,
            });
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
        }).then((res) => {
            const block = res.data.result;
            const fileName = path.basename(block.name);
            block.tagName = path.basename(fileName, path.extname(fileName));
            block.componentName = utils.kebab2Camel(block.tagName);
            return block;
        });
    });
}
exports.getBlock = getBlock;
function getBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('block/list')
            .then((res) => {
            const blocks = res.data.result.rows;
            blocks.forEach((block) => {
                const fileName = path.basename(block.name);
                block.tagName = path.basename(fileName, path.extname(fileName));
                block.componentName = utils.kebab2Camel(block.tagName);
            });
            return blocks;
        });
    });
}
exports.getBlocks = getBlocks;
function getComponents() {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('component/list')
            .then((res) => {
            const components = res.data.result.rows;
            components.forEach((component) => {
                const fileName = path.basename(component.name);
                component.tagName = path.basename(fileName, path.extname(fileName));
                component.componentName = utils.kebab2Camel(component.tagName);
            });
            return components;
        });
    });
}
exports.getComponents = getComponents;
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
function createBlockPackage(dir, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tplPath = yield fetchLatestBlockTemplate();
        const baseName = path.basename(options.name, path.extname(options.name));
        if (path.extname(options.name) !== '.vue')
            options.name = baseName + '.vue';
        options.componentName = utils.kebab2Camel(baseName);
        options.tagName = baseName;
        const dest = vfs.handleSame(dir, baseName);
        yield fs.copy(tplPath, dest);
        yield formatTemplate(dest, options);
        const _packageJSONPath = path.resolve(dest, '_package.json');
        const packageJSONPath = path.resolve(dest, 'package.json');
        if (fs.existsSync(_packageJSONPath))
            yield fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
        if (fs.existsSync(packageJSONPath)) {
            const pkg = JSON.parse(yield fs.readFile(packageJSONPath, 'utf8'));
            pkg.vusion = pkg.vusion || {};
            pkg.vusion.title = options.title || pkg.vusion.title;
            pkg.vusion.category = options.category || pkg.vusion.category;
            pkg.vusion.access = options.access || pkg.vusion.access;
            pkg.vusion.team = options.team || pkg.vusion.team;
            yield fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
        }
        return dest;
    });
}
exports.createBlockPackage = createBlockPackage;
function addBlock(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        // if (opts.source.type === 'npm')
        const blockCacheDir = getCacheDir('blocks');
        const tempPath = yield download.npm({
            registry: opts.source.registry,
            name: opts.source.name,
        }, blockCacheDir);
        // if (fs.statSync(opts.target).isFile())
        const vueFile = new vfs.VueFile(opts.target);
        yield vueFile.open();
        if (!vueFile.isDirectory) {
            if (!vueFile.script)
                vueFile.script = 'export default {}\n';
            if (!vueFile.template)
                vueFile.template = '<div></div>\n';
            vueFile.transform();
            yield vueFile.save();
        }
        const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
        const dest = path.join(localBlocksPath, opts.name + '.vue');
        yield fs.ensureDir(localBlocksPath);
        yield fs.copy(tempPath, dest);
        yield fs.remove(path.join(dest, 'public'));
        yield fs.remove(path.join(dest, 'screenshots'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'README.md'));
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
                    const componentsProperties = componentsProperty.value.properties;
                    // 判断有没有重复的项，如果有则忽略，不覆盖
                    if (componentsProperties.find((property) => property.type === 'ObjectProperty' && property.key.name === componentName))
                        return;
                    componentsProperties.push(blockProperty);
                }
            },
        });
        const rootEl = vueFile.templateHandler.ast;
        rootEl.children.unshift(compiler.compile(`<${opts.name}></${opts.name}>`).ast);
        yield vueFile.save();
    });
}
exports.addBlock = addBlock;
function removeBlock(vueFilePath, baseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(vueFilePath);
        yield vueFile.open();
        if (!vueFile.isDirectory)
            return;
        vueFile.parseScript();
        vueFile.parseTemplate();
        const relativePath = './blocks/' + baseName + '.vue';
        const { componentName } = utils.normalizeName(baseName);
        const body = vueFile.scriptHandler.ast.program.body;
        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (node.type === 'ImportDeclaration') {
                node.source.value === relativePath;
                body.splice(i, 1);
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
                    if (!componentsProperty)
                        return;
                    const properties = componentsProperty.value.properties;
                    for (let i = 0; i < properties.length; i++) {
                        const property = properties[i];
                        if (property.type === 'ObjectProperty' && property.key.name === componentName)
                            properties.splice(i, 1);
                    }
                }
            },
        });
        // const rootEl = vueFile.templateHandler.ast;
        // rootEl
        vueFile.templateHandler.traverse((nodePath) => {
            if (nodePath.node.tag === baseName)
                nodePath.remove();
        });
        yield vueFile.save();
        const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
        const dest = path.join(localBlocksPath, baseName + '.vue');
        yield fs.remove(dest);
        return vueFile;
    });
}
exports.removeBlock = removeBlock;
function createComponentPackage(dir, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tplPath = yield fetchLatestComponentTemplate();
        const baseName = path.basename(options.name, path.extname(options.name));
        if (path.extname(options.name) !== '.vue')
            options.name = baseName + '.vue';
        options.componentName = utils.kebab2Camel(baseName);
        options.tagName = baseName;
        const dest = vfs.handleSame(dir, baseName);
        yield fs.copy(tplPath, dest);
        yield formatTemplate(dest, options);
        const _packageJSONPath = path.resolve(dest, '_package.json');
        const packageJSONPath = path.resolve(dest, 'package.json');
        if (fs.existsSync(_packageJSONPath))
            yield fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
        if (fs.existsSync(packageJSONPath)) {
            const pkg = JSON.parse(yield fs.readFile(packageJSONPath, 'utf8'));
            pkg.vusion = pkg.vusion || {};
            pkg.vusion.title = options.title || pkg.vusion.title;
            pkg.vusion.category = options.category || pkg.vusion.category;
            pkg.vusion.access = options.access || pkg.vusion.access;
            pkg.vusion.team = options.team || pkg.vusion.team;
            yield fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
        }
        return dest;
    });
}
exports.createComponentPackage = createComponentPackage;
function createMultiFile(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(componentName);
        const dest = vfs.handleSame(dirPath, normalized.baseName);
        const tplPath = yield fetchLatestComponentTemplate();
        yield fs.copy(tplPath, dest);
        yield fs.remove(path.join(dest, 'docs'));
        yield fs.remove(path.join(dest, '_package.json'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'api.yaml'));
        yield formatTemplate(dest, {
            tagName: normalized.baseName,
            componentName: normalized.componentName,
        });
        return dest;
    });
}
exports.createMultiFile = createMultiFile;
function createMultiFileWithSubdocs(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(componentName);
        const dest = vfs.handleSame(dirPath, normalized.baseName);
        const tplPath = yield fetchLatestComponentTemplate();
        yield fs.copy(tplPath, dest);
        // await fs.remove(path.join(dest, 'docs'));
        yield fs.remove(path.join(dest, '_package.json'));
        yield fs.remove(path.join(dest, 'package.json'));
        // await fs.remove(path.join(dest, 'api.yaml'));
        yield formatTemplate(dest, {
            tagName: normalized.baseName,
            componentName: normalized.componentName,
            title: '请输入标题',
        });
        return dest;
    });
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
//# sourceMappingURL=index.js.map