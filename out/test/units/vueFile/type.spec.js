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
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('fs.VueFile', () => {
    it('open directory-composed no error', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'u-package.vue'));
        yield vueFile.open();
        chai_1.expect(vueFile.children.length).to.equal(3);
        chai_1.expect(vueFile.script).includes(`import { MGroupParent } from '../m-group.vue';`);
    }));
});
//# sourceMappingURL=type.spec.js.map