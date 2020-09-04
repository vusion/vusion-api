/// <reference types="node" />
/**
 * 使用 spawnSync 的 shell inherit 模式，直接对接主进程的 stdio
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * @example
 * execSync('rm', '-rf', 'node_modules')
 * execSync('git clone', 'xxx')
 */
export declare function execSync(...args: Array<string>): import("child_process").SpawnSyncReturns<Buffer>;
/**
 * 使用 spawnSync 的 shell inherit 模式，直接对接主进程的 stdio
 * 如果 code 非 0，则直接结束
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * @example
 * execSync('rm', '-rf', 'node_modules')
 * execSync('git clone', 'xxx')
 */
export declare function justExecSync(...args: Array<string>): void;
/**
 * 使用 spawn 的 shell inherit 模式，直接对接主进程的 stdio
 * @param args 命令参数，每一项可以为字符串或是字符串数组
 * await exec('rm', '-rf', 'node_modules')
 * await exec('git clone', 'xxx')
 */
export declare function exec(...args: Array<string>): Promise<unknown>;
