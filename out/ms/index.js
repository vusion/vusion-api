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
const babel = require("@babel/core");
const fs = require("fs-extra");
const os = require("os");
const vfs = require("../fs");
const utils = require("../utils");
function getCacheDir(subPath = '') {
    const cacheDir = path.join(os.homedir(), '.vusion', subPath);
    if (!fs.existsSync(cacheDir))
        fs.ensureDirSync(cacheDir);
    return cacheDir;
}
exports.getCacheDir = getCacheDir;
function getRunControl() {
    const rcPath = path.join(os.homedir(), '.vusion');
    return rcPath;
}
exports.getRunControl = getRunControl;
;
var MaterialSourceType;
(function (MaterialSourceType) {
    MaterialSourceType["local"] = "local";
    MaterialSourceType["github"] = "github";
})(MaterialSourceType = exports.MaterialSourceType || (exports.MaterialSourceType = {}));
;
function processOptions(options) {
    const result = {
        source: {
            type: 'file',
            repoName: '',
            path: '',
            name: '',
            version: '',
            commit: '',
        },
        target: options.target,
        name: options.name,
        title: options.title,
    };
    let source = options.source;
    if (source[0] === '.' || source[0] === '~' || source[0] === '/') {
        result.source.type = 'file';
        result.source.path = source;
        result.source.name = path.basename(source);
    }
    else {
        const repoRE = /^\w+:/;
        const cap = repoRE.exec(source);
        if (cap) {
            result.source.type = cap[0].slice(0, -1);
            source = source.slice(cap[0].length);
        }
        else
            result.source.type = 'npm';
        const arr = source.split(':');
        result.source.path = arr[1];
        let repoName = arr[0];
        if (repoName.includes('#')) {
            const arr2 = repoName.split('#');
            result.source.repoName = arr2[0];
            result.source.commit = arr2[1];
        }
        else if (repoName.includes('@')) {
            const arr2 = repoName.split('@');
            result.source.repoName = arr2[0];
            result.source.version = arr2[1];
        }
        else {
            result.source.repoName = repoName;
        }
    }
    return result;
}
exports.processOptions = processOptions;
/**
 * 从业务模板中添加模块
 */
function addModule(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = processOptions(options);
        const moduleCacheDir = getCacheDir('modules');
        yield fs.emptyDir(moduleCacheDir);
        if (opts.source.type === 'file') {
            const temp = path.resolve(moduleCacheDir, opts.source.name + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
            const dest = path.resolve(opts.target, opts.name);
            yield fs.copy(path.resolve(opts.source.path), temp);
            yield vfs.batchReplace(vfs.listAllFiles(moduleCacheDir, {
                type: 'file',
            }), [
                [/sample/g, opts.name],
                [/Sample/g, utils.kebab2Camel(opts.name)],
                [/样本/g, opts.title],
            ]);
            yield fs.move(temp, dest);
            // 修改 modules.order 配置
            const modulesOrderPath = path.resolve(opts.target, 'modules.order.js');
            if (fs.existsSync(modulesOrderPath)) {
                const jsFile = new vfs.JSFile(modulesOrderPath);
                yield jsFile.open();
                jsFile.parse();
                let changed = false;
                babel.traverse(jsFile.handler.ast, {
                    ExportDefaultDeclaration(nodePath) {
                        const declaration = nodePath.node.declaration;
                        if (declaration && declaration.type === 'ArrayExpression') {
                            const element = Object.assign(babel.types.stringLiteral(opts.name), { raw: `'${opts.name}'` });
                            declaration.elements.push(element);
                            changed = true;
                        }
                    }
                });
                if (changed)
                    yield jsFile.save();
            }
        }
    });
}
exports.addModule = addModule;
function removeModule(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const dest = path.resolve(options.target, options.name);
        yield fs.remove(dest);
        // 修改 modules.order 配置
        const modulesOrderPath = path.resolve(options.target, 'modules.order.js');
        if (fs.existsSync(modulesOrderPath)) {
            const jsFile = new vfs.JSFile(modulesOrderPath);
            yield jsFile.open();
            jsFile.parse();
            let changed = false;
            babel.traverse(jsFile.handler.ast, {
                ExportDefaultDeclaration(nodePath) {
                    const declaration = nodePath.node.declaration;
                    if (declaration && declaration.type === 'ArrayExpression') {
                        for (let i = 0; i < declaration.elements.length; i++) {
                            const element = declaration.elements[i];
                            if (element.type === 'StringLiteral' && element.value === options.name) {
                                declaration.elements.splice(i, 1);
                                changed = true;
                                break;
                            }
                        }
                    }
                }
            });
            yield jsFile.save();
        }
    });
}
exports.removeModule = removeModule;
//# sourceMappingURL=index.js.map