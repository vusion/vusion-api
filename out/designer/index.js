"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
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
exports.loadAuthCache = exports.removeAuthCache = exports.addAuthCache = exports.loadCustomComponentsData = exports.loadComponentData = exports.loadPackageJSON = exports.addCustomComponent = exports.addBlock = exports.removeService = exports.saveService = exports.addOrRenameService = exports.loadServices = exports.loadExternalLibrary = exports.removeView = exports.addBranchWrapper = exports.addBranchView = exports.addBranchViewRoute = exports.addLeafView = exports.addLeafViewRoute = exports.findRouteObjectAndParentArray = exports.mergeCode = exports.saveCode = exports.saveViewContent = exports.getViewContent = exports.loadAllViews = exports.loadViews = exports.saveMetaData = exports.ensureHotReload = exports.saveFile = exports.openFile = exports.addCode = exports.initLayout = exports.addLayout = void 0;
const path = require("path");
const fs = require("fs-extra");
const babel = require("@babel/core");
const vfs = require("../fs");
const vms = require("../ms");
const compiler = require("vue-template-compiler");
const utils = require("../utils");
__exportStar(require("./nuims"), exports);
function addLayout(fullPath, nodePath, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '') + '\n';
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByNodePath(nodePath, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addLayout = addLayout;
/**
 * 添加页面时初始化布局
 * @param fullPath Vue 文件路径
 * @param type 布局类型
 */
function initLayout(fullPath, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s*/, '').replace(/\s*<\/template>\s*$/, '') + '\n';
        if (type.startsWith('grid-'))
            tpl = `<u-grid-layout>${tpl}</u-grid-layout>\n`;
        vueFile.template = tpl;
        yield vueFile.save();
    });
}
exports.initLayout = initLayout;
/**
 * 添加页面时初始化布局
 * @param fullPath Vue 文件路径
 * @param type 布局类型
 */
function initViewLayout(fullPath, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        let tplPath = path.resolve(__dirname, `../../snippets/${type}.vue`);
        let tpl = yield fs.readFile(tplPath, 'utf8');
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '') + '\n';
        const rootEl = vueFile.templateHandler.ast;
        rootEl.children.unshift(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
function addCode(fullPath, nodePath, tpl) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseTemplate();
        tpl = tpl.replace(/^<template>\s+/, '').replace(/\s+<\/template>$/, '');
        const rootEl = vueFile.templateHandler.ast;
        const selectedEl = vueFile.templateHandler.findByNodePath(nodePath, rootEl);
        selectedEl.children.push(compiler.compile(tpl).ast);
        yield vueFile.save();
    });
}
exports.addCode = addCode;
function openFile(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.readFile(fullPath, 'utf8');
    });
}
exports.openFile = openFile;
function saveFile(fullPath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.writeFile(fullPath, content);
    });
}
exports.saveFile = saveFile;
function ensureHotReload(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(fullPath))
            return;
        return fs.writeFile(fullPath, yield fs.readFile(fullPath, 'utf8'));
    });
}
exports.ensureHotReload = ensureHotReload;
function hasNewParams(params) {
    return !!(params.title || params.crumb || params.first);
}
function initView(viewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const isDirectory = !(viewInfo.viewType === vfs.ViewType.vue || viewInfo.viewType === vfs.ViewType.md);
        return new vfs.View(viewInfo.fullPath, viewInfo.viewType, isDirectory, viewInfo.routePath);
    });
}
class EntryMetaData {
    getMetaData(viewInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            // @TODO?
            const index = fullPath.indexOf('src');
            const pagesJSONPath = path.join(fullPath.slice(0, index), 'pages.json');
            const data = {
                title: '',
            };
            if (!fs.existsSync(pagesJSONPath))
                throw new Error('Cannot find pagesJSONPath');
            const pagesJSON = JSON.parse(yield fs.readFile(pagesJSONPath, 'utf8'));
            data.title = pagesJSON[viewInfo.baseName] && pagesJSON[viewInfo.baseName].title;
            return data;
        });
    }
    saveMetaData(viewInfo, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            const index = fullPath.indexOf('src');
            const pagesJSONPath = path.join(fullPath.slice(0, index), 'pages.json');
            if (!fs.existsSync(pagesJSONPath))
                throw new Error('Cannot find pagesJSONPath');
            const pagesJSON = JSON.parse(yield fs.readFile(pagesJSONPath, 'utf8'));
            if (pagesJSON[viewInfo.baseName])
                Object.assign(pagesJSON[viewInfo.baseName], params);
            return fs.writeFile(pagesJSONPath, JSON.stringify(pagesJSON, null, 4));
        });
    }
}
class PageMetaData {
    getMetaData(viewInfo, baseViewInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!baseViewInfo)
                return {};
            const baseViewPath = baseViewInfo.fullPath;
            const routePath = path.join(baseViewPath, 'routes.map.js');
            const data = {
                title: '',
                first: false,
                meta: {},
            };
            if (fs.existsSync(routePath)) {
                let routeJSON = utils.JS.parse(yield fs.readFile(routePath, 'utf8'));
                let currentPath = viewInfo.routePath.replace(baseViewInfo.routePath, '').replace(/\/$/, '');
                if (routeJSON[currentPath]) {
                    data.meta = routeJSON[currentPath].meta;
                    data.title = data.meta && routeJSON[currentPath].meta.title;
                }
            }
            return data;
        });
    }
    saveMetaData(viewInfo, params, baseViewInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!baseViewInfo)
                return {};
            const baseViewPath = baseViewInfo.fullPath;
            const routePath = path.join(baseViewPath, 'routes.map.js');
            let routeJSON = {};
            if (fs.existsSync(routePath))
                routeJSON = utils.JS.parse(yield fs.readFile(routePath, 'utf8'));
            let currentPath = viewInfo.routePath.replace(baseViewInfo.routePath, '').replace(/\/$/, '');
            if (!routeJSON[currentPath])
                routeJSON[currentPath] = {};
            routeJSON[currentPath].meta = Object.assign(routeJSON[currentPath].meta || {});
            routeJSON[currentPath].meta.title = params.title;
            routeJSON[currentPath].meta.crumb = params.crumb || '';
            if (params.first !== undefined)
                routeJSON[currentPath].first = params.first;
            return fs.writeFile(routePath, 'export default ' + utils.JS.stringify(routeJSON, null, 4));
        });
    }
}
function getMetaData(viewInfo, baseViewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let instance;
        let meta = {};
        if (viewInfo.viewType === 'entry') {
            instance = new EntryMetaData();
            meta = yield instance.getMetaData(viewInfo);
        }
        else if (viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue') {
            instance = new PageMetaData();
            meta = yield instance.getMetaData(viewInfo, baseViewInfo);
        }
        Object.assign(viewInfo, meta);
        return viewInfo;
    });
}
function saveMetaData(viewInfo, params, baseViewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        let instance;
        if (view.viewType === 'entry') {
            instance = new EntryMetaData();
        }
        else if (view.viewType === 'branch' || view.viewType === 'vue') {
            instance = new PageMetaData();
        }
        return instance.saveMetaData(view, params, baseViewInfo);
    });
}
exports.saveMetaData = saveMetaData;
/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
function loadViews(viewInfo, baseViewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.open();
        yield Promise.all(view.children.map((child) => __awaiter(this, void 0, void 0, function* () {
            yield child.preOpen();
            return yield getMetaData(child, baseViewInfo);
        })));
        return view.children;
    });
}
exports.loadViews = loadViews;
function loadAllViews(viewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.open();
        if (view.children) {
            yield Promise.all(view.children.map((child) => __awaiter(this, void 0, void 0, function* () {
                yield child.open();
                yield getMetaData(child);
                yield loadAllViews(child);
            })));
        }
        return view;
    });
}
exports.loadAllViews = loadAllViews;
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
function mergeCode(fullPath, content, nodePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.open();
        vueFile.parseAll();
        const blockVue = typeof content === 'string' ? vfs.VueFile.from(content) : content;
        blockVue.parseAll();
        vueFile.merge(blockVue, nodePath);
        yield vueFile.save();
    });
}
exports.mergeCode = mergeCode;
function findRouteObjectAndParentArray(objectExpression, relativePath, createChildrenArrayIfNeeded = false, pos = 0) {
    const arr = Array.isArray(relativePath) ? relativePath : relativePath.split('/');
    if (arr[pos] === 'views')
        pos++;
    if (pos === arr.length)
        throw new Error('Route path error. Cannot find route: ' + arr.join('/'));
    const ext = path.extname(arr[arr.length - 1]);
    const nextName = arr[pos].replace(/\.[^.]*?$/, '');
    let childrenProperty = objectExpression.properties.find((property) => property.type === 'ObjectProperty'
        && property.key.type === 'Identifier' && property.key.name === 'children');
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
        return ((element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty'
            && property.key.type === 'Identifier' && property.key.name === 'path'
            && property.value.type === 'StringLiteral' && property.value.value === nextName))
            || (element.type === 'ObjectExpression' && element.properties.some((property) => property.type === 'ObjectProperty'
                && property.key.type === 'Identifier' && property.key.name === 'component'
                && property.value.type === 'ArrowFunctionExpression'
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
function addLeafViewRoute(parent, baseView, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const routesPath = path.join(baseView.fullPath, 'routes.js');
        const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
        if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        const $js = jsFile.parse();
        const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name + params.ext)).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
            if (parentArray && !routeObject) {
                const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${baseView.baseName}' */ './${relativePath}'),
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
function addLeafView(parentInfo, baseViewInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let baseView;
        if (!params) {
            parent = parentInfo;
            params = baseViewInfo;
            baseView = parent;
            while (baseView && baseView.viewType !== vfs.ViewType.entry)
                baseView = baseView.parent;
            if (!baseView)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : yield initView(baseViewInfo);
            yield parent.preOpen();
            yield baseView.preOpen();
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
        if (params.layout)
            yield initViewLayout(dest, params.layout);
        if (baseView) {
            yield addLeafViewRoute(parent, baseView, params);
            if (hasNewParams(params)) {
                yield saveMetaData({
                    fullPath: dest,
                    viewType: params.ext === '.vue' ? vfs.ViewType.vue : vfs.ViewType.md,
                    routePath: parent.routePath + params.name,
                }, params, baseView);
            }
            else {
                yield ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
            }
        }
        return dest;
    });
}
exports.addLeafView = addLeafView;
function addBranchViewRoute(parent, baseView, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const routesPath = path.join(baseView.fullPath, 'routes.js');
        const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
        if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
            return;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
        const $js = jsFile.parse();
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
        let changed = false;
        const exportDefault = $js.export().default();
        if (exportDefault.is('object')) {
            const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
            if (parentArray && !routeObject) {
                const tpl = babel.parse(`[{
                path: '${params.name}',
                component: () => import(/* webpackChunkName: '${baseView.baseName}' */ './${relativePath + '/index' + params.ext}'),
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
function addBranchView(parentInfo, baseViewInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let baseView;
        if (!params) {
            parent = parentInfo;
            params = baseViewInfo;
            baseView = parent;
            while (baseView && baseView.viewType !== vfs.ViewType.entry)
                baseView = baseView.parent;
            if (!baseView)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : yield initView(baseViewInfo);
            yield parent.preOpen();
            yield baseView.preOpen();
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
        if (params.layout)
            yield initViewLayout(dest, params.layout);
        if (baseView) {
            yield addBranchViewRoute(parent, baseView, params);
            if (hasNewParams(params)) {
                yield saveMetaData({
                    fullPath: dest,
                    viewType: vfs.ViewType.branch,
                    routePath: parent.routePath + params.name + '/',
                }, params, baseView);
            }
            else {
                yield ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
            }
        }
        return dest;
    });
}
exports.addBranchView = addBranchView;
function addBranchWrapper(parentInfo, baseViewInfo, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let parent;
        let baseView;
        if (!params) {
            parent = parentInfo;
            params = baseViewInfo;
            baseView = parent;
            while (baseView && baseView.viewType !== vfs.ViewType.entry)
                baseView = baseView.parent;
            if (!baseView)
                return;
        }
        else {
            parent = parentInfo instanceof vfs.View ? parentInfo : yield initView(parentInfo);
            baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : yield initView(baseViewInfo);
            yield parent.preOpen();
            yield baseView.preOpen();
        }
        params.ext = params.ext || '.vue';
        // parent view 必然是个目录
        const dir = path.join(parent.fullPath, parent.viewsPath, name);
        const tplPath = path.resolve(__dirname, '../../templates/branch-view');
        yield fs.copy(tplPath, dir);
        let dest = path.join(dir, 'index.vue');
        yield fs.remove(dest);
        dest = path.dirname(dest);
        const routesPath = path.join(baseView.fullPath, 'routes.js');
        const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
        if (!fs.existsSync(routesPath) || fs.existsSync(routesMapPath))
            return dest;
        const jsFile = new vfs.JSFile(routesPath);
        yield jsFile.open();
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
            const importDeclaration = babel.template(`import { LWrapper } from 'cloud-ui.vusion'`)();
            jsFile.handler.ast.program.body.unshift(importDeclaration);
        }
        // 纯目录，不带 /index.vue 的
        const relativePath = path.relative(baseView.fullPath, path.join(parent.fullPath, parent.viewsPath, params.name)).replace(/\\/g, '/');
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
function removeView(viewInfo, baseViewInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let view;
        let baseView;
        if (!baseViewInfo) {
            view = viewInfo;
            baseView = view;
            while (baseView && baseView.viewType !== vfs.ViewType.entry)
                baseView = baseView.parent;
            if (!baseView)
                return;
        }
        else {
            view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
            baseView = baseViewInfo instanceof vfs.View ? baseViewInfo : yield initView(baseViewInfo);
            yield view.preOpen();
            yield baseView.preOpen();
        }
        if (baseView) {
            const routesPath = path.join(baseView.fullPath, 'routes.js');
            const routesMapPath = path.join(baseView.fullPath, 'routes.map.js');
            if (fs.existsSync(routesPath) && !fs.existsSync(routesMapPath)) {
                const jsFile = new vfs.JSFile(routesPath);
                yield jsFile.open();
                const $js = jsFile.parse();
                const relativePath = path.relative(baseView.fullPath, view.fullPath).replace(/\\/g, '/');
                let changed = false;
                const exportDefault = $js.export().default();
                if (exportDefault.is('object')) {
                    const { routeObject, parentArray } = findRouteObjectAndParentArray(exportDefault.node, relativePath, true);
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
                    yield jsFile.save();
            }
        }
        yield fs.remove(view.fullPath);
        if (baseView)
            yield ensureHotReload(path.join(baseView.fullPath, 'routes.map.js'));
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
/**
 * 获取服务信息
 */
function loadServices(baseViewPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const servicesPath = path.join(baseViewPath, 'services');
        if (!fs.existsSync(servicesPath)) {
            return [];
        }
        const directory = new vfs.Directory(servicesPath);
        yield directory.open();
        const tasks = directory.children.filter((item) => item.isDirectory && item.fileName[0] !== '.')
            .map((subdir) => __awaiter(this, void 0, void 0, function* () {
            const service = new vfs.Service(subdir.fullPath);
            yield service.open();
            return service;
        }));
        return Promise.all(tasks);
    });
}
exports.loadServices = loadServices;
/**
 * @deprecated
 * @param fullPath
 * @param newName
 * @param name
 */
function addOrRenameService(fullPath, newName, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name) {
            const dir = path.join(fullPath, 'services', newName);
            let tplPath = path.resolve(__dirname, '../../templates/service');
            yield fs.copy(tplPath, dir);
            return path.join(dir, 'api.json');
        }
        else {
            const oldPath = path.join(fullPath, 'services', name);
            const newPath = path.join(fullPath, 'services', newName);
            yield fs.rename(oldPath, newPath);
            return path.join(newPath, 'api.json');
        }
    });
}
exports.addOrRenameService = addOrRenameService;
function saveService(serviceInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = new vfs.Service(serviceInfo.fullPath);
        yield service.open();
        Object.assign(service, serviceInfo);
        yield service.save();
    });
}
exports.saveService = saveService;
function removeService(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.remove(fullPath);
        yield ensureHotReload(path.join(fullPath, '../index.js'));
    });
}
exports.removeService = removeService;
/**
 * 替换占位符内容
 * @param fullPath 文件路径
 * @param blockInfo 组件或区块信息
 * @param content 要替换的内容
 */
function replacePlaceholder(fullPath, blockInfo, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.forceOpen();
        vueFile.parseAll();
        let progressArray = [];
        vueFile.templateHandler.traverse((nodeInfo) => {
            const node = nodeInfo.node;
            if (node.tag === 'd-progress' && node.attrsMap.uuid === blockInfo.uuid) {
                progressArray.push(nodeInfo.route);
                nodeInfo.remove();
            }
        });
        const blockVue = typeof content === 'string' ? vfs.VueFile.from(content) : content;
        blockVue.parseAll();
        progressArray.forEach((route) => {
            vueFile.merge(blockVue, route);
        });
        yield vueFile.save();
    });
}
/**
 * 在有其它代码或 Assets 的情况下，直接添加为外部区块
 */
function external(fullPath, blockInfo, blockVue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(path.join(fullPath.replace(/\.vue$/, '.blocks'), blockInfo.tagName + '.vue'))) {
            yield vms.addBlockExternally(blockVue, fullPath, blockInfo.tagName);
        }
        else {
            const vueFile = new vfs.VueFile(fullPath);
            yield vueFile.open();
            /* 添加 import */
            const relativePath = `./${vueFile.baseName}.blocks/${blockInfo.tagName}.vue`;
            const { componentName } = utils.normalizeName(blockInfo.tagName);
            const $js = vueFile.parseScript();
            const components = $js.export().default().object().get('components');
            if (!components || !components.get(componentName)) {
                $js.import(componentName).from(relativePath);
                $js.export().default().object()
                    .after(['el', 'name', 'parent', 'functional', 'delimiters', 'comments'])
                    .ensure('components', '{}')
                    .get('components')
                    .set(componentName, componentName);
                yield vueFile.save();
            }
        }
        const content = `<template><${blockInfo.tagName}></${blockInfo.tagName}></template>`;
        yield replacePlaceholder(fullPath, blockInfo, content);
    });
}
/**
 * 添加区块
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
function addBlock(fullPath, blockInfo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const blockPath = yield vms.fetchBlock(options);
        let blockVue;
        blockVue = new vfs.VueFile(blockPath.replace(/\.vue@.+$/, '.vue'));
        blockVue.fullPath = blockPath;
        yield blockVue.open();
        // 区块的复杂程度
        let blockComplexity;
        if (blockVue.hasAssets() || blockVue.hasExtra())
            blockComplexity = 2 /* hasAssetsOrExtra */;
        else if (blockVue.hasScript(true) || blockVue.hasStyle(true))
            blockComplexity = 1 /* hasScriptOrStyle */;
        else
            blockComplexity = 0 /* onlyTemplate */;
        if (blockComplexity === 2 /* hasAssetsOrExtra */) {
            return yield external(fullPath, blockInfo, blockVue);
        }
        else {
            return yield replacePlaceholder(fullPath, blockInfo, blockVue);
        }
    });
}
exports.addBlock = addBlock;
/**
 * 添加业务组件
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
function addCustomComponent(fullPath, libraryPath, blockInfo, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const library = new vfs.Library(libraryPath, vfs.LibraryType.internal);
        yield library.open();
        const indexFile = library.componentsIndexFile;
        if (indexFile) {
            yield indexFile.forceOpen();
            const $js = indexFile.parse();
            $js.export('*').from(blockInfo.name);
            yield indexFile.save();
        }
        yield replacePlaceholder(fullPath, blockInfo, content);
    });
}
exports.addCustomComponent = addCustomComponent;
function loadPackageJSON(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgPath = path.resolve(rootPath, 'package.json');
        if (!fs.existsSync(pkgPath))
            return {};
        return JSON.parse(yield fs.readFile(pkgPath, 'utf8'));
    });
}
exports.loadPackageJSON = loadPackageJSON;
/**
 * 获取单个控件信息
 * @param fullPath 控件路径
 * @param parseTypes 需要获取的信息
 */
function loadComponentData(fullPath, parseTypes = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(fullPath))
            return {};
        const vueFile = new vfs.VueFile(fullPath);
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
        return vueFile;
    });
}
exports.loadComponentData = loadComponentData;
/**
 * 获取自定义组件信息，packages.json中有的组件，并且是以.vue结尾
 * @param rootPath package.json所在的目录路径
 * @param parseTypes 需要获取的信息
 * @param baseName 组件信息，有该信息则获取该组件信息
 */
function loadCustomComponentsData(rootPath, parseTypes = {}, baseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkg = yield loadPackageJSON(rootPath);
        const pkgDeps = pkg.dependencies || {};
        const components = Object.keys(pkgDeps).filter((name) => {
            if (baseName)
                return name.includes(baseName + '.vue');
            else
                return name.endsWith('.vue');
        });
        const tasks = components.map((name) => __awaiter(this, void 0, void 0, function* () { return yield loadComponentData(`${rootPath}/node_modules/${name}`, parseTypes); }));
        const datas = yield Promise.all(tasks);
        return datas;
    });
}
exports.loadCustomComponentsData = loadCustomComponentsData;
function addAuthCache(name, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.ensureFile(filePath);
        let json = {};
        try {
            json = JSON.parse(yield fs.readFile(filePath, 'utf8'));
        }
        catch (e) { }
        json[name] = true;
        yield fs.writeFile(filePath, JSON.stringify(json, null, 4));
    });
}
exports.addAuthCache = addAuthCache;
function removeAuthCache(name, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.ensureFile(filePath);
        let json = {};
        try {
            json = JSON.parse(yield fs.readFile(filePath, 'utf8'));
        }
        catch (e) { }
        delete json[name];
        yield fs.writeFile(filePath, JSON.stringify(json, null, 4));
    });
}
exports.removeAuthCache = removeAuthCache;
function loadAuthCache(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return JSON.parse(yield fs.readFile(filePath, 'utf8'));
        }
        catch (e) {
            return {};
        }
    });
}
exports.loadAuthCache = loadAuthCache;
//# sourceMappingURL=index.js.map