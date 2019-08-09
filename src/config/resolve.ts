import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
// import chokidar from 'chokidar';
import getDefaults, { VusionConfig } from './getDefaults';

const TYPES = ['library', 'app', 'html5', 'fullstack'];

function getConfig(cwd: string, configPath: string, packagePath: string) {
    delete require.cache[configPath];
    delete require.cache[packagePath];
    if (fs.existsSync(configPath))
        return require(configPath);
    else if (fs.existsSync(packagePath)) {
        const packageVusion = require(packagePath).vusion;
        if (packageVusion)
            return packageVusion;
        else {
            throw new Error(chalk.bgRed(' ERROR ') + ` Cannot find vusion config! This is not a vusion project.
    processCwd: ${cwd}
    configPath: ${configPath}
`);

        }
    }
}

// @TODO: 阉割版的 resolve
export default function resolve(cwd: string, configPath: string = 'vusion.config.js', theme?: string): VusionConfig {
    cwd = cwd || process.cwd();

    const config = getDefaults();

    const packagePath = config.packagePath = path.resolve(cwd, 'package.json');
    configPath = config.configPath = path.resolve(cwd, configPath);
    Object.assign(config, getConfig(cwd, configPath, packagePath));

    if (!TYPES.includes(config.type)) {
        throw new Error(chalk.bgRed(' ERROR ') + ' Unknown project type!');
    }

    config.srcPath = config.srcPath || './src';
    config.libraryPath = config.libraryPath || config.srcPath;
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

    config.srcPath = path.resolve(cwd, config.srcPath);
    config.libraryPath = path.resolve(cwd, config.libraryPath);

    if (theme === 'src' || theme === 'default')
        theme = undefined;
    config.theme = theme;

    if (!config.globalCSSPath) {
        config.globalCSSPath = path.resolve(config.libraryPath, theme ? `../theme-${theme}/base/global.css` : './base/global.css');
        if (!fs.existsSync(config.globalCSSPath))
            config.globalCSSPath = path.resolve(config.srcPath, theme ? `../theme-${theme}/base/global.css` : './base/global.css');
        // if (!fs.existsSync(config.globalCSSPath))
            // config.globalCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/global.css');
    }
    if (!config.baseCSSPath) {
        config.baseCSSPath = path.resolve(config.libraryPath, './base/base.css');
        if (!fs.existsSync(config.baseCSSPath))
            config.baseCSSPath = path.resolve(config.srcPath, './base/base.css');
        // if (!fs.existsSync(config.baseCSSPath))
            // config.baseCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/base.css');
    }

    return config;
};
