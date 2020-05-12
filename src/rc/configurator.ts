import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as YAML from 'yaml';

const rcPath = path.resolve(os.homedir(), '.vusionrc');

export interface VusionRC {
    platform: string;
    registries: { [name: string]: string };
    download_manager: string;
    publish_manager: string;
    access_token: string;
    [key: string]: any;
}

export enum ManagerInstallSaveOptions {
    'dep' = 'dep',
    'dev' = 'dev',
    'peer' = 'peer',
    'optional' = 'optional',
}

export default {
    config: undefined as VusionRC,
    rcPath,
    /**
     * 从用户目录下的 .vusionrc 加载配置
     * 如果已经加载，则会直接从缓存中读取
     * 如果不存在，则会创建一个默认的 .vusionrc 文件
     */
    load(): VusionRC {
        if (this.config)
            return this.config;

        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `platform: https://vusion.netease.com
registries:
  npm: https://registry.npmjs.org
download_manager: npm
publish_manager: npm
`);
        }

        this.yaml = fs.readFileSync(rcPath, 'utf8');

        this.config = YAML.parse(this.yaml);
        return this.config;
    },
    /**
     * 保存配置
     */
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
    /**
     * 快速获取下载源地址
     */
    getDownloadRegistry() {
        const config = this.load();
        return config.registries[config.download_manager] || 'https://registry.npmjs.org';
    },
    /**
     * 快速获取安装命令
     */
    getInstallCommand(packagesName?: string, save: ManagerInstallSaveOptions | boolean = false) {
        const config = this.load();
        if (!packagesName) {
            if (config.download_manager === 'yarn')
                return 'yarn';
            else
                return `${config.download_manager} install`;
        } else {
            if (config.download_manager === 'yarn')
                return `yarn add ${packagesName}${save === false ? '' : (save === true ? '' : ' --' + save)}`;
            else
                return `${config.download_manager} install ${packagesName}${save === false ? '' : (save === true ? ' --save' : ' --save-' + save)}`;
        }
    },
};
