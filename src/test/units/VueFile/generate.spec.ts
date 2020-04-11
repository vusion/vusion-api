import { expect } from 'chai';
import * as path from 'path';
import VueFile from '../../../fs/VueFile';

const BASE_PATH = 'src/test/units/VueFile';

describe('fs.VueFile', () => {
    async function test(cas: string) {
        const vueFile = new VueFile(path.resolve(BASE_PATH, `./files/${cas}.vue`));
        await vueFile.open();
        vueFile.parseTemplate();

        const result = vueFile.templateHandler.generate();
        expect(result).to.equals(vueFile.template);
    };

    const cases = ['simple', 'complex', 'overview']; //, 'u-table-view', 'comment'
    cases.forEach((cas) => it('should generator correctly - ' + cas, () => test(cas)));
});
