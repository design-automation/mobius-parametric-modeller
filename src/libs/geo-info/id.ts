import { EEntityTypeStr, TId } from "./common";

// ============================================================================
// Each entity in the model can be accessed using an ID string.
// Below are functions for breaking ID strings into the component parts
// IDs start with two characters followed by numeric digits.
// For example '_v22' is vertex number 22.
// ============================================================================
export function idBreak(id: TId): [string, number] {
    return [idEntityTypeStr(id), idIndex(id)];
}
export function idIndex(id: TId): number {
    return Number(id.slice(2));
}
export function idIndicies(ids: TId[]): number[] {
    return ids.map( id => Number(id.slice(2)));
}
export function idEntityTypeStr(id: TId): EEntityTypeStr {
    return id.slice(0, 2) as EEntityTypeStr;
}
export function isPosi(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.POSI);
}
export function isVert(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.VERT);
}
export function isEdge(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.EDGE);
}
export function isWire(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.WIRE);
}
export function isFace(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.FACE);
}
export function isPoint(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.POINT);
}
export function isPline(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.PLINE);
}
export function isPgon(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.PGON);
}
export function isColl(id: TId): boolean {
    return id.startsWith(EEntityTypeStr.COLL);
}
