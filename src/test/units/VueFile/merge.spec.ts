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
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        const $html = vueFile.parseTemplate();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-1.vue'));
        await vueFile1.open();
        const $html1 = vueFile1.parseTemplate();

        const vueFile2 = new VueFile(path.resolve(BASE_PATH, 'block-2.vue'));
        await vueFile2.open();
        const $html2 = vueFile2.parseTemplate();

        expect($html.merge($html1, '').generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/template.merge.1.html'), 'utf8'));
        expect($html.merge($html2, '/1', 1).generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/template.merge.2.html'), 'utf8'));
    });
});
