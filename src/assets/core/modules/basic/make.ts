/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, Txyz, TEntTypeIdx, TPlane } from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat } from '@libs/util/arrs';


// Enums
export enum _EClose {
    OPEN = 'open',
    CLOSE = 'close'
}
export enum _ELoftMethod {
    OPEN_QUADS =  'open_quads',
    CLOSED_QUADS  =  'closed_quads',
    OPEN_STRINGERS =  'open_stringers',
    CLOSED_STRINGERS  =  'closed_stringers',
    OPEN_RIBS = 'open_ribs',
    CLOSED_RIBS = 'closed_ribs',
    COPIES = 'copies'
}
export enum _EExtrudeMethod {
    QUADS =  'quads',
    STRINGERS = 'stringers',
    RIBS = 'ribs',
    COPIES = 'copies'
}
export enum _ECutMethod {
    KEEP_ABOVE =  'keep_above',
    KEEP_BELOW = 'keep_below',
    KEEP_BOTH = 'keep_both'
}

// ================================================================================================
/**
 * Adds one or more new position to the model.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 * @example_link make.Position.mob&node=1
 */
export function Position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(coords)) { return []; }
    // --- Error Check ---
    if (__model__.debug) {
        checkArgs('make.Position', 'coords', coords, [ArgCh.isXYZ, ArgCh.isXYZL, ArgCh.isXYZLL]);
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_make.position(coords);
    return idsMake(new_ents_arr);
}
// ================================================================================================
/**
 * Adds one or more new points to the model.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 * @example_link make.Point.mob&node=1
 */
export function Point(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Point', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.POINT, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] =  __model__.modeldata.funcs_make.point(ents_arr);
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
// ================================================================================================
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 * @example_link make.Polyline.mob&node=1
 */
export function Polyline(__model__: GIModel, entities: TId|TId[]|TId[][], close: _EClose): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polyline', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.polyline(ents_arr, close) as  TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
// ================================================================================================
/**
 * Adds one or more new polygons to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, new polygon, or a list of new polygons.
 * @example polygon1 = make.Polygon([pos1,pos2,pos3])
 * @example_info Creates a polygon with vertices pos1, pos2, pos3 in sequence.
 * @example polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])
 * @example_info Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
 * @example_link make.Polygon.mob&node=1
 */
export function Polygon(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polygon', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.polygon(ents_arr) as TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
// ================================================================================================
/**
 * Adds a set of triangular polygons, forming a Triangulated Irregular Network (TIN).
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, a list of new polygons.
 */
export function _Tin(__model__: GIModel, entities: TId[]|TId[][]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Tin', 'entities', entities,
        [ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const posis_arrs: TEntTypeIdx[][] = this.getPgonPosisFromEnts(ents_arr);
    throw new Error('Not implemented.');
}
// ================================================================================================
/**
 * Lofts between entities.
 * ~
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities List of entities, or list of lists of entities.
 * @param method Enum, if 'closed', then close the loft back to the first entity in the list.
 * @returns Entities, a list of new polygons or polylines resulting from the loft.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.
 * @example quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')
 * @example_info Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
 */
export function Loft(__model__: GIModel, entities: TId[]|TId[][], divisions: number, method: _ELoftMethod): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Loft', 'entities', entities,
        [ID.isIDL, ID.isIDLL],
        [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.loft(ents_arr, divisions, method);
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Extrudes geometry by distance or by vector.
 * - Extrusion of a position, vertex, or point produces polylines;
 * - Extrusion of an edge, wire, or polyline produces polygons;
 * - Extrusion of a face or polygon produces polygons, capped at the top.
 * ~
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 * ~
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param dist Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by. Minimum is 1.
 * @param method Enum, when extruding edges, select quads, stringers, or ribs
 * @returns Entities, a list of new polygons or polylines resulting from the extrude.
 * @example extrusion1 = make.Extrude(point1, 10, 2, 'quads')
 * @example_info Creates a polyline of total length 10 (with two edges of length 5 each) in the z-direction.
 * In this case, the 'quads' setting is ignored.
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
 */
export function Extrude(__model__: GIModel, entities: TId|TId[],
        dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Extrude';
    let ents_arr;
    if (__model__.debug) {
        ents_arr =  checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
            EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        checkArgs(fn_name, 'dist', dist, [ArgCh.isNum, ArgCh.isXYZ]);
        checkArgs(fn_name, 'divisions', divisions, [ArgCh.isInt]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.extrude(ents_arr, dist, divisions, method);
    // create IDs
    if (!Array.isArray(entities) && new_ents_arr.length === 1) {
        return idsMake(new_ents_arr[0]) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
// ================================================================================================
/**
 * Sweeps a cross section wire along a backbone wire.
 * ~
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param xsection Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export function Sweep(__model__: GIModel, entities: TId|TId[], x_section: TId, divisions: number, method: _EExtrudeMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Sweep';
    let backbone_ents: TEntTypeIdx[];
    let xsection_ent: TEntTypeIdx;
    if (__model__.debug) {
        backbone_ents = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        xsection_ent = checkIDs(__model__, fn_name, 'xsextion', x_section,
            [ID.isID], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx;
        checkArgs(fn_name, 'divisions', divisions, [ArgCh.isInt]);
        if (divisions === 0) {
            throw new Error(fn_name + ' : Divisor cannot be zero.');
        }
    } else {
        backbone_ents = idsBreak(entities) as TEntTypeIdx[];
        xsection_ent = idsBreak(x_section) as TEntTypeIdx;
    }
    // --- Error Check ---
    const new_ents: TEntTypeIdx[] = __model__.modeldata.funcs_make.sweep(backbone_ents, xsection_ent, divisions, method);
    return idsMake(new_ents) as TId[];
}
// ================================================================================================
/**
 * Cuts polygons and polylines using a plane.
 * ~
 * If the 'keep_above' method is selected, then only the part of the cut entities above the plane are kept.
 * If the 'keep_below' method is selected, then only the part of the cut entities below the plane are kept.
 * If the 'keep_both' method is selected, then both the parts of the cut entities are kept.
 * ~
 * Currently does not support cutting polygons with holes. TODO
 * ~
 * If 'keep_both' is selected, returns a list of two lists.
 * [[entities above the plane], [entities below the plane]].
 * ~
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, select the method for cutting.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__: GIModel, entities: TId|TId[], plane: TPlane, method: _ECutMethod): TId[]|[TId[], TId[]] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Cut';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        checkArgs(fn_name, 'plane', plane, [ArgCh.isPln]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const [above, below]: [TEntTypeIdx[], TEntTypeIdx[]] = __model__.modeldata.funcs_make.cut(ents_arr, plane, method);
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return idsMake(above) as TId[];
        case _ECutMethod.KEEP_BELOW:
            return idsMake(below) as TId[];
        default:
            return [idsMake(above), idsMake(below)] as [TId[], TId[]];
    }
}
// ================================================================================================
/**
 * Adds a new copy of specified entities to the model.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @param vector A vector to move the entities by after copying, can be `null`.
 * @returns Entities, the copied entity or a list of copied entities.
 * @example copies = make.Copy([position1,polyine1,polygon1])
 * @example_info Creates a copy of position1, polyine1, and polygon1.
 */
export function Copy(__model__: GIModel, entities: TId|TId[]|TId[][], vector: Txyz): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Copy';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL, , ID.isIDLL],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        checkArgs(fn_name, 'vector', vector, [ArgCh.isXYZ, ArgCh.isNull]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    // copy the positions that belong to the list of entities
    if (vector === null) {
        __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    } else {
        __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr, true, vector);
    }
    // return only the new entities
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
// ================================================================================================
/**
 * Adds a new copy of specified entities to the model, and deletes teh original entity.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @returns Entities, the cloned entity or a list of cloned entities.
 * @example copies = make.Copy([position1,polyine1,polygon1])
 * @example_info Creates a copy of position1, polyine1, and polygon1.
 */
export function Clone(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Clone';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL, , ID.isIDLL],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    // delete the existing entities
    __model__.modeldata.funcs_edit.delete(ents_arr, false);
    // return the new entities
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
// ================================================================================================

