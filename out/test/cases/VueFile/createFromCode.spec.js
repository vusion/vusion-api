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
const VueFile_1 = require("../../../fs/VueFile");
const chai_1 = require("chai");
const path = require("path");
const fs = require("fs-extra");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');
describe('createFromCode', () => {
    it('should', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = yield fs.readFile(path.resolve(BASE_PATH, 'template-script-module/single.vue'), 'utf8');
        const vueFile = VueFile_1.default.from(content);
        chai_1.expect(vueFile.fileName).to.equal('temp.vue');
        chai_1.expect(vueFile.baseName).to.equal('temp');
        chai_1.expect(vueFile.content).to.equal(content);
        chai_1.expect(vueFile.template).to.equal('<div :class="$style.root"></div>\n');
    }));
});
//# sourceMappingURL=createFromCode.spec.js.map