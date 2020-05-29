"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require("prettier");
const PureScriptHandler_1 = require("./PureScriptHandler");
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
/**
 * JS AST 处理器
 * prettier 在浏览器中会报错
 */
class ScriptHandler extends PureScriptHandler_1.default {
    generate() {
        const code = super.generate();
        let formatted = prettier.format(code, Object.assign({
            parser: 'babel',
        }, prettierConfig));
        formatted = formatted.replace(/component: \(\) =>\s+import\(([\s\S]+?)\),/g, (m, $1) => {
            return `component: () => import(${$1.replace(/\n\s+/g, ' ').trim()}),`;
        });
        return formatted;
        // prettier 直接用 ast format 会把注释干掉，很蛋疼，所以目前还是先用 babel 生成再 format 比较好
        // return prettier.format(this.code, Object.assign({}, prettierConfig, {
        //     parser: () => this.ast,
        // }));
        // return generate(this.ast, {}, this.code).code + '\n';
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map