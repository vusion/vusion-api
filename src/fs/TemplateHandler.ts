import * as compiler from 'vue-template-compiler';
import * as babel from '@babel/core';
import generate from '@babel/generator';
import * as prettier from 'prettier';

export class ASTNodeInfo {
    constructor(
        public node: compiler.ASTNode,
        public parent: compiler.ASTElement,
        public route: string = '',
    ) {}

    remove() {
        const index = this.parent.children.indexOf(this.node);
        if (~index)
            this.parent.children.splice(index, 1);
        else if (this.parent.scopedSlots && this.parent.scopedSlots[(this.node as ASTElement).slotTarget] === this.node)
            delete this.parent.scopedSlots[(this.node as ASTElement).slotTarget];
    }
}


type Attr = { name: string, value: any, start?: number, end?: number };
type ASTElement = compiler.ASTElement
//  & {
//     rawAttrsMap: {
//         [name: string]: Attr,
//     }
// }

export interface TemplateOptions {
    tabLength?: number,
    startLevel?: number,
};

/**
 * 模板 AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
class TemplateHandler {
    code: string;
    ast: ASTElement;
    options: TemplateOptions;

    constructor(code: string = '', options?: TemplateOptions) {
        this.code = code;
        this.ast = this.parse(code) as ASTElement;
        this.options = Object.assign({
            tabLength: 4,
            startLevel: 0,
        }, options);
    }

    parse(code: string) {
        const compilerOptions: compiler.CompilerOptions = {
            preserveWhitespace: false,
            outputSourceRange: true,
        };

        return compiler.compile(code, compilerOptions).ast;
    }

    generate(options?: TemplateOptions) {
        options = Object.assign({}, this.options, options);

        // @TODO: 暂时没有很好的 generate
        const tabs = ' '.repeat(options.tabLength*options.startLevel);
        return tabs + this.generateElement(this.ast, options.startLevel, options) + '\n';
        // return this.code;
    }

    generateElement(el: ASTElement, level: number, options: TemplateOptions) {
        const tabs = ' '.repeat(options.tabLength*level);
        const insideTabs = ' '.repeat(options.tabLength*(level + 1));

        let shouldFormat = true;
        const children = [].concat(el.children, !el.scopedSlots ? [] : Object.keys(el.scopedSlots).map((key) => el.scopedSlots[key]));
        const content: string = children.map((node) => {
            let text = '';

            if (node.type === 1)
                text = (shouldFormat ? '\n' + insideTabs : '') + this.generateElement(node as ASTElement, level + 1, options);
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
            if (key.startsWith('vusion-'))
                return '';

            const value = el.attrsMap[key];
            if (value === '') {
                // const attr = (el as any).rawAttrsMap[key];
                // if (attr && attr.end - attr.start === key.length)
                    return key;
            }
            return `${key}="${value}"`;
        });

        let attrsLength = 0;
        let attrsString = '';
        attrs.forEach((attr) => {
            if (!attr)
                return;
            if (attrsLength >= 120 || attr.length >= 120) {
                attrsString += '\n' + tabs + ' '.repeat(3) // ' '.repeat(el.tag.length + 1);
                attrsLength = 0;
            }
            attrsString += ' ' + attr;
            attrsLength += attr.length;
        })


        return `<${el.tag}${attrs.length ? attrsString : ''}>` + content + (shouldFormat ? '\n' + tabs : '') + `</${el.tag}>`;
    }

    traverse(func: (nodeInfo: ASTNodeInfo) => any) {
        let queue: Array<ASTNodeInfo> = [];
        queue = queue.concat(new ASTNodeInfo(this.ast, null, ''));
        let nodeInfo: ASTNodeInfo;
        while ((nodeInfo = queue.shift())) {
            if (nodeInfo.node.type === 1) {
                const parent = nodeInfo.node as ASTElement;
                const children = [].concat(parent.children, !parent.scopedSlots ? [] : Object.keys(parent.scopedSlots).map((key) => parent.scopedSlots[key]));
                queue.push(... children.map((node, index) => new ASTNodeInfo(node, parent, nodeInfo.route + '/' + index)));
            }
            const result = func(nodeInfo);
            if (result !== undefined)
                return result;
        }
    }

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
    findByNodePath(nodePath: string, node: compiler.ASTNode): compiler.ASTNode {
        if (nodePath[0] === '/') // 这个里边相对和绝对是一样的
            nodePath = nodePath.slice(1);
        const arr = nodePath.split('/');
        if (!nodePath || !arr.length)
            return node;
        else {
            const parent = node as ASTElement;
            const children = [].concat(parent.children, !parent.scopedSlots ? [] : Object.keys(parent.scopedSlots).map((key) => parent.scopedSlots[key]));
            return this.findByNodePath(arr.slice(1).join('/'), children[+arr[0]]);
        }
    }

    findByRoute(route: string, node: compiler.ASTNode): compiler.ASTNode {
        return this.findByNodePath(route, node);
    }

    /**
     * 该函数处理一个试用阶段
     * @param position
     */
    findByPosition(position: number | { line: number, character: number }): compiler.ASTNode {
        if (typeof position === 'object') {
            let pos = 0;
            const lines = this.code.split('\n');
            for (let i = 0; i < position.line - 1; i++)
                pos += lines[i].length + 1;
            pos += position.character - this.options.tabLength * this.options.startLevel;
            position = pos;
        }

        let found: compiler.ASTNode;
        this.traverse((nodeInfo) => {
            const node = nodeInfo.node as any;
            if (node.start <= position && position < node.end)
                found = node as compiler.ASTNode;
        });

        if (!found)
            return this.ast;
        return found;
    }

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
    merge(that: TemplateHandler, route: string | number | { line: number, character: number }, replacements?: { [key: string]: { [old: string]: string } }) {
        if (replacements) {
            const classKeys = Object.keys(replacements['class']);
            // @TODO: 'directives', 'filters'
            const identifierMap = { ...replacements['props'], ...replacements['data'], ...replacements['computed'], ...replacements['methods'] };
            const identifierKeys = Object.keys(identifierMap);
            function fix(expr: string) {
                const ast = babel.parse('const __RESULT__ = ' + expr, {
                    filename: 'file.js',
                });
                let changed = false;
                // 替换是个小概率事件，而且主要是替换 Block，因此不用考虑太多情况
                babel.traverse(ast, {
                    Identifier(nodeInfo) {
                        if (nodeInfo.parent.type === 'MemberExpression' && nodeInfo.parent.object.type !== 'ThisExpression' && nodeInfo.parent.property === nodeInfo.node)
                            return nodeInfo.skip();
                        if (identifierMap[nodeInfo.node.name]) {
                            nodeInfo.node.name = identifierMap[nodeInfo.node.name];
                            changed = true;
                        }
                    },
                    Function(nodeInfo) { // @TODO: Function 作用域的问题
                        nodeInfo.skip();
                    },
                });
                return changed ? generate(((ast as babel.types.File).program.body[0] as babel.types.VariableDeclaration).declarations[0].init, { concise: true }).code : expr;
            }

            // @TODO: v-for 内部作用域的问题
            // @TODO: classBinding, styleBinding
            that.traverse((nodeInfo) => {
                if (nodeInfo.node.type === 1) {
                    const node = nodeInfo.node;
                    if (classKeys.length && node.classBinding) {
                        classKeys.forEach((key) => {
                            node.attrsMap[':class'] = node.classBinding = node.classBinding
                                .replace(new RegExp(`(\\$style\\.)${key}(?![-_a-zA-Z0-9])|(\\$style\\[['"])${key}(?![-_a-zA-Z0-9])(['"]\\])`, 'g'), (m, $1, $2, $3) => {
                                    if ($1)
                                        return $1 + replacements['class'][key];
                                    else
                                        return $2 + replacements['class'][key] + $3;
                                });
                        });
                    }
                    if (identifierKeys.length) {
                        /* attrsList 里有绑定属性、事件和指令，没有 v-if, v-for 和 class */
                        node.attrsList.forEach((attr, index) => {
                            if (attr.name.startsWith(':') || attr.name.startsWith('@') || attr.name.startsWith('v-')) {
                                const newExpr = fix(attr.value);
                                if (newExpr !== attr.value) {
                                    attr.value = newExpr;
                                    node.attrsMap[attr.name] = newExpr;

                                    let pureName: string;
                                    if (attr.name.startsWith(':'))
                                        pureName = attr.name.slice(1);
                                    else if (attr.name.startsWith('v-bind:'))
                                        pureName = attr.name.slice(7);
                                    if (pureName) {
                                        const realAttr = node.attrs.find((realAttr) => realAttr.name === pureName);
                                        realAttr && (realAttr.value = newExpr);
                                        return;
                                    }

                                    if (attr.name.startsWith('@'))
                                        pureName = attr.name.slice(1);
                                    if (attr.name.startsWith('v-on:'))
                                        pureName = attr.name.slice(5);
                                    if (pureName) {
                                        const event = node.events && node.events[pureName] as compiler.ASTElementHandler;
                                        event && (event.value = newExpr);
                                        const nativeEvent = node.nativeEvents && node.nativeEvents[pureName] as compiler.ASTElementHandler;
                                        nativeEvent && (nativeEvent.value = newExpr);
                                        return;
                                    }

                                    if (attr.name.startsWith('v-')) {
                                        const directive = node.directives.find((directive) => directive.rawName === attr.name)
                                        if (directive) {
                                            directive.value = newExpr;
                                            if (directive.name === 'model') {
                                                node.model.value = `(${newExpr})`;
                                                node.model.expression = `"${newExpr}"`;
                                                node.model.callback // = `"${newExpr}"`;
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        if (node.if) {
                            const newExpr = fix(node.if);
                            if (newExpr !== node.if) {
                                node.if = newExpr;
                                node.ifConditions[0].exp = newExpr;
                                node.attrsMap['v-if'] = newExpr;
                            }
                        }
                        if (node.elseif) {
                            const newExpr = fix(node.elseif);
                            if (newExpr !== node.elseif) {
                                node.elseif = newExpr;
                                node.attrsMap['v-else-if'] = newExpr;
                            }
                        }
                        if (node.for) {
                            const newExpr = fix(node.for);
                            if (newExpr !== node.for) {
                                node.for = newExpr;
                                node.attrsMap['v-for'] = (node.attrsMap['v-for'] as string).replace(/(\s+(?:in|of)\s+)(.+)$/, (m, $1) => $1 + newExpr);
                            }
                        }
                    }
                } else if (nodeInfo.node.type === 2) {
                    const node = nodeInfo.node;
                    let changed = false;
                    const text = node.tokens.map((token) => {
                        if (typeof token !== 'string') {
                            const newExpr = fix(token['@binding']);
                            if (newExpr !== token['@binding']) {
                                token['@binding'] = newExpr;
                                changed = true;
                            }
                            return `{{ ${token['@binding']} }}`;
                        } else
                            return token;
                    }).join('');

                    if (changed)
                        node.text = text;
                }
            });
        }

        let el: compiler.ASTElement;
        let index: number = 0;
        if (typeof route === 'string') {
            if (route[0] === '/') // 这个里边相对和绝对是一样的
                route = route.slice(1);
            const arr = route.split('/');
            const last = arr[arr.length - 1];

            const parentNodePath = arr.slice(0, -1).join('/');
            el = this.findByNodePath(parentNodePath, this.ast) as compiler.ASTElement;
            index = last === undefined || last === '' ? el.children.length : +last;
        } else {
            el = this.findByPosition(route) as compiler.ASTElement;
            index = el.children.length;
        }
        if (!el.children)
            throw new Error(`Not an element node! route: ${route}`);
        el.children.splice(index, 0, that.ast);
    }
}

export default TemplateHandler;
