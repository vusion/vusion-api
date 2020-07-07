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
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');
describe('merge', () => {
    it('templateHandler.merge', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'view.vue'));
        yield vueFile.open();
        const $html = vueFile.parseTemplate();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-1.vue'));
        yield vueFile1.open();
        const $html1 = vueFile1.parseTemplate();
        const vueFile2 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-2.vue'));
        yield vueFile2.open();
        const $html2 = vueFile2.parseTemplate();
        $html.merge($html1, '');
        chai_1.expect($html.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.html'), 'utf8'));
        $html.merge($html2, '/1/1');
        chai_1.expect($html.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.html'), 'utf8'));
    }));
    it('styleHandler.merge', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'view.vue'));
        yield vueFile.open();
        const $css = vueFile.parseStyle();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-1.vue'));
        yield vueFile1.open();
        const $css1 = vueFile1.parseStyle();
        const vueFile2 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-2.vue'));
        yield vueFile2.open();
        const $css2 = vueFile2.parseStyle();
        const classMap = $css.merge($css1).class;
        chai_1.expect($css.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.css'), 'utf8'));
        chai_1.expect(Object.keys(classMap).length).to.equal(2);
        chai_1.expect(classMap['root']).to.equal('root1');
        chai_1.expect(classMap['item']).to.equal('item1');
        const classMap2 = $css.merge($css2).class;
        chai_1.expect($css.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.css'), 'utf8'));
        chai_1.expect(Object.keys(classMap2).length).to.equal(1);
        chai_1.expect(classMap2['root']).to.equal('root2');
    }));
    it('scriptHandler.merge', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'view.vue'));
        yield vueFile.open();
        const $js = vueFile.parseScript();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-1.vue'));
        yield vueFile1.open();
        const $js1 = vueFile1.parseScript();
        const vueFile2 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-2.vue'));
        yield vueFile2.open();
        const $js2 = vueFile2.parseScript();
        const result = $js.merge($js1);
        const resultContent = $js.generate();
        yield fs.writeFile(path.resolve(BASE_PATH, '../results/merge-result.js'), resultContent, 'utf8');
        chai_1.expect(resultContent).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.js'), 'utf8'));
        chai_1.expect(Object.keys(result.data).length).to.equal(2);
        chai_1.expect(result.data['var1']).to.equal('var2');
        chai_1.expect(result.data['list']).to.equal('list1');
        const result2 = $js.merge($js2);
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.js'), 'utf8'));
        chai_1.expect(Object.keys(result2.data).length).to.equal(1);
    }));
    it('scriptHandler.merge -> hard', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'merge.vue'));
        yield vueFile.open();
        const $js = vueFile.parseScript();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'merge.vue'));
        yield vueFile1.open();
        const $js1 = vueFile1.parseScript();
        const classMap = $js.merge($js1);
        chai_1.expect($js.generate()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.hard.js'), 'utf8'));
    }));
    it('vueFile.merge', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'view.vue'));
        yield vueFile.open();
        vueFile.parseAll();
        const vueFile1 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-1.vue'));
        yield vueFile1.open();
        vueFile1.parseAll();
        const vueFile2 = new VueFile_1.default(path.resolve(BASE_PATH, 'block-2.vue'));
        yield vueFile2.open();
        vueFile2.parseAll();
        vueFile.merge(vueFile1);
        chai_1.expect(vueFile.generate({ startLevel: 0 })).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.vue'), 'utf8'));
        vueFile.merge(vueFile2, '/1/1');
        chai_1.expect(vueFile.generate({ startLevel: 0 })).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.vue'), 'utf8'));
    }));
});
//# sourceMappingURL=merge.spec.js.map