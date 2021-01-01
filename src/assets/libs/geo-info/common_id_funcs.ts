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
export function getEntIdxs(ents_arr: TEntTypeIdx[]): number[] {
    return ents_arr.map( ents => ents[1] );
}
// ============================================================================
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
