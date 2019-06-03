import * as fs from 'fs-extra';
import * as path from 'path';

function handleSame(dirPath: string, basename: string = 'u-sample') {
    let dest = path.resolve(dirPath, `${basename}.vue`);
    let count = 1;
    while (fs.existsSync(dest))
        dest = path.resolve(dirPath, `${basename}-${count++}.vue`);

    return dest;
}

export function createSingleFile(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../../templates/u-single-file.vue'), handleSame(dirPath));
}

export function createMultiFile(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../../templates/u-multi-file.vue'), handleSame(dirPath))
}

export function createMultiFileWithSubdocs(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../../templates/u-multi-file-with-subdocs.vue'), handleSame(dirPath))
}

export function createPage(dirPath: string) {
    return fs.copy(path.resolve(__dirname, '../../templates/page.vue'), handleSame(dirPath))
}
