/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * ~
 * ~
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, ESort, TEntTypeIdx, EFilterOperatorTypes, TAttribDataTypes} from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj } from '../_check_args';

// ================================================================================================

export enum _EEntTypeEnum {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    FACE =   '_f',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co'
}
function _entType(select: _EEntTypeEnum): EEntType|EEntType[] {
    switch (select) {
        case _EEntTypeEnum.POSI:
            return EEntType.POSI;
        case _EEntTypeEnum.VERT:
            return EEntType.VERT;
        case _EEntTypeEnum.EDGE:
            return EEntType.EDGE;
        case _EEntTypeEnum.WIRE:
            return EEntType.WIRE;
        case _EEntTypeEnum.FACE:
            return EEntType.FACE;
        case _EEntTypeEnum.POINT:
            return EEntType.POINT;
        case _EEntTypeEnum.PLINE:
            return EEntType.PLINE;
        case _EEntTypeEnum.PGON:
            return EEntType.PGON;
        case _EEntTypeEnum.COLL:
            return EEntType.COLL;
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
// ================================================================================================
// ================================================================================================
/**
 * Get entities from a list of entities.
 * For example, you can get the position entities from a list of polygon entities.
 * ~
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * ~
 * The resulting list of entities will not contain duplicate entities.
 * ~
 * @param __model__
 * @param ent_type_enum Enum, the type of entity to get.
 * @param entities Optional, list of entities to get entities from, or null to get all entities in the model.
 * @returns Entities, a list of entities.
 * @example positions = query.Get('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are part of polyline1 and polyline2.
 */
export function Get(__model__: GIModel, ent_type_enum: _EEntTypeEnum, entities: TId|TId[]): TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // get the entity type // TODO deal with nultiple ent types
    const ent_type: EEntType = _entType(ent_type_enum) as EEntType;
    // if ents_arr is null, then get all entities in the model of type ent_type
    if (ents_arr === null) {
        ents_arr = ents_arr as TEntTypeIdx[];
        const ents_i: number[] = __model__.geom.query.getEnts(ent_type, false);
        ents_arr = ents_i.map(ent_i => [ent_type, ent_i]) as TEntTypeIdx[];
    }
    if (isEmptyArr(ents_arr)) { return []; }
    // make sure that the ents_arr is at least depth 2
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
    ents_arr = ents_arr as TEntTypeIdx[]|TEntTypeIdx[][];
    // get the entities
    const found_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][] = _get(__model__, ent_type, ents_arr);
    // return the result
    return idsMake(found_ents_arr) as TId[]|TId[][];
}
function _get(__model__: GIModel, ent_type: EEntType, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[]|TEntTypeIdx[][] {
    if (ents_arr.length === 0) { return []; }
    // do the query
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr as TEntTypeIdx[];
        // get the list of entities that are found
        const found_ents_i_set: Set<number> = new Set();
        for (const ent_arr of ents_arr) {
            const ents_i: number[] = __model__.geom.query.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]);
            for (const ent_i of ents_i) {
                found_ents_i_set.add(ent_i);
            }
        }
        // return the found ents
        const found_ents_i: number[] = Array.from(found_ents_i_set);
        return found_ents_i.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
    } else { // depth === 3
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _get(__model__, ent_type, ents_arr_item)) as TEntTypeIdx[][];
    }
}
// ================================================================================================
/**
 * Filter entities based on a query.
 * ~
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * ~
 * The filter expression can use the following format: ab#@name == value, where
 * 'ab' is the two letter identifier of the entity type ('ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co')
 * 'name' is the attribute name, and
 * 'value' is the attribute value that you are searching for.
 * ~
 * If the attribute value is a string, then in must be in quotes, e.g.: pg#@name == 'str_value'.
 * ~
 * If the attribute value is a number, then any comparison operator can be used: ==, !=, >, >=, <, =<.
 * ~
 * If the attribute value is a list, then a list index can be used, e.g.: ps#@xyz[2] > 10.
 * ~
 * @param __model__
 * @param entities List of entities to filter, or null..
 * @param name The attribute name to use for filtering.
 * @param index Optional, attribute index to use for filtering (for attributes that are lists), or null to filter all entities the model.
 * @param operator_enum Enum, the operator to use for filtering
 * @param value The attribute value to use for filtering.
 * @returns Entities, a list of entities that match the conditions specified in 'expr'.
 * @example positions = query.Get(polyline1, ps#@xyz[2]>10)
 * @example_info Returns a list of positions that are part of polyline1 where the z-coordinate is more than 10.
 * @example positions = query.Get(null, ps#@xyz[2]>10)
 * @example_info Returns a list of positions in the model where the z-coordinate is more than 10.
 * @example positions = query.Get(polyline1, ps#)
 * @example_info Returns a list of all of the positions that are part of polyline1.
 * @example polylines = query.Get(position1, pl#)
 * @example_info Returns a list of all of the polylines that use position1.
 * @example collections = query.Get(null, co#@type=="floors")
 * @example_info Returns a list of all the collections that have an attribute called "type" with a value "floors".
 */
export function Filter(__model__: GIModel, entities: TId|TId[],
        name: string, index: number, operator_enum: _EFilterOperator, value: TAttribDataTypes): TId[]|TId[][] {
    if (entities === null) { return []; }
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // make sure that the ents_arr is at least depth 2
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
    ents_arr = ents_arr as TEntTypeIdx[]|TEntTypeIdx[][];
    // get the oeprator
    const op_type: EFilterOperatorTypes = _filterOperator(operator_enum);
    // do the query
    const found_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][] = _filter(__model__, ents_arr, name, index, op_type, value);
    // return the result
    return idsMake(found_ents_arr) as TId[]|TId[][];
}
export enum _EFilterOperator {
    IS_EQUAL =              '==',
    IS_NOT_EQUAL =          '!=',
    IS_GREATER_OR_EQUAL =   '>=',
    IS_LESS_OR_EQUAL =      '<=',
    IS_GREATER =            '>',
    IS_LESS =               '<',
    EQUAL =                 '='
}
function _filterOperator(select: _EFilterOperator): EFilterOperatorTypes {
    switch (select) {
        case _EFilterOperator.IS_EQUAL:
            return EFilterOperatorTypes.IS_EQUAL;
        case _EFilterOperator.IS_NOT_EQUAL:
            return EFilterOperatorTypes.IS_NOT_EQUAL;
        case _EFilterOperator.IS_GREATER_OR_EQUAL:
            return EFilterOperatorTypes.IS_GREATER_OR_EQUAL;
        case _EFilterOperator.IS_LESS_OR_EQUAL:
            return EFilterOperatorTypes.IS_LESS_OR_EQUAL;
        case _EFilterOperator.IS_GREATER:
            return EFilterOperatorTypes.IS_GREATER;
        case _EFilterOperator.IS_LESS:
            return EFilterOperatorTypes.IS_LESS;
        default:
            throw new Error('Query operator type not recognised.');
    }
}
function _filter(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][],
        name: string, index: number, op_type: EFilterOperatorTypes, value: TAttribDataTypes): TEntTypeIdx[]|TEntTypeIdx[][] {
    if (ents_arr.length === 0) { return []; }
    // do the query
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr as TEntTypeIdx[];
        const ent_type: EEntType = ents_arr[0][0];
        // get the list of entities
        const found_ents_i: number[] = [];
        for (const ent_arr of ents_arr) {
            found_ents_i.push(...__model__.geom.query.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]));
        }
        // do the query on the list of entities
        const query_result: number[] = __model__.attribs.query.filterByAttribs(ent_type, found_ents_i, name, index, op_type, value);
        if (query_result.length === 0) { return []; }
        return query_result.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
    } else { // depth === 3
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _filter(__model__, ents_arr_item, name, index, op_type, value)) as TEntTypeIdx[][];
    }
}
// ================================================================================================
/**
 * Returns a list of entities that are not part of the specified entities.
 * For example, you can get the position entities that are not part of a list of polygon entities.
 * ~
 * This function does the opposite of query.Get().
 * While query.Get() gets entities that are part of of the list of entities,
 * this function gets the entities that are not part of the list of entities.
 * ~
 * @param __model__
 * @param ent_type_enum Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be excluded.
 * @returns Entities, a list of entities that match the type specified in 'ent_type_enum', and that are not in entities.
 * @example positions = query.Invert('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are not part of polyline1 and polyline2.
 */
export function Invert(__model__: GIModel, ent_type_enum: _EEntTypeEnum, entities: TId|TId[]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Invert', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _entType(ent_type_enum);
    const found_ents_arr: TEntTypeIdx[] = _invert(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as TId[];
}
function _invert(__model__: GIModel, select_ent_types: EEntType|EEntType[], ents_arr: TEntTypeIdx|TEntTypeIdx[]): TEntTypeIdx[] {
    if (!Array.isArray(select_ent_types)) {
        const select_ent_type: EEntType = select_ent_types as EEntType;
        // get the ents to exclude
        if (!Array.isArray(ents_arr[0])) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
        const excl_ents_i: number[] = (ents_arr as TEntTypeIdx[])
            .filter(ent_arr => ent_arr[0] === select_ent_type).map(ent_arr => ent_arr[1]);
        // get the list of entities
        const found_entities_i: number[] = [];
        const ents_i: number[] = __model__.geom.query.getEnts(select_ent_type, false);
        for (const ent_i of ents_i) {
            if (excl_ents_i.indexOf(ent_i) === -1) { found_entities_i.push(ent_i); }
        }
        return found_entities_i.map( entity_i => [select_ent_type, entity_i]) as TEntTypeIdx[];
    } else {
        const query_results_arr: TEntTypeIdx[] = [];
        for (const select_ent_type of select_ent_types) {
            const ent_type_query_results: TEntTypeIdx[] = _invert(__model__, select_ent_type, ents_arr);
            for (const query_result of ent_type_query_results) {
                query_results_arr.push(query_result);
            }
        }
        return query_results_arr;
    }
}
export enum _ESortMethod {
    DESCENDING = 'descending',
    ASCENDING = 'ascending'
}
// ================================================================================================
/**
 * Sorts entities based on a sort expression.
 * ~
 * The sort expression should use the following format: #@name, where 'name' is the attribute name.
 * Entities can be sorted using multiple sort expresssions as follows: #@name1 && #@name2.
 * ~
 * If the attribute is a list, and index can also be specified as follows: #@name1[index].
 * ~
 * @param __model__
 * @param entities List of two or more entities to be sorted, all of the same entity type.
 * @param name Attribute name to use for sorting.
 * @param idx_or_key Optional, attribute index to use for sorting (for attributes that are lists), or null.
 * @param method_enum Enum, sort descending or ascending.
 * @returns Entities, a list of sorted entities.
 * @example sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)
 * @example_info Returns a list of three positions, sorted according to the descending z value.
 */
export function Sort(__model__: GIModel, entities: TId[], name: string, idx_or_key: number|string, method_enum: _ESortMethod): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const ents_arr = checkIDs('query.Sort', 'entities', entities, [IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // TODO check the sort expression
    // --- Error Check ---
    const sort_method: ESort = (method_enum === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sorted_ents_arr: TEntTypeIdx[] = _sort(__model__, ents_arr, name, idx_or_key, sort_method);
    return idsMake(sorted_ents_arr) as TId[];
}
function _sort(__model__: GIModel, ents_arr: TEntTypeIdx[], attrib_name: string, idx_or_key: number|string, method: ESort): TEntTypeIdx[] {
    // get the list of ents_i
    const ent_type: EEntType = ents_arr[0][0];
    const ents_i: number[] = ents_arr.filter( ent_arr => ent_arr[0] === ent_type ).map( ent_arr => ent_arr[1] );
    // check if we are sorting by '_id'
    if (attrib_name === '_id') {
        const ents_arr_copy: TEntTypeIdx[] = ents_arr.slice();
        ents_arr_copy.sort(_compareID);
        if (method === ESort.DESCENDING) { ents_arr_copy.reverse(); }
        return ents_arr_copy;
    }
    // do the sort on the list of entities
    const sort_result: number[] = __model__.attribs.query.sortByAttribs(ent_type, ents_i, attrib_name, idx_or_key, method);
    return sort_result.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
}
function _compareID(id1: TEntTypeIdx, id2: TEntTypeIdx): number {
    const [ent_type1, index1] = id1;
    const [ent_type2, index2] = id2;
    if (ent_type1 !== ent_type2) { return ent_type1 -  ent_type2; }
    if (index1 !== index2) { return index1 -  index2; }
    return 0;
}
// ================================================================================================
/**
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* ~
* @param __model__
* @param ent_type Enum, select the types of entities to return
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example mod.Perimeter('edges', [polygon1,polygon2,polygon])
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
export function Perimeter(__model__: GIModel, ent_type: _EEntTypeEnum, entities: TId|TId[]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Perimeter', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _entType(ent_type);
    const found_ents_arr: TEntTypeIdx[] = _perimeter(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as TId[];
}
export function _perimeter(__model__: GIModel,  select_ent_types: EEntType|EEntType[],
    ents_arr: TEntTypeIdx|TEntTypeIdx[]): TEntTypeIdx[] {
    if (!Array.isArray(select_ent_types)) {
        const select_ent_type: EEntType = select_ent_types as EEntType;
        if (!Array.isArray(ents_arr[0])) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        }
        // get an array of all edges
        const edges_i: number[] = [];
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx ;
            const edges_ent_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
            for (const edge_ent_i of edges_ent_i) {
                edges_i.push(edge_ent_i);
            }
        }
        // get the perimeter entities
        const all_perim_ents_i: number[] = __model__.geom.query.perimeter(select_ent_type, edges_i);
        return all_perim_ents_i.map(perim_ent_i => [select_ent_type, perim_ent_i]) as TEntTypeIdx[];
    } else {
        const query_results: TEntTypeIdx[] = [];
        for (const select_ent_type of select_ent_types) {
            query_results.push(..._perimeter(__model__, select_ent_type, ents_arr));
        }
        return query_results;
    }
}
// ================================================================================================
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* ~
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example mod.neighbor('edges', [polyline1,polyline2,polyline3])
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
export function Neighbor(__model__: GIModel, ent_type_enum: _EEntTypeEnum, entities: TId|TId[]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.neighbor', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _entType(ent_type_enum);
    const found_ents_arr: TEntTypeIdx[] = _neighbors(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as TId[];
}
export function _neighbors(__model__: GIModel,  select_ent_types: EEntType|EEntType[],
    ents_arr: TEntTypeIdx|TEntTypeIdx[]): TEntTypeIdx[] {
    if (!Array.isArray(select_ent_types)) {
        const select_ent_type: EEntType = select_ent_types as EEntType;
        if (!Array.isArray(ents_arr[0])) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        }
        // get an array of all vertices
        const verts_i: number[] = [];
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx ;
            const verts_ent_i: number[] = __model__.geom.query.navAnyToVert(ent_type, index);
            for (const vert_ent_i of verts_ent_i) {
                verts_i.push(vert_ent_i);
            }
        }
        console.log(verts_i);
        // get the neighbor entities
        const all_nbor_ents_i: number[] = __model__.geom.query.neighbor(select_ent_type, verts_i);
        return all_nbor_ents_i.map(nbor_ent_i => [select_ent_type, nbor_ent_i]) as TEntTypeIdx[];
    } else {
        const query_results: TEntTypeIdx[] = [];
        for (const select_ent_type of select_ent_types) {
            query_results.push(..._neighbors(__model__, select_ent_type, ents_arr));
        }
        return query_results;
    }
}
// ================================================================================================
/**
 * Checks the type of an entity.
 * ~
 * For is_used_posi, returns true if the entity is a posi, and it is used by at least one vertex.
 * For is_unused_posi, it returns the opposite of is_used_posi.
 * For is_object, returns true if the entity is a point, a polyline, or a polygon.
 * For is_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
 * For is_point_topology, is_polyline_topology, and is_polygon_topology, returns true
 * if the entity is a topological entity, and it is part of an object of the specified type.
 * ~
 * For is_open, returns true if the entity is a wire or polyline and is open. For is_closed, it returns the opposite of is_open.
 * For is_hole, returns ture if the entity is a wire, and it defines a hole in a face.
 * For has_holes, returns true if the entity is a face or polygon, and it has holes.
 * For has_no_holes, it returns the opposite of has_holes.
 *
 * @param __model__
 * @param entities An entity, or a list of entities.
 * @param type_query_enum Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
 */
export function Type(__model__: GIModel, entities: TId|TId[], type_query_enum: _ETypeQueryEnum): boolean|boolean[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'query.Type';
    const ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
function _isClosed(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): boolean|boolean[] {
    if (!Array.isArray(ents_arr[0])) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.PGON) {
            return true;
        } else if (ent_type !== EEntType.WIRE && ent_type !== EEntType.PLINE) {
            return false;
        }
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        }
        return __model__.geom.query.istWireClosed(wire_i) as boolean;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ents => _isClosed(__model__, ents)) as boolean[];
    }
}

export enum _ETypeQueryEnum {
    EXISTS = 'exists',
    IS_POSI =   'is_position',
    IS_USED_POSI = 'is_used_posi',
    IS_UNUSED_POSI = 'is_unused_posi',
    IS_VERT =   'is_vertex',
    IS_EDGE =   'is_edge',
    IS_WIRE =   'is_wire',
    IS_FACE =   'is_face',
    IS_POINT =  'is_point',
    IS_PLINE =  'is_polyline',
    IS_PGON =   'is_polygon',
    IS_COLL =   'is_collection',
    IS_OBJ =    'is_object',
    IS_TOPO =   'is_topology',
    IS_POINT_TOPO =   'is_point_topology',
    IS_PLINE_TOPO =   'is_polyline_topology',
    IS_PGON_TOPO =   'is_polygon_topology',
    IS_OPEN =      'is_open',
    IS_CLOSED =    'is_closed',
    IS_HOLE =      'is_hole',
    HAS_HOLES =    'has_holes',
    HAS_NO_HOLES = 'has_no_holes'
}
function _exists(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    return __model__.geom.query.entExists(ent_type, index);
}
function _isUsedPosi(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.POSI) {
        return false;
    }
    const verts_i: number[] = __model__.geom.query.navPosiToVert(index);
    if (verts_i === undefined || verts_i === null) {
        return false;
    }
    return verts_i.length > 0;
}
function _isObj(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.POINT || ent_type === EEntType.PLINE || ent_type === EEntType.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.FACE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.FACE) {
        const points_i: number[] = __model__.geom.query.navAnyToPoint(ent_type, index);
        if (points_i !== undefined && points_i !== null && points_i.length) { return true; }
    }
    return false;
}
function _isPlineTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.FACE) {
        const plines_i: number[] = __model__.geom.query.navAnyToPline(ent_type, index);
        if (plines_i !== undefined && plines_i !== null && plines_i.length) { return true; }
    }
    return false;
}
function _isPgonTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.FACE) {
        const pgons_i: number[] = __model__.geom.query.navAnyToPgon(ent_type, index);
        if (pgons_i !== undefined && pgons_i !== null && pgons_i.length) { return true; }
    }
    return false;
}
function _isClosed2(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.PGON) {
        return true;
    } else if (ent_type !== EEntType.WIRE && ent_type !== EEntType.PLINE) {
        return false;
    }
    let wire_i: number = index;
    if (ent_type === EEntType.PLINE) {
        wire_i = __model__.geom.query.navPlineToWire(index);
    }
    return __model__.geom.query.istWireClosed(wire_i) as boolean;
}
function _isHole(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.WIRE) {
        return false;
    }
    const face_i: number = __model__.geom.query.navWireToFace(index);
    if (face_i === undefined || face_i === null) {
        return false;
    }
    const wires_i: number[] = __model__.geom.query.navFaceToWire(face_i);
    return wires_i.indexOf(index) > 0;
}
function _hasNoHoles(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, index]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.FACE && ent_type !== EEntType.PGON) {
        return false;
    }
    let face_i: number = index;
    if (ent_type === EEntType.PGON) {
        face_i = __model__.geom.query.navPgonToFace(index);
    }
    const wires_i: number[] = __model__.geom.query.navFaceToWire(face_i);
    return wires_i.length === 1;
}
function _type(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], query_ent_type: _ETypeQueryEnum): boolean|boolean[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const [ent_type, _]: TEntTypeIdx = ent_arr;
        switch (query_ent_type) {
            case _ETypeQueryEnum.EXISTS:
                return _exists(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POSI:
                return ent_type === EEntType.POSI;
            case _ETypeQueryEnum.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_VERT:
                return ent_type === EEntType.VERT;
            case _ETypeQueryEnum.IS_EDGE:
                return ent_type === EEntType.EDGE;
            case _ETypeQueryEnum.IS_WIRE:
                return ent_type === EEntType.WIRE;
            case _ETypeQueryEnum.IS_FACE:
                return ent_type === EEntType.FACE;
            case _ETypeQueryEnum.IS_POINT:
                return ent_type === EEntType.POINT;
            case _ETypeQueryEnum.IS_PLINE:
                return ent_type === EEntType.PLINE;
            case _ETypeQueryEnum.IS_PGON:
                return ent_type === EEntType.PGON;
            case _ETypeQueryEnum.IS_COLL:
                return ent_type === EEntType.COLL;
            case _ETypeQueryEnum.IS_OBJ:
                return _isObj(__model__, ent_arr);
            case _ETypeQueryEnum.IS_TOPO:
                return _isTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POINT_TOPO:
                return _isPointTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PLINE_TOPO:
                return _isPlineTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PGON_TOPO:
                return _isPgonTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_OPEN:
                return !_isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_CLOSED:
                return _isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_HOLE:
                return _isHole(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_HOLES:
                return !_hasNoHoles(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_NO_HOLES:
                return _hasNoHoles(__model__, ent_arr);
            default:
                break;
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _type(__model__, ent_arr, query_ent_type)) as boolean[];
    }

}
// TODO IS_PLANAR
// TODO IS_QUAD
// ================================================================================================

