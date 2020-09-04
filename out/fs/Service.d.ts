import FSEntry from './FSEntry';
import ScriptHandler from './ScriptHandler';
/**
 * 用于处理数据服务的类
 *
 * ### 主要功能
 *
 * #### 打开：一般分为三个阶段
 * - const service = new Service(fullPath); // 根据路径创建对象，可以为虚拟路径。
 * - await service.open(); // 异步方法。如果已经打开则不会重新打开。获取常用操作的内容块：api, apiConfig。
 * - service.parseAll(); // 解析全部内容块
 *
 * #### 保存：
 * - await service.save();
 * - 如果有解析，先根据解析器 generate() 内容，再保存
 *
 * #### 另存为：
 * - await service.saveAs(fullPath);
 */
export default class Service extends FSEntry {
    api: string;
    apiJSON: {
        [name: string]: any;
    };
    apiConfig: string;
    apiConfigHandler: ScriptHandler;
    indexJS: string;
    swaggerDefinitions: {
        [name: string]: any;
    };
    constructor(fullPath: string);
    forceOpen(): Promise<void>;
    close(): void;
    protected load(): Promise<void>;
    warnIfNotOpen(): void;
    parseAll(): void;
    parseAPI(): void;
    parseAPIConfig(): void;
    generate(): void;
    save(): Promise<void>;
}
