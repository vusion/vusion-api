"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-single-file.vue'), dest);
        return dest;
    });
}
exports.createSingleFile = createSingleFile;
function createMultiFile(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue'), dest);
        return dest;
    });
}
exports.createMultiFile = createMultiFile;
function createMultiFileWithSubdocs(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), dest);
        return dest;
    });
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
function createPage(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath, 'page');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
        return dest;
    });
}
exports.createPage = createPage;
function createListPage(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath, 'list');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), dest);
        return dest;
    });
}
exports.createListPage = createListPage;
function createFormPage(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath, 'form');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
        return dest;
    });
}
exports.createFormPage = createFormPage;
function createDetailPage(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = handleSame(dirPath, 'detail');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/page.vue'), dest);
        return dest;
    });
}
exports.createDetailPage = createDetailPage;
function addDoc(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding blocks in single vue file!');
        const dest = path.resolve(vuePath, 'README.md');
        if (fs.existsSync(dest))
            throw new Error('File README.md exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/README.md'), dest);
        return dest;
    });
}
exports.addDoc = addDoc;
function addDocAndSubs(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding blocks in single vue file!');
        const dest = path.resolve(vuePath, 'README.md');
        if (fs.existsSync(dest))
            throw new Error('File "README.md" exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/README.md'), dest);
        const dest2 = path.resolve(vuePath, 'docs');
        if (fs.existsSync(dest2))
            throw new Error('Directory "docs/" exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/docs'), dest2);
        return dest;
    });
}
exports.addDocAndSubs = addDocAndSubs;
function addModuleCSS(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding blocks in single vue file!');
        const dest = path.resolve(vuePath, 'module.css');
        if (fs.existsSync(dest))
            throw new Error('File module.css exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue/module.css'), dest);
        return dest;
    });
}
exports.addModuleCSS = addModuleCSS;
//# sourceMappingURL=creator.js.map