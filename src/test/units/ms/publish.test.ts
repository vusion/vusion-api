import { expect } from 'chai';
import * as ms from '../../../ms';

describe('ms.publishBlock', () => {
    it('should succeed', async () => {
        const params = {
            name: 's-test-block.vue',
            version: '0.1.0',
            description: 'My block for test',
            labels: 'test,block',
            homepage: `https://vusion.163yun.com/#/block/s-test-block.vue`,
            author: 'Forrest <rainforest92@126.com>',
            repository: `https://github.com/vusion/cloud-ui/tree/master/src/blocks/s-test-block.vue`,
            title: '测试区块',
            category: 'info',
            base: 'vue',
            ui: `cloud-ui.vusion`,
            screenshots: '',
            registry: 'https://registry.npmjs.org',
            access: 2,
            team: '网易云计算前端'
        };

        const result = await ms.publishBlock(params);
        expect(/^20\d/.test(result.code)).to.be.true;

        const block = await ms.getBlock(params.name);
        expect(block.name).to.equal(params.name);
        expect(block.version).to.equal(params.version);
        expect(block.labels).to.equal(params.labels);
        expect(block.screenshots).to.equal(params.screenshots);
        expect(block.access).to.equal(params.access);
        expect(block.team).to.equal(params.team);
    });
});

describe('ms.publishComponent', () => {
    it('should succeed', async () => {
        const params = {
            name: 's-test-component.vue',
            version: '0.1.0',
            description: 'My component for test',
            labels: 'test,component',
            homepage: `https://vusion.163yun.com/#/component/s-test-component.vue`,
            author: 'Forrest <rainforest92@126.com>',
            repository: `https://github.com/vusion/cloud-ui/tree/master/src/components/s-test-block.vue`,
            title: '测试组件',
            category: 'info',
            base: 'vue',
            ui: `cloud-ui.vusion`,
            screenshots: '',
            blocks: '[{}]',
            registry: 'https://registry.npmjs.org',
            access: 2,
            team: '网易云计算前端'
        };

        const result = await ms.publishComponent(params);
        expect(/^20\d/.test(result.code)).to.be.true;

        const component = await ms.getComponent(params.name);
        expect(component.name).to.equal(params.name);
        expect(component.version).to.equal(params.version);
        expect(component.labels).to.equal(params.labels);
        expect(component.screenshots).to.equal(params.screenshots);
        expect(component.blocks).to.equal(params.blocks);
        expect(component.access).to.equal(params.access);
        expect(component.team).to.equal(params.team);
    });
});
