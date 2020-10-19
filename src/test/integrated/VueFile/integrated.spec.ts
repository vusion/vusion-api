import { expect } from 'chai';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/integrated/VueFile');

describe('fs.VueFile', () => {
    it('open integrated.spec.ts', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'bomb.vue'));
        await vueFile.open();
        expect(vueFile.content.length > 0).to.be.true;
        console.log(vueFile.template);
        expect(vueFile.template.length > 0).to.be.true;
        expect(vueFile.script.length > 0).to.be.true;
        expect(vueFile.definition.length > 0).to.be.true;
    });
});
