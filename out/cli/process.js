"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logger = require("./logger");
/**
 * 使用 spawnSync inherit，直接打印 stdio
 */
exports.execSync = (...args) => {
    const command = [].concat(args).join(' ');
    const result = child_process_1.spawnSync(command, { shell: true, stdio: 'inherit' });
    if (result.status) {
        logger.error(String(result.stderr || result.stdout));
        process.exit(1);
    }
};
/**
 * 使用 spawn inherit，直接打印 stdio
 */
exports.exec = (...args) => {
    const command = [].concat(args).join(' ');
    return new Promise(((resolve, reject) => {
        const result = child_process_1.spawn(command, { shell: true, stdio: 'inherit' });
        result.on('error', reject);
        result.on('close', (code) => code === 0 ? resolve() : reject());
    }));
};
//# sourceMappingURL=process.js.map