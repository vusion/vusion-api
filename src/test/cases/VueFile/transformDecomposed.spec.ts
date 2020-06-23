import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as shell from 'shelljs';
import * as fs from 'fs-extra';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/cases/VueFile/files');

describe('transformDecomposed', () => {
    it('should transform decomposed correctly', async () => {
        const composedPath = path.resolve(BASE_PATH, 'composed/u-composed.vue');
        const decomposedPath = path.resolve(BASE_PATH, 'composed/u-decomposed.vue');
        const testPath = path.resolve(BASE_PATH, 'composed/u-test.vue');
        shell.rm('-rf', testPath);
        shell.cp('-r', decomposedPath, testPath);

        const vueFile = new VueFile(testPath);
        await vueFile.open();

        await Promise.all(vueFile.children.map(async (child) => {
            await child.open();
            if (child.isDirectory && !child.isComposed) {
                child.transformExportStyle();
                const checkResult = child.checkTransform();
                if (checkResult !== true) {
                    return console.warn(child.fullPath, checkResult);
                } else {
                    child.transform();
                }
            }
            await child.save();
        }));

        vueFile.transformDecomposed();
        await vueFile.save();

        const files = fs.readdirSync(testPath);
        expect(files.join(',')).to.equal(fs.readdirSync(composedPath).join(','));

        files.forEach((file) => {
            const sourcePath = path.resolve(testPath, file);
            if (fs.statSync(sourcePath).isDirectory())
                return;
            expect(fs.readFileSync(sourcePath, 'utf8')).to
                .equal(fs.readFileSync(path.resolve(composedPath, file), 'utf8'));
        });
    });
});