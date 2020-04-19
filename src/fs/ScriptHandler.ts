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

    private _set(key: string, value: string, force?: boolean) {
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

class FromsHandler {
    constructor(public body: babel.types.Statement[]) {}

    has(source: string) {
        let existingIndex = this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source;
        });

        return !!~existingIndex;
    }

    delete(source: string) {
        let existingIndex = this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source;
        });
        ~existingIndex && this.body.splice(existingIndex, 1);
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
     * @param specifier 指示符
     * @example
     * $js.import('*').from('./u-button.vue');
     * $js.import('UButton').from('./u-button.vue');
     * $js.import({ default: 'UButton', UButton2: '', UButton3: 'UButton3' }).from('./u-button.vue');
     */
    import(specifier: string | { [imported: string]: string }) {
        if (typeof specifier === 'object') {
            const insideString = Object.keys(specifier).map((imported) => {
                const identifer = (specifier as { [imported: string]: string })[imported];
                return imported + (identifer === imported || identifer === '' ? '' : ' as ' + identifer);
            }).join(', ');
            specifier = `{ ${insideString} }`;
        }
        this.state.declaration = 'import';
        this.state.specifier = specifier;
        return this;
    }

    export(specifier?: string | { [imported: string]: string }) {
        if (typeof specifier === 'object') {
            const insideString = Object.keys(specifier).map((imported) => {
                const identifer = (specifier as { [imported: string]: string })[imported];
                return imported + (identifer === imported || identifer === '' ? '' : ' as ' + identifer);
            }).join(', ');
            specifier = `{ ${insideString} }`;
        }
        this.state.declaration = 'export';
        this.state.specifier = specifier;
        return this;
    }

    /**
     * 从哪里引入
     * 如果遇到相同路径，以前的会被替换；如果不存在相同路径，则添加到最后一个 ImportDeclaration 之后
     * @param source 文件路径
     */
    from(source: string) {
        const body = this.ast.program.body;
        if (this.state.declaration === 'import') {
            let existingIndex = body.findIndex((node) => node.type === 'ImportDeclaration' && node.source && node.source.value === source);

            const importString = this.state.specifier;
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
        } else if (this.state.declaration === 'export') {
            let existingIndex = body.findIndex((node) => (node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source);

            const exportString = this.state.specifier;
            if (!exportString)
                throw new Error('No export called before from');
            const exportDeclaration = babel.template(`export ${exportString} from '${source}'`)() as babel.types.ExportNamedDeclaration;
            if (~existingIndex) {
                body.splice(existingIndex, 1, exportDeclaration);
                this.state.lastIndex = existingIndex;
            } else {
                let i;
                for (i = body.length - 1; i >= 0; i--) {
                    const node = body[i];
                    if (node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration')
                        break;
                }
                i++;
                body.splice(i, 0, exportDeclaration);
                this.state.lastIndex = i;
            }
        } else {
            throw new Error('You must call import or export before from');
        }

        this.resetState();
        return this;
    }

    /**
     * 获取所有包含 from 的 import 和 export 声明
     * import xxx from 'source'/export xxx from 'source'
     * 一般用于判断存在或删除
     */
    froms() {
        return new FromsHandler(this.ast.program.body);
    }

    default() {
        let result: DeclarationHandler;
        babel.traverse(this.ast, {
            ExportDefaultDeclaration(nodePath) {
                result = new DeclarationHandler(nodePath.node.declaration);
            },
        });
        return result;
    }

    // delete() {
    //     if (this.state.lastIndex === undefined)
    //         return;
    //         // throw new Error('Import node index Required!');

    //     const body = this.ast.program.body;
    //     body.splice(this.state.lastIndex as number, 1);
    //     this.state.lastIndex = undefined;
    // }
}

export default ScriptHandler;
