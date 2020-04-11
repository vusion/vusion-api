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
    }
    parse(content) {
        this.tokens = this.markdown.parse(content, {});
        this.tokens.forEach((token) => {
            console.log(token.type, token.tag);
        });
    }
}
exports.default = ExamplesHandler;
//# sourceMappingURL=ExamplesHandler.js.map