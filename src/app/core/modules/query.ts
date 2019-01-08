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
 * Returns a list of entities based on a query expression.
 * The query expression should follow the following format: #@name == value,
 * where 'name' is the attribute name, and 'value' is the attribute value.
 * If the attribute value is a string, then in must be in qoutes, as follows: #@name == 'str_value'.
 * The '==' is the comparison operator. The other comparison operators are: !=, >, >=, <, =<.
 * Entities can be search using multiple query expressions, as follows:  #@name1 == value1 &&  #@name2 == value2.
 * Query expressions can be combine with either && (and) and || (or), where
 * && takes precedence over ||.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param query_expr Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @returns List of id.
 * @example positions = query.Get(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns a list of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], query_expr: TQuery): TId[] {
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
    if (query_expr === null || query_expr === undefined) {
        return found_entities_i.map( entity_i => select_ent_type_str + entity_i);
    }
    // do the query on the list of entities
    const query_result: number[] = __model__.attribs.query.queryAttribs(select_ent_type_str, query_expr, found_entities_i);
    return query_result.map( entity_i => select_ent_type_str + entity_i);
}
/**
 * Returns the number of entities based on a query expression.
 * The query expression should follow the following format: #@name == value,
 * where 'name' is the attribute name, and 'value' is the attribute value.
 * If the attribute value is a string, then in must be in qoutes, as follows: #@name == 'str_value'.
 * The '==' is the comparison operator. The other comparison operators are: !=, >, >=, <, =<.
 * Entities can be search using multiple query expressions, as follows:  #@name1 == value1 &&  #@name2 == value2.
 * Query expressions can be combine with either && (and) and || (or), where
 * && takes precedence over ||.
 * 
 * @param __model__
 * @param select Enum, specifies what type of entities are to be counted.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param query_expr Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @returns Number of entities.
 * @example num_ents = query.Count(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns the number of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Count(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], query_expr: TQuery): number {
    // --- Error Check ---
    checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], 'all');
    // --- Error Check ---
    return Get(__model__, select, entities, query_expr).length;
}
export enum _ESortMethod {
    'DESCENDING' = 'descending',
    'ASCENDING' = 'ascending'
}
/**
 * Sorts entities based on a sort expression.
 * The sort expression should follow the following format: #@name, where 'name' is the attribute name.
 * Entities can be sorted using multiple sort expresssions as follows: #@name1 && #@name2.
 * If the attributes is a list, and index can also be specified as follows: #@name1[index].
 * @param __model__
 * @param select Enum, specifies what type of entities are to be counted.
 * @param entities List of entities to be searched. If 'null' (without quotes), list of all entities in the model.
 * @param sort_expr Attribute condition. If 'null' (without quotes), no condition is set; list of all search entities is returned.
 * @param method Enum
 * @returns Sorted entities.
 * @example sorted_list = query.Sort(positions, polyline1, #@xyz[2], descending)
 * @example_info Returns a list of positions in polyline1, sorted according to the descending z value.
 */
export function Sort(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], sort_expr: TQuery, method: _ESortMethod): TId[] {
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
    if (sort_expr === null || sort_expr === undefined) {
        found_entities_i.sort();
        if (method === _ESortMethod.ASCENDING) {
            found_entities_i.reverse();
        }
        return found_entities_i.map( entity_i => select_ent_type_str + entity_i);
    }
    // do the sort on the list of entities
    const _sort_method: ESort = (method === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sort_result: number[] = __model__.attribs.query.sortByAttribs(
        select_ent_type_str, sort_expr, found_entities_i, _sort_method);
    return sort_result.map( entity_i => select_ent_type_str + entity_i);
}
