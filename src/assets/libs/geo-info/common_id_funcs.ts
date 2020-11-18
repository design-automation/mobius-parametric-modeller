import { TId, EEntType, EEntTypeStr, TEntTypeIdx } from './common';

// global variables to store ID mappings
const ID_MAP: Map<string, [number, number]> = new Map();
const ID_REV_MAP: Map<number, Map<number, string>> = new Map();
ID_REV_MAP.set(EEntType.POSI, new Map() );
ID_REV_MAP.set(EEntType.VERT, new Map() );
ID_REV_MAP.set(EEntType.EDGE, new Map() );
ID_REV_MAP.set(EEntType.WIRE, new Map() );
ID_REV_MAP.set(EEntType.POINT, new Map() );
ID_REV_MAP.set(EEntType.PLINE, new Map() );
ID_REV_MAP.set(EEntType.PGON, new Map() );
ID_REV_MAP.set(EEntType.COLL, new Map() );

// ============================================================================
export function getArrDepth(arr: any): number {
    if (Array.isArray(arr)) {
        return 1 + getArrDepth(arr[0]);
    }
    return 0;
}
export function isEmptyArr(arr: any): boolean {
    if (Array.isArray(arr) && !arr.length) {
        return true;
    }
    return false;
}
// ============================================================================
export function idMake(ent_type: EEntType, ent_i: number): TId {
    const id: TId = ID_REV_MAP.get(ent_type).get(ent_i);
    if (id !== undefined) { return id; }
    const new_id: TId = EEntTypeStr[ent_type as EEntType] + ent_i as TId;
    ID_MAP.set(new_id, [ent_type, ent_i]);
    ID_REV_MAP.get(ent_type).set(ent_i, new_id);
    return new_id;
}
export function idsMake(ents: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TId|TId[]|TId[][] {
    if (!Array.isArray(ents[0])) {
        if (ents.length === 0) { return []; } //  deal with empty array
        return idMake(ents[0] as EEntType, ents[1] as number) as TId;
    } else {
        ents = ents as TEntTypeIdx[];
        return ents.map( ent_type_idxs_arr => idsMake(ent_type_idxs_arr) ) as TId[][];
    }
}
export function idsMakeFromIdxs(ent_type: EEntType, idxs: number|number[]|number[][]): TId|TId[]|TId[][] {
    if (!Array.isArray(idxs)) {
        return idMake(ent_type, idxs as number);
    } else {
        idxs = idxs as number[];
        if (idxs.length === 0) { return []; } //  deal with empty array
        return idxs.map( idx => idsMakeFromIdxs(ent_type, idx) ) as TId[];
    }
}
// ============================================================================
export function idBreak(id: TId): TEntTypeIdx {
    const ent: TEntTypeIdx = ID_MAP.get(id);
    if (ent === undefined) { throw new Error('The entity ID "' + id + '" is not a valid entity ID.'); }
    return ent;
}
export function idsBreak(id: TId|TId[]|TId[][]|TId[][][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]|TEntTypeIdx[][][] {
    if (id === null) { return null; }
    if (!Array.isArray(id)) {
        return idBreak(id);
    } else {
        return (id as TId[]).map( a_id => idsBreak(a_id) ) as TEntTypeIdx[];
    }
}
// ============================================================================
// export function idsMakeFromIndicies__OLD(ent_type: EEntType, idxs: number|number[]|number[][]): TId|TId[]|TId[][] {
//     const depth: number = getArrDepth(idxs);
//     if (depth === 0) {
//         const idx: number = idxs as number;
//         return EEntTypeStr[ent_type as EEntType] + idx as TId;
//     } else if (depth === 1) {
//         const idxs_arr: number[] = idxs as number[];
//         if (idxs_arr.length === 0) { return []; } //  deal with empty array
//         return idxs_arr.map( idx => idsMakeFromIndicies(ent_type, idx) ) as TId[];
//     } else { // depth === 2
//         const idxs_arrs: number[][] = idxs as number[][];
//         return idxs_arrs.map( idxs_arr => idsMakeFromIndicies(ent_type, idxs_arr) ) as TId[][];
//     }
// }
// export function idsMake__OLD(ent_type_idxs: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TId|TId[]|TId[][] {
//     const depth: number = getArrDepth(ent_type_idxs);
//     if (depth === 1) {
//         if (ent_type_idxs.length === 0) { return []; } //  deal with empty array
//         const ent_type_idx: TEntTypeIdx = ent_type_idxs as TEntTypeIdx;
//         return EEntTypeStr[ent_type_idx[0] as EEntType] + ent_type_idx[1] as TId;
//     } else if (depth === 2) {
//         const ent_type_idxs_arr: TEntTypeIdx[] = ent_type_idxs as TEntTypeIdx[];
//         return ent_type_idxs_arr.map( ent_type_idx => idsMake(ent_type_idx) ) as TId[];
//     } else { // depth === 3
//         const ent_type_idxs_arrs: TEntTypeIdx[][] = ent_type_idxs as TEntTypeIdx[][];
//         return ent_type_idxs_arrs.map( ent_type_idxs_arr => idsMake(ent_type_idxs_arr) ) as TId[][];
//     }
// }
// export function idsBreak__OLD(id: TId|TId[]|TId[][]|TId[][][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]|TEntTypeIdx[][][] {
//     // const depth: number = getArrDepth(ids);
//     if (id === null) { return null; }
//     if (!Array.isArray(id)) {
//         id = id as TId;
//         if (typeof id !== 'string') { throw new Error('Value is not an entity ID.'); }
//         // if (id.length < 3) { throw new Error('String is not an entity ID.'); }
//         const ent_type_str: string = id.slice(0, 2);
//         const ent_type: EEntType = EEntTypeStr[ent_type_str];
//         if (ent_type === undefined) { throw new Error('The ID "' + id + '" is not an entity ID.'); }
//         const index: number = Number(id.slice(2));
//         return [ent_type, index];
//     } else {
//         return (id as TId[]).map( a_id => idsBreak(a_id) ) as TEntTypeIdx[];
//     }
//     // } else if (depth === 1) {
//     //     const ids_arr: TId[] = ids as TId[];
//     //     return ids_arr.map( id => idsBreak(id) ) as TEntTypeIdx[];
//     // } else { // depth === 2
//     //     const ids_arr: TId[][] = ids as TId[][];
//     //     return ids_arr.map( id => idsBreak(id) ) as TEntTypeIdx[][];
//     // }
// }
export function getEntIdxs(ents_arr: TEntTypeIdx[]): number[] {
    return ents_arr.map( ents => ents[1] );
}
// ============================================================================
// export function isPosi(ent_type: EEntType): boolean {
//     return ent_type === EEntType.POSI;
// }
// export function isVert(ent_type: EEntType): boolean {
//     return ent_type === EEntType.VERT;
// }
// export function isTri(ent_type: EEntType): boolean {
//     return ent_type === EEntType.TRI;
// }
// export function isEdge(ent_type: EEntType): boolean {
//     return ent_type === EEntType.EDGE;
// }
// export function isWire(ent_type: EEntType): boolean {
//     return ent_type === EEntType.WIRE;
// }
// export function isPoint(ent_type: EEntType): boolean {
//     return ent_type === EEntType.POINT;
// }
// export function isPline(ent_type: EEntType): boolean {
//     return ent_type === EEntType.PLINE;
// }
// export function isPgon(ent_type: EEntType): boolean {
//     return ent_type === EEntType.PGON;
// }
// export function isColl(ent_type: EEntType): boolean {
//     return ent_type === EEntType.COLL;
// }
// more general test
export function isTopo(ent_type: EEntType): boolean {
    if (ent_type === EEntType.VERT) { return true; }
    if (ent_type === EEntType.EDGE) { return true; }
    if (ent_type === EEntType.WIRE) { return true; }
    return false;
}
export function isObj(ent_type: EEntType): boolean {
    if (ent_type === EEntType.PGON) { return true; }
    if (ent_type === EEntType.PLINE) { return true; }
    if (ent_type === EEntType.POINT) { return true; }
    return false;
}
export function isDim0(ent_type: EEntType): boolean {
    if (ent_type === EEntType.POSI) { return true; }
    if (ent_type === EEntType.VERT) { return true; }
    if (ent_type === EEntType.POINT) { return true; }
    return false;
}
export function isDim1(ent_type: EEntType): boolean {
    if (ent_type === EEntType.EDGE) { return true; }
    if (ent_type === EEntType.PLINE) { return true; }
    return false;
}
export function isDim2(ent_type: EEntType): boolean {
    if (ent_type === EEntType.PGON) { return true; }
    return false;
}
