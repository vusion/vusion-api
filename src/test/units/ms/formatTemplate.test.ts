import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as ms from '../../../ms';

describe('ms.formatTemplate', () => {
    it('should format files currently', async () => {
        await ms.formatTemplateTo('./templates/u-multi-file.vue', './tmp/u-formatted.vue', {
            componentName: 'UBar',
            tagName: 'u-bar',
            title: '条',
            description: '组件描述',
        });

        expect(fs.existsSync('./tmp/u-formatted.vue')).to.be.true;
        expect((await fs.readFile('./tmp/u-formatted.vue/index.js', 'utf8')).includes('export const UBar')).to.be.true;
        expect((await fs.readFile('./tmp/u-formatted.vue/README.md', 'utf8')).includes('# UBar 条')).to.be.true;
    });
});
