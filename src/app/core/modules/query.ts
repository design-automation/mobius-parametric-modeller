import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntityTypeStr, ESort } from '@libs/geo-info/common';
import { idBreak, idIndicies } from '@libs/geo-info/id';
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
/**
 * Queries the id of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param attrib_query Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @returns List of id.
 * @example positions = query.Get(positions, polyline1, #@xyz[2]>10)
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
/**
 * Queries the number of any entity based on attribute name.
 * @param __model__
 * @param select Enum, specifies what type of entities are to be counted.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param attrib_query Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @returns Number of entities.
 * @example num_ents = query.Count(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns the number of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Count(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery): number {
    // --- Error Check ---
    checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], 'all');
    // --- Error Check ---
    return Get(__model__, select, entities, attrib_query).length;
}
export enum _ESortMethod {
    'DESCENDING' = 'descending',
    'ASCENDING' = 'ascending'
}
/**
 * Sorts entities
 * @param __model__
 * @param select Enum, specifies what type of entities are to be counted.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param attrib_query Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @param method Enum
 * @returns Sorted entities.
 * @example sorted_list = query.Sort(positions, polyline1, #@xyz[2])
 * @example_info Returns the number of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Sort(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], attrib_query: TQuery, method: _ESortMethod): TId[] {
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
        found_entities_i.sort();
        if (method === _ESortMethod.ASCENDING) {
            found_entities_i.reverse();
        }
        return found_entities_i.map( entity_i => select_ent_type_str + entity_i);
    }
    // do the sort on the list of entities
    const _sort_method: ESort = (method === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sort_result: number[] = __model__.attribs.query.sortByAttribs(
        select_ent_type_str, attrib_query, found_entities_i, _sort_method);
    return sort_result.map( entity_i => select_ent_type_str + entity_i);
}
