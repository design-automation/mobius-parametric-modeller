// enums
export enum EAttribDataTypeStrs {
    INT = 'Int',
    FLOAT = 'Float',
    STRING = 'String'
}

// types
export type TCoords = [number, number, number];
export type TTri = [number, number, number]; // [position, position, position]
export type TVert = number; // positions
export type TEdge = [number, number]; // [vertex, vertex]
export type TWire = number[]; // [edge, edge,....]
export type TFace = [number[], number[]]; // [[wire, ....], [triangle, ...]]
export type TPoint = number; // [vertex,....]
export type TLine = number; // [wire,....]
export type TPgon = number; // [face,....]
export type TColl = [number, number[], number[], number[]]; // [parent, [point, ...], [polyline, ...], [polygon, ....]]
export type TEntity = TTri | TVert | TEdge | TWire | TFace | TPoint | TLine | TPgon | TColl;
export type TAttribDataTypes = string | string[] | number | number[];
export type TAttribValuesArr = Array<[number[], TAttribDataTypes]>;
// interfaces for JSON data

export interface IGeomData {
    num_positions: number;
    triangles: TTri[];
    vertices: TVert[];
    edges: TEdge[];
    wires: TWire[];
    faces: TFace[];
    points: TPoint[];
    linestrings: TLine[];
    polygons: TPgon[];
    collections: TColl[];
}
export interface IAttribData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data_size: number;
    data: TAttribValuesArr;
}
export interface IAttribsData {
    positions: IAttribData[];
    vertices: IAttribData[];
    edges: IAttribData[];
    wires: IAttribData[];
    faces: IAttribData[];
    collections: IAttribData[];
}
export interface IModelData {
    geometry: IGeomData;
    attributes: IAttribsData;
}
