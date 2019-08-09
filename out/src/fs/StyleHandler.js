"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
class StyleHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.ast = this.parse(code);
    }
    parse(code) {
        return postcss.parse(code);
    }
    generate() {
        return this.ast.toString();
    }
}
exports.default = StyleHandler;
//# sourceMappingURL=StyleHandler.js.map