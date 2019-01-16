import { TId, EEntType, EEntTypeStr, TEntTypeIdx } from './common';

// ============================================================================
export function getArrDepth(arr: any): number {
    if (Array.isArray(arr)) {
        return 1 + getArrDepth(arr[0]);
    }
    return 0;
}
// ============================================================================
export function idsMakeFromIndicies(ent_type: EEntType, idxs: number|number[]|number[][]): TId|TId[]|TId[][] {
    const depth: number = getArrDepth(idxs);
    if (depth === 0) {
        const idx: number = idxs as number;
        return EEntTypeStr[ent_type as EEntType] + idx as TId;
    } else if (depth === 1) {
        const idxs_arr: number[] = idxs as number[];
        if (idxs_arr.length === 0) { return []; } //  deal with empty array
        return idxs_arr.map( idx => idsMakeFromIndicies(ent_type, idx) ) as TId[];
    } else { // depth === 2
        const idxs_arrs: number[][] = idxs as number[][];
        return idxs_arrs.map( idxs_arr => idsMakeFromIndicies(ent_type, idxs_arr) ) as TId[][];
    }
}
export function idsMake(ent_type_idxs: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TId|TId[]|TId[][] {
    const depth: number = getArrDepth(ent_type_idxs);
    if (depth === 1) {
        if (ent_type_idxs.length === 0) { return []; } //  deal with empty array
        const ent_type_idx: TEntTypeIdx = ent_type_idxs as TEntTypeIdx;
        return EEntTypeStr[ent_type_idx[0] as EEntType] + ent_type_idx[1] as TId;
    } else if (depth === 2) {
        const ent_type_idxs_arr: TEntTypeIdx[] = ent_type_idxs as TEntTypeIdx[];
        return ent_type_idxs_arr.map( ent_type_idx => idsMake(ent_type_idx) ) as TId[];
    } else { // depth === 3
        const ent_type_idxs_arrs: TEntTypeIdx[][] = ent_type_idxs as TEntTypeIdx[][];
        return ent_type_idxs_arrs.map( ent_type_idxs_arr => idsMake(ent_type_idxs_arr) ) as TId[][];
    }
}
export function idsBreak(ids: TId|TId[]|TId[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    const depth: number = getArrDepth(ids);
    if (depth === 0) {
        const id: TId = ids as TId;
        const ent_type_str: string = id.slice(0, 2);
        const ent_type: EEntType = EEntTypeStr[ent_type_str];
        const index: number = Number(id.slice(2));
        return [ent_type, index];
    } else if (depth === 1) {
        const ids_arr: TId[] = ids as TId[];
        return ids_arr.map( id => idsBreak(id) ) as TEntTypeIdx[];
    } else { // depth === 2
        const ids_arr: TId[][] = ids as TId[][];
        return ids_arr.map( id => idsBreak(id) ) as TEntTypeIdx[][];
    }
}
export function idIndicies(ents_arr: TEntTypeIdx[]): number[] {
    return ents_arr.map( ents => ents[1] );
}
// ============================================================================
export function isPosi(ent_type: EEntType): boolean {
    return ent_type === EEntType.POSI;
}
export function isVert(ent_type: EEntType): boolean {
    return ent_type === EEntType.VERT;
}
export function isTri(ent_type: EEntType): boolean {
    return ent_type === EEntType.TRI;
}
export function isEdge(ent_type: EEntType): boolean {
    return ent_type === EEntType.EDGE;
}
export function isWire(ent_type: EEntType): boolean {
    return ent_type === EEntType.WIRE;
}
export function isFace(ent_type: EEntType): boolean {
    return ent_type === EEntType.FACE;
}
export function isPoint(ent_type: EEntType): boolean {
    return ent_type === EEntType.POINT;
}
export function isPline(ent_type: EEntType): boolean {
    return ent_type === EEntType.PLINE;
}
export function isPgon(ent_type: EEntType): boolean {
    return ent_type === EEntType.PGON;
}
export function isColl(ent_type: EEntType): boolean {
    return ent_type === EEntType.COLL;
}
// more general test
export function isTopo(ent_type: EEntType): boolean {
    if (ent_type === EEntType.VERT) { return true; }
    if (ent_type === EEntType.EDGE) { return true; }
    if (ent_type === EEntType.WIRE) { return true; }
    if (ent_type === EEntType.FACE) { return true; }
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
    if (ent_type === EEntType.FACE) { return true; }
    if (ent_type === EEntType.PGON) { return true; }
    return false;
}
