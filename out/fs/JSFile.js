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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = __importDefault(require("./File"));
const ScriptHandler_1 = __importDefault(require("./ScriptHandler"));
class JSFile extends File_1.default {
    parse() {
        if (this.handler)
            return this.handler;
        else
            return this.handler = new ScriptHandler_1.default(String(this.content));
    }
    close() {
        this.handler = undefined;
        this.isOpen = false;
    }
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.handler)
                this.content = this.handler.generate();
            return _super.save.call(this);
        });
    }
    static fetch(fullPath) {
        return super.fetch(fullPath);
    }
}
exports.default = JSFile;
//# sourceMappingURL=JSFile.js.map