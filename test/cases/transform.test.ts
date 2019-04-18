import VueFile from '../../src/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as shell from 'shelljs';
import * as fs from 'fs-extra';

const basePath = path.resolve(__dirname, '../../../test/cases/transform');

describe('transform', () => {
    it('should transform correctly', () => {
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

        shell.cd(basePath);
        const cases = shell.ls();
        const promises = cases.map((cas) => test(cas));
        return Promise.all(promises);
    });
});
