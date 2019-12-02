"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const YAML = require("yaml");
const rcPath = path.resolve(os.homedir(), '.vusionrc');
var ManagerInstallSaveOptions;
(function (ManagerInstallSaveOptions) {
    ManagerInstallSaveOptions["false"] = "false";
    ManagerInstallSaveOptions["true"] = "true";
    ManagerInstallSaveOptions["dep"] = "dep";
    ManagerInstallSaveOptions["dev"] = "dev";
    ManagerInstallSaveOptions["peer"] = "peer";
    ManagerInstallSaveOptions["optional"] = "optional";
})(ManagerInstallSaveOptions = exports.ManagerInstallSaveOptions || (exports.ManagerInstallSaveOptions = {}));
exports.default = {
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
    getInstallCommand(packageName, save = ManagerInstallSaveOptions.false) {
        const config = this.load();
        if (!packageName) {
            if (config.download_manager === 'yarn')
                return 'yarn';
            else
                return `${config.download_manager} install`;
        }
        else {
            if (config.download_manager === 'yarn')
                return `yarn add ${packageName}${save === ManagerInstallSaveOptions.false || save === ManagerInstallSaveOptions.true ? '' : ' --' + save}`;
            else
                return `${config.download_manager} install ${packageName}${save === ManagerInstallSaveOptions.false || save === ManagerInstallSaveOptions.true ? '' : ' --save-' + save}`;
        }
    },
};
//# sourceMappingURL=configurator.js.map