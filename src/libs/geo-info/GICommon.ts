// Enum
export enum EEntityTypeStr {
    POSI = 'po',
    TRI  = '_t',
    VERT = '_v',
    EDGE = '_e',
    WIRE = '_w',
    FACE = '_f',
    POINT = 'pt',
    LINE = 'ls',
    PGON = 'pg',
    COLL = 'co'
}
// Names of attributes
export enum EAttribNames {
    COORDS = 'coordinates',
    NORMAL = 'normal',
    COLOR = 'color'
}

// ============================================================================
// Each entity in the model can be accessed using an ID string.
// Below are functions for breaking ID strings into the component parts
// IDs start with two characters followed by numeric digits.
// For example '_v22' is vertex number 22.
// ============================================================================
export function idBreak(id: string): [string, number] {
    return [idEntityTypeStr(id), idIndex(id)];
}
export function idIndex(id: string): number {
    return Number(id.slice(2));
}
export function idIndicies(ids: string[]): number[] {
    return ids.map( id => Number(id.slice(2)));
}
export function idEntityTypeStr(id: string): EEntityTypeStr {
    return id.slice(0, 2) as EEntityTypeStr;
}
