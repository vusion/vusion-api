"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel = require("@babel/core");
const prettier = require("prettier");
/**
 * @TODO - Load babel Config
 * @TODO - Load prettier Config
 */
const prettierConfig = {
    "tabWidth": 4,
    "singleQuote": true,
    "quoteProps": "as-needed",
    "trailingComma": "all",
    "arrowParens": "always",
    "endOfLine": "lf"
};
class ScriptHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.ast = this.parse(code);
    }
    parse(code) {
        return babel.parseSync(code, {
            // Must require manually in VSCode
            plugins: [require('@babel/plugin-syntax-dynamic-import')],
        });
    }
    generate() {
        return prettier.format(this.code, Object.assign({}, prettierConfig, {
            parser: () => this.ast,
        }));
        // return generate(this.ast, {}, this.code).code + '\n';
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map