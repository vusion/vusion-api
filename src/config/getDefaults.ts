export interface MaterialInfo {
    name: string,
    group?: string,
    alias?: string,
    path?: string,
    href?: string,
    target?: string,
}

export interface VusionConfig {
    type: string;
    mode?: string;
    overwrite: boolean;

    configPath?: string;
    packagePath?: string;

    outputPath: string;
    publicPath: string;
    staticPath: string;
    srcPath: string;
    libraryPath: string;
    baseCSSPath: string;
    globalCSSPath: string | { [propName: string]: string };
    themes: string[];

    docs: boolean | {
        title?: string,
        logo?: string,
        mode?: string,
        base?: string,
        install?: string,
        navbar?: Array<{ text: string, to: string }>,
        components?: Array<MaterialInfo>,
        directives?: Array<MaterialInfo>,
        formatters?: Array<MaterialInfo>,
        blocks?: Array<MaterialInfo>,
        utils?: Array<MaterialInfo>,
    },

    forceShaking: boolean;
    experimental: boolean;
}

export default function getDefaults() {
    const defaults: VusionConfig = {
        type: '',                              // [Required] Vusion project type. 'library', 'app'
        mode: '',
        overwrite: true,

        configPath: '',
        packagePath: '',

        outputPath: 'public',
        publicPath: '',
        staticPath: '',                        // Path of static files, which will be copied into destination directory. It accepts a String or Array.
        srcPath: './src',                      // To be `./src` by default
        libraryPath: '',                       // [Required] Library directory path. To be srcPath by default
        baseCSSPath: '',                       // Path of base CSS. If not set, it will be `library/base/base.css`
        globalCSSPath: '',                     // Path of global CSS. If not set, it will be `library/base/global.css`
        themes: undefined,                      // Project theme

        docs: false,                           // Generate docs of common components in library. Always be true if project type is `library`

        forceShaking: false,                   // Force to enable tree shaking under this path without care of side effects. It's different from default tree shaking of webpack.
        experimental: false,                   // Enable some experimental loaders or plugins, like ModuleConcatenationPlugin
    };

    return defaults;
};
