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
const chai_1 = require("chai");
const path = require("path");
const VueFile_1 = require("../../../fs/VueFile");
const BASE_PATH = 'src/test/units/VueFile';
describe('fs.VueFile', () => {
    function test(cas) {
        return __awaiter(this, void 0, void 0, function* () {
            const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, `./files/${cas}.vue`));
            yield vueFile.open();
            vueFile.parseTemplate();
            const result = vueFile.templateHandler.generate();
            chai_1.expect(result).to.equals(vueFile.template);
        });
    }
    ;
    const cases = ['simple', 'complex', 'overview']; //, 'u-table-view', 'comment'
    cases.forEach((cas) => it('should generator correctly - ' + cas, () => test(cas)));
});
//# sourceMappingURL=generate.spec.js.map