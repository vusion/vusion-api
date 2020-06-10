"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const shared_1 = require("../utils/shared");
/**
 * 样式 AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
class StyleHandler {
    constructor(code = '', options) {
        this.dirty = false;
        this.code = code;
        this.ast = this.parse(code);
    }
    parse(code) {
        return postcss.parse(code);
    }
    generate() {
        return this.ast.toString();
    }
    /**
      * 将另一个 that 的样式合并到当前样式中
      * @TODO 目前对另一个 that 的样式 ast 有修改
      * @param that 另一个 StyleHandler
      * @param index 插入到的位置
      */
    merge(that, index) {
        const firstNode = that.ast.nodes[0];
        if (firstNode)
            firstNode.raws.before = '\n\n';
        if (index === undefined)
            index = this.ast.nodes.length;
        const thisClasses = new Map();
        this.ast.walkRules((rule) => {
            const re = /\.[-_a-zA-Z0-9]+/g;
            let cap;
            while (cap = re.exec(rule.selector)) {
                thisClasses.set(cap[0], true);
            }
        });
        const classMap = {};
        that.ast.walkRules((rule) => {
            const re = /\.[-_a-zA-Z0-9]+/g;
            let cap;
            while (cap = re.exec(rule.selector)) {
                let cls = shared_1.uniqueInMap(cap[0], thisClasses);
                if (cls !== cap[0]) {
                    classMap[cap[0].slice(1)] = cls.slice(1);
                    rule.selector = rule.selector.slice(0, cap.index) + cls + rule.selector.slice(cap.index + cap[0].length);
                }
            }
        });
        this.ast.nodes.splice(index, 0, ...that.ast.nodes);
        return { class: classMap };
    }
    /**
   * 将另一个 that 的样式追加到当前样式后
   * @TODO 目前对另一个 that 的样式 ast 有修改
   * @param that 另一个 StyleHandler
   */
    append(that) {
        const firstNode = that.ast.nodes[0];
        if (firstNode)
            firstNode.raws.before = '\n\n';
        this.ast.nodes.push(...that.ast.nodes);
    }
}
exports.default = StyleHandler;
//# sourceMappingURL=StyleHandler.js.map