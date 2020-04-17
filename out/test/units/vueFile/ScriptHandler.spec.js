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
    it('import', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.import('UTest').from('./u-test.vue');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/import.js'), 'utf8'));
    }));
    it('import.delete', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.import('ULink').from('../u-link.vue').delete();
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/import.delete.js'), 'utf8'));
    }));
    it('export.default.object', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.export('default').object()
            .ensure('components', '{}')
            .get('components')
            .set('UButton', 'UButton');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.js'), 'utf8'));
    }));
    it('export.default.object.after', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler_1.default(content);
        $js.export('default').object()
            .after('name')
            .ensure('components', '{}');
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.after.js'), 'utf8'));
    }));
});
//# sourceMappingURL=ScriptHandler.spec.js.map