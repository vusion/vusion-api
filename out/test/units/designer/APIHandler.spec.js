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
const path = require("path");
const designer = require("../../../designer");
const fs_1 = require("../../../fs");
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/designer');
describe('designer', () => {
    it('loadViews', () => __awaiter(void 0, void 0, void 0, function* () {
        const views = yield designer.loadViews(BASE_PATH, fs_1.ViewType.root);
        const dashboardView = views[0];
        chai_1.expect(dashboardView.baseName).to.equal('dashboard');
        const moduleViews = yield designer.loadViews(dashboardView.fullPath, dashboardView.viewType);
        // expect(modulesViews[])
        chai_1.expect(moduleViews.length).to.equal(6);
    }));
    it('markdown()', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
//# sourceMappingURL=APIHandler.spec.js.map