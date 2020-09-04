import * as babel from '@babel/core';
import { Options as PrettierOptions } from 'prettier';
export declare const SIMPLIFIED_NODE_TYPE: {
    [type: string]: string;
};
export declare const LIFECYCLE_HOOKS: string[];
export declare const ORDER_IN_COMPONENTS: (string | string[])[];
export declare const ORDER_IN_COMPONENTS_MAP: {
    [key: string]: number;
};
export declare class DeclarationHandler {
    node: babel.types.Node;
    parent?: babel.types.Node;
    state: {
        [name: string]: string | Array<string>;
    };
    constructor(node: babel.types.Node, parent?: babel.types.Node);
    resetState(): void;
    after(values: string | Array<string>): this;
    is(type: string): boolean;
    id(name: string): this;
    name(): string;
    object(): this;
    properties(): (babel.types.ObjectMethod | babel.types.ObjectProperty | babel.types.SpreadElement)[];
    private _set;
    /**
     * 确保拥有此属性。如果没有，则将第二个参数设为此属性
     * @param key
     * @param value
     */
    ensure(key: string, value?: string | babel.types.Expression | babel.types.PatternLike): this;
    /**
     * 给对象的属性赋值
     * @param key 键的名称
     * @param value 值的名称
     */
    set(key: string, value: string | babel.types.Expression | babel.types.PatternLike): this;
    setMethod(key: string, objectMethod: babel.types.ObjectMethod): this;
    /**
     * 获取对象的属性值
     * @param key 键的名称
     */
    get(key: string): DeclarationHandler;
    getMethod(key: string): babel.types.ObjectMethod;
    has(key: string): boolean;
    delete(key: string): this;
}
export declare class FromsHandler {
    body: babel.types.Statement[];
    constructor(body: babel.types.Statement[]);
    has(source: string): boolean;
    delete(source: string): void;
}
export declare class ImportsHandler {
    body: babel.types.Statement[];
    constructor(body: babel.types.Statement[]);
    lastIndex(): number;
    last(): babel.types.Statement;
    findIndexFrom(source: string): number;
    findFrom(source: string): babel.types.Statement;
    hasFrom(source: string): boolean;
    deleteFrom(source: string): void;
    get(identifer: string): void;
}
export declare class ExportsHandler {
    body: babel.types.Statement[];
    constructor(body: babel.types.Statement[]);
    lastIndex(): number;
    last(): babel.types.Statement;
}
/**
 * 没有处理析构的情形
 */
export declare class StatementHandler {
    body: babel.types.Statement[];
    declarators: babel.types.VariableDeclarator[];
    constructor(body: babel.types.Statement[]);
    has(identifier: string): boolean;
    get(identifier: string): DeclarationHandler;
    return(value?: string): babel.types.ReturnStatement;
}
/**
 * JS AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
declare class ScriptHandler {
    code: string;
    ast: babel.types.File;
    dirty: boolean;
    state: {
        [name: string]: string | number | Array<string>;
    };
    constructor(code?: string, options?: Object);
    parse(code: string): babel.types.File;
    generate(babelOptions?: babel.GeneratorOptions, prettierOptions?: PrettierOptions, prettierUseBabel?: boolean): string;
    resetState(): void;
    /**
     * 引入
     * @param specifier 指示符
     * @example
     * $js.import('*').from('./u-button.vue');
     * $js.import('UButton').from('./u-button.vue');
     * $js.import({ default: 'UButton', UButton2: '', UButton3: 'UButton3' }).from('./u-button.vue');
     */
    import(specifier: string | {
        [imported: string]: string;
    }): this;
    /**
     * 用于在全部的 import 集合中处理查找、删除等操作
     */
    imports(): ImportsHandler;
    /**
     * 用于在全部的 export 集合中处理查找、删除等操作
     */
    exports(): ExportsHandler;
    export(specifier?: string | {
        [imported: string]: string;
    }): this;
    /**
     * 从哪里引入
     * 如果遇到相同路径，以前的会被替换；如果不存在相同路径，则添加到最后一个 ImportDeclaration 之后
     * @param source 文件路径
     */
    from(source: string): this;
    /**
     * 获取所有包含 from 的 import 和 export 声明
     * import xxx from 'source'/export xxx from 'source'
     * 一般用于判断存在或删除
     */
    froms(): FromsHandler;
    default(): DeclarationHandler;
    /**
    * 用于在当前级别的作用域所有变量集合中处理查找、删除等操作
    */
    variables(): StatementHandler;
    /**
     * 处理 mixins 不去重了，直接复用
     */
    mergeArray(thisArray: babel.types.ArrayExpression, thatArray: babel.types.ArrayExpression): {
        [old: string]: string;
    };
    mergeObject(thisObject: babel.types.ObjectExpression, thatObject: babel.types.ObjectExpression): {
        [old: string]: string;
    };
    /**
     * 没有管 params 不相同的情况
     * @param thisFunction
     * @param thatFunction
     */
    mergeFunction(thisFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression, thatFunction: babel.types.ObjectMethod | babel.types.FunctionExpression | babel.types.ArrowFunctionExpression): {
        [key: string]: {
            [old: string]: string;
        };
    };
    mergeVueObject(thisObject: babel.types.ObjectExpression, thatObject: babel.types.ObjectExpression): {
        [key: string]: {
            [old: string]: string;
        };
    };
    /**
     * 将另一个 that 的脚本合并到当前样式中
     * 原则是处理能够名单里的代码，其它的自然合并（因此可能会有问题）
     * @TODO 目前对另一个 that 的样式 ast 有修改
     * @param that 另一个 ScriptHandler
     */
    merge(that: ScriptHandler): {
        [key: string]: {
            [old: string]: string;
        };
    };
}
export default ScriptHandler;
