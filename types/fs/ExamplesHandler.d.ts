import MarkdownIt = require('markdown-it');
import * as Token from 'markdown-it/lib/token';
export default class ExamplesHandler {
    content: string;
    markdown: MarkdownIt;
    tokens: Array<Token>;
    constructor(content?: string);
    parse(content: string): import("markdown-it/lib/token")[];
    toJSON(maxCount?: number): {
        title: string;
        description: string;
        code: string;
    }[];
}
