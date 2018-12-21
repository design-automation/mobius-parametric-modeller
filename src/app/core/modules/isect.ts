import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, EOpKnife } from '@libs/geo-info/GICommon';
import { __merge__ } from './_model';

/**
 * Adds positions by intersection.
 * @param __model__
 * @param object1
 * @param object2
 */
export function Intersect(__model__: GIModel, object1: TId, object2: TId): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Knife
 * @param __model__
 * @param objects
 */
export function Knife(__model__: GIModel, objects: TId[], plane: TPlane, keep: EOpKnife): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Split
 * @param __model__
 * @param objects1
 * @param objects2
 */
export function Split(__model__: GIModel, objects1: TId[], objects2: TId[]): TId[] {
    throw new Error("Not implemented."); return null;
}
