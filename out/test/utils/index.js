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
const path = require("path");
function isFilesSame(newPath, oldPath, subPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        newPath = path.resolve(newPath, subPath);
        oldPath = path.resolve(oldPath, subPath);
        const result = (yield fs.readFile(newPath, 'utf8')) === (yield fs.readFile(oldPath, 'utf8'));
        if (!result)
            console.error(newPath, oldPath);
        return result;
    });
}
exports.isFilesSame = isFilesSame;
//# sourceMappingURL=index.js.map