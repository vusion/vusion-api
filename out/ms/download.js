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
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const compressing = require("compressing");
const axios_1 = require("axios");
const shell = require("shelljs");
/**
 * 下载 NPM 包，默认以 package@version 的文件名命名
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param dir For example: ./blocks
 * @param name If you want to rename. Defaults to package@version
 * @param clearExisting
 */
function npm(info, dir, name, clearExisting) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: pkgInfo } = yield axios_1.default.get(`${info.registry}/${info.name}/${info.version || 'latest'}`);
        name = name || pkgInfo.name.replace(/\//, '__') + '@' + pkgInfo.version;
        const dest = path.join(dir, name);
        if (fs.existsSync(dest)) {
            if (clearExisting)
                fs.removeSync(dest);
            else
                return dest;
        }
        const tgzURL = pkgInfo.dist.tarball;
        const response = yield axios_1.default.get(tgzURL, {
            responseType: 'stream',
        });
        const temp = path.resolve(os.tmpdir(), name + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
        yield compressing.tgz.uncompress(response.data, temp);
        yield fs.move(path.join(temp, 'package'), dest);
        fs.removeSync(temp);
        // fs.removeSync(path.resolve(dest, 'screenshots'));
        // fs.removeSync(path.resolve(dest, 'public'));
        // fs.removeSync(path.resolve(dest, 'docs'));
        // fs.removeSync(path.resolve(dest, 'package.json'));
        // fs.removeSync(path.resolve(dest, 'README.md'));
        return dest;
    });
}
exports.npm = npm;
/**
 * 下载 Git 仓库
 * @param info.url For example: https://registry.npm.taobao.org
 * @param info.branch For example: dev
 * @param dest For example: ./blocks/xxx
 * @param clearExisting
 */
function git(info, dest, clearExisting, keepGit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
            if (clearExisting)
                fs.removeSync(dest);
            else
                return dest;
        }
        const result = shell.exec(`git clone -b ${info.branch || 'master'} --depth 1 ${info.url} "${dest}"`, {
            silent: true,
        });
        if (result.code) {
            throw result.stderr;
        }
        else {
            if (!keepGit)
                fs.removeSync(`${dest}/.git`);
            return dest;
        }
    });
}
exports.git = git;
//# sourceMappingURL=download.js.map