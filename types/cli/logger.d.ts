/// <reference types="node" />
import * as events from 'events';
export declare const event: events.EventEmitter;
/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export declare function log(msg?: string, tag?: string): void;
/**
 * 打印信息日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export declare function info(msg?: string, tag?: string): void;
/**
 * 打印普通日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export declare function done(msg?: string, tag?: string): void;
/**
 * 打印警告日志
 * @param msg 日志信息
 * @param tag 添加一个灰色标签
 */
export declare function warn(msg?: string, tag?: string): void;
/**
 * 打印错误日志
 * @param msg 日志信息，可以为一个 Error 对象
 * @param tag 添加一个灰色标签
 */
export declare function error(msg?: string | Error, tag?: string): void;
/**
 * 清除控制台
 * @param title 清除后打印一个标题
 */
export declare function clearConsole(title: string): void;
