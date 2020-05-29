export function uniqueInMap(key: string, map: Map<string, any>, start: number = 1) {
    while (map.has(key))
        key = key.replace(/\d*$/, (m) => String(m === '' ? start : +m + 1));
    return key;
}
