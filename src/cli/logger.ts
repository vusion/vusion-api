import chalk from 'chalk';
import * as EventEmitter from 'events';
import * as readline from 'readline';

export const events = new EventEmitter();

function _log(type: string, tag: string, message: string) {
    if (process.env.VUSION_API_MODE && message) {
        events.emit('log', {
            message,
            type,
            tag,
        });
    }
}

const format = (label: string, msg: string) => msg.split('\n').map((line, i) => {
    if (i === 0)
        return `${label} ${line}`;
    else
        return (line || '').padStart(chalk.reset(label).length);
}).join('\n');

const chalkTag = (msg: string) => chalk.bgBlackBright.white.dim(` ${msg} `);

/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export function log (msg: string = '', tag?: string) {
    tag ? console.info(format(chalkTag(tag), msg)) : console.info(msg);
    _log('log', tag, msg);
};

/**
 * 打印信息日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export function info (msg: string = '', tag?: string) {
    console.info(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
};

/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export function done (msg: string = '', tag?: string) {
    console.info(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
};

/**
 * 打印警告日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export function warn (msg: string = '', tag?: string) {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
    _log('warn', tag, msg);
};

/**
 * 打印错误日志
 * @param msg 日志信息，可以为一个 Error 对象
 * @param tag 添加一个灰色标签
 */
export function error (msg: string | Error = '', tag?: string) {
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(String(msg))));
    _log('error', tag, String(msg));
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
};

/**
 * 清除控制台
 * @param title 清除后打印一个标题
 */
export function clearConsole (title: string) {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.info(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.info(title);
        }
    }
};
