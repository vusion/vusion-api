import * as path from 'path';

export default class FSEntry {
    fullPath: string; // 完整路径
    fileName: string; // 完整的文件名
    // fileType:
    baseName: string; // 不带扩展名的文件名
    extName: string; // 扩展名，带`.`
    title: string; // 标题，用于显示的名称
    isDirectory: boolean; // 是否为文件夹。部分子类需要在`preopen`之后才是准确的判断
    isVue: boolean; //
    isOpen: boolean; // 是否已经打开

    constructor(fullPath: string, isDirectory: boolean) {
        this.fullPath = fullPath;
        this.fileName = path.basename(fullPath);
        this.extName = path.extname(this.fileName);
        this.baseName = path.basename(this.fileName, this.extName);
        this.title = this.baseName;
        this.isDirectory = isDirectory;
        this.isVue = false;
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
    }
}
