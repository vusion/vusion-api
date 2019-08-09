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

    configPath?: string;
    packagePath?: string;

    staticPath: string;
    srcPath: string;
    libraryPath: string;
    baseCSSPath: string;
    globalCSSPath: string;
    theme: string;

    entry: Object,
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

    options: Object;
}

export default function getDefaults() {
    const defaults: VusionConfig = {
        type: '',                              // [Required] Vusion project type. 'library', 'app'

        configPath: '',
        packagePath: '',

        staticPath: '',                        // Path of static files, which will be copied into destination directory. It accepts a String or Array.
        srcPath: './src',                      // To be `./src` by default
        libraryPath: '',                       // [Required] Library directory path. To be srcPath by default
        baseCSSPath: '',                       // Path of base CSS. If not set, it will be `library/base/base.css`
        globalCSSPath: '',                     // Path of global CSS. If not set, it will be `library/base/global.css`
        theme: undefined,                      // Project theme

        entry: {                               // Generate entry and HTMLWebpackPlugin automatically
            pages: undefined,
            prepend: [],
            append: [],
            commons: false,
            template: undefined,
        },

        docs: false,                           // Generate docs of common components in library. Always be true if project type is `library`

        forceShaking: false,                   // Force to enable tree shaking under this path without care of side effects. It's different from default tree shaking of webpack.
        experimental: false,                   // Enable some experimental loaders or plugins, like ModuleConcatenationPlugin

        options: {},                           // Extra options for loaders or plugins,
        // such as IconFontPlugin, CSSSpritePlugin, ExtractTextWebpackPlugin, UglifyjsWebpackPlugin, EnvironmentPlugin, BabelMinifyWebpackPlugin, CopyWebpackPlugin, ForceShakingPlugin
    };

    return defaults;
};
