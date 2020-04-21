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
const utils_1 = require("../../utils");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');
describe('saveAs', () => {
    it('multi -> multi', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldPath = path.resolve(BASE_PATH, 'u-button.vue');
        const vueFile = new VueFile_1.default(oldPath);
        yield vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp.vue');
        yield fs.remove(newPath);
        yield vueFile.saveAs(newPath);
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'api.yaml')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    }));
    it('package -> package', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldPath = path.resolve(TEMPLATES_PATH, 'u-multi-file-package.vue');
        const vueFile = new VueFile_1.default(oldPath);
        yield vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp-2.vue');
        yield fs.remove(newPath);
        yield vueFile.saveAs(newPath);
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.html')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'package.json')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    }));
});
//# sourceMappingURL=saveAs.spec.js.map