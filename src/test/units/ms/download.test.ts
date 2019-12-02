import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as download from '../../../ms/download';

describe('ms.download.npm', () => {
    it('should download a package currently', async () => {
        await download.npm({
            registry: 'https://registry.npm.taobao.org',
            name: 'x-ace-editor.vue',
            version: '0.6.0',
        }, './tmp');

        expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0')).to.be.true;
        expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/index.js')).to.be.true;
        expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/package.json')).to.be.true;
        expect(JSON.parse(await fs.readFile('./tmp/x-ace-editor.vue@0.6.0/package.json', 'utf8')).version).to.equals('0.6.0');
    });

    it('can rename a package', async () => {
        await download.npm({
            registry: 'https://registry.npm.taobao.org',
            name: 'x-ace-editor.vue',
            version: '0.6.0',
        }, './tmp', 'my-package');

        expect(fs.existsSync('./tmp/my-package')).to.be.true;
        expect(fs.existsSync('./tmp/my-package/index.js')).to.be.true;
        expect(fs.existsSync('./tmp/my-package/package.json')).to.be.true;
        expect(JSON.parse(await fs.readFile('./tmp/my-package/package.json', 'utf8')).version).to.equals('0.6.0');
    });
});

describe('ms.download.git', () => {
    it('should download a git repo currently', async () => {
        await download.git({
            url: 'https://github.com/vusion/md-vue-loader.git',
        }, './tmp/md-vue-loader');

        expect(fs.existsSync('./tmp/md-vue-loader')).to.be.true;
        expect(fs.existsSync('./tmp/md-vue-loader/index.js')).to.be.true;
        expect(fs.existsSync('./tmp/md-vue-loader/.gitignore')).to.be.true;
    });
});
