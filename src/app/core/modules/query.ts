import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntityTypeStr } from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';

/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param query @Attributes #Entities: Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @returns List of id.
 * @example query1 = attrib.Query (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function Entities(__model__: GIModel, select: EEntityTypeStr, from: TId[], query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param query @Attributes #Entities: Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @returns List of number of entities.
 * @example queryNum1 = attrib.QueryNumber (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function Number(__model__: GIModel, query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
