import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, idsBreak, getArrDepth } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { _MatMenuItemMixinBase } from '@angular/material/menu/typings/menu-item';
import { vecSum, vecDiv, vecAdd, vecSub, vecNorm, newellNorm } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { normal, area } from '@libs/geom/triangle';
import { checkIDs, checkCommTypes, checkIDnTypes} from './_check_args';

// ================================================================================================
export enum _EDistanceMethod {
    P_P_DISTANCE = 'p_to_p_distance',
    MIN_DISTANCE = 'min_distance'
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
/**
 * Calculates the distance between two positions.
 * @param __model__
 * @param position1 First position.
 * @param position2 Second position, or list of positions.
 * @param method Enum; distance or min_distance.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is [10,20].
 */
export function Distance(__model__: GIModel, position1: TId, position2: TId|TId[], method: _EDistanceMethod): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    const ents_arr1 = checkIDs(fn_name, 'position1', position1, ['isID'], ['POSI'])  as TEntTypeIdx;
    const ents_arr2 = checkIDs(fn_name, 'position2', position2, ['isID'], ['POSI']) as TEntTypeIdx|TEntTypeIdx[]; // TODO
    // --- Error Check ---
    if (method === _EDistanceMethod.P_P_DISTANCE) {
        return _distancePtoP(__model__, ents_arr1, ents_arr2);
    } else if (method === _EDistanceMethod.MIN_DISTANCE) {
        return _distanceMin(__model__, ents_arr1, ents_arr2);
    }
}
// ================================================================================================
/**
 * Calculates the length of a line or a list of lines.
 * @param __model__
 * @param lines Edge, wire or polyline.
 * @returns Length.
 * @example length1 = calc.Length (line1)
 */
export function Length(__model__: GIModel, lines: TId|TId[]): number {
    // --- Error Check ---
    checkIDs('calc.Length', 'lines', lines, ['isID', 'isIDList'], ['EDGE', 'WIRE', 'PLINE']);
    // --- Error Check ---
    if (!Array.isArray(lines)) {
        lines = [lines] as TId[];
    }
    const edges_i: number[] = [];
    let dist = 0;
    for (const line of lines) {
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
 * TODO: allow for a list of surfaces
 * @param __model__
 * @param entities A polygon, a face, a closed polyline, or a closed wire.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__: GIModel, entities: TId): number {
    // --- Error Check ---
    const fn_name = 'calc.Area';
    checkIDs(fn_name, 'entities', entities, ['isID'], ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    const [ent_type, index]: [EEntType, number] = idsBreak(entities) as TEntTypeIdx;
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
        if (__model__.geom.query.istWireClosed(wire_i)) {
            throw new Error(fn_name + ': ' + 'To calculate area, wire must be closed');
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
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge.
 * @param __model__
 * @param edge An edge
 * @returns The vector from the start point of an edge to the end point of an edge
 */
export function Vector(__model__: GIModel, edge: TId): Txyz {
    // --- Error Check ---
    checkIDs('vector.GetVector', 'edge', edge, ['isID'], ['EDGE']);
    // --- Error Check ---
    const [ent_type, index]: [EEntType, number] = idsBreak(edge) as TEntTypeIdx;
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecSub(end, start);
}
// ================================================================================================
function _centroid(__model__: GIModel, ents_arr: TEntTypeIdx[]): Txyz {
    const posis_i: number[] = [];
    for (const ent_arr of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]));
    }
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
/**
 * Calculates the centroid of a list of any entity.
 * @param __model__
 * @param entities List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.
 * @returns Centroid.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__: GIModel, entities: TId|TId[]): Txyz {
    if (!Array.isArray(entities)) { entities = [entities]; }
    const ents_arr: TEntTypeIdx[] = idsBreak(entities) as TEntTypeIdx[];
    // --- Error Check ---
    checkIDs('calc.Centroid', 'geometry', entities, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'POINT', 'EDGE', 'WIRE', 'PLINE', 'FACE', 'PGON', 'COLL']);
    // --- Error Check ---
    return _centroid(__model__, ents_arr);
}
// ================================================================================================
export function _normal(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type: EEntType = (ents_arr as TEntTypeIdx)[0];
        const index: number = (ents_arr as TEntTypeIdx)[1];
        if (isPgon(ent_type) || isFace(ent_type)) {
            // faces, these are already triangulated
            let face_i: number = index;
            if (isPgon(ent_type)) {
                face_i = __model__.geom.query.navPgonToFace(index);
            }
            const tris_i: number[] = __model__.geom.query.navFaceToTri(face_i);
            let normal_vec: Txyz = [0, 0, 0];
            for (const tri_i of tris_i) {
                const corners_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.TRI, tri_i);
                const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.attribs.query.getPosiCoords(corner_i));
                const tri_normal: Txyz = normal( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2], true);
                normal_vec = vecAdd(normal_vec, tri_normal);
            }
            return vecNorm(vecDiv(normal_vec, tris_i.length));
        } else if (isPline(ent_type) || isWire(ent_type)) {
            // wires, these need to be triangulated
            let wire_i: number = index;
            if (isPline(ent_type)) {
                wire_i = __model__.geom.query.navPlineToWire(index);
            }
            if (!__model__.geom.query.istWireClosed(wire_i)) {
                throw new Error('To calculate normals, wire must be closed');
            }
            const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.WIRE, index);
            const xyzs:  Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i) );
            const tris: number[][] = triangulate(xyzs);
            let normal_vec: Txyz = [0, 0, 0];
            for (const tri of tris) {
                const corners_xyzs: Txyz[] = tri.map(corner_i => xyzs[corner_i]);
                const tri_normal: Txyz = normal( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2], true );
                normal_vec = vecAdd(normal_vec, tri_normal);
            }
            return vecNorm(vecDiv(normal_vec, tris.length));
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _normal(__model__, ent_arr)) as Txyz[];
    }
}
// function _newell_normal(__model__: GIModel, ents_arr: TEntTypeIdx[]): Txyz {
//     const posis_i: number[] = [];
//     for (const ent_arr of ents_arr) {
//         posis_i.push(...__model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]));
//     }
//     const unique_posis_i = Array.from(new Set(posis_i));
//     const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
//     return newellNorm(unique_xyzs);
// }
/**
 * Calculates the normal of a list of positions, a polygon, a face, a closed polyline, a closed wire, or a plane..
 * @param __model__
 * @param entities List of positions, a polygon, a face, a closed polyline, a closed wire, or a plane.
 * @returns Vector.
 * @example normal1 = calc.Normal (polygon1)
 * @example_info If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.
 */
export function Normal(__model__: GIModel, entities: TId|TId[]): Txyz|Txyz[] {
    const ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    return _normal(__model__, ents_arr);
}
// ================================================================================================
/**
 * Calculates the position on a linear entity, given a t parameter.
 * @param __model__
 * @param line Edge, wire, or polyline.
 * @param t_param A value between 0 to 1.
 * @returns Set of XYZ coordinates.
 * @example coord1 = calc.ParamTToXyz (polyline1, 0.23)
 */
export function ParamTToXyz(__model__: GIModel, line: TId, t_param: number): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.ParamTToXyz';
    checkIDs(fn_name, 'line', line, ['isID'], ['EDGE', 'WIRE', 'POLYLINE']);
    checkCommTypes(fn_name, 't_param', t_param, ['isNumber']);
    if (t_param < 0 || t_param > 1) {throw new Error(fn_name + ': ' + 't_param is not between 0 and 1'); }
    // --- Error Check ---
    const edges_i: number[] = [];
    const [ent_type, index]: [EEntType, number] = idsBreak(line) as TEntTypeIdx;
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
            const divisor = to_t / edge_length;
            return vecAdd( xyz_pair[0], vecDiv(vecSub(xyz_pair[1], xyz_pair[0]), divisor) );
        }
    }
    // t param must be 1 (or greater)
    return xyz_pairs[num_edges - 1][1];
}
// ================================================================================================
/**
 * Calculates a location on a line to get t parameter.
 * @param __model__
 * @param lines List of edges, wires, or polylines.
 * @param locations List of positions, vertices, points, or coordinates.
 * @example coord1 = calc.ParamXyzToT (polyline1, [1,2,3])
 */
export function ParamXyzToT(__model__: GIModel, lines: TId|TId[], locations: TId|TId[]|Txyz|Txyz[]): number|number[] {
    // --- Error Check ---
    // const fn_name = 'calc.ParamXyzToT';
    // checkIDs(fn_name, 'lines', lines, ['isID', 'isIDList'], ['EDGE', 'WIRE', 'POLYLINE']);
    // checkIDnTypes(fn_name, 'locations', locations, ['isID', 'isIDList', 'isCoord'], ['POSI', 'VERT', 'POINT']);
    // --- Error Check ---
    throw new Error('Not impemented.'); return null;
}
// ================================================================================================
