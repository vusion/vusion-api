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
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');
describe('transformDecomposed', () => {
    it('should transform decomposed correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const composedPath = path.resolve(BASE_PATH, 'composed/u-composed.vue');
        const decomposedPath = path.resolve(BASE_PATH, 'composed/u-decomposed.vue');
        const testPath = path.resolve(BASE_PATH, 'composed/u-test.vue');
        shell.rm('-rf', testPath);
        shell.cp('-r', decomposedPath, testPath);
        const vueFile = new VueFile_1.default(testPath);
        yield vueFile.open();
        yield Promise.all(vueFile.children.map((child) => __awaiter(void 0, void 0, void 0, function* () {
            yield child.open();
            if (child.isDirectory && !child.isComposed) {
                child.transformExportStyle();
                const checkResult = child.checkTransform();
                if (checkResult !== true) {
                    return console.warn(child.fullPath, checkResult);
                }
                else {
                    child.transform();
                }
            }
            yield child.save();
        })));
        vueFile.transformDecomposed();
        yield vueFile.save();
        const files = fs.readdirSync(testPath);
        chai_1.expect(files.join(',')).to.equal(fs.readdirSync(composedPath).join(','));
        files.forEach((file) => {
            const sourcePath = path.resolve(testPath, file);
            if (fs.statSync(sourcePath).isDirectory())
                return;
            chai_1.expect(fs.readFileSync(sourcePath, 'utf8')).to
                .equal(fs.readFileSync(path.resolve(composedPath, file), 'utf8'));
        });
    }));
});
//# sourceMappingURL=transformDecomposed.spec.js.map