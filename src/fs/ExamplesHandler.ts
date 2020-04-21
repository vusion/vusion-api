import * as MarkdownIt from 'markdown-it';
import * as Token from 'markdown-it/lib/token';

export default class ExamplesHandler {
    markdown: MarkdownIt;
    tokens: Array<Token>;

    constructor(
        public content: string,
    ) {
        this.markdown = new MarkdownIt({
            html: true,
            langPrefix: 'lang-',
        });
        this.tokens = this.parse(content);
    }

    parse(content: string) {
        return this.markdown.parse(content, {});
    }

    toJSON(maxCount: number = 10) {
        const examples: Array<{
            title: string,
            description: string,
            code: string,
        }> = [];

        let title = '';
        let description = '';

        this.tokens.forEach((token, index) => {
            if (examples.length >= maxCount)
                return;

            if (token.type === 'heading_close' && token.tag === 'h3') {
                const inline = this.tokens[index - 1];
                if (inline && inline.type === 'inline')
                    title = inline.content;
            } else if (token.type === 'paragraph_close') {
                const inline = this.tokens[index - 1];
                if (inline && inline.type === 'inline')
                    description += inline.content + '\n';
            } else if (token.type === 'fence') {
                const lang = token.info.trim().split(' ')[0];

                if (lang === 'html') {
                    examples.push({
                        title,
                        description,
                        code: `<template>\n${token.content}</template>\n`,
                    });
                } else if (lang === 'vue') {
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
