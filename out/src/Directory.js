"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const FSEntry_1 = require("./FSEntry");
const File_1 = require("./File");
class Directory extends FSEntry_1.default {
    constructor(fullPath) {
        super(fullPath, true);
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen)
                return;
            yield this.load();
            this.isOpen = true;
        });
    }
    reopen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            this.isOpen = true;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}`);
            const children = [];
            const fileNames = yield fs.readdir(this.fullPath);
            fileNames.forEach((name) => {
                if (name === '.DS_Store' || name === '.git')
                    return;
                const fullPath = path.join(this.fullPath, name);
                const isDirectory = fs.statSync(fullPath).isDirectory();
                const fsEntry = isDirectory ? new Directory(fullPath) : new File_1.default(fullPath);
                children.push(fsEntry);
            });
            children.sort((a, b) => {
                if (a.isDirectory === b.isDirectory)
                    return a.fileName.localeCompare(b.fileName);
                else
                    return a.isDirectory ? -1 : 1;
            });
            return this.children = children;
        });
    }
}
exports.default = Directory;
//# sourceMappingURL=Directory.js.map