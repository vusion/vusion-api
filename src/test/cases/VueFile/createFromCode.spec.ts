import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');

describe('createFromCode', () => {
    it('should', async () => {
        const content = await fs.readFile(path.resolve(BASE_PATH, 'template-script-module/single.vue'), 'utf8');
        const vueFile = VueFile.from(content);
        expect(vueFile.fileName).to.equal('temp.vue');
        expect(vueFile.baseName).to.equal('temp');
        expect(vueFile.content).to.equal(content);
        expect(vueFile.template).to.equal('<div :class="$style.root"></div>\n')
    });
});
