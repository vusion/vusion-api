import * as babel from '@babel/core';
import generate from '@babel/generator';
import * as prettier from 'prettier';
import { uniqueInMap } from '../utils';

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

export const SIMPLIFIED_NODE_TYPE: { [type: string]: string } = {
    object: 'ObjectExpression',
    number: 'NumericLiteral',
    string: 'StringLiteral',
}

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'beforeDestroy',
    'destroyed'
];

export const ORDER_IN_COMPONENTS = [
    'el',
    'name',
    'parent',
    'functional',
    ['delimiters', 'comments'],
    ['components', 'directives', 'filters'],
    'extends',
    'mixins',
    'inheritAttrs',
    'model',
    ['props', 'propsData'],
    'fetch',
    'asyncData',
    'data',
    'computed',
    'watch',
    LIFECYCLE_HOOKS,
    'methods',
    'head',
    ['template', 'render'],
    'renderError'
];
export const ORDER_IN_COMPONENTS_MAP: { [key: string]: number } = {};
ORDER_IN_COMPONENTS.forEach((key, index) => {
    if (Array.isArray(key)) {
        key.forEach((subkey) => ORDER_IN_COMPONENTS_MAP[subkey] = index);
    } else
        ORDER_IN_COMPONENTS_MAP[key] = index;
});

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

    is(type: string) {
        if (SIMPLIFIED_NODE_TYPE[type])
            type = SIMPLIFIED_NODE_TYPE[type];
        return this.node.type === type;
    }

    object() {
        // 先试试硬 assign 有没有问题
        if (this.node.type !== 'ObjectExpression')
            Object.assign(this.node, babel.types.objectExpression([]));
        return this;
    }

    properties() {
        if (this.node.type !== 'ObjectExpression')
            throw new TypeError('This is not an ObjectExpression!');

        return this.node.properties;
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

class ImportsHandler {
    constructor(public body: babel.types.Statement[]) {}

    lastIndex() {
        let i;
        for (i = this.body.length - 1; i >= 0; i--) {
            const node = this.body[i];
            if (node.type === 'ImportDeclaration')
                break;
        }
        return i;
    }

    last() {
        return this.body[this.lastIndex()];
    }

    findIndex(source: string) {
        return this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration') && node.source && node.source.value === source;
        });
    }

    find(source: string) {
        const index = this.findIndex(source);
        return ~index ? this.body[index] : undefined;
    }

    has(source: string) {
        const index = this.findIndex(source);
        return !!~index;
    }

    delete(source: string) {
        const index = this.findIndex(source);
        ~index && this.body.splice(index, 1);
    }
}

/**
 * 没有处理析构的情形
 */
class StatementHandler {
    declarators: babel.types.VariableDeclarator[] = [];
    constructor(public body: babel.types.Statement[]) {
        body.forEach((node) => {
            if (node.type === 'VariableDeclaration')
                this.declarators.push(...node.declarations);
        });
    }

    has(identifier: string) {
        return !!this.declarators.find((declarator) => (declarator.id as babel.types.Identifier).name === identifier);
    }

    return() {
        return this.body.find((node) => node.type === 'ReturnStatement') as babel.types.ReturnStatement;
    }

    // map(func: (value: babel.types.VariableDeclarator, index: number, array: babel.types.VariableDeclarator[]) => any, thisArg?: any) {
    //     return this.declarators.map(func, thisArg || this);
    // }
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
        const code = generate(this.ast, {
            retainLines: true,
            concise: true,
            compact: true,
        }).code;
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

    imports() {
        return new ImportsHandler(this.ast.program.body);
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

    variables() {
        return new StatementHandler(this.ast.program.body);
    }

    /**
     * 处理 mixins 不去重了，直接复用
     */
    mergeArray(thisArray: babel.types.ArrayExpression, thatArray: babel.types.ArrayExpression) {
        const thisIdentifiers: Map<string, true> = new Map();
        thisArray.elements.forEach((element) => {
            if (element.type === 'Identifier')
                thisIdentifiers.set(element.name, true);
        });

        const replacements: { [old: string]: string } = {};
        thatArray.elements.forEach((element) => {
            if (element.type === 'Identifier') {
                if (thisIdentifiers.has(element.name))
                    return;
                // const newName = uniqueInMap(element.name, thisIdentifiers);
                // if (newName !== element.name)
                //     element.name = replacements[element.name] = newName;
            }
            thisArray.elements.push(element);
        });

        return replacements;
    }

    mergeObject(thisObject: babel.types.ObjectExpression, thatObject: babel.types.ObjectExpression) {
        const thisKeys: Map<string, true> = new Map();
        thisObject.properties.forEach((property) => {
            if (property.type !== 'SpreadElement')
                thisKeys.set(property.key.name, true);
        });

        const replacements: { [old: string]: string } = {};
        thatObject.properties.forEach((property) => {
            if (property.type !== 'SpreadElement') {
                const newName = uniqueInMap(property.key.name, thisKeys);
                if (newName !== property.key.name)
                    property.key.name = replacements[property.key.name] = newName;
            }
            thisObject.properties.push(property);
        });

        return replacements;
    }

    /**
     * 没有管 params 不相同的情况
     * @param thisFunction
     * @param thatFunction
     */
    mergeFunction(thisFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression, thatFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression) {
        const thisBody = (thisFunction.body as babel.types.BlockStatement).body;
        const thatBody = (thatFunction.body as babel.types.BlockStatement).body;

        const thisVariables: Map<string, true> = new Map();
        const thisStatement = new StatementHandler(thisBody);
        const thisReturn = thisStatement.return();
        const thisReturnIndex = thisReturn ? thisBody.indexOf(thisReturn) : thisBody.length;
        thisStatement.declarators.forEach((declarator) => {
            if (declarator.id.type === 'Identifier')
                thisVariables.set(declarator.id.name, true);
            // else @TODO: 处理其它析构等情形
        });

        let replacements: { [key: string]: { [old: string]: string } } = { variables: {}, return: {} };
        thatBody.forEach((node) => {
            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach((declarator) => {
                    if (declarator.id.type === 'Identifier') {
                        const newName = uniqueInMap(declarator.id.name, thisVariables);
                        if (newName !== declarator.id.name)
                            declarator.id.name = replacements['variables'][declarator.id.name] = newName;
                    }
                });
            } else if (thisReturn && node.type === 'ReturnStatement') {
                if (thisReturn.argument.type === 'ObjectExpression' && node.argument.type === 'ObjectExpression') {
                    replacements['return'] = this.mergeObject(
                        thisReturn.argument,
                        node.argument,
                    );
                    return;
                } else {
                    console.error('Returns cannot be merged!');
                }
            }
            thisBody.splice(thisReturnIndex, 0, node);
        });

        return replacements;
    }

    mergeVueObject(thisObject: babel.types.ObjectExpression, thatObject: babel.types.ObjectExpression) {
        const thisProperties = thisObject.properties;
        const thisPropertiesMap: { [key: string]: babel.types.ObjectProperty | babel.types.ObjectMethod } = {};
        thisProperties.forEach((property) => {
            if (property.type !== 'SpreadElement')
                thisPropertiesMap[property.key.name] = property;
        });

        let thatOrderIndex = -1;
        const orderIndexOf = (optionsKey: string, lastIndex: number) => {
            const index = ORDER_IN_COMPONENTS_MAP[optionsKey];
            return index === undefined ? lastIndex : index;
        }
        const OBJECT_OPTIONS = ['components', 'directives', 'filters', 'props', 'propsData', 'computed', 'watch', 'methods'];
        const replacements: { [key: string]: { [old: string]: string } } = {};
        thatObject.properties.forEach((thatProperty) => {
            // 直接合并 { ...obj } 的情况
            if (thatProperty.type === 'SpreadElement')
                return thisProperties.push(thatProperty);

            const thatKey = thatProperty.key.name;
            let insertIndex = thisProperties.length;
            if (thisPropertiesMap[thatKey]) {
                const thisProperty = thisPropertiesMap[thatKey];
                if (OBJECT_OPTIONS.includes(thatKey)) {
                    replacements[thatKey] = this.mergeObject(
                        (thisProperty as babel.types.ObjectProperty).value as babel.types.ObjectExpression,
                        (thatProperty as babel.types.ObjectProperty).value as babel.types.ObjectExpression,
                    );
                    return;
                } else if (thatKey === 'mixins') {
                    replacements['mixins'] = this.mergeArray(
                        (thisProperty as babel.types.ObjectProperty).value as babel.types.ArrayExpression,
                        (thatProperty as babel.types.ObjectProperty).value as babel.types.ArrayExpression,
                    );
                    return;
                } else if (LIFECYCLE_HOOKS.includes(thatKey)) {
                    let thisFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression;
                    let thatFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression;

                    if (thisProperty.type === 'ObjectMethod')
                        thisFunction = thisProperty;
                    else {
                        thisFunction = thisProperty.value as babel.types.FunctionExpression;
                    }

                    if (thatProperty.type === 'ObjectMethod')
                        thatFunction = thatProperty;
                    else {
                        thatFunction = thatProperty.value as babel.types.FunctionExpression;
                    }

                    /**
                     * data: Object 的情况不处理
                     */
                    this.mergeFunction(thisFunction, thatFunction);
                    return;
                } else if (thatKey === 'data') {
                    let thisFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression;
                    let thatFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression;

                    if (thisProperty.type === 'ObjectMethod')
                        thisFunction = thisProperty;
                    else {
                        thisFunction = thisProperty.value as babel.types.FunctionExpression;
                    }

                    if (thatProperty.type === 'ObjectMethod')
                        thatFunction = thatProperty;
                    else {
                        thatFunction = thatProperty.value as babel.types.FunctionExpression;
                    }

                    /**
                     * data: Object 的情况不处理
                     */
                    const dataResult = this.mergeFunction(thisFunction, thatFunction);
                    replacements['data'] = dataResult.return;
                    return;
                } else {
                    // [
                    //     'el',
                    //     'name',
                    //     'parent',
                    //     'functional',
                    //     ['delimiters', 'comments'],
                    //     'extends',
                    //     'inheritAttrs',
                    //     'model',
                    //     ['template', 'render'],
                    //     'renderError'
                    // ]
                    if (thisProperty.type === 'ObjectProperty' && thatProperty.type === 'ObjectProperty'
                        && generate(thisProperty.value, { minified: true }).code ===  generate(thisProperty.value, { minified: true }).code)
                            return;
                    console.warn(`不确定如何合并选项 ${thatKey}，处理的结果是将它和原选项并存！\n`);
                    insertIndex = thisProperties.indexOf(thisPropertiesMap[thatKey]) + 1;
                }
            } else {
                /* 找到合适插入的位置 */
                thatOrderIndex = orderIndexOf(thatProperty.key.name, thatOrderIndex);
                let thisOrderIndex = -1;
                for (let i = 0; i < thisProperties.length; i++) {
                    const thisProperty = thisProperties[i];
                    if (thisProperty.type !== 'SpreadElement') {
                        thisOrderIndex = orderIndexOf(thisProperty.key.name, thisOrderIndex);
                        if (thisProperty.key.name === thatProperty.key.name) {
                            insertIndex = i + 1;
                            break;
                        } else if (thisOrderIndex > thatOrderIndex) {
                            insertIndex = i;
                            break;
                        }
                    }
                }
            }
            thisProperties.splice(insertIndex, 0, thatProperty);
        });

        return replacements;
    }

    /**
     * 将另一个 that 的脚本合并到当前样式中
     * 原则是处理能够名单里的代码，其它的自然合并（因此可能会有问题）
     * @TODO 目前对另一个 that 的样式 ast 有修改
     * @param that 另一个 ScriptHandler
     */
    merge(that: ScriptHandler) {
        const thisBody = this.ast.program.body;
        const thatBody = that.ast.program.body;

        const imports = this.imports();
        let afterImportIndex = imports.lastIndex() + 1;
        let exportDefaultIndex = thisBody.findIndex((node) => node.type === 'ExportDefaultDeclaration');
        const hasExportDefault = !!~exportDefaultIndex;
        if (!hasExportDefault)
            exportDefaultIndex = thisBody.length;

        const thisVariables: Map<string, true> = new Map();
        this.variables().declarators.forEach((declarator) => {
            if (declarator.id.type === 'Identifier')
                thisVariables.set(declarator.id.name, true);
            // else @TODO: 处理其它析构等情形
        });

        let replacements: { [key: string]: { [old: string]: string } } = { variables: {} };
        thatBody.forEach((node) => {
            if (node.type === 'ImportDeclaration') { // @TODO 暂时不去重 import identifier，block 的这种情况比较少。因为 import 周边文件就变成 external() 了
                const index = imports.findIndex(node.source.value);
                if (~index && generate(thisBody[index], { minified: true }).code === generate(node, { minified: true }).code)
                    thisBody.splice(index, 1, node);
                else
                    thisBody.splice(afterImportIndex++, 0, node);
            } else if (node.type === 'VariableDeclaration') {
                node.declarations.forEach((declarator) => {
                    if (declarator.id.type === 'Identifier') {
                        const newName = uniqueInMap(declarator.id.name, thisVariables);
                        if (newName !== declarator.id.name)
                            declarator.id.name = replacements['variables'][declarator.id.name] = newName;
                    }
                });
                thisBody.splice(exportDefaultIndex++, 0, node);
            } else if (node.type === 'ExportDefaultDeclaration' && hasExportDefault) { // 这个地方虽然在循环里，但只会走一遍；如果你有两个 export default，我把代码吃了！！
                /*
                  处理 Vue 的大片
                  按照 Vue ComponentOptions 进行处理 https://github.com/vuejs/vue/blob/dev/types/options.d.ts#L67
                  顺序参照 https://eslint.vuejs.org/rules/order-in-components.html#options
                */
                const thisExportDefault = this.export().default();
                if (!thisExportDefault.is('object')) // 如果不是 object 不处理了
                    return thisBody.splice(exportDefaultIndex++, 0, node);
                const thatExportDefault = that.export().default();
                if (!thatExportDefault.is('object')) // 如果不是 object 不处理了
                    return thisBody.splice(exportDefaultIndex++, 0, node);

                replacements = this.mergeVueObject(
                    thisExportDefault.node as babel.types.ObjectExpression,
                    thatExportDefault.node as babel.types.ObjectExpression,
                );
            } else { // 默认插入到 export default 的位置或最后
                thisBody.splice(exportDefaultIndex++, 0, node);
            }
        });

        /* 处理代码中的 this */
        const identifierMap = { ...replacements['props'], ...replacements['data'], ...replacements['computed'], ...replacements['method'] };
        babel.traverse(that.ast, {
            Identifier(nodePath) {
                if (nodePath.parent.type === 'MemberExpression' && nodePath.parent.object.type === 'ThisExpression') {
                    if (identifierMap[nodePath.node.name])
                        nodePath.node.name = identifierMap[nodePath.node.name];
                }
            },
        });

        return replacements;
    }
}

export default ScriptHandler;
