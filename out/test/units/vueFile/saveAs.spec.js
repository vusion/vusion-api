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
const fs = __importStar(require("fs-extra"));
const utils_1 = require("../../utils");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');
describe('saveAs', () => {
    it('multi -> multi', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldPath = path.resolve(BASE_PATH, 'u-button.vue');
        const vueFile = new VueFile_1.default(oldPath);
        yield vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp.vue');
        yield fs.remove(newPath);
        yield vueFile.saveAs(newPath);
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'api.yaml')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    }));
    it('package -> package', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldPath = path.resolve(TEMPLATES_PATH, 'u-multi-file-package.vue');
        const vueFile = new VueFile_1.default(oldPath);
        yield vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp-2.vue');
        yield fs.remove(newPath);
        yield vueFile.saveAs(newPath);
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.html')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'package.json')).to.be.true;
        chai_1.expect(yield utils_1.isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    }));
});
//# sourceMappingURL=saveAs.spec.js.map