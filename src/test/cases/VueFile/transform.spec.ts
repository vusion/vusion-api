import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as shell from 'shelljs';
import * as fs from 'fs-extra';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');

describe('transform', () => {
    shell.cd(BASE_PATH);

    async function test(cas: string) {
        const multiPath = cas + '/multi.vue';
        const singlePath = cas + '/single.vue';
        const testPath = cas + '/test.vue';

        shell.rm('-rf', testPath);
        shell.cp(singlePath, testPath);

        const vueFile = new VueFile(testPath);
        await vueFile.open();
        vueFile.transform();
        await vueFile.save();

        const files = fs.readdirSync(testPath);
        expect(files.join(',')).to.equal(fs.readdirSync(multiPath).join(','));

        files.forEach((file) => {
            expect(fs.readFileSync(path.resolve(testPath, file), 'utf8')).to
                .equal(fs.readFileSync(path.resolve(multiPath, file), 'utf8'));
        });

        vueFile.transform();
        await vueFile.save();
        expect(fs.readFileSync(testPath, 'utf8')).to
            .equal(fs.readFileSync(singlePath, 'utf8'));

        shell.rm('-f', testPath);
    };

    const cases = ['script', 'template-script', 'template-script-module', 'import'];
    cases.forEach((cas) => it('should transform correctly - ' + cas, () => test(cas)));

    it('should check transform correctly - extra-blocks/multi', async () => {
        const vueFile = new VueFile('extra-blocks/multi.vue');
        await vueFile.preOpen();
        expect(vueFile.checkTransform()).that.include('test.spec.js');
    });

    it('should check transform correctly - extra-blocks/single', async () => {
        const vueFile = new VueFile('extra-blocks/single.vue');
        expect(vueFile.checkTransform()).to.be.true;
    });    
});
