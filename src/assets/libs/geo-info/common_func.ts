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
        case EEntType.FACE:
            return 'faces';
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
