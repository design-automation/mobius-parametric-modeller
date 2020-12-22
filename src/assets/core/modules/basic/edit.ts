/**
 * The `edit` module has functions for editing entities in the model.
 * These function modify the topology of objects: vertices, edges, wires and faces.
 * These functions return the IDs of the entities that are created or modified.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';

import * as chk from '../../_check_types';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, TEntTypeIdx, IEntSets } from '@libs/geo-info/common';
import { idsMake, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat, isEmptyArr } from '@libs/util/arrs';

// Enums
export enum _EDivisorMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length',
    BY_MAX_LENGTH  =  'by_max_length',
    BY_MIN_LENGTH  =  'by_min_length'
}
export enum _EWeldMethod {
    MAKE_WELD =  'make_weld',
    BREAK_WELD  =  'break_weld',
}
export enum _ERingMethod {
    OPEN =  'open',
    CLOSE  =  'close',
}
export enum _EDeleteMethod {
    DELETE_SELECTED  =  'delete_selected',
    KEEP_SELECTED =  'keep_selected'
}

// ================================================================================================
/**
 * Divides edges into a set of shorter edges.
 * \n
 * If the 'by_number' method is selected, then each edge is divided into a fixed number of equal length shorter edges.
 * If the 'by length' method is selected, then each edge is divided into shorter edges of the specified length.
 * The length of the last segment will be the remainder.
 * If the 'by_min_length' method is selected,
 * then the edge is divided into the maximum number of shorter edges
 * that have a new length that is equal to or greater than the minimum.
 * \n
 * @param __model__
 * @param entities Edges, or entities from which edges can be extracted.
 * @param divisor Segment length or number of segments.
 * @param method Enum, select the method for dividing edges.
 * @returns Entities, a list of new edges resulting from the divide.
 * @example segments1 = make.Divide(edge1, 5, by_number)
 * @example_info Creates a list of 5 equal segments from edge1.
 * @example segments2 = make.Divide(edge1, 5, by_length)
 * @example_info If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
 */
export function Divide(__model__: GIModel, entities: TId|TId[], divisor: number, method: _EDivisorMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'edit.Divide';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'divisor', divisor, [chk.isNum]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.divide(ents_arr, divisor, method);
    // return the ids
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Makes one or more holes in a polygon.
 * \n
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon.
 * \n
 * If the list of positions consists of a single list, then one hole will be generated.
 * If the list of positions consists of a list of lists, then multiple holes will be generated.
 * \n
 * @param __model__
 * @param pgon A face or polygon to make holes in.
 * @param entities List of positions, or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, a list of wires resulting from the hole(s).
 */
export function Hole(__model__: GIModel, pgon: TId, entities: TId|TId[]|TId[][]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    if (!Array.isArray(entities)) { entities = [entities]; }
    // --- Error Check ---
    const fn_name = 'edit.Hole';
    let ent_arr: TEntTypeIdx;
    let holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][];
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'pgon', pgon, [ID.isID], [EEntType.PGON]) as TEntTypeIdx;
        holes_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL, ID.isIDLL],
            [EEntType.POSI, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ent_arr = idsBreak(pgon) as TEntTypeIdx;
        holes_ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.hole(ent_arr, holes_ents_arr);
    // make and return the IDs of the hole wires
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Make or break welds between vertices.
 * If two vertices are welded, then they share the same position.
 * \n
 * When making welds, the positions that become shared are returned.
 * When breaking welds, the new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of vertices, or entities from which vertices can be extracted.
 * @param method Enum; the method to use for welding.
 * @returns void
 */
export function Weld(__model__: GIModel, entities: TId|TId[], method: _EWeldMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'edit.Weld';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
            EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.weld(ents_arr, method);
    // make and return the IDs of the new posis
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Fuse positions that lie within a certain tolerance of one another.
 * New positions will be created.
 * If the positions that are fuse have vertices attached, then the vertices will become welded.
 * \n
 * In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
 * The deletion of edges may also result in polylines or polygpns being deleted.
 * \n
 * The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of positions, or entities from which positions can be extracted.
 * @param tolerance The distance tolerance for fusing positions.
 *  @returns void
 */
export function Fuse(__model__: GIModel, entities: TId|TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'edit.Fuse';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.fuse(ents_arr, tolerance);
    // make and return the IDs of the new posis
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Opens or closes a polyline.
 * \n
 * @param __model__
 * @param lines Polyline(s).
 * @returns void
 * @example edit.Close([polyline1,polyline2,...], method='close')
 * @example_info If open, polylines are changed to closed; if already closed, nothing happens.
 */
export function Ring(__model__: GIModel, entities: TId|TId[], method: _ERingMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'edit.Ring';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.PLINE]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_edit.ring(ents_arr, method);
    }
}
// ================================================================================================
/**
 * Shifts the order of the edges in a closed wire.
 * \n
 * In a closed wire, any edge (or vertex) could be the first edge of the ring.
 * In some cases, it is useful to have an edge in a particular position in a ring.
 * This function allows the edges to be shifted either forwards or backwards around the ring.
 * The order of the edges in the ring will remain unchanged.
 *
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @returns void
 * @example modify.Shift(face1, 1)
 * @example_info Shifts the edges in the face wire, so that the every edge moves up by one position
 * in the ring. The last edge will become the first edge .
 * @example edit.Shift(polyline1, -1)
 * @example_info Shifts the edges in the closed polyline wire, so that every edge moves back by one position
 * in the ring. The first edge will become the last edge.
 */
export function Shift(__model__: GIModel, entities: TId|TId[], offset: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, 'edit.Reverse', 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.WIRE, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_edit.shift(ents_arr, offset);
    }
}
// ================================================================================================
/**
 * Reverses direction of entities.
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @returns void
 * @example modify.Reverse(face1)
 * @example_info Flips face1 and reverses its normal.
 * @example edit.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, entities: TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, 'edit.Reverse', 'entities', entities,
                [ID.isID, ID.isIDL],
                [EEntType.WIRE, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_edit.reverse(ents_arr);
    }
}
// ================================================================================================
/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * \n
 * When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * \n
 * When deleting objects (point, polyline, and polygons), topology is also deleted.
 * \n
 * When deleting collections, the objects and other collections in the collection are also deleted.
 * \n
 * @param __model__
 * @param entities Positions, points, polylines, polygons, collections.
 * @param method Enum, delete or keep unused positions.
 * @returns void
 * @example edit.Delete(polygon1, 'delete_selected')
 * @example_info Deletes polygon1 from the model.
 */
export function Delete(__model__: GIModel, entities: TId|TId[], method: _EDeleteMethod): void {
    if (entities === null) {
        if (method === _EDeleteMethod.KEEP_SELECTED) { return; }
        if (method === _EDeleteMethod.DELETE_SELECTED) { __model__.modeldata.funcs_edit.delete(null, false);  return; }
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'edit.Delete';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    switch (method) {
        case _EDeleteMethod.DELETE_SELECTED:
            if (isEmptyArr(entities)) { return; }
            __model__.modeldata.funcs_edit.delete(ents_arr, false); // do not invert
            return;
        case _EDeleteMethod.KEEP_SELECTED:
            if (isEmptyArr(entities)) { __model__.modeldata.funcs_edit.delete(null, false); return; }
            __model__.modeldata.funcs_edit.delete(ents_arr, true); // invert
            return;
        default:
            throw new Error(fn_name + ' : Method not recognised.');
    }
}
// ================================================================================================
