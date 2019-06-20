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
const utils_1 = require("./utils");
function handleSame(dirPath, baseName = 'u-sample') {
    let dest = path.resolve(dirPath, `${baseName}.vue`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.resolve(dirPath, `${baseName}-${count++}.vue`);
    return dest;
}
function normalizeName(componentName) {
    let baseName = componentName;
    if (componentName) {
        if (componentName.includes('-'))
            componentName = utils_1.kebab2Camel(baseName);
        else
            baseName = utils_1.Camel2kebab(componentName);
        return { baseName, componentName };
    }
    else
        return { baseName: 'u-sample', componentName: 'USample' };
}
function batchReplace(src, replacers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof src === 'string')
            src = [src];
        return Promise.all(src.map((fullPath) => fs.readFile(fullPath, 'utf8').then((content) => {
            replacers.forEach((replacer) => content = content.replace(...replacer));
            return fs.writeFile(fullPath, content);
        })));
    });
}
/* 以下代码复制粘贴写得冗余了一点，不过之后可能各部分功能会有差异，所以先不整合 */
function createSingleFile(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = normalizeName(componentName);
        const dest = handleSame(dirPath, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-single-file.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace(dest, [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createSingleFile = createSingleFile;
function createMultiFile(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = normalizeName(componentName);
        const dest = handleSame(dirPath, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'README.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFile = createMultiFile;
function createMultiFileWithSubdocs(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = normalizeName(componentName);
        const dest = handleSame(dirPath, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'docs/api.md'),
                path.join(dest, 'docs/examples.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFileWithSubdocs = createMultiFileWithSubdocs;
function createMultiFileWithScreenshots(dirPath, componentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const normalized = normalizeName(componentName);
        const dest = handleSame(dirPath, normalized.baseName);
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-screenshots.vue'), dest);
        if (normalized.baseName !== 'u-sample') {
            yield batchReplace([
                path.join(dest, 'index.js'),
                path.join(dest, 'README.md'),
            ], [
                [/u-sample/g, normalized.baseName],
                [/USample/g, normalized.componentName],
            ]);
        }
        return dest;
    });
}
exports.createMultiFileWithScreenshots = createMultiFileWithScreenshots;
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
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        yield batchReplace(dest, [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        return dest;
    });
}
exports.addDoc = addDoc;
function addDocWithSubs(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding blocks in single vue file!');
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        const dest = path.resolve(vuePath, 'README.md');
        if (fs.existsSync(dest))
            throw new Error('File "README.md" exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/README.md'), dest);
        yield batchReplace(dest, [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        const dest2 = path.resolve(vuePath, 'docs');
        if (fs.existsSync(dest2))
            throw new Error('Directory "docs/" exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-subdocs.vue/docs'), dest2);
        yield batchReplace([
            path.join(dest, 'api.md'),
            path.join(dest, 'examples.md'),
        ], [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        return dest;
    });
}
exports.addDocWithSubs = addDocWithSubs;
function addDocWithScreenshots(vuePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.statSync(vuePath).isDirectory())
            throw new Error('Unsupport adding blocks in single vue file!');
        const dest = path.resolve(vuePath, 'README.md');
        if (fs.existsSync(dest))
            throw new Error('File README.md exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-screenshots.vue/README.md'), dest);
        const baseName = path.basename(vuePath, path.extname(vuePath));
        const componentName = utils_1.kebab2Camel(baseName);
        yield batchReplace(dest, [
            [/u-sample/g, baseName],
            [/USample/g, componentName],
        ]);
        const dest2 = path.resolve(vuePath, 'screenshots');
        if (fs.existsSync(dest2))
            throw new Error('Directory "screenshots/" exists!');
        yield fs.copy(path.resolve(__dirname, '../', '../templates/u-multi-file-with-screenshots.vue/screenshots'), dest2);
        return dest;
    });
}
exports.addDocWithScreenshots = addDocWithScreenshots;
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