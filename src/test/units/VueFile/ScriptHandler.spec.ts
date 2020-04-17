import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import ScriptHandler from '../../../fs/ScriptHandler';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');

describe('ScriptHandler', () => {

    it('import', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.import('UTest').from('./u-test.vue');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/import.js'), 'utf8'));
    });

    it('import.delete', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.import('ULink').from('../u-link.vue').delete();
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/import.delete.js'), 'utf8'));
    });

    it('export.default.object', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.export('default').object()
            .ensure('components', '{}')
            .get('components')
            .set('UButton', 'UButton');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.js'), 'utf8'));
    });

    it('export.default.object.after', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.export('default').object()
            .after('name')
            .ensure('components', '{}');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.after.js'), 'utf8'));
    });
});
