import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz } from '@libs/geo-info/GICommon';

/**
 * Calculates the distance between two points.
 * @param __model__
 * @param position1
 * @param position2
 */
export function Distance(__model__: GIModel, position1: TId, position2: TId): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the minimum distance between two points.
 * @param __model__
 * @param object1
 * @param object2
 */
export function MinDistance(__model__: GIModel, object1: TId, object2: TId): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the area of an type of surface entity
 * @param __model__
 * @param surface
 */
export function Area(__model__: GIModel, surface: TId|TId[]): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the length of a linear entity.
 * @param __model__
 * @param line
 */
export function Length(__model__: GIModel, line: TId|TId[]): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the normal of a set of positions assumed to be planar.
 * @param __model__
 * @param positions
 */
export function Normal(__model__: GIModel, positions: TId[]): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the centroid of a set of positions.
 * @param __model__
 * @param positions
 */
export function Centroid(__model__: GIModel, positions: TId[]): Txyz {
    throw new Error("Not impemented."); return null;
}
/**
 * EvalTParameter
 * @param __model__
 * @param lines
 */
export function ParamTToXyz(__model__: GIModel, lines: TId|TId[], t_param: number): Txyz|Txyz[] {
    throw new Error("Not impemented."); return null;
}
/**
 * CalcTParameter
 * @param __model__
 * @param locations
 */
export function ParamXyzToT(__model__: GIModel, lines: TId|TId[], locations: TId|TId[]|Txyz|Txyz[]): number|number[] {
    throw new Error("Not impemented."); return null;
}
