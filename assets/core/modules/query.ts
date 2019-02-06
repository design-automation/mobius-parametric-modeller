/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * The Count function returns the number of entities, rather than the list of entities.
 *
 * The Get() function is an important function, and is used in many modelling workflows.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx } from '@libs/geo-info/common';
import { idsMake, getArrDepth } from '@libs/geo-info/id';
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
            found_entities_i.push(...__model__.geom.query.getEnts(select_ent_type, false));
        } else {
            if (ents_arr.length === 0) {
                return [];
            } else if (getArrDepth(ents_arr) === 1) {
                ents_arr = [ents_arr] as TEntTypeIdx[];
            }
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
 * @returns List of entities that match the type specified in 'select' and the conditions specified in 'query_expr'.
 * @example positions = query.Get(positions, polyline1, #@xyz[2]>10)
 * @example_info Returns a list of positions that are part of polyline1 where the z-coordinate is more than 10.
 * @example positions = query.Get(positions, null, #@xyz[2]>10)
 * @example_info Returns a list of positions in the model where the z-coordinate is more than 10.
 * @example positions = query.Get(positions, polyline1, null)
 * @example_info Returns a list of all of the positions that are part of polyline1.
 * @example polylines = query.Get(polylines, position1, null)
 * @example_info Returns a list of all of the polylines that use position1.
 * @example collections = query.Get(collections, null, #@type=="floors")
 * @example_info Returns a list of all the collections that have an attribute called "type" with a value "floors".
 */
export function Get(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[], query_expr: TQuery): TId[] {
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // TODO add a condition called isNull for entities
    // TODO check the query string
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _convertSelectToEEntTypeStr(select);
    const found_ents_arr: TEntTypeIdx[] = _get(__model__, select_ent_types, ents_arr, query_expr);
    return idsMake(found_ents_arr) as TId[];
}
// ================================================================================================
// ================================================================================================
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
/**
 * Returns a list of entities excluding the specified entities.
 * @param __model__
 * @param select Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be excluded.
 * @returns List of entities that match the type specified in 'select'.
 * @example objects = query.Get(objects, polyline1, null)
 * @example_info Returns a list of all the objects in the model except polyline1.
 */
export function Invert(__model__: GIModel, select: _EQuerySelect, entities: TId|TId[]): TId[] {
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs('query.Get', 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const select_ent_types: EEntType|EEntType[] = _convertSelectToEEntTypeStr(select);
    const found_ents_arr: TEntTypeIdx[] = _invert(__model__, select_ent_types, ents_arr);
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
/**
 * Checks if polyline(s) or wire(s) are closed.
 * ~
 * WARNING: This function has been deprecated. Plese use the query.Type() function instead.
 *
 * @param __model__
 * @param lines Wires, polylines, or polygons.
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsClosed([polyline1,polyline2,polyline3])
 * @example_info Returns list [true,true,false] if polyline1 and polyline2 are closed but polyline3 is open.
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    // --- Error Check ---
    const ents_arr = checkIDs('query.isClosed', 'lines', lines, ['isID', 'isIDList'], ['PLINE', 'WIRE', 'PGON']);
    // --- Error Check ---
    return _isClosed(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}

export enum _EQueryEntType {
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
function _type(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], query_ent_type: _EQueryEntType): boolean|boolean[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const [ent_type, _]: TEntTypeIdx = ent_arr;
        switch (query_ent_type) {
            case _EQueryEntType.IS_POSI:
                return ent_type === EEntType.POSI;
            case _EQueryEntType.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _EQueryEntType.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _EQueryEntType.IS_VERT:
                return ent_type === EEntType.VERT;
            case _EQueryEntType.IS_EDGE:
                return ent_type === EEntType.EDGE;
            case _EQueryEntType.IS_WIRE:
                return ent_type === EEntType.WIRE;
            case _EQueryEntType.IS_FACE:
                return ent_type === EEntType.FACE;
            case _EQueryEntType.IS_POINT:
                return ent_type === EEntType.POINT;
            case _EQueryEntType.IS_PLINE:
                return ent_type === EEntType.PLINE;
            case _EQueryEntType.IS_PGON:
                return ent_type === EEntType.PGON;
            case _EQueryEntType.IS_COLL:
                return ent_type === EEntType.COLL;
            case _EQueryEntType.IS_OBJ:
                return _isObj(__model__, ent_arr);
            case _EQueryEntType.IS_TOPO:
                return _isTopo(__model__, ent_arr);
            case _EQueryEntType.IS_POINT_TOPO:
                return _isPointTopo(__model__, ent_arr);
            case _EQueryEntType.IS_PLINE_TOPO:
                return _isPlineTopo(__model__, ent_arr);
            case _EQueryEntType.IS_PGON_TOPO:
                return _isPgonTopo(__model__, ent_arr);
            case _EQueryEntType.IS_OPEN:
                return !_isClosed2(__model__, ent_arr);
            case _EQueryEntType.IS_CLOSED:
                return _isClosed2(__model__, ent_arr);
            case _EQueryEntType.IS_HOLE:
                return _isHole(__model__, ent_arr);
            case _EQueryEntType.HAS_HOLES:
                return !_hasNoHoles(__model__, ent_arr);
            case _EQueryEntType.HAS_NO_HOLES:
                return _hasNoHoles(__model__, ent_arr);
            default:
                break;
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _type(__model__, ent_arr, query_ent_type)) as boolean[];
    }

}
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
 * @param query_ent_type Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
 */
export function Type(__model__: GIModel, entities: TId|TId[], query_ent_type: _EQueryEntType): boolean|boolean[] {
    // --- Error Check ---
    const fn_name = 'query.Type';
    const ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _type(__model__, ents_arr, query_ent_type);
}
// TODO IS_PLANAR
// TODO IS_QUAD

// ================================================================================================
