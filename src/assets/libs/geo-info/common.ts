import { GIAttribMap } from './GIAttribMap';

// longitude latitude in Singapore, NUS
export const LONGLAT = [103.778329, 1.298759];

// some constants
export const XYPLANE: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
export const YZPLANE: TPlane = [[0, 0, 0], [0, 1, 0], [0, 0, 1]];
export const ZXPLANE: TPlane = [[0, 0, 0], [0, 0, 1], [1, 0, 0]];

export const YXPLANE: TPlane = [[0, 0, 0], [0, 1, 0], [1, 0, 0]];
export const ZYPLANE: TPlane = [[0, 0, 0], [0, 0, 1], [0, 1, 0]];
export const XZPLANE: TPlane = [[0, 0, 0], [1, 0, 0], [0, 0, 1]];

// EEntType and an index
export type TEntTypeIdx = [EEntType, number];

// Object for entities
export interface IGeomPack {
    posis_i: number[];
    points_i: number[];
    plines_i: number[];
    pgons_i: number[];
    colls_i: number[];
}

// Types
export type TRay = [Txyz, Txyz]; // an origin and a direction vector
export type TPlane = [Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TBBox = [Txyz, Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TQuery = string;
export type TId = string;
export type TColor = [number, number, number]; // TODO replace with Txyz
export type TNormal = [number, number, number]; // TODO replace with xyz
export type TTexture = [number, number];

// export interface IExpr {
//     ent_type1: string;
//     attrib_name1?: string;
//     attrib_index1?: number;
//     ent_type2?: string;
//     attrib_name2?: string;
//     attrib_index2?: number;
//     operator?: string;
//     value?: TAttribDataTypes;
// }

// export interface IExprQuery {
//     ent_type: EEntType;
//     attrib_name?: string;
//     attrib_index?: number;
//     operator?: EFilterOperatorTypes;
//     value?: TAttribDataTypes;
// }

// export interface IExprSort {
//     ent_type: EEntType;
//     attrib_name: string;
//     attrib_index?: number;
// }

// export interface IExprPush {
//     ent_type1: EEntType;
//     attrib_name1: string;
//     attrib_index1?: number;
//     ent_type2: EEntType;
//     attrib_name2: string;
//     attrib_index2?: number;
// }

// export enum EExprEntType {
//     POSI =   'ps',
//     VERT =   '_v',
//     EDGE =   '_e',
//     WIRE =   '_w',
//     FACE =   '_f',
//     POINT =  'pt',
//     PLINE =  'pl',
//     PGON =   'pg',
//     COLL =   'co'
// }

// Types of entities
export enum EEntType {
    POSI,
    TRI,
    VERT,
    EDGE,
    WIRE,
    FACE,
    POINT,
    PLINE,
    PGON,
    COLL,
    MOD
}

// Types of entities
export enum EEntTypeStr {
    'ps',
    '_t',
    '_v',
    '_e',
    '_w',
    '_f',
    'pt',
    'pl',
    'pg',
    'co',
    'mo'
}

export enum EEntStrToGeomArray {
    'posis',
    'dn_tris_verts',
    'dn_verts_posis',
    'dn_edges_verts',
    'dn_wires_edges',
    'dn_faces_wirestris',
    'dn_points_verts',
    'dn_plines_wires',
    'dn_pgons_faces',
    'dn_colls_objs'
}

/**
 * Attribute maps
 */
export interface IAttribsMaps {
    ps: Map<string, GIAttribMap>;
    _v: Map<string, GIAttribMap>;
    _e: Map<string, GIAttribMap>;
    _w: Map<string, GIAttribMap>;
    _f: Map<string, GIAttribMap>;
    pt: Map<string, GIAttribMap>;
    pl: Map<string, GIAttribMap>;
    pg: Map<string, GIAttribMap>;
    co: Map<string, GIAttribMap>;
    mo: Map<string, any>;
}

// Names of attributes
export enum EAttribNames {
    COORDS =  'xyz',
    NORMAL =  'normal',
    COLOR =   'rgb',
    TEXTURE = 'uv',
    NAME = 'name',
    MATERIAL = 'material'
}

/**
 * The types of operators that can be used in a filter.
 */
export enum EFilterOperatorTypes {
    IS_EQUAL = '==',
    IS_NOT_EQUAL = '!=',
    IS_GREATER_OR_EQUAL = '>=',
    IS_LESS_OR_EQUAL = '<=',
    IS_GREATER = '>',
    IS_LESS = '<',
    EQUAL = '='
}

// /**
//  * A query component.
//  * Each query can consist of multiple components.
//  * Some examples of queries
//  * @name == value
//  * @name > value
//  * @name[2] <= value
//  */
// export interface IQueryComponent {
//     attrib_name: string;
//     attrib_index: number;
//     attrib_value_str: string;
//     operator_type: EFilterOperatorTypes;
// }

/**
 * A sort component.
 * Each sort can consist of multiple components.
 * Some examples of queries
 * @name
 * @name[2]
 */
export interface ISortComponent {
    attrib_name: string;
    attrib_index: number;
}

export enum ESort {
    DESCENDING = 'descending',
    ASCENDING = 'ascending'
}

export enum EAttribPush {
    AVERAGE,
    MEDIAN,
    SUM,
    MIN,
    MAX,
    FIRST,
    LAST
}

/**
 * Geom arrays
 */
export interface IGeomArrays {
    // num_posis: number;
    dn_verts_posis: TVert[];
    dn_tris_verts: TTri[];
    dn_edges_verts: TEdge[];
    dn_wires_edges: TWire[];
    dn_faces_wirestris: TFace[];
    dn_points_verts: TPoint[];
    dn_plines_wires: TPline[];
    dn_pgons_faces: TPgon[];
    dn_colls_objs: TColl[];
    up_posis_verts: number[][]; // one to many
    up_tris_faces: number[];
    up_verts_edges: number[][]; // one to two
    up_verts_tris: number[][]; // one to many
    up_verts_points: number[];
    up_edges_wires: number[];
    up_wires_faces: number[];
    up_wires_plines: number[];
    up_faces_pgons: number[];
    up_points_colls: number[][]; // one to many
    up_plines_colls: number[][]; // one to many
    up_pgons_colls: number[][]; // one to many
}

// copy geometry
export interface IGeomCopy {
    points: number[];
    plines: number[];
    pgons: number[];
    colls: number[];
}
// ================================================================================================
// JSON DATA
// ================================================================================================

// enums
export enum EAttribDataTypeStrs {
    // INT = 'Int',
    NUMBER = 'Number',
    STRING = 'String',
    BOOLEAN = 'Boolean',
    LIST = 'List', // a list of anything
    DICT = 'Dict // an object'
}

// types
export type Txyz = [number, number, number]; // in use
export type TPosi = number;
export type TTri = [number, number, number]; // [position, position, position]
export type TVert = number; // positions
export type TEdge = [number, number]; // [vertex, vertex]
export type TWire = number[]; // [edge, edge,....]
export type TFace = [number[], number[]]; // [[wire, ....], [triangle, ...]]
export type TPoint = number; // [vertex,....]
export type TPline = number; // [wire,....]
export type TPgon = number; // [face,....]
export type TColl = [number, number[], number[], number[]]; // [parent, [point, ...], [polyline, ...], [polygon, ....]]
export type TEntity = TTri | TVert | TEdge | TWire | TFace | TPoint | TPline | TPgon | TColl;
export type TAttribDataTypes = string | number | boolean | any[] | object;
export type TEntAttribValuesArr = Array<[number[], TAttribDataTypes]>;
export type TModelAttribValuesArr = Array<[string, TAttribDataTypes]>;
// interfaces for JSON data

export const RE_SPACES: RegExp = /\s+/g;

export interface IGeomData {
    num_positions: number;
    triangles: TTri[];
    vertices: TVert[];
    edges: TEdge[];
    wires: TWire[];
    faces: TFace[];
    points: TPoint[];
    polylines: TPline[];
    polygons: TPgon[];
    collections: TColl[];
    selected: TEntTypeIdx[];
}
export interface IAttribData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data: TEntAttribValuesArr;
}
export interface IAttribsData {
    positions: IAttribData[];
    vertices: IAttribData[];
    edges: IAttribData[];
    wires: IAttribData[];
    faces: IAttribData[];
    points: IAttribData[];
    polylines: IAttribData[];
    polygons: IAttribData[];
    collections: IAttribData[];
    model: TModelAttribValuesArr;
}
export interface IModelData {
    geometry: IGeomData;
    attributes: IAttribsData;
}
