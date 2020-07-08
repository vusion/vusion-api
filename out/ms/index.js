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
exports.install = exports.createMultiFileWithSubdocs = exports.createMultiFile = exports.createComponentPackage = exports.removeBlock = exports.addBlock = exports.addBlockExternally = exports.fetchBlock = exports.createBlockPackage = exports.refreshMicroVersion = exports.recordMicroAppVersion = exports.recordMicroVersionURL = exports.publishTemplate = exports.publishComponent = exports.publishBlock = exports.teamExist = exports.getComponents = exports.getComponent = exports.getBlocks = exports.getBlock = exports.getTemplate = exports.processOptions = exports.formatTemplateTo = exports.formatTemplate = exports.fetchLatestComponentTemplate = exports.fetchLatestBlockTemplate = exports.upload = exports.getRunControl = exports.getCacheDir = exports.download = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const os = __importStar(require("os"));
const vfs = __importStar(require("../fs"));
const utils = __importStar(require("../utils"));
const rc = __importStar(require("../rc"));
const download = __importStar(require("./download"));
exports.download = download;
const _ = __importStar(require("lodash"));
const FormData = require("form-data");
const semver = __importStar(require("semver"));
const axios_1 = __importDefault(require("axios"));
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
            return pfAxios.post('api/v1/nos/upload', formData, {
                headers: formData.getHeaders(),
            }).then((res) => res.data);
        });
    },
    micro(files, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = exports.upload.getFormData(files);
            const pfAxios = yield getPlatformAxios(prefix);
            return pfAxios.post('api/v1/micro/upload', formData, {
                headers: formData.getHeaders(),
            }).then((res) => res.data);
        });
    },
    framework(files, framework) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = exports.upload.getFormData(files);
            formData.append('ui', framework);
            const pfAxios = yield getPlatformAxios();
            return pfAxios.post('api/v1/framework/upload', formData, {
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
        return pfAxios.get('api/v1/template/info', {
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
        return pfAxios.get('api/v1/block/info', {
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
        return pfAxios.get('api/v1/block/list')
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
        return pfAxios.get('api/v1/component/info', {
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
        return pfAxios.get('api/v1/component/list')
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
        return pfAxios.get('api/v1/team/exist', { params: { teamName } })
            .then((res) => res.data.result.isExist);
    });
}
exports.teamExist = teamExist;
function publishBlock(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('api/v1/block/publish', params)
            .then((res) => res.data);
    });
}
exports.publishBlock = publishBlock;
function publishComponent(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('api/v1/component/publish', params)
            .then((res) => res.data);
    });
}
exports.publishComponent = publishComponent;
function publishTemplate(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('api/v1/template/publish', params)
            .then((res) => res.data);
    });
}
exports.publishTemplate = publishTemplate;
function recordMicroVersionURL(data, params, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios(prefix);
        return pfAxios.post('api/v1/app/addAppVersion', data, params)
            .then((res) => res.data);
    });
}
exports.recordMicroVersionURL = recordMicroVersionURL;
function recordMicroAppVersion(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('api/v1/micro/app/version/create', params)
            .then((res) => res.data);
    });
}
exports.recordMicroAppVersion = recordMicroAppVersion;
function refreshMicroVersion(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pfAxios = yield getPlatformAxios();
        return pfAxios.post('api/v1/micro/relation/updateApp', params)
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
        vueFile.templateHandler.traverse((nodeInfo) => {
            if (nodeInfo.node.tag === baseName)
                nodeInfo.remove();
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
 * vusion install，默认安装到 vusion_packages
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param cwd 项目目录
 */
function install(info, cwd, save = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const registry = info.registry || 'https://registry.npmjs.org';
        const version = info.version;
        const data = (yield axios_1.default.get(`${registry}/${info.name}`)).data;
        const versions = Object.keys(data.versions).reverse();
        // 获取项目下 package.json 的信息
        cwd = cwd || process.cwd();
        const cwdPkgPath = path.resolve(cwd, 'package.json');
        let cwdPkgInfo = {};
        if (fs.existsSync(cwdPkgPath))
            cwdPkgInfo = JSON.parse(yield fs.readFile(cwdPkgPath, 'utf8'));
        const vusionDeps = cwdPkgInfo.vusionDependencies = cwdPkgInfo.vusionDependencies || {};
        // 计算最合适的版本
        const currentSemver = vusionDeps[info.name];
        let versionToInstall; // 需要安装的版本
        if (version) { // 如果有明确的安装版本要求，按版本要求装
            if (/^[0-9.]/.test(version))
                versionToInstall = version;
            else
                versionToInstall = data['dist-tags'][version];
        }
        else {
            if (currentSemver) { // 如果没有版本要求，但在项目中已经配置信息，按项目中寻找最合适的版本
                for (const key of versions) {
                    if (semver.satisfies(key, currentSemver)) {
                        versionToInstall = key;
                        break;
                    }
                }
            }
            else { // 否则装最新版本
                versionToInstall = data['dist-tags'].latest || versions[0];
            }
        }
        const packagesDir = path.resolve(cwd, 'vusion_packages');
        const dest = path.join(packagesDir, info.name);
        const pkgPath = path.join(dest, 'package.json');
        let pkgInfo;
        // 判断当前存在的包符不符合要求
        if (fs.existsSync(pkgPath))
            pkgInfo = JSON.parse(yield fs.readFile(pkgPath, 'utf8'));
        if (!pkgInfo || pkgInfo.version !== versionToInstall) { // 需要重新下载的情况
            yield fs.remove(dest);
            yield download.npm({
                registry,
                name: info.name,
                version: versionToInstall,
            }, packagesDir, info.name, true);
            const pkgInfo = JSON.parse(yield fs.readFile(pkgPath, 'utf8'));
            if (!pkgInfo.browser) {
                if (fs.existsSync(path.join(dest, 'dist-raw/index.js')))
                    pkgInfo.browser = 'dist-raw/index.js';
                else if (fs.existsSync(path.join(dest, 'dist-theme/index.js')))
                    pkgInfo.browser = 'dist-theme/index.js';
                else if (fs.existsSync(path.join(dest, 'dist/index.js')))
                    pkgInfo.browser = 'dist/index.js';
                yield fs.writeFile(pkgPath, JSON.stringify(pkgInfo, null, 2));
            }
        }
        if (save) { // 这里的策略和原生的略有不同，就是始终会将依赖保持到最新
            vusionDeps[info.name] = '^' + versionToInstall;
            yield fs.writeFile(cwdPkgPath, JSON.stringify(cwdPkgInfo, null, 2));
        }
        return info.name + '@' + versionToInstall;
    });
}
exports.install = install;
//# sourceMappingURL=index.js.map