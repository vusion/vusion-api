export interface MaterialInfo {
    name: string;
    group?: string;
    alias?: string;
    path?: string;
    href?: string;
    target?: string;
}
export declare type Theme = {
    [name: string]: string;
};
export interface VusionConfig {
    type: string;
    mode?: string;
    configPath?: string;
    packagePath?: string;
    outputPath: string;
    publicPath: string;
    staticPath: string;
    srcPath: string;
    libraryPath: string;
    baseCSSPath: string;
    rootViewType: 'root' | 'entry' | 'module' | 'branch';
    theme: string | Array<string> | Theme;
    applyTheme: boolean;
    docs: boolean | {
        title?: string;
        logo?: string;
        mode?: string;
        base?: string;
        install?: string;
        navbar?: Array<{
            text: string;
            to: string;
        }>;
        components?: Array<MaterialInfo>;
        directives?: Array<MaterialInfo>;
        formatters?: Array<MaterialInfo>;
        blocks?: Array<MaterialInfo>;
        utils?: Array<MaterialInfo>;
    };
    designer: boolean | {
        protocol?: string;
        host?: string;
        port?: number;
    };
    forceShaking: boolean;
    experimental: boolean;
}
export default function getDefaults(): VusionConfig;
