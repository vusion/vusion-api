import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as designer from '../../../designer';
import { ViewType } from '../../../fs';

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
})
