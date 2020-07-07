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