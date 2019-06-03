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
    return fs.copy(path.resolve(__dirname, '../../templates/u-single-file.vue'), handleSame(dirPath));
}
exports.createSingleFile = createSingleFile;
function createMultiFile(dirPath) {
    return fs.copy(path.resolve(__dirname, '../../templates/u-multi-file.vue'), handleSame(dirPath));
}
exports.createMultiFile = createMultiFile;
function createMultiFileWithSubdocs(dirPath) {
    return fs.copy(path.resolve(__dirname, '../../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath));
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
function createPage(dirPath) {
    return fs.copy(path.resolve(__dirname, '../../templates/page.vue'), handleSame(dirPath));
}
exports.createPage = createPage;
//# sourceMappingURL=creator.js.map