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
const chai_1 = require("chai");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const VueFile_1 = __importDefault(require("../../../fs/VueFile"));
const APIHandler_1 = __importDefault(require("../../../fs/APIHandler"));
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('APIHandler', () => {
    it('getTOCFromFile', () => __awaiter(void 0, void 0, void 0, function* () {
        const apiHandler = new APIHandler_1.default('', '');
        const toc = yield apiHandler.getTOCFromFile(path.resolve(BASE_PATH, 'u-button.vue/README.md'), undefined, { maxLevel: 3, minLevel: 4 });
        chai_1.expect(toc.length).to.equal(11);
        chai_1.expect(toc[1].title).to.equal('设置形状');
        chai_1.expect(toc[1].to.hash).to.equal('#设置形状');
        chai_1.expect(toc[toc.length - 2].title).to.equal('Slots');
        const events = toc[toc.length - 1];
        chai_1.expect(events.title).to.equal('Events');
        chai_1.expect(events.children).length(3);
    }));
    it('markdown()', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, 'u-sidebar.vue'));
        yield vueFile.open();
        vueFile.parseAPI();
        chai_1.expect(yield vueFile.apiHandler.markdownIndex()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/README.index.md'), 'utf8'));
        chai_1.expect(yield vueFile.apiHandler.markdown()).to.equal(yield fs.readFile(path.resolve(BASE_PATH, '../results/README.md'), 'utf8'));
    }));
});
//# sourceMappingURL=APIHandler.spec.js.map