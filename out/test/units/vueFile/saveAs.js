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
const path = require("path");
const fs = require("fs-extra");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
describe('saveAs', () => {
    it('multi -> multi', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'u-button.vue'));
        const tempPath = path.resolve(TMP_PATH, 'temp.vue');
        yield fs.remove(tempPath);
        yield vueFile.saveAs(tempPath);
        // expect(await fs.readFile(tempPath, 'utf8')).to.equal(content);
    }));
});
//# sourceMappingURL=saveAs.js.map