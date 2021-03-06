export default interface PackageJSON {
    name?: string;
    description?: string;
    version?: string;
    main?: string;
    author?: string;
    repository?: string;
    homepage?: string;
    bugs?: string;
    license?: string;
    keywords?: string[];
    scripts?: {
        [script: string]: string;
    };
    dependencies?: {
        [dependency: string]: string;
    };
    devDependencies?: {
        [dependency: string]: string;
    };
    peerDependencies?: {
        [dependency: string]: string;
    };
    [prop: string]: any;
}
