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
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');
describe('merge', () => {
    it('templateHandler.merge', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'view.vue'));
        yield vueFile.open();
        const $html = vueFile.parseTemplate();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-1.vue'));
        yield vueFile1.open();
        const $html1 = vueFile1.parseTemplate();
        const vueFile2 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-2.vue'));
        yield vueFile2.open();
        const $html2 = vueFile2.parseTemplate();
        chai_1.expect($html.merge($html1, '').generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/template.merge.1.html'), 'utf8'));
        chai_1.expect($html.merge($html2, '/1', 1).generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/template.merge.2.html'), 'utf8'));
    }));
});
//# sourceMappingURL=merge.spec.js.map