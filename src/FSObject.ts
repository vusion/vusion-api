import * as path from 'path';

export default class FSObject {
    fullPath: string;
    fileName: string;
    baseName: string;
    extName: string;
    title: string;
    isDirectory: boolean;
    isOpen: boolean;

    constructor(fullPath: string, isDirectory: boolean) {
        this.fullPath = fullPath;
        this.fileName = path.basename(fullPath);
        this.extName = path.extname(this.fileName);
        this.baseName = path.basename(this.fileName, this.extName);
        this.title = this.baseName;
        this.isDirectory = isDirectory;
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
    }
}
