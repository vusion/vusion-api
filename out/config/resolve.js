"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const chalk_1 = require("chalk");
// import chokidar from 'chokidar';
const getDefaults_1 = require("./getDefaults");
const TYPES = ['library', 'app', 'html5', 'fullstack', 'component', 'block'];
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
        if (args['vusion-mode'])
            config.mode = args['vusion-mode'];
        if (args['base-css'])
            config.baseCSSPath = path.resolve(process.cwd(), args['base-css']);
        if (args.theme)
            config.theme = args.theme ? args.theme.split(',') : undefined;
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
    else if (config.type === 'component' || config.type === 'block') {
        config.srcPath = cwd;
        const libraryName = Object.keys(require(packagePath).peerDependencies).find((key) => key.endsWith('.vusion'));
        config.libraryPath = path.resolve(cwd, `node_modules/${libraryName}/src`);
    }
    let themeAutoDetected = false;
    if (!config.theme) {
        themeAutoDetected = true;
        config.theme = {
            default: path.resolve(config.libraryPath, './base/theme.css'),
        };
    }
    else if (typeof config.theme === 'string') {
        const theme = {};
        const _theme = config.theme;
        let name = path.basename(_theme, '.css');
        if (name === 'theme')
            name = 'default';
        theme[name] = _theme;
        config.theme = theme;
    }
    else if (Array.isArray(config.theme)) {
        const theme = {};
        config.theme.forEach((_theme) => {
            let name = path.basename(_theme, '.css');
            if (name === 'theme')
                name = 'default';
            theme[name] = _theme;
        });
        config.theme = theme;
    } // else
    if (themeAutoDetected) {
        if (!fs.existsSync(config.theme.default))
            config.theme.default = path.resolve(require.resolve('@vusion/doc-loader'), '../node_modules/proto-ui.vusion/src/base/theme.css');
    }
    let baseCSSPath; // 用于保存非文档的 baseCSSPath 路径
    if (!config.baseCSSPath) {
        baseCSSPath = config.baseCSSPath = path.resolve(config.libraryPath, './base/base.css');
        if (!fs.existsSync(config.baseCSSPath)) {
            try {
                config.baseCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), '../node_modules/proto-ui.vusion/src/base/base.css');
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