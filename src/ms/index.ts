import * as path from 'path';
import * as babel from '@babel/core';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as vfs from '../fs';
import * as utils from '../utils';
import { isFile } from '@babel/types';

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

export interface MaterialOptions {
    source: string,
    target: string,
    name: string,
    title?: string,
};

export enum MaterialSourceType {
    local = 'local',
    github = 'github',

}

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
    source: {
        type: string,
        // url: string,
        // registry: string,
        repoName: string,
        path: string,
        name: string,
        version?: string,
        commit?: string,
    },
    target: string,
    name: string,
    title?: string,
};

export function processOptions(options: MaterialOptions): ProcessedMaterialOptions {
    const result: ProcessedMaterialOptions = {
        source: {
            type: 'file',
            repoName: '',
            path: '',
            name: '',
            version: '',
            commit: '',
        },
        target: options.target,
        name: options.name,
        title: options.title,
    }

    let source = options.source;

    if (source[0] === '.' || source[0] === '~' || source[0] === '/') {
        result.source.type = 'file';
        result.source.path = source;
        result.source.name = path.basename(source);
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
        let repoName = arr[0];
        if (repoName.includes('#')) {
            const arr2 = repoName.split('#');
            result.source.repoName = arr2[0];
            result.source.commit = arr2[1];
        } else if (repoName.includes('@')) {
            const arr2 = repoName.split('@');
            result.source.repoName = arr2[0];
            result.source.version = arr2[1];
        } else {
            result.source.repoName = repoName;
        }
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
        const temp = path.resolve(moduleCacheDir, opts.source.name + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
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
