import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx } from '@libs/geo-info/common';
import { idsMake } from '@libs/geo-info/id';
import { checkIDs } from './_check_args';

// TQuery should be something like this:
//
// #@name != value
// #@name1 > 10 || #@name2 < 5 && #@name3 == 'red'
// #@xyz[2] > 5
//
// ================================================================================================
// These are used by Get(), Count(), and Neighbours()
export enum _EQuerySelect {
    POSI =   'positions',
    VERT =   'vertices',
    EDGE =   'edges',
    WIRE =   'wires',
    FACE =   'faces',
    POINT =  'points',
    PLINE =  'polylines',
    PGON =   'polygons',
    COLL =   'collections',
    OBJS =   'objects',
    TOPOS =  'topologies',
    ALL =    'all'
}
function _convertSelectToEEntTypeStr(select: _EQuerySelect): EEntType|EEntType[] {
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
        case _EQuerySelect.OBJS:
            return [
                EEntType.POINT,
                EEntType.PLINE,
                EEntType.PGON
            ];
        case _EQuerySelect.TOPOS:
            return [
                EEntType.VERT,
                EEntType.EDGE,
                EEntType.WIRE,
                EEntType.FACE
            ];
        case _EQuerySelect.ALL:
            return [
                EEntType.POSI,
                EEntType.VERT,
                EEntType.EDGE,
                EEntType.WIRE,
                EEntType.FACE,
                EEntType.POINT,
                EEntType.PLINE,
                EEntType.PGON,
                EEntType.COLL
            ];
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
// ================================================================================================
function _get(__model__: GIModel, select_ent_types: EEntType|EEntType[],
              ents_arr: TEntTypeIdx|TEntTypeIdx[], query_expr: TQuery): TEntTypeIdx[] {
    if (!Array.isArray(select_ent_types)) {
        const select_ent_type: EEntType = select_ent_types as EEntType;
        // get the list of entities
        const found_entities_i: number[] = [];
        if (ents_arr === null || ents_arr === undefined) {
            found_entities_i.push(...__model__.geom.query.getEnts(select_ent_type));
        } else {
            if (!Array.isArray(ents_arr[0])) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
            for (const ents of ents_arr) {
                found_entities_i.push(...__model__.geom.query.navAnyToAny(ents[0], select_ent_type, ents[1]));
            }
        }
        // check if the query is null
        if (query_expr === null || query_expr === undefined) {
            return found_entities_i.map( entity_i => [select_ent_type, entity_i]) as TEntTypeIdx[];
        }
        // do the query on the list of entities
        const query_result: number[] = __model__.attribs.query.queryAttribs(select_ent_type, query_expr, found_entities_i);
        if (query_result.length === 0) { return []; }
        return query_result.map( entity_i => [select_ent_type, entity_i]) as TEntTypeIdx[];
    } else {
        const query_results_arr: TEntTypeIdx[] = [];
        for (const select_ent_type of select_ent_types) {
            const ent_type_query_results: TEntTypeIdx[] = _get(__model__, select_ent_type, ents_arr, query_expr);
            for (const query_result of ent_type_query_results) {
                query_results_arr.push(query_result);
            }
        }
        return query_results_arr;
    }
}
/**
 * Returns a list of entities based on a query expression.
 * The query expression should use the following format: #@name == value,
 * where 'name' is the attribute name, and 'value' is the attribute value that you are searching for.
 * If the attribute value is a string, then in must be in quotes, as follows: #@name == 'str_value'.
 * The '==' is the comparison operator. The other comparison operators are: !=, >, >=, <, =<.
 * Entities can be search using multiple query expressions, as follows:  #@name1 == value1 &&  #@name2 == value2.
 * Query expressions can be combined with either && (and) and || (or), where
 * && takes precedence over ||.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be searched. If 'null' (without quotes), all entities in the model will be searched.
 * @param query_expr Attribute condition. If 'null' (without quotes), no condition is set; all found entities are returned.
 * @returns List of entities whose type matches the type specified in 'select'.
 * @example positions = query.Get(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns a list of positions defined by polyline1 where the z-coordinate is more than 10.
 */
export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], query_expr: TQuery): TId[] {
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // TODO check the query string
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _convertSelectToEEntTypeStr(select);
    const found_ents_arr: TEntTypeIdx[] = _get(__model__, select_ent_types, ents_arr, query_expr);
    return idsMake(found_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Returns the number of entities based on a query expression.
 * The query expression should use the following format: #@name == value,
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
export function _neighbours(__model__: GIModel,  select_ent_types: EEntType|EEntType[],
    ents_arr: TEntTypeIdx|TEntTypeIdx[]): TEntTypeIdx[] {
    if (!Array.isArray(select_ent_types)) {
        const select_ent_type: EEntType = select_ent_types as EEntType;
        if (!Array.isArray(ents_arr[0])) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        }
        const all_nbor_ents_i: Set<number> = new Set();
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx ;
            const nbor_ents_i: number[] = __model__.geom.query.neighbours(ent_type, select_ent_type, index);
            nbor_ents_i.forEach(nbor_ent_i => all_nbor_ents_i.add(nbor_ent_i));
        }
        return Array.from(all_nbor_ents_i).map(nbor_ent_i => [select_ent_type, nbor_ent_i]) as TEntTypeIdx[];
    } else {
        const query_results: TEntTypeIdx[] = [];
        for (const select_ent_type of select_ent_types) {
            query_results.push(..._neighbours(__model__, select_ent_type, ents_arr));
        }
        return query_results;
    }
}
/**
* Returns a list of welded neighbours of any entity
* @param __model__
* @param select Enum, select the types of neighbours to return
* @param entities List of entities.
* @returns A list of welded neighbours
* @example mod.Neighbours([polyline1,polyline2,polyline3])
* @example_info Returns list of entities that are welded to polyline1 and polyline2.
*/
export function Neighbours(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[]): TId[] {
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _convertSelectToEEntTypeStr(select);
    const found_ents_arr: TEntTypeIdx[] = _neighbours(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as TId[];
}
// ================================================================================================
function _sort(__model__: GIModel, ents_arr: TEntTypeIdx[], sort_expr: TQuery, method: ESort): TEntTypeIdx[] {
    // get the list of ents_i
    const ent_type: EEntType = ents_arr[0][0];
    const ents_i: number[] = ents_arr.filter( ent_arr => ent_arr[0] === ent_type ).map( ent_arr => ent_arr[1] );
    // check if the sort expression is null
    if (sort_expr === null || sort_expr === undefined) {
        ents_i.sort();
        if (method === ESort.ASCENDING) {
            ents_i.reverse();
        }
        return ents_i.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
    }
    // do the sort on the list of entities
    const sort_result: number[] = __model__.attribs.query.sortByAttribs(ent_type, ents_i, sort_expr, method);
    return sort_result.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
}
export enum _ESortMethod {
    'DESCENDING' = 'descending',
    'ASCENDING' = 'ascending'
}
/**
 * Sorts entities based on a sort expression.
 * The sort expression should use the following format: #@name, where 'name' is the attribute name.
 * Entities can be sorted using multiple sort expresssions as follows: #@name1 && #@name2.
 * If the attribute is a list, and index can also be specified as follows: #@name1[index].
 * @param __model__
 * @param entities List of two or more entities to be sorted, all of the same entity type.
 * @param sort_expr Attribute condition. If 'null' (without quotes), entities will be sorted based on their ID.
 * @param method Enum, sort descending or ascending.
 * @returns Sorted entities.
 * @example sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)
 * @example_info Returns a list of three positions, sorted according to the descending z value.
 */
export function Sort(__model__: GIModel, entities: TId[], sort_expr: TQuery, method: _ESortMethod): TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('query.Sort', 'entities', entities, ['isIDList'], null) as TEntTypeIdx[];
    // TODO check the sort expression
    // --- Error Check ---
    const sort_method: ESort = (method === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sorted_ents_arr: TEntTypeIdx[] = _sort(__model__, ents_arr, sort_expr, sort_method);
    return idsMake(sorted_ents_arr) as TId[];
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
export function _IsPlanar(__model__: GIModel, entities: TId|TId[], tolerance: number): boolean|boolean[] {
    // --- Error Check ---
    // const fn_name = 'query.isPlanar';
    // const ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], ['PLINE', 'WIRE']);
    // checkCommTypes(fn_name, 'tolerance', tolerance, ['isNumber']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
// ================================================================================================
