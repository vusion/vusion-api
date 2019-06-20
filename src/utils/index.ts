export const kebab2Camel = (name: string) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

export const Camel2kebab = (name: string) => name.replace(/([A-Z])/g, (m, $1, offset) => (offset ? '-' : '') + $1.toLowerCase());
