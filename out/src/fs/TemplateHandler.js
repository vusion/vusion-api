"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler = require("vue-template-compiler");
class TemplateHandler {
    constructor(code = '', options) {
        this.code = code;
        this.ast = this.parse(code);
    }
    parse(code) {
        const compilerOptions = {
            preserveWhitespace: false,
        };
        return compiler.compile(code, compilerOptions).ast;
    }
    generate() {
        // @TODO: 暂时没有很好的 generate
        return this.code;
    }
}
exports.default = TemplateHandler;
//# sourceMappingURL=TemplateHandler.js.map