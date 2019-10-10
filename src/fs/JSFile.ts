import File from './File';
import ScriptHandler from './ScriptHandler';

export default class JSFile extends File {
    handler: ScriptHandler;
    parse() {
        if (this.handler)
            return;

        this.handler = new ScriptHandler(String(this.content));
    }

    close() {
        this.handler = undefined;
        this.isOpen = false;
    }

    async save() {
        if (this.handler)
            this.content = this.handler.generate();

        return super.save();
    }

    static fetch(fullPath: string) {
        return super.fetch(fullPath) as JSFile;
    }
}
