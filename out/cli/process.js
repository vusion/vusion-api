"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.justExecSync = exports.execSync = void 0;
const child_process_1 = require("child_process");
const logger = require("./logger");
/**
 * 使用 spawnSync 的 shell inherit 模式，直接对接主进程的 stdio
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * @example
 * execSync('rm', '-rf', 'node_modules')
 * execSync('git clone', 'xxx')
 */
function execSync(...args) {
    const command = args.join(' ');
    return child_process_1.spawnSync(command, { shell: true, stdio: 'inherit' });
}
exports.execSync = execSync;
;
/**
 * 使用 spawnSync 的 shell inherit 模式，直接对接主进程的 stdio
 * 如果 code 非 0，则直接结束
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * @example
 * execSync('rm', '-rf', 'node_modules')
 * execSync('git clone', 'xxx')
 */
function justExecSync(...args) {
    const command = args.join(' ');
    const result = child_process_1.spawnSync(command, { shell: true, stdio: 'inherit' });
    if (result.status) {
        logger.error(String(result.stderr || result.stdout));
        process.exit(1);
    }
}
exports.justExecSync = justExecSync;
;
/**
 * 使用 spawn 的 shell inherit 模式，直接对接主进程的 stdio
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * await exec('rm', '-rf', 'node_modules')
 * await exec('git clone', 'xxx')
 */
function exec(...args) {
    const command = args.join(' ');
    return new Promise(((resolve, reject) => {
        const result = child_process_1.spawn(command, { shell: true, stdio: 'inherit' });
        result.on('error', reject);
        result.on('close', (code) => code === 0 ? resolve() : reject());
    }));
}
exports.exec = exec;
;
//# sourceMappingURL=process.js.map