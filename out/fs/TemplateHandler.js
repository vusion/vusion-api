"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler = require("vue-template-compiler");
class ASTNodePath {
    constructor(node, parent) {
        this.node = node;
        this.parent = parent;
    }
    remove() {
        const index = this.parent.children.indexOf(this.node);
        ~index && this.parent.children.splice(index, 1);
    }
}
exports.ASTNodePath = ASTNodePath;
class TemplateHandler {
    constructor(code = '', options) {
        this.code = code;
        this.ast = this.parse(code);
        this.options = {
            tabLength: 4,
        };
    }
    parse(code) {
        const compilerOptions = {
            preserveWhitespace: false,
            outputSourceRange: true,
        };
        return compiler.compile(code, compilerOptions).ast;
    }
    generate() {
        // @TODO: 暂时没有很好的 generate
        return this.generateElement(this.ast, 0) + '\n';
        // return this.code;
    }
    generateElement(el, level) {
        const tabs = ' '.repeat(this.options.tabLength * level);
        const insideTabs = ' '.repeat(this.options.tabLength * (level + 1));
        let shouldFormat = true;
        const content = el.children.map((node) => {
            let text = '';
            if (node.type === 1)
                text = (shouldFormat ? '\n' + insideTabs : '') + this.generateElement(node, level + 1);
            else if (node.type === 2)
                text = node.text;
            else if (node.type === 3)
                text = node.text;
            else
                console.log(node);
            shouldFormat = node.type === 1;
            return text;
        }).join('');
        if (!content)
            shouldFormat = false;
        const attrs = Object.keys(el.attrsMap).map((key) => {
            return `${key}="${el.attrsMap[key]}"`;
        });
        let attrsLength = 0;
        let attrsString = '';
        attrs.forEach((attr) => {
            if (attrsLength >= 120 || attr.length >= 120) {
                attrsString += '\n' + tabs + ' '.repeat(4); // ' '.repeat(el.tag.length + 1);
                attrsLength = 0;
            }
            attrsString += ' ' + attr;
            attrsLength += attr.length;
        });
        return `<${el.tag}${attrs.length ? attrsString : ''}>` + content + (shouldFormat ? '\n' + tabs : '') + `</${el.tag}>`;
    }
    traverse(func) {
        let queue = [];
        queue = queue.concat(new ASTNodePath(this.ast, null));
        let nodePath;
        while ((nodePath = queue.shift())) {
            if (nodePath.node.type === 1) {
                const parent = nodePath.node;
                queue = queue.concat(parent.children.map((node) => new ASTNodePath(node, parent)));
            }
            const result = func(nodePath);
            if (result !== undefined)
                return result;
        }
    }
}
exports.default = TemplateHandler;
//# sourceMappingURL=TemplateHandler.js.map