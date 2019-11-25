import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as YAML from 'yaml';

const rcPath = path.resolve(os.homedir(), '.vusionrc');

export default {
    rcPath,
    load() {
        if (this.config)
            return this.config;

        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `platform: https://vusion.netease.com
registries:
  npm: https://registry.npmjs.org
download_manager: cnpm
publish_manager: npm
`);
        }

        this.yaml = fs.readFileSync(rcPath, 'utf8');

        this.config = YAML.parse(this.yaml);
        return this.config;
    },
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
};
