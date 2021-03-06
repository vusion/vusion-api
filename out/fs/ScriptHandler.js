"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementHandler = exports.ExportsHandler = exports.ImportsHandler = exports.FromsHandler = exports.DeclarationHandler = exports.ORDER_IN_COMPONENTS_MAP = exports.ORDER_IN_COMPONENTS = exports.LIFECYCLE_HOOKS = exports.SIMPLIFIED_NODE_TYPE = void 0;
const babel = __importStar(require("@babel/core"));
const generator_1 = __importDefault(require("@babel/generator"));
const shared_1 = require("../utils/shared");
const prettier = __importStar(require("prettier/standalone"));
const parserBabylon = __importStar(require("prettier/parser-babylon"));
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
exports.SIMPLIFIED_NODE_TYPE = {
    object: 'ObjectExpression',
    number: 'NumericLiteral',
    string: 'StringLiteral',
    id: 'Identifier',
};
exports.LIFECYCLE_HOOKS = [
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
exports.ORDER_IN_COMPONENTS = [
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
    exports.LIFECYCLE_HOOKS,
    'methods',
    'head',
    ['template', 'render'],
    'renderError'
];
exports.ORDER_IN_COMPONENTS_MAP = {};
exports.ORDER_IN_COMPONENTS.forEach((key, index) => {
    if (Array.isArray(key)) {
        key.forEach((subkey) => exports.ORDER_IN_COMPONENTS_MAP[subkey] = index);
    }
    else
        exports.ORDER_IN_COMPONENTS_MAP[key] = index;
});
class DeclarationHandler {
    constructor(node, parent) {
        this.node = node;
        this.parent = parent;
        this.resetState();
    }
    resetState() {
        this.state = {};
    }
    after(values) {
        this.state.after = values;
        return this;
    }
    is(type) {
        if (exports.SIMPLIFIED_NODE_TYPE[type])
            type = exports.SIMPLIFIED_NODE_TYPE[type];
        return this.node.type === type;
    }
    id(name) {
        // 先试试硬 assign 有没有问题
        if (this.node.type !== 'Identifier')
            Object.assign(this.node, babel.types.identifier(name));
        return this;
    }
    name() {
        if (this.node.type !== 'Identifier')
            throw new TypeError('This is not an Identifier!');
        return this.node.name;
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
    _set(key, value, force) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error(`${force ? 'set' : 'ensure'} method can only be called on an objectExpression`);
        let pos;
        const after = this.state.after || [];
        let index = this.node.properties.findIndex((property, index) => {
            if (property.type === 'ObjectProperty' && property.key.type === 'Identifier' && after.includes(property.key.name))
                pos = index;
            return property.type === 'ObjectProperty' && property.key.type === 'Identifier' && property.key.name === key;
        });
        if (pos === undefined)
            pos = this.node.properties.length;
        let valueNode;
        if (typeof value === 'string') {
            const valueDeclaration = babel.template(`const value = ${value}`)();
            valueNode = valueDeclaration.declarations[0].init;
        }
        else
            valueNode = value;
        const objectProperty = babel.types.objectProperty(babel.types.identifier(key), valueNode);
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
     * 给对象的属性赋值
     * @param key 键的名称
     * @param value 值的名称
     */
    set(key, value) {
        return this._set(key, value, true);
    }
    setMethod(key, objectMethod) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error(`setMethod method can only be called on an objectExpression`);
        let pos;
        const after = this.state.after || [];
        let index = this.node.properties.findIndex((property, index) => {
            if ((property.type === 'ObjectProperty' || property.type === 'ObjectMethod') && property.key.type === 'Identifier' && after.includes(property.key.name))
                pos = index;
            return (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') && property.key.type === 'Identifier' && property.key.name === key;
        });
        if (pos === undefined)
            pos = this.node.properties.length;
        if (~index)
            this.node.properties.splice(index, 1, objectMethod);
        else
            this.node.properties.splice(pos, 0, objectMethod);
        this.resetState();
        return this;
    }
    /**
     * 获取对象的属性值
     * @param key 键的名称
     */
    get(key) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('get method can only be called on an objectExpression');
        const objectProperty = this.node.properties.find((property, index) => {
            return property.type === 'ObjectProperty' && property.key.type === 'Identifier' && property.key.name === key;
        });
        return objectProperty && new DeclarationHandler(objectProperty.value, objectProperty);
    }
    getMethod(key) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('getMethod can only be called on an objectExpression');
        return this.node.properties.find((property, index) => {
            return property.type === 'ObjectMethod' && property.key.type === 'Identifier' && property.key.name === key;
        });
    }
    has(key) {
        return !!this.get(key);
    }
    delete(key) {
        if (this.node.type !== 'ObjectExpression')
            throw new Error('get method can only be called on an objectExpression');
        let index = this.node.properties.findIndex((property, index) => {
            return property.type === 'ObjectProperty' && property.key.type === 'Identifier' && property.key.name === key;
        });
        ~index && this.node.properties.splice(index, 1);
        return this;
    }
}
exports.DeclarationHandler = DeclarationHandler;
class FromsHandler {
    constructor(body) {
        this.body = body;
    }
    has(source) {
        let existingIndex = this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source;
        });
        return !!~existingIndex;
    }
    delete(source) {
        let existingIndex = this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source;
        });
        ~existingIndex && this.body.splice(existingIndex, 1);
    }
}
exports.FromsHandler = FromsHandler;
class ImportsHandler {
    constructor(body) {
        this.body = body;
    }
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
    findIndexFrom(source) {
        return this.body.findIndex((node) => {
            return (node.type === 'ImportDeclaration') && node.source && node.source.value === source;
        });
    }
    findFrom(source) {
        const index = this.findIndexFrom(source);
        return ~index ? this.body[index] : undefined;
    }
    hasFrom(source) {
        const index = this.findIndexFrom(source);
        return !!~index;
    }
    deleteFrom(source) {
        const index = this.findIndexFrom(source);
        ~index && this.body.splice(index, 1);
    }
    get(identifer) {
    }
}
exports.ImportsHandler = ImportsHandler;
class ExportsHandler {
    constructor(body) {
        this.body = body;
    }
    lastIndex() {
        let i;
        for (i = this.body.length - 1; i >= 0; i--) {
            const node = this.body[i];
            if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration')
                break;
        }
        return i;
    }
    last() {
        return this.body[this.lastIndex()];
    }
}
exports.ExportsHandler = ExportsHandler;
/**
 * 没有处理析构的情形
 */
class StatementHandler {
    constructor(body) {
        this.body = body;
        this.declarators = [];
        body.forEach((node) => {
            if (node.type === 'VariableDeclaration')
                this.declarators.push(...node.declarations);
        });
    }
    has(identifier) {
        return !!this.get(identifier);
    }
    get(identifier) {
        const declarator = this.declarators.find((declarator) => declarator.id.name === identifier);
        return declarator && new DeclarationHandler(declarator.init, declarator);
    }
    return(value) {
        let result = this.body.find((node) => node.type === 'ReturnStatement');
        if (!result && value !== undefined) {
            result = babel.template(`return ${value}`)();
            this.body.push(result);
        }
        return result;
    }
}
exports.StatementHandler = StatementHandler;
/**
 * JS AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
class ScriptHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.resetState();
        this.ast = this.parse(code);
    }
    parse(code) {
        return babel.parse(code, {
            filename: 'file.js',
            // Must require manually in VSCode
            plugins: [require('@babel/plugin-syntax-dynamic-import')],
        });
    }
    generate(babelOptions, prettierOptions, prettierUseBabel) {
        if (prettierUseBabel) {
            // prettier 直接用 ast format 会把注释干掉，很蛋疼，所以目前还是先用 babel 生成再 format 比较好
            return prettier.format(this.code, Object.assign({}, prettierConfig, {
                parser: () => this.ast,
            }, prettierOptions));
            // return generate(this.ast, {}, this.code).code + '\n';
        }
        else {
            const code = generator_1.default(this.ast, Object.assign({
                retainLines: true,
                concise: true,
                compact: true,
            }, babelOptions)).code;
            let formatted = prettier.format(code, Object.assign({
                parser: 'babel',
                plugins: [parserBabylon],
            }, prettierConfig, prettierOptions));
            return formatted.replace(/component: \(\) =>\s+import\(([\s\S]+?)\),/g, (m, $1) => {
                return `component: () => import(${$1.replace(/\n\s+/g, ' ').trim()}),`;
            });
        }
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
    import(specifier) {
        if (typeof specifier === 'object') {
            const insideString = Object.keys(specifier).map((imported) => {
                const identifer = specifier[imported];
                return imported + (identifer === imported || identifer === '' ? '' : ' as ' + identifer);
            }).join(', ');
            specifier = `{ ${insideString} }`;
        }
        this.state.declaration = 'import';
        this.state.specifier = specifier;
        return this;
    }
    /**
     * 用于在全部的 import 集合中处理查找、删除等操作
     */
    imports() {
        return new ImportsHandler(this.ast.program.body);
    }
    /**
     * 用于在全部的 export 集合中处理查找、删除等操作
     */
    exports() {
        return new ExportsHandler(this.ast.program.body);
    }
    export(specifier) {
        if (typeof specifier === 'object') {
            const insideString = Object.keys(specifier).map((imported) => {
                const identifer = specifier[imported];
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
    from(source) {
        const body = this.ast.program.body;
        if (this.state.declaration === 'import') {
            let existingIndex = body.findIndex((node) => node.type === 'ImportDeclaration' && node.source && node.source.value === source);
            const importString = this.state.specifier;
            if (!importString)
                throw new Error('No import called before from');
            const importDeclaration = babel.template(`import ${importString} from '${source}'`)();
            if (~existingIndex) {
                body.splice(existingIndex, 1, importDeclaration);
                this.state.lastIndex = existingIndex;
            }
            else {
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
        }
        else if (this.state.declaration === 'export') {
            let existingIndex = body.findIndex((node) => (node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value === source);
            const exportString = this.state.specifier;
            if (!exportString)
                throw new Error('No export called before from');
            const exportDeclaration = babel.template(`export ${exportString} from '${source}'`)();
            if (~existingIndex) {
                body.splice(existingIndex, 1, exportDeclaration);
                this.state.lastIndex = existingIndex;
            }
            else {
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
        }
        else {
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
        let result;
        babel.traverse(this.ast, {
            ExportDefaultDeclaration(nodeInfo) {
                result = new DeclarationHandler(nodeInfo.node.declaration, nodeInfo.node);
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
    /**
    * 用于在当前级别的作用域所有变量集合中处理查找、删除等操作
    */
    variables() {
        return new StatementHandler(this.ast.program.body);
    }
    /**
     * 处理 mixins 不去重了，直接复用
     */
    mergeArray(thisArray, thatArray) {
        const thisIdentifiers = new Map();
        thisArray.elements.forEach((element) => {
            if (element.type === 'Identifier')
                thisIdentifiers.set(element.name, true);
        });
        const replacements = {};
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
    mergeObject(thisObject, thatObject) {
        const thisKeys = new Map();
        thisObject.properties.forEach((property) => {
            if (property.type !== 'SpreadElement' && property.key.type === 'Identifier')
                thisKeys.set(property.key.name, true);
        });
        const replacements = {};
        thatObject.properties.forEach((property) => {
            if (property.type !== 'SpreadElement' && property.key.type === 'Identifier') {
                const newName = shared_1.uniqueInMap(property.key.name, thisKeys);
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
    mergeFunction(thisFunction, thatFunction) {
        const thisBody = thisFunction.body.body;
        const thatBody = thatFunction.body.body;
        const thisVariables = new Map();
        const thisStatement = new StatementHandler(thisBody);
        const thisReturn = thisStatement.return();
        const thisReturnIndex = thisReturn ? thisBody.indexOf(thisReturn) : thisBody.length;
        thisStatement.declarators.forEach((declarator) => {
            if (declarator.id.type === 'Identifier')
                thisVariables.set(declarator.id.name, true);
            // else @TODO: 处理其它析构等情形
        });
        let replacements = { variables: {}, return: {} };
        thatBody.forEach((node) => {
            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach((declarator) => {
                    if (declarator.id.type === 'Identifier') {
                        const newName = shared_1.uniqueInMap(declarator.id.name, thisVariables);
                        if (newName !== declarator.id.name)
                            declarator.id.name = replacements['variables'][declarator.id.name] = newName;
                    }
                });
            }
            else if (thisReturn && node.type === 'ReturnStatement') {
                if (thisReturn.argument.type === 'ObjectExpression' && node.argument.type === 'ObjectExpression') {
                    replacements['return'] = this.mergeObject(thisReturn.argument, node.argument);
                    return;
                }
                else {
                    console.error('Returns cannot be merged!');
                }
            }
            thisBody.splice(thisReturnIndex, 0, node);
        });
        return replacements;
    }
    mergeVueObject(thisObject, thatObject) {
        const thisProperties = thisObject.properties;
        const thisPropertiesMap = {};
        thisProperties.forEach((property) => {
            if (property.type !== 'SpreadElement' && property.key.type === 'Identifier')
                thisPropertiesMap[property.key.name] = property;
        });
        let thatOrderIndex = -1;
        const orderIndexOf = (optionsKey, lastIndex) => {
            const index = exports.ORDER_IN_COMPONENTS_MAP[optionsKey];
            return index === undefined ? lastIndex : index;
        };
        const OBJECT_OPTIONS = ['components', 'directives', 'filters', 'props', 'propsData', 'computed', 'watch', 'methods'];
        const replacements = {};
        thatObject.properties.forEach((thatProperty) => {
            // 直接合并 { ...obj } 的情况
            if (thatProperty.type === 'SpreadElement' || thatProperty.key.type !== 'Identifier')
                return thisProperties.push(thatProperty);
            const thatKey = thatProperty.key.name;
            let insertIndex = thisProperties.length;
            if (thisPropertiesMap[thatKey]) {
                const thisProperty = thisPropertiesMap[thatKey];
                if (OBJECT_OPTIONS.includes(thatKey)) {
                    replacements[thatKey] = this.mergeObject(thisProperty.value, thatProperty.value);
                    return;
                }
                else if (thatKey === 'mixins') {
                    replacements['mixins'] = this.mergeArray(thisProperty.value, thatProperty.value);
                    return;
                }
                else if (exports.LIFECYCLE_HOOKS.includes(thatKey)) {
                    let thisFunction;
                    let thatFunction;
                    if (thisProperty.type === 'ObjectMethod')
                        thisFunction = thisProperty;
                    else {
                        thisFunction = thisProperty.value;
                    }
                    if (thatProperty.type === 'ObjectMethod')
                        thatFunction = thatProperty;
                    else {
                        thatFunction = thatProperty.value;
                    }
                    /**
                     * data: Object 的情况不处理
                     */
                    this.mergeFunction(thisFunction, thatFunction);
                    return;
                }
                else if (thatKey === 'data') {
                    let thisFunction;
                    let thatFunction;
                    if (thisProperty.type === 'ObjectMethod')
                        thisFunction = thisProperty;
                    else {
                        thisFunction = thisProperty.value;
                    }
                    if (thatProperty.type === 'ObjectMethod')
                        thatFunction = thatProperty;
                    else {
                        thatFunction = thatProperty.value;
                    }
                    /**
                     * data: Object 的情况不处理
                     */
                    const dataResult = this.mergeFunction(thisFunction, thatFunction);
                    replacements['data'] = dataResult.return;
                    return;
                }
                else {
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
                        && generator_1.default(thisProperty.value, { minified: true }).code === generator_1.default(thisProperty.value, { minified: true }).code)
                        return;
                    console.warn(`不确定如何合并选项 ${thatKey}，处理的结果是将它和原选项并存！\n`);
                    insertIndex = thisProperties.indexOf(thisPropertiesMap[thatKey]) + 1;
                }
            }
            else {
                /* 找到合适插入的位置 */
                thatOrderIndex = orderIndexOf(thatProperty.key.name, thatOrderIndex);
                let thisOrderIndex = -1;
                for (let i = 0; i < thisProperties.length; i++) {
                    const thisProperty = thisProperties[i];
                    if (thisProperty.type !== 'SpreadElement' && thisProperty.key.type === 'Identifier') {
                        thisOrderIndex = orderIndexOf(thisProperty.key.name, thisOrderIndex);
                        if (thisProperty.key.name === thatProperty.key.name) {
                            insertIndex = i + 1;
                            break;
                        }
                        else if (thisOrderIndex > thatOrderIndex) {
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
    merge(that) {
        const thisBody = this.ast.program.body;
        const thatBody = that.ast.program.body;
        const imports = this.imports();
        let afterImportIndex = imports.lastIndex() + 1;
        let exportDefaultIndex = thisBody.findIndex((node) => node.type === 'ExportDefaultDeclaration');
        const hasExportDefault = !!~exportDefaultIndex;
        if (!hasExportDefault)
            exportDefaultIndex = thisBody.length;
        const thisVariables = new Map();
        this.variables().declarators.forEach((declarator) => {
            if (declarator.id.type === 'Identifier')
                thisVariables.set(declarator.id.name, true);
            // else @TODO: 处理其它析构等情形
        });
        let replacements = { variables: {} };
        thatBody.forEach((node) => {
            if (node.type === 'ImportDeclaration') { // @TODO 暂时不去重 import identifier，block 的这种情况比较少。因为 import 周边文件就变成 external() 了
                const index = imports.findIndexFrom(node.source.value);
                if (~index && generator_1.default(thisBody[index], { minified: true }).code === generator_1.default(node, { minified: true }).code)
                    thisBody.splice(index, 1, node);
                else
                    thisBody.splice(afterImportIndex++, 0, node);
            }
            else if (node.type === 'VariableDeclaration') {
                node.declarations.forEach((declarator) => {
                    if (declarator.id.type === 'Identifier') {
                        const newName = shared_1.uniqueInMap(declarator.id.name, thisVariables);
                        if (newName !== declarator.id.name)
                            declarator.id.name = replacements['variables'][declarator.id.name] = newName;
                    }
                });
                thisBody.splice(exportDefaultIndex++, 0, node);
            }
            else if (node.type === 'ExportDefaultDeclaration' && hasExportDefault) { // 这个地方虽然在循环里，但只会走一遍；如果你有两个 export default，我把代码吃了！！
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
                replacements = this.mergeVueObject(thisExportDefault.node, thatExportDefault.node);
            }
            else { // 默认插入到 export default 的位置或最后
                thisBody.splice(exportDefaultIndex++, 0, node);
            }
        });
        /* 处理代码中的 this */
        const identifierMap = Object.assign(Object.assign(Object.assign(Object.assign({}, replacements['props']), replacements['data']), replacements['computed']), replacements['methods']);
        babel.traverse(that.ast, {
            Identifier(nodeInfo) {
                if (nodeInfo.parent.type === 'MemberExpression' && nodeInfo.parent.object.type === 'ThisExpression') {
                    if (identifierMap[nodeInfo.node.name])
                        nodeInfo.node.name = identifierMap[nodeInfo.node.name];
                }
            },
        });
        return replacements;
    }
}
exports.default = ScriptHandler;
//# sourceMappingURL=ScriptHandler.js.map