"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const EventEmitter = require("events");
const readline = require("readline");
exports.events = new EventEmitter();
function _log(type, tag, message) {
    if (process.env.VUSION_API_MODE && message) {
        exports.events.emit('log', {
            message,
            type,
            tag,
        });
    }
}
const format = (label, msg) => msg.split('\n').map((line, i) => {
    if (i === 0)
        return `${label} ${line}`;
    else
        return (line || '').padStart(chalk_1.default.reset(label).length);
}).join('\n');
const chalkTag = (msg) => chalk_1.default.bgBlackBright.white.dim(` ${msg} `);
exports.log = (msg = '', tag) => {
    tag ? console.info(format(chalkTag(tag), msg)) : console.info(msg);
    _log('log', tag, msg);
};
exports.info = (msg = '', tag) => {
    console.info(format(chalk_1.default.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
};
exports.done = (msg = '', tag) => {
    console.info(format(chalk_1.default.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
};
exports.warn = (msg = '', tag) => {
    console.warn(format(chalk_1.default.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk_1.default.yellow(msg)));
    _log('warn', tag, msg);
};
exports.error = (msg = '', tag) => {
    console.error(format(chalk_1.default.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk_1.default.red(String(msg))));
    _log('error', tag, String(msg));
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
};
exports.clearConsole = (title) => {
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
//# sourceMappingURL=logger.js.map