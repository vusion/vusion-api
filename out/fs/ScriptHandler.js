"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel = require("@babel/core");
const generator_1 = require("@babel/generator");
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
        const code = generator_1.default(this.ast).code;
        return prettier.format(code, Object.assign({
            parser: 'babel',
        }, prettierConfig));
        // prettier 直接用 ast format 会把注释干掉，很蛋疼，所以目前还是先用 babel 生成再 format 比较好
        // return prettier.format(this.code, Object.assign({}, prettierConfig, {
        //     parser: () => this.ast,
        // }));
        // return generate(this.ast, {}, this.code).code + '\n';
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map