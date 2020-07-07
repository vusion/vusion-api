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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = __importStar(require("fs-extra"));
const ms = __importStar(require("../../../ms"));
describe('ms.formatTemplate', () => {
    it('should format files currently', () => __awaiter(void 0, void 0, void 0, function* () {
        yield ms.formatTemplateTo('./templates/u-multi-file.vue', './tmp/u-formatted.vue', {
            componentName: 'UBar',
            tagName: 'u-bar',
            title: '条',
            description: '组件描述',
        });
        chai_1.expect(fs.existsSync('./tmp/u-formatted.vue')).to.be.true;
        chai_1.expect((yield fs.readFile('./tmp/u-formatted.vue/index.js', 'utf8')).includes('export const UBar')).to.be.true;
        chai_1.expect((yield fs.readFile('./tmp/u-formatted.vue/README.md', 'utf8')).includes('# UBar 条')).to.be.true;
    }));
});
//# sourceMappingURL=formatTemplate.test.js.map