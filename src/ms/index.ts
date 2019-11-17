import * as path from 'path';
import * as babel from '@babel/core';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as vfs from '../fs';
import * as utils from '../utils';
import * as compressing from 'compressing';


import axios from 'axios';
const platformAxios = axios.create({
    baseURL: 'http://akos.test.netease.com:7001/internal',
    headers: {
        'access_token': 'f2224e629a7e24423e6b1bf6f7a08ea0a549fb975bbd86b2111a9f74f2fa8bc3b66530a79a4cf910429595ba56a7bbbf34baacf843446f0f6ca2cc6ab961f360',
    }
});

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

export interface MaterialSource {
    type: string,
    registry: string,
    name: string, // source.name, npm name, repo name
    path: string,
    version?: string,
    commit?: string,
    fileName: string,
    baseName: string,
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
        const fileName = result.source.fileName = path.basename(result.source.name);
        result.source.baseName = path.basename(fileName, path.extname(fileName));
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

        await fs.copy(path.resolve(opts.source.path), temp);
        await vfs.batchReplace(vfs.listAllFiles(moduleCacheDir, {
            type: 'file',
        }), [
            [/sample/g, opts.name],
            [/Sample/g, utils.kebab2Camel(opts.name)],
            [/样本/g, opts.title],
        ]);
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

export async function getBlocks() {
    return platformAxios.get('block/list')
        .then((res) => res.data.result.rows);
}

export async function publishBlock(params: object) {
    return platformAxios.post('block/publish', params)
        .then((res) => res.data);
}

export async function createBlock(dir: string, name?: string, title?: string) {
    const normalized = utils.normalizeName(name);
    const dest = vfs.handleSame(dir, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../templates/s-block.vue'), dest);

    await vfs.batchReplace(vfs.listAllFiles(dest, {
        type: 'file',
    }), [
        [/s-block/g, normalized.baseName],
        [/SBlock/g, normalized.componentName],
        [/区块/g, title || '区块'],
    ]);
    return dest;
}

export async function createBlockInLibrary(dir: string, name?: string, title?: string) {
    const normalized = utils.normalizeName(name);
    const dest = vfs.handleSame(dir, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../templates/s-library-block.vue'), dest);

    await vfs.batchReplace(vfs.listAllFiles(dest, {
        type: 'file',
    }), [
        [/s-block/g, normalized.baseName],
        [/SBlock/g, normalized.componentName],
        [/区块/g, title || '区块'],
    ]);
    return dest;
}

export async function addBlock(options: MaterialOptions) {
    const opts = processOptions(options);

    // if (opts.source.type === 'npm')
    const blockCacheDir = getCacheDir('block');

    const dest = await downloadPackage(opts.source.registry, opts.source.name, blockCacheDir);
    // if (fs.statSync(opts.target).isFile())
    const vueFile = new vfs.VueFile(opts.target);
    await vueFile.open();
    if (!vueFile.isDirectory)
        vueFile.transform();
    await vueFile.save();

    const localBlocksPath = path.join(vueFile.fullPath, 'blocks');
    await fs.ensureDir(localBlocksPath);
    await fs.move(dest, path.join(localBlocksPath, opts.source.name));
}

/**
 *
 * @param registry For example: https://registry.npm.taobao.org
 * @param packageName For example: lodash
 * @param saveDir For example: ./blocks
 */
export async function downloadPackage(registry: string, packageName: string, saveDir: string) {
    const { data: pkgInfo } = await axios.get(`${registry}/${packageName}/latest`);
    const tgzURL = pkgInfo.dist.tarball;

    const response = await axios.get(tgzURL, {
        responseType: 'stream',
    });

    const temp = path.resolve(os.tmpdir(), packageName + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
    await compressing.tgz.uncompress(response.data, temp);

    const dest = path.join(saveDir, pkgInfo.name + '@' + pkgInfo.version);
    await fs.move(path.join(temp, 'package'), dest);
    await fs.rmdir(temp);

    return dest;
}
