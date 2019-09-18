"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const chalk_1 = require("chalk");
// import chokidar from 'chokidar';
const getDefaults_1 = require("./getDefaults");
const TYPES = ['library', 'app', 'html5', 'fullstack'];
function getConfig(cwd, configPath, packagePath) {
    delete require.cache[configPath];
    delete require.cache[packagePath];
    if (fs.existsSync(configPath))
        return require(configPath);
    else if (fs.existsSync(packagePath)) {
        const packageVusion = require(packagePath).vusion;
        if (packageVusion)
            return packageVusion;
        else {
            throw new Error(chalk_1.default.bgRed(' ERROR ') + ` Cannot find vusion config! This is not a vusion project.
    processCwd: ${cwd}
    configPath: ${configPath}
`);
        }
    }
}
function resolve(cwd, configPath = 'vusion.config.js', args) {
    cwd = cwd || process.cwd();
    const config = getDefaults_1.default();
    const packagePath = config.packagePath = path.resolve(cwd, 'package.json');
    configPath = config.configPath = path.resolve(cwd, configPath);
    const userConfig = getConfig(cwd, configPath, packagePath);
    // 覆盖一些默认配置
    if (userConfig.type === 'library')
        config.outputPath = 'dist';
    Object.assign(config, userConfig);
    if (!TYPES.includes(config.type)) {
        throw new Error(chalk_1.default.bgRed(' ERROR ') + ' Unknown project type!');
    }
    /**
     * CLI Arguments
     */
    if (args) {
        if (args.theme)
            config.theme = args.theme ? args.theme.split(',') : undefined;
        if (args['vusion-mode'])
            config.mode = args['vusion-mode'];
        if (args['base-css'])
            config.baseCSSPath = path.resolve(process.cwd(), args['base-css']);
        if (args['global-css'])
            config.globalCSSPath = path.resolve(process.cwd(), args['global-css']);
        if (args['output-path'])
            config.outputPath = path.resolve(process.cwd(), args['output-path']);
        if (args['public-path'])
            config.publicPath = path.resolve(process.cwd(), args['public-path']);
        if (args['src-path'])
            config.srcPath = path.resolve(process.cwd(), args['src-path']);
        if (args['library-path'])
            config.libraryPath = path.resolve(process.cwd(), args['library-path']);
    }
    config.srcPath = path.resolve(cwd, config.srcPath || './src');
    config.libraryPath = path.resolve(cwd, config.libraryPath || config.srcPath);
    if (config.type === 'library') {
        config.docs = config.docs || {};
        // @TODO
        // if (process.env.NODE_ENV === 'development') {
        //     // 更新 docs 对象
        //     chokidar.watch([configPath, packagePath]).on('change', (path: string) => {
        //         const newConfig = getConfig(configPath, packagePath);
        //         config.docs = newConfig.docs || {};
        //     });
        // }
    }
    // 自动根据主题查找 globalCSSPath 和 baseCSSPath
    // 如果config中包含有主题列表，globalCSSPath为主题名与路径的map
    let globalCSSPath;
    if (!config.globalCSSPath) {
        if (config.theme) {
            // 主题样式处理
            config.globalCSSPath = globalCSSPath = {
                default: path.resolve(config.libraryPath, './base/global.css'),
            };
            for (const theme of config.theme) {
                globalCSSPath[theme] = path.resolve(config.libraryPath, `../theme-${theme}/base/global.css`);
            }
        }
        else
            globalCSSPath = config.globalCSSPath = path.resolve(config.libraryPath, './base/global.css');
        if (typeof config.globalCSSPath === 'string' && !fs.existsSync(config.globalCSSPath)) {
            try {
                config.globalCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/global.css');
            }
            catch (e) {
                throw new Error('Please set globalCSSPath!');
            }
        }
    }
    else
        globalCSSPath = config.globalCSSPath;
    if (config.globalCSSPath && config.globalCSSPath instanceof Object) {
        // 检查主题的globalCss是否存在
        for (const theme of Object.keys(config.globalCSSPath)) {
            const cssPath = config.globalCSSPath[theme];
            if (!fs.existsSync(cssPath))
                throw new Error(`Cannot find ${theme} globalCSSPath: ${cssPath}`);
        }
    }
    else if (typeof config.globalCSSPath === 'string') {
        if (!fs.existsSync(config.globalCSSPath))
            throw new Error(`Cannot find globalCSSPath: ${globalCSSPath}`);
    }
    else
        throw new Error(`globalCSSPath only accepted string or array`);
    let baseCSSPath;
    if (!config.baseCSSPath) {
        baseCSSPath = config.baseCSSPath = path.resolve(config.libraryPath, './base/base.css');
        if (!fs.existsSync(config.baseCSSPath)) {
            try {
                config.baseCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/base.css');
            }
            catch (e) {
                throw new Error('Please set baseCSSPath!');
            }
        }
    }
    else
        baseCSSPath = config.baseCSSPath;
    if (!fs.existsSync(config.baseCSSPath))
        throw new Error(`Cannot find baseCSSPath: ${baseCSSPath}`);
    return config;
}
exports.default = resolve;
;
//# sourceMappingURL=resolve.js.map