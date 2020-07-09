import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as compressing from 'compressing';
import axios, { AxiosInstance } from 'axios';
import * as shell from 'shelljs';

/**
 * 下载 NPM 包，默认以 package@version 的文件名命名
 * @param info.registry For example: https://registry.npm.taobao.org
 * @param info.name Package name. For example: lodash
 * @param info.version For example: lodash
 * @param dir For example: ./blocks
 * @param name If you want to rename. Defaults to package@version
 * @param clearExisting
 */
export async function npm(info: {
    registry?: string, name: string, version?: string,
}, dir: string, name?: string, clearExisting?: boolean) {
    const registry = info.registry || 'https://registry.npmjs.org';
    const version = info.version || 'latest';
    let pkgInfo;
    if (registry === 'https://registry.npmjs.org' && info.name[0] === '@') { // npm 有个 bug 去！！
        const data = (await axios.get(`${registry}/${info.name}`)).data;
        if (data.versions[version])
            pkgInfo = data.versions[version];
        else if (data['dist-tags'][version])
            pkgInfo = data.versions[data['dist-tags'][version]];
        else
            throw new Error(`Cannot find package ${info.name} version ${version}!`);
    } else
        pkgInfo = (await axios.get(`${registry}/${info.name}/${version}`)).data;
    name = name || pkgInfo.name.replace(/\//, '__') + '@' + pkgInfo.version;
    const dest = path.join(dir, name);
    if (fs.existsSync(dest)) {
        if (clearExisting)
            fs.removeSync(dest);
        else
            return dest;
    }

    const tgzURL = pkgInfo.dist.tarball;

    const response = await axios.get(tgzURL, {
        responseType: 'stream',
    });

    const temp = path.resolve(os.homedir(), '.tmp', name + '-' + new Date().toJSON().replace(/[-:TZ]/g, '').slice(0, -4));
    await compressing.tgz.uncompress(response.data, temp);

    await fs.move(path.join(temp, 'package'), dest);
    fs.removeSync(temp);
    // fs.removeSync(path.resolve(dest, 'screenshots'));
    // fs.removeSync(path.resolve(dest, 'public'));
    // fs.removeSync(path.resolve(dest, 'docs'));
    // fs.removeSync(path.resolve(dest, 'package.json'));
    // fs.removeSync(path.resolve(dest, 'README.md'));

    return dest;
}

/**
 * 下载 Git 仓库
 * @param info.url For example: https://registry.npm.taobao.org
 * @param info.branch For example: dev
 * @param dest For example: ./blocks/xxx
 * @param clearExisting
 */
export async function git(info: {
    url: string, branch?: string,
}, dest: string, clearExisting?: boolean, keepGit?: boolean) {
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
    } else {
        if (!keepGit)
            fs.removeSync(`${dest}/.git`);
        return dest;
    }
}
