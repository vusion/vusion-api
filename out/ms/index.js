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
const designer = require("../designer");
const utils = require("../utils");
const rc = require("../rc");
const download = require("./download");
exports.download = download;
const _ = require("lodash");
const FormData = require("form-data");
const axios_1 = require("axios");
let platformAxios;
const getPlatformAxios = (prefix = '/internal') => {
    return new Promise((res, rej) => {
        if (platformAxios)
            return res(platformAxios);
        const config = rc.configurator.load();
        platformAxios = axios_1.default.create({
            baseURL: config.platform + prefix,
            headers: {
                'access-token': config.access_token,
            },
            maxContentLength: 1024 * 1024 * 50,
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
    getFormData(files) {
        if (!Array.isArray(files))
            files = [files];
        files = files.map((file) => {
            if (typeof file === 'string')
                return { name: path.basename(file), path: file };
            else
                return file;
        });
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('files', fs.createReadStream(file.path), {
                filepath: file.name,
            });
        });
        return formData;
    },
    nos(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = exports.upload.getFormData(files);
            const pfAxios = yield getPlatformAxios();
            return pfAxios.post('nos/upload', formData, {
                headers: formData.getHeaders(),
            }).then((res) => res.data);
        });
    },
    micro(files, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = exports.upload.getFormData(files);
            const pfAxios = yield getPlatformAxios(prefix);
            return pfAxios.post('micro/upload', formData, {
                headers: formData.getHeaders(),
            }).then((res) => res.data);
        });
    },
    framework(files, framework) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = exports.upload.getFormData(files);
            formData.append('ui', framework);
            const pfAxios = yield getPlatformAxios();
            return pfAxios.post('framework/upload', formData, {
                headers: formData.getHeaders(),
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
function getTemplate(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('template/info', {
            params: {
                name: packageName,
            },
        }).then((res) => {
            const template = res.data.result;
            return template;
        });
    });
}
exports.getTemplate = getTemplate;
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
function getComponent(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.get('component/info', {
            params: {
                name: packageName,
            },
        }).then((res) => {
            const component = res.data.result;
            const fileName = path.basename(component.name);
            component.tagName = path.basename(fileName, path.extname(fileName));
            component.componentName = utils.kebab2Camel(component.tagName);
            return component;
        });
    });
}
exports.getComponent = getComponent;
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
function recordMicroVersionURL(params, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios(prefix);
        return pfAxios.post('app/addAppVersion', params)
            .then((res) => res.data);
    });
}
exports.recordMicroVersionURL = recordMicroVersionURL;
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
const BLOCK_REMOVING_LIST = [
    'package.json',
    'node_modules',
    'assets',
    'docs',
    'public',
    'screenshots',
    'vetur',
];
/**
 * 添加代码为外部区块
 * @param blockVue 刚下载后的 Block Vue 文件
 * @param target 目标路径
 * @param name 区块名称
 */
function addBlockExternally(blockVue, target, name) {
    return __awaiter(this, void 0, void 0, function* () {
        /* 调用前先保证 vueFile 已保存 */
        const vueFile = new vfs.VueFile(target);
        yield vueFile.open();
        /* 写区块文件 */
        const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
        const dest = path.join(localBlocksPath, name + '.vue');
        yield fs.ensureDir(localBlocksPath);
        const isDirectory = blockVue.hasAssets() || blockVue.hasExtra();
        blockVue = yield blockVue.saveAs(dest, isDirectory);
        if (isDirectory) {
            const files = yield fs.readdir(dest);
            yield Promise.all(files.filter((file) => {
                return file[0] === '.' || BLOCK_REMOVING_LIST.includes(file);
            }).map((file) => fs.remove(path.join(dest, file))));
        }
        /* 添加 import */
        const relativePath = `./${vueFile.baseName}.blocks/${name}.vue`;
        const { componentName } = utils.normalizeName(name);
        const $js = vueFile.parseScript();
        $js.import(componentName).from(relativePath);
        $js.export().default().object()
            .after(['el', 'name', 'parent', 'functional', 'delimiters', 'comments'])
            .ensure('components', '{}')
            .get('components')
            .set(componentName, componentName);
        yield vueFile.save();
        return blockVue;
    });
}
exports.addBlockExternally = addBlockExternally;
/**
 * For vusion cli
 */
function addBlock(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        const blockPath = yield fetchBlock(options);
        let blockVue = new vfs.VueFile(blockPath.replace(/\.vue@.+$/, '.vue'));
        blockVue.fullPath = blockPath;
        yield blockVue.open();
        addBlockExternally(blockVue, opts.target, opts.name);
    });
}
exports.addBlock = addBlock;
function removeBlock(vueFilePath, baseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(vueFilePath);
        yield vueFile.open();
        const $js = vueFile.parseScript();
        const relativePath = `./${vueFile.baseName}.blocks/${baseName}.vue`;
        const { componentName } = utils.normalizeName(baseName);
        $js.froms().delete(relativePath);
        const obj = vueFile.$js.export().default().object().get('components');
        obj && obj.delete(componentName);
        vueFile.parseTemplate();
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
 * @deprecated
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
/**
 * @deprecated
 * @param options
 */
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
/**
 * @deprecated
 */
function addLeafView(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        return designer.addLeafView(parent, { name, title, ext });
    });
}
exports.addLeafView = addLeafView;
/**
 * @deprecated
 */
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
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
        yield designer.addLeafViewRoute(parent, module, { name, title });
        return dest;
    });
}
exports.addLeafViewFromBlock = addLeafViewFromBlock;
function addBranchView(parent, name, title, ext = '.vue') {
    return __awaiter(this, void 0, void 0, function* () {
        return designer.addBranchView(parent, { name, title, ext });
    });
}
exports.addBranchView = addBranchView;
/**
 * @deprecated
 */
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
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
        yield designer.addBranchViewRoute(parent, module, { name, title });
        return dest;
    });
}
exports.addBranchViewFromBlock = addBranchViewFromBlock;
/**
 * @deprecated
 */
function addBranchWrapper(parent, name, title) {
    return __awaiter(this, void 0, void 0, function* () {
        // 目前只支持在 module 层添加路由
        let module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
        return designer.addBranchWrapper(parent, module, { name, title });
    });
}
exports.addBranchWrapper = addBranchWrapper;
/**
 * @deprecated
 */
function removeLeafView(view) {
    return __awaiter(this, void 0, void 0, function* () {
        return designer.removeView(view);
    });
}
exports.removeLeafView = removeLeafView;
//# sourceMappingURL=index.js.map