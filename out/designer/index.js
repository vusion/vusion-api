"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const vfs = require("../fs");
const compiler = require("vue-template-compiler");
function addLayout(fullPath, route, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addLayout = addLayout;
function addCode(fullPath, route, tpl) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addCode = addCode;
function saveFile(fullPath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.writeFile(fullPath, content);
    });
}
exports.saveFile = saveFile;
// export async function mergeBlock(fullPath: string, type: string) {
//     const vueFile = new vfs.VueFile(fullPath);
//     await vueFile.open();
//     vueFile.parseTemplate();
//     let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
//     let tpl = await fs.readFile(tplPath, 'utf8');
//     tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
//     const rootEl = vueFile.templateHandler.ast;
//     rootEl.children.push(compiler.compile(tpl).ast);
//     await vueFile.save();
// }
function loadViews(fullPath, viewType) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = new vfs.View(fullPath, viewType);
        yield view.open();
        return view.children;
    });
}
exports.loadViews = loadViews;
function getViewContent(fullPath, viewType) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = new vfs.View(fullPath, viewType);
        yield view.open();
        const vueFile = new vfs.VueFile(view.vueFilePath);
        yield vueFile.open();
        return vueFile;
    });
}
exports.getViewContent = getViewContent;
function saveViewContent(fullPath, viewType, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = new vfs.View(fullPath, viewType);
        yield view.open();
        return fs.writeFile(view.vueFilePath, content);
    });
}
exports.saveViewContent = saveViewContent;
function saveCode(fullPath, type, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        if (type === 'template')
            vueFile.template = content;
        else if (type === 'script')
            vueFile.script = content;
        else if (type === 'style')
            vueFile.style = content;
        yield vueFile.save();
    });
}
exports.saveCode = saveCode;
//# sourceMappingURL=index.js.map