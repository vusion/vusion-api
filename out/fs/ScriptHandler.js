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
class DeclarationHandler {
    constructor(node) {
        this.node = node;
        this.resetState();
    }
    resetState() {
        this.state = {};
    }
    after(values) {
        this.state.after = values;
        return this;
    }
    object() {
        // 先试试硬 assign 有没有问题
        if (this.node.type !== 'ObjectExpression')
            Object.assign(this.node, babel.types.objectExpression([]));
        return this;
    }
    _set(key, value, force) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error(`${force ? 'set' : 'ensure'} method can only be called on an objectExpression`);
        let pos;
        const after = this.state.after || [];
        let index = this.node.properties.findIndex((property, index) => {
            if (property.type === 'ObjectProperty' && after.includes(property.key.name))
                pos = index;
            return property.type === 'ObjectProperty' && property.key.name === key;
        });
        if (pos === undefined)
            pos = this.node.properties.length;
        const valueDeclaration = babel.template(`const value = ${value}`)();
        const objectProperty = babel.types.objectProperty(babel.types.identifier(key), valueDeclaration.declarations[0].init);
        if (~index)
            force && this.node.properties.splice(index, 1, objectProperty);
        else
            this.node.properties.splice(pos, 0, objectProperty);
        this.resetState();
        return this;
    }
    /**
     * 确保拥有此属性。如果没有，则将第二个参数设为此属性
     * @param key
     * @param value
     */
    ensure(key, value = 'undefined') {
        return this._set(key, value);
    }
    /**
     * 给属性赋值
     * @param key 键的名称
     * @param value 值的名称
     */
    set(key, value) {
        return this._set(key, value, true);
    }
    /**
     * 获取属性
     * @param key 键的名称
     */
    get(key) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('get method can only be called on an objectExpression');
        const objectProperty = this.node.properties.find((property, index) => {
            return property.type === 'ObjectProperty' && property.key.name === key;
        });
        return objectProperty && new DeclarationHandler(objectProperty.value);
    }
}
class ScriptHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.resetState();
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
    resetState() {
        this.state = {};
    }
    /**
     * 引入
     * @param identifier 唯一标识
     * @example
     * $js.import('UButton').from('./u-button.vue');
     */
    import(identifier) {
        this.state.identifier = identifier;
        return this;
    }
    /**
     * 从哪里引入
     * 如果遇到相同路径，以前的会被替换；如果不存在相同路径，则添加到最后一个 ImportDeclaration 之后
     * @param source 文件路径
     */
    from(source) {
        const body = this.ast.program.body;
        let existingIndex = body.findIndex((node) => node.type === 'ImportDeclaration' && node.source.value === source);
        const importString = this.state.identifier;
        if (!importString)
            throw new Error('No import called before from');
        const importDeclaration = babel.template(`import ${importString} from '${source}'`)();
        if (~existingIndex)
            body.splice(existingIndex, 1, importDeclaration);
        else {
            let i;
            for (i = body.length - 1; i >= 0; i--) {
                const node = body[i];
                if (node.type === 'ImportDeclaration')
                    break;
            }
            i++;
            body.splice(i, 0, importDeclaration);
        }
        this.resetState();
    }
    export(identifier) {
        let result;
        if (identifier === 'default') {
            babel.traverse(this.ast, {
                ExportDefaultDeclaration(nodePath) {
                    result = new DeclarationHandler(nodePath.node.declaration);
                },
            });
        }
        return result;
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map