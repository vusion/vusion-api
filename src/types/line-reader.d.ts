// Type definitions for line-reader
// Project: https://github.com/nickewing/line-reader
// Definitions by: Sam Saint-Pettersen <https://github.com/stpettersens>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface LineReaderOptions {
	separator?: any;
	encoding?: string;
	bufferSize?: number;
}

interface LineReader {
	eachLine(): Function; // For Promise.promisify;
	open(): Function;
	eachLine(file: string, interatee: (line: string, last?: boolean, cb?: Function) => void, then?: (err?: Error) => void): LineReader;
	eachLine(file: string, options: LineReaderOptions, interatee: (line: string, last?: boolean, cb?: Function) => void, then?: (err?: Error) => void): LineReader;
	open(file: string, cb: (err: Error, reader: LineReader) => void): void;
	open(file: string, options: LineReaderOptions, cb: (err: Error, reader: LineReader) => void): void;
	hasNextLine(): boolean;
	nextLine(cb: (err: Error, line: string) => void): void;
	close(cb: (err: Error) => void): void;
}

declare module "line-reader" {
	var lr: LineReader;
	export = lr;
}
