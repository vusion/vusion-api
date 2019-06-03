"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
function handleSame(dirPath, basename = 'u-sample') {
    let dest = path.resolve(dirPath, `${basename}.vue`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.resolve(dirPath, `${basename}-${count++}.vue`);
    return dest;
}
function createSingleFile(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-single-file.vue'), handleSame(dirPath));
}
exports.createSingleFile = createSingleFile;
function createMultiFile(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue'), handleSame(dirPath));
}
exports.createMultiFile = createMultiFile;
function createMultiFileWithSubdocs(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath));
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
function createPage(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'page'));
}
exports.createPage = createPage;
function createListPage(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath, 'list'));
}
exports.createListPage = createListPage;
function createFormPage(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'form'));
}
exports.createFormPage = createFormPage;
function createDetailPage(dirPath) {
    return fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), handleSame(dirPath, 'detail'));
}
exports.createDetailPage = createDetailPage;
function addDoc(vuePath) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');
    const dest = path.resolve(vuePath, 'README.md');
    if (fs.existsSync(dest))
        throw new Error('File README.md exists!');
    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/README.md'), dest);
}
exports.addDoc = addDoc;
function addDocAndSubs(vuePath) {
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
exports.addDocAndSubs = addDocAndSubs;
function addModuleCSS(vuePath) {
    if (!fs.statSync(vuePath).isDirectory())
        throw new Error('Unsupport adding blocks in single vue file!');
    const dest = path.resolve(vuePath, 'module.css');
    if (fs.existsSync(dest))
        throw new Error('File module.css exists!');
    fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/module.css'), dest);
}
exports.addModuleCSS = addModuleCSS;
//# sourceMappingURL=creator.js.map