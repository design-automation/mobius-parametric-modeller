// Types
export type TColor = [number, number, number];
export type TNormal = [number, number, number];
export type TTexture = [number, number];

// Enum
export enum EEntityTypeStr {
    POSI =  'ps',
    TRI  =  '_t',
    VERT =  '_v',
    EDGE =  '_e',
    WIRE =  '_w',
    FACE =  '_f',
    POINT = 'pt',
    LINE =  'pl',
    PGON =  'pg',
    COLL =  'co'
}

// Names of attributes
export enum EAttribNames {
    COORDS = 'coordinates',
    NORMAL = 'normal',
    COLOR = 'color',
    TEXTURE = 'texture'
}

/**
 * The types of operators that can be used in a query.
 */
export enum EQueryOperatorTypes {
    IS_EQUAL = '==',
    IS_NOT_EQUAL = '!=',
    IS_GREATER_OR_EQUAL = '>=',
    IS_LESS_OR_EQUAL = '<=',
    IS_GREATER = '>',
    IS_LESS = '<',
    EQUAL = '='
}

/**
 * A query component.
 * Each query can consist of multiple components.
 */
export interface IQueryComponent {
    attrib_type: EEntityTypeStr;
    attrib_name: string;
    attrib_index: number;
    attrib_value_str: string;
    operator_type: EQueryOperatorTypes;
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
