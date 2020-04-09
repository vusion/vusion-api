import { spawn, spawnSync } from 'child_process';
import * as logger from './logger';

/**
 * 使用 spawnSync inherit，直接打印 stdio
 */
export const execSync = (...args: Array<string | Array<string>>) => {
    const command = [].concat(args).join(' ');
    const result = spawnSync(command, { shell: true, stdio: 'inherit' });
    if (result.status) {
        logger.error(String(result.stderr || result.stdout));
        process.exit(1);
    }
};

/**
 * 使用 spawn inherit，直接打印 stdio
 */
export const exec = (...args: Array<string | Array<string>>) => {
    const command = [].concat(args).join(' ');

    return new Promise(((resolve, reject) => {
        const result = spawn(command, { shell: true, stdio: 'inherit' });
        result.on('error', reject);
        result.on('close', (code) => code === 0 ? resolve() : reject());
    }));
};
