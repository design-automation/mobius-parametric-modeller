/**
 * The `make` module has functions for making new entities in the model.
 * All these functions all return the IDs of the entities that are created.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribNames, TId, EEntType, Txyz, TEntTypeIdx } from '@libs/geo-info/common';
import { idsBreak, isPoint, isPline, isPgon, isDim0, isDim2, isColl, isPosi,
    isObj, isEdge, idsMake, idIndicies, getArrDepth } from '@libs/geo-info/id';
import { __merge__ } from './_model';
import { vecDiv, vecMult, interpByNum, interpByLen, vecAdd } from '@libs/geom/vectors';
import { _model } from '@modules';
import { checkCommTypes, checkIDs } from './_check_args';
import { Arr } from '@libs/arr/arr';
import { distance } from '@assets/libs/geom/distance';

// ================================================================================================
function _position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    const depth: number = getArrDepth(coords);
    if (depth === 1) {
        const coord1: Txyz = coords as Txyz;
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setAttribValue(EEntType.POSI, posi_i, EAttribNames.COORDS, coord1);
        return [EEntType.POSI, posi_i] as TEntTypeIdx;
    } else if (depth === 2) {
        const coords2: Txyz[] = coords as Txyz[];
        return coords2.map(coord => _position(__model__, coord)) as TEntTypeIdx[];
    } else {
        const coords3: Txyz[][] = coords as Txyz[][];
        return coords3.map(coord2 => _position(__model__, coord2)) as TEntTypeIdx[][];
    }
}
/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords XYZ coordinates as a list of three numbers.
 * @returns New position, or a list of new positions, or a list of lists of new positions .
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example_link make.Position.mob&node=1
 */
export function Position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TId|TId[]|TId[][] {
    // --- Error Check ---
    checkCommTypes('make.Position', 'coords', coords, ['isCoord', 'isCoordList', 'isCoordList_List']);
    // TODO allow to Txyz[][]
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = _position(__model__, coords);
    return idsMake(new_ents_arr);
}
// ================================================================================================
function _point(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) {
        const index: number = ents_arr[1] as number;
        const point_i: number = __model__.geom.add.addPoint(index);
        return [EEntType.POINT, point_i] as TEntTypeIdx;
    } else { // depth === 2 or 3
        return (ents_arr as TEntTypeIdx[]).map(_ents_arr => _point(__model__, _ents_arr)) as TEntTypeIdx[];
    }
}
/**
 * Adds a new point to the model. If a list of positions is provided as the input, then a list of points is generated.
 * @param __model__
 * @param positions Position of point.
 * @returns New point or a list of new points.
 * @example_info Creates a point at position1.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 * @example_link make.Point.mob&node=1
 */
export function Point(__model__: GIModel, positions: TId|TId[]): TId|TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('make.Point', 'positions', positions,
        ['isID', 'isIDList', 'isIDList_list'], ['POSI'])  as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[] =  _point(__model__, ents_arr);
    return idsMake(new_ents_arr) as TId|TId[];
}
// ================================================================================================
// Enums for Polyline()
export enum _EClose {
    CLOSE = 'close',
    OPEN = 'open'
}
function _polyline(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][], close: _EClose): TEntTypeIdx|TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 2) {
        const bool_close: boolean = (close === _EClose.CLOSE);
        const posis_i: number[] = idIndicies(ents_arr as TEntTypeIdx[]);
        const pline_i: number = __model__.geom.add.addPline(posis_i, bool_close);
        return [EEntType.PLINE, pline_i] as TEntTypeIdx;
    } else {
        return (ents_arr as TEntTypeIdx[][]).map(ent_arr => _polyline(__model__, ent_arr, close)) as TEntTypeIdx[];
    }
}
/**
 * Adds a new polyline to the model.
 * @param __model__
 * @param positions List of positions.
 * @param close Enum of 'close' or 'open'.
 * @returns New polyline.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 * @example_link make.Polyline.mob&node=1
 */
export function Polyline(__model__: GIModel, positions: TId[]|TId[][], close: _EClose): TId|TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('make.Polyline', 'positions', positions,
        ['isIDList', 'isIDList_list'], ['POSI']) as TEntTypeIdx[]|TEntTypeIdx[][]; // TODO
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[] = _polyline(__model__, ents_arr, close);
    return idsMake(new_ents_arr) as TId|TId[];
}
// ================================================================================================
function _polygon(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 2) {
        const posis_i: number[] = idIndicies(ents_arr as TEntTypeIdx[]);
        const pgon_i: number = __model__.geom.add.addPgon(posis_i);
        return [EEntType.PGON, pgon_i] as TEntTypeIdx;
    } else {
        return (ents_arr as TEntTypeIdx[][]).map(_ents_arr => _polygon(__model__, _ents_arr)) as TEntTypeIdx[];
    }
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param positions List of positions.
 * @returns New polygon.
 * @example polygon1 = make.Polygon([position1,position2,position3])
 * @example_info Creates a polygon with vertices position1, position2, position3 in sequence.
 * @example_link make.Polygon.mob&node=1
 */
export function Polygon(__model__: GIModel, positions: TId[]|TId[][]): TId|TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('make.Polygon', 'positions', positions,
        ['isIDList', 'isIDList_list'], ['POSI']) as TEntTypeIdx[]|TEntTypeIdx[][];
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[] = _polygon(__model__, ents_arr);
    return idsMake(new_ents_arr) as TId|TId[];
}
// ================================================================================================
function _polygonHoles(__model__: GIModel, ents_arr: TEntTypeIdx[],
        holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx {
    if (getArrDepth(holes_ents_arr) === 2) {
        holes_ents_arr = [holes_ents_arr] as TEntTypeIdx[][];
    }
    const posis_i: number[] = ents_arr.map(ent_arr => ent_arr[1]);
    const holes_posis_i: number[][] = [];
    for (const hole_ents_arr of holes_ents_arr as TEntTypeIdx[][]) {
        holes_posis_i.push( hole_ents_arr.map(ent_arr => ent_arr[1]) );
    }
    const pgon_i: number = __model__.geom.add.addPgon(posis_i, holes_posis_i);
    return [EEntType.PGON, pgon_i];
}
/**
 * Adds a single new polygon to the model with one or more holes.
 * @param __model__
 * @param positions List of positions.
 * @param hole_positions List of positions for the holes. For multiple holes, a list of list can provided.
 * @returns New polygon.
 * @example polygon1 = make.Polygon([position1,position2,position3], [position4,position5,position6])
 * @example_info Creates a polygon with  a hole, with vertices in sequence from position1 to position6.
 */
function _PolygonHoles(__model__: GIModel, positions: TId[], hole_positions: TId[]|TId[][]): TId {
    // --- Error Check ---
    const pgon_ents_arr = checkIDs('make.Polygon', 'positions', positions, ['isIDList'], ['POSI']) as TEntTypeIdx[];
    const holes_ents_arr = checkIDs('make.Polygon', 'positions', hole_positions,
        ['isIDList', 'isIDList_list'], ['POSI']) as TEntTypeIdx[]|TEntTypeIdx[][];
    // --- Error Check ---
    const new_ent_arr: TEntTypeIdx = _polygonHoles(__model__, pgon_ents_arr, holes_ents_arr);
    console.log(__model__);
    return idsMake(new_ent_arr) as TId;
}
// ================================================================================================
export function _collection(__model__: GIModel, parent_index: number, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TEntTypeIdx {
    if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    const points: number[] = [];
    const plines: number[] = [];
    const pgons: number[] = [];
    for (const ent_arr of ents_arr) {
        if (isPoint(ent_arr[0])) { points.push(ent_arr[1]); }
        if (isPline(ent_arr[0])) { plines.push(ent_arr[1]); }
        if (isPgon(ent_arr[0])) { pgons.push(ent_arr[1]); }
    }
    const coll_i: number = __model__.geom.add.addColl(parent_index, points, plines, pgons);
    return [EEntType.COLL, coll_i];
}
/**
 * Adds a new collection to the model.
 * @param __model__
 * @param parent_coll Collection
 * @param geometry List of points, polylines, polygons.
 * @returns New collection.
 * @example collection1 = make.Collection([point1,polyine1,polygon1])
 * @example_info Creates a collection containing point1, polyline1, polygon1.
 * @example_link make.Collection.mob&node=1
 */
export function Collection(__model__: GIModel, parent_coll: TId, geometry: TId|TId[]): TId {
    // --- Error Check ---
    const fn_name = 'make.Collection';
    let parent_index: number;
    if (parent_coll !== null && parent_coll !== undefined) {
        const parent_ent_arr = checkIDs(fn_name, 'parent_coll', parent_coll, ['isID'], ['COLL']) as TEntTypeIdx;
        parent_index = parent_ent_arr[1];
    } else {
        parent_index = -1;
    }
    const ents_arr = checkIDs(fn_name, 'geometry', geometry,
        ['isID', 'isIDList'], ['POINT', 'PLINE', 'PGON']) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const new_ent_arr: TEntTypeIdx = _collection(__model__, parent_index, ents_arr);
    return idsMake(new_ent_arr) as TId;
}
// ================================================================================================
// Stuff for Copy()
function _copyGeom(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], copy_attributes: boolean): TEntTypeIdx|TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (isColl(ent_type)) {
            const coll_i: number = __model__.geom.add.copyColls(index, copy_attributes) as number;
            return [ent_type, coll_i];
        } else if (isPgon(ent_type)) {
            const obj_i: number = __model__.geom.add.copyPgons(index, copy_attributes) as number;
            return [ent_type, obj_i];
        } else if (isPline(ent_type)) {
            const obj_i: number = __model__.geom.add.copyPlines(index, copy_attributes) as number;
            return [ent_type, obj_i];
        } else if (isPoint(ent_type)) {
            const obj_i: number = __model__.geom.add.copyPoints(index, copy_attributes) as number;
            return [ent_type, obj_i];
        } else if (isPosi(ent_type)) {
            const posi_i: number = __model__.geom.add.copyPosis(index, copy_attributes) as number;
            return [ent_type, posi_i];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(one_ent => _copyGeom(__model__, one_ent, copy_attributes)) as TEntTypeIdx[];
    }
}
function _copyGeomPosis(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], copy_attributes: boolean): TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // create the new positions
    const old_to_new_posis_i_map: Map<number, number> = new Map(); // count number of posis
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (!isPosi(ent_type)) { // obj or coll
            const old_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
            const ent_new_posis_i: number[] = [];
            for (const old_posi_i of old_posis_i) {
                let new_posi_i: number;
                if (old_to_new_posis_i_map.has(old_posi_i)) {
                    new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                } else {
                    new_posi_i = __model__.geom.add.copyPosis(old_posi_i, copy_attributes) as number;
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
                ent_new_posis_i.push(new_posi_i);
            }
            __model__.geom.modify.replacePosis(ent_type, index, ent_new_posis_i);
        }
    }
    // return all the new points
    const all_new_posis_i: number[] = Array.from(old_to_new_posis_i_map.values());
    return all_new_posis_i.map( posi_i => [EEntType.POSI, posi_i] ) as TEntTypeIdx[];
}
export enum _ECopyAttribues {
    COPY_ATTRIBUTES = 'copy_attributes',
    NO_ATTRIBUTES = 'no_attributes'
}
/**
 * Adds a new copy of specified entities to the model.
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection to be copied.
 * @param copy_positions Enum to create a copy of the existing positions or to reuse the existing positions.
 * @param copy_attributes Enum to copy attributes or to have no attributes copied.
 * @returns The copied entity or a list of copied entities.
 * @example copy1 = make.Copy([position1,polyine1,polygon1], copy_positions, copy_attributes)
 * @example_info Creates a list containing a copy of the entities in sequence of input.
 */
export function Copy(__model__: GIModel, entities: TId|TId[], copy_attributes: _ECopyAttribues): TId|TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('make.Copy', 'entities', entities,
        ['isID', 'isIDList'], ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const bool_copy_attribs: boolean = (copy_attributes === _ECopyAttribues.COPY_ATTRIBUTES);
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[] = _copyGeom(__model__, ents_arr, bool_copy_attribs);
    // copy the positions that belong to the list of entities
    _copyGeomPosis(__model__, new_ents_arr, bool_copy_attribs);
    // return only the new entities
    return idsMake(new_ents_arr) as TId|TId[];
}
// ================================================================================================
// Hole modelling operation
function _hole(__model__: GIModel, face_ent_arr: TEntTypeIdx, holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[] {
    if (getArrDepth(holes_ents_arr) === 2) {
        holes_ents_arr = [holes_ents_arr] as TEntTypeIdx[][];
    }
    // convert the holes to lists of posis_i
    const holes_posis_i: number[][] = [];
    for (const hole_ents_arr of holes_ents_arr as TEntTypeIdx[][]) {
        holes_posis_i.push( hole_ents_arr.map( ent_arr => ent_arr[1] ) );
    }
    // create the hole
    const wires_i: number[] = __model__.geom.modify.cutFaceHoles(face_ent_arr[1], holes_posis_i);
    return wires_i.map(wire_i => [EEntType.WIRE, wire_i]) as TEntTypeIdx[];
}
/**
 * Makes one or more holes in a polygon.
 * Each hole is defined by a list of positions.
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon.
 * If the list of positions consists of a single list, then one hole will be generated.
 * If the list of positions consists of a list of lists, then multiple holes will be generated.
 *
 * The hole positions should lie within the polygon surface.
 *
 * @param __model__
 * @param face A polygon or a face to make holes in.
 * @param positions A list of positions defining the wires of the holes.
 * @returns List of wires resulting from the hole(s).
 */
export function Hole(__model__: GIModel, face: TId, positions: TId[]|TId[][]): TId[] {
    // --- Error Check ---
    const face_ent_arr = checkIDs('make.Hole', 'face', face, ['isID'], ['FACE', 'PGON']) as TEntTypeIdx;
    const holes_ents_arr = checkIDs('make.Hole', 'positions', positions,
        ['isIDList', 'isIDList_list'], ['POSI']) as TEntTypeIdx[]|TEntTypeIdx[][];
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _hole(__model__, face_ent_arr, holes_ents_arr);
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================


// Loft modelling operation
export enum _ELoftMethod {
    OPEN =  'open',
    CLOSED  =  'closed'
}
function _loft(__model__: GIModel, ents_arr: TEntTypeIdx[], method: _ELoftMethod): TEntTypeIdx[] {
    const edges_arrs_i: number[][] = [];
    let num_edges = 0;
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
        if (edges_arrs_i.length === 0) { num_edges = edges_i.length; }
        if (edges_i.length !== num_edges) {
            throw new Error('make.Loft: Number of edges is not consistent.');
        }
        edges_arrs_i.push(edges_i);
    }
    if (method === _ELoftMethod.CLOSED) {
        edges_arrs_i.push(edges_arrs_i[0]);
    }
    const pgons_i: number[] = [];
    for (let i = 0; i < edges_arrs_i.length - 1; i++) {
        const edges_i_a: number[] = edges_arrs_i[i];
        const edges_i_b: number[] = edges_arrs_i[i + 1];
        for (let j = 0; j < num_edges; j++) {
            const verts_i_a: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i_a[j]);
            const verts_i_b: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i_b[j]);
            const pgon_i: number = __model__.geom.add.addPgon([verts_i_a[0], verts_i_a[1], verts_i_b[1], verts_i_b[0]]);
            pgons_i.push(pgon_i);
        }
    }
    return pgons_i.map( pgon_i => [EEntType.PGON, pgon_i]) as TEntTypeIdx[];
}
/**
 * Lofts between edges.
 * @param __model__
 * @param entities Edges (or wires, polylines or polygons with the same number of edges).
 * @param method Enum, if 'closed', then close the loft back to the first edge in the input.
 * @returns List of new polygons resulting from the loft.
 * @example surface1 = make.Loft([polyline1,polyline2,polyline3], closed)
 * @example_info Creates a list of polygons lofting between polyline1, polyline2, polyline3, and polyline1.
 */
export function Loft(__model__: GIModel, entities: TId[], method: _ELoftMethod): TId[] {
    // --- Error Check ---
    const ents_arr = checkIDs('make.Loft', 'entities', entities,
        ['isIDList'], ['EDGE', 'WIRE', 'PLINE', 'PGON']) as TEntTypeIdx[];
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _loft(__model__, ents_arr, method);
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
function _extrude(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        distance: number|Txyz, divisions: number): TEntTypeIdx[] {
    const extrude_vec: Txyz = (Array.isArray(distance) ? distance : [0, 0, distance]) as Txyz;
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        // check if this is a collection, call this function again
        if (isColl(ent_type)) {
            const points_i: number[] = __model__.geom.query.navCollToPoint(index);
            const res1 = points_i.map( point_i => _extrude(__model__, [EEntType.POINT, point_i], extrude_vec, divisions));
            const plines_i: number[] = __model__.geom.query.navCollToPline(index);
            const res2 = plines_i.map( pline_i => _extrude(__model__, [EEntType.PLINE, pline_i], extrude_vec, divisions));
            const pgons_i: number[] = __model__.geom.query.navCollToPgon(index);
            const res3 = pgons_i.map( pgon_i => _extrude(__model__, [EEntType.PGON, pgon_i], extrude_vec, divisions));
            return [].concat(res1, res2, res3);
        }
        // check if this is a position, a vertex, or a point -> pline
        if (isDim0(ent_type)) {
            const exist_posi_i: number = __model__.geom.query.navAnyToPosi(ent_type, index)[0];
            const xyz: Txyz = __model__.attribs.query.getPosiCoords(exist_posi_i);
            const strip_posis_i: number[] = [exist_posi_i];
            for (let i = 1; i < divisions + 1; i++) {
                const strip_posi_i: number = __model__.geom.add.addPosi();
                const move_xyz = vecMult(extrude_vec_div, i);
                __model__.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                strip_posis_i.push(strip_posi_i);
            }
            // loft between the positions and create a single polyline
            const pline_i: number = __model__.geom.add.addPline(strip_posis_i);
            return [[EEntType.PLINE, pline_i]];
        }
        // extrude edges -> polygons
        const new_pgons_i: number[] = [];
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
        const strip_posis_map: Map<number, number[]> = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz: Txyz = __model__.attribs.query.getPosiCoords(exist_posi_i);
                    const strip_posis_i: number[] = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i: number = __model__.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        __model__.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
            // get the two strips and make polygons
            const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_i[0]);
            const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_i[1]);
            for (let i = 0; i < strip1_posis_i.length - 1; i++) {
                const c1: number = strip1_posis_i[i];
                const c2: number = strip2_posis_i[i];
                const c3: number = strip2_posis_i[i + 1];
                const c4: number = strip1_posis_i[i + 1];
                const pgon_i: number = __model__.geom.add.addPgon([c1, c2, c3, c4]);
                new_pgons_i.push(pgon_i);
            }
        }
        if (isDim2(ent_type)) { // create a top -> polygon
            const face_i: number = __model__.geom.query.navPgonToFace(index);
            // get positions on boundary
            const old_wire_i: number = __model__.geom.query.getFaceBoundary(face_i);
            const old_posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.WIRE, old_wire_i);
            const new_posis_i: number[] = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
            // get positions for holes
            const old_holes_wires_i: number[] = __model__.geom.query.getFaceHoles(face_i);
            const new_holes_posis_i: number[][] = [];
            for (const old_hole_wire_i of old_holes_wires_i) {
                const old_hole_posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.WIRE, old_hole_wire_i);
                const new_hole_posis_i: number[] = old_hole_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
                new_holes_posis_i.push(new_hole_posis_i);
            }
            // make new polygon
            const pgon_i: number = __model__.geom.add.addPgon( new_posis_i, new_holes_posis_i );
            new_pgons_i.push(pgon_i);
        }
        return new_pgons_i.map(pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx);
    } else {
        const new_ents_arr: TEntTypeIdx[] = [];
        (ents_arr as TEntTypeIdx[]).forEach(ent_arr => {
            const result = _extrude(__model__, ent_arr, extrude_vec, divisions);
            result.forEach( new_ent_arr => new_ents_arr.push(new_ent_arr));
        });
        return new_ents_arr;
    }
}
/**
 * Extrudes geometry by distance (in default direction = z-axis) or by vector.
 * - Extrusion of a position, vertex, or point produces polylines;
 * - Extrusion of edge, wire, or polyline produces polygons;
 * - Extrusion of face or polygon produces polygons, also capped at the top.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param distance Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by. Minimum is 1.
 * @returns List of new polygons resulting from the extrude.
 * @example extrusion1 = make.Extrude(point1, 10, 2)
 * @example_info Creates a list of 2 lines of total length 10 (length 5 each) in the z-direction.
 * If point1 = [0,0,0], extrusion1[0] is a line between [0,0,0] and [0,0,5]; extrusion1[1] is a line between [0,0,5] and [0,0,10].
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1)
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of surfaces.
 */
export function Extrude(__model__: GIModel, entities: TId|TId[], distance: number|Txyz, divisions: number): TId|TId[] {
    // --- Error Check ---
    const fn_name = 'make.Extrude';
    const ents_arr =  checkIDs(fn_name, 'entities', entities,
        ['isID', 'isIDList'], ['VERT', 'EDGE', 'WIRE', 'FACE', 'POSI', 'POINT', 'PLINE', 'PGON', 'COLL']) as TEntTypeIdx|TEntTypeIdx[];
    checkCommTypes(fn_name, 'distance', distance, ['isNumber', 'isVector']);
    checkCommTypes(fn_name, 'divisions', divisions, ['isInt']);
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _extrude(__model__, ents_arr, distance, divisions);
    if (!Array.isArray(entities) && new_ents_arr.length === 1) {
        return idsMake(new_ents_arr[0]) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
// ================================================================================================
/**
 * Joins polylines to polylines or polygons to polygons.
 * @param __model__
 * @param geometry Polylines or polygons.
 * @returns New joined polyline or polygon .
 * @example joined1 = make.Join([polyline1,polyline2])
 * @example_info Creates a new polyline by joining polyline1 and polyline2. Geometries must be of the same type.
 */
export function _Join(__model__: GIModel, geometry: TId[]): TId {
    // --- Error Check ---
    // const ents_arr =  checkIDs('make.Join', 'geometry', geometry, ['isIDList'], ['PLINE', 'PGON']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
// ================================================================================================
// Divide edge modelling operation
export enum _EDivideMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length',
    BY_MIN_LENGTH  =  'by_min_length'
}
function _divideEdge(__model__: GIModel, edge_i: number, divisor: number, method: _EDivideMethod): number[] {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
    const start = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end = __model__.attribs.query.getPosiCoords(posis_i[1]);
    let new_xyzs: Txyz[];
    if (method === _EDivideMethod.BY_NUMBER) {
        new_xyzs = interpByNum(start, end, divisor - 1);
    } else if (method === _EDivideMethod.BY_LENGTH) {
        new_xyzs = interpByLen(start, end, divisor);
    } else { // BY_MIN_LENGTH
        const len: number = distance(start, end);
        const num_div: number = Math.ceil(len / divisor);
        new_xyzs = interpByNum(start, end, num_div - 1);
    }
    const new_edges_i: number[] = [];
    let old_edge_i: number = edge_i;
    for (const new_xyz of new_xyzs) {
        const posi_i = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, new_xyz);
        const new_edge_i: number = __model__.geom.modify.insertVertIntoWire(old_edge_i, posi_i);
        new_edges_i.push(old_edge_i);
        old_edge_i = new_edge_i;
    }
    new_edges_i.push(old_edge_i);
    return new_edges_i;
}
function _divide(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], divisor: number, method: _EDivideMethod): TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let exist_edges_i: number[];
        if (!isEdge(ent_type)) {
            exist_edges_i = __model__.geom.query.navAnyToEdge(ent_type, index).slice();
        } else {
            exist_edges_i = [index];
        }
        const all_new_edges_i: number[] = [];
        for (const exist_edge_i of exist_edges_i) {
            const new_edges_i: number[] = _divideEdge(__model__, exist_edge_i, divisor, method);
            all_new_edges_i.push(...new_edges_i);
        }
        return all_new_edges_i.map(one_edge_i => [EEntType.EDGE, one_edge_i] as TEntTypeIdx);
    } else {
        return [].concat(...(ents_arr as TEntTypeIdx[]).map(one_edge => _divide(__model__, one_edge, divisor, method)));
    }
}
/**
 * Divides edge, wire or polyline by length or by number of segments.
 * ~
 * If the 'by length' method is selected, length of last segment will be the remainder.
 * ~
 * @param __model__
 * @param edge Edge, wire, or polyline(s) to be divided.
 * @param divisor Segment length or number of segments.
 * @param method Enum, select the method for dividing edges.
 * @returns List of new edges resulting from the divide.
 * @example segments1 = make.Divide(edge1, 5, by_number)
 * @example_info Creates a list of 5 equal segments from edge1.
 * @example segments2 = make.Divide(edge1, 5, by_length)
 * @example_info If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
 */
export function Divide(__model__: GIModel, edge: TId|TId[], divisor: number, method: _EDivideMethod): TId[] {
    // --- Error Check ---
    const fn_name = 'make.Divide';
    const ents_arr = checkIDs('make.Copy', 'edge', edge,
        ['isID', 'isIDList'], ['EDGE', 'WIRE', 'PLINE', 'PGON']) as TEntTypeIdx|TEntTypeIdx[];
    checkCommTypes(fn_name, 'divisor', divisor, ['isNumber']);
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _divide(__model__, ents_arr, divisor, method);
    return idsMake(new_ents_arr) as TId[];
}
// ================================================================================================
/**
 * Unweld vertices so that they do not share positions.
 * For the vertices of the specified entities, if they share positions with other entities in the model,
 * then those positions will be replaced with new positions.
 * This function performs a simple unweld.
 * That is, the vertices within the set of specified entities are not unwelded.
 * @param __model__
 * @param entities Vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param method Enum; the method to use for unweld.
 * @returns List of new positions resulting from the unweld.
 * @example mod.Unweld(polyline1)
 * @example_info Unwelds polyline1 from all ther entities that shares the same position.
 */
export function Unweld(__model__: GIModel, entities: TId|TId[]): TId[] {
    // --- Error Check ---
    let ents_arr = checkIDs('modify.Unweld', 'entities', entities, ['isID', 'isIDList'],
                              ['VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // get verts_i
    const all_verts_i: number[] = []; // count number of posis
    for (const ents of ents_arr) {
        const verts_i: number[] = __model__.geom.query.navAnyToVert(ents[0], ents[1]);
        all_verts_i.push(...verts_i);
    }
    const new_posis_i: number [] = __model__.geom.modify.unweldVerts(all_verts_i);
    return new_posis_i.map( posi_i => idsMake([EEntType.POSI, posi_i]) ) as TId[];
}
// ================================================================================================
// Explode

// Pipe

// Offset
