import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import { isFilesSame } from '../../utils';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');



describe('saveAs', () => {
    it('multi -> multi', async () => {
        const oldPath = path.resolve(BASE_PATH, 'u-button.vue');
        const vueFile = new VueFile(oldPath);
        await vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp.vue');
        await fs.remove(newPath);
        await vueFile.saveAs(newPath);

        expect(await isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'api.yaml')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    });

    it('package -> package', async () => {
        const oldPath = path.resolve(TEMPLATES_PATH, 'u-multi-file-package.vue');
        const vueFile = new VueFile(oldPath);
        await vueFile.open();
        const newPath = path.resolve(TMP_PATH, 'temp.vue');
        await fs.remove(newPath);
        await vueFile.saveAs(newPath);

        expect(await isFilesSame(newPath, oldPath, 'index.html')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'index.js')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'module.css')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'package.json')).to.be.true;
        expect(await isFilesSame(newPath, oldPath, 'README.md')).to.be.true;
    });
});
