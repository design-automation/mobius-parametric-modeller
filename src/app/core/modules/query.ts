import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntityTypeStr } from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import { checkIDs } from './_check_args';

// TQuery should be something like this:
//
// #@name != value
// #@name1 > 10 || #@name2 < 5 && #@name3 == 'red'
// #@xyz[2] > 5
//

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

// /**
//  * Queries the id of any entity based on attribute name.
//  * @param __model__
//  * @param select Enum, specifies what type of entities will be returned.
//  * @param entities List of entities to be searched,
//  * @returns List of id.
//  * @example query1 = attrib.Query (@Colour==Grey, #face, *normal==[0,0,1])
//  */
// export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[]): TId[] {
//     // --- Error Check ---
//     // checkIDs('query.Get', 'entities', entities, ['isID', 'isIDlist'], 'all');
//     // --- Error Check ---
//     // get the select ent_type_str
//     const select_ent_type_str: EEntityTypeStr = _convertSelectToEEntityTypeStr(select);
//     // get the list of entities
//     const found_entities_i: number[] = [];
//     if (!Array.isArray(entities)) { entities = [entities]; }
//     for (const entity_id of entities) {
//         const [curr_ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entity_id);
//         found_entities_i.push(...__model__.geom.query.navAnyToAny(curr_ent_type_str, select_ent_type_str, index));
//     }
//     return found_entities_i.map( entity_i => select_ent_type_str + entity_i );
// }
// /**
//  * Queries the id of any entity based on attribute name.
//  * @param __model__
//  * @param select Enum, specifies what type of entities will be returned.
//  * @returns List of id.
//  * @example query1 = attrib.GetAll ('positions', #@abc >= 10)
//  */
// export function GetAll(__model__: GIModel, select: _EQuerySelect): TId[] {
//     const select_ent_type_str: EEntityTypeStr = _convertSelectToEEntityTypeStr(select);
//     return __model__.geom.query.getEnts(select_ent_type_str).map( entity_i => select_ent_type_str + entity_i );
// }
/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be searched.
 * @param attrib_query Attribute condition.
 * @returns List of id.
 * @example query1 = query.Get(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns a list of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery): TId[] {
    // get the select ent_type_str
    const select_ent_type_str: EEntityTypeStr = _convertSelectToEEntityTypeStr(select);
    // get the list of entities
    const found_entities_i: number[] = [];
    if (entities === null || entities === undefined) {
        // skip Error Check
        found_entities_i.push(...__model__.geom.query.getEnts(select_ent_type_str));
    } else {
        // --- Error Check ---
        checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], 'all');
        // --- Error Check ---
        if (!Array.isArray(entities)) { entities = [entities]; }
        for (const entity_id of entities) {
            const [curr_ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entity_id);
            found_entities_i.push(...__model__.geom.query.navAnyToAny(curr_ent_type_str, select_ent_type_str, index));
        }
    }
    // check if the query is null
    if (attrib_query === null || attrib_query === undefined) {
        return found_entities_i.map( entity_i => select_ent_type_str + entity_i);
    }
    // do the query on the list of entities
    const query_result: number[] = __model__.attribs.query.queryAttribs(select_ent_type_str, attrib_query, found_entities_i);
    return query_result.map( entity_i => select_ent_type_str + entity_i);
}
// /**
//  * Queries the id of any entity based on attribute name.
//  * @param __model__
//  * @param select Enum, specifies what type of entities will be returned.
//  * @param attrib_query
//  * @returns List of id.
//  * @example query1 = attrib.GetAll ('positions', #@abc >= 10)
//  */
// export function SearchAll(__model__: GIModel, select: _EQuerySelect, attrib_query: TQuery): TId[] {
//     const select_ent_type_str: EEntityTypeStr = _convertSelectToEEntityTypeStr(select);
//     const query_result: number[] = __model__.attribs.query.queryAttribs(select_ent_type_str, attrib_query);
//     return query_result.map( entity_i => select_ent_type_str + entity_i);
// }
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities are to be counted.
 * @param entities List of entities to be searched.
 * @param attrib_query Attribute condition.
 * @returns Number of entities.
 * @example queryNum1 = query.Count(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns the number of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Count(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery): number {
    // --- Error Check ---
    checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], 'all');
    // --- Error Check ---
    return Get(__model__, select, entities, attrib_query).length;
}
// /**
//  * Queries the number of any entity based on attribute name.
//  * @param __model__
//  * @param select Enum
//  * @param attrib_query
//  * @returns List of number of entities.
//  * @example query_num = query1 = attrib.CountAll ('positions', #@abc >= 10)
//  */
// export function CountAll(__model__: GIModel, select: _EQuerySelect, attrib_query: TQuery): number {
//    return SearchAll(__model__, select, attrib_query).length;
// }
