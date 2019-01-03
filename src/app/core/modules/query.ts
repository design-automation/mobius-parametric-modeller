import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntityTypeStr } from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import { checkIDs } from './_check_args';

export enum _EQuerySelect {
    POSI =   'positions',
    VERT =   'vertices',
    EDGE =   'edges',
    WIRE =   'wires',
    FACE =   'faces',
    POINT =  'points',
    PLINE =  'polylines',
    PGON =   'polygons',
    COLL =   'collections'
}
function _convertSelectToEEntityTypeStr(select: _EQuerySelect): EEntityTypeStr {
    switch (select) {
        case _EQuerySelect.POSI:
            return EEntityTypeStr.POSI;
        case _EQuerySelect.VERT:
            return EEntityTypeStr.VERT;
        case _EQuerySelect.EDGE:
            return EEntityTypeStr.EDGE;
        case _EQuerySelect.WIRE:
            return EEntityTypeStr.WIRE;
        case _EQuerySelect.FACE:
            return EEntityTypeStr.FACE;
        case _EQuerySelect.POINT:
            return EEntityTypeStr.POINT;
        case _EQuerySelect.PLINE:
            return EEntityTypeStr.PLINE;
        case _EQuerySelect.PGON:
            return EEntityTypeStr.PGON;
        case _EQuerySelect.COLL:
            return EEntityTypeStr.COLL;
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be searched,
 * @param attrib_query
 * @returns List of id.
 * @example query1 = attrib.Query (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery): TId[] {
    // --- Error Check ---
    checkIDs('query.Get', 'entities', entities, ['isID', 'isIDlist'], 'all');
    // --- Error Check ---

    // const result = __model__.attribs.query.queryAttribs(query);
    // console.log(result);
    throw new Error('Not impemented.'); return null;
}
/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param attrib_query
 * @returns List of id.
 * @example query1 = attrib.GetAll ('positions', #@abc >= 10)
 */
export function GetAll(__model__: GIModel, select: _EQuerySelect, attrib_query: TQuery): TId[] {
    const ent_type_str: EEntityTypeStr = _convertSelectToEEntityTypeStr(select);
    const query_result: number[] = __model__.attribs.query.queryAttribs(ent_type_str, attrib_query);
    return query_result.map( entity_i => ent_type_str + entity_i);
}
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param select Enum
 * @param entities
 * @param attrib_query
 * @returns List of number of entities.
 * @example queryNum1 = attrib.QueryNumber (@Colour==Grey, #face, *normal==[0,0,1])
 */
export function Count(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery): number {
    // --- Error Check ---
    checkIDs('query.Get', 'entities', entities, ['isID', 'isIDlist'], 'all');
    // --- Error Check ---
    return Get(__model__, select, entities, attrib_query).length;
}
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param select Enum
 * @param attrib_query
 * @returns List of number of entities.
 * @example query_num = query1 = attrib.CountAll ('positions', #@abc >= 10)
 */
export function CountAll(__model__: GIModel, select: _EQuerySelect, attrib_query: TQuery): number {
   return GetAll(__model__, select, attrib_query).length;
}
