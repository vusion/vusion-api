import VueFile from '../../../fs/VueFile';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import { isFilesSame } from '../../utils';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/VueFile/files');
const TMP_PATH = path.resolve(__dirname, '../../../../', 'tmp');
const TEMPLATES_PATH = path.resolve(__dirname, '../../../../', 'templates');



describe('merge', () => {
    it('templateHandler.merge', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        const $html = vueFile.parseTemplate();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-1.vue'));
        await vueFile1.open();
        const $html1 = vueFile1.parseTemplate();

        const vueFile2 = new VueFile(path.resolve(BASE_PATH, 'block-2.vue'));
        await vueFile2.open();
        const $html2 = vueFile2.parseTemplate();

        $html.merge($html1, '');
        expect($html.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.html'), 'utf8'));
        $html.merge($html2, '/1/1');
        expect($html.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.html'), 'utf8'));
    });

    it('styleHandler.merge', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        const $css = vueFile.parseStyle();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-1.vue'));
        await vueFile1.open();
        const $css1 = vueFile1.parseStyle();

        const vueFile2 = new VueFile(path.resolve(BASE_PATH, 'block-2.vue'));
        await vueFile2.open();
        const $css2 = vueFile2.parseStyle();

        const classMap = $css.merge($css1).class;
        expect($css.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.css'), 'utf8'));
        expect(Object.keys(classMap).length).to.equal(2);
        expect(classMap['root']).to.equal('root1');
        expect(classMap['item']).to.equal('item1');

        const classMap2 = $css.merge($css2).class;
        expect($css.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.css'), 'utf8'));
        expect(Object.keys(classMap2).length).to.equal(1);
        expect(classMap2['root']).to.equal('root2');
    });


    it('scriptHandler.merge', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        const $js = vueFile.parseScript();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-1.vue'));
        await vueFile1.open();
        const $js1 = vueFile1.parseScript();

        const vueFile2 = new VueFile(path.resolve(BASE_PATH, 'block-2.vue'));
        await vueFile2.open();
        const $js2 = vueFile2.parseScript();

        const result = $js.merge($js1);
        const resultContent = $js.generate();
        await fs.writeFile(path.resolve(BASE_PATH, '../results/merge-result.js'),resultContent, 'utf8');
        expect(resultContent).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.js'), 'utf8'));
        expect(Object.keys(result.data).length).to.equal(2);
        expect(result.data['var1']).to.equal('var2');
        expect(result.data['list']).to.equal('list1');

        const result2 = $js.merge($js2);
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.js'), 'utf8'));
        expect(Object.keys(result2.data).length).to.equal(1);
    });

    it('scriptHandler.merge -> hard', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'merge.vue'));
        await vueFile.open();
        const $js = vueFile.parseScript();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'merge.vue'));
        await vueFile1.open();
        const $js1 = vueFile1.parseScript();

        const classMap = $js.merge($js1);
        expect($js.generate()).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.hard.js'), 'utf8'));
    });

    it('vueFile.merge', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        vueFile.parseAll();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-1.vue'));
        await vueFile1.open();
        vueFile1.parseAll();

        const vueFile2 = new VueFile(path.resolve(BASE_PATH, 'block-2.vue'));
        await vueFile2.open();
        vueFile2.parseAll();

        vueFile.merge(vueFile1);
        expect(vueFile.generate({ startLevel: 0 })).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.vue'), 'utf8'));

        vueFile.merge(vueFile2, '/1/1');
        expect(vueFile.generate({ startLevel: 0 })).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge.2.vue'), 'utf8'));
    });

    it('vueFile.mergeShortage', async () => {
        const vueFile = new VueFile(path.resolve(BASE_PATH, 'view.vue'));
        await vueFile.open();
        vueFile.parseAll();

        const vueFile1 = new VueFile(path.resolve(BASE_PATH, 'block-template.vue'));
        await vueFile1.open();
        vueFile1.parseAll();

        vueFile.merge(vueFile1);
        expect(vueFile.generate({ startLevel: 0 })).to.equal(await fs.readFile(path.resolve(BASE_PATH, '../results/merge-shortage.vue'), 'utf8'));
        // await fs.writeFile(path.resolve(BASE_PATH, '../results/merge-shortage.vue'), vueFile.generate({ startLevel: 0 }))
    });
});
