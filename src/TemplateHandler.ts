import * as compiler from 'vue-template-compiler';

class TemplateHandler {
    code: string;
    ast: compiler.ASTElement;

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.ast = this.parse(code);

    }

    parse(code: string) {
        const compilerOptions: compiler.CompilerOptions = {
            preserveWhitespace: false,
        };

        return compiler.compile(code, compilerOptions).ast;
    }

    generate() {
        // @TODO: 暂时没有很好的 generate
        return this.code;
    }
}

export default TemplateHandler;
