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
const FormData = require("form-data");
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
exports.upload = {
    nos(files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(files))
                files = [files];
            files = files.map((file) => {
                if (typeof file === 'string')
                    return { filename: path.basename(file), filepath: file };
                else
                    return file;
            });
            const pfAxios = yield getPlatformAxios();
            const form = new FormData();
            files.forEach((file, index) => {
                form.append('file', fs.createReadStream(file.filepath), file);
            });
            return pfAxios.post('nos/upload', form, {
                headers: form.getHeaders(),
            }).then((res) => res.data);
        });
    },
};
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
function teamExist(teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('team/exist', { params: { teamName } })
            .then((res) => res.data.result.isExist);
    });
}
exports.teamExist = teamExist;
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
function recordMicroAppVersion(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('micro/app/version/create', params)
            .then((res) => res.data);
    });
}
exports.recordMicroAppVersion = recordMicroAppVersion;
function refreshMicroVersion(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('micro/relation/updateApp', params)
            .then((res) => res.data);
    });
}
exports.refreshMicroVersion = refreshMicroVersion;
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
            pkg.vusion.team = options.team || pkg.vusion.team;
            pkg.vusion.access = options.access || pkg.vusion.access;
            yield fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
        }
        return dest;
    });
}
exports.createBlockPackage = createBlockPackage;
function fetchBlock(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        const blockCacheDir = getCacheDir('blocks');
        return yield download.npm({
            registry: opts.source.registry,
            name: opts.source.name,
        }, blockCacheDir);
    });
}
exports.fetchBlock = fetchBlock;
function checkBlockOnlyHasTemplate(blockPath) {
    // const vueFile = new vfs.VueFile(blockPath);
    // await vueFile.open();
    const scriptPath = path.resolve(blockPath, 'index.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    if (script && script.trim().replace(/\s+/g, ' ').replace(/\{ \}/g, '{}') !== 'export default {};')
        return false;
    const moduleCSSPath = path.resolve(blockPath, 'module.css');
    if (!fs.existsSync(moduleCSSPath))
        return true;
    const style = fs.readFileSync(moduleCSSPath, 'utf8');
    if (style && style.trim().replace(/\s+/g, ' ').replace(/\{ \}/g, '{}') !== '.root {}')
        return false;
    return true;
}
exports.checkBlockOnlyHasTemplate = checkBlockOnlyHasTemplate;
// export async function addBlockTag
function addBlock(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        // if (opts.source.type === 'npm')
        const blockCacheDir = getCacheDir('blocks');
        const tempPath = yield download.npm({
            registry: opts.source.registry,
            name: opts.source.name,
        }, blockCacheDir);
        const vueFile = new vfs.VueFile(opts.target);
        yield vueFile.open();
        const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
        const dest = path.join(localBlocksPath, opts.name + '.vue');
        yield fs.ensureDir(localBlocksPath);
        yield fs.copy(tempPath, dest);
        yield fs.remove(path.join(dest, 'public'));
        yield fs.remove(path.join(dest, 'screenshots'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'README.md'));
        vueFile.parseScript();
        vueFile.parseTemplate();
        const relativePath = `./${vueFile.baseName}.blocks/${opts.name}.vue`;
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
function addBlockOnlyScripts(options, tempPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        // if (opts.source.type === 'npm')
        // const blockCacheDir = getCacheDir('blocks');
        // const tempPath = await download.npm({
        //     registry: opts.source.registry,
        //     name: opts.source.name,
        // }, blockCacheDir);
        const vueFile = new vfs.VueFile(opts.target);
        yield vueFile.open();
        const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
        const dest = path.join(localBlocksPath, opts.name + '.vue');
        yield fs.ensureDir(localBlocksPath);
        yield fs.copy(tempPath, dest);
        yield fs.remove(path.join(dest, 'public'));
        yield fs.remove(path.join(dest, 'screenshots'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'README.md'));
        vueFile.parseScript();
        vueFile.parseTemplate();
        const relativePath = `./${vueFile.baseName}.blocks/${opts.name}.vue`;
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
        // const rootEl = vueFile.templateHandler.ast;
        // rootEl.children.unshift(compiler.compile(`<${opts.name}></${opts.name}>`).ast);
        yield vueFile.save();
    });
}
exports.addBlockOnlyScripts = addBlockOnlyScripts;
function removeBlock(vueFilePath, baseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(vueFilePath);
        yield vueFile.open();
        vueFile.parseScript();
        vueFile.parseTemplate();
        const relativePath = `./${vueFile.baseName}.blocks/${baseName}.vue`;
        const { componentName } = utils.normalizeName(baseName);
        const body = vueFile.scriptHandler.ast.program.body;
        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (node.type === 'ImportDeclaration' && node.source.value === relativePath) {
                body.splice(i--, 1);
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
        const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
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
function createMultiFile(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(componentName);
        const dest = vfs.handleSame(dir, normalized.baseName);
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
function createMultiFileWithSubdocs(dir, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = utils.normalizeName(componentName);
        const dest = vfs.handleSame(dir, normalized.baseName);
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
function findRouteObjectAndParentArray(objectExpression, relativePath, createChildrenArrayIfNeeded = false, pos = 0) {
    const arr = Array.isArray(relativePath) ? relativePath : relativePath.split('/');
    if (arr[pos] === 'views')
        pos++;
    if (pos === arr.length)
        throw new Error('Route path error. Cannot find route: ' + arr.join('/'));
    const ext = path.extname(arr[arr.length - 1]);
    const nextName = arr[pos].replace(/\.[^.]*?$/, '');
    let childrenProperty = objectExpression.properties.find((property) => property.type === 'ObjectProperty' && property.key.name === 'children');
    if (!childrenProperty) {
        if (createChildrenArrayIfNeeded) {
            childrenProperty = babel.types.objectProperty(babel.types.identifier('children'), babel.types.arrayExpression([]));
            objectExpression.properties.push(childrenProperty);
        }
        else
            return { routeObject: undefined, parentArray: undefined };
    }
    const arrayExpression = childrenProperty.value;
    const routeObject = arrayExpression.elements.find((element) => {
        return ((element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty' && property.key.name === 'path' && property.value.type === 'StringLiteral' && property.value.value === nextName))
            || (element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty' && property.key.name === 'component' && property.value.type === 'ArrowFunctionExpression'
                && property.value.body.arguments[0].value === './' + arr.slice(0, pos + 1).join('/') + (arr[pos].endsWith(ext) ? '' : '/index' + ext))));
    });
    if (pos === arr.length - 1) {
        return { routeObject, parentArray: arrayExpression };
    }
    else {
        if (!routeObject)
            return { routeObject: undefined, parentArray: undefined };
        else
            return findRouteObjectAndParentArray(routeObject, arr, createChildrenArrayIfNeeded, pos + 1);
    }
}
exports.findRouteObjectAndParentArray = findRouteObjectAndParentArray;
function addLeafViewRoute(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        // 添加路由
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        jsFile.parse();
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, name + ext));
        let changed = false;
        babel.traverse(jsFile.handler.ast, {
            ExportDefaultDeclaration(nodePath) {
                const declaration = nodePath.node.declaration;
                if (declaration && declaration.type === 'ObjectExpression') {
                    const { routeObject, parentArray } = findRouteObjectAndParentArray(declaration, relativePath, true);
                    if (parentArray && !routeObject) {
                        const tpl = babel.parse(`[{
                        path: '${name}',
                        component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath}'),
                        ${title ? "meta: { title: '" + title + "' }," : ''}
                    }]`, {
                            plugins: [require('@babel/plugin-syntax-dynamic-import')]
                        });
                        const element = tpl.program.body[0].expression.elements[0];
                        parentArray.elements.push(element);
                        changed = true;
                    }
                }
            }
        });
        if (changed)
            yield jsFile.save();
        return;
    });
}
exports.addLeafViewRoute = addLeafViewRoute;
function addLeafView(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        // parent view 必然是个目录
        const dest = path.join(parent.fullPath, parent.viewsPath, name + ext);
        let tplPath;
        if (ext === '.vue')
            tplPath = path.resolve(__dirname, '../../templates/leaf-view.vue');
        else if (ext === '.md')
            tplPath = path.resolve(__dirname, '../../templates/leaf-view.md');
        yield fs.copy(tplPath, dest);
        yield addLeafViewRoute(parent, name, title, ext);
        return dest;
    });
}
exports.addLeafView = addLeafView;
function addLeafViewFromBlock(source, parent, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        // parent view 必然是个目录
        const dest = vfs.handleSame(path.join(parent.fullPath, parent.viewsPath), name);
        const blockCacheDir = getCacheDir('blocks');
        const tempPath = yield download.npm({
            registry: source.registry,
            name: source.name,
        }, blockCacheDir);
        yield fs.copy(tempPath, dest);
        yield fs.remove(path.join(dest, 'public'));
        yield fs.remove(path.join(dest, 'screenshots'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'README.md'));
        const vueFile = new vfs.VueFile(dest);
        yield vueFile.preOpen();
        if (vueFile.checkTransform() === true) {
            yield vueFile.open();
            vueFile.transform();
            yield vueFile.save();
        }
        yield addLeafViewRoute(parent, name, title);
        return dest;
    });
}
exports.addLeafViewFromBlock = addLeafViewFromBlock;
function addBranchViewRoute(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        // 添加路由
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        jsFile.parse();
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, name));
        let changed = false;
        babel.traverse(jsFile.handler.ast, {
            ExportDefaultDeclaration(nodePath) {
                const declaration = nodePath.node.declaration;
                if (declaration && declaration.type === 'ObjectExpression') {
                    const { routeObject, parentArray } = findRouteObjectAndParentArray(declaration, relativePath, true);
                    if (parentArray && !routeObject) {
                        const tpl = babel.parse(`[{
                        path: '${name}',
                        component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath + '/index' + ext}'),
                        ${title ? "meta: { title: '" + title + "' }," : ''}
                        children: [],
                    }]`, {
                            plugins: [require('@babel/plugin-syntax-dynamic-import')]
                        });
                        const element = tpl.program.body[0].expression.elements[0];
                        parentArray.elements.push(element);
                        changed = true;
                    }
                }
            }
        });
        if (changed)
            yield jsFile.save();
        return;
    });
}
exports.addBranchViewRoute = addBranchViewRoute;
function addBranchView(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, name);
        let tplPath;
        if (ext === '.vue')
            tplPath = path.resolve(__dirname, '../../templates/branch-view');
        else if (ext === '.md')
            tplPath = path.resolve(__dirname, '../../templates/branch-view-md');
        yield fs.copy(tplPath, dir);
        const dest = path.join(dir, 'index' + ext);
        yield addBranchViewRoute(parent, name, title, ext);
        return dest;
    });
}
exports.addBranchView = addBranchView;
function addBranchViewFromBlock(source, parent, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, name);
        const tplPath = path.resolve(__dirname, '../../templates/branch-view');
        yield fs.copy(tplPath, dir);
        const dest = path.join(dir, 'index.vue');
        const blockCacheDir = getCacheDir('blocks');
        const tempPath = yield download.npm({
            registry: source.registry,
            name: source.name,
        }, blockCacheDir);
        yield fs.remove(dest);
        yield fs.copy(tempPath, dest);
        yield fs.remove(path.join(dest, 'public'));
        yield fs.remove(path.join(dest, 'screenshots'));
        yield fs.remove(path.join(dest, 'package.json'));
        yield fs.remove(path.join(dest, 'README.md'));
        const vueFile = new vfs.VueFile(dest);
        yield vueFile.preOpen();
        if (vueFile.checkTransform() === true) {
            yield vueFile.open();
            vueFile.transform();
            yield vueFile.save();
        }
        yield addBranchViewRoute(parent, name, title);
        return dest;
    });
}
exports.addBranchViewFromBlock = addBranchViewFromBlock;
function addBranchWrapper(parent, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, name);
        const tplPath = path.resolve(__dirname, '../../templates/branch-view');
        yield fs.copy(tplPath, dir);
        let dest = path.join(dir, 'index.vue');
        yield fs.remove(dest);
        dest = path.dirname(dest);
        // 添加路由
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return dest;
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return dest;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        jsFile.parse();
        let hasImportedLWrapper = false;
        babel.traverse(jsFile.handler.ast, {
            ImportDefaultSpecifier(nodePath) {
                if (nodePath.node.local.name === 'LWrapper') {
                    hasImportedLWrapper = true;
                    nodePath.stop();
                }
            },
            ImportSpecifier(nodePath) {
                if (nodePath.node.local.name === 'LWrapper') {
                    hasImportedLWrapper = true;
                    nodePath.stop();
                }
            },
        });
        if (!hasImportedLWrapper) {
            const importDeclaration = babel.template(`import { LWrapper } from 'cloud-ui.vusion'`)();
            jsFile.handler.ast.program.body.unshift(importDeclaration);
        }
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, name));
        let changed = false;
        babel.traverse(jsFile.handler.ast, {
            ExportDefaultDeclaration(nodePath) {
                const declaration = nodePath.node.declaration;
                if (declaration && declaration.type === 'ObjectExpression') {
                    const { routeObject, parentArray } = findRouteObjectAndParentArray(declaration, relativePath, true);
                    if (parentArray && !routeObject) {
                        const tpl = babel.parse(`[{
                        path: '${name}',
                        component: LWrapper,
                        ${title ? "meta: { title: '" + title + "' }," : ''}
                        children: [],
                    }]`, {
                            plugins: [require('@babel/plugin-syntax-dynamic-import')]
                        });
                        const element = tpl.program.body[0].expression.elements[0];
                        parentArray.elements.push(element);
                        changed = true;
                    }
                }
            }
        });
        if (changed)
            yield jsFile.save();
        return dest;
    });
}
exports.addBranchWrapper = addBranchWrapper;
function removeLeafView(view) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (() => __awaiter(this, void 0, void 0, function* () {
            // const ext = path.extname(view.fullPath);
            let module = view.parent;
            while (module && module.viewType !== vfs.ViewType.module)
                module = module.parent;
            if (!module)
                return;
            const routesPath = path.join(module.fullPath, 'routes.js');
            if (!fs.existsSync(routesPath))
                return;
            const jsFile = new vfs.JSFile(routesPath);
            yield jsFile.open();
            jsFile.parse();
            const relativePath = path.relative(module.fullPath, view.fullPath);
            let changed = false;
            babel.traverse(jsFile.handler.ast, {
                ExportDefaultDeclaration(nodePath) {
                    const declaration = nodePath.node.declaration;
                    if (declaration && declaration.type === 'ObjectExpression') {
                        const { routeObject, parentArray } = findRouteObjectAndParentArray(declaration, relativePath, true);
                        if (routeObject) {
                            parentArray.elements.splice(parentArray.elements.indexOf(routeObject), 1);
                            // 判断是不是 LWrapper
                            const LWrapper = routeObject.properties.find((property) => property.type === 'ObjectProperty' && property.key.name === 'component' && property.value.type === 'Identifier' && property.value.name === 'LWrapper');
                            if (LWrapper) {
                                let wrapperCount = 0;
                                String(jsFile.content).replace(/LWrapper/, () => String(wrapperCount++));
                                if (wrapperCount === 2) {
                                    babel.traverse(jsFile.handler.ast, {
                                        ImportDefaultSpecifier(nodePath) {
                                            if (nodePath.node.local.name === 'LWrapper') {
                                                nodePath.remove();
                                                nodePath.stop();
                                            }
                                        },
                                        ImportSpecifier(nodePath) {
                                            if (nodePath.node.local.name === 'LWrapper') {
                                                nodePath.remove();
                                                nodePath.stop();
                                            }
                                        },
                                    });
                                }
                            }
                            changed = true;
                        }
                    }
                },
            });
            if (changed)
                yield jsFile.save();
        }))();
        yield fs.remove(view.fullPath);
    });
}
exports.removeLeafView = removeLeafView;
//# sourceMappingURL=index.js.map