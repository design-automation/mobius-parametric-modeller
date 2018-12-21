// Types
export type TPlane = [Txyz, Txyz, Txyz]; // an origin and two vectors
export type TQuery = string;
export type TId = string;
export type Txyz = [number, number, number];
export type TColor = [number, number, number]; // TODO replace with Txyz
export type TNormal = [number, number, number]; // TODO replace with xyz
export type TTexture = [number, number];

// Promote modelling operation
export enum EAttribTypes {
    POSIS =  'positions',
    VERTS  =  'vertices',
    EDGES = 'edges',
    WIRES = 'wires',
    FACES = 'faces',
    COLLS = 'collections'
}

// Promote modelling operation
export enum EOpPromote {
    MEAN =  'mean',
    MIN  =  'min',
    MAX = 'max',
    NONE = 'none'
}

// Knife modelling operation keep
export enum EOpKnife {
    KEEP_ABOVE =  'keep above the plane',
    KEEP_BELOW  =  'keep below the plane',
    KEEP_ALL =  'keep all'
}

// Divide edge modelling operation
export enum EOpDivide {
    BY_NUMBER =  'divide edge by number',
    BY_LENGTH  =  'divide edge by length'
}

// Types of entities
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
