import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from '@babel/core';
import * as vfs from '../fs';
import * as vms from '../ms';
import * as compiler from 'vue-template-compiler';
import * as utils from '../utils';

export * from './nuims';

export async function addLayout(fullPath: string, nodePath: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '') + '\n';
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByNodePath(nodePath, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

/**
 * 添加页面时初始化布局
 * @param fullPath Vue 文件路径
 * @param type 布局类型
 */
export async function initLayout(fullPath: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s*/, '').replace(/\s*<\/template>\s*$/, '') + '\n';

    if (type.startsWith('grid-'))
        tpl = `<u-grid-layout>${tpl}</u-grid-layout>\n`;
    vueFile.template = tpl;

    await vueFile.save();
}

/**
 * 添加页面时初始化布局
 * @param fullPath Vue 文件路径
 * @param type 布局类型
 */
async function initViewLayout(fullPath: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '') + '\n';

    const rootEl = vueFile.templateHandler.ast;
    rootEl.children.unshift(compiler.compile(tpl).ast);

    await vueFile.save();
}


export async function addCode(fullPath: string, nodePath: string, tpl: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByNodePath(nodePath, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

export async function openFile(fullPath: string) {
    return fs.readFile(fullPath, 'utf8');
}

export async function saveFile(fullPath: string, content: string) {
    return fs.writeFile(fullPath, content);
}

export async function ensureHotReload(fullPath: string) {
    if (!fs.existsSync(fullPath))
        return;
    return fs.writeFile(fullPath, await fs.readFile(fullPath, 'utf8'))
}

// export async function mergeBlock(fullPath: string, type: string) {
//     const vueFile = new vfs.VueFile(fullPath);
//     await vueFile.open();

//     vueFile.parseTemplate();

//     let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
//     let tpl = await fs.readFile(tplPath, 'utf8');
//     tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
//     const rootEl = vueFile.templateHandler.ast;
//     rootEl.children.push(compiler.compile(tpl).ast);

//     await vueFile.save();
// }

export interface ViewInfo {
    fullPath: string,
    viewType: vfs.ViewType,
    // viewsPath?: string,
    routePath?: string,
    // vueFilePath?: string,
}

export interface AddParams {
    name: string,
    title: string,
    ext?: string,
    layout?: string,
    crumb?: string,
    first?: boolean,
}
function hasNewParams(params: AddParams) {
    return params.hasOwnProperty('title') || params.hasOwnProperty('crumb') || params.hasOwnProperty('first');
}

async function initView(viewInfo: ViewInfo) {
    const isDirectory = !(viewInfo.viewType === vfs.ViewType.vue || viewInfo.viewType === vfs.ViewType.md);
    return new vfs.View(viewInfo.fullPath, viewInfo.viewType, isDirectory, viewInfo.routePath);
}


interface MetaData {
    getMetaData(viewInfo: vfs.View, baseViewInfo?: ViewInfo | vfs.View): void,
    saveMetaData(viewInfo: vfs.View, params: AddParams, baseViewInfo?: ViewInfo | vfs.View): void,
}
class EntryMetaData implements MetaData {
    async getMetaData(viewInfo: vfs.View) {
        const fullPath = viewInfo.fullPath;
        // @TODO?
        const index = fullPath.indexOf('src');
        const pagesJSONPath = path.join(fullPath.slice(0, index), 'pages.json');
        
        const data = {
            title: '',
        }
        if (!fs.existsSync(pagesJSONPath))
            throw new Error('Cannot find pagesJSONPath');

        const pagesJSON = JSON.parse(await fs.readFile(pagesJSONPath, 'utf8'));
        data.title = pagesJSON[viewInfo.baseName] && pagesJSON[viewInfo.baseName].title;

        return data;
    }
    async saveMetaData(viewInfo: vfs.View, params: AddParams) {
        const fullPath = viewInfo.fullPath;

        const index = fullPath.indexOf('src');
        const pagesJSONPath = path.join(fullPath.slice(0, index), 'pages.json');

        if (!fs.existsSync(pagesJSONPath))
            throw new Error('Cannot find pagesJSONPath');

        const pagesJSON = JSON.parse(await fs.readFile(pagesJSONPath, 'utf8'));
        if (pagesJSON[viewInfo.baseName])
            Object.assign(pagesJSON[viewInfo.baseName], params);
            
        return fs.writeFile(pagesJSONPath, JSON.stringify(pagesJSON, null, 4));
    }
}

class PageMetaData implements MetaData {
    async getMetaData(viewInfo: vfs.View, baseViewInfo: ViewInfo | vfs.View) {
        if (!baseViewInfo)
            return {};
        const baseViewPath = baseViewInfo.fullPath;
        const routePath = path.join(baseViewPath, 'routes.map.js');
        const data = {
            title: '',
            first: false,
            meta: {},
        }
        if (fs.existsSync(routePath)) {
            let routeJSON = utils.JS.parse(await fs.readFile(routePath, 'utf8'));
            let currentPath = viewInfo.routePath.replace(baseViewInfo.routePath, '').replace(/\/$/, '');
            if (routeJSON[currentPath]) {
                data.meta = routeJSON[currentPath].meta;
                data.title = data.meta && routeJSON[currentPath].meta.title;
            }
        }
        return data;
    }
    async saveMetaData(viewInfo: vfs.View, params: AddParams, baseViewInfo?: vfs.View) {
        if (!baseViewInfo)
            return {};
        const baseViewPath = baseViewInfo.fullPath;
        const routePath = path.join(baseViewPath, 'routes.map.js');

        let routeJSON: { [name: string]: { meta?: { title: string, crumb?: string }, first?: boolean } } = {};
        if (fs.existsSync(routePath))
            routeJSON = utils.JS.parse(await fs.readFile(routePath, 'utf8'));

        let currentPath = viewInfo.routePath.replace(baseViewInfo.routePath, '').replace(/\/$/, '');
        if (!routeJSON[currentPath])
            routeJSON[currentPath] = {};
        routeJSON[currentPath].meta = Object.assign(routeJSON[currentPath].meta || {});
        if (params.hasOwnProperty('title'))
            routeJSON[currentPath].meta.title = params.title;
        if (params.hasOwnProperty('crumb'))
            routeJSON[currentPath].meta.crumb = params.crumb;
        if (params.hasOwnProperty('first'))
            routeJSON[currentPath].first = params.first;

        return fs.writeFile(routePath, 'export default ' + utils.JS.stringify(routeJSON, null, 4));
    }
}

async function getMetaData(viewInfo: vfs.View, baseViewInfo?: ViewInfo | vfs.View) {
    let instance;
    let meta = {};
    if (viewInfo.viewType === 'entry') {
        instance = new EntryMetaData();
        meta = await instance.getMetaData(viewInfo);
    } else if(viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue') {
        instance = new PageMetaData();
        meta = await instance.getMetaData(viewInfo, baseViewInfo);
    }
    Object.assign(viewInfo, meta);
    return viewInfo;
}

export async function saveMetaData(viewInfo: ViewInfo | vfs.View, params: AddParams, baseViewInfo?: vfs.View){
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    let instance;
    if (view.viewType === 'entry') {
        instance = new EntryMetaData();
    } else if(view.viewType === 'branch' || view.viewType === 'vue') {
        instance = new PageMetaData();
    }
    return instance.saveMetaData(view, params, baseViewInfo);
}

/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
export async function loadViews(viewInfo: ViewInfo | vfs.View, baseViewInfo?: ViewInfo | vfs.View) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.open();
    await Promise.all(view.children.map(async (child) => {
        await child.preOpen();
        return await getMetaData(child, baseViewInfo);
    }));
    return view.children;
}

export async function loadAllViews(viewInfo: ViewInfo | vfs.View) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.open();

    if (view.children) {
        await Promise.all(view.children.map(async (child) => {
            await child.open();
            await getMetaData(child);
            await loadAllViews(child);
        }));
    }

    return view;
}

/**
 * 获取页面内容
 * @param viewInfo 父页面的信息
 */
export async function getViewContent(viewInfo: ViewInfo | vfs.View) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.preOpen();
    const vueFile = new vfs.VueFile(view.vueFilePath);
    await vueFile.open();
    return vueFile;
}

/**
 * 保存页面内容
 * @param viewInfo 父页面的信息
 * @param content 页面代码内容
 */
export async function saveViewContent(viewInfo: ViewInfo | vfs.View, content: string) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.preOpen();
    return fs.writeFile(view.vueFilePath, content);
}

/**
 * 保存 Vue 局部代码
 * @param fullPath Vue 文件全路径
 * @param type 内容类型
 * @param content 代码内容
 */
export async function saveCode(fullPath: string, type: 'template' | 'script' | 'style', content: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    if (type === 'template')
        vueFile.template = content;
    else if (type === 'script')
        vueFile.script = content;
    else if (type === 'style')
        vueFile.style = content;

    await vueFile.save();
}

export async function mergeCode(fullPath: string, content: string | vfs.VueFile, nodePath?: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();
    vueFile.parseAll();

    const blockVue = typeof content === 'string' ? vfs.VueFile.from(content) : content;
    blockVue.parseAll();
    vueFile.merge(blockVue, nodePath);
    await vueFile.save();
}

export function findRouteObjectAndParentArray(objectExpression: babel.types.ObjectExpression, relativePath: string | Array<string>, createChildrenArrayIfNeeded: boolean = false, pos: number = 0): {
    routeObject: babel.types.ObjectExpression,
    parentArray: babel.types.ArrayExpression,
} {
    const arr  = Array.isArray(relativePath) ? relativePath : relativePath.split('/');
    if (arr[pos] === 'views')
        pos++;

    if (pos === arr.length)
        throw new Error('Route path error. Cannot find route: ' + arr.join('/'));

    const ext = path.extname(arr[arr.length - 1]);
    const nextName =  arr[pos].replace(/\.[^.]*?$/, '');
    let childrenProperty = objectExpression.properties.find((property) => property.type === 'ObjectProperty'
        && property.key.type === 'Identifier' && property.key.name === 'children') as babel.types.ObjectProperty;
    if (!childrenProperty) {
        if (createChildrenArrayIfNeeded) {
            childrenProperty = babel.types.objectProperty(babel.types.identifier('children'), babel.types.arrayExpression([]));
            objectExpression.properties.push(childrenProperty);
        } else
            return { routeObject: undefined, parentArray: undefined };
    }

    const arrayExpression = childrenProperty.value as babel.types.ArrayExpression;
    const routeObject = arrayExpression.elements.find((element) => {
        return ((element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty'
             && property.key.type === 'Identifier' && property.key.name === 'path'
             && property.value.type === 'StringLiteral' && property.value.value === nextName))
            || (element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty'
                && property.key.type === 'Identifier' && property.key.name === 'component'
                && property.value.type === 'ArrowFunctionExpression'
                && ((property.value.body as babel.types.CallExpression).arguments[0] as babel.types.StringLiteral).value === './' + arr.slice(0, pos + 1).join('/') + (arr[pos].endsWith(ext) ? '' : '/index' + ext)))
        );
    }) as babel.types.ObjectExpression;

    if (pos === arr.length - 1) {
        return { routeObject, parentArray: arrayExpression };
    } else {
        if (!routeObject)
            return { routeObject: undefined, parentArray: undefined };
        else
            return findRouteObjectAndParentArray(routeObject, arr, createChildrenArrayIfNeeded, pos + 1);
    }
}

export async function addLeafViewRoute(parent: vfs.View, baseView: vfs.View, params: AddParams) {
    const routesPath = path.join(baseView.fullPath, 'routes.js');
    const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
    if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
        return;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name + params.ext)).replace(/\\/g, '/');
    let changed = false;
    const exportDefault = $js.export().default();
    if (exportDefault.is('object')) {
        const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

        if (parentArray && !routeObject) {
            const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${baseView.baseName}' */ './${relativePath}'),
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
            }]`, {
                filename: 'file.js',
                plugins: [require('@babel/plugin-syntax-dynamic-import')]
            }) as babel.types.File;

            const element = ((tpl.program.body[0] as babel.types.ExpressionStatement).expression as babel.types.ArrayExpression).elements[0] as babel.types.ObjectExpression;
            parentArray.elements.push(element);
            changed = true;
        }
    }
    if (changed)
        await jsFile.save();

    return;
}

export async function addLeafView(parent: vfs.View, params: AddParams): Promise<string>;
export async function addLeafView(parent: vfs.View, baseView: vfs.View, params: AddParams): Promise<string>;
export async function addLeafView(parentInfo: ViewInfo, baseViewInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addLeafView(parentInfo: ViewInfo | vfs.View, baseViewInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let baseView: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = baseViewInfo as AddParams;
        baseView = parent;
        while (baseView && baseView.viewType !== vfs.ViewType.entry)
            baseView = baseView.parent;
        if (!baseView)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : await initView(baseViewInfo as ViewInfo);
        await parent.preOpen();
        await baseView.preOpen();
    }
    params.ext = params.ext || '.vue';

    // parent view 必然是个目录
    const dest = path.join(parent.fullPath, parent.viewsPath, params.name + params.ext);

    let tplPath;
    if (params.ext === '.vue')
        tplPath = path.resolve(__dirname, '../../templates/leaf-view.vue');
    else if (params.ext === '.md')
        tplPath = path.resolve(__dirname, '../../templates/leaf-view.md');
    await fs.copy(tplPath, dest);

    if (params.layout)
        await initViewLayout(dest, params.layout);

    if (baseView) {
        await addLeafViewRoute(parent, baseView, params);

        if (hasNewParams(params)) {
            await saveMetaData({
                fullPath: dest,
                viewType: params.ext === '.vue' ? vfs.ViewType.vue : vfs.ViewType.md,
                routePath: parent.routePath + params.name,
            }, params, baseView);
        } else {
            await ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
        }
    }

    return dest;
}

export async function addBranchViewRoute(parent: vfs.View, baseView: vfs.View, params: AddParams) {
    const routesPath = path.join(baseView.fullPath, 'routes.js');
    const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
    if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
        return;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    // 纯目录，不带 /index.vue 的
    const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
    let changed = false;
    const exportDefault = $js.export().default();
    if (exportDefault.is('object')) {
        const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

        if (parentArray && !routeObject) {
            const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${baseView.baseName}' */ './${relativePath + '/index' + params.ext}'),
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
                children: [],
            }]`, {
                filename: 'file.js',
                plugins: [require('@babel/plugin-syntax-dynamic-import')]
            }) as babel.types.File;

            const element = ((tpl.program.body[0] as babel.types.ExpressionStatement).expression as babel.types.ArrayExpression).elements[0] as babel.types.ObjectExpression;
            parentArray.elements.push(element);
            changed = true;
        }
    }
    if (changed)
        await jsFile.save();

    return;
}

export async function addBranchView(parent: vfs.View, params: AddParams): Promise<string>;
export async function addBranchView(parent: vfs.View, baseView: vfs.View, params: AddParams): Promise<string>;
export async function addBranchView(parentInfo: ViewInfo, baseViewInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addBranchView(parentInfo: ViewInfo | vfs.View, baseViewInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let baseView: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = baseViewInfo as AddParams;
        baseView = parent;
        while (baseView && baseView.viewType !== vfs.ViewType.entry)
            baseView = baseView.parent;
        if (!baseView)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : await initView(baseViewInfo as ViewInfo);
        await parent.preOpen();
        await baseView.preOpen();
    }
    params.ext = params.ext || '.vue';

    // parent view 必然是个目录
    const dir = path.join(parent.fullPath, parent.viewsPath, params.name);

    let tplPath;
    if (params.ext === '.vue')
        tplPath = path.resolve(__dirname, '../../templates/branch-view');
    else if (params.ext === '.md')
        tplPath = path.resolve(__dirname, '../../templates/branch-view-md');
    await fs.copy(tplPath, dir);

    const dest = path.join(dir, 'index' + params.ext);
    if (params.layout)
        await initViewLayout(dest, params.layout);

    if (baseView) {
        await addBranchViewRoute(parent, baseView, params);

        if (hasNewParams(params)) {
            await saveMetaData({
                fullPath: dest,
                viewType: vfs.ViewType.branch,
                routePath: parent.routePath + params.name + '/',
            }, params, baseView);
        } else {
            await ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
        }
    }
    return dest;
}

export async function addBranchWrapper(parent: vfs.View, params: AddParams): Promise<string>;
export async function addBranchWrapper(parent: vfs.View, baseView: vfs.View, params: AddParams): Promise<string>;
export async function addBranchWrapper(parentInfo: ViewInfo, baseViewInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addBranchWrapper(parentInfo: ViewInfo | vfs.View, baseViewInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let baseView: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = baseViewInfo as AddParams;
        baseView = parent;
        while (baseView && baseView.viewType !== vfs.ViewType.entry)
            baseView = baseView.parent;
        if (!baseView)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : await initView(baseViewInfo as ViewInfo);
        await parent.preOpen();
        await baseView.preOpen();
    }
    params.ext = params.ext || '.vue';

    // parent view 必然是个目录
    const dir = path.join(parent.fullPath, parent.viewsPath, name);

    const tplPath = path.resolve(__dirname, '../../templates/branch-view');
    await fs.copy(tplPath, dir);

    let dest = path.join(dir, 'index.vue');
    await fs.remove(dest);
    dest = path.dirname(dest);

    const routesPath = path.join(baseView.fullPath, 'routes.js');
    const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
    if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
        return dest;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    let hasImportedLWrapper = false;
    babel.traverse(jsFile.handler.ast, {
        ImportDefaultSpecifier(nodeInfo) {
            if (nodeInfo.node.local.name === 'LWrapper') {
                hasImportedLWrapper = true;
                nodeInfo.stop();
            }
        },
        ImportSpecifier(nodeInfo) {
            if (nodeInfo.node.local.name === 'LWrapper') {
                hasImportedLWrapper = true;
                nodeInfo.stop();
            }
        },
    });
    if (!hasImportedLWrapper) {
        const importDeclaration = babel.template(`import { LWrapper } from 'cloud-ui.vusion'`)() as babel.types.ImportDeclaration;
        jsFile.handler.ast.program.body.unshift(importDeclaration);
    }

    // 纯目录，不带 /index.vue 的
    const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
    let changed = false;
    const exportDefault = $js.export().default();
    if (exportDefault.is('object')) {
        const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

        if (parentArray && !routeObject) {
            const tpl = babel.parse(`[{
                path: '${params.name}',
                component: LWrapper,
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
                children: [],
            }]`, {
                filename: 'file.js',
                plugins: [require('@babel/plugin-syntax-dynamic-import')]
            }) as babel.types.File;

            const element = ((tpl.program.body[0] as babel.types.ExpressionStatement).expression as babel.types.ArrayExpression).elements[0] as babel.types.ObjectExpression;
            parentArray.elements.push(element);
            changed = true;
        }
    }
    if (changed)
        await jsFile.save();

    return dest;
}

/**
 * @TODO remove page metaData
 */
export async function removeView(view: vfs.View): Promise<void>;
export async function removeView(view: vfs.View, baseView: vfs.View): Promise<void>;
export async function removeView(viewInfo: ViewInfo, baseViewInfo: ViewInfo): Promise<void>;
export async function removeView(viewInfo: ViewInfo | vfs.View, baseViewInfo?: ViewInfo | vfs.View) {
    let view: vfs.View;
    let baseView: vfs.View;
    if (!baseViewInfo) {
        view = viewInfo as vfs.View;
        baseView = view;
        while (baseView && baseView.viewType !== vfs.ViewType.entry)
            baseView = baseView.parent;
        if (!baseView)
            return;
    } else {
        view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
        baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : await initView(baseViewInfo as ViewInfo);
        await view.preOpen();
        await baseView.preOpen();
    }

    if (baseView) {
        const routesPath = path.join(baseView.fullPath, 'routes.js');
        const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
        if (fs.existsSync(routesPath) && !fs.existsSync(routesMapPath)) {
            const jsFile = new vfs.JSFile(routesPath);
            await jsFile.open();
            const $js = jsFile.parse();
    
            const relativePath = path.relative(baseView.fullPath, view.fullPath).replace(/\\/g, '/');
            let changed = false;
            const exportDefault = $js.export().default();
            if (exportDefault.is('object')) {
                const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);
    
                if (routeObject) {
                    parentArray.elements.splice(parentArray.elements.indexOf(routeObject), 1);
    
                    // 判断是不是 LWrapper
                    const LWrapper = routeObject.properties.find((property) => property.type === 'ObjectProperty'
                        && property.key.type === 'Identifier' && property.key.name === 'component'
                        && property.value.type === 'Identifier' && property.value.name === 'LWrapper');
                    if (LWrapper) {
                        let wrapperCount = 0;
                        String(jsFile.content).replace(/LWrapper/, () => String(wrapperCount++));
                        if (wrapperCount === 2) {
                            babel.traverse(jsFile.handler.ast, {
                                ImportDefaultSpecifier(nodeInfo) {
                                    if (nodeInfo.node.local.name === 'LWrapper') {
                                        nodeInfo.remove();
                                        nodeInfo.stop();
                                    }
                                },
                                ImportSpecifier(nodeInfo) {
                                    if (nodeInfo.node.local.name === 'LWrapper') {
                                        nodeInfo.remove();
                                        nodeInfo.stop();
                                    }
                                },
                            });
                        }
                    }
    
                    changed = true;
                }
            }
    
            if (changed)
                await jsFile.save();
        }
    }
    
    await fs.remove(view.fullPath);

    if (baseView)
        await ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
}

export interface ParseTypes {
    template?: boolean,
    script?: boolean,
    style?: boolean,
    api?: boolean,
    examples?: boolean,
}

export async function loadExternalLibrary(fullPath: string, parseTypes: ParseTypes = {}) {
    const library = new vfs.Library(fullPath, vfs.LibraryType.external);
    await library.open();
    await Promise.all(library.components.map(async (vueFile) => {
        await vueFile.open();
        if (parseTypes.template)
            vueFile.parseTemplate();
        if (parseTypes.script)
            vueFile.parseScript();
        if (parseTypes.style)
            vueFile.parseStyle();
        if (parseTypes.api)
            vueFile.parseAPI();
        if (parseTypes.examples)
            vueFile.parseExamples();
    }));
    return library;
}

/**
 * 获取服务信息
 */
export async function loadServices(baseViewPath: string) {
     const servicesPath = path.join(baseViewPath, 'services');
     if (!fs.existsSync(servicesPath)) {
        return [];
     }
     const directory = new vfs.Directory(servicesPath);
     await directory.open();
     const tasks = directory.children.filter((item) => item.isDirectory && item.fileName[0] !== '.')
        .map(async (subdir) => {
            const service = new vfs.Service(subdir.fullPath);
            await service.open();
            return service;
        });
     return Promise.all(tasks);
}

/**
 * @deprecated
 * @param fullPath 
 * @param newName 
 * @param name 
 */
export async function addOrRenameService(fullPath: string, newName: string, name: string) {
    if (!name) {
        const dir = path.join(fullPath, 'services', newName);
        let tplPath = path.resolve(__dirname, '../../templates/service');
        await fs.copy(tplPath, dir);
        return path.join(dir, 'api.json');
    } else {
        const oldPath = path.join(fullPath, 'services', name);
        const newPath = path.join(fullPath, 'services', newName);
        await fs.rename(oldPath, newPath);
        return path.join(newPath, 'api.json');
    }
}

export async function saveService(serviceInfo: vfs.Service) {
    const service = new vfs.Service(serviceInfo.fullPath);
    await service.open();
    Object.assign(service, serviceInfo);
    await service.save();
}

export async function removeService(fullPath: string) {
    await fs.remove(fullPath);
    await ensureHotReload(path.join(fullPath, '../index.js'));
}

/**
 * 区块的复杂程度类型
 */
const enum BlockComplexity {
    onlyTemplate, // Just add
    hasScriptOrStyle, // Can merge
    hasAssetsOrExtra, // Must external
}

/**
 * 组件或区块信息
 */
interface BlockInfo {
    name: string,
    title: string,
    tagName: string,
    dependencies: { [name: string]: string },
    vusionDependencies: { [name: string]: string },
    registry: string,
    uuid?: string,
}

/**
 * 替换占位符内容
 * @param fullPath 文件路径
 * @param blockInfo 组件或区块信息
 * @param content 要替换的内容
 */
async function replacePlaceholder(fullPath: string, blockInfo: BlockInfo, content: string | vfs.VueFile){
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.forceOpen();
    vueFile.parseAll();

    let progressArray: any[] = [];
    vueFile.templateHandler.traverse((nodeInfo) => {
        const node = nodeInfo.node as compiler.ASTElement;
        if (node.tag === 'd-progress' && node.attrsMap.uuid === blockInfo.uuid){
            progressArray.push(nodeInfo.route);
            nodeInfo.remove();
        }
    });
    const blockVue = typeof content === 'string' ? vfs.VueFile.from(content) : content;
    blockVue.parseAll();
    progressArray.forEach((route)=>{
        vueFile.merge(blockVue, route);
    });
    await vueFile.save();
}

/**
 * 在有其它代码或 Assets 的情况下，直接添加为外部区块
 */
async function external(fullPath: string, blockInfo: BlockInfo, blockVue: vfs.VueFile) {
    if(!fs.existsSync(path.join(fullPath.replace(/\.vue$/, '.blocks'), blockInfo.tagName + '.vue'))){
        await vms.addBlockExternally(blockVue, fullPath, blockInfo.tagName);
    } else {
        const vueFile = new vfs.VueFile(fullPath);
        await vueFile.open();
        /* 添加 import */
        const relativePath = `./${vueFile.baseName}.blocks/${blockInfo.tagName}.vue`;
        const { componentName } = utils.normalizeName(blockInfo.tagName);
        const $js = vueFile.parseScript();
        
        const components = $js.export().default().object().get('components');
        if (!components || !components.get(componentName)) {
            $js.import(componentName).from(relativePath);
            $js.export().default().object()
                .after(['el','name','parent','functional','delimiters','comments'])
                .ensure('components', '{}')
                .get('components')
                .set(componentName, componentName);

            await vueFile.save();
        }   
    }
    const content = `<template><${blockInfo.tagName}></${blockInfo.tagName}></template>`;
    await replacePlaceholder(fullPath, blockInfo, content);
}

/**
 * 添加区块
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export async function addBlock(fullPath: string, blockInfo: BlockInfo){
    const options = {
        source: {
            type: 'file',
            registry: blockInfo.registry,
            name: blockInfo.name,
            fileName: blockInfo.tagName + '.vue',
            baseName: blockInfo.tagName,
        },
        target: fullPath,
        name: blockInfo.tagName,
    };
    const blockPath = await vms.fetchBlock(options);
    let blockVue: vfs.VueFile;
    blockVue = new vfs.VueFile(blockPath.replace(/\.vue@.+$/, '.vue'));
    blockVue.fullPath = blockPath;
    await blockVue.open();

    // 区块的复杂程度
    let blockComplexity: BlockComplexity;
    if (blockVue.hasAssets() || blockVue.hasExtra())
        blockComplexity = BlockComplexity.hasAssetsOrExtra;
    else if (blockVue.hasScript(true) || blockVue.hasStyle(true))
        blockComplexity = BlockComplexity.hasScriptOrStyle;
    else
        blockComplexity = BlockComplexity.onlyTemplate;

    if (blockComplexity === BlockComplexity.hasAssetsOrExtra) {
        return await external(fullPath, blockInfo, blockVue);
    }else{
        return await replacePlaceholder(fullPath, blockInfo, blockVue);
    }
}

/**
 * 添加业务组件
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export async function addCustomComponent(fullPath: string, libraryPath: string, blockInfo: BlockInfo, content: string) {
    const library = new vfs.Library(libraryPath, vfs.LibraryType.internal);
    await library.open();
    const indexFile = library.componentsIndexFile;
    if(indexFile){
        await indexFile.forceOpen();
        const $js = indexFile.parse();
        $js.export('*').from(blockInfo.name);
        await indexFile.save();
    }

    await replacePlaceholder(fullPath, blockInfo, content);
}

export async function loadPackageJSON(rootPath: string) {
    const pkgPath = path.resolve(rootPath, 'package.json');
    if(!fs.existsSync(pkgPath))
        return {};
    return JSON.parse(await fs.readFile(pkgPath, 'utf8'));
}

/**
 * 获取单个控件信息
 * @param fullPath 控件路径
 * @param parseTypes 需要获取的信息
 */
export async function loadComponentData(fullPath: string, parseTypes: ParseTypes = {}){
    if(!fs.existsSync(fullPath))
        return {};
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();
    if (parseTypes.template)
        vueFile.parseTemplate();
    if (parseTypes.script)
        vueFile.parseScript();
    if (parseTypes.style)
        vueFile.parseStyle();
    if (parseTypes.api)
        vueFile.parseAPI();
    if (parseTypes.examples)
        vueFile.parseExamples();
    return vueFile;
}

/**
 * 获取自定义组件信息，packages.json中有的组件，并且是以.vue结尾
 * @param rootPath package.json所在的目录路径
 * @param parseTypes 需要获取的信息
 * @param baseName 组件信息，有该信息则获取该组件信息
 */
export async function loadCustomComponentsData(rootPath: string, parseTypes: ParseTypes = {}, baseName?: string){
    const pkg = await loadPackageJSON(rootPath);
    const pkgDeps = pkg.dependencies || {};
    const components = Object.keys(pkgDeps).filter((name) => {
        if(baseName)
            return name.includes(baseName + '.vue');
        else
            return name.endsWith('.vue');
    });
    const tasks = components.map(async (name)=> await loadComponentData(`${rootPath}/node_modules/${name}`, parseTypes));
    const datas = await Promise.all(tasks);
    return datas;
}

export async function addAuthCache(name: string, filePath: string) {
    await fs.ensureFile(filePath);

    let json: any = {};
    try {
        json = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch(e) {}

    json[name] = true;
    await fs.writeFile(filePath, JSON.stringify(json, null, 4));
}

export async function removeAuthCache(name: string, filePath: string) {
    await fs.ensureFile(filePath);

    let json: any = {};
    try {
        json = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch(e) {}

    delete json[name];
    await fs.writeFile(filePath, JSON.stringify(json, null, 4));
}
export async function loadAuthCache(filePath: string) {
    try {
        return JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch(e) {
        return {};
    }
}