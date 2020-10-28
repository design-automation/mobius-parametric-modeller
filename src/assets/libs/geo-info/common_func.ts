import { EEntType } from './common';

/**
 * Makes a deep clone of map where keys are integers and values are arrays of integers.
 * @param map
 */
export function cloneDeepMapArr(map: Map<number, number[]>): Map<number, number[]> {
    const new_map: Map<number, number[]> = new Map();
    map.forEach( (value, key) => {
        new_map.set(key, value.slice());
    });
    return new_map;
}
/**
 * Used for error messages
 * @param ent_type_str
 */
export function getEntTypeStr(ent_type_str: EEntType): string {
    switch (ent_type_str) {
        case EEntType.POSI:
            return 'positions';
        case EEntType.VERT:
            return 'vertices';
        case EEntType.TRI:
            return 'triangles';
        case EEntType.EDGE:
            return 'edges';
        case EEntType.WIRE:
            return 'wires';
        case EEntType.POINT:
            return 'points';
        case EEntType.PLINE:
            return 'polylines';
        case EEntType.PGON:
            return 'polygons';
        case EEntType.COLL:
            return 'collections';
    }
}

export function isXYZ(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (typeof item !== 'number') { return false; }
    }
    return true;
}
export function isRay(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 2) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
export function isPlane(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
export function isBBox(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 4) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
