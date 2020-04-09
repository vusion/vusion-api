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

export const log = (msg: string = '', tag?: string) => {
    tag ? console.info(format(chalkTag(tag), msg)) : console.info(msg);
    _log('log', tag, msg);
};

export const info = (msg: string = '', tag?: string) => {
    console.info(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
};

export const done = (msg: string = '', tag?: string) => {
    console.info(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
};

export const warn = (msg: string = '', tag?: string) => {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
    _log('warn', tag, msg);
};

export const error = (msg: string | Error = '', tag?: string) => {
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(String(msg))));
    _log('error', tag, String(msg));
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
};

export const clearConsole = (title: string) => {
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

// // silent all logs except errors during tests and keep record
// if (process.env.VUSION_TEST) {
//     require('./_silence')('logs', exports);
// }
