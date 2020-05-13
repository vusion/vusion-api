import * as path from 'path';
import * as fs from 'fs-extra';
import * as vfs from '../fs';
import * as compiler from 'vue-template-compiler';

export async function addLayout(fullPath: string, route: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

export async function addCode(fullPath: string, route: string, tpl: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

export async function saveFile(fullPath: string, content: string) {
    return fs.writeFile(fullPath, content);
}

export async function saveCode(fullPath: string, type: string, content: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    if (type === 'template')
        vueFile.template = content;
    else if (type === 'script')
        vueFile.script = content;
    else if (type === 'style')
        vueFile.style = content;

    await vueFile.save();
}

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

export async function loadViews(fullPath: string, viewType: vfs.ViewType) {
    const view = new vfs.View(fullPath, viewType);
    await view.open();
    return view.children;
}
