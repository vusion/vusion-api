"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const FSEntry_1 = __importDefault(require("./FSEntry"));
const File_1 = __importDefault(require("./File"));
class Directory extends FSEntry_1.default {
    constructor(fullPath) {
        super(fullPath, true);
    }
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            yield this.load();
            this.isOpen = true;
        });
    }
    close() {
        this.children = undefined;
        this.isOpen = false;
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
                let fsEntry;
                // if (this.isWatched)
                //     fsEntry = isDirectory ? Directory.fetch(fullPath) : File.fetch(fullPath);
                // else
                fsEntry = isDirectory ? new Directory(fullPath) : new File_1.default(fullPath);
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
    find(relativePath, openIfNotLoaded = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.children) {
                if (openIfNotLoaded)
                    yield this.open();
                else
                    return;
            }
            relativePath = path.normalize(relativePath);
            const arr = relativePath.split(path.sep);
            const next = arr[0];
            if (!next)
                throw new Error('Starting root / is not allowed!');
            const childEntry = this.children.find((fsEntry) => fsEntry.fileName === next);
            if (arr.length === 0)
                throw new Error('Error path: ' + relativePath);
            else if (arr.length === 1)
                return childEntry;
            else if (!childEntry.isDirectory)
                throw new Error('Not a directory: ' + childEntry.fullPath);
            else
                return childEntry.find(arr.slice(1).join(path.sep), openIfNotLoaded);
        });
    }
    static fetch(fullPath) {
        return super.fetch(fullPath);
    }
}
exports.default = Directory;
//# sourceMappingURL=Directory.js.map