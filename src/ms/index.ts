import * as path from 'path';
import * as babel from '@babel/core';
import * as compiler from 'vue-template-compiler';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as vfs from '../fs';
import * as designer from '../designer';
import * as utils from '../utils';
import * as rc from '../rc';
import * as download from './download';
import * as _ from 'lodash';
import * as FormData from 'form-data';
import * as semver from 'semver';

import Block from './Block';
import Component from './Component';
import Template from './Template';

export { download, Block, Component, Template };

import axios, { AxiosInstance } from 'axios';
let platformAxios: AxiosInstance;
const getPlatformAxios = (prefix = '/internal'): Promise<AxiosInstance> => {
    return new Promise((res, rej) => {
        if (platformAxios)
            return res(platformAxios);

        const config = rc.configurator.load();
        platformAxios = axios.create({
            baseURL: config.platform + prefix,
            headers: {
                'access-token': config.access_token,
            },
            maxContentLength: 1024 * 1024 * 50,
        });
        res(platformAxios);
    });
}

export function getCacheDir(subPath: string = '') {
    const cacheDir = path.join(os.homedir(), '.vusion', subPath);
    if (!fs.existsSync(cacheDir))
        fs.ensureDirSync(cacheDir);
    return cacheDir;
}

export function getRunControl() {
    const rcPath = path.join(os.homedir(), '.vusion');
    return rcPath;
}

export interface FormFile {
    name: string,
    path: string,
    [prop: string]: any,
};

export const upload = {
    getFormData(files: string | FormFile | Array<string | FormFile>): FormData {
        if (!Array.isArray(files))
            files = [files];
        files = files.map((file) => {
            if (typeof file === 'string')
                return { name: path.basename(file), path: file };
            else
                return file;
        });
        const formData = new FormData();
        files.forEach((file: FormFile, index: number) => {
            formData.append('files', fs.createReadStream(file.path), {
                filepath: file.name, // filepath 在 Form 提交的时候是 name
            });
        });
        return formData;
    },
    async nos(files: string | FormFile | Array<string | FormFile>) {
        const formData = upload.getFormData(files);
        const pfAxios = await getPlatformAxios();
        return pfAxios.post('nos/upload', formData, {
            headers: formData.getHeaders(),
        }).then((res) => res.data);
    },
    async micro(files: string | FormFile | Array<string | FormFile>, prefix?: string) {
        const formData = upload.getFormData(files);
        const pfAxios = await getPlatformAxios(prefix);
        return pfAxios.post('micro/upload', formData, {
            headers: formData.getHeaders(),
        }).then((res) => res.data);
    },
    async framework(files: string | FormFile | Array<string | FormFile>, framework: string) {
        const formData = upload.getFormData(files);
        formData.append('ui', framework);
        const pfAxios = await getPlatformAxios();
        return pfAxios.post('framework/upload', formData, {
            headers: formData.getHeaders(),
        }).then((res) => res.data);
    },
}

/**
 * 获取最新的区块模板
 */
export async function fetchLatestBlockTemplate() {
    const cacheDir = getCacheDir('templates');
    return download.npm({
        registry: rc.configurator.getDownloadRegistry(),
        name: '@vusion-templates/block',
    }, cacheDir);
}

/**
 * 获取最新的组件模板
 */
export async function fetchLatestComponentTemplate() {
    const cacheDir = getCacheDir('templates');
    return download.npm({
        registry: rc.configurator.getDownloadRegistry(),
        name: '@vusion-templates/component',
    }, cacheDir);
}

const defaultFormatter = (content: string, params: object) => {
    return _.template(content)(params);
}

export async function formatTemplate(src: string, params: object = {}, formatter: (content: string, params: object) => string = defaultFormatter) {
    return Promise.all(vfs.listAllFiles(src, {
        type: 'file',
        dot: true,
        patterns: ['!**/node_modules', '!**/.git'],
    }).map((filePath) => {
        return fs.readFile(filePath, 'utf8').then((content) => {
            try {
                content = formatter(content, params);
            } catch(e) {
                throw new Error(filePath + '\n' + e);
            }
            return fs.writeFile(filePath, content);
        });
    }));
}

export function formatTemplateTo(src: string, dest: string, params: object = {}, formatter: (content: string, params: object) => string = defaultFormatter) {
    return Promise.all(vfs.listAllFiles(src, {
        type: 'file',
        dot: true,
        patterns: ['!**/node_modules', '!**/.git'],
    }).map((filePath) => {
        return fs.readFile(filePath, 'utf8').then((content) => {
            try {
                content = formatter(content, params);
            } catch(e) {
                throw new Error(filePath + '\n' + e);
            }
            return fs.outputFile(path.join(dest, path.relative(src, filePath)), content);
        });
    }));
}

export interface MaterialSource {
    type: string,
    registry: string,
    name: string, // source.name, npm name, repo name
    path?: string,
    version?: string,
    commit?: string,
    fileName?: string,
    baseName?: string,
};

export interface MaterialOptions {
    /**
     * file: ./templates/moduleA
     * file: /Users/alice/templates/moduleA
     * npm: s-basic-form
     * npm: s-basic-form.vue
     * npm: s-basic-form.vue@0.3.2
     * disable: npm: s-basic-form.vue@0.3.2:some/directory
     * npm: @cloud-ui/s-basic-form.vue
     * npm: @cloud-ui/s-basic-form.vue:some/directory
     * cnpm: cnpm:@cloud-ui/s-basic-form.vue
     * nnpm: nnpm:@cloud-ui/s-basic-form.vue
     * github: github:user/repo
     * disable: gitlab: gitlab:user/repo#master:some/directory
     */
    source: string | MaterialSource,
    target: string,
    name: string,
    title?: string,
};

export interface ProcessedMaterialOptions {
    /**
     * file: ./templates/moduleA
     * file: /Users/alice/templates/moduleA
     * npm: s-basic-form
     * npm: s-basic-form.vue
     * npm: s-basic-form.vue@0.3.2
     * disable: npm: s-basic-form.vue@0.3.2:some/directory
     * npm: @cloud-ui/s-basic-form.vue
     * npm: @cloud-ui/s-basic-form.vue:some/directory
     * cnpm: cnpm:@cloud-ui/s-basic-form.vue
     * nnpm: nnpm:@cloud-ui/s-basic-form.vue
     * github: github:user/repo
     * disable: gitlab: gitlab:user/repo#master:some/directory
     */
    source: MaterialSource,
    target: string,
    name: string,
    title?: string,
};

export function processOptions(options: MaterialOptions): ProcessedMaterialOptions {
    const result: ProcessedMaterialOptions = {
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
    } else {
        const repoRE = /^\w+:/;
        const cap = repoRE.exec(source);
        if (cap) {
            result.source.type = cap[0].slice(0, -1);
            source = source.slice(cap[0].length);
        } else
            result.source.type = 'npm';

        const arr = source.split(':');
        result.source.path = arr[1];
        let name = arr[0];
        if (name.includes('#')) {
            const arr2 = name.split('#');
            result.source.name = arr2[0];
            result.source.commit = arr2[1];
        } else if (name.includes('@')) {
            const arr2 = name.split('@');
            result.source.name = arr2[0];
            result.source.version = arr2[1];
        } else {
            result.source.name = name;
        }

        const fileName = result.source.fileName = path.basename(result.source.name);
        result.source.baseName = path.basename(fileName, path.extname(fileName));
    }

    return result;
}

export async function getTemplate(packageName: string): Promise<Template> {
    const pfAxios = await getPlatformAxios();
    return pfAxios.get('template/info', {
        params: {
            name: packageName,
        },
    }).then((res) => {
        const template = res.data.result;
        return template;
    });
}

export async function getBlock(packageName: string): Promise<Block> {
    const pfAxios = await getPlatformAxios();
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
}

export async function getBlocks(): Promise<Block[]> {
    const pfAxios = await getPlatformAxios();
    return pfAxios.get('block/list')
        .then((res) => {
            const blocks = res.data.result.rows as Block[];
            blocks.forEach((block) => {
                const fileName = path.basename(block.name);
                block.tagName = path.basename(fileName, path.extname(fileName));
                block.componentName = utils.kebab2Camel(block.tagName);
            });
            return blocks;
        });
}

export async function getComponent(packageName: string): Promise<Component> {
    const pfAxios = await getPlatformAxios();
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
}

export async function getComponents(): Promise<Component[]> {
    const pfAxios = await getPlatformAxios();
    return pfAxios.get('component/list')
        .then((res) => {
            const components = res.data.result.rows as Component[];
            components.forEach((component) => {
                const fileName = path.basename(component.name);
                component.tagName = path.basename(fileName, path.extname(fileName));
                component.componentName = utils.kebab2Camel(component.tagName);
            });
            return components;
        });
}

export async function teamExist(teamName: string) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.get('team/exist', { params: { teamName } })
        .then((res) => res.data.result.isExist);
}

export async function publishBlock(params: object) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.post('block/publish', params)
        .then((res) => res.data);
}

export async function publishComponent(params: object) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.post('component/publish', params)
        .then((res) => res.data);
}

export async function publishTemplate(params: object) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.post('template/publish', params)
        .then((res) => res.data);
}

export async function recordMicroVersionURL(data: object, params: object, prefix?: string) {
    const pfAxios = await getPlatformAxios(prefix);
    return pfAxios.post('app/addAppVersion', data, params)
        .then((res) => res.data);
}

export async function recordMicroAppVersion(params: object) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.post('micro/app/version/create', params)
        .then((res) => res.data);
}

export async function refreshMicroVersion(params: object) {
    const pfAxios = await getPlatformAxios();
    return pfAxios.post('micro/relation/updateApp', params)
        .then((res) => res.data);
}

export async function createBlockPackage(dir: string, options: {
    name: string, // packageName
    title?: string,
    category?: string,
    team?: string,
    access?: string,
    inVusionProject?: boolean,
    [prop: string]: string | boolean,
}) {
    const tplPath = await fetchLatestBlockTemplate();

    const baseName = path.basename(options.name, path.extname(options.name));
    if (path.extname(options.name) !== '.vue')
        options.name = baseName + '.vue';
    options.componentName = utils.kebab2Camel(baseName);
    options.tagName = baseName;

    const dest = vfs.handleSame(dir, baseName);
    await fs.copy(tplPath, dest);
    await formatTemplate(dest, options);

    const _packageJSONPath = path.resolve(dest, '_package.json');
    const packageJSONPath = path.resolve(dest, 'package.json');
    if (fs.existsSync(_packageJSONPath))
        await fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
    if (fs.existsSync(packageJSONPath)) {
        const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
        pkg.vusion = pkg.vusion || {};
        pkg.vusion.title = options.title || pkg.vusion.title;
        pkg.vusion.category = options.category || pkg.vusion.category;
        pkg.vusion.team = options.team || pkg.vusion.team;
        pkg.vusion.access = options.access || pkg.vusion.access;
        await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
    }
    return dest;
}

export async function fetchBlock(options: MaterialOptions) {
    const opts = processOptions(options);

    const blockCacheDir = getCacheDir('blocks');
    return await download.npm({
        registry: opts.source.registry,
        name: opts.source.name,
    }, blockCacheDir);
}

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
export async function addBlockExternally(blockVue: vfs.VueFile, target: string, name: string) {
    /* 调用前先保证 vueFile 已保存 */

    const vueFile = new vfs.VueFile(target);
    await vueFile.open();

    /* 写区块文件 */
    const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
    const dest = path.join(localBlocksPath, name + '.vue');
    await fs.ensureDir(localBlocksPath);
    const isDirectory = blockVue.hasAssets() || blockVue.hasExtra();
    blockVue = await blockVue.saveAs(dest, isDirectory);

    if (isDirectory) {
        const files = await fs.readdir(dest);
        await Promise.all(files.filter((file) => {
            return file[0] === '.' || BLOCK_REMOVING_LIST.includes(file);
        }).map((file) => fs.remove(path.join(dest, file))));
    }

    /* 添加 import */
    const relativePath = `./${vueFile.baseName}.blocks/${name}.vue`;
    const { componentName } = utils.normalizeName(name);
    const $js = vueFile.parseScript();
    $js.import(componentName).from(relativePath);
    $js.export().default().object()
        .after(['el','name','parent','functional','delimiters','comments'])
        .ensure('components', '{}')
        .get('components')
        .set(componentName, componentName);

    await vueFile.save();

    return blockVue;
}

/**
 * For vusion cli
 */
export async function addBlock(options: MaterialOptions) {
    const opts = processOptions(options);

    const blockPath = await fetchBlock(options);
    let blockVue = new vfs.VueFile(blockPath.replace(/\.vue@.+$/, '.vue'));
    blockVue.fullPath = blockPath;
    await blockVue.open();

    addBlockExternally(blockVue, opts.target, opts.name);
}

export async function removeBlock(vueFilePath: string, baseName: string) {
    const vueFile = new vfs.VueFile(vueFilePath);
    await vueFile.open();

    const $js = vueFile.parseScript();
    const relativePath = `./${vueFile.baseName}.blocks/${baseName}.vue`;
    const { componentName } = utils.normalizeName(baseName);

    $js.froms().delete(relativePath);
    const obj = vueFile.$js.export().default().object().get('components');
    obj && obj.delete(componentName);

    vueFile.parseTemplate();
    vueFile.templateHandler.traverse((nodeInfo) => {
        if ((nodeInfo.node as compiler.ASTElement).tag === baseName)
            nodeInfo.remove();
    });

    await vueFile.save();

    const localBlocksPath = vueFile.fullPath.replace(/\.vue$/, '.blocks');
    const dest = path.join(localBlocksPath, baseName + '.vue');
    await fs.remove(dest);

    return vueFile;
}

export async function createComponentPackage(dir: string, options: {
    name: string, // packageName
    title?: string,
    category?: string,
    access?: string,
    team?: string,
    inVusionProject?: boolean,
    [prop: string]: string | boolean,
}) {
    const tplPath = await fetchLatestComponentTemplate();

    const baseName = path.basename(options.name, path.extname(options.name));
    if (path.extname(options.name) !== '.vue')
        options.name = baseName + '.vue';
    options.componentName = utils.kebab2Camel(baseName);
    options.tagName = baseName;

    const dest = vfs.handleSame(dir, baseName);
    await fs.copy(tplPath, dest);
    await formatTemplate(dest, options);

    const _packageJSONPath = path.resolve(dest, '_package.json');
    const packageJSONPath = path.resolve(dest, 'package.json');
    if (fs.existsSync(_packageJSONPath))
        await fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
    if (fs.existsSync(packageJSONPath)) {
        const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
        pkg.vusion = pkg.vusion || {};
        pkg.vusion.title = options.title || pkg.vusion.title;
        pkg.vusion.category = options.category || pkg.vusion.category;
        pkg.vusion.access = options.access || pkg.vusion.access;
        pkg.vusion.team = options.team || pkg.vusion.team;
        await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
    }
    return dest;
}

export async function createMultiFile(dir: string, componentName?: string) {
    const normalized = utils.normalizeName(componentName);
    const dest = vfs.handleSame(dir, normalized.baseName);

    const tplPath = await fetchLatestComponentTemplate();
    await fs.copy(tplPath, dest);
    await fs.remove(path.join(dest, 'docs'));
    await fs.remove(path.join(dest, '_package.json'));
    await fs.remove(path.join(dest, 'package.json'));
    await fs.remove(path.join(dest, 'api.yaml'));
    await formatTemplate(dest, {
        tagName: normalized.baseName,
        componentName: normalized.componentName,
    });

    return dest;
}

export async function createMultiFileWithSubdocs(dir: string, componentName?: string) {
    const normalized = utils.normalizeName(componentName);
    const dest = vfs.handleSame(dir, normalized.baseName);

    const tplPath = await fetchLatestComponentTemplate();
    await fs.copy(tplPath, dest);
    // await fs.remove(path.join(dest, 'docs'));
    await fs.remove(path.join(dest, '_package.json'));
    await fs.remove(path.join(dest, 'package.json'));
    // await fs.remove(path.join(dest, 'api.yaml'));
    await formatTemplate(dest, {
        tagName: normalized.baseName,
        componentName: normalized.componentName,
        title: '请输入标题',
    });

    return dest;
}

/**
 * @deprecated
 * 从业务模板中添加模块
 */
export async function addModule(options: MaterialOptions) {
    const opts = processOptions(options);

    const moduleCacheDir = getCacheDir('modules');
    await fs.emptyDir(moduleCacheDir);
    if (opts.source.type === 'file') {
        const temp = path.resolve(moduleCacheDir, opts.source.fileName + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
        const dest = path.resolve(opts.target, opts.name);

        // 先在临时文件地方处理掉，防止 Webpack 加载多次
        await fs.copy(path.resolve(opts.source.path), temp);
        await formatTemplate(moduleCacheDir, {
            name: opts.name,
            camelName: utils.kebab2Camel(opts.name),
            title: opts.title,
        });
        await fs.move(temp, dest);

        // 修改 modules.order 配置
        const modulesOrderPath = path.resolve(opts.target, 'modules.order.js');
        if (fs.existsSync(modulesOrderPath)) {
            const jsFile = new vfs.JSFile(modulesOrderPath);
            await jsFile.open();
            jsFile.parse();

            let changed = false;
            babel.traverse(jsFile.handler.ast, {
                ExportDefaultDeclaration(nodeInfo) {
                    const declaration = nodeInfo.node.declaration;
                    if (declaration && declaration.type === 'ArrayExpression') {
                        const element = Object.assign(
                            babel.types.stringLiteral(opts.name),
                            { raw: `'${opts.name}'` },
                        );
                        declaration.elements.push(element);
                        changed = true;
                    }
                }
            });

            if (changed)
                await jsFile.save();
        }
    }
}

/**
 * @deprecated
 * @param options
 */
export async function removeModule(options: MaterialOptions) {
    const dest = path.resolve(options.target, options.name);
    await fs.remove(dest);

    // 修改 modules.order 配置
    const modulesOrderPath = path.resolve(options.target, 'modules.order.js');
    if (fs.existsSync(modulesOrderPath)) {
        const jsFile = new vfs.JSFile(modulesOrderPath);
        await jsFile.open();
        jsFile.parse();

        let changed = false;
        babel.traverse(jsFile.handler.ast, {
            ExportDefaultDeclaration(nodeInfo) {
                const declaration = nodeInfo.node.declaration;
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

        await jsFile.save();
    }
}

/**
 * @deprecated
 */
export async function addLeafView(parent: vfs.View, name: string, title: string, ext: string = '.vue') {
    return designer.addLeafView(parent, { name, title, ext });
}

/**
 * @deprecated
 */
export async function addLeafViewFromBlock(source: MaterialSource, parent: vfs.View, name: string, title: string) {
    // parent view 必然是个目录
    const dest = vfs.handleSame(path.join(parent.fullPath, parent.viewsPath), name);

    const blockCacheDir = getCacheDir('blocks');
    const tempPath = await download.npm({
        registry: source.registry,
        name: source.name,
    }, blockCacheDir);

    await fs.copy(tempPath, dest);
    await fs.remove(path.join(dest, 'public'));
    await fs.remove(path.join(dest, 'screenshots'));
    await fs.remove(path.join(dest, 'package.json'));
    await fs.remove(path.join(dest, 'README.md'));

    const vueFile = new vfs.VueFile(dest);
    await vueFile.preOpen();

    if (vueFile.checkTransform() === true) {
        await vueFile.open();
        vueFile.transform();
        await vueFile.save();
    }

    // 目前只支持在 module 层添加路由
    let module = parent;
    while (module && module.viewType !== vfs.ViewType.module)
        module = module.parent;
    if (!module)
        return;
    await designer.addLeafViewRoute(parent, module, { name, title });
    return dest;
}

export async function addBranchView(parent: vfs.View, name: string, title: string, ext: string = '.vue') {
    return designer.addBranchView(parent, { name, title, ext });
}

/**
 * @deprecated
 */
export async function addBranchViewFromBlock(source: MaterialSource, parent: vfs.View, name: string, title: string) {
    // parent view 必然是个目录
    const dir = path.join(parent.fullPath, parent.viewsPath, name);

    const tplPath = path.resolve(__dirname, '../../templates/branch-view');
    await fs.copy(tplPath, dir);

    const dest = path.join(dir, 'index.vue');
    const blockCacheDir = getCacheDir('blocks');
    const tempPath = await download.npm({
        registry: source.registry,
        name: source.name,
    }, blockCacheDir);

    await fs.remove(dest);
    await fs.copy(tempPath, dest);
    await fs.remove(path.join(dest, 'public'));
    await fs.remove(path.join(dest, 'screenshots'));
    await fs.remove(path.join(dest, 'package.json'));
    await fs.remove(path.join(dest, 'README.md'));

    const vueFile = new vfs.VueFile(dest);
    await vueFile.preOpen();

    if (vueFile.checkTransform() === true) {
        await vueFile.open();
        vueFile.transform();
        await vueFile.save();
    }

    // 目前只支持在 module 层添加路由
    let module = parent;
    while (module && module.viewType !== vfs.ViewType.module)
        module = module.parent;
    if (!module)
        return;
    await designer.addBranchViewRoute(parent, module, { name, title });
    return dest;
}

/**
 * @deprecated
 */
export async function addBranchWrapper(parent: vfs.View, name: string, title: string) {
    // 目前只支持在 module 层添加路由
    let module = parent;
    while (module && module.viewType !== vfs.ViewType.module)
        module = module.parent;
    if (!module)
        return;

    return designer.addBranchWrapper(parent, module, { name, title });
}

/**
 * @deprecated
 */
export async function removeLeafView(view: vfs.View) {
    return designer.removeView(view);
}

/**
 * vusion install，默认安装到 vusion_packages
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param cwd 项目目录
 */
export async function install(info: {
    registry: string, name: string, version?: string,
}, cwd?: string, save: boolean = true) {
    const registry = info.registry || 'https://registry.npmjs.org';
    const version = info.version;
    const data = (await axios.get(`${registry}/${info.name}`)).data;
    const versions = Object.keys(data.versions).reverse();

    // 获取项目下 package.json 的信息
    cwd = cwd || process.cwd();
    const cwdPkgPath = path.resolve(cwd, 'package.json');
    let cwdPkgInfo: any = {};
    if (fs.existsSync(cwdPkgPath))
        cwdPkgInfo = JSON.parse(await fs.readFile(cwdPkgPath, 'utf8'));
    const vusionDeps: { [name: string]: string } = cwdPkgInfo.vusionDependencies = cwdPkgInfo.vusionDependencies || {};

    // 计算最合适的版本
    const currentSemver = vusionDeps[info.name];
    let versionToInstall: string; // 需要安装的版本
    if (version) { // 如果有明确的安装版本要求，按版本要求装
        if (/^[0-9.]/.test(version))
            versionToInstall = version;
        else
            versionToInstall = data['dist-tags'][version];
    } else {
        if (currentSemver) { // 如果没有版本要求，但在项目中已经配置信息，按项目中寻找最合适的版本
            for (const key of versions) {
                if (semver.satisfies(key, currentSemver)) {
                    versionToInstall = key;
                    break;
                }
            }
        } else { // 否则装最新版本
            versionToInstall = data['dist-tags'].latest || versions[0];
        }
    }

    const packagesDir = path.resolve(cwd, 'vusion_packages');
    const dest = path.join(packagesDir, info.name);
    const pkgPath = path.join(dest, 'package.json');
    let pkgInfo: { [name: string]: string };
    // 判断当前存在的包符不符合要求
    if (fs.existsSync(pkgPath))
        pkgInfo = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    
    if (!pkgInfo || pkgInfo.version !== versionToInstall) { // 需要重新下载的情况
        await fs.remove(dest);
        await download.npm({
            registry,
            name: info.name,
            version: versionToInstall,
        }, packagesDir, info.name, true);
        const pkgInfo = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    
        if (!pkgInfo.browser) {
            if (fs.existsSync(path.join(dest, 'dist-raw/index.js')))
                pkgInfo.browser = 'dist-raw/index.js';
            else if (fs.existsSync(path.join(dest, 'dist-theme/index.js')))
                pkgInfo.browser = 'dist-theme/index.js';
            else if (fs.existsSync(path.join(dest, 'dist/index.js')))
                pkgInfo.browser = 'dist/index.js';
    
            await fs.writeFile(pkgPath, JSON.stringify(pkgInfo, null, 2));
        }
    }

    if (save) { // 这里的策略和原生的略有不同，就是始终会将依赖保持到最新
        vusionDeps[info.name] = '^' + versionToInstall;
        await fs.writeFile(cwdPkgPath, JSON.stringify(cwdPkgInfo, null, 2));
    }

    return info.name + '@' + versionToInstall;
}