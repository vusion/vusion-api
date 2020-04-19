import * as compiler from 'vue-template-compiler';

export class ASTNodePath {
    constructor(
        public node: compiler.ASTNode,
        public parent: compiler.ASTElement,
        public route: string = '',
    ) {}

    remove() {
        const index = this.parent.children.indexOf(this.node);
        ~index && this.parent.children.splice(index, 1);
    }
}


type Attr = { name: string, value: any, start?: number, end?: number };
type ASTElement = compiler.ASTElement & {
    rawAttrsMap: {
        [name: string]: Attr,
    }
}

class TemplateHandler {
    code: string;
    ast: ASTElement;
    options: {
        tabLength: number,
        startLevel: number,
    };

    constructor(code: string = '', options?: Object) {
        this.code = code;
        this.ast = this.parse(code);
        this.options = {
            tabLength: 4,
            startLevel: 0,
        };
    }

    parse(code: string) {
        const compilerOptions: compiler.CompilerOptions = {
            preserveWhitespace: false,
            outputSourceRange: true,
        };

        return compiler.compile(code, compilerOptions).ast;
    }

    generate() {
        // @TODO: 暂时没有很好的 generate
        const tabs = ' '.repeat(this.options.tabLength*this.options.startLevel);
        return tabs + this.generateElement(this.ast, this.options.startLevel) + '\n';
        // return this.code;
    }

    generateElement(el: ASTElement, level: number) {
        const tabs = ' '.repeat(this.options.tabLength*level);
        const insideTabs = ' '.repeat(this.options.tabLength*(level + 1));

        let shouldFormat = true;
        const content: string = el.children.map((node) => {
            let text = '';

            if (node.type === 1)
                text = (shouldFormat ? '\n' + insideTabs : '') + this.generateElement(node as ASTElement, level + 1);
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

        const attrs = Object.keys(el.rawAttrsMap).map((name) => {
            const attr = el.rawAttrsMap[name];
            if (attr.start !== undefined && attr.end !== undefined && attr.end - attr.start === attr.name.length)
                return attr.name;
            else
                return `${attr.name}="${attr.value}"`;
        });

        let attrsLength = 0;
        let attrsString = '';
        attrs.forEach((attr) => {
            if (attrsLength >= 120 || attr.length >= 120) {
                attrsString += '\n' + tabs + ' '.repeat(3) // ' '.repeat(el.tag.length + 1);
                attrsLength = 0;
            }
            attrsString += ' ' + attr;
            attrsLength += attr.length;
        })


        return `<${el.tag}${attrs.length ? attrsString : ''}>` + content + (shouldFormat ? '\n' + tabs : '') + `</${el.tag}>`;
    }

    traverse(func: (nodePath: ASTNodePath) => any) {
        let queue: Array<ASTNodePath> = [];
        queue = queue.concat(new ASTNodePath(this.ast, null, ''));
        let nodePath: ASTNodePath;
        while ((nodePath = queue.shift())) {
            if (nodePath.node.type === 1) {
                const parent = nodePath.node as ASTElement;
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
     */
    findByRoute(route: string, node: compiler.ASTNode): compiler.ASTNode {
        if (route[0] === '/')
            route = route.slice(1);
        const arr = route.split('/');
        if (!route || !arr.length)
            return node;
        else
            return this.findByRoute(arr.slice(1).join('/'), (node as compiler.ASTElement).children[+arr[0]]);
    }

    /**
     * 将另一个 handler 的模板合并到当前模板中
     * @param handler 另一个 TemplateHandler
     * @param route 插入的父节点路径，/1/2 表示根节点的第1个子节点的第2个子节点
     * @param index 插入到的位置
     */
    merge(handler: TemplateHandler, route: string, index?: number) {
        const el = this.findByRoute(route, this.ast) as compiler.ASTElement;
        if (!el.children)
            throw new Error(`Not an element node! route: ${route}`);

        if (index === undefined)
            index = el.children.length;
        el.children.splice(index, 0, handler.ast);

        return this;
    }
}

export default TemplateHandler;
