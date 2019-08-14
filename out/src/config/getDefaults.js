"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDefaults() {
    const defaults = {
        type: '',
        configPath: '',
        packagePath: '',
        outputPath: 'public',
        publicPath: '',
        staticPath: '',
        srcPath: './src',
        libraryPath: '',
        baseCSSPath: '',
        globalCSSPath: '',
        theme: undefined,
        entry: {
            pages: undefined,
            prepend: [],
            append: [],
            commons: false,
            template: undefined,
        },
        docs: false,
        forceShaking: false,
        experimental: false,
        options: {},
    };
    return defaults;
}
exports.default = getDefaults;
;
//# sourceMappingURL=getDefaults.js.map