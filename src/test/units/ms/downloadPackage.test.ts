import { downloadPackage } from '../../../ms';

describe('ms.downloadPackage', () => {
    it('should download a package', async () => {
        await downloadPackage('https://registry.npm.taobao.org', 'x-ace-editor.vue', './tmp');
    });
});
