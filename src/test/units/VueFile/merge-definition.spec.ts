import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import { isFilesSame } from '../../utils';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');



describe('merge', () => {
    it('templateHandler.merge', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'merge-ref.vue'));
        await vueFile.open();
        const $html = vueFile.parseTemplate();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'merge-ref.vue'));
        await vueFile1.open();
        const $html1 = vueFile1.parseTemplate();

        $html.merge($html1, '');
        expect($html.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge-ref.html'), 'utf8'));
    });
});
