import { expect } from 'chai';
import * as fs from 'fs-extra';
import { upload } from '../../../ms';

describe('ms.upload.nos', () => {
    it('should upload files successfully', async () => {
        try {
            const result = await upload.nos([
                './templates/u-multi-file.vue/index.html',
                './templates/u-multi-file.vue/index.js',
                './templates/u-multi-file.vue/module.css',
            ]);
            console.log(result);
        } catch (e) {
            console.log(e.response && e.response.data);
            throw e;
        }
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0')).to.be.true;
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/index.js')).to.be.true;
        // expect(fs.existsSync('./tmp/x-ace-editor.vue@0.6.0/package.json')).to.be.true;
        // expect(JSON.parse(await fs.readFile('./tmp/x-ace-editor.vue@0.6.0/package.json', 'utf8')).version).to.equals('0.6.0');
    });
});
