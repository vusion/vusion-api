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
    it('should generate currectly', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, './files/overview.vue'));
        yield vueFile.open();
        vueFile.parseTemplate();
        const result = vueFile.templateHandler.generate();
        // console.log(result);
        chai_1.expect(result).to.equals(vueFile.template);
    }));
});
//# sourceMappingURL=generate.js.map