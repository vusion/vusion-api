"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler = require("vue-template-compiler");
const babel = require("@babel/core");
const generator_1 = require("@babel/generator");
class ASTNodePath {
    constructor(node, parent, route = '') {
        this.node = node;
        this.parent = parent;
        this.route = route;
    }
    remove() {
        const index = this.parent.children.indexOf(this.node);
        ~index && this.parent.children.splice(index, 1);
    }
}
exports.ASTNodePath = ASTNodePath;
;
class TemplateHandler {
    constructor(code = '', options) {
        this.code = code;
        this.ast = this.parse(code);
        this.options = Object.assign({
            tabLength: 4,
            startLevel: 0,
        }, options);
    }
    parse(code) {
        const compilerOptions = {
            preserveWhitespace: false,
            outputSourceRange: true,
        };
        return compiler.compile(code, compilerOptions).ast;
    }
    generate(options) {
        options = Object.assign({}, this.options, options);
        // @TODO: 暂时没有很好的 generate
        const tabs = ' '.repeat(options.tabLength * options.startLevel);
        return tabs + this.generateElement(this.ast, options.startLevel, options) + '\n';
        // return this.code;
    }
    generateElement(el, level, options) {
        const tabs = ' '.repeat(options.tabLength * level);
        const insideTabs = ' '.repeat(options.tabLength * (level + 1));
        let shouldFormat = true;
        const content = el.children.map((node) => {
            let text = '';
            if (node.type === 1)
                text = (shouldFormat ? '\n' + insideTabs : '') + this.generateElement(node, level + 1, options);
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
            const value = el.attrsMap[key];
            if (value === '') {
                const attr = el.attrs.find((attr) => attr.name === '');
                if (attr && attr.value !== '')
                    return `${key}="${value}"`;
                else
                    return key;
            }
            else
                return `${key}="${value}"`;
        });
        let attrsLength = 0;
        let attrsString = '';
        attrs.forEach((attr) => {
            if (attrsLength >= 120 || attr.length >= 120) {
                attrsString += '\n' + tabs + ' '.repeat(3); // ' '.repeat(el.tag.length + 1);
                attrsLength = 0;
            }
            attrsString += ' ' + attr;
            attrsLength += attr.length;
        });
        return `<${el.tag}${attrs.length ? attrsString : ''}>` + content + (shouldFormat ? '\n' + tabs : '') + `</${el.tag}>`;
    }
    traverse(func) {
        let queue = [];
        queue = queue.concat(new ASTNodePath(this.ast, null, ''));
        let nodePath;
        while ((nodePath = queue.shift())) {
            if (nodePath.node.type === 1) {
                const parent = nodePath.node;
                queue = queue.concat(parent.children.map((node, index) => new ASTNodePath(node, parent, nodePath.route + '/' + index)));
            }
            const result = func(nodePath);
            if (result !== undefined)
                return result;
        }
    }
    /**
     * 根据路径查找子节点
     * @param route 节点路径，/1/2 表示根节点的第1个子节点的第2个子节点
     * @param node 查找的起始节点
     * @examples
     * - findByRoute('', root) 指根节点本身
     * - findByRoute('/', root) 指根节点本身
     * - findByRoute('/0', root) 指第0个子节点
     * - findByRoute('/2/1', root) 指第2个子节点的第1个子节点
     */
    findByRoute(route, node) {
        if (route[0] === '/') // 这个里边相对和绝对是一样的
            route = route.slice(1);
        const arr = route.split('/');
        if (!route || !arr.length)
            return node;
        else
            return this.findByRoute(arr.slice(1).join('/'), node.children[+arr[0]]);
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
    merge(that, route, replacements) {
        if (replacements) {
            const classKeys = Object.keys(replacements['class']);
            // @TODO: 'directives', 'filters'
            const identifierMap = Object.assign(Object.assign(Object.assign(Object.assign({}, replacements['props']), replacements['data']), replacements['computed']), replacements['method']);
            const identifierKeys = Object.keys(identifierMap);
            function fix(expr) {
                const ast = babel.parse('const __RESULT__ = ' + expr);
                let changed = false;
                // 替换是个小概率事件，而且主要是替换 Block，因此不用考虑太多情况
                babel.traverse(ast, {
                    Identifier(nodePath) {
                        if (nodePath.parent.type === 'MemberExpression' && nodePath.parent.property === nodePath.node)
                            return nodePath.skip();
                        if (identifierMap[nodePath.node.name]) {
                            nodePath.node.name = identifierMap[nodePath.node.name];
                            changed = true;
                        }
                    },
                    Function(nodePath) {
                        nodePath.skip();
                    },
                });
                return changed ? generator_1.default(ast.program.body[0].declarations[0].init, { concise: true }).code : expr;
            }
            // @TODO: v-for 内部作用域的问题
            // @TODO: classBinding, styleBinding
            that.traverse((nodePath) => {
                if (nodePath.node.type === 1) {
                    const node = nodePath.node;
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
                    if (identifierKeys.length && node.hasBindings) {
                        /* attrsList 里有绑定属性、事件和指令，没有 v-if, v-for 和 class */
                        node.attrsList.forEach((attr, index) => {
                            if (attr.name.startsWith(':') || attr.name.startsWith('@') || attr.name.startsWith('v-')) {
                                const newExpr = fix(attr.value);
                                if (newExpr !== attr.value) {
                                    attr.value = newExpr;
                                    node.attrsMap[attr.name] = newExpr;
                                    let pureName;
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
                                        const event = node.events[pureName];
                                        event && (event.value = newExpr);
                                        const nativeEvent = node.nativeEvents[pureName];
                                        nativeEvent && (nativeEvent.value = newExpr);
                                        return;
                                    }
                                    if (attr.name.startsWith('v-')) {
                                        const directive = node.directives.find((directive) => directive.rawName === attr.name);
                                        if (directive) {
                                            directive.value = newExpr;
                                            if (directive.name === 'model') {
                                                el.model.value = `(${newExpr})`;
                                                el.model.expression = `"${newExpr}"`;
                                                el.model.callback; // = `"${newExpr}"`;
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
                                node.attrsMap['v-for'] = node.attrsMap['v-for'].replace(/(\s+(?:in|of)\s+)(.+)$/, (m, $1) => $1 + newExpr);
                            }
                        }
                    }
                }
                else if (nodePath.node.type === 2) {
                    const node = nodePath.node;
                    let changed = false;
                    const text = node.tokens.map((token) => {
                        if (typeof token !== 'string') {
                            const newExpr = fix(token['@binding']);
                            if (newExpr !== token['@binding']) {
                                token['@binding'] = newExpr;
                                changed = true;
                            }
                            return `{{ ${token['@binding']} }}`;
                        }
                        else
                            return token;
                    }).join('');
                    if (changed)
                        node.text = text;
                }
            });
        }
        if (route[0] === '/') // 这个里边相对和绝对是一样的
            route = route.slice(1);
        const arr = route.split('/');
        const last = arr[arr.length - 1];
        const parentRoute = arr.slice(0, -1).join('/');
        const el = this.findByRoute(parentRoute, this.ast);
        if (!el.children)
            throw new Error(`Not an element node! route: ${route}`);
        const index = last === undefined || last === '' ? el.children.length : +last;
        el.children.splice(index, 0, that.ast);
    }
}
exports.default = TemplateHandler;
//# sourceMappingURL=TemplateHandler.js.map