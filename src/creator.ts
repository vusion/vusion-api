import * as fs from 'fs-extra';
import * as path from 'path';

function handleSame(dirPath: string, basename: string = 'u-sample') {
    let dest = path.resolve(dirPath, `${basename}.vue`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.resolve(dirPath, `${basename}-${count++}.vue`);

    return dest;
}

export function createSingleFile(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-single-file.vue'), handleSame(dirPath));
}

export function createMultiFile(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue'), handleSame(dirPath))
}

export function createMultiFileWithSubdocs(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath))
}

export function createPage(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'page'))
}

export function createListPage(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath, 'list'))
}

export function createFormPage(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'form'))
}

export function createDetailPage(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'detail'))
}

export function addDoc(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File README.md exists!');

    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/README.md'), dest);
}

export function addDocAndSubs(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File "README.md" exists!');

    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/README.md'), dest);

    const dest2 = path.resolve(vuePath, 'docs');
    if (fs.existsSync(dest2))
        throw new Error('Directory "docs/" exists!');

    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/docs'), dest2);
}

export function addModuleCSS(vuePath: string) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');

    const dest = path.resolve(vuePath, 'module.css');
    if (fs.existsSync(dest))
        throw new Error('File module.css exists!');

    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/module.css'), dest);
}
