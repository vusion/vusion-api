export { default as FSEntry } from './FSEntry';
export { default as File } from './File';
export { default as Directory } from './Directory';
export { default as VueFile } from './VueFile';
export { default as Library, LibraryType } from './Library';

import * as creator from './creator';
export { creator };

export { resolve as resolveConfig } from './config/resolve';
export { VusionConfig, ResolvePriority } from './config/getDefaults';
