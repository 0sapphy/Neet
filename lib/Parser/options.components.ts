/* eslint-disable @typescript-eslint/no-explicit-any */

export function getBoolean(O: any, name: string) {
    return Boolean(O[name]);
}

export function getString(O: any, name: string) {
    return String(O[name]);
}