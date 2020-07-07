"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerInstallSaveOptions = void 0;
const fs = __importStar(require("fs-extra"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const YAML = __importStar(require("yaml"));
const rcPath = path.resolve(os.homedir(), '.vusionrc');
var ManagerInstallSaveOptions;
(function (ManagerInstallSaveOptions) {
    ManagerInstallSaveOptions["dep"] = "dep";
    ManagerInstallSaveOptions["dev"] = "dev";
    ManagerInstallSaveOptions["peer"] = "peer";
    ManagerInstallSaveOptions["optional"] = "optional";
})(ManagerInstallSaveOptions = exports.ManagerInstallSaveOptions || (exports.ManagerInstallSaveOptions = {}));
exports.default = {
    config: undefined,
    rcPath,
    /**
     * 从用户目录下的 .vusionrc 加载配置
     * 如果已经加载，则会直接从缓存中读取
     * 如果不存在，则会创建一个默认的 .vusionrc 文件
     */
    load() {
        if (this.config)
            return this.config;
        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `platform: https://vusion.163yun.com
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
    getInstallCommand(packagesName, save = false) {
        const config = this.load();
        if (!packagesName) {
            if (config.download_manager === 'yarn')
                return 'yarn';
            else
                return `${config.download_manager} install`;
        }
        else {
            if (config.download_manager === 'yarn')
                return `yarn add ${packagesName}${save === false ? '' : (save === true ? '' : ' --' + save)}`;
            else
                return `${config.download_manager} install ${packagesName}${save === false ? '' : (save === true ? ' --save' : ' --save-' + save)}`;
        }
    },
};
//# sourceMappingURL=configurator.js.map