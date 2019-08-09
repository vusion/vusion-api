import { transform } from 'babel-core';
import generate from 'babel-generator';

class ScriptHandler {
    code: string;
    ast: babel.Node;
    dirty: boolean = false;

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.ast = this.parse(code);
    }

    parse(code: string) {
        return transform(code, {
            // Must require manually in VSCode
            plugins: [require('babel-plugin-syntax-dynamic-import')],
        }).ast;
    }

    generate() {
        return generate(this.ast, {}, this.code).code + '\n';
    }
}

export default ScriptHandler;
