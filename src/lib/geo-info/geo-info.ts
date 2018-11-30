/**
 * Geo-info models.
 */

//  ===============================================================================================================
//  Enums, Types, and Interfaces
//  ===============================================================================================================

// enums

export enum EAttribDataTypeStrs {
    Int = 'Int',
    Float = 'Float',
    String = 'String'
}

// types

export type TTriangle = [number, number, number]; // [position, position, position]
export type TVertex = number; // positions
export type TEdge = [number, number]; // [vertex, vertex]
export type TWire = number[]; // [edge, edge,....]
export type TFace = [number[], number[]]; // [[wire, ....], [triangle, ...]]
export type TCollection = [number, number[], number[], number[]]; // [parent, [vertex, ...], [wire, ...], [face, ....]]
export type TAttribDataTypes = String | String[] | number | number[];
export type TAttribValuesArr = Array<[number[], TAttribDataTypes]>;

// interfaces

export interface IAttrib {
    name: string;
    data_type: EAttribDataTypeStrs;
    data_length: number;
    data: TAttribValuesArr;
}

export interface IPositionsAttrib extends IAttrib {
    name: 'coordinates';
    data_type: EAttribDataTypeStrs.Float;
    data_length: 3;
}

export interface IModel {
    topology: {
        triangles: TTriangle[];
        vertices: TVertex[];
        edges: TEdge[];
        wires: TWire[];
        faces: TFace[];
        collections: TCollection[];
    };
    attributes: {
        positions: [IPositionsAttrib, ...Array<IAttrib>];
        vertices: IAttrib[];
        edges: IAttrib[];
        wires: IAttrib[];
        faces: IAttrib[];
        collections: IAttrib[];
    };
}
