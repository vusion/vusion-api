import * as babel from '@babel/core';
import generate from '@babel/generator';
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

class DeclarationHandler {
    state: { [name: string]: string | Array<string> };

    constructor(
        public node: babel.types.Node,
        // public parent: babel.types.Node,
        // public key: string,
    ) {
        this.resetState();
    }

    resetState() {
        this.state = {};
    }

    after(values: string | Array<string>) {
        this.state.after = values;
        return this;
    }

    object() {
        // 先试试硬 assign 有没有问题
        if (this.node.type !== 'ObjectExpression')
            Object.assign(this.node, babel.types.objectExpression([]));
        return this;
    }

    _set(key: string, value: string, force?: boolean) {
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

        const valueDeclaration = babel.template(`const value = ${value}`)() as babel.types.VariableDeclaration;
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
    ensure(key: string, value: string = 'undefined') {
        return this._set(key, value);
    }

    /**
     * 给属性赋值
     * @param key 键的名称
     * @param value 值的名称
     */
    set(key: string, value: string) {
        return this._set(key, value, true);
    }

    /**
     * 获取属性
     * @param key 键的名称
     */
    get(key: string) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('get method can only be called on an objectExpression');

        const objectProperty = this.node.properties.find((property, index) => {
            return property.type === 'ObjectProperty' && property.key.name === key;
        }) as babel.types.ObjectProperty;

        return objectProperty && new DeclarationHandler(objectProperty.value);
    }

    delete(key: string) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('get method can only be called on an objectExpression');

        let index = this.node.properties.findIndex((property, index) => {
            return property.type === 'ObjectProperty' && property.key.name === key;
        });

        ~index && this.node.properties.splice(index, 1);

        return this;
    }
}

class ScriptHandler {
    code: string;
    ast: babel.types.File;
    dirty: boolean = false;
    state: { [name: string]: string | number | Array<string> };

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.resetState();
        this.ast = this.parse(code);
    }

    parse(code: string) {
        return babel.parseSync(code, {
            // Must require manually in VSCode
            plugins: [require('@babel/plugin-syntax-dynamic-import')],
        }) as babel.types.File;
    }

    generate() {
        const code = generate(this.ast).code;
        let formatted = prettier.format(code, Object.assign({
            parser: 'babel',
        } as { [prop: string]: any }, prettierConfig));

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
    import(identifier: string) {
        this.state.identifier = identifier;
        return this;
    }

    /**
     * 从哪里引入
     * 如果遇到相同路径，以前的会被替换；如果不存在相同路径，则添加到最后一个 ImportDeclaration 之后
     * @param source 文件路径
     */
    from(source: string) {
        const body = this.ast.program.body;
        let existingIndex = body.findIndex((node) => node.type === 'ImportDeclaration' && node.source.value === source);

        const importString = this.state.identifier;
        if (!importString)
            throw new Error('No import called before from');
        const importDeclaration = babel.template(`import ${importString} from '${source}'`)() as babel.types.ImportDeclaration;
        if (~existingIndex) {
            body.splice(existingIndex, 1, importDeclaration);
            this.state.lastIndex = existingIndex;
        } else {
            let i;
            for (i = body.length - 1; i >= 0; i--) {
                const node = body[i];
                if (node.type === 'ImportDeclaration')
                    break;
            }
            i++;
            body.splice(i, 0, importDeclaration);
            this.state.lastIndex = i;
        }

        // this.resetState();
        return this;
    }

    export(identifier: string) {
        let result: DeclarationHandler;
        if (identifier === 'default') {
            babel.traverse(this.ast, {
                ExportDefaultDeclaration(nodePath) {
                    result = new DeclarationHandler(nodePath.node.declaration);
                },
            });
        }

        return result;
    }

    delete() {
        if (this.state.lastIndex === undefined)
            return;
            // throw new Error('Import node index Required!');

        const body = this.ast.program.body;
        body.splice(this.state.lastIndex as number, 1);
        this.state.lastIndex = undefined;

        return this;
    }
}

export default ScriptHandler;
