import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, EOpKnife } from '@libs/geo-info/common';
import { __merge__ } from './_model';

/**
 * Adds positions by intersecting polylines, planes, and polygons.
 * @param __model__
 * @param object1 First polyline, plane, or polygon.
 * @param object2 Second polyline, plane or polygon.
 * @returns List of positions.
 * @example intersect1 = isect.Intersect (object1, object2)
 */
export function Intersect(__model__: GIModel, object1: TId, object2: TId): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Separates a list of points, polylines or polygons into two lists with a plane.
 * @param __model__
 * @param objects List of points, polylines or polygons.
 * @param plane Knife.
 * @param keep Keep above, keep below, or keep both lists of separated points, polylines or polygons.
 * @returns List, or list of two lists, of points, polylines or polygons.
 * @example knife1 = isect.Knife (objects, plane, keep)
 */
export function Knife(__model__: GIModel, objects: TId[], plane: TPlane, keep: EOpKnife): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Splits a list of polylines or polygons into two lists with a polyline.
 * @param __model__
 * @param objects A list of polylines or polygons.
 * @param polyline Splitter.
 * @returns List of two lists of polylines or polygons.
 */
export function Split(__model__: GIModel, objects1: TId[], objects2: TId[]): TId[] {
    throw new Error("Not implemented."); return null;
}
