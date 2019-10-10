/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, but they may change attribute values.
 * All these functions all return void.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TEntTypeIdx} from '@libs/geo-info/common';
import { getArrDepth, isColl, isPgon, isPline, isPoint, isPosi } from '@libs/geo-info/id';
import { vecAdd, vecSum, vecDiv, vecFromTo, vecNorm, vecCross, vecSetLen, vecLen,
    vecAng, vecDot, vecRev, vecSub } from '@libs/geom/vectors';
import { checkCommTypes, checkIDs, IDcheckObj, TypeCheckObj} from '../_check_args';
import { rotateMatrix, multMatrix, scaleMatrix, mirrorMatrix, xfromSourceTargetMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import { distance } from '@assets/libs/geom/distance';
import __ from 'underscore';

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
 *
 * @param __model__
 * @param entities An entity or list of entities.
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
    // --- Error Check ---
    const fn_name = 'modify.Move';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                            EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    checkCommTypes(fn_name, 'vectors', vectors, [TypeCheckObj.isVector, TypeCheckObj.isVectorList]);
    // --- Error Check ---
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
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
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin A list of three numbers (or a position, point, or vertex).
 * @param axis A list of three numbers.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 on plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, entities: TId|TId[], origin: Txyz|TId|TPlane, axis: Txyz, angle: number): void {
    // --- Error Check ---
    const fn_name = 'modify.Rotate';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                            EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isOrigin, TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'axis', axis, [TypeCheckObj.isXYZlist]);
    checkCommTypes(fn_name, 'angle', angle, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const origin_posi = __model__.geom.query.navAnyToPosi(ori_ents_arr[0], ori_ents_arr[1]);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    if (Array.isArray(origin) && Array.isArray(origin[0])) { // handles plane type
        origin = origin[0];
    }
    // rotate all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = rotateMatrix(origin as [number, number, number], axis, angle);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return; // specifies that nothing is returned
}
// ================================================================================================
/**
 * Scales entities on plane by factor.
 * ~
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Position, point, vertex, list of three numbers, plane.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z].
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 * @example modify.Scale(entities, plane1, [0.5, 1, 1])
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
export function Scale(__model__: GIModel, entities: TId|TId[], origin: TId|Txyz|TPlane, scale: number|Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Scale';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                            EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isOrigin, TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber, TypeCheckObj.isXYZlist]);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const origin_posi = __model__.geom.query.navAnyToPosi(ori_ents_arr[0], ori_ents_arr[1]);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
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
    const matrix: Matrix4 = scaleMatrix(origin, scale);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return; // specifies that nothing is returned
}
// ================================================================================================
/**
 * Mirrors entities across plane.
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Position, vertex, point, list of three numbers.
 * @param direction Vector or a list of three numbers.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: GIModel, entities: TId|TId[], origin: Txyz|TId, direction: Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Mirror';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                            EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isOrigin]);
    checkCommTypes(fn_name, 'direction', direction, [TypeCheckObj.isVector]);
    // --- Error Check ---

    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const [origin_ent_type, origin_index]: TEntTypeIdx = ori_ents_arr as TEntTypeIdx;
        const origin_posi = __model__.geom.query.navAnyToPosi(origin_ent_type, origin_index);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    // mirror all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = mirrorMatrix(origin, direction);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
// ================================================================================================
/**
 * Transforms entities from one construction plane to another.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from Plane defining target construction plane.
 * @param to Plane defining destination construction plane.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: GIModel, entities: TId|TId[], from: TPlane, to: TPlane): void {
    // --- Error Check ---
    const fn_name = 'modify.XForm';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                            EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    checkCommTypes(fn_name, 'from', from, [TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'to', to, [TypeCheckObj.isPlane]);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }

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
    // --- Error Check ---
    const fn_name = 'modify.Offset';
    let ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
                            [EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    checkCommTypes(fn_name, 'dist', dist, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // get all wires and offset
    const pgons_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        for (const wire_i of wires_i) {
            _offset(__model__, wire_i, dist);
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
function _offset(__model__: GIModel, wire_i: number, dist: number): void {
    // get the normal of the wire
    let vec_norm: Txyz = __model__.geom.query.getWireNormal(wire_i);
    if (vecLen(vec_norm) === 0) {
        vec_norm = [0, 0, 1];
    }
    // loop through all edges and collect the required data
    const edges_i: number[] = __model__.geom.query.navAnyToEdge(EEntType.WIRE, wire_i);
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
    if (is_closed) {
        edges_i.push(edges_i[0]); // add to the end
    }
    // loop through all the valid edges
    for (let i = 0; i < edges_i.length - 1; i++) {
        // get the two edges
        const this_edge_i: number = edges_i[i];
        const next_edge_i: number = edges_i[i + 1];
        // get the end xyz of this edge
        const old_xyz: Txyz = pairs_xyzs[this_edge_i][1];
        const posi_i: number = pairs_posis_i[this_edge_i][1]; // the end posi of this edge
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
 * Modifies a collection.
 * ~
 * If the method is 'set_parent', then the parent can be updated by specifying a parent collection.
 * If the method is 'add_entities', then entities are added to the collection.
 * If the method is 'remove_entities', then entities are removed from the collection.
 * If adding or removing entities, then the entities must be points, polylines, or polygons.
 *
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, and polygons, or a single collection.
 * @param method Enum, the method to use when modifying the collection.
 * @returns void
 */
export function Collection(__model__: GIModel, coll: TId, entities: TId|TId[], method: _EModifyCollectionMethod): void {
    // --- Error Check ---
    const coll_arr = checkIDs('modify.Collection', 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
    const ents_arr = checkIDs('modify.Collection', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _collection(__model__, coll_arr, ents_arr, method);
}
export enum _EModifyCollectionMethod {
    SET_PARENT_ENTITY = 'set_parent',
    ADD_ENTITIES = 'add_entities',
    REMOVE_ENTITIES = 'remove_entities'
}
function _collection(__model__: GIModel, coll_arr: TEntTypeIdx, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        method: _EModifyCollectionMethod): void {
    const [_, coll_i]: TEntTypeIdx = coll_arr;
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        ents_arr = [ents_arr as TEntTypeIdx];
    }
    ents_arr = ents_arr as TEntTypeIdx[];
    if (method === _EModifyCollectionMethod.SET_PARENT_ENTITY) {
        if (ents_arr.length !== 1) {
            throw new Error('Error setting collection parent. A collection can only have one parent.');
        }
        const [parent_ent_type, parent_coll_i]: TEntTypeIdx = ents_arr[0];
        if (parent_ent_type !== EEntType.COLL) {
            throw new Error('Error setting collection parent. The parent must be another collection.');
        }
        __model__.geom.modify.setCollParent(coll_i, parent_coll_i);
        return;
    }
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POINT:
                points_i.push(ent_i);
                break;
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            default:
                throw new Error('Error modifying collection. A collection can only contain points, polylines, and polygons.');
        }
    }
    if (method === _EModifyCollectionMethod.ADD_ENTITIES) {
        __model__.geom.modify.collAddEnts(coll_i, points_i, plines_i, pgons_i);
    } else { // Remove entities
        __model__.geom.modify.collRemoveEnts(coll_i, points_i, plines_i, pgons_i);
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
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Reverse', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.WIRE, EEntType.PLINE, EEntType.FACE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _reverse(__model__, ents_arr);
}
function _reverse(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.reverse(wire_i) );
    } else {
        (ents_arr as TEntTypeIdx[]).forEach( ent_arr => _reverse(__model__, ent_arr) );
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
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Reverse', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.WIRE, EEntType.PLINE, EEntType.FACE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _shift(__model__, ents_arr, offset);
}
function _shift(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], offset: number): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.shift(wire_i, offset) );
    } else {
        (ents_arr as TEntTypeIdx[]).forEach( ent_arr => _shift(__model__, ent_arr, offset) );
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
export function Close(__model__: GIModel, lines: TId|TId[]): void {
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Close', 'lines', lines, [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE]);
    // --- Error Check ---
    _close(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}
function _close(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type !== EEntType.WIRE) {
            throw new Error('modify.Close: Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.modify.closeWire(wire_i);
    } else {
        for (const ents of ents_arr) {
            _close(__model__, ents as TEntTypeIdx);
        }
    }
}
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
// ================================================================================================
/**
 * Welds entities together.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example modify.Weld([polyline1,polyline2])
 * @example_info Welds both polyline1 and polyline2 together. Entities must be of the same type.
 */
export function _Weld(__model__: GIModel, entities: TId[]): void {
    // --- Error Check ---
    // const ents_arr = checkIDs('modify.Weld', 'entities', entities, [IDcheckObj.isIDList],
    //                          [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
    //                           EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    // --- Error Check ---
    throw new Error('Not implemented.');
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
    // @ts-ignore
    if (Array.isArray(entities)) { entities = __.flatten(entities); }
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Delete', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const bool_del_unused_posis: boolean = (del_unused_posis === _EDeleteMethod.DEL_UNUSED_POINTS);
    _delete(__model__, ents_arr, bool_del_unused_posis);
}
export enum _EDeleteMethod {
    DEL_UNUSED_POINTS =  'del_unused_posis',
    KEEP_UNUSED_POINTS  =  'keep_unused_posis'
}
function _delete(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], del_unused_posis: boolean): void {
    ents_arr = ((getArrDepth(ents_arr) === 1) ? [ents_arr] : ents_arr) as TEntTypeIdx[];
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
    // @ts-ignore
    if (Array.isArray(entities)) { entities = __.flatten(entities); }
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Delete', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _keep(__model__, ents_arr);
}
function _keep(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    ents_arr = ((getArrDepth(ents_arr) === 1) ? [ents_arr] : ents_arr) as TEntTypeIdx[];
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
