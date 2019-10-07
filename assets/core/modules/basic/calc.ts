/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, idsBreak, getArrDepth, isVert, isPosi, isPoint } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { normal, area } from '@libs/geom/triangle';
import { checkIDs, checkCommTypes, checkIDnTypes, IDcheckObj, TypeCheckObj} from '../_check_args';

export enum _EDistanceMethod {
    P_P_DISTANCE = 'p_to_p_distance',
    MIN_DISTANCE = 'min_distance'
}
// ================================================================================================
/**
 * Calculates the distance between two positions.
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
    const ents_arr1 = checkIDs(fn_name, 'position1', entities1, [IDcheckObj.isID], [EEntType.POSI])  as TEntTypeIdx;
    const ents_arr2 = checkIDs(fn_name, 'position2', entities2, [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.POSI]) as
    TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    if (method === _EDistanceMethod.P_P_DISTANCE) {
        return _distancePtoP(__model__, ents_arr1, ents_arr2);
    } else if (method === _EDistanceMethod.MIN_DISTANCE) {
        return _distanceMin(__model__, ents_arr1, ents_arr2);
    }
}
function _distanceMin(__model__: GIModel, ent_arr1: TEntTypeIdx, ents_arr2: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    const depth2: number = getArrDepth(ents_arr2);
    if (depth2 === 1) {
        throw Error('Not implemented');
    } else if (depth2 === 2) {
        return (ents_arr2 as TEntTypeIdx[]).map( ent_arr2 => _distanceMin(__model__, ent_arr1, ent_arr2) ) as number[];
    }
}
function _distancePtoP(__model__: GIModel, ent_arr1: TEntTypeIdx, ents_arr2: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    const depth2: number = getArrDepth(ents_arr2);
    if (depth2 === 1) {
        const ent_arr2: TEntTypeIdx = ents_arr2 as TEntTypeIdx;
        const ps1_xyz: Txyz = __model__.attribs.query.getPosiCoords(ent_arr1[1]);
        const ps2_xyz: Txyz = __model__.attribs.query.getPosiCoords(ent_arr2[1]);
        return distance(ps1_xyz, ps2_xyz) as number;
    } else if (depth2 === 2) {
        return (ents_arr2 as TEntTypeIdx[]).map( ent_arr2 => _distancePtoP(__model__, ent_arr1, ent_arr2) ) as number[];
    }
}
// ================================================================================================
/**
 * Calculates the length of a line or a list of lines.
 * @param __model__
 * @param entities Edge, wire or polyline.
 * @returns Length.
 * @example length1 = calc.Length (line1)
 */
export function Length(__model__: GIModel, entities: TId|TId[]): number {
    // --- Error Check ---
    checkIDs('calc.Length', 'lines', entities, [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE]);
    // --- Error Check ---
    if (!Array.isArray(entities)) {
        entities = [entities] as TId[];
    }
    const edges_i: number[] = [];
    let dist = 0;
    for (const line of entities) {
        const [ent_type, index]: [EEntType, number] = idsBreak(line) as TEntTypeIdx;
        if (isEdge(ent_type)) {
            edges_i.push(index);
        } else if (isWire(ent_type)) {
            edges_i.push(...__model__.geom.query.navWireToEdge(index));
        } else if (isPline(ent_type)) {
            const wire_i: number = __model__.geom.query.navPlineToWire(index);
            edges_i.push(...__model__.geom.query.navWireToEdge(wire_i));
        } else {
            throw new Error('Entity is of wrong type. Must be a an edge, a wire or a polyline');
        }
    }
    for (const edge_i of edges_i) {
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
        const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
        dist += distance(xyz_0, xyz_1);
    }
    return dist;
}
// ================================================================================================
/**
 * Calculates the area of a surface or a list of surfaces.
 * @param __model__
 * @param entities A polygon, a face, a closed polyline, or a closed wire.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__: GIModel, entities: TId): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.Area';
    const ents_arr = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON, EEntType.FACE, EEntType.PLINE, EEntType.WIRE]) as TEntTypeIdx|TEntTypeIdx[];
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
        return (ents_arrs as TEntTypeIdx[]).map( ents_arr => _area(__model__, ents_arr) ) as number[];
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge.
 * @param __model__
 * @param entities An edge
 * @returns The vector [x, y, z] from the start point of an edge to the end point of an edge.
 */
export function Vector(__model__: GIModel, entities: TId): Txyz {
    // --- Error Check ---
    checkIDs('calc.Vector', 'edge', entities, [IDcheckObj.isID], [EEntType.EDGE]);
    // --- Error Check ---
    const [ent_type, index]: [EEntType, number] = idsBreak(entities) as TEntTypeIdx;
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecSub(end, start);
}
// ================================================================================================
/**
 * Calculates the centroid of a list of any entity.
 * @param __model__
 * @param entities List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.
 * @returns The centroid [x, y, z] of the entities. (No position is created in the model.)
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__: GIModel, entities: TId|TId[]): Txyz {
    if (!Array.isArray(entities)) { entities = [entities]; }
    const ents_arr: TEntTypeIdx[] = idsBreak(entities) as TEntTypeIdx[];
    // --- Error Check ---
    checkIDs('calc.Centroid', 'geometry', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.FACE, EEntType.PGON, EEntType.COLL]);
    // --- Error Check ---
    return _centroid(__model__, ents_arr);
}
function _centroid(__model__: GIModel, ents_arr: TEntTypeIdx[]): Txyz {
    // TODO optimise this, like bounding box code
    const posis_i: number[] = [];
    for (const ent_arr of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]));
    }
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities.
 * ~
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 * For edges, the normal is calculated by takingthe avery of teh normals of the two vertices.
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 * For points and positions with no vertices, the normal is [0, 0, 0].
 *
 * @param __model__
 * @param entities An entity, or list of entities.
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z].
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
export function Normal(__model__: GIModel, entities: TId|TId[], scale: number): Txyz|Txyz[] {
    const ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null);
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
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
// ================================================================================================
/**
 * Calculates the xyz location on an entity, given a parameter.
 * @param __model__
 * @param entities Edge, wire, or polyline.
 * @param param A value between 0 to 1.
 * @returns The coordinates of the location, [x, y, z]. (No position is created in the model.)
 * @example coord1 = calc.ParamTToXyz (polyline1, 0.23)
 */
export function Eval(__model__: GIModel, entities: TId, param: number): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.ParamTToXyz';
    checkIDs(fn_name, 'line', entities, [IDcheckObj.isID], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE]);
    checkCommTypes(fn_name, 't_param', param, [TypeCheckObj.isNumber]);
    if (param < 0 || param > 1) {throw new Error(fn_name + ': ' + 't_param is not between 0 and 1'); }
    // --- Error Check ---
    const edges_i: number[] = [];
    const [ent_type, index]: [EEntType, number] = idsBreak(entities) as TEntTypeIdx;
    if (isEdge(ent_type)) {
        edges_i.push(index);
    } else if (isWire(ent_type)) {
        edges_i.push(...__model__.geom.query.navWireToEdge(index));
    } else if (isPline(ent_type)) {
        const wire_i: number = __model__.geom.query.navPlineToWire(index);
        edges_i.push(...__model__.geom.query.navWireToEdge(wire_i));
    }
    // } else {
    //     throw new Error('Entity is of wrong type. Must be a an edge, a wire or a polyline');
    // }
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
    const t_param_mapped: number = param * total_dist;
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
