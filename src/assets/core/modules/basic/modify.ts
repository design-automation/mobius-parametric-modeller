/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, but they may change attribute values.
 * All these functions all return void.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TEntTypeIdx, TRay} from '@libs/geo-info/common';
import { getArrDepth, isColl, isPgon, isPline, isPoint, isPosi, isEmptyArr, idsMake } from '@libs/geo-info/id';
import { vecAdd, vecSum, vecDiv, vecFromTo, vecNorm, vecCross, vecSetLen, vecLen, vecDot } from '@libs/geom/vectors';
import { checkArgTypes, checkIDs, IDcheckObj, TypeCheckObj} from '../_check_args';
import { rotateMatrix, multMatrix, scaleMatrix, mirrorMatrix, xfromSourceTargetMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import __ from 'underscore';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { getOrigin, getRay, getPlane } from './_common';

// ================================================================================================
/**
 * Moves entities. The directio and distance if movement is specified as a vector.
 * ~
 * If only one vector is given, then all entities are moved by the same vector.
 * If a list of vectors is given, the each entity will be moved by a different vector.
 * In this case, the number of vectors should be equal to the number of entities.
 * ~
 * If a position is shared between entites that are being moved by different vectors,
 * then the position will be moved by the average of the vectors.
 * ~
 * @param __model__
 * @param entities An entity or list of entities to move.
 * @param vector A vector or a list of vectors.
 * @returns void
 * @example modify.Move(pline1, [1,2,3])
 * @example_info Moves pline1 by [1,2,3].
 * @example modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )
 * @example_info Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].
 * @example modify.Move([pgon1, pgon2], [1,2,3] )
 * @example_info Moves both pgon1 and pgon2 by [1,2,3].
 */
export function Move(__model__: GIModel, entities: TId|TId[], vectors: Txyz|Txyz[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Move';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                                EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'vectors', vectors, [TypeCheckObj.isVector, TypeCheckObj.isVectorList]);
        // --- Error Check ---
        _move(__model__, ents_arr, vectors);
    }
}
function _move(__model__: GIModel, ents_arr: TEntTypeIdx[], vectors: Txyz|Txyz[]): void {
    if (getArrDepth(vectors) === 1) {
        const posis_i: number[] = [];
        const vec: Txyz = vectors as Txyz;
        for (const ents of ents_arr) {
            __model__.geom.query.navAnyToPosi(ents[0], ents[1]).forEach(posi_i => posis_i.push(posi_i));
        }
        const unique_posis_i: number[] = Array.from(new Set(posis_i));
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
            const new_xyz: Txyz = vecAdd(old_xyz, vec);
            __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
        }
    } else {
        if (ents_arr.length !== vectors.length) {
            throw new Error('If multiple vectors are given, then the number of vectors must be equal to the number of entities.');
        }
        const posis_i: number[] = [];
        const vecs_map: Map<number, Txyz[]> = new Map();
        for (let i = 0; i < ents_arr.length; i++) {
            const [ent_type, index]: [EEntType, number] = ents_arr[i] as TEntTypeIdx;
            const vec: Txyz = vectors[i] as Txyz;
            const ent_posis_i: number [] = __model__.geom.query.navAnyToPosi(ent_type, index);
            for (const ent_posi_i of ent_posis_i) {
                posis_i.push(ent_posi_i);
                if (! vecs_map.has(ent_posi_i)) {
                    vecs_map.set(ent_posi_i, []);
                }
                vecs_map.get(ent_posi_i).push(vec);
            }
        }
        for (const posi_i of posis_i) {
            const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
            const vecs: Txyz[] = vecs_map.get(posi_i);
            const vec: Txyz = vecDiv( vecSum( vecs ), vecs.length);
            const new_xyz: Txyz = vecAdd(old_xyz, vec);
            __model__.attribs.add.setPosiCoords(posi_i, new_xyz);
        }
    }
    return; // specifies that nothing is returned
}
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * ~
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \
 * Given a plane, a ray will be created from teh plane z axis. \
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \
 * Given any entities, the centroid will be extracted, \
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, entities: TId|TId[], ray: Txyz|TRay|TPlane|TId|TId[], angle: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                                EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'angle', angle, [TypeCheckObj.isNumber]);
        ray = getRay(__model__, ray, fn_name) as TRay;
        // --- Error Check ---
        _rotate(__model__, ents_arr, ray, angle);
    }
}
function _rotate(__model__: GIModel, ents_arr: TEntTypeIdx[], ray: TRay, angle: number): void {
    // rotate all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = rotateMatrix(ray, angle);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return; // specifies that nothing is returned
}
// ================================================================================================
/**
 * Scales entities relative to a plane.
 * ~
 * @param __model__
 * @param entities  An entity or list of entities to scale.
 * @param plane A plane to scale around. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 * @example modify.Scale(entities, plane1, [0.5, 1, 1])
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
export function Scale(__model__: GIModel, entities: TId|TId[], plane: Txyz|TRay|TPlane|TId|TId[], scale: number|Txyz): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                                EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber, TypeCheckObj.isXYZlist]);
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        _scale(__model__, ents_arr, plane, scale);
    }
}
function _scale(__model__: GIModel, ents_arr: TEntTypeIdx[], plane: TPlane, scale: number|Txyz): void {
    // handle scale type
    if (!Array.isArray(scale)) {
        scale = [scale, scale, scale];
    }
    // scale all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = scaleMatrix(plane, scale);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return; // specifies that nothing is returned
}
// ================================================================================================
/**
 * Mirrors entities across a plane.
 * ~
 * @param __model__
 * @param entities An entity or list of entities to mirros.
 * @param plane A plane to scale around. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: GIModel, entities: TId|TId[], plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                                EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        _mirror(__model__, ents_arr, plane);
    }
}
function _mirror(__model__: GIModel, ents_arr: TEntTypeIdx[], plane: TPlane): void {
    // mirror all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = mirrorMatrix(plane);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * ~
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from_plane Plane defining source plane for the transformation. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param to_plane Plane defining target plane for the transformation. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: GIModel, entities: TId|TId[],
        from_plane: Txyz|TRay|TPlane|TId|TId[], to_plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                                EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        from_plane = getPlane(__model__, from_plane, fn_name) as TPlane;
        to_plane = getPlane(__model__, to_plane, fn_name) as TPlane;
        // --- Error Check ---
        _xform(__model__, ents_arr, from_plane, to_plane);
    }
}
function _xform(__model__: GIModel, ents_arr: TEntTypeIdx[], from: TPlane, to: TPlane): void {
    // xform all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = xfromSourceTargetMatrix(from, to);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
// ================================================================================================
/**
 * Offsets wires.
 * ~
 * @param __model__
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative
 * @returns void
 * @example modify.Offset(polygon1, 10)
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
export function Offset(__model__: GIModel, entities: TId|TId[], dist: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Offset';
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                                [EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'dist', dist, [TypeCheckObj.isNumber]);
        // --- Error Check ---
        _offset(__model__, ents_arr, dist);
    }
}
function _offset(__model__: GIModel, ents_arr: TEntTypeIdx[], dist: number): void {
    // get all wires and offset
    const pgons_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        for (const wire_i of wires_i) {
            _offsetWire(__model__, wire_i, dist);
        }
        // save all pgons for re-tri
        const pgon_i: number[] = __model__.geom.query.navAnyToPgon(ent_type, index);
        if (pgon_i.length === 1) {
            if (pgons_i.indexOf(pgon_i[0]) === -1) {
                pgons_i.push(pgon_i[0]);
            }
        }
    }
    // re-tri all polygons
    if (pgons_i.length > 0) {
        __model__.geom.add.triPgons(pgons_i);
    }
}
function _offsetWire(__model__: GIModel, wire_i: number, dist: number): void {
    // get the normal of the wire
    let vec_norm: Txyz = __model__.geom.query.getWireNormal(wire_i);
    if (vecLen(vec_norm) === 0) {
        vec_norm = [0, 0, 1];
    }
    // loop through all edges and collect the required data
    const edges_i: number[] = __model__.geom.query.navAnyToEdge(EEntType.WIRE, wire_i).slice(); // make a copy
    const is_closed: boolean = __model__.geom.query.istWireClosed(wire_i);
    // the index to these arrays is the edge_i
    let perp_vec: Txyz = null;
    let has_bad_edges = false;
    const perp_vecs: Txyz[] = [];       // index is edge_i
    const pairs_xyzs: [Txyz, Txyz][] = [];        // index is edge_i
    const pairs_posis_i: [number, number][] = [];   // index is edge_i
    for (const edge_i of edges_i) {
        const posis_i: [number, number] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i) as [number, number];
        const xyzs: [Txyz, Txyz] = posis_i.map(posi_i => __model__.attribs.query.getPosiCoords(posi_i)) as [Txyz, Txyz];
        const edge_vec: Txyz = vecFromTo(xyzs[0], xyzs[1]);
        const edge_len: number = vecLen(edge_vec);
        pairs_xyzs[edge_i] = xyzs;
        pairs_posis_i[edge_i] = posis_i;
        if (edge_len > 0) {
            perp_vec = vecCross(vecNorm(edge_vec), vec_norm);
        } else {
            if (perp_vec === null) {
                has_bad_edges = true;
            }
        }
        perp_vecs[edge_i] = perp_vec;
    }
    // fix any bad edges, by setting the perp vec to its next neighbour
    if (has_bad_edges) {
        if (perp_vecs[perp_vecs.length - 1] === null) {
            throw new Error('Error: could not offset wire.');
        }
        for (let i = perp_vecs.length - 1; i >= 0; i--) {
            if (perp_vecs[i] === null) {
                perp_vecs[i] = perp_vec;
            } else {
                perp_vec = perp_vecs[i];
            }
        }
    }
    // add edge if this is a closed wire
    // make sure the edges_i is a copy, otherwise we are pushing into the model data structure
    if (is_closed) {
        edges_i.push(edges_i[0]); // add to the end
    }
    // loop through all the valid edges
    for (let i = 0; i < edges_i.length - 1; i++) {
        // get the two edges
        const this_edge_i: number = edges_i[i];
        const next_edge_i: number = edges_i[i + 1];
        // get the end posi_i and xyz of this edge
        const posi_i: number = pairs_posis_i[this_edge_i][1];
        const old_xyz: Txyz = pairs_xyzs[this_edge_i][1];
        // get the two perpendicular vectors
        const this_perp_vec: Txyz = perp_vecs[this_edge_i];
        const next_perp_vec: Txyz = perp_vecs[next_edge_i];
        // calculate the offset vector
        let offset_vec: Txyz = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
        const dot: number = vecDot(this_perp_vec, offset_vec);
        const vec_len = dist / dot;
        offset_vec = vecSetLen(offset_vec, vec_len);
        // move the posi
        const new_xyz: Txyz = vecAdd(old_xyz, offset_vec);
        __model__.attribs.add.setPosiCoords(posi_i, new_xyz);
    }
    // if this is not a closed wire we have to move first and last posis
    if (!is_closed) {
        // first posi
        const first_edge_i: number = edges_i[0];
        const first_posi_i: number = pairs_posis_i[first_edge_i][0];
        const first_old_xyz: Txyz = pairs_xyzs[first_edge_i][0];
        const first_perp_vec: Txyz =  vecSetLen(perp_vecs[first_edge_i], dist);
        const first_new_xyz: Txyz = vecAdd(first_old_xyz, first_perp_vec);
        __model__.attribs.add.setPosiCoords(first_posi_i, first_new_xyz);
        // last posi
        const last_edge_i: number = edges_i[edges_i.length - 1];
        const last_posi_i: number = pairs_posis_i[last_edge_i][1];
        const last_old_xyz: Txyz = pairs_xyzs[last_edge_i][1];
        const last_perp_vec: Txyz =  vecSetLen(perp_vecs[last_edge_i], dist);
        const last_new_xyz: Txyz = vecAdd(last_old_xyz, last_perp_vec);
        __model__.attribs.add.setPosiCoords(last_posi_i, last_new_xyz);
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
 * @example modify.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, entities: TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Reverse', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.WIRE, EEntType.PLINE, EEntType.FACE, EEntType.PGON])  as TEntTypeIdx[];
        // --- Error Check ---
        _reverse(__model__, ents_arr);
    }
}
function _reverse(__model__: GIModel, ents_arr: TEntTypeIdx[]): void {
    for (const [ent_type, index] of ents_arr) {
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.reverse(wire_i) );
    }
}
// ================================================================================================
/**
 * Shifts the order of the edges in a closed wire.
 * ~
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
 * @example modify.Shift(polyline1, -1)
 * @example_info Shifts the edges in the closed polyline wire, so that every edge moves back by one position
 * in the ring. The first edge will become the last edge.
 */
export function Shift(__model__: GIModel, entities: TId|TId[], offset: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Reverse', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.WIRE, EEntType.PLINE, EEntType.FACE, EEntType.PGON])  as TEntTypeIdx[];
        // --- Error Check ---
        _shift(__model__, ents_arr, offset);
    }
}
function _shift(__model__: GIModel, ents_arr: TEntTypeIdx[], offset: number): void {
    for (const [ent_type, index] of ents_arr) {
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.shift(wire_i, offset) );
    }
}
// ================================================================================================
/**
 * Closes polyline(s) if open.
 * @param __model__
 * @param lines Polyline(s).
 * @returns void
 * @example modify.Close([polyline1,polyline2,...])
 * @example_info If open, polylines are changed to closed; if already closed, nothing happens.
 */
export function Close(__model__: GIModel, entities: TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Close', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE]) as TEntTypeIdx[];
        // --- Error Check ---
        _close(__model__, ents_arr);
    }
}
function _close(__model__: GIModel, ents_arr: TEntTypeIdx[]): void {
    for (const [ent_type, index] of ents_arr) {
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type !== EEntType.WIRE) {
            throw new Error('modify.Close: Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.modify.closeWire(wire_i);
    }
}
// ================================================================================================
/**
 * Unweld vertices so that they do not share positions. The new positions that are generated are returned.
 * ~
 * @param __model__
 * @param entities Entities, a list of vertices, or entities from which vertices can be extracted.
 * @param method Enum; the method to use for welding.
 * @returns Entities, a list of new positions resulting from the unweld.
 * @example mod.Unweld(polyline1)
 * @example_info Unwelds the vertices of polyline1 from all other vertices that shares the same position.
 */
export function Weld(__model__: GIModel, entities: TId|TId[], method: _EWeldMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'modify.Weld';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE,
                            EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    // --- Error Check ---
    _weld(__model__, ents_arr, method);
}
export enum _EWeldMethod {
    MERGE_POSITIONS =  'merge_positions',
    CLONE_POSITIONS  =  'clone_positions',
}
export function _weld(__model__: GIModel, ents_arr: TEntTypeIdx[], method: _EWeldMethod): void {
    // get verts_i
    const all_verts_i: number[] = []; // count number of posis
    for (const ents of ents_arr) {
        const verts_i: number[] = __model__.geom.query.navAnyToVert(ents[0], ents[1]);
        for (const vert_i of verts_i) { all_verts_i.push(vert_i); }
    }
    switch (method) {
        case _EWeldMethod.CLONE_POSITIONS:
            __model__.geom.modify.cloneVertPositions(all_verts_i);
            break;
        case _EWeldMethod.MERGE_POSITIONS:
            __model__.geom.modify.cloneVertPositions(all_verts_i);
            break;
        default:
            break;
    }
}
// ================================================================================================
/**
 * Remesh a face or polygon.
 * ~
 * When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
 * Remeshing will regenerate the triangulated mesh for the face.
 * Remeshing is not performed automatically as it would degrade performance.
 * Instead, it is left up to the user to remesh only when it is actually required.
 * ~
 * @param __model__
 * @param entities Single or list of faces, polygons, collections.
 * @returns void
 * @example modify.Remesh(polygon1)
 * @example_info Remeshs the face of the polygon.
 */
export function Remesh(__model__: GIModel, entities: TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Remesh', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        // --- Error Check ---
        _remesh(__model__, ents_arr);
    }
}
function _remesh(__model__: GIModel, ents_arr: TEntTypeIdx[]): void {
    for (const [ent_type, index] of ents_arr) {
        if (ent_type === EEntType.PGON) {
            __model__.geom.add.triPgons(index);
        } else {
            const pgons_i: number[] = __model__.geom.query.navAnyToPgon(ent_type, index);
            __model__.geom.add.triPgons(pgons_i);
        }
    }
}
// ================================================================================================

/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * For positions, the selection to delete or keep unused positions is ignored.
 * When deleting objects (point, polyline, and polygons), topology is also deleted.
 * When deleting collections, none of the objects in the collection are deleted.
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection.
 * @param del_unused_posis Enum, delete or keep unused positions.
 * @returns void
 * @example modify.Delete(polygon1)
 * @example_info Deletes polygon1 from the model.
 */
export function Delete(__model__: GIModel, entities: TId|TId[], del_unused_posis: _EDeleteMethod  ): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Delete', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        // --- Error Check ---
        const bool_del_unused_posis: boolean = (del_unused_posis === _EDeleteMethod.DEL_UNUSED_POINTS);
        _delete(__model__, ents_arr, bool_del_unused_posis);
    }
}
function _delete(__model__: GIModel, ents_arr: TEntTypeIdx[], del_unused_posis: boolean): void {
    const colls_i: number[] = [];
    const pgons_i: number[] = [];
    const plines_i: number[] = [];
    const points_i: number[] = [];
    const posis_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (isColl(ent_type)) {
            colls_i.push(index);
        } else if (isPgon(ent_type)) {
            pgons_i.push(index);
        } else if (isPline(ent_type)) {
            plines_i.push(index);
        } else if (isPoint(ent_type)) {
            points_i.push(index);
        } else if (isPosi(ent_type)) {
            posis_i.push(index);
        }
    }
    __model__.geom.modify.delColls(colls_i, del_unused_posis);
    __model__.geom.modify.delPgons(pgons_i, del_unused_posis);
    __model__.geom.modify.delPlines(plines_i, del_unused_posis);
    __model__.geom.modify.delPoints(points_i, del_unused_posis);
    __model__.geom.modify.delPosis(posis_i);
}
export enum _EDeleteMethod {
    DEL_UNUSED_POINTS =  'del_unused_posis',
    KEEP_UNUSED_POINTS  =  'keep_unused_posis'
}
// ================================================================================================
/**
 * Keeps the specified geometric entities: positions, points, polylines, polygons, and collections.
 * Everything else in the model is deleted.
 * When a collection is kept, all objects inside the collection are also kept.
 * When an object is kept, all positions used by the object are also kept.
 *
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection.
 * @returns void
 * @example modify.Delete(polygon1)
 * @example_info Deletes polygon1 from the model.
 */
export function Keep(__model__: GIModel, entities: TId|TId[] ): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] = checkIDs('modify.Delete', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        // --- Error Check ---
        _keep(__model__, ents_arr);
    }
}
function _keep(__model__: GIModel, ents_arr: TEntTypeIdx[]): void {
    const colls_i: Set<number> = new Set();
    const pgons_i: Set<number> = new Set();
    const plines_i: Set<number> = new Set();
    const points_i: Set<number> = new Set();
    const posis_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (isColl(ent_type)) {
            colls_i.add(index);
            for (const pgon_i of __model__.geom.query.navCollToPgon(index)) {
                pgons_i.add(pgon_i);
            }
            for (const pline_i of __model__.geom.query.navCollToPline(index)) {
                plines_i.add(pline_i);
            }
            for (const point_i of __model__.geom.query.navCollToPoint(index)) {
                points_i.add(point_i);
            }
        } else if (isPgon(ent_type)) {
            pgons_i.add(index);
        } else if (isPline(ent_type)) {
            plines_i.add(index);
        } else if (isPoint(ent_type)) {
            points_i.add(index);
        } else if (isPosi(ent_type)) {
            posis_i.add(index);
        }
    }
    const all_colls_i: number[] = __model__.geom.query.getEnts(EEntType.COLL, false);
    const del_colls_i: number[] = all_colls_i.filter( coll_i => !colls_i.has(coll_i) );
    __model__.geom.modify.delColls(del_colls_i, false);
    const all_pgons_i: number[] = __model__.geom.query.getEnts(EEntType.PGON, false);
    const del_pgons_i: number[] = all_pgons_i.filter( pgon_i => !pgons_i.has(pgon_i) );
    __model__.geom.modify.delPgons(del_pgons_i, false);
    const all_plines_i: number[] = __model__.geom.query.getEnts(EEntType.PLINE, false);
    const del_plines_i: number[] = all_plines_i.filter( pline_i => !plines_i.has(pline_i) );
    __model__.geom.modify.delPlines(del_plines_i, false);
    const all_points_i: number[] = __model__.geom.query.getEnts(EEntType.POINT, false);
    const del_points_i: number[] = all_points_i.filter( point_i => !points_i.has(point_i) );
    __model__.geom.modify.delPoints(del_points_i, false);
    // finally, only del posis that are unused and that are not in the keep list
    const all_unused_posis_i: number[] = __model__.geom.query.getUnusedPosis(false);
    const del_posis_i: number[] = all_unused_posis_i.filter( posi_i => !posis_i.has(posi_i) );
    __model__.geom.modify.delPosis(del_posis_i);
}






// ExtendPline

// ProjectPosition

// Move position along vector (normals)
// ================================================================================================
// // AttribPush modelling operation
// export enum _EPromoteMethod {
//     FIRST = 'first',
//     LAST = 'last',
//     AVERAGE = 'average',
//     MEDIAN = 'median',
//     SUM = 'sum',
//     MIN = 'min',
//     MAX = 'max'
// }
// // Promote modelling operation
// export enum _EPromoteTarget {
//     POSI = 'positions',
//     VERT = 'vertices',
//     EDGE = 'edges',
//     WIRE = 'wires',
//     FACE = 'faces',
//     POINT = 'points',
//     PLINE = 'plines',
//     PGON = 'pgons',
//     COLL = 'collections',
//     MOD = 'model'
// }
// function _convertPromoteMethod(selection: _EPromoteMethod): EAttribPromote {
//     switch (selection) {
//         case _EPromoteMethod.AVERAGE:
//             return EAttribPromote.AVERAGE;
//         case _EPromoteMethod.MEDIAN:
//             return EAttribPromote.MEDIAN;
//         case _EPromoteMethod.SUM:
//             return EAttribPromote.SUM;
//         case _EPromoteMethod.MIN:
//             return EAttribPromote.MIN;
//         case _EPromoteMethod.MAX:
//             return EAttribPromote.MAX;
//         case _EPromoteMethod.FIRST:
//             return EAttribPromote.FIRST;
//         case _EPromoteMethod.LAST:
//             return EAttribPromote.LAST;
//         default:
//             break;
//     }
// }
// function _convertPromoteTarget(selection: _EPromoteTarget): EEntType {
//     switch (selection) {
//         case _EPromoteTarget.POSI:
//             return EEntType.POSI;
//         case _EPromoteTarget.VERT:
//             return EEntType.VERT;
//         case _EPromoteTarget.EDGE:
//             return EEntType.EDGE;
//         case _EPromoteTarget.WIRE:
//             return EEntType.WIRE;
//         case _EPromoteTarget.FACE:
//             return EEntType.FACE;
//         case _EPromoteTarget.POINT:
//             return EEntType.POINT;
//         case _EPromoteTarget.PLINE:
//             return EEntType.PLINE;
//         case _EPromoteTarget.PGON:
//             return EEntType.PGON;
//         case _EPromoteTarget.COLL:
//             return EEntType.COLL;
//         case _EPromoteTarget.MOD:
//             return EEntType.MOD;
//         default:
//             break;
//     }
// }
// /**
//  * Pushes existing attribute values onto other entities.
//  * Attribute values can be promoted up the hierarchy, demoted down the hierarchy, or transferred across the hierarchy.
//  * ~
//  * In certain cases, when attributes are pushed, they may be aggregated. For example, if you are pushing attributes
//  * from vertices to polygons, then there will be multiple vertex attributes that can be combined in
//  * different ways.
//  * The 'method' specifies how the attributes should be aggregated. Note that if no aggregation is required
//  * then the aggregation method is ignored.
//  * ~
//  * The aggregation methods consist of numerical functions such as average, median, sum, max, and min. These will
//  * only work if the attribute values are numbers or lists of numbers. If the attribute values are string, then
//  * the numerical functions are ignored.
//  * ~
//  * If the attribute values are lists of numbers, then these aggregation methods work on the individual items in the list.
//  * For example, lets say you have an attribute consisting of normal vectors on vertices. If you push these attributes
//  * down to the positions, then aggregation may be required, since multiple vertices can share the same position.
//  * In this case, if you choose the `average` aggregation method, then resulting vectors on the positions will be the
//  * average of vertex vectors.
//  *
//  * @param __model__
//  * @param entities The entities that currently contain the attribute values.
//  * @param attrib_name The name of the attribute to be promoted, demoted, or transferred.
//  * @param to_level Enum; The level to which to promote, demote, or transfer the attribute values.
//  * @param method Enum; The method to use when attribute values need to be aggregated.
//  * @returns void
//  * @example promote1 = modify.PushAttribs([pgon1, pgon2], 'area', collections, sum)
//  * @example_info For the two polygons (pgon1 and pgon2), it gets the attribute values from the attribute called `area`,
//  * and pushes them up to the collection level. The `sum` method specifies that the two areas should be added up.
//  * Note that in order to create an attribute at the collection level, the two polygons should be part of a
//  * collection. If they are not part of the collection, then no attribute values will be push.
//  */
// export function PushAttribs(__model__: GIModel, entities: TId|TId[], attrib_name: string,
//         to_level: _EPromoteTarget, method: _EPromoteMethod): void {
//     // --- Error Check ---
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[];
//     if (entities !== null) {
//         ents_arr = checkIDs('modify.Attribute', 'entities', entities,
//                             [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     } else {
//         ents_arr = null;
//     }
//     // --- Error Check ---
//     let from_ent_type: EEntType;
//     const indices: number[] = [];
//     if (ents_arr !== null) {
//         const ents_arrs: TEntTypeIdx[] = ((getArrDepth(ents_arr) === 1) ? [ents_arr] : ents_arr) as TEntTypeIdx[];
//         from_ent_type = ents_arrs[0][0];
//         for (const [ent_type, index] of ents_arrs) {
//             if (ent_type !== from_ent_type) {
//                 throw new Error('All entities must be of the same type.');
//             }
//             indices.push(index);
//         }
//     } else {
//         from_ent_type = EEntType.MOD;
//     }
//     const to_ent_type: EEntType = _convertPromoteTarget(to_level);
//     const promote_method: EAttribPromote = _convertPromoteMethod(method);
//     if (from_ent_type === to_ent_type) {
//         __model__.attribs.add.transferAttribValues(from_ent_type, attrib_name, indices, promote_method);
//     } else {
//         __model__.attribs.add.promoteAttribValues(from_ent_type, attrib_name, indices, to_ent_type, promote_method);
//     }
// }
