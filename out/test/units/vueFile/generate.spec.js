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
const path = __importStar(require("path"));
const VueFile_1 = __importDefault(require("../../../fs/VueFile"));
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('fs.VueFile', () => {
    function test(cas) {
        return __awaiter(this, void 0, void 0, function* () {
            const vueFile = new VueFile_1.default(path.resolve(BASE_PATH, `${cas}.vue`));
            yield vueFile.open();
            vueFile.parseTemplate();
            const result = vueFile.templateHandler.generate();
            chai_1.expect(result).to.equals(vueFile.template);
        });
    }
    ;
    const cases = ['simple', 'complex', 'overview']; //, 'u-table-view', 'comment'
    cases.forEach((cas) => it('should generator correctly - ' + cas, () => test(cas)));
});
//# sourceMappingURL=generate.spec.js.map