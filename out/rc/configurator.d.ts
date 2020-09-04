export interface VusionRC {
    platform: string;
    registries: {
        [name: string]: string;
    };
    download_manager: string;
    publish_manager: string;
    access_token: string;
    [key: string]: any;
}
export declare enum ManagerInstallSaveOptions {
    'dep' = "dep",
    'dev' = "dev",
    'peer' = "peer",
    'optional' = "optional"
}
declare const _default: {
    config: VusionRC;
    rcPath: string;
    yaml: string;
    /**
     * 从用户目录下的 .vusionrc 加载配置
     * 如果已经加载，则会直接从缓存中读取
     * 如果不存在，则会创建一个默认的 .vusionrc 文件
     */
    load(): VusionRC;
    /**
     * 保存配置
     */
    save(): void;
    /**
     * 快速获取下载源地址
     */
    getDownloadRegistry(): string;
    /**
     * 快速获取安装命令
     */
    getInstallCommand(packagesName?: string, save?: ManagerInstallSaveOptions | boolean): string;
};
export default _default;
