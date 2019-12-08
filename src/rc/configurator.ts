import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as YAML from 'yaml';

const rcPath = path.resolve(os.homedir(), '.vusionrc');

export enum ManagerInstallSaveOptions {
    'dep' = 'dep',
    'dev' = 'dev',
    'peer' = 'peer',
    'optional' = 'optional',
}

export default {
    rcPath,
    load() {
        if (this.config)
            return this.config;

        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `platform: https://vusion.netease.com
registries:
  npm: https://registry.npmjs.org
download_manager: cnpm
publish_manager: npm
`);
        }

        this.yaml = fs.readFileSync(rcPath, 'utf8');

        this.config = YAML.parse(this.yaml);
        return this.config;
    },
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
    getDownloadRegistry() {
        const config = this.load();
        return config.registries[config.download_manager] || 'https://registry.npmjs.org';
    },
    getInstallCommand(packageName?: string, save: ManagerInstallSaveOptions | boolean = false) {
        const config = this.load();
        if (!packageName) {
            if (config.download_manager === 'yarn')
                return 'yarn';
            else
                return `${config.download_manager} install`;
        } else {
            if (config.download_manager === 'yarn')
                return `yarn add ${packageName}${save === false ? '' : (save === true ? '' : ' --' + save)}`;
            else
                return `${config.download_manager} install ${packageName}${save === false ? '' : (save === true ? '--save' : ' --save-' + save)}`;
        }
    },
};
