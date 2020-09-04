import * as compiler from 'vue-template-compiler';
export declare class ASTNodeInfo {
    node: compiler.ASTNode;
    parent: compiler.ASTElement;
    route: string;
    constructor(node: compiler.ASTNode, parent: compiler.ASTElement, route?: string);
    remove(): void;
}
declare type ASTElement = compiler.ASTElement;
export interface TemplateOptions {
    tabLength?: number;
    startLevel?: number;
}
/**
 * 模板 AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
declare class TemplateHandler {
    code: string;
    ast: ASTElement;
    options: TemplateOptions;
    constructor(code?: string, options?: TemplateOptions);
    parse(code: string): compiler.ASTElement;
    generate(options?: TemplateOptions): string;
    generateElement(el: ASTElement, level: number, options: TemplateOptions): string;
    traverse(func: (nodeInfo: ASTNodeInfo) => any): any;
    /**
     * 根据路径查找子节点
     * @param nodePath 节点路径，/1/2 表示根节点的第1个子节点的第2个子节点
     * @param node 查找的起始节点
     * @examples
     * - findByNodePath('', root) 指根节点本身
     * - findByNodePath('/', root) 指根节点本身
     * - findByNodePath('/0', root) 指第0个子节点
     * - findByNodePath('/2/1', root) 指第2个子节点的第1个子节点
     */
    findByNodePath(nodePath: string, node: compiler.ASTNode): compiler.ASTNode;
    findByRoute(route: string, node: compiler.ASTNode): compiler.ASTNode;
    /**
     * 该函数处理一个试用阶段
     * @param position
     */
    findByPosition(position: number | {
        line: number;
        character: number;
    }): compiler.ASTNode;
    /**
     * 将另一个 that 的模板合并到当前模板中
     * @param that 另一个 TemplateHandler
     * @param route 插入的节点路径，最后一位表示节点位置，为空表示最后，比如 /1/2/1 表示插入到根节点的第1个子节点的第2个子节点的第1个位置
     * - merge(that, '') 指根节点本身
     * - merge(that, '/') 指根节点本身
     * - merge(that, '/0') 指第0个子节点
     * - merge(that, '/2/1') 指第2个子节点的第1个子节点
     * - merge(that, '/2/') 指第2个子节点的最后
     * @param replacements 需要跟着替换的样式和变量
     */
    merge(that: TemplateHandler, route: string | number | {
        line: number;
        character: number;
    }, replacements?: {
        [key: string]: {
            [old: string]: string;
        };
    }): void;
}
export default TemplateHandler;
