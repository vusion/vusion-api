"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/designer');
describe('designer', () => {
    // it('loadViews', async () => {
    //     const entryViews = await designer.loadViews({
    //         fullPath: BASE_PATH,
    //         viewType: ViewType.root,
    //         routePath: '/',
    //     });
    //     const dashboardView = entryViews[0];
    //     // console.log(dashboardView);
    //     expect(dashboardView.baseName).to.equal('dashboard');
    //     const moduleViews = await designer.loadViews({
    //         fullPath: dashboardView.fullPath,
    //         viewType: dashboardView.viewType,
    //         routePath: dashboardView.routePath,
    //     });
    //     // expect(modulesViews[])
    //     expect(moduleViews.length).to.equal(6);
    // });
    // it('addLeafView', async () => {
    //     const entryViews = await designer.loadViews({
    //         fullPath: BASE_PATH,
    //         viewType: ViewType.root,
    //         routePath: '/',
    //     });
    //     const dashboardView = entryViews[0];
    //     const moduleViews = await designer.loadViews({
    //         fullPath: dashboardView.fullPath,
    //         viewType: dashboardView.viewType,
    //         routePath: dashboardView.routePath,
    //     });
    //     const module0View = moduleViews[0];
    //     const views = await designer.loadViews({
    //         fullPath: module0View.fullPath,
    //         viewType: module0View.viewType,
    //         routePath: module0View.routePath,
    //     });
    //     // await designer.addLeafView({
    //     //     fullPath: views[0].fullPath,
    //     //     viewType: views[0].viewType,
    //     //     routePath: views[0].routePath,
    //     // }, {
    //     //     fullPath: module0View.fullPath,
    //     //     viewType: module0View.viewType,
    //     //     routePath: module0View.routePath,
    //     // }, {
    //     //     name: 'leaf',
    //     //     title: '页面',
    //     // })
    //     // await designer.removeView({
    //     //     fullPath: views[0].fullPath,
    //     //     viewType: views[0].viewType,
    //     //     routePath: views[0].routePath,
    //     // }, {
    //     //     fullPath: module0View.fullPath,
    //     //     viewType: module0View.viewType,
    //     //     routePath: module0View.routePath,
    //     // });
    // });
});
//# sourceMappingURL=index.spec.js.map