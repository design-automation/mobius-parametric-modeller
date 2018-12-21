import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz } from '@libs/geo-info/GICommon';

/**
 * Calculates the distance between two positions.
 * @param __model__
 * @param position1 First position.
 * @param position2 Second position.
 * @returns Distance.
 * @example position1 = [1,2,3]
 * position2 = [1,2,34]
 * distance1 = calc.Distance (position1, position2)
 *
 * Expected value of distance is 31.
 */
export function Distance(__model__: GIModel, position1: TId, position2: TId): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the length of a line or a list of lines.
 * @param __model__
 * @param line Edge, wire or polyline.
 * @returns Length.
 * @example length1 = calc.Length (line)
 */
export function Length(__model__: GIModel, line: TId|TId[]): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the minimum distance between a location and an object, or two objects.
 * @param __model__
 * @param locationOrObject Position, vertex, point, list of coordinates, polyline, or polygon.
 * @param object Polyline or polygon.
 * @returns Minimum distance.
 * @example mindistance1 = calc.MinDistance (locationOrObject, object)
 */
export function MinDistance(__model__: GIModel, locationOrObject: TId|TId[], object: TId): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the area of a surface or a list of surfaces.
 * @param __model__
 * @param surface Face or polygon.
 * @returns Area.
 * @example area1 = calc.Area (surface)
 */
export function Area(__model__: GIModel, surface: TId|TId[]): number {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the normal of a list of positions, a wire, a closed polyline, a surface, or a plane.
 * @param __model__
 * @param geometry List of positions, a wire, a closed polyline, a face, or a polygon.
 * @returns Vector.
 * @example normal1 = calc.Normal (geometry)
 * 
 * If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.
 */
export function Normal(__model__: GIModel, geometry: TId[]): Txyz {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates the centroid of a list of any geometry.
 * @param __model__
 * @param geometry List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.
 * @returns Centroid.
 * @example centroid1 = calc.Centroid (geometry)
 */
export function Centroid(__model__: GIModel, geometry: TId[]): Txyz {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates t parameter to get a location.
 * @param __model__
 * @param lines List of edges, wires, or polylines.
 * @param t_param List of values between 0 to 1.
 * @example coord1 = calc.ParamTToXyz (lines, t_param)
 */
export function ParamTToXyz(__model__: GIModel, lines: TId|TId[], t_param: number): Txyz|Txyz[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Calculates a location on a line to get t parameter.
 * @param __model__
 * @param lines List of edges, wires, or polylines.
 * @param locations List of positions, vertices, points, or coordinates.
 * @example coord1 = calc.ParamXyzToT (lines, locations)
 */
export function ParamXyzToT(__model__: GIModel, lines: TId|TId[], locations: TId|TId[]|Txyz|Txyz[]): number|number[] {
    throw new Error("Not impemented."); return null;
}
