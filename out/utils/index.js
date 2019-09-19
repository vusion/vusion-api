"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebab2Camel = (name) => name.replace(/(?:^|-)([a-zA-Z0-9])/g, (m, $1) => $1.toUpperCase());
exports.Camel2kebab = (name) => name.replace(/([A-Z]|[0-9]+)/g, (m, $1, offset) => (offset ? '-' : '') + $1.toLowerCase());
//# sourceMappingURL=index.js.map