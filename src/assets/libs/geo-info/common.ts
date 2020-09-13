import { GIAttribMap } from './GIAttribMap';
import { GIAttribMapBool } from './GIAttribMapBool';

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

// For each entity type, a set of entity indexes
export interface IEntSets {
    posis_i?: Set<number>;
    points_i?: Set<number>;
    plines_i?: Set<number>;
    pgons_i?: Set<number>;
    colls_i?: Set<number>;
    obj_posis_i?: Set<number>;
    verts_i?: Set<number>;
    tris_i?: Set<number>;
    edges_i?: Set<number>;
    wires_i?: Set<number>;
    faces_i?: Set<number>;
}

// // Posis, Points, Plines, Pgons, Colls
// export interface IGeomPack {
//     posis_i: number[];
//     points_i: number[];
//     plines_i: number[];
//     pgons_i: number[];
//     colls_i: number[];
//     // posis2_i?: number[];
// }

// // Object for entities
// export interface IGeomPackTId {
//     ps: TId[];
//     po: TId[];
//     pl: TId[];
//     pg: TId[];
//     co: TId[];
// }

// Types
export type TRay = [Txyz, Txyz]; // an origin and a direction vector
export type TPlane = [Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TBBox = [Txyz, Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TQuery = string;
export type TId = string;
export type TColor = [number, number, number]; // TODO replace with Txyz
export type TNormal = [number, number, number]; // TODO replace with xyz
export type TTexture = [number, number];

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
export enum EEntTypeCollCP {
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
    COLLC,
    COLLP,
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

export enum EEntStrToGeomMaps {
    'up_posis_verts', // 'posis',
    'dn_tris_verts',
    'dn_verts_posis',
    'dn_edges_verts',
    'dn_wires_edges',
    'dn_faces_wires',
    'dn_points_verts',
    'dn_plines_wires',
    'dn_pgons_faces',
    'up_colls_colls'
}

/**
 * Attribute maps
 */

export type TAttribMap = GIAttribMap | GIAttribMapBool;

export interface IAttribsMaps {
    ps: Map<string, TAttribMap>;
    _v: Map<string, TAttribMap>;
    _e: Map<string, TAttribMap>;
    _w: Map<string, TAttribMap>;
    _f: Map<string, TAttribMap>;
    pt: Map<string, TAttribMap>;
    pl: Map<string, TAttribMap>;
    pg: Map<string, TAttribMap>;
    co: Map<string, TAttribMap>;
    mo: Map<string, any>;
}

// Names of attributes
export enum EAttribNames {
    COORDS =  'xyz',
    NORMAL =  'normal',
    COLOR =   'rgb',
    TEXTURE = 'uv',
    NAME = 'name',
    MATERIAL = 'material',
    VISIBILITY = 'visibility',
    LABEL = 'label'
}

// Wire Type
export enum EWireType {
    PLINE =  'pline',
    PGON =  'pgon',
    PGON_HOLE =   'pgon_hole'
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

// enums
export enum EAttribDataTypeStrs {
    // INT = 'Int',
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    LIST = 'list', // a list of anything
    DICT = 'dict // an object'
}

// types
export type Txy = [number, number]; // north direction
export type Txyz = [number, number, number]; // in use
export type TPosi = number;
export type TTri = [number, number, number]; // [position, position, position]
export type TVert = number; // positions
export type TEdge = [number, number]; // [vertex, vertex]
export type TWire = number[]; // [edge, edge,....]
export type TFace = number[]; // [wire, ....]
export type TFaceTri = number[]; // [triangle, ...]
export type TPoint = number; // [vertex,....]
export type TPline = number; // [wire,....]
export type TPgon = number; // [face,....]
export type TColl = [number, number[], number[], number[]]; // [parent, [point, ...], [polyline, ...], [polygon, ....]]
export type TEntity = TTri | TVert | TEdge | TWire | TFace | TPoint | TPline | TPgon | TColl;
export type TAttribDataTypes = string | number | boolean | any[] | object;
export type TEntAttribValuesArr = Array<[number, number[]]>;
export type TModelAttribValuesArr = Array<[string, TAttribDataTypes]>;


export const RE_SPACES: RegExp = /\s+/g;

/**
 * Geom arrays
 */
export interface IGeomMaps {
    // num_posis: number;
    dn_verts_posis: Map<number, TVert>;
    dn_tris_verts: Map<number, TTri>;
    dn_edges_verts: Map<number, TEdge>;
    dn_wires_edges: Map<number, TWire>;
    dn_faces_wires: Map<number, TFace>;
    dn_faces_tris: Map<number, TFaceTri>;
    dn_points_verts: Map<number, TPoint>;
    dn_plines_wires: Map<number, TPline>;
    dn_pgons_faces: Map<number, TPgon>;
    // dn_colls_objs: Map<number, TColl>;
    dn_colls_points: Map<number, number[]>;
    dn_colls_plines: Map<number, number[]>;
    dn_colls_pgons: Map<number, number[]>;
    up_posis_verts: Map<number, number[]>; // one to many
    up_tris_faces: Map<number, number>;
    up_verts_edges: Map<number, number[]>; // one to two
    up_verts_tris: Map<number, number[]>; // one to many
    up_verts_points: Map<number, number>;
    up_edges_wires: Map<number, number>;
    up_wires_faces: Map<number, number>;
    up_wires_plines: Map<number, number>;
    up_faces_pgons: Map<number, number>;
    up_points_colls: Map<number, number[]>; // one to many
    up_plines_colls: Map<number, number[]>; // one to many
    up_pgons_colls: Map<number, number[]>; // one to many
    up_colls_colls: Map<number, number>;
    posis_ts: Map<number, number>;
    points_ts: Map<number, number>;
    plines_ts: Map<number, number>;
    pgons_ts: Map<number, number>;
    colls_ts: Map<number, number>;
}

// copy geometry
export interface IGeomCopy {
    points: number[];
    plines: number[];
    pgons: number[];
    colls: number[];
}

// note the names of the keys must match EAttribDataTypeStrs
export interface IAttribValues {
    number: [number[], Map<string, number>];
    string: [string[], Map<string, number>];
    list:   [any[],    Map<string, number>];
    dict:   [object[], Map<string, number>];
}

export interface IMetaData {
    time_stamp: number;
    posi_count: number;
    vert_count: number;
    tri_count: number;
    edge_count: number;
    wire_count: number;
    face_count: number;
    point_count: number;
    pline_count: number;
    pgon_count: number;
    coll_count: number;
    attrib_values: IAttribValues;
}

// ================================================================================================
// JSON MODEL
// ================================================================================================

export interface IModelJSON {
    meta_data: IMetaJSONData;
    model_data: IModelJSONData;
}

// ================================================================================================
// JSON META DATA
// ================================================================================================

export interface IAttribJSONValues {
    number_vals: number[];
    // number_keys: string[];
    // number_idxs: number[];

    string_vals: string[];
    // string_keys: string[];
    // string_idxs: number[];

    list_vals: any[];
    // list_keys: string[];
    // list_idxs: number[];

    dict_vals: object[];
    // dict_keys: string[];
    // dict_idxs: number[];
}

export interface IMetaJSONData {
    time_stamp: number;
    posi_count: number;
    vert_count: number;
    tri_count: number;
    edge_count: number;
    wire_count: number;
    face_count: number;
    point_count: number;
    pline_count: number;
    pgon_count: number;
    coll_count: number;
    attrib_values: IAttribJSONValues;
}

// ================================================================================================
// JSON MODEL DATA
// ================================================================================================

export interface IModelJSONData {
    geometry: IGeomJSONData;
    attributes: IAttribsJSONData;
}

export interface IGeomJSONData {
    posis_i: number[];
    // posis_ts: number[];
    verts: TVert[];
    verts_i: number[];
    tris: TTri[];
    tris_i: number[];
    edges: TEdge[];
    edges_i: number[];
    wires: TWire[];
    wires_i: number[];
    faces: TFace[];
    facetris: TFaceTri[];
    faces_i: number[];
    points: TPoint[];
    points_i: number[];
    plines: TPline[];
    plines_i: number[];
    pgons: TPgon[];
    pgons_i: number[];
    colls_points: number[][];
    colls_plines: number[][];
    colls_pgons: number[][];
    colls_parents: number[];
    colls_i: number[];
    selected: TEntTypeIdx[];
}
export interface IAttribJSONData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data_length: number;
    data: TEntAttribValuesArr;
}
export interface IAttribsJSONData {
    posis: IAttribJSONData[];
    verts: IAttribJSONData[];
    edges: IAttribJSONData[];
    wires: IAttribJSONData[];
    faces: IAttribJSONData[];
    points: IAttribJSONData[];
    plines: IAttribJSONData[];
    pgons: IAttribJSONData[];
    colls: IAttribJSONData[];
    model: TModelAttribValuesArr;
}

