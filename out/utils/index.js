"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());
exports.Camel2kebab = (name) => name.replace(/([A-Z])/g, (m, $1, offset) => (offset ? '-' : '') + $1.toLowerCase());
//# sourceMappingURL=index.js.map