import File from './File';
import ScriptHandler from './ScriptHandler';
export default class JSFile extends File {
    handler: ScriptHandler;
    parse(): ScriptHandler;
    close(): void;
    save(): Promise<void>;
    static fetch(fullPath: string): JSFile;
}
