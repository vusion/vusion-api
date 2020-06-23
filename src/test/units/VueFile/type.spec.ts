import { expect } from 'chai';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');

describe('fs.VueFile', () => {
    it('open directory-composed no error', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'u-package.vue'));
        await vueFile.open();
        expect(vueFile.children.length).to.equal(3);
        expect(vueFile.script).includes(`import { MGroupParent } from '../m-group.vue';`);
    });
});
