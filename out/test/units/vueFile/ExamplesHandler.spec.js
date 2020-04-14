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
const chai_1 = require("chai");
const path = require("path");
const fs_1 = require("../../../fs");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
describe('ExamplesHandler', () => {
    it('should', () => __awaiter(void 0, void 0, void 0, function* () {
        const vueFile = new fs_1.VueFile(path.resolve(BASE_PATH, 'u-button.vue'));
        yield vueFile.open();
        vueFile.parseExamples();
        const json = vueFile.examplesHandler.toJSON();
        chai_1.expect(json.length).to.equal(7);
        chai_1.expect(json[0].title).to.equal('主要按钮 ~~test~~');
        chai_1.expect(json[1].code).to.equal('<template>\n<u-button>次要按钮</u-button>\n</template>\n');
        chai_1.expect(json[6].description).to.equal('一般在页面局部使用。\n一般在页面局部使用。\n');
    }));
});
//# sourceMappingURL=ExamplesHandler.spec.js.map