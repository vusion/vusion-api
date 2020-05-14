"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ms = require("../../../ms");
describe('ms.publishBlock', () => {
    it('should succeed', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield ms.publishBlock(params);
        chai_1.expect(/^20\d/.test(result.code)).to.be.true;
        const block = yield ms.getBlock(params.name);
        chai_1.expect(block.name).to.equal(params.name);
        chai_1.expect(block.version).to.equal(params.version);
        chai_1.expect(block.labels).to.equal(params.labels);
        chai_1.expect(block.screenshots).to.equal(params.screenshots);
        chai_1.expect(block.access).to.equal(params.access);
        chai_1.expect(block.team).to.equal(params.team);
    }));
});
describe('ms.publishComponent', () => {
    it('should succeed', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield ms.publishComponent(params);
        chai_1.expect(/^20\d/.test(result.code)).to.be.true;
        const component = yield ms.getComponent(params.name);
        chai_1.expect(component.name).to.equal(params.name);
        chai_1.expect(component.version).to.equal(params.version);
        chai_1.expect(component.labels).to.equal(params.labels);
        chai_1.expect(component.screenshots).to.equal(params.screenshots);
        chai_1.expect(component.blocks).to.equal(params.blocks);
        chai_1.expect(component.access).to.equal(params.access);
        chai_1.expect(component.team).to.equal(params.team);
    }));
});
//# sourceMappingURL=publish.test.js.map