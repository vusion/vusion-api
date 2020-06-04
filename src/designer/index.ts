import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from '@babel/core';
import * as vfs from '../fs';
import * as vms from '../ms';
import * as compiler from 'vue-template-compiler';
import { stringify } from "javascript-stringify";
import * as utils from '../utils';

export async function addLayout(fullPath: string, route: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '') + '\n';
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

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

export async function addCode(fullPath: string, route: string, tpl: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

    await vueFile.save();
}

export async function saveFile(fullPath: string, content: string) {
    return fs.writeFile(fullPath, content);
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
}

async function initView(viewInfo: ViewInfo) {
    const isDirectory = !(viewInfo.viewType === vfs.ViewType.vue || viewInfo.viewType === vfs.ViewType.md);
    return new vfs.View(viewInfo.fullPath, viewInfo.viewType, isDirectory, viewInfo.routePath);
}

function js2json(data: string){
    const content = data.trim().replace(/export default |module\.exports +=/, '');
    let json;
    try {
        json = eval('(function(){return ' + content + '})()');
    }catch(e) {
    }
    return json;
}
interface MetaData {
    getMetaData(viewInfo: vfs.View, moduleInfo?: ViewInfo|vfs.View): void,
    saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View): void,
}
class EntryMetaData implements MetaData {
    async getMetaData(viewInfo: vfs.View) {
        const fullPath = viewInfo.fullPath;
        const index = fullPath.indexOf('src');
        const pageJsonPath = path.join(fullPath.slice(0, index), 'pages.json');
        const data = {
            title: '',
        }
        if (fs.existsSync(pageJsonPath)){
            const pageJsonFile = await fs.readFile(pageJsonPath, 'utf8');
            const pageJson = JSON.parse(pageJsonFile);
            data.title =  pageJson[viewInfo.baseName] && pageJson[viewInfo.baseName].title;
        }
        return data;
    }
    async saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View) {
        const fullPath = viewInfo.fullPath;
        const index = fullPath.indexOf('src');
        const pageJsonPath = path.join(fullPath.slice(0, index), 'pages.json');
        if (fs.existsSync(pageJsonPath)){
            const pageJsonFile = await fs.readFile(pageJsonPath, 'utf8');
            const pageJson = JSON.parse(pageJsonFile);
            if(pageJson[viewInfo.baseName])
                Object.assign(pageJson[viewInfo.baseName], params);
            const file = new vfs.File(pageJsonPath);
            file.content = JSON.stringify(pageJson, null, 4);
            return file.save();
        }
        return 'success';
    }
}

class ModuleMetaData implements MetaData {
    async getMetaData(viewInfo: vfs.View) {
        const fullPath = viewInfo.fullPath;
        const baseJsPath = path.join(fullPath, 'module', 'base.js');
        const data = {
            title: '',
        }
        if (fs.existsSync(baseJsPath)){
            const baseJs = await fs.readFile(baseJsPath, 'utf8');
            let baseJsJson = js2json(baseJs);
            if(baseJsJson && baseJsJson.sidebar && baseJsJson.sidebar.title){
                data.title = baseJsJson.sidebar.title;
            }
        }
        return data;
    }
    async saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View) {
        const fullPath = viewInfo.fullPath;
        const baseJsPath = path.join(fullPath, 'module', 'base.js');
        if (fs.existsSync(baseJsPath)){
            const baseJs = await fs.readFile(baseJsPath, 'utf8');
            let baseJsJson = js2json(baseJs);
            if(baseJsJson && baseJsJson.sidebar){
                Object.assign(baseJsJson.sidebar, params);
            }else{
                baseJsJson.sidebar = Object.assign({}, params);
            }
            const file = new vfs.File(baseJsPath);
            file.content ='export default '+ stringify(baseJsJson, null, 4);
            return file.save();
        }
        return 'success';
    }
}

class PageMetaData implements MetaData {
    async getMetaData(viewInfo: vfs.View, moduleInfo: ViewInfo|vfs.View) {
        if(!moduleInfo)
            return {};
        const modulePath = moduleInfo.fullPath;
        const routePath = path.join(modulePath, 'routesMap.js');
        const data = {
            title: '',
            routeMeta: {},
        }
        if (fs.existsSync(routePath)){
            const routeData = await fs.readFile(routePath, 'utf8');
            let reouteJson =js2json(routeData);
            let currentPath = viewInfo.routePath.replace(moduleInfo.routePath, '');
            if(viewInfo.viewType === 'branch'){
                currentPath = currentPath.slice(0, currentPath.length - 1);
            }
            if(reouteJson[currentPath] && reouteJson[currentPath].meta && reouteJson[currentPath].meta.title){
                data.title = reouteJson[currentPath].meta.title;
            }
            data.routeMeta = reouteJson[currentPath];
        }
        return data;
    }
    async saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View) {
        if(!moduleInfo)
            return {};
        const modulePath = moduleInfo.fullPath;
        const routePath = path.join(modulePath, 'routesMap.js');
        if (fs.existsSync(routePath)){
            const routeData = await fs.readFile(routePath, 'utf8');
            let reouteJson =js2json(routeData);
            let currentPath = viewInfo.routePath.replace(moduleInfo.routePath, '');
            if(viewInfo.viewType === 'branch'){
                currentPath = currentPath.slice(0, currentPath.length - 1);
            }
            if(reouteJson[currentPath] && reouteJson[currentPath].meta && reouteJson[currentPath].meta.title){
                Object.assign(reouteJson[currentPath].meta, params);
                const file = new vfs.File(routePath);
                file.content ='export default '+ stringify(reouteJson, null, 4);
                return file.save();
            }
        }
        return 'success';
    }
}

async function getMetaData(viewInfo: vfs.View,  moduleInfo: ViewInfo|vfs.View){
    let instance;
    let meta = {};
    if(viewInfo.viewType === 'entry'){
        instance = new EntryMetaData();
        meta = await instance.getMetaData(viewInfo);
    }
    if(viewInfo.viewType === 'module'){
        instance = new ModuleMetaData();
        meta = await instance.getMetaData(viewInfo);
    }
    if(viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue'){
        instance = new PageMetaData();
        meta = await instance.getMetaData(viewInfo, moduleInfo);
    }
    Object.assign(viewInfo, meta);
    return viewInfo;
}

export async function saveMetaData(viewInfo: vfs.View, params: AddParams, moduleInfo?: vfs.View){
    let instance;
    if(viewInfo.viewType === 'entry'){
        instance = new EntryMetaData();
    }
    if(viewInfo.viewType === 'module'){
        instance = new ModuleMetaData();
    }
    if(viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue'){
        instance = new PageMetaData();
    }
    return instance.saveMetaData(viewInfo, params, moduleInfo);
}

/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
export async function loadViews(viewInfo: ViewInfo | vfs.View, moduleInfo?: ViewInfo | vfs.View) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.open();
    await Promise.all(view.children.map(async(child) => {
        await child.preOpen();
        return await getMetaData(child,  moduleInfo);
    }));
    return view.children;
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
    let childrenProperty = objectExpression.properties.find((property) => property.type === 'ObjectProperty' && property.key.name === 'children') as babel.types.ObjectProperty;
    if (!childrenProperty) {
        if (createChildrenArrayIfNeeded) {
            childrenProperty = babel.types.objectProperty(babel.types.identifier('children'), babel.types.arrayExpression([]));
            objectExpression.properties.push(childrenProperty);
        } else
            return { routeObject: undefined, parentArray: undefined };
    }

    const arrayExpression = childrenProperty.value as babel.types.ArrayExpression;
    const routeObject = arrayExpression.elements.find((element) => {
        return ((element.type === 'ObjectExpression' && element.properties.some((property) =>
            property.type === 'ObjectProperty' && property.key.name === 'path' && property.value.type === 'StringLiteral' && property.value.value === nextName))
            || (element.type === 'ObjectExpression' && element.properties.some((property) =>
                property.type === 'ObjectProperty' && property.key.name === 'component' && property.value.type === 'ArrowFunctionExpression'
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

export async function addLeafViewRoute(parent: vfs.View, module: vfs.View, params: AddParams) {
    const routesPath = path.join(module.fullPath, 'routes.js');
    if (!fs.existsSync(routesPath))
        return;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name + params.ext)).replace(/\\/g, '/');
    let changed = false;
    const exportDefault = $js.export().default();
    if (exportDefault.is('object')) {
        const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

        if (parentArray && !routeObject) {
            const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath}'),
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
export async function addLeafView(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export async function addLeafView(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addLeafView(parentInfo: ViewInfo | vfs.View, moduleInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let module: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = moduleInfo as AddParams;
        module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        module = moduleInfo instanceof vfs.View ? moduleInfo : await initView(moduleInfo as ViewInfo);
        await parent.preOpen();
        await module.preOpen();
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
        await initLayout(dest, params.layout);

    if (module)
        await addLeafViewRoute(parent, module, params);

    return dest;
}

export async function addBranchViewRoute(parent: vfs.View, module: vfs.View, params: AddParams) {
    const routesPath = path.join(module.fullPath, 'routes.js');
    if (!fs.existsSync(routesPath))
        return;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    // 纯目录，不带 /index.vue 的
    const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
    let changed = false;
    const exportDefault = $js.export().default();
    if (exportDefault.is('object')) {
        const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

        if (parentArray && !routeObject) {
            const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath + '/index' + params.ext}'),
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
export async function addBranchView(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export async function addBranchView(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addBranchView(parentInfo: ViewInfo | vfs.View, moduleInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let module: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = moduleInfo as AddParams;
        module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        module = moduleInfo instanceof vfs.View ? moduleInfo : await initView(moduleInfo as ViewInfo);
        await parent.preOpen();
        await module.preOpen();
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
        await initLayout(dest, params.layout);

    await addBranchViewRoute(parent, module, params);
    return dest;
}

export async function addBranchWrapper(parent: vfs.View, params: AddParams): Promise<string>;
export async function addBranchWrapper(parent: vfs.View, module: vfs.View, params: AddParams): Promise<string>;
export async function addBranchWrapper(parentInfo: ViewInfo, moduleInfo: ViewInfo, params: AddParams): Promise<string>;
export async function addBranchWrapper(parentInfo: ViewInfo | vfs.View, moduleInfo: ViewInfo | vfs.View | AddParams, params?: AddParams) {
    let parent: vfs.View;
    let module: vfs.View;
    if (!params) {
        parent = parentInfo as vfs.View;
        params = moduleInfo as AddParams;
        module = parent;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
    } else {
        parent = parentInfo instanceof vfs.View ? parentInfo : await initView(parentInfo);
        module = moduleInfo instanceof vfs.View ? moduleInfo : await initView(moduleInfo as ViewInfo);
        await parent.preOpen();
        await module.preOpen();
    }
    params.ext = params.ext || '.vue';

    // parent view 必然是个目录
    const dir = path.join(parent.fullPath, parent.viewsPath, name);

    const tplPath = path.resolve(__dirname, '../../templates/branch-view');
    await fs.copy(tplPath, dir);

    let dest = path.join(dir, 'index.vue');
    await fs.remove(dest);
    dest = path.dirname(dest);

    const routesPath = path.join(module.fullPath, 'routes.js');
    if (!fs.existsSync(routesPath))
        return dest;

    const jsFile = new vfs.JSFile(routesPath);
    await jsFile.open();
    const $js = jsFile.parse();

    let hasImportedLWrapper = false;
    babel.traverse(jsFile.handler.ast, {
        ImportDefaultSpecifier(nodePath) {
            if (nodePath.node.local.name === 'LWrapper') {
                hasImportedLWrapper = true;
                nodePath.stop();
            }
        },
        ImportSpecifier(nodePath) {
            if (nodePath.node.local.name === 'LWrapper') {
                hasImportedLWrapper = true;
                nodePath.stop();
            }
        },
    });
    if (!hasImportedLWrapper) {
        const importDeclaration = babel.template(`import { LWrapper } from 'cloud-ui.vusion'`)() as babel.types.ImportDeclaration;
        jsFile.handler.ast.program.body.unshift(importDeclaration);
    }

    // 纯目录，不带 /index.vue 的
    const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
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

export async function removeView(view: vfs.View): Promise<void>;
export async function removeView(view: vfs.View, module: vfs.View): Promise<void>;
export async function removeView(viewInfo: ViewInfo, moduleInfo: ViewInfo): Promise<void>;
export async function removeView(viewInfo: ViewInfo | vfs.View, moduleInfo?: ViewInfo | vfs.View) {
    let view: vfs.View;
    let module: vfs.View;
    if (!moduleInfo) {
        view = viewInfo as vfs.View;
        module = view;
        while (module && module.viewType !== vfs.ViewType.module)
            module = module.parent;
        if (!module)
            return;
    } else {
        view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
        module = moduleInfo instanceof vfs.View ? moduleInfo : await initView(moduleInfo as ViewInfo);
        await view.preOpen();
        await module.preOpen();
    }

    if (module) {
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return;

        const jsFile = new vfs.JSFile(routesPath);
        await jsFile.open();
        const $js = jsFile.parse();

        const relativePath = path.relative(module.fullPath, view.fullPath).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node as babel.types.ObjectExpression, relativePath, true);

            if (routeObject) {
                parentArray.elements.splice(parentArray.elements.indexOf(routeObject), 1);

                // 判断是不是 LWrapper
                const LWrapper = routeObject.properties.find((property) => property.type === 'ObjectProperty' && property.key.name === 'component' && property.value.type === 'Identifier' && property.value.name === 'LWrapper');
                if (LWrapper) {
                    let wrapperCount = 0;
                    String(jsFile.content).replace(/LWrapper/, () => String(wrapperCount++));
                    if (wrapperCount === 2) {
                        babel.traverse(jsFile.handler.ast, {
                            ImportDefaultSpecifier(nodePath) {
                                if (nodePath.node.local.name === 'LWrapper') {
                                    nodePath.remove();
                                    nodePath.stop();
                                }
                            },
                            ImportSpecifier(nodePath) {
                                if (nodePath.node.local.name === 'LWrapper') {
                                    nodePath.remove();
                                    nodePath.stop();
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

    await fs.remove(view.fullPath);
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
 * 获取接口信息
 */
export async function loadServiceApis(fullPath: string) {
     const servicePath = path.join(fullPath, 'service');
     if (!fs.existsSync(servicePath))
            return {};
     const directory = new vfs.Directory(servicePath);
     await directory.forceOpen();
     const tasks = directory.children.filter((item)=>{
         if(item.isDirectory){
            item.fullPath = path.join(item.fullPath, 'api.json');
         }
         return item.fullPath.endsWith('.json');
     }).map(async (item)=>{
        const apis = await fs.readFile(item.fullPath, 'utf8');
        return {
            filePath: item.fullPath, 
            serviceName: item.isDirectory? item.baseName : 'default', 
            apis: JSON.parse(apis),
        };
     });
     return Promise.all(tasks);
}

export async function saveServiceApis(services: any[]) {
    const tasks = services.map((item)=>{
        const file = new vfs.File(item.filePath);
        file.content = JSON.stringify(item.apis, null, 4);
        return file.save();
    });
    await Promise.all(tasks);
}

export async function addServiceApis(fullPath: string, newName: string, name: string) {
    if(!name){
        const dir = path.join(fullPath, 'service', newName);
        let tplPath = path.resolve(__dirname, '../../templates/service');
        await fs.copy(tplPath, dir);
        return path.join(dir, 'api.json');
    }else{
        const oldPath = path.join(fullPath, 'service', name);
        const newPath = path.join(fullPath, 'service', newName);
        await fs.rename(oldPath, newPath);
        return path.join(newPath, 'api.json');
    }
}

export async function removeServiceApis(fullPath: string) {
    const fileNames = await fs.readdir(fullPath);
    const tasks = fileNames.map(async (name) =>{
        return await fs.remove(path.join(fullPath, name));
    })
    Promise.all(tasks).then(()=>{
        fs.rmdirSync(fullPath);
    });
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
    dependencies: any,
    registry: string,
    uuid?: string,
}

/**
 * 删除占位符
 * @param fullPath 文件路径
 * @param blockInfo 组件或区块信息
 */
async function removePlaceholder(fullPath: string, blockInfo: BlockInfo) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.forceOpen();

    vueFile.parseTemplate();
    vueFile.templateHandler.traverse((nodePath) => {
        const node = nodePath.node as compiler.ASTElement;
        if (node.tag === 'd-progress' && node.attrsMap.uuid === blockInfo.uuid){
            nodePath.remove();
        }
    });
    await vueFile.save();
}

/**
 * 在有其它代码或 Assets 的情况下，直接添加为外部区块
 */
async function external(fullPath: string, block: BlockInfo, blockVue: vfs.VueFile, nodePath: string) {
    if(!fs.existsSync(path.join(fullPath.replace(/\.vue$/, '.blocks'), block.tagName + '.vue'))){
        await vms.addBlockExternally(blockVue, fullPath, block.tagName);
    } else {
        const vueFile = new vfs.VueFile(fullPath);
        await vueFile.open();
        /* 添加 import */
        const relativePath = `./${vueFile.baseName}.blocks/${block.tagName}.vue`;
        const { componentName } = utils.normalizeName(block.tagName);
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
    const content = `<template><${block.tagName}></${block.tagName}></template>`;
    await mergeCode(fullPath, content, nodePath);
}

/**
 * 添加区块
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export async function addBlock(fullPath: string, blockInfo: BlockInfo, nodePath?: string){
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

    // 删除占位符
    await removePlaceholder(fullPath, blockInfo);

    if (blockComplexity === BlockComplexity.hasAssetsOrExtra) {
        return await external(fullPath, blockInfo, blockVue, nodePath);
    }else{
        return await mergeCode(fullPath, blockVue, nodePath);
    }
}

export async function removeBlock(fullPath: string, blockInfo: BlockInfo) {
    return await vms.removeBlock(fullPath, blockInfo.tagName);
}

/**
 * 添加业务组件
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
export async function addCustom(fullPath: string, libraryPath: string, blockInfo: BlockInfo, tpl: string, nodePath: string) {
    // 删除占位符
    await removePlaceholder(fullPath, blockInfo);

    const library = new vfs.Library(libraryPath, vfs.LibraryType.internal);
    await library.open();
    const indexFile = library.componentsIndexFile;
    if(indexFile){
        await indexFile.forceOpen();
        const $js = indexFile.parse();
        $js.export('*').from(blockInfo.name);
        await indexFile.save();
    }

    await mergeCode(fullPath, tpl, nodePath);
}

export async function loadPackageJson(rootPath: string) {
    const pkg = JSON.parse(await fs.readFile(path.resolve(rootPath, 'package.json'), 'utf8'));
    return pkg;
}