"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDefaults() {
    const defaults = {
        type: '',
        mode: '',
        overwrite: true,
        configPath: '',
        packagePath: '',
        outputPath: 'public',
        publicPath: '',
        staticPath: '',
        srcPath: './src',
        libraryPath: '',
        baseCSSPath: '',
        globalCSSPath: '',
        themes: undefined,
        docs: false,
        forceShaking: false,
        experimental: false,
    };
    return defaults;
}
exports.default = getDefaults;
;
//# sourceMappingURL=getDefaults.js.map