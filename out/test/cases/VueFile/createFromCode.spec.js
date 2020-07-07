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
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
describe('createFromCode', () => {
    it('fromCode', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'template-script-module/single.vue'), 'utf8');
        const vueFile = VueFile_1.default.from(content);
        chai_1.expect(vueFile.fileName).to.equal('temp.vue');
        chai_1.expect(vueFile.baseName).to.equal('temp');
        chai_1.expect(vueFile.content).to.equal(content);
        chai_1.expect(vueFile.template).to.equal('<div :class="$style.root"></div>\n');
    }));
});
//# sourceMappingURL=createFromCode.spec.js.map