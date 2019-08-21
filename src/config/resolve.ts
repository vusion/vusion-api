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

interface CLIArgs {
    theme?: string,
    'vusion-mode'?: string,
    'base-css'?: string,
    'global-css'?: string,
    'src-path'?: string,
    'library-path'?: string,
}

// @TODO: 阉割版的 resolve
export default function resolve(cwd: string, configPath: string = 'vusion.config.js', args?: CLIArgs): VusionConfig {
    cwd = cwd || process.cwd();

    const config = getDefaults();

    const packagePath = config.packagePath = path.resolve(cwd, 'package.json');
    configPath = config.configPath = path.resolve(cwd, configPath);
    Object.assign(config, getConfig(cwd, configPath, packagePath));

    if (!TYPES.includes(config.type)) {
        throw new Error(chalk.bgRed(' ERROR ') + ' Unknown project type!');
    }

    /**
     * CLI Arguments
     */
    if (args) {
        if (args.theme)
            config.theme = args.theme;
        if (args['vusion-mode'])
            config.mode = args['vusion-mode'];
        if (args['base-css'])
            config.baseCSSPath = path.resolve(process.cwd(), args['base-css']);
        if (args['global-css'])
            config.globalCSSPath = path.resolve(process.cwd(), args['global-css']);
        if (args['src-path'])
            config.srcPath = path.resolve(process.cwd(), args['src-path']);
        if (args['library-path'])
            config.libraryPath = path.resolve(process.cwd(), args['library-path']);
    }

    config.srcPath = path.resolve(config.srcPath || './src');
    config.libraryPath = path.resolve(config.libraryPath || config.srcPath);
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
    if (!config.globalCSSPath)
        config.globalCSSPath = path.resolve(config.libraryPath, config.theme ? `../theme-${config.theme}/base/global.css` : './base/global.css');
    if (!config.baseCSSPath)
        config.baseCSSPath = path.resolve(config.libraryPath, './base/base.css');

    return config;
};
