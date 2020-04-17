import * as fs from 'fs-extra';
import * as path from 'path';

export async function isFilesSame(newPath: string, oldPath: string, subPath: string = '') {
    newPath = path.resolve(newPath, subPath);
    oldPath = path.resolve(oldPath, subPath);

    const result = (await fs.readFile(newPath, 'utf8')) === (await fs.readFile(oldPath, 'utf8'));
    if (!result)
        console.error(newPath, oldPath);

    return result;
}
