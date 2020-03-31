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
function addLayout(fullPath, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        rootEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addLayout = addLayout;
//# sourceMappingURL=index.js.map