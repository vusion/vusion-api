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
exports.loadPackageJSON = exports.addCustomComponent = exports.removeBlock = exports.addBlock = exports.removeServiceApis = exports.addServiceApis = exports.saveServiceApis = exports.loadServiceApis = exports.loadExternalLibrary = exports.removeView = exports.addBranchWrapper = exports.addBranchView = exports.addBranchViewRoute = exports.addLeafView = exports.addLeafViewRoute = exports.findRouteObjectAndParentArray = exports.mergeCode = exports.saveCode = exports.saveViewContent = exports.getViewContent = exports.loadViews = exports.saveMetaData = exports.saveFile = exports.addCode = exports.initLayout = exports.addLayout = void 0;
const path = require("path");
const fs = require("fs-extra");
const babel = require("@babel/core");
const vfs = require("../fs");
const vms = require("../ms");
const compiler = require("vue-template-compiler");
const javascript_stringify_1 = require("javascript-stringify");
const utils = require("../utils");
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
function js2json(data) {
    const content = data.trim().replace(/export default |module\.exports +=/, '');
    let json;
    try {
        json = eval('(function(){return ' + content + '})()');
    }
    catch (e) {
    }
    return json;
}
class EntryMetaData {
    getMetaData(viewInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            const index = fullPath.indexOf('src');
            const pageJsonPath = path.join(fullPath.slice(0, index), 'pages.json');
            const data = {
                title: '',
            };
            if (fs.existsSync(pageJsonPath)) {
                const pageJsonFile = yield fs.readFile(pageJsonPath, 'utf8');
                const pageJson = JSON.parse(pageJsonFile);
                data.title = pageJson[viewInfo.baseName] && pageJson[viewInfo.baseName].title;
            }
            return data;
        });
    }
    saveMetaData(viewInfo, params, moduleInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            const index = fullPath.indexOf('src');
            const pageJsonPath = path.join(fullPath.slice(0, index), 'pages.json');
            if (fs.existsSync(pageJsonPath)) {
                const pageJsonFile = yield fs.readFile(pageJsonPath, 'utf8');
                const pageJson = JSON.parse(pageJsonFile);
                if (pageJson[viewInfo.baseName])
                    Object.assign(pageJson[viewInfo.baseName], params);
                const file = new vfs.File(pageJsonPath);
                file.content = JSON.stringify(pageJson, null, 4);
                return file.save();
            }
            return 'success';
        });
    }
}
class ModuleMetaData {
    getMetaData(viewInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            const baseJsPath = path.join(fullPath, 'module', 'base.js');
            const data = {
                title: '',
            };
            if (fs.existsSync(baseJsPath)) {
                const baseJs = yield fs.readFile(baseJsPath, 'utf8');
                let baseJsJson = js2json(baseJs);
                if (baseJsJson && baseJsJson.sidebar && baseJsJson.sidebar.title) {
                    data.title = baseJsJson.sidebar.title;
                }
            }
            return data;
        });
    }
    saveMetaData(viewInfo, params, moduleInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = viewInfo.fullPath;
            const baseJsPath = path.join(fullPath, 'module', 'base.js');
            if (fs.existsSync(baseJsPath)) {
                const baseJs = yield fs.readFile(baseJsPath, 'utf8');
                let baseJsJson = js2json(baseJs);
                if (baseJsJson && baseJsJson.sidebar) {
                    Object.assign(baseJsJson.sidebar, params);
                }
                else {
                    baseJsJson.sidebar = Object.assign({}, params);
                }
                const file = new vfs.File(baseJsPath);
                file.content = 'export default ' + javascript_stringify_1.stringify(baseJsJson, null, 4);
                return file.save();
            }
            return 'success';
        });
    }
}
class PageMetaData {
    getMetaData(viewInfo, moduleInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!moduleInfo)
                return {};
            const modulePath = moduleInfo.fullPath;
            const routePath = path.join(modulePath, 'routes.map.js');
            const data = {
                title: '',
                routeMeta: {},
            };
            if (fs.existsSync(routePath)) {
                const routeData = yield fs.readFile(routePath, 'utf8');
                let reouteJson = js2json(routeData);
                let currentPath = viewInfo.routePath.replace(moduleInfo.routePath, '');
                if (viewInfo.viewType === 'branch') {
                    currentPath = currentPath.slice(0, currentPath.length - 1);
                }
                if (reouteJson[currentPath] && reouteJson[currentPath].meta && reouteJson[currentPath].meta.title) {
                    data.title = reouteJson[currentPath].meta.title;
                }
                data.routeMeta = reouteJson[currentPath];
            }
            return data;
        });
    }
    saveMetaData(viewInfo, params, moduleInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!moduleInfo)
                return {};
            const modulePath = moduleInfo.fullPath;
            const routePath = path.join(modulePath, 'routes.map.js');
            if (fs.existsSync(routePath)) {
                const routeData = yield fs.readFile(routePath, 'utf8');
                let reouteJson = js2json(routeData);
                let currentPath = viewInfo.routePath.replace(moduleInfo.routePath, '');
                if (viewInfo.viewType === 'branch') {
                    currentPath = currentPath.slice(0, currentPath.length - 1);
                }
                if (reouteJson[currentPath] && reouteJson[currentPath].meta && reouteJson[currentPath].meta.title) {
                    Object.assign(reouteJson[currentPath].meta, params);
                    const file = new vfs.File(routePath);
                    file.content = 'export default ' + javascript_stringify_1.stringify(reouteJson, null, 4);
                    return file.save();
                }
            }
            return 'success';
        });
    }
}
function getMetaData(viewInfo, moduleInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let instance;
        let meta = {};
        if (viewInfo.viewType === 'entry') {
            instance = new EntryMetaData();
            meta = yield instance.getMetaData(viewInfo);
        }
        if (viewInfo.viewType === 'module') {
            instance = new ModuleMetaData();
            meta = yield instance.getMetaData(viewInfo);
        }
        if (viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue') {
            instance = new PageMetaData();
            meta = yield instance.getMetaData(viewInfo, moduleInfo);
        }
        Object.assign(viewInfo, meta);
        return viewInfo;
    });
}
function saveMetaData(viewInfo, params, moduleInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let instance;
        if (viewInfo.viewType === 'entry') {
            instance = new EntryMetaData();
        }
        if (viewInfo.viewType === 'module') {
            instance = new ModuleMetaData();
        }
        if (viewInfo.viewType === 'branch' || viewInfo.viewType === 'vue') {
            instance = new PageMetaData();
        }
        return instance.saveMetaData(viewInfo, params, moduleInfo);
    });
}
exports.saveMetaData = saveMetaData;
/**
 * 获取页面列表
 * @param viewInfo 父页面的信息
 */
function loadViews(viewInfo, moduleInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = viewInfo instanceof vfs.View ? viewInfo : yield initView(viewInfo);
        yield view.open();
        yield Promise.all(view.children.map((child) => __awaiter(this, void 0, void 0, function* () {
            yield child.preOpen();
            return yield getMetaData(child, moduleInfo);
        })));
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
        if (params.layout)
            yield initLayout(dest, params.layout);
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
        if (params.layout)
            yield initLayout(dest, params.layout);
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
/**
 * 获取接口信息
 */
function loadServiceApis(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const servicePath = path.join(fullPath, 'service');
        if (!fs.existsSync(servicePath))
            return {};
        const directory = new vfs.Directory(servicePath);
        yield directory.forceOpen();
        const tasks = directory.children.filter((item) => {
            if (item.isDirectory) {
                item.fullPath = path.join(item.fullPath, 'api.json');
            }
            return item.fullPath.endsWith('.json');
        }).map((item) => __awaiter(this, void 0, void 0, function* () {
            const apis = yield fs.readFile(item.fullPath, 'utf8');
            return {
                filePath: item.fullPath,
                serviceName: item.isDirectory ? item.baseName : 'default',
                apis: JSON.parse(apis),
            };
        }));
        return Promise.all(tasks);
    });
}
exports.loadServiceApis = loadServiceApis;
function saveServiceApis(services) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasks = services.map((item) => {
            const file = new vfs.File(item.filePath);
            file.content = JSON.stringify(item.apis, null, 4);
            return file.save();
        });
        yield Promise.all(tasks);
    });
}
exports.saveServiceApis = saveServiceApis;
function addServiceApis(fullPath, newName, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name) {
            const dir = path.join(fullPath, 'service', newName);
            let tplPath = path.resolve(__dirname, '../../templates/service');
            yield fs.copy(tplPath, dir);
            return path.join(dir, 'api.json');
        }
        else {
            const oldPath = path.join(fullPath, 'service', name);
            const newPath = path.join(fullPath, 'service', newName);
            yield fs.rename(oldPath, newPath);
            return path.join(newPath, 'api.json');
        }
    });
}
exports.addServiceApis = addServiceApis;
function removeServiceApis(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileNames = yield fs.readdir(fullPath);
        const tasks = fileNames.map((name) => __awaiter(this, void 0, void 0, function* () {
            return yield fs.remove(path.join(fullPath, name));
        }));
        Promise.all(tasks).then(() => {
            fs.rmdirSync(fullPath);
        });
    });
}
exports.removeServiceApis = removeServiceApis;
/**
 * 删除占位符
 * @param fullPath 文件路径
 * @param blockInfo 组件或区块信息
 */
function removePlaceholder(fullPath, blockInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const vueFile = new vfs.VueFile(fullPath);
        yield vueFile.forceOpen();
        vueFile.parseTemplate();
        vueFile.templateHandler.traverse((nodeInfo) => {
            const node = nodeInfo.node;
            if (node.tag === 'd-progress' && node.attrsMap.uuid === blockInfo.uuid) {
                nodeInfo.remove();
            }
        });
        yield vueFile.save();
    });
}
/**
 * 在有其它代码或 Assets 的情况下，直接添加为外部区块
 */
function external(fullPath, block, blockVue, nodePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(path.join(fullPath.replace(/\.vue$/, '.blocks'), block.tagName + '.vue'))) {
            yield vms.addBlockExternally(blockVue, fullPath, block.tagName);
        }
        else {
            const vueFile = new vfs.VueFile(fullPath);
            yield vueFile.open();
            /* 添加 import */
            const relativePath = `./${vueFile.baseName}.blocks/${block.tagName}.vue`;
            const { componentName } = utils.normalizeName(block.tagName);
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
        const content = `<template><${block.tagName}></${block.tagName}></template>`;
        yield mergeCode(fullPath, content, nodePath);
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
function addBlock(fullPath, blockInfo, nodePath) {
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
        // 删除占位符
        yield removePlaceholder(fullPath, blockInfo);
        if (blockComplexity === 2 /* hasAssetsOrExtra */) {
            return yield external(fullPath, blockInfo, blockVue, nodePath);
        }
        else {
            return yield mergeCode(fullPath, blockVue, nodePath);
        }
    });
}
exports.addBlock = addBlock;
function removeBlock(fullPath, blockInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vms.removeBlock(fullPath, blockInfo.tagName);
    });
}
exports.removeBlock = removeBlock;
/**
 * 添加业务组件
 * @param fullPath 文件路径
 * @param libraryPath 全局组件路径，components/index.js所在路径
 * @param blockInfo 组件或区块信息
 * @param tpl 组件代码字符串
 * @param nodePath 节点路径
 */
function addCustomComponent(fullPath, libraryPath, blockInfo, tpl, nodePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // 删除占位符
        yield removePlaceholder(fullPath, blockInfo);
        const library = new vfs.Library(libraryPath, vfs.LibraryType.internal);
        yield library.open();
        const indexFile = library.componentsIndexFile;
        if (indexFile) {
            yield indexFile.forceOpen();
            const $js = indexFile.parse();
            $js.export('*').from(blockInfo.name);
            yield indexFile.save();
        }
        yield mergeCode(fullPath, tpl, nodePath);
    });
}
exports.addCustomComponent = addCustomComponent;
function loadPackageJSON(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return JSON.parse(yield fs.readFile(path.resolve(rootPath, 'package.json'), 'utf8'));
    });
}
exports.loadPackageJSON = loadPackageJSON;
//# sourceMappingURL=index.js.map