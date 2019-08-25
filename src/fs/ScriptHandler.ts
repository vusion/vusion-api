import * as babel from '@babel/core';
import * as prettier from 'prettier';

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
    code: string;
    ast: babel.Node;
    dirty: boolean = false;

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.ast = this.parse(code);
    }

    parse(code: string) {
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

export default ScriptHandler;
