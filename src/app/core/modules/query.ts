import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx } from '@libs/geo-info/common';
import { idBreak, idIndicies, idMake } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes } from './_check_args';

// TQuery should be something like this:
//
// #@name != value
// #@name1 > 10 || #@name2 < 5 && #@name3 == 'red'
// #@xyz[2] > 5
//
// ================================================================================================
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
function _convertSelectToEEntTypeStr(select: _EQuerySelect): EEntType {
    switch (select) {
        case _EQuerySelect.POSI:
            return EEntType.POSI;
        case _EQuerySelect.VERT:
            return EEntType.VERT;
        case _EQuerySelect.EDGE:
            return EEntType.EDGE;
        case _EQuerySelect.WIRE:
            return EEntType.WIRE;
        case _EQuerySelect.FACE:
            return EEntType.FACE;
        case _EQuerySelect.POINT:
            return EEntType.POINT;
        case _EQuerySelect.PLINE:
            return EEntType.PLINE;
        case _EQuerySelect.PGON:
            return EEntType.PGON;
        case _EQuerySelect.COLL:
            return EEntType.COLL;
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
// ================================================================================================
/**
 * Returns a list of entities based on a query expression.
 * The query expression should follow the following format: #@name == value,
 * where 'name' is the attribute name, and 'value' is the attribute value.
 * If the attribute value is a string, then in must be in qoutes, as follows: #@name == 'str_value'.
 * The '==' is the comparison operator. The other comparison operators are: !=, >, >=, <, =<.
 * Entities can be search using multiple query expressions, as follows:  #@name1 == value1 &&  #@name2 == value2.
 * Query expressions can be combined with either && (and) and || (or), where
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
    // get the select ent_type
    const select_ent_type: EEntType = _convertSelectToEEntTypeStr(select);
    // get the list of entities
    const found_entities_i: number[] = [];
    if (entities === null || entities === undefined) {
        // skip Error Check
        found_entities_i.push(...__model__.geom.query.getEnts(select_ent_type));
    } else {
        // --- Error Check ---
        let ents_arr = checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], null);
        // --- Error Check ---
        if (!Array.isArray(ents_arr[0])) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
        for (const ents of ents_arr) {
            found_entities_i.push(...__model__.geom.query.navAnyToAny(ents[0], select_ent_type, ents[1]));
        }
    }
    // check if the query is null
    if (query_expr === null || query_expr === undefined) {
        return found_entities_i.map( entity_i => idMake(select_ent_type, entity_i));
    }
    // do the query on the list of entities
    const query_result: number[] = __model__.attribs.query.queryAttribs(select_ent_type, query_expr, found_entities_i);
    return query_result.map( entity_i => idMake(select_ent_type, entity_i) );
}
// ================================================================================================
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
    // if (entities !== null && entities !== undefined) {
    //     checkIDs('query.Count', 'entities', entities, ['isID', 'isIDList'], null);
    // }
    // --- Error Check ---
    return Get(__model__, select, entities, query_expr).length; // Check done in Get
}
// ================================================================================================
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
 * @param method Enum.
 * @returns Sorted entities.
 * @example sorted_list = query.Sort(positions, polyline1, #@xyz[2], descending)
 * @example_info Returns a list of positions in polyline1, sorted according to the descending z value.
 */
export function Sort(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], sort_expr: TQuery, method: _ESortMethod): TId[] {
    // get the select ent_type
    const select_ent_type: EEntType = _convertSelectToEEntTypeStr(select);
    // get the list of entities
    const found_entities_i: number[] = [];
    if (entities === null || entities === undefined) {
        // skip Error Check
        found_entities_i.push(...__model__.geom.query.getEnts(select_ent_type));
    } else {
        // --- Error Check ---
        let ents_arr = checkIDs('query.Sort', 'entities', entities, ['isID', 'isIDList'], null);
        // --- Error Check ---
        if (!Array.isArray(ents_arr[0])) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
        for (const ents of ents_arr) {
            found_entities_i.push(...__model__.geom.query.navAnyToAny(ents[0], select_ent_type, ents[1]));
        }
    }
    // check if the query is null
    if (sort_expr === null || sort_expr === undefined) {
        found_entities_i.sort();
        if (method === _ESortMethod.ASCENDING) {
            found_entities_i.reverse();
        }
        return found_entities_i.map( entity_i => idMake(select_ent_type, entity_i));
    }
    // do the sort on the list of entities
    const _sort_method: ESort = (method === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sort_result: number[] = __model__.attribs.query.sortByAttribs(
        select_ent_type, sort_expr, found_entities_i, _sort_method);
    return sort_result.map( entity_i => idMake(select_ent_type, entity_i));
}
// ================================================================================================
function _isClosed(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): boolean|boolean[] {
    if (!Array.isArray(ents_arr[0])) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type !== EEntType.WIRE) {
            throw new Error('query.isClosed: Entity is of wrong type. It must be either a polyline or a wire.');
        }
        return __model__.geom.query.istWireClosed(wire_i) as boolean;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ents => _isClosed(__model__, ents)) as boolean[];
    }
}
/**
 * Checks if polyline(s) or wire(s) are closed.
 * @param __model__
 * @param lines Polyline(s) or wire(s).
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsClosed([polyline1,polyline2,polyline3])
 * @example_info Returns list [true,true,false] if polyline1 and polyline2 are closed but polyline3 is open.
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    // --- Error Check ---
    const ents_arr = checkIDs('query.isClosed', 'lines', lines, ['isID', 'isIDList'], ['PLINE', 'WIRE']);
    // --- Error Check ---
    return _isClosed(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}
// ================================================================================================
/**
 * Checks if a wire, polyline, face, or polygon is planar.
 * @param __model__
 * @param entities Wire, polyline, face, or polygon.
 * @param tolerance
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsPlanar([polyline1,polyline2,polyline3])
 * @example_info Returns list [true,true,false] if polyline1 and polyline2 are planar but polyline3 is not planar.
 */
export function IsPlanar(__model__: GIModel, entities: TId|TId[], tolerance: number): boolean|boolean[] {
    // --- Error Check ---
    // const fn_name = 'query.isPlanar';
    // const ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], ['PLINE', 'WIRE']);
    // checkCommTypes(fn_name, 'tolerance', tolerance, ['isNumber']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
// ================================================================================================
/**
 * Returns a list of welded neighbours of eny entity
 * @param __model__
 * @param select Enum, select the types of neighbours to return
 * @param entities Everything except positions (which cannot have neighbours).
 * @returns A list of welded neighbours
 * @example mod.Neighbours([polyline1,polyline2,polyline3])
 * @example_info Returns list of entities that are welded to polyline1 and polyline2.
 */
export function Neighbours(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[]): TId[] {
    // --- Error Check ---
    let ents_arr = checkIDs('modify.isClosed', 'lines', entities, ['isID', 'isIDList'], ['PLINE', 'WIRE']);
    // --- Error Check ---
    const select_ent_type: EEntType = _convertSelectToEEntTypeStr(select);
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    const all_nbor_ents_i: Set<number> = new Set();
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx ;
        const nbor_ents_i: number[] = __model__.geom.query.neighbours(ent_type, select_ent_type, index);
        nbor_ents_i.forEach(nbor_ent_i => all_nbor_ents_i.add(nbor_ent_i));
    }
    return Array.from(all_nbor_ents_i).map(nbor_ent_i => idMake(select_ent_type, nbor_ent_i));
}
// ================================================================================================
