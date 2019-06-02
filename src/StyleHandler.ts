import * as postcss from 'postcss';

class StyleHandler {
    code: string;
    ast: postcss.Root;
    dirty: boolean = false;

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.ast = this.parse(code);
    }

    parse(code: string) {
        return postcss.parse(code);
    }

    generate() {
        return this.ast.toString();
    }
}

export default StyleHandler;
