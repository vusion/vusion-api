import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import ScriptHandler from '../../../fs/ScriptHandler';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');

describe('ScriptHandler', () => {

    it('import(identifer)', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.import('UTest').from('./u-test.vue');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/import.js'), 'utf8'));
    });

    it('import(specifiers)', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'u-button.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.import({ default: 'UButton', ULink: 'ULink', ULabel: '' }).from('./library');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/import.specifiers.js'), 'utf8'));
    });

    it('froms().has()', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'components.js'), 'utf8');
        const $js = new ScriptHandler(content);
        const froms = $js.froms();
        expect(froms.has('babel-polyfill')).to.be.true;
        expect(froms.has('vue')).to.be.true;
        expect(froms.has('./common/u-button.vue')).to.be.true;
        expect(froms.has('./common/s-sidebar.vue')).to.be.true;
        expect(froms.has('./common/s-navbar.vue')).to.be.true;
        expect(froms.has('./common/s-logo.vue')).to.be.true;
        expect(froms.has('@cloud-ui/u-relations-diagram.vue')).to.be.true;
        expect(froms.has('@cloud-ui/u-workflow.vue')).to.be.true;
    });

    it('froms().delete()', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'components.js'), 'utf8');
        const $js = new ScriptHandler(content);
        const froms = $js.froms();
        froms.delete('babel-polyfill');
        froms.delete('vue');
        froms.delete('./common/s-navbar.vue');
        froms.delete('@cloud-ui/u-relations-diagram.vue');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/import.delete.js'), 'utf8'));
    });

    it('export().default().object()', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.export().default().object()
            .ensure('components', '{}')
            .get('components')
            .set('UButton', 'UButton');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.js'), 'utf8'));
    });

    it('export().default().object().after()', async () => {
        const content = fs.readFileSync(path.resolve(BASE_PATH, 'multi.vue/index.js'), 'utf8');
        const $js = new ScriptHandler(content);
        $js.export().default().object()
            .after('name')
            .ensure('components', '{}');
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/export.default.object.after.js'), 'utf8'));
    });
});
