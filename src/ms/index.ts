import * as path from 'path';
import * as babel from '@babel/core';
import * as compiler from 'vue-template-compiler';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as vfs from '../fs';
import * as utils from '../utils';
import * as rc from '../rc';
import * as download from './download';
import * as _ from 'lodash';

import Block from './Block';
import Component from './Component';

export { download, Block, Component };

import axios, { AxiosInstance } from 'axios';
let platformAxios: AxiosInstance;
const getPlatformAxios = (): Promise<AxiosInstance> => {
    return new Promise((res, rej) => {
        if (platformAxios)
            return res(platformAxios);

        const config = rc.configurator.load();
        platformAxios = axios.create({
            baseURL: config.platform + '/internal',
            headers: {
                'access-token': config.access_token,
            }
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

/**
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
                ExportDefaultDeclaration(nodePath) {
                    const declaration = nodePath.node.declaration;
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

        await jsFile.save();
    }
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

export async function createBlockPackage(dir: string, options: {
    name: string, // packageName
    title?: string,
    category?: string,
    access?: string,
    team?: string,
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
        pkg.vusion.access = options.access || pkg.vusion.access;
        pkg.vusion.team = options.team || pkg.vusion.team;
        await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
    }
    return dest;
}

export async function addBlock(options: MaterialOptions) {
    const opts = processOptions(options);

    // if (opts.source.type === 'npm')
    const blockCacheDir = getCacheDir('blocks');
    const tempPath = await download.npm({
        registry: opts.source.registry,
        name: opts.source.name,
    }, blockCacheDir);
    // if (fs.statSync(opts.target).isFile())
    const vueFile = new vfs.VueFile(opts.target);
    await vueFile.open();
    if (!vueFile.isDirectory) {
        if (!vueFile.script)
            vueFile.script = 'export default {}\n';
        if (!vueFile.template)
            vueFile.template = '<div></div>\n';
        vueFile.transform();
        await vueFile.save();
    }

    const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
    const dest = path.join(localBlocksPath, opts.name + '.vue');
    await fs.ensureDir(localBlocksPath);
    await fs.copy(tempPath, dest);
    await fs.remove(path.join(dest, 'public'));
    await fs.remove(path.join(dest, 'screenshots'));
    await fs.remove(path.join(dest, 'package.json'));
    await fs.remove(path.join(dest, 'README.md'));

    vueFile.parseScript();
    vueFile.parseTemplate();

    const relativePath = './blocks/' + opts.name + '.vue';
    const { componentName } = utils.normalizeName(opts.name);

    const body = vueFile.scriptHandler.ast.program.body;
    for (let i = 0; i < body.length; i++) {
        const node = body[i];
        if (node.type !== 'ImportDeclaration') {
            const importDeclaration = babel.template(`import ${componentName} from '${relativePath}'`)() as babel.types.ImportDeclaration;
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
                ]
                let componentsProperty = declaration.properties.find((property, index) => {
                    if (property.type === 'ObjectProperty' && propertiesBefore.includes(property.key.name))
                        pos = index;
                    return property.type === 'ObjectProperty' && property.key.name === 'components';
                }) as babel.types.ObjectProperty;

                const blockProperty = babel.types.objectProperty(babel.types.identifier(componentName), babel.types.identifier(componentName));

                if (!componentsProperty) {
                    componentsProperty = babel.types.objectProperty(babel.types.identifier('components'), babel.types.objectExpression([]));
                    declaration.properties.splice(pos, 0, componentsProperty);
                }

                const componentsProperties = (componentsProperty.value as babel.types.ObjectExpression).properties;
                // 判断有没有重复的项，如果有则忽略，不覆盖
                if (componentsProperties.find((property) => property.type === 'ObjectProperty' && property.key.name === componentName))
                    return;
                componentsProperties.push(blockProperty);
            }
        },
    });

    const rootEl = vueFile.templateHandler.ast;
    rootEl.children.unshift(compiler.compile(`<${opts.name}></${opts.name}>`).ast);

    await vueFile.save();
}

export async function removeBlock(vueFilePath: string, baseName: string) {
    const vueFile = new vfs.VueFile(vueFilePath);
    await vueFile.open();
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
                ]
                let componentsProperty = declaration.properties.find((property, index) => {
                    if (property.type === 'ObjectProperty' && propertiesBefore.includes(property.key.name))
                        pos = index;
                    return property.type === 'ObjectProperty' && property.key.name === 'components';
                }) as babel.types.ObjectProperty;
                if (!componentsProperty)
                    return;

                const properties = (componentsProperty.value as babel.types.ObjectExpression).properties;
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
        if ((nodePath.node as compiler.ASTElement).tag === baseName)
            nodePath.remove();
    });

    await vueFile.save();

    const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
    const dest = path.join(localBlocksPath, baseName + '.vue');
    await fs.remove(dest);
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

export async function createMultiFile(dirPath: string, componentName?: string) {
    const normalized = utils.normalizeName(componentName);
    const dest = vfs.handleSame(dirPath, normalized.baseName);

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

export async function createMultiFileWithSubdocs(dirPath: string, componentName?: string) {
    const normalized = utils.normalizeName(componentName);
    const dest = vfs.handleSame(dirPath, normalized.baseName);

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
