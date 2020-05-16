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
        const entryViews = yield designer.loadViews({
            fullPath: BASE_PATH,
            viewType: fs_1.ViewType.root,
            routePath: '/',
        });
        const dashboardView = entryViews[0];
        // console.log(dashboardView);
        chai_1.expect(dashboardView.baseName).to.equal('dashboard');
        const moduleViews = yield designer.loadViews({
            fullPath: dashboardView.fullPath,
            viewType: dashboardView.viewType,
            routePath: dashboardView.routePath,
        });
        // expect(modulesViews[])
        chai_1.expect(moduleViews.length).to.equal(6);
    }));
    it('addLeafView', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryViews = yield designer.loadViews({
            fullPath: BASE_PATH,
            viewType: fs_1.ViewType.root,
            routePath: '/',
        });
        const dashboardView = entryViews[0];
        const moduleViews = yield designer.loadViews({
            fullPath: dashboardView.fullPath,
            viewType: dashboardView.viewType,
            routePath: dashboardView.routePath,
        });
        const module0View = moduleViews[0];
        const views = yield designer.loadViews({
            fullPath: module0View.fullPath,
            viewType: module0View.viewType,
            routePath: module0View.routePath,
        });
        // await designer.addLeafView({
        //     fullPath: views[0].fullPath,
        //     viewType: views[0].viewType,
        //     routePath: views[0].routePath,
        // }, {
        //     fullPath: module0View.fullPath,
        //     viewType: module0View.viewType,
        //     routePath: module0View.routePath,
        // }, {
        //     name: 'leaf',
        //     title: '页面',
        // })
        // await designer.removeView({
        //     fullPath: views[0].fullPath,
        //     viewType: views[0].viewType,
        //     routePath: views[0].routePath,
        // }, {
        //     fullPath: module0View.fullPath,
        //     viewType: module0View.viewType,
        //     routePath: module0View.routePath,
        // });
    }));
});
//# sourceMappingURL=index.spec.js.map