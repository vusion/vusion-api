"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VueFile_1 = __importDefault(require("../../../fs/VueFile"));
const chai_1 = require("chai");
const path = __importStar(require("path"));
const shell = __importStar(require("shelljs"));
const fs = __importStar(require("fs-extra"));
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');
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