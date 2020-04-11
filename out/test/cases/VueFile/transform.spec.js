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
const shell = require("shelljs");
const fs = require("fs-extra");
const BASE_PATH = path.resolve(__dirname, '../../../../src/test/cases/VueFile/files');
describe('transform', () => {
    shell.cd(BASE_PATH);
    function test(cas) {
        return __awaiter(this, void 0, void 0, function* () {
            const multiPath = cas + '/multi.vue';
            const singlePath = cas + '/single.vue';
            const testPath = cas + '/test.vue';
            shell.rm('-rf', testPath);
            shell.cp(singlePath, testPath);
            const vueFile = new VueFile_1.default(testPath);
            yield vueFile.open();
            vueFile.transform();
            yield vueFile.save();
            const files = fs.readdirSync(testPath);
            chai_1.expect(files.join(',')).to.equal(fs.readdirSync(multiPath).join(','));
            files.forEach((file) => {
                chai_1.expect(fs.readFileSync(path.resolve(testPath, file), 'utf8')).to
                    .equal(fs.readFileSync(path.resolve(multiPath, file), 'utf8'));
            });
            vueFile.transform();
            yield vueFile.save();
            chai_1.expect(fs.readFileSync(testPath, 'utf8')).to
                .equal(fs.readFileSync(singlePath, 'utf8'));
            shell.rm('-f', testPath);
        });
    }
    ;
    const cases = ['script', 'template-script', 'template-script-module', 'import'];
    cases.forEach((cas) => it('should transform correctly - ' + cas, () => test(cas)));
    it('should check transform correctly - extra-blocks/multi', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default('extra-blocks/multi.vue');
        yield vueFile.preOpen();
        chai_1.expect(vueFile.checkTransform()).that.include('test.spec.js');
    }));
    it('should check transform correctly - extra-blocks/single', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default('extra-blocks/single.vue');
        chai_1.expect(vueFile.checkTransform()).to.be.true;
    }));
});
//# sourceMappingURL=transform.spec.js.map