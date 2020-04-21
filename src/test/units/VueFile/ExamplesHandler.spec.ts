import { expect } from 'chai';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');

describe('ExamplesHandler', () => {
    it('should', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'u-button.vue'));
        await vueFile.open();
        vueFile.parseExamples();

        const json = vueFile.examplesHandler.toJSON();
        expect(json.length).to.equal(7);
        expect(json[0].title).to.equal('主要按钮 ~~test~~');
        expect(json[1].code).to.equal('<template>\n<u-button>次要按钮</u-button>\n</template>\n');
        expect(json[6].description).to.equal('一般在页面局部使用。\n一般在页面局部使用。\n');
    });
})
