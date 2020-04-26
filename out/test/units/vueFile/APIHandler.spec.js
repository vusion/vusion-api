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
const fs = require("fs-extra");
const path = require("path");
const VueFile_1 = require("../../../fs/VueFile");
const APIHandler_1 = require("../../../fs/APIHandler");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('APIHandler', () => {
    it('getTOCFromFile', () => __awaiter(void 0, void 0, void 0, function* () {
        const apiHandler = new APIHandler_1.default('', '');
        const toc = yield apiHandler.getTOCFromFile(path.resolve(BASE_PATH, 'u-button.vue/README.md'), undefined, { maxLevel: 3, minLevel: 4 });
        chai_1.expect(toc.length).to.equal(11);
        chai_1.expect(toc[1].title).to.equal('设置形状');
        chai_1.expect(toc[1].to.hash).to.equal('#设置形状');
        chai_1.expect(toc[toc.length - 2].title).to.equal('Slots');
        const events = toc[toc.length - 1];
        chai_1.expect(events.title).to.equal('Events');
        chai_1.expect(events.children).length(3);
    }));
    it('markdown()', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'u-sidebar.vue'));
        yield vueFile.open();
        vueFile.parseAPI();
        chai_1.expect(yield vueFile.apiHandler.markdownIndex()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/README.index.md'), 'utf8'));
        chai_1.expect(yield vueFile.apiHandler.markdown()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/README.md'), 'utf8'));
    }));
});
//# sourceMappingURL=APIHandler.spec.js.map