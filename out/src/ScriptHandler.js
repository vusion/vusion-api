"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel_core_1 = require("babel-core");
const babel_generator_1 = require("babel-generator");
class ScriptHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.ast = this.parse(code);
    }
    parse(code) {
        return babel_core_1.transform(code, {
            // Must require manually in VSCode
            plugins: [require('babel-plugin-syntax-dynamic-import')],
        }).ast;
    }
    generate() {
        return babel_generator_1.default(this.ast, {}, this.code).code + '\n';
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map