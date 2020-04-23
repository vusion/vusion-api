import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';
import APIHandler from '../../../fs/APIHandler';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');

describe('APIHandler', () => {
    it('getTOCFromFile', async () => {
        const apiHandler = new APIHandler('', '');
        const toc = await apiHandler.getTOCFromFile(path.resolve(BASE_PATH, 'u-button.vue/README.md'));

        expect(toc.length).to.equal(11);
        expect(toc[1].title).to.equal('设置形状');
        expect((toc[1].to as any).hash).to.equal('#设置形状');
        expect(toc[toc.length - 2].title).to.equal('Slots');
        const events = toc[toc.length - 1];
        expect(events.title).to.equal('Events');
        expect(events.children).length(3);
    });

    it('markdown()', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'u-button.vue'));
        await vueFile.open();
        vueFile.parseAPI();

        const result = await vueFile.apiHandler.markdown();
        await fs.writeFile(path.resolve(BASE_PATH, '../results/README.md'), result);
    })
})
