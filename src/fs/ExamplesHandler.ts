import * as MarkdownIt from 'markdown-it';
import { Token } from 'markdown-it';

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
    }


    parse(content: string) {
        this.tokens = this.markdown.parse(content, {});
        this.tokens.forEach((token) => {
            console.log(token.type, token.tag)
        })
    }
}
