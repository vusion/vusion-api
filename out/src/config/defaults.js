"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-multi-spaces */
exports.default = {
    type: '',
    staticPath: '',
    srcPath: './src',
    libraryPath: '',
    baseCSSPath: '',
    globalCSSPath: '',
    theme: undefined,
    testPaths: {
        src: './src',
        unit: './test/unit',
    },
    entry: {
        pages: undefined,
        prepend: [],
        append: [],
        commons: false,
        template: undefined,
    },
    clean: true,
    docs: false,
    open: true,
    hot: true,
    sourceMap: false,
    verbose: false,
    friendly: true,
    lint: false,
    extractCSS: false,
    uglifyJS: true,
    minifyJS: false,
    forceShaking: false,
    experimental: false,
    resolvePriority: 'current',
    browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
    babel: false,
    babelIncludes: [],
    webpack: {},
    webpackDevServer: {},
    postcss: [],
    vue: {},
    karma: {},
    options: {},
    // such as IconFontPlugin, CSSSpritePlugin, ExtractTextWebpackPlugin, UglifyjsWebpackPlugin, EnvironmentPlugin, BabelMinifyWebpackPlugin, CopyWebpackPlugin, ForceShakingPlugin
    // tmp options
    configPath: '',
    packagePath: '',
};
//# sourceMappingURL=defaults.js.map