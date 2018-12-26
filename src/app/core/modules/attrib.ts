import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, Txyz, EOpPromote, EAttribTypes, TAttribDataTypes } from '@libs/geo-info/common';

/**
 * Gets attribute value of all entities.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection or a list.
 * @param name Attribute name to get the value for.
 * @returns Attribute value.
 */
export function Get(__model__: GIModel, entities: TId|TId[], name: string): TAttribDataTypes|TAttribDataTypes[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Sets attribute value.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @param name Attribute name to be set.
 * @param value Attribute value in string, number or as a list.
 * @example set1 = attrib.Set (entities, name, value)
 */
export function Set(__model__: GIModel, entities: TId|TId[], name: string, value: TAttribDataTypes): void {
    // return __model__.attribs().setAttribValue(entities, name, value);
    throw new Error("Not impemented."); return null;
}
/**
 * Promotes or demotes an attribute from one geometry level to another.
 * @param __model__
 * @param name Attribute name to be promoted or demoted.
 * @param from Positions, vertices, edges, wires, faces or collections.
 * @param to Positions, vertices, edges, wires, faces or collections.
 * @param method Maximum, minimum, average, mode, median, sum, sum of squares, root mean square, first match or last match.
 * @returns List of attributes.
 * @example attribpro1 = attrib.Promote (colour, positions, faces, sum)
 */
export function Promote(__model__: GIModel, name: string, from: EAttribTypes, to: EAttribTypes, method: EOpPromote): TId[] {
    throw new Error("Not implemented.");
}
/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param query @Attributes #Entities: Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @returns List of id.
 * @example query1 = attrib.Query (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function Query(__model__: GIModel, query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param query @Attributes #Entities: Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @returns List of number of entities.
 * @example queryNum1 = attrib.QueryNumber (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function QueryNumber(__model__: GIModel, query: TQuery): TId[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Gets the xyz coordinates of a list of one or more positions.
 * @param __model__
 * @param positions List of one or more positions.
 * @returns List of one or more coordinates.
 * @example coord1 = attrib.GetCoordinates ([position1, position2])
 * @example_info Expected result could be [[1,2,3],[4,5,6]].
 */
export function GeTxyzinates(__model__: GIModel, positions: TId|TId[]): Txyz|Txyz[] {
    throw new Error("Not impemented."); return null;
}
