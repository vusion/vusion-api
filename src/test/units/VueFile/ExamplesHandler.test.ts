import { expect } from 'chai';
import * as path from 'path';
import { VueFile } from '../../../fs';

const BASE_PATH = 'src/test/units/VueFile';

describe('ExamplesHandler', () => {
    it('should', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, './files/u-button.vue'));
        await vueFile.open();
        // vueFile.examplesHandler
    });
})
