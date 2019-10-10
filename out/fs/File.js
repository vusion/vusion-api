"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
    forceOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            yield this.load();
            this.isOpen = true;
        });
    }
    close() {
        this.content = undefined;
        this.isOpen = false;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.fullPath))
                throw new Error(`Cannot find: ${this.fullPath}`);
            return this.content = yield fs.readFile(this.fullPath);
        });
    }
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.isSaving = true;
            const result = yield fs.writeFile(this.fullPath, this.content !== undefined ? this.content : '');
            _super.save.call(this);
            return result;
        });
    }
    static fetch(fullPath) {
        return super.fetch(fullPath);
    }
}
exports.default = File;
//# sourceMappingURL=File.js.map