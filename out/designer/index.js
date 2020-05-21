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
const path = require("path");
const fs = require("fs-extra");
const babel = require("@babel/core");
const vfs = require("../fs");
const compiler = require("vue-template-compiler");
function addLayout(fullPath, route, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addLayout = addLayout;
function addCode(fullPath, route, tpl) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByRoute(route, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addCode = addCode;
function saveFile(fullPath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.writeFile(fullPath, content);
    });
}
exports.saveFile = saveFile;
function initView(viewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const isDirectory = !(viewInfo.viewType === vfs.ViewType.vue || viewInfo.viewType === vfs.ViewType.md);
        return new vfs.View(viewInfo.fullPath, viewInfo.viewType, isDirectory, viewInfo.routePath);
    });
}
/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
function loadViews(viewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.open();
        yield Promise.all(view.children.map((child) => child.preOpen()));
        return view.children;
    });
}
exports.loadViews = loadViews;
/**
 * 获取页面内容
 * @param viewInfo 父页面的信息
 */
function getViewContent(viewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.preOpen();
        const vueFile = new vfs.VueFile(view.vueFilePath);
        yield vueFile.open();
        return vueFile;
    });
}
exports.getViewContent = getViewContent;
/**
 * 保存页面内容
 * @param viewInfo 父页面的信息
 * @param content 页面代码内容
 */
function saveViewContent(viewInfo, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.preOpen();
        return fs.writeFile(view.vueFilePath, content);
    });
}
exports.saveViewContent = saveViewContent;
/**
 * 保存 Vue 局部代码
 * @param fullPath Vue 文件全路径
 * @param type 内容类型
 * @param content 代码内容
 */
function saveCode(fullPath, type, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        if (type === 'template')
            vueFile.template = content;
        else if (type === 'script')
            vueFile.script = content;
        else if (type === 'style')
            vueFile.style = content;
        yield vueFile.save();
    });
}
exports.saveCode = saveCode;
function findRouteObjectAndParentArray(objectExpression, relativePath, createChildrenArrayIfNeeded = false, pos = 0) {
    const arr = Array.isArray(relativePath) ? relativePath : relativePath.split('/');
    if (arr[pos] === 'views')
        pos++;
    if (pos === arr.length)
        throw new Error('Route path error. Cannot find route: ' + arr.join('/'));
    const ext = path.extname(arr[arr.length - 1]);
    const nextName = arr[pos].replace(/\.[^.]*?$/, '');
    let childrenProperty = objectExpression.properties.find((property) => property.type === 'ObjectProperty' && property.key.name === 'children');
    if (!childrenProperty) {
        if (createChildrenArrayIfNeeded) {
            childrenProperty = babel.types.objectProperty(babel.types.identifier('children'), babel.types.arrayExpression([]));
            objectExpression.properties.push(childrenProperty);
        }
        else
            return { routeObject: undefined, parentArray: undefined };
    }
    const arrayExpression = childrenProperty.value;
    const routeObject = arrayExpression.elements.find((element) => {
        return ((element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty' && property.key.name === 'path' && property.value.type === 'StringLiteral' && property.value.value === nextName))
            || (element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty' && property.key.name === 'component' && property.value.type === 'ArrowFunctionExpression'
                && property.value.body.arguments[0].value === './' + arr.slice(0, pos + 1).join('/') + (arr[pos].endsWith(ext) ? '' : '/index' + ext))));
    });
    if (pos === arr.length - 1) {
        return { routeObject, parentArray: arrayExpression };
    }
    else {
        if (!routeObject)
            return { routeObject: undefined, parentArray: undefined };
        else
            return findRouteObjectAndParentArray(routeObject, arr, createChildrenArrayIfNeeded, pos + 1);
    }
}
exports.findRouteObjectAndParentArray = findRouteObjectAndParentArray;
function addLeafViewRoute(parent, module, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        const $js = jsFile.parse();
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name + params.ext)).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
            if (parentArray && !routeObject) {
                const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath}'),
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
            }]`, {
                    filename: 'file.js',
                    plugins: [require('@babel/plugin-syntax-dynamic-import')]
                });
                const element = tpl.program.body[0].expression.elements[0];
                parentArray.elements.push(element);
                changed = true;
            }
        }
        if (changed)
            yield jsFile.save();
        return;
    });
}
exports.addLeafViewRoute = addLeafViewRoute;
function addLeafView(parentInfo, moduleInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let module;
        if (!params) {
            parent = parentInfo;
            params = moduleInfo;
            module = parent;
            while (module && module.viewType !== vfs.ViewType.module)
                module = module.parent;
            if (!module)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            module = moduleInfo instanceof vfs.View ? moduleInfo : yield initView(moduleInfo);
            yield parent.preOpen();
            yield module.preOpen();
        }
        params.ext = params.ext || '.vue';
        // parent view 必然是个目录
        const dest = path.join(parent.fullPath, parent.viewsPath, params.name + params.ext);
        let tplPath;
        if (params.ext === '.vue')
            tplPath = path.resolve(__dirname, '../../templates/leaf-view.vue');
        else if (params.ext === '.md')
            tplPath = path.resolve(__dirname, '../../templates/leaf-view.md');
        yield fs.copy(tplPath, dest);
        if (module)
            yield addLeafViewRoute(parent, module, params);
        return dest;
    });
}
exports.addLeafView = addLeafView;
function addBranchViewRoute(parent, module, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        const $js = jsFile.parse();
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
            if (parentArray && !routeObject) {
                const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${module.baseName}' */ './${relativePath + '/index' + params.ext}'),
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
                children: [],
            }]`, {
                    filename: 'file.js',
                    plugins: [require('@babel/plugin-syntax-dynamic-import')]
                });
                const element = tpl.program.body[0].expression.elements[0];
                parentArray.elements.push(element);
                changed = true;
            }
        }
        if (changed)
            yield jsFile.save();
        return;
    });
}
exports.addBranchViewRoute = addBranchViewRoute;
function addBranchView(parentInfo, moduleInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let module;
        if (!params) {
            parent = parentInfo;
            params = moduleInfo;
            module = parent;
            while (module && module.viewType !== vfs.ViewType.module)
                module = module.parent;
            if (!module)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            module = moduleInfo instanceof vfs.View ? moduleInfo : yield initView(moduleInfo);
            yield parent.preOpen();
            yield module.preOpen();
        }
        params.ext = params.ext || '.vue';
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, params.name);
        let tplPath;
        if (params.ext === '.vue')
            tplPath = path.resolve(__dirname, '../../templates/branch-view');
        else if (params.ext === '.md')
            tplPath = path.resolve(__dirname, '../../templates/branch-view-md');
        yield fs.copy(tplPath, dir);
        const dest = path.join(dir, 'index' + params.ext);
        yield addBranchViewRoute(parent, module, params);
        return dest;
    });
}
exports.addBranchView = addBranchView;
function addBranchWrapper(parentInfo, moduleInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let module;
        if (!params) {
            parent = parentInfo;
            params = moduleInfo;
            module = parent;
            while (module && module.viewType !== vfs.ViewType.module)
                module = module.parent;
            if (!module)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            module = moduleInfo instanceof vfs.View ? moduleInfo : yield initView(moduleInfo);
            yield parent.preOpen();
            yield module.preOpen();
        }
        params.ext = params.ext || '.vue';
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, name);
        const tplPath = path.resolve(__dirname, '../../templates/branch-view');
        yield fs.copy(tplPath, dir);
        let dest = path.join(dir, 'index.vue');
        yield fs.remove(dest);
        dest = path.dirname(dest);
        const routesPath = path.join(module.fullPath, 'routes.js');
        if (!fs.existsSync(routesPath))
            return dest;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
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
            const importDeclaration = babel.template(`import { LWrapper } from 'cloud-ui.vusion'`)();
            jsFile.handler.ast.program.body.unshift(importDeclaration);
        }
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(module.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
            if (parentArray && !routeObject) {
                const tpl = babel.parse(`[{
                path: '${params.name}',
                component: LWrapper,
                ${params.title ? "meta: { title: '" + params.title + "' }," : ''}
                children: [],
            }]`, {
                    filename: 'file.js',
                    plugins: [require('@babel/plugin-syntax-dynamic-import')]
                });
                const element = tpl.program.body[0].expression.elements[0];
                parentArray.elements.push(element);
                changed = true;
            }
        }
        if (changed)
            yield jsFile.save();
        return dest;
    });
}
exports.addBranchWrapper = addBranchWrapper;
function removeView(viewInfo, moduleInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let view;
        let module;
        if (!moduleInfo) {
            view = viewInfo;
            module = view;
            while (module && module.viewType !== vfs.ViewType.module)
                module = module.parent;
            if (!module)
                return;
        }
        else {
            view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
            module = moduleInfo instanceof vfs.View ? moduleInfo : yield initView(moduleInfo);
            yield view.preOpen();
            yield module.preOpen();
        }
        if (module) {
            const routesPath = path.join(module.fullPath, 'routes.js');
            if (!fs.existsSync(routesPath))
                return;
            const jsFile = new vfs.JSFile(routesPath);
            yield jsFile.open();
            const $js = jsFile.parse();
            const relativePath = path.relative(module.fullPath, view.fullPath).replace(/\\/g, '/');
            let changed = false;
            const exportDefault = $js.export().default();
            if (exportDefault.is('object')) {
                const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
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
                yield jsFile.save();
        }
        yield fs.remove(view.fullPath);
    });
}
exports.removeView = removeView;
function loadExternalLibrary(fullPath, parseTypes = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const library = new vfs.Library(fullPath, vfs.LibraryType.external);
        yield library.open();
        yield Promise.all(library.components.map((vueFile) => __awaiter(this, void 0, void 0, function* () {
            yield vueFile.open();
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
        })));
        return library;
    });
}
exports.loadExternalLibrary = loadExternalLibrary;
//# sourceMappingURL=index.js.map