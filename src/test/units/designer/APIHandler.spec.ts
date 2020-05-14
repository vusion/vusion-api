import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as designer from '../../../designer';
import { ViewType } from '../../../fs';

const BASE_PATH = path.resolve(__dirname, '../../../../', 'src/test/units/designer');

describe('designer', () => {
    it('loadViews', async () => {
        const views = await designer.loadViews(BASE_PATH, ViewType.root);
        const dashboardView = views[0];
        expect(dashboardView.baseName).to.equal('dashboard');
        const moduleViews = await designer.loadViews(dashboardView.fullPath, dashboardView.viewType);
        // expect(modulesViews[])
        expect(moduleViews.length).to.equal(6);
    });

    it('markdown()', async () => {

    })
})
