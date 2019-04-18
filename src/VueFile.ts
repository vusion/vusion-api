import * as fs from 'fs-extra';
import * as path from 'path';
import FSObject from './FSObject';
import * as shell from 'shelljs';

const fetchPartialContent = (content: string, tag: string) => {
    const reg = new RegExp(`<${tag}.*?>([\\s\\S]+)<\\/${tag}>`);
    const m = content.match(reg);
    return m ? m[1].trim() + '\n' : '';
};

export default class VueFile extends FSObject {
    componentName: string;

    content: string;
    template: string;
    style: string;
    script: string;
    sample: string;

    isParsed: boolean;

    constructor(fullPath: string) {
        super(fullPath, false);

        this.isParsed = false;
    }

    async open() {
        if (this.isOpen)
            return;

        await this.load();
        this.isOpen = true;
    }

    async load() {
        if (!fs.existsSync(this.fullPath))
            throw new Error(`Cannot find: ${this.fullPath}!`);

        const stats = fs.statSync(this.fullPath);
        this.isDirectory = stats.isDirectory();

        if (this.isDirectory) {
            if (fs.existsSync(path.join(this.fullPath, 'index.js')))
                this.script = await fs.readFile(path.join(this.fullPath, 'index.js'), 'utf8');
            else
                throw new Error(`Cannot find 'index.js' in multifile Vue!`);

            if (fs.existsSync(path.join(this.fullPath, 'index.html')))
                this.template = await fs.readFile(path.join(this.fullPath, 'index.html'), 'utf8');
            if (fs.existsSync(path.join(this.fullPath, 'module.css')))
                this.style = await fs.readFile(path.join(this.fullPath, 'module.css'), 'utf8');
            if (fs.existsSync(path.join(this.fullPath, 'sample.vue'))) {
                const sampleRaw = await fs.readFile(path.join(this.fullPath, 'sample.vue'), 'utf8');
                const templateRE = /<template.*?>([\s\S]*?)<\/template>/i;
                const sample = sampleRaw.match(templateRE);
                this.sample = sample && sample[1].trim();
            }
        } else {
            this.content = await fs.readFile(this.fullPath, 'utf8');
            this.template = fetchPartialContent(this.content, 'template');
            this.script = fetchPartialContent(this.content, 'script');
            this.style = fetchPartialContent(this.content, 'style');
        }
    }

    async save() {
        shell.rm('-rf', this.fullPath);
        if (this.isDirectory) {
            shell.mkdir(this.fullPath);

            const promises = [];
            this.template && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.html'), this.template));
            this.script && promises.push(fs.writeFile(path.resolve(this.fullPath, 'index.js'), this.script));
            this.style && promises.push(fs.writeFile(path.resolve(this.fullPath, 'module.css'), this.style));

            return Promise.all(promises);
        } else {
            const contents = [];
            this.template && contents.push(`<template>\n${this.template}</template>`);
            this.script && contents.push(`<script>\n${this.script}</script>`);
            this.style && contents.push(`<style module>\n${this.style}</style>`);

            return fs.writeFile(this.fullPath, contents.join('\n\n') + '\n');
        }
    }

    transform() {
        this.isDirectory = !this.isDirectory;
    }
}
