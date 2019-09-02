"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class FSEntry {
    constructor(fullPath, isDirectory) {
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
exports.default = FSEntry;
//# sourceMappingURL=FSEntry.js.map