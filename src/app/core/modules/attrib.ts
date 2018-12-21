import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, Txyz, EOpPromote, EAttribTypes } from '@libs/geo-info/GICommon';
import { TAttribDataTypes } from '@libs/geo-info/GIJson';

/**
 * Get attribute value.
 * @param __model__
 * @param entities
 */
export function Get(__model__: GIModel, entities: TId|TId[], name: string): TAttribDataTypes|TAttribDataTypes[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Set attribute value.
 * @param __model__
 * @param entities
 */
export function Set(__model__: GIModel, entities: TId|TId[], name: string, value: TAttribDataTypes): void {
    // return __model__.attribs().setAttribValue(entities, name, value);
    throw new Error("Not impemented."); return null;
}
/**
 * Attribute promote
 * @param __model__
 * @param from enum
 * @param to enum
 * @param method enum
 */
export function Promote(__model__: GIModel, from: EAttribTypes, to: EAttribTypes, method: EOpPromote): TId[] {
    throw new Error("Not implemented.");
}
/**
 * Query
 * @param __model__
 * @param query
 */
export function Query(__model__: GIModel, query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * QueryNumber
 * @param __model__
 * @param query
 */
export function QueryNumber(__model__: GIModel, query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Gets the xyz coordinates of a set of one or more positions.
 * @param __model__
 * @param positions
 */
export function GetCoordinates(__model__: GIModel, positions: TId|TId[]): Txyz|Txyz[] {
    throw new Error("Not impemented."); return null;
}
