"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VueFile_1 = require("../../src/VueFile");
const chai_1 = require("chai");
const path = require("path");
const shell = require("shelljs");
const basePath = path.resolve(__dirname, '../../../test/cases/transform');
describe('transform', () => {
    shell.cd(basePath);
    // it('should transform correctly', () => {
    //     async function test(cas: string) {
    //         const multiPath = cas + '/multi.vue';
    //         const singlePath = cas + '/single.vue';
    //         const testPath = cas + '/test.vue';
    //         shell.rm('-rf', testPath);
    //         shell.cp(singlePath, testPath);
    //         const vueFile = new VueFile(testPath);
    //         await vueFile.open();
    //         vueFile.transform();
    //         await vueFile.save();
    //         const files = fs.readdirSync(testPath);
    //         expect(files.join(',')).to.equal(fs.readdirSync(multiPath).join(','));
    //         files.forEach((file) => {
    //             expect(fs.readFileSync(path.resolve(testPath, file), 'utf8')).to
    //                 .equal(fs.readFileSync(path.resolve(multiPath, file), 'utf8'));
    //         });
    //         vueFile.transform();
    //         await vueFile.save();
    //         expect(fs.readFileSync(testPath, 'utf8')).to
    //             .equal(fs.readFileSync(singlePath, 'utf8'));
    //         shell.rm('-f', testPath);
    //     };
    //     shell.cd(basePath);
    //     const cases = ['script', 'template-script', 'template-script-module', 'import'];
    //     const promises = cases.map((cas) => test(cas));
    //     return Promise.all(promises);
    // });
    it('should check transform correctly', () => {
        const filePath = 'extra-blocks/multi.vue';
        const vueFile = new VueFile_1.default(filePath);
        chai_1.expect(vueFile.checkTransform()).to.be.true;
    });
});
//# sourceMappingURL=transform.test.js.map