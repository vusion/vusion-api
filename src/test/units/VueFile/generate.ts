import { expect } from 'chai';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';

const BASE_PATH = 'src/test/units/VueFile';

describe('fs.VueFile', () => {
    it('should generate currectly', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, './files/overview.vue'));
        await vueFile.open();
        vueFile.parseTemplate();

        const result = vueFile.templateHandler.generate();
        // console.log(result);
        expect(result).to.equals(vueFile.template);
    });
});
