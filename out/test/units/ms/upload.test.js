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
const ms_1 = require("../../../ms");
describe('ms.upload.nos', () => {
    it('should upload files successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield ms_1.upload.nos([
                './templates/u-multi-file.vue/index.html',
                './templates/u-multi-file.vue/index.js',
                './templates/u-multi-file.vue/module.css',
            ]);
            console.log(result);
        }
        catch (e) {
            console.log(e.response && e.response.data);
            throw e;
        }
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0')).to.be.true;
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/index.js')).to.be.true;
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/package.json')).to.be.true;
        // expect(JSON.parse(await fs.readFile('./tmp/x-ace-editor.vue@0.6.0/package.json', 'utf8')).version).to.equals('0.6.0');
    }));
});
//# sourceMappingURL=upload.test.js.map