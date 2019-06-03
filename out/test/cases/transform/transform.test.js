"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const VueFile_1 = require("../../../src/VueFile");
const chai_1 = require("chai");
const path = require("path");
const shell = require("shelljs");
const fs = require("fs-extra");
const basePath = path.resolve(__dirname, '../../../../test/cases/transform');
describe('transform', () => {
    it('should transform correctly', () => {
        function test(cas) {
            return __awaiter(this, void 0, void 0, function* () {
                const multiPath = cas + '/multi.vue';
                const singlePath = cas + '/single.vue';
                const testPath = cas + '/test.vue';
                shell.rm('-f', testPath);
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
                chai_1.expect(fs.readFileSync(testPath, 'utf8')).to
                    .equal(fs.readFileSync(singlePath, 'utf8'));
                shell.rm('-f', testPath);
            });
        }
        ;
        shell.cd(basePath);
        const cases = shell.ls();
        const promises = cases.map((cas) => test(cas));
        return Promise.all(promises);
    });
});
//# sourceMappingURL=transform.test.js.map