import * as fs from 'fs-extra';
import * as path from 'path';
import * as babel from '@babel/core';
import { kebab2Camel, Camel2kebab } from '../utils';
import { VueFile, Library, VueFileExtendMode } from '.';

export class FileExistsError extends Error {
    constructor(fullPath: string) {
        super(fullPath);
        this.name = 'FileExistsError';
    }
}

function handleSame(dirPath: string, baseName: string = 'u-sample') {
    let dest = path.resolve(dirPath, `${baseName}.vue`);
    // let count = 1;
    if (fs.existsSync(dest))
        throw new FileExistsError(dest);
    // while (fs.existsSync(dest))
    //     dest = path.resolve(dirPath, `${baseName}-${count++}.vue`);

    return dest;
}

function normalizeName(componentName?: string) {
    let baseName = componentName;
    if (componentName) {
        if (componentName.includes('-'))
            componentName = kebab2Camel(baseName);
        else
            baseName = Camel2kebab(componentName);
        return { baseName, componentName };
    } else
        return { baseName: 'u-sample', componentName: 'USample' };
}

type Replacer = [RegExp, string];
async function batchReplace(src: string | Array<string>, replacers: Array<Replacer>) {
    if (typeof src === 'string')
        src = [src];
    return Promise.all(src.map((fullPath) =>
        fs.readFile(fullPath, 'utf8').then((content) => {
            replacers.forEach((replacer) => content = content.replace(...replacer));
            return fs.writeFile(fullPath, content);
        })
    ));
}

/* 以下代码复制粘贴写得冗余了一点，不过之后可能各部分功能会有差异，所以先不整合 */

export async function createDirectory(dirPath: string, dirName: string) {
    const dest = path.resolve(dirPath, dirName);
    if (fs.existsSync(dest))
        throw new FileExistsError(dest);

    await fs.mkdir(dest);
    return dest;
}

export async function moveFileToTrash(fullPath: string) {
    // @TODO: Windows, Linux
    const fileName = path.basename(fullPath);
    let dest = path.resolve(process.env.HOME, '.Trash', fileName);
    if (fs.existsSync(dest)) {
        const date = new Date();
        dest = dest.replace(/(\.[a-zA-Z]+$|$)/, `.${date.toTimeString().split(' ')[0].replace(/:/g, '-')}-${date.getMilliseconds()}$1`);
    }
    await fs.move(fullPath, dest);
    return dest;
}

export async function deleteFile(fullPath: string) {
    // @TODO: Windows, Linux
    await fs.remove(fullPath);
}

export async function rename(fullPath: string, newName: string) {
    const dest = path.join(path.dirname(fullPath), newName);
    if (dest === fullPath)
        return dest;

    if (fs.existsSync(dest))
        throw new FileExistsError(dest);

    await fs.move(fullPath, dest);
    return dest;
}

export async function createSingleFile(dirPath: string, componentName?: string) {
    const normalized = normalizeName(componentName);
    const dest = handleSame(dirPath, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-single-file.vue'), dest);

    if (normalized.baseName !== 'u-sample') {
        await batchReplace(dest, [
            [/u-sample/g, normalized.baseName],
            [/USample/g, normalized.componentName],
        ]);
    }
    return dest;
}

export async function createMultiFile(dirPath: string, componentName?: string) {
    const normalized = normalizeName(componentName);
    const dest = handleSame(dirPath, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file.vue'), dest);

    if (normalized.baseName !== 'u-sample') {
        await batchReplace([
            path.join(dest, 'index.js'),
            path.join(dest, 'README.md'),
        ], [
            [/u-sample/g, normalized.baseName],
            [/USample/g, normalized.componentName],
        ]);
    }
    return dest;
}

export async function createMultiFileWithSubdocs(dirPath: string, componentName?: string) {
    const normalized = normalizeName(componentName);
    const dest = handleSame(dirPath, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-subdocs.vue'), dest);

    if (normalized.baseName !== 'u-sample') {
        await batchReplace([
            path.join(dest, 'index.js'),
            path.join(dest, 'docs/api.md'),
            path.join(dest, 'docs/examples.md'),
        ], [
            [/u-sample/g, normalized.baseName],
            [/USample/g, normalized.componentName],
        ]);
    }
    return dest;
}

export async function createMultiFileWithScreenshots(dirPath: string, componentName?: string) {
    const normalized = normalizeName(componentName);
    const dest = handleSame(dirPath, normalized.baseName);
    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-screenshots.vue'), dest);

    if (normalized.baseName !== 'u-sample') {
        await batchReplace([
            path.join(dest, 'index.js'),
            path.join(dest, 'README.md'),
        ], [
            [/u-sample/g, normalized.baseName],
            [/USample/g, normalized.componentName],
        ]);
    }
    return dest;
}

export async function createPage(dirPath: string) {
    const dest = handleSame(dirPath, 'page');
    await fs.copy(path.resolve(__dirname, '../../', '../templates/page.vue'), dest);
    return dest;
}

export async function createListPage(dirPath: string) {
    const dest = handleSame(dirPath, 'list');
    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-subdocs.vue'), dest);
    return dest;
}

export async function createFormPage(dirPath: string) {
    const dest = handleSame(dirPath, 'form');
    await fs.copy(path.resolve(__dirname, '../../', '../templates/page.vue'), dest);
    return dest;
}

export async function createDetailPage(dirPath: string) {
    const dest = handleSame(dirPath, 'detail');
    await fs.copy(path.resolve(__dirname, '../../', '../templates/page.vue'), dest);
    return dest;
}

export async function addDoc(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new FileExistsError('File README.md exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file.vue/README.md'), dest);

    const baseName = path.basename(vuePath, path.extname(vuePath));
    const componentName = kebab2Camel(baseName);
    await batchReplace(dest, [
        [/u-sample/g, baseName],
        [/USample/g, componentName],
    ]);
    return dest;
}

export async function addDocWithSubs(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');
    const baseName = path.basename(vuePath, path.extname(vuePath));
    const componentName = kebab2Camel(baseName);

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new FileExistsError('File "README.md" exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-subdocs.vue/README.md'), dest);
    await batchReplace(dest, [
        [/u-sample/g, baseName],
        [/USample/g, componentName],
    ]);

    const dest2 = path.resolve(vuePath, 'docs');
    if (fs.existsSync(dest2))
        throw new FileExistsError('Directory "docs/" exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-subdocs.vue/docs'), dest2);
    await batchReplace([
        path.join(dest, 'api.md'),
        path.join(dest, 'examples.md'),
    ], [
        [/u-sample/g, baseName],
        [/USample/g, componentName],
    ]);

    return dest;
}

export async function addDocWithScreenshots(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File README.md exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-screenshots.vue/README.md'), dest);

    const baseName = path.basename(vuePath, path.extname(vuePath));
    const componentName = kebab2Camel(baseName);
    await batchReplace(dest, [
        [/u-sample/g, baseName],
        [/USample/g, componentName],
    ]);

    const dest2 = path.resolve(vuePath, 'screenshots');
    if (fs.existsSync(dest2))
        throw new Error('Directory "screenshots/" exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file-with-screenshots.vue/screenshots'), dest2);

    return dest;
}

export async function addModuleCSS(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'module.css');
    if (fs.existsSync(dest))
        throw new Error('File module.css exists!');

    await fs.copy(path.resolve(__dirname, '../../', '../templates/u-multi-file.vue/module.css'), dest);
    return dest;
}

/**
 * 扩展到新的库中
 * @param vueFile - 原组件库需要扩展的组件
 * @param library - 扩展到的组件库，比如 internalLibrary
 */
export async function extendToLibrary(vueFile: VueFile, from: Library | string, to: Library, mode: VueFileExtendMode, subDir?: string) {
    let fromPath: string;
    if (from instanceof Library) {
        if (subDir === undefined)
            subDir = to.config.type !== 'library' ? from.baseName : ''; // @example 'cloud-ui';
        fromPath = from.fileName;
    } else {
        if (subDir === undefined)
            subDir = to.config.type !== 'library' ? 'other' : '';
        fromPath = from;
    }

    const relativePath = `./${subDir}/${vueFile.fileName}`;
    const toPath = to.componentsDirectory.fullPath;

    const destDir = path.resolve(toPath, subDir);
    const dest = path.resolve(toPath, relativePath);

    if (!fs.existsSync(destDir))
        fs.mkdirSync(destDir);

    const newVueFile = vueFile.extend(mode, dest, fromPath);
    await newVueFile.save();

    // 在 index.js 中添加
    if (to.componentsIndexFile) {
        const indexFile = to.componentsIndexFile;
        await indexFile.open();
        indexFile.parse();

        const body = indexFile.handler.ast.program.body;
        let i = 0;
        for (; i < body.length; i++) {
            const node = body[i];
            if (node.type !== 'ExportAllDeclaration' || relativePath < node.source.value)
                break;
        }

        const exportAllDeclaration = babel.types.exportAllDeclaration(babel.types.stringLiteral(relativePath));
        // 要逃避 typescript
        Object.assign(exportAllDeclaration.source, { raw: `'${relativePath}'` });

        body.splice(i, 0, exportAllDeclaration);
        await indexFile.save();
    }

    return newVueFile;
}
