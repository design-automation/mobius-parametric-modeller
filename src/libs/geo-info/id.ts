import { TId, EEntType, EEntTypeStr } from './common';

// ============================================================================
// Each entity in the model can be accessed using an ID string.
// Below are functions for breaking ID strings into the component parts
// IDs start with two characters followed by numeric digits.
// For example '_v22' is vertex number 22.
// ============================================================================
// export function idBreak(id: TId): [EEntTypeStr, number] {
//     return [idEntityTypeStr(id), idIndex(id)];
// }
// export function idIndex(id: TId): number {
//     return Number(id.slice(2));
// }
// export function idIndicies(ids: TId[]): number[] {
//     return ids.map( id => Number(id.slice(2)));
// }
// export function idEntityTypeStr(id: TId): EEntTypeStr {
//     return id.slice(0, 2) as EEntTypeStr;
// }
// // ============================================================================
// export function isPosi(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.POSI);
// }
// export function isVert(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.VERT);
// }
// export function isTri(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.TRI);
// }
// export function isEdge(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.EDGE);
// }
// export function isWire(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.WIRE);
// }
// export function isFace(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.FACE);
// }
// export function isPoint(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.POINT);
// }
// export function isPline(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.PLINE);
// }
// export function isPgon(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.PGON);
// }
// export function isColl(id: TId): boolean {
//     return id.startsWith(EEntTypeStr.COLL);
// }
// // more general test
// export function isObj(id: TId): boolean {
//     if (id.startsWith(EEntTypeStr.PGON)) { return true; }
//     if (id.startsWith(EEntTypeStr.PLINE)) { return true; }
//     if (id.startsWith(EEntTypeStr.POINT)) { return true; }
//     return false;
// }
// export function isDim0(id: TId): boolean {
//     if (id.startsWith(EEntTypeStr.POSI)) { return true; }
//     if (id.startsWith(EEntTypeStr.VERT)) { return true; }
//     if (id.startsWith(EEntTypeStr.POINT)) { return true; }
//     return false;
// }
// export function isDim1(id: TId): boolean {
//     if (id.startsWith(EEntTypeStr.EDGE)) { return true; }
//     if (id.startsWith(EEntTypeStr.PLINE)) { return true; }
//     return false;
// }
// export function isDim2(id: TId): boolean {
//     if (id.startsWith(EEntTypeStr.FACE)) { return true; }
//     if (id.startsWith(EEntTypeStr.PGON)) { return true; }
//     return false;
// }


// ============================================================================
export function idMake(ent_type: EEntType, index: number): TId {
    return EEntTypeStr[ent_type] + index;
}
export function idBreak(id: TId): [EEntType, number] {
    // error check
    const ent_type_str: string = id.slice(0, 2);
    const ent_type: EEntType = EEntTypeStr[ent_type_str];
    const index: number = Number(id.slice(2));
    return [ent_type, index];
}
export function idsBreak(ids: TId[]): [EEntType, number][] {
    return ids.map(id => idBreak(id));
}
export function idIndicies(ids: TId[]): number[] {
    return ids.map( id => Number(id.slice(2)));
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
