import * as fs from 'fs-extra';
import * as path from 'path';

function handleSame(dirPath: string, basename: string = 'u-sample') {
    let dest = path.resolve(dirPath, `${basename}.vue`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.resolve(dirPath, `${basename}-${count++}.vue`);

    return dest;
}

export async function createSingleFile(dirPath: string) {
    const dest = handleSame(dirPath);
    await fs.copy(path.resolve(__dirname, '../', '../templates/u-single-file.vue'), dest);
    return dest;
}

export async function createMultiFile(dirPath: string) {
    const dest = handleSame(dirPath);
    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue'), dest);
    return dest;
}

export async function createMultiFileWithSubdocs(dirPath: string) {
    const dest = handleSame(dirPath);
    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), dest);
    return dest;
}

export async function createPage(dirPath: string) {
    const dest = handleSame(dirPath, 'page');
    await fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
    return dest;
}

export async function createListPage(dirPath: string) {
    const dest = handleSame(dirPath, 'list');
    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), dest);
    return dest;
}

export async function createFormPage(dirPath: string) {
    const dest = handleSame(dirPath, 'form');
    await fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
    return dest;
}

export async function createDetailPage(dirPath: string) {
    const dest = handleSame(dirPath, 'detail');
    await fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
    return dest;
}

export async function addDoc(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File README.md exists!');

    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/README.md'), dest);
    return dest;
}

export async function addDocAndSubs(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File "README.md" exists!');

    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/README.md'), dest);

    const dest2 = path.resolve(vuePath, 'docs');
    if (fs.existsSync(dest2))
        throw new Error('Directory "docs/" exists!');

    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/docs'), dest2);
    return dest;
}

export async function addModuleCSS(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'module.css');
    if (fs.existsSync(dest))
        throw new Error('File module.css exists!');

    await fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/module.css'), dest);
    return dest;
}
