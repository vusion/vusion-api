import * as fs from 'fs-extra';
import * as globby from 'globby';

export async function loadAllServiceAPI(srcPath: string) {
    const services = await Promise.all(globby.sync(srcPath + '/**/services/*/api.json')
        .map(async (jsonPath) => {
            const content = await fs.readFile(jsonPath, 'utf8');
            const arr = jsonPath.split('/');
            const name = arr[arr.length - 2];

            const json = JSON.parse(content);
            Object.keys(json).forEach((key) => {
                if (key.startsWith('__'))
                    delete json[key];
            });
            return { name, json };
        }));

    const result: { [name: string]: any } = {};
    services.forEach((service) => result[service.name] = service.json);
    return result;
}
