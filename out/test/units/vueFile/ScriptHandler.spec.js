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
const ScriptHandler_1 = require("../../../fs/ScriptHandler");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('ScriptHandler', () => {
    it('import(identifer)', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.import('UTest').from('./u-test.vue');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/import.js'), 'utf8'));
    }));
    it('import(specifiers)', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.import({ default: 'UButton', ULink: 'ULink', ULabel: '' }).from('./library');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/import.specifiers.js'), 'utf8'));
    }));
    it('froms().has()', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'components.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        const froms = $js.froms();
        chai_1.expect(froms.has('babel-polyfill')).to.be.true;
        chai_1.expect(froms.has('vue')).to.be.true;
        chai_1.expect(froms.has('./common/u-button.vue')).to.be.true;
        chai_1.expect(froms.has('./common/s-sidebar.vue')).to.be.true;
        chai_1.expect(froms.has('./common/s-navbar.vue')).to.be.true;
        chai_1.expect(froms.has('./common/s-logo.vue')).to.be.true;
        chai_1.expect(froms.has('@cloud-ui/u-relations-diagram.vue')).to.be.true;
        chai_1.expect(froms.has('@cloud-ui/u-workflow.vue')).to.be.true;
    }));
    it('froms().delete()', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'components.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        const froms = $js.froms();
        froms.delete('babel-polyfill');
        froms.delete('vue');
        froms.delete('./common/s-navbar.vue');
        froms.delete('@cloud-ui/u-relations-diagram.vue');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/import.delete.js'), 'utf8'));
    }));
    it('export().default().object()', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.export().default().object()
            .ensure('components', '{}')
            .get('components')
            .set('UButton', 'UButton');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.js'), 'utf8'));
    }));
    it('export().default().object().after()', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.export().default().object()
            .after('name')
            .ensure('components', '{}');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.after.js'), 'utf8'));
    }));
});
//# sourceMappingURL=ScriptHandler.spec.js.map