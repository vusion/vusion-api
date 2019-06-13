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
const FSEntry_1 = require("./FSEntry");
class File extends FSEntry_1.default {
    constructor(fullPath) {
        super(fullPath, false);
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
            return this.content = yield fs.readFile(this.fullPath);
        });
    }
}
exports.default = File;
//# sourceMappingURL=File.js.map