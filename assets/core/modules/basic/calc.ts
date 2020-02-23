/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane, TBBox } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, getArrDepth, isVert, isPosi, isPoint, isEmptyArr } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot, vecNorm } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { area } from '@libs/geom/triangle';
import { checkIDs, checkArgTypes, IDcheckObj, TypeCheckObj} from '../_check_args';
import __ from 'underscore';
import { getCentroid } from './_common';
import { rayFromPln } from '@assets/core/inline/_ray';
import { isEmptyArr2 } from '@assets/libs/util/arrs';


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
    if (isEmptyArr2(entities2)) { return []; }
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
    if (isEmptyArr2(entities)) { return []; }
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
            const wire_i: number = __model__.geom.nav.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        } else {
            const wires_i: number[] = __model__.geom.nav.navAnyToWire(ent_type, index);
            return wires_i.map( wire_i => _wireLength(__model__, wire_i) ) as number[];
        }
    } else {
        const lengths: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _length(__model__, ents_arr) ) as number[]|number[][];
        return __.flatten(lengths);
    }
}
function _edgeLength(__model__: GIModel, edge_i: number): number {
    const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return distance(xyz_0, xyz_1);
}
function _wireLength(__model__: GIModel, wire_i: number): number {
    const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[i]);
        const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[i + 1]);
        dist += distance(xyz_0, xyz_1);
    }
    if (__model__.geom.query.isWireClosed(wire_i)) {
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
    if (isEmptyArr2(entities)) { return []; }
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
                face_i = __model__.geom.nav.navPgonToFace(index);
            }
            const tris_i: number[] = __model__.geom.nav.navFaceToTri(face_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.TRI, tri_i);
                const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.attribs.query.getPosiCoords(corner_i));
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        } else if (isPline(ent_type) || isWire(ent_type)) {
            // wires, these need to be triangulated
            let wire_i: number = index;
            if (isPline(ent_type)) {
                wire_i = __model__.geom.nav.navPlineToWire(index);
            }
            if (!__model__.geom.query.isWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, index);
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
    if (isEmptyArr2(entities)) { return []; }
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
            const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, index);
            const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
            const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
            return vecSub(end, start);
        } else {
            const edges_i: number[] = __model__.geom.nav.navAnyToEdge(ent_type, index);
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
    if (isEmptyArr2(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    const ents_arrs: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return getCentroid(__model__, ents_arrs);
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
    if (isEmptyArr2(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as  TEntTypeIdx|TEntTypeIdx[];
    checkArgTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
export function _normal(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], scale: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type: EEntType = (ents_arr as TEntTypeIdx)[0];
        const index: number = (ents_arr as TEntTypeIdx)[1];
        if (isPgon(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getFaceNormal(__model__.geom.nav.navPgonToFace(index));
            return vecMult(norm_vec, scale);
        } else if (isFace(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getFaceNormal(index);
            return vecMult(norm_vec, scale);
        } else if (isPline(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getWireNormal(__model__.geom.nav.navPlineToWire(index));
            return vecMult(norm_vec, scale);
        } else if (isWire(ent_type)) {
            const norm_vec: Txyz = __model__.geom.query.getWireNormal(index);
            return vecMult(norm_vec, scale);
        } else if (isEdge(ent_type)) {
            const verts_i: number[] = __model__.geom.nav.navEdgeToVert(index);
            const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
            const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
            return vecMult(norm_vec, scale);
        } else if (isVert(ent_type)) {
            const norm_vec: Txyz = _vertNormal(__model__, index);
            return vecMult(norm_vec, scale);
        } else if (isPosi(ent_type)) {
            const verts_i: number[] = __model__.geom.nav.navPosiToVert(index);
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
    const edges_i: number[] = __model__.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
        const posis1_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[1]);
        const p_mid: Txyz = __model__.attribs.query.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a: Txyz = __model__.attribs.query.getPosiCoords(posis0_i[0]);
        const p_b: Txyz = __model__.attribs.query.getPosiCoords(posis1_i[1]);
        norm_vec = vecCross( vecFromTo(p_mid, p_a), vecFromTo(p_mid, p_b), true);
        if (vecLen(norm_vec) > 0) { return norm_vec; }
    }
    const wire_i: number = __model__.geom.nav.navEdgeToWire(edges_i[0]);
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
    if (isEmptyArr2(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    const ents_arrs: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    checkArgTypes(fn_name, 'param', t_param, [TypeCheckObj.isNumber01]);
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
function _eval(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], t_param: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.PLINE) {
            const edges_i: number[] = __model__.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges: number = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists: number[] = [];
            const xyz_pairs: Txyz[][] = [];
            for (const edge_i of edges_i) {
                const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
            const wires_i: number[] = __model__.geom.nav.navAnyToWire(ent_type, index);
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



// ================================================================================================
/**
 * Returns a ray for an edge, a face, or a polygons. For edges, it returns a ray along the edge, from teh start vertex to the end vertex
 * For a face or polygon, it returns the ray that is the z-axis of the plane.
 * ~
 * For an edge, the ray vector is not normalised. For a face or polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a face, or a polygon, or a list.
 * @returns The ray.
 */
export function Ray(__model__: GIModel, entities: TId|TId[]): TRay|TRay[] {
    if (isEmptyArr2(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Ray';
    const ents_arr = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.EDGE, EEntType.PLINE, EEntType.FACE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
function _getRayFromEdge(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs: Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
}
function _getRayFromFace(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const plane: TPlane = _getPlane(__model__, ent_arr) as TPlane;
    return rayFromPln(plane) as TRay;
}
function _getRayFromPline(__model__: GIModel, ent_arr: TEntTypeIdx): TRay[] {
    const edges_i: number[] = __model__.geom.nav.navAnyToEdge(ent_arr[0], ent_arr[1]);
    return edges_i.map( edge_i => _getRayFromEdge(__model__, [EEntType.EDGE, edge_i]) ) as TRay[];
}
function _getRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TRay|TRay[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (ent_arr[0] === EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.PLINE) {
            return _getRayFromPline(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.FACE) {
            return _getRayFromFace(__model__, ent_arr);
        } else { // must be a polygon
            const face_i: number = __model__.geom.nav.navPgonToFace(ent_arr[1]);
            return _getRayFromFace(__model__, [EEntType.FACE, face_i]);
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _getRay(__model__, ent_arr)) as TRay[];
    }
}
// ================================================================================================
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 * ~
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities
 * @returns The plane.
 */
export function Plane(__model__: GIModel, entities: TId|TId[]): TPlane|TPlane[] {
    if (isEmptyArr2(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Plane';
    const ents_arr =  checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null); // takes in any
    // TODO [EEntType.PGON, EEntType.FACE, EEntType.PLINE, EEntType.WIRE]);
    // --- Error Check ---
    return _getPlane(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}
function _getPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TPlane|TPlane[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const unique_posis_i = Array.from(new Set(posis_i));
        if (unique_posis_i.length < 3) { throw new Error('Too few points to calculate plane.'); }
        const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
        const origin: Txyz = vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
        // const normal: Txyz = newellNorm(unique_xyzs);
        const normal: Txyz = _normal(__model__, ent_arr, 1) as Txyz;
        const x_vec: Txyz = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
        const y_vec: Txyz = vecCross(normal, x_vec); // must be z-axis, x-axis
        return [origin, x_vec, y_vec] as TPlane;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _getPlane(__model__, ent_arr)) as TPlane[];
    }
}
// ================================================================================================
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 * ~
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
export function BBox(__model__: GIModel, entities: TId|TId[]): TBBox {
    if (!Array.isArray(entities)) { entities = [entities]; }
    // --- Error Check ---
    const fn_name = 'calc.BBox';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isIDList], null) as TEntTypeIdx[]; // all
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
function _getBoundingBox(__model__: GIModel, ents_arr: TEntTypeIdx[]): TBBox {
    const posis_set_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    const corner_min: Txyz = [Infinity, Infinity, Infinity];
    const corner_max: Txyz = [-Infinity, -Infinity, -Infinity];
    for (const unique_xyz of unique_xyzs) {
        if (unique_xyz[0] < corner_min[0]) { corner_min[0] = unique_xyz[0]; }
        if (unique_xyz[1] < corner_min[1]) { corner_min[1] = unique_xyz[1]; }
        if (unique_xyz[2] < corner_min[2]) { corner_min[2] = unique_xyz[2]; }
        if (unique_xyz[0] > corner_max[0]) { corner_max[0] = unique_xyz[0]; }
        if (unique_xyz[1] > corner_max[1]) { corner_max[1] = unique_xyz[1]; }
        if (unique_xyz[2] > corner_max[2]) { corner_max[2] = unique_xyz[2]; }
    }
    return [
        [(corner_min[0] + corner_max[0]) / 2, (corner_min[1] + corner_max[1]) / 2, (corner_min[2] + corner_max[2]) / 2],
        corner_min,
        corner_max,
        [corner_max[0] - corner_min[0], corner_max[1] - corner_min[1], corner_max[2] - corner_min[2]]
    ];
}
// ================================================================================================
// /**
//  * Calculates the distance between a ray or plane and a list of positions.
//  * ~
//  * @param __model__
//  * @param ray_or_plane Ray or a plane.
//  * @param entities A position or list of positions.
//  * @param method Enum; all_distances or min_distance.
//  * @returns Distance, or list of distances.
//  * @example distance1 = virtual.Distance(ray, positions, all_distances)
//  * @example_info Returns a list of distances between the ray and each position.
//  */
// export function Distance(__model__: GIModel, ray_or_plane: TRay|TPlane, entities: TId|TId[], method: _EDistanceMethod): number|number[] {
//     // --- Error Check ---
//     const fn_name = 'virtual.Distance';
//     checkCommTypes(fn_name, 'ray_or_plane', ray_or_plane, [TypeCheckObj.isRay, TypeCheckObj.isPlane]);
//     const ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
//         [EEntType.POSI]) as TEntTypeIdx|TEntTypeIdx[];
//     // --- Error Check ---
//     const one_posi: boolean = getArrDepth(ents_arr) === 1;
//     // get the to posis_i
//     let posis_i: number|number[] = null;
//     if (one_posi) {
//         posis_i = ents_arr[1] as number;
//     } else {
//         posis_i = (ents_arr as TEntTypeIdx[]).map( ent_arr => ent_arr[1] ) as number[];
//     }
//     // get a list of distances
//     let dists: number|number[] = null;
//     if (ray_or_plane.length === 2) { // ray
//         const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray_or_plane[0]), new THREE.Vector3(...ray_or_plane[1]));
//         dists = _distanceRaytoP(__model__, ray_tjs, posis_i);
//     } else if (ray_or_plane.length === 3) { // plane
//         const plane_normal: Txyz = vecCross(ray_or_plane[1], ray_or_plane[2]);
//         const plane_tjs: THREE.Plane = new THREE.Plane();
//         plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...ray_or_plane[0]) );
//         dists = _distancePlanetoP(__model__, plane_tjs, posis_i);
//     }
//     // return either the min or the whole list
//     if (method === _EDistanceMethod.MIN_DISTANCE && !one_posi) {
//         return Math.min(...dists as number[]);
//     }
//     return dists;
// }
// function _distanceRaytoP(__model__: GIModel, ray_tjs: THREE.Ray, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.attribs.query.getPosiCoords(posis_i);
//         return ray_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distanceRaytoP(__model__, ray_tjs, posi_i) ) as number[];
//     }
// }
// function _distancePlanetoP(__model__: GIModel, plane_tjs: THREE.Plane, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.attribs.query.getPosiCoords(posis_i);
//         return plane_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distancePlanetoP(__model__, plane_tjs, posi_i) ) as number[];
//     }
// }
// export enum _EDistanceMethod {
//     ALL_DISTANCES = 'all_distances',
//     MIN_DISTANCE = 'min_distance'
// }
