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
const download = __importStar(require("../../../ms/download"));
describe('ms.download.npm', () => {
    it('should download a package currently', () => __awaiter(void 0, void 0, void 0, function* () {
        yield download.npm({
            registry: 'https://registry.npm.taobao.org',
            name: 'x-ace-editor.vue',
            version: '0.6.0',
        }, './tmp');
        chai_1.expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/index.js')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/package.json')).to.be.true;
        chai_1.expect(JSON.parse(yield fs.readFile('./tmp/x-ace-editor.vue@0.6.0/package.json', 'utf8')).version).to.equals('0.6.0');
    }));
    it('can rename a package', () => __awaiter(void 0, void 0, void 0, function* () {
        yield download.npm({
            registry: 'https://registry.npm.taobao.org',
            name: 'x-ace-editor.vue',
            version: '0.6.0',
        }, './tmp', 'my-package');
        chai_1.expect(fs.existsSync('./tmp/my-package')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/my-package/index.js')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/my-package/package.json')).to.be.true;
        chai_1.expect(JSON.parse(yield fs.readFile('./tmp/my-package/package.json', 'utf8')).version).to.equals('0.6.0');
    }));
});
describe('ms.download.git', () => {
    it('should download a git repo currently', () => __awaiter(void 0, void 0, void 0, function* () {
        yield download.git({
            url: 'https://github.com/vusion/md-vue-loader.git',
        }, './tmp/md-vue-loader');
        chai_1.expect(fs.existsSync('./tmp/md-vue-loader')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/md-vue-loader/index.js')).to.be.true;
        chai_1.expect(fs.existsSync('./tmp/md-vue-loader/.gitignore')).to.be.true;
    }));
});
//# sourceMappingURL=download.test.js.map