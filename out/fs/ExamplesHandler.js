"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MarkdownIt = require("markdown-it");
class ExamplesHandler {
    constructor(content) {
        this.content = content;
        this.markdown = new MarkdownIt({
            html: true,
            langPrefix: 'lang-',
        });
        this.tokens = this.parse(content);
    }
    parse(content) {
        return this.markdown.parse(content, {});
    }
    toJSON(maxCount = 10) {
        const examples = [];
        let title = '';
        let description = '';
        this.tokens.forEach((token, index) => {
            if (examples.length >= maxCount)
                return;
            if (token.type === 'heading_close' && token.tag === 'h3') {
                const inline = this.tokens[index - 1];
                if (inline && inline.type === 'inline')
                    title = inline.content;
            }
            else if (token.type === 'paragraph_close') {
                const inline = this.tokens[index - 1];
                if (inline && inline.type === 'inline')
                    description += inline.content + '\n';
            }
            else if (token.type === 'fence') {
                const lang = token.info.trim().split(' ')[0];
                if (lang === 'html') {
                    examples.push({
                        title,
                        description,
                        code: `<template>\n${token.content}</template>\n`,
                    });
                }
                else if (lang === 'vue') {
                    examples.push({
                        title,
                        description,
                        code: token.content,
                    });
                }
                description = '';
            }
        });
        return examples;
    }
}
exports.default = ExamplesHandler;
//# sourceMappingURL=ExamplesHandler.js.map