import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as designer from '../../../designer';
import { ViewType } from '../../../fs';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/designer');

describe('designer', () => {
    it('loadViews', async () => {
        const views = await designer.loadViews({
            fullPath: BASE_PATH,
            viewType: ViewType.root,
            routePath: '/',
        });
        const dashboardView = views[0];
        // console.log(dashboardView);
        expect(dashboardView.baseName).to.equal('dashboard');
        const moduleViews = await designer.loadViews({
            fullPath: dashboardView.fullPath,
            viewType: dashboardView.viewType,
        });
        // expect(modulesViews[])
        expect(moduleViews.length).to.equal(6);
    });

    it('markdown()', async () => {

    })
})
