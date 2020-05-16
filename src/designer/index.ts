import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from '@babel/core';
import * as vfs from '../fs';
import * as compiler from 'vue-template-compiler';

export async function addLayout(fullPath: string, route: string, type: string) {
    const vueFile = new vfs.VueFile(fullPath);
    await vueFile.open();

    vueFile.parseTemplate();

    let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
    let tpl = await fs.readFile(tplPath, 'utf8');
    tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
    const rootEl = vueFile.templateHandler.ast;
    const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl) as compiler.ASTElement;
    selectedEl.children.push(compiler.compile(tpl).ast);

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
}

async function initView(viewInfo: ViewInfo) {
    const isDirectory = !(viewInfo.viewType === vfs.ViewType.vue || viewInfo.viewType === vfs.ViewType.md);
    return new vfs.View(viewInfo.fullPath, viewInfo.viewType, isDirectory, viewInfo.routePath);
}

/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
export async function loadViews(viewInfo: ViewInfo | vfs.View) {
    const view = viewInfo instanceof vfs.View ? viewInfo : await initView(viewInfo);
    await view.open();
    await Promise.all(view.children.map((child) => child.preOpen()));
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
