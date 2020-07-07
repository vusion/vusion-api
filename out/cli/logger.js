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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearConsole = exports.error = exports.warn = exports.done = exports.info = exports.log = exports.event = void 0;
const chalk_1 = __importDefault(require("chalk"));
const events = __importStar(require("events"));
const readline = __importStar(require("readline"));
exports.event = new events.EventEmitter();
function _log(type, tag, message) {
    if (process.env.VUSION_API_MODE && message) {
        exports.event.emit('log', {
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
/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
function log(msg = '', tag) {
    tag ? console.info(format(chalkTag(tag), msg)) : console.info(msg);
    _log('log', tag, msg);
}
exports.log = log;
;
/**
 * 打印信息日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
function info(msg = '', tag) {
    console.info(format(chalk_1.default.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
}
exports.info = info;
;
/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
function done(msg = '', tag) {
    console.info(format(chalk_1.default.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
}
exports.done = done;
;
/**
 * 打印警告日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
function warn(msg = '', tag) {
    console.warn(format(chalk_1.default.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk_1.default.yellow(msg)));
    _log('warn', tag, msg);
}
exports.warn = warn;
;
/**
 * 打印错误日志
 * @param msg 日志信息，可以为一个 Error 对象
 * @param tag 添加一个灰色标签
 */
function error(msg = '', tag) {
    console.error(format(chalk_1.default.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk_1.default.red(String(msg))));
    _log('error', tag, String(msg));
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
}
exports.error = error;
;
/**
 * 清除控制台
 * @param title 清除后打印一个标题
 */
function clearConsole(title) {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.info(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.info(title);
        }
    }
}
exports.clearConsole = clearConsole;
;
//# sourceMappingURL=logger.js.map