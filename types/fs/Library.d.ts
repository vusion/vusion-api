import VueFile from './VueFile';
import JSFile from './JSFile';
import FSEntry from './FSEntry';
import { Directory } from '..';
import { VusionConfig, MaterialInfo } from '../config/getDefaults';
import PackageJSON from '../types/PackageJSON';
export declare enum LibraryType {
    internal = "internal",
    external = "external",
    other = "other"
}
/**
 * Library
 * libraryPath 指向包含多种类型的文件夹，比如`./src`，用于快速索引目录
 */
export default class Library {
    libraryType: LibraryType;
    fullPath: string;
    libraryPath: string;
    fileName: string;
    baseName: string;
    extName: string;
    title: string;
    superLibrary: Library;
    superLibraries: Array<Library>;
    otherComponents: Array<VueFile>;
    package: PackageJSON;
    config: VusionConfig;
    components: Array<VueFile>;
    componentsDirectory: Directory;
    componentsIndexFile: JSFile;
    docsComponentsInfoMap: Map<string, MaterialInfo>;
    blocks: Array<VueFile>;
    directives: Array<FSEntry>;
    filters: Array<FSEntry>;
    formatters: Array<FSEntry>;
    validators: Array<FSEntry>;
    rules: Array<FSEntry>;
    utils: Array<FSEntry>;
    assets: Array<FSEntry>;
    isOpen: boolean;
    constructor(fullPath: string, libraryType: LibraryType);
    open(): Promise<void>;
    forceOpen(): Promise<void>;
    protected load(): Promise<void>;
    forceOpenOthers(): Promise<void>;
}
