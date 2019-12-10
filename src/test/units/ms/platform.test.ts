import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as ms from '../../../ms';

describe('ms.teamExist', () => {
    it('should check team existing', async () => {
        let result = await ms.teamExist('网易云计算前端');
        expect(result).to.be.true;
    });
});
