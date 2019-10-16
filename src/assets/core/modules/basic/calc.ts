/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, getArrDepth, isVert, isPosi, isPoint } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { area } from '@libs/geom/triangle';
import { checkIDs, checkCommTypes, IDcheckObj, TypeCheckObj} from '../_check_args';
import __ from 'underscore';
import * as THREE from 'three';


// ================================================================================================
/**
 * Calculates the distance to one position or a list of positions.
 * ~
 * @param __model__
 * @param entities1 First position.
 * @param entities2 Second position, or list of positions.
 * @param method Enum; distance or min_distance.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is [10,20].
 */
export function Distance(__model__: GIModel, entities1: TId, entities2: TId|TId[], method: _EDistanceMethod): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    const ents_arr1 = checkIDs(fn_name, 'entities1', entities1, [IDcheckObj.isID], [EEntType.POSI])  as TEntTypeIdx;
    const ents_arr2 = checkIDs(fn_name, 'entities2', entities2, [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.POSI]) as
    TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    // check what from is based on list length
    const from_posi_i: number = ents_arr1[1];
    const depth2: number = getArrDepth(ents_arr2);
    if (depth2 === 1) {
        return _distancePtoP(__model__, from_posi_i, ents_arr2[1]) as number;
    } else {
        const to_posis_i: number[] = (ents_arr2 as TEntTypeIdx[]).map( ent_arr2 => ent_arr2[1] );
        const dists: number[] = _distancePtoP(__model__, from_posi_i, to_posis_i) as number[];
        if (method === _EDistanceMethod.P_P_DISTANCE) {
            return dists;
        } else if (method === _EDistanceMethod.MIN_DISTANCE) {
            return Math.min(...dists);
        }
    }
}
function _distancePtoP(__model__: GIModel, from: number, to: number|number[]): number|number[] {
    if (!Array.isArray(to)) {
        const ps1_xyz: Txyz = __model__.attribs.query.getPosiCoords(from);
        const ps2_xyz: Txyz = __model__.attribs.query.getPosiCoords(to);
        return distance(ps1_xyz, ps2_xyz) as number;
    } else  {
        return to.map( to2 => _distancePtoP(__model__, from, to2) ) as number[];
    }
}
export enum _EDistanceMethod {
    P_P_DISTANCE = 'p_to_p_distance',
    MIN_DISTANCE = 'min_distance'
}
// ================================================================================================
/**
 * Calculates the length of an entity.
 * ~
 * The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
 * This includes polylines, polygons, faces, and collections.
 * ~
 * Given a list of edges, wires, or polylines, a list of lengths are returned.
 * ~
 * Given any types of entities from which wires can be extracted, a list of lengths are returned.
 * For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
 * ~
 * @param __model__
 * @param entities Single or list of edges, wires, or polylines, or other entities from which wires can be extracted.
 * @returns Lengths, a number or list of numbers.
 * @example length1 = calc.Length(line1)
 */
export function Length(__model__: GIModel, entities: TId|TId[]): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.Length';
    const ents_arr =  checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.FACE, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _length(__model__, ents_arr);
}
function _length(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            return _edgeLength(__model__, index);
        } else if (ent_type === EEntType.WIRE) {
            return _wireLength(__model__, index);
        } else if (ent_type === EEntType.PLINE) {
            const wire_i: number = __model__.geom.query.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        } else {
            const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
            return wires_i.map( wire_i => _wireLength(__model__, wire_i) ) as number[];
        }
    } else {
        const lengths: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _length(__model__, ents_arr) ) as number[]|number[][];
        return __.flatten(lengths);
    }
}
function _edgeLength(__model__: GIModel, edge_i: number): number {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
    const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return distance(xyz_0, xyz_1);
}
function _wireLength(__model__: GIModel, wire_i: number): number {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[i]);
        const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[i + 1]);
        dist += distance(xyz_0, xyz_1);
    }
    if (__model__.geom.query.istWireClosed(wire_i)) {
        const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[posis_i.length - 1]);
        const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
        dist += distance(xyz_0, xyz_1);
    }
    return dist;
}
// ================================================================================================
/**
 * Calculates the area of en entity.
 * ~
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 * ~
 * Given a list of entities, a list of areas are returned.
 * ~
 * @param __model__
 * @param entities Single or list of polygons, faces, closed polylines, closed wires, collections.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__: GIModel, entities: TId|TId[]): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.Area';
    const ents_arr = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.PGON, EEntType.FACE, EEntType.PLINE, EEntType.WIRE, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _area(__model__, ents_arr);
}
function _area(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (isPgon(ent_type) || isFace(ent_type)) {
            // faces, these are already triangulated
            let face_i: number = index;
            if (isPgon(ent_type)) {
                face_i = __model__.geom.query.navPgonToFace(index);
            }
            const tris_i: number[] = __model__.geom.query.navFaceToTri(face_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.TRI, tri_i);
                const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.attribs.query.getPosiCoords(corner_i));
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        } else if (isPline(ent_type) || isWire(ent_type)) {
            // wires, these need to be triangulated
            let wire_i: number = index;
            if (isPline(ent_type)) {
                wire_i = __model__.geom.query.navPlineToWire(index);
            }
            if (!__model__.geom.query.istWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.WIRE, index);
            const xyzs:  Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i) );
            const tris: number[][] = triangulate(xyzs);
            let total_area = 0;
            for (const tri of tris) {
                const corners_xyzs: Txyz[] = tri.map(corner_i => xyzs[corner_i]);
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2] );
                total_area += tri_area;
            }
            return total_area;
        } else {
            return 0;
        }
    } else {
        const areas: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _area(__model__, ents_arr) ) as number[]|number[][];
        return __.flatten(areas);
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 * ~
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 * ~
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 * ~
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
export function Vector(__model__: GIModel, entities: TId|TId[]): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    const ents_arrs: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.PGON, EEntType.FACE, EEntType.PLINE, EEntType.WIRE, EEntType.EDGE]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
function _vector(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
            const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
            const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
            return vecSub(end, start);
        } else {
            const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
            const edges_arrs: TEntTypeIdx[] = edges_i.map(edge_i => [EEntType.EDGE, edge_i] as [EEntType, number]);
            return edges_arrs.map( edges_arr => _vector(__model__, edges_arr) ) as Txyz[];
        }
    } else {
        const vectors_arrs: Txyz[]|Txyz[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _vector(__model__, ents_arr) ) as Txyz[]|Txyz[][];
        const all_vectors: Txyz[] = [];
        for (const vectors_arr of vectors_arrs) {
            if (getArrDepth(vectors_arr) === 1) {
                all_vectors.push(vectors_arr as Txyz);
            } else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr as Txyz);
                }
            }
        }
        return all_vectors;
    }
}
// ================================================================================================
/**
 * Calculates the centroid of an entity.
 * ~
 * The centroid is the average of the positions that make up that entity.
 * ~
 * Given a single entity, a single centroid will be returned.
 * ~
 * Given a list of entities, a list of centroids will be returned.
 * ~
 * Given a list of positions, a single centroid that that is the average of all those positions will be returned.
 * ~
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__: GIModel, entities: TId|TId[]): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    const ents_arrs: TEntTypeIdx|TEntTypeIdx[] = checkIDs('calc.fn_name', 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _centroid(__model__, ents_arrs);
}
function _centroid(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
        return _centroidPosis(__model__, posis_i);
    } else {
        // divide the input into posis and non posis
        ents_arr = ents_arr as TEntTypeIdx[];
        const posis_i: number[] = [];
        const np_ents_arr: TEntTypeIdx[] = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] === EEntType.POSI) {
                posis_i.push(ent_arr[1]);
            } else {
                np_ents_arr.push(ent_arr);
            }
        }
        // if we only have posis, just return one centorid
        // in all other cases return a list of centroids
        const np_cents: Txyz[] = (np_ents_arr as TEntTypeIdx[]).map( ent_arr => _centroid(__model__, ent_arr) ) as Txyz[];
        if (posis_i.length > 0) {
            const cen_posis: Txyz = _centroidPosis(__model__, posis_i);
            if (np_cents.length === 0) {
                return cen_posis;
            } else {
                np_cents.push(cen_posis);
            }
        }
        return np_cents;
    }
}
function _centroidPosis(__model__: GIModel, posis_i: number[]): Txyz {
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
 * by the specified scale factor.
 * ~
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
 * ~
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 * ~
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 * ~
 * For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
 * ~
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 * ~
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 * ~
 * If the normal cannot be calculated, [0, 0, 0] will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
export function Normal(__model__: GIModel, entities: TId|TId[], scale: number): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as  TEntTypeIdx|TEntTypeIdx[];
    checkCommTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
export function _normal(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], scale: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type: EEntType = (ents_arr as TEntTypeIdx)[0];
        const index: number = (ents_arr as TEntTypeIdx)[1];
        if (isPgon(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getFaceNormal(__model__.geom.query.navPgonToFace(index));
            return vecMult(norm_vec, scale);
        } else if (isFace(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getFaceNormal(index);
            return vecMult(norm_vec, scale);
        } else if (isPline(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getWireNormal(__model__.geom.query.navPlineToWire(index));
            return vecMult(norm_vec, scale);
        } else if (isWire(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getWireNormal(index);
            return vecMult(norm_vec, scale);
        } else if (isEdge(ent_type)) {
            const verts_i: number[] = __model__.geom.query.navEdgeToVert(index);
            const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
            const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
            return vecMult(norm_vec, scale);
        } else if (isVert(ent_type)) {
            const norm_vec: Txyz = _vertNormal(__model__, index);
            return vecMult(norm_vec, scale);
        } else if (isPosi(ent_type)) {
            const verts_i: number[] = __model__.geom.query.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
                const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
                return vecMult(norm_vec, scale);
            }
            return [0, 0, 0];
        }  else if (isPoint(ent_type)) {
            return [0, 0, 0];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _normal(__model__, ent_arr, scale)) as Txyz[];
    }
}
function _vertNormal(__model__: GIModel, index: number) {
    let norm_vec: Txyz;
    const edges_i: number[] = __model__.geom.query.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i[0]);
        const posis1_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i[1]);
        const p_mid: Txyz = __model__.attribs.query.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a: Txyz = __model__.attribs.query.getPosiCoords(posis0_i[0]);
        const p_b: Txyz = __model__.attribs.query.getPosiCoords(posis1_i[1]);
        norm_vec = vecCross( vecFromTo(p_mid, p_a), vecFromTo(p_mid, p_b), true);
        if (vecLen(norm_vec) > 0) { return norm_vec; }
    }
    const wire_i: number = __model__.geom.query.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 * ~
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * evaluating at t=0 gives that xyz at the start,
 * evaluating at t=0.5 gives the xyz halfway along the polyline,
 * evaluating at t=1 gives the xyz at the end of the polyline.
 * ~
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 * ~
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 * ~
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 * ~
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example coord1 = calc.Eval (polyline1, 0.23)
 */
export function Eval(__model__: GIModel, entities: TId|TId[], t_param: number): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    const ents_arrs: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    checkCommTypes(fn_name, 'param', t_param, [TypeCheckObj.isNumber01]);
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
function _eval(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], t_param: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.PLINE) {
            const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
            const num_edges: number = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists: number[] = [];
            const xyz_pairs: Txyz[][] = [];
            for (const edge_i of edges_i) {
                const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
                const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
                const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
                const dist: number = distance(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped: number = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair: Txyz[] = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) { dist_a = dists[i - 1]; }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return vecAdd( xyz_pair[0], vecMult(vecSub(xyz_pair[1], xyz_pair[0]), vec_len) );
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        } else {
            const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
            const wires_arrs: TEntTypeIdx[] = wires_i.map(wire_i => [EEntType.WIRE, wire_i] as [EEntType, number]);
            return wires_arrs.map( wires_arr => _eval(__model__, wires_arr, t_param) ) as Txyz[];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _eval(__model__, ent_arr, t_param) ) as Txyz[];
    }
}
// ================================================================================================
/**
 * Calculates the 't' parameter along a linear entity, given a location.
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 *
 * @param __model__
 * @param lines List of edges, wires, or polylines.
 * @param locations List of positions, vertices, points, or coordinates.
 * @return The 't' parameter vale, between 0 and 1.
 * @example coord1 = calc.ParamXyzToT (polyline1, [1,2,3])
 */
export function _ParamXyzToT(__model__: GIModel, lines: TId|TId[], locations: TId|TId[]|Txyz|Txyz[]): number|number[] {
    // --- Error Check ---
    // const fn_name = 'calc.ParamXyzToT';
    // checkIDs(fn_name, 'lines', lines, [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE]);
    // checkIDnTypes(fn_name, 'locations', locations,
    //               [IDcheckObj.isID, IDcheckObj.isIDList, TypeCheckObj.isNumberList], [EEntType.POSI, EEntType.VERT, EEntType.POINT]);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
// ================================================================================================
