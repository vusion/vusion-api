import * as path from 'path';
import * as fs from 'fs-extra';
import * as vfs from '../fs';
import * as compiler from 'vue-template-compiler';

export async function addLayout(fullPath: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    rootEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}
