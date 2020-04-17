import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');

describe('createFromCode', () => {
    const content = fs.readFileSync(path.resolve(BASE_PATH, 'template-script-module/single.vue'), 'utf8');
    const vueFile = VueFile.from(content);

    it('fromCode', async () => {
        expect(vueFile.fileName).to.equal('temp.vue');
        expect(vueFile.baseName).to.equal('temp');
        expect(vueFile.content).to.equal(content);
        expect(vueFile.template).to.equal('<div :class="$style.root"></div>\n');
    });

    it('saveAs', async() => {
        const tempPath = path.resolve(TMP_PATH, 'temp.vue');
        await fs.remove(tempPath);
        await vueFile.saveAs(tempPath);
        expect(await fs.readFile(tempPath, 'utf8')).to.equal(content);
    });
});
