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
const ms_1 = require("../../../ms");
describe('ms.downloadPackage', () => {
    it('should download a package', () => __awaiter(void 0, void 0, void 0, function* () {
        yield ms_1.downloadPackage('https://registry.npm.taobao.org', 'x-ace-editor.vue', './tmp');
    }));
});
//# sourceMappingURL=downloadPackage.test.js.map