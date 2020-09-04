import * as postcss from 'postcss';
/**
 * 样式 AST 处理器
 * 该 class 可以在两端(node, browser)运行
 */
declare class StyleHandler {
    code: string;
    ast: postcss.Root;
    dirty: boolean;
    constructor(code?: string, options?: Object);
    parse(code: string): postcss.Root;
    generate(): string;
    /**
      * 将另一个 that 的样式合并到当前样式中
      * @TODO 目前对另一个 that 的样式 ast 有修改
      * @param that 另一个 StyleHandler
      * @param index 插入到的位置
      */
    merge(that: StyleHandler, index?: number): {
        class: {
            [old: string]: string;
        };
    };
    /**
   * 将另一个 that 的样式追加到当前样式后
   * @TODO 目前对另一个 that 的样式 ast 有修改
   * @param that 另一个 StyleHandler
   */
    append(that: StyleHandler): void;
}
export default StyleHandler;
