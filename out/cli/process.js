"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.justExecSync = exports.execSync = void 0;
const child_process_1 = require("child_process");
const logger = __importStar(require("./logger"));
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