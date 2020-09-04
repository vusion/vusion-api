import * as MarkdownIt from 'markdown-it';
import * as Token from 'markdown-it/lib/token';
export default class ExamplesHandler {
    content: string;
    markdown: MarkdownIt;
    tokens: Array<Token>;
    constructor(content?: string);
    parse(content: string): Token[];
    toJSON(maxCount?: number): {
        title: string;
        description: string;
        code: string;
    }[];
}
