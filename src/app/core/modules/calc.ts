import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntityTypeStr } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, idBreak, isPgon, isFace } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { _MatMenuItemMixinBase } from '@angular/material/menu/typings/menu-item';
import { vecSum, vecDiv, vecAdd, vecSub, vecNorm } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { normal, area } from '@libs/geom/triangle';
import { checkIDs, checkCommTypes, checkIDnTypes} from './_check_args';

export enum _EDistanceMethod {
    DISTANCE = 'distance',
    MIN_DISTANCE = 'min_distance'
}
/**
 * Calculates the distance between two positions.
 * @param __model__
 * @param position1 First position.
 * @param position2 Second position.
 * @param method Enum
 * @returns Distance.
 * @example distance1 = calc.Distance (position1, position2)
 * @example_info position1 = [0,0,0], position2 = [0,0,10]
 * Expected value of distance is 10.
 */
export function Distance(__model__: GIModel, position1: TId, position2: TId, method: _EDistanceMethod): number {
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    checkIDs(fn_name, 'position1', position1, ['isID'], ['POSI']);
    checkIDs(fn_name, 'position2', position2, ['isID'], ['POSI']);
    // --- Error Check ---
    const ps1_xyz: Txyz = __model__.attribs.query.getPosiCoords(idBreak(position1)[1]);
    const ps2_xyz: Txyz = __model__.attribs.query.getPosiCoords(idBreak(position2)[1]);
    return distance(ps1_xyz, ps2_xyz);
}
// /**
//  * Calculates the minimum distance between a location and an object, or two objects.
//  * @param __model__
//  * @param locationOrObject Position, vertex, point, list of coordinates, polyline, or polygon.
//  * @param object Polyline or polygon.
//  * @returns Minimum distance.
//  * @example mindistance1 = calc.MinDistance (position1, polyline1)
//  * @example_info Calculates minimum distance between position1 and polyline1.
//  * @example mindistance2 = calc.MinDistance (polyline1, polyline2)
//  * @example_info Calculates minimum distance between polyline1 and polyline2.
//  */
// export function MinDistance(__model__: GIModel, locationOrObject: TId|TId[], object: TId): number {
//     // --- Error Check ---
//     // Nature of locationOrObject argument is inconsistent internally
//     // (why take list of coordinates but not list of anything else?)
//     // --- Error Check ---
//     throw new Error('Not impemented.'); return null;
// }
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
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(line);
        if (isEdge(line)) {
            edges_i.push(index);
        } else if (isWire(line)) {
            edges_i.push(...__model__.geom.query.navWireToEdge(index));
        } else if (isPline(line)) {
            const wire_i: number = __model__.geom.query.navPlineToWire(index);
            edges_i.push(...__model__.geom.query.navWireToEdge(wire_i));
        } else {
            throw new Error('Entity is of wrong type. Must be a an edge, a wire or a polyline');
        }
        for (const edge_i of edges_i) {
            const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edge_i);
            const xyz_0: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
            const xyz_1: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
            dist += distance(xyz_0, xyz_1);
        }
    }
    return dist;
}

/**
 * Calculates the area of a surface or a list of surfaces.
 * @param __model__
 * @param geometry A polygon, a face, a closed polyline, or or closed wire.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__: GIModel, geometry: TId): number {
    // --- Error Check ---
    const fn_name = 'calc.Area';
    checkIDs(fn_name, 'geometry', geometry, ['isID'], ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    const [_, index]: [EEntityTypeStr, number] = idBreak(geometry);
    if (isPgon(geometry) || isFace(geometry)) {
        // faces, these are already triangulated
        let face_i: number = index;
        if (isPgon(geometry)) {
            face_i = __model__.geom.query.navPgonToFace(index);
        }
        const tris_i: number[] = __model__.geom.query.navFaceToTri(face_i);
        let total_area = 0;
        for (const tri_i of tris_i) {
            const corners_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.TRI, tri_i);
            const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.attribs.query.getPosiCoords(corner_i));
            const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
            total_area += tri_area;
        }
        return total_area;
    } else if (isPline(geometry) || isWire(geometry)) {
        // wires, these need to be triangulated
        let wire_i: number = index;
        if (isPline(geometry)) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        }
        if (__model__.geom.query.istWireClosed(wire_i)) {
            throw new Error(fn_name + ': ' + 'To calculate area, wire must be closed');
        }
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.WIRE, index);
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
    // } else {
    //     throw new Error('Entity is of wrong type. Must be a a polygon, a face, a polyline or a wire');
    // }
}
/**
 * Calculates the centroid of a list of any geometry.
 * @param __model__
 * @param geometry List of positions, vertices, points, edges, wires, polylines, faces, polygons, or collections.
 * @returns Centroid.
 * @example centroid1 = calc.Centroid (geometry)
 */
export function Centroid(__model__: GIModel, geometry: TId|TId[]): Txyz {
    // --- Error Check ---
    checkIDs('calc.Centroid', 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'POINT', 'EDGE', 'WIRE', 'PLINE', 'FACE', 'PGON', 'COLL']);
    // --- Error Check ---
    if (!Array.isArray(geometry)) { geometry = [geometry]; }
    const posis_i: number[] = [];
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id);
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type_str, index));
    }
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
/**
 * Calculates the xyz position on a linear entity, given a t parameter.
 * @param __model__
 * @param line Edge, wire, or polyline.
 * @param t_param A value between 0 to 1.
 * @returns Set of coordinates.
 * @example coord1 = calc.ParamTToXyz (lines, t_param)
 */
export function ParamTToXyz(__model__: GIModel, line: TId, t_param: number): Txyz|Txyz[] {
    // --- Error Check ---
    const fn_name = 'calc.ParamTToXyz';
    checkIDs(fn_name, 'line', line, ['isID'], ['EDGE', 'WIRE', 'POLYLINE']);
    checkCommTypes(fn_name, 't_param', t_param, ['isNumber']);
    if (t_param < 0 || t_param > 1) {throw new Error(fn_name + ': ' + 't_param is not between 0 and 1'); }
    // --- Error Check ---
    const edges_i: number[] = [];
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(line);
    if (isEdge(line)) {
        edges_i.push(index);
    } else if (isWire(line)) {
        edges_i.push(...__model__.geom.query.navWireToEdge(index));
    } else if (isPline(line)) {
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
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edge_i);
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
/**
 * Calculates a location on a line to get t parameter.
 * @param __model__
 * @param lines List of edges, wires, or polylines.
 * @param locations List of positions, vertices, points, or coordinates.
 * @example coord1 = calc.ParamXyzToT (lines, locations)
 */
export function ParamXyzToT(__model__: GIModel, lines: TId|TId[], locations: TId|TId[]|Txyz|Txyz[]): number|number[] {
    // --- Error Check ---
    const fn_name = 'calc.ParamXyzToT';
    checkIDs(fn_name, 'lines', lines, ['isID', 'isIDList'], ['EDGE', 'WIRE', 'POLYLINE']);
    checkIDnTypes(fn_name, 'locations', locations, ['isID', 'isIDList', 'isCoord'], ['POSI', 'VERT', 'POINT']);
    // --- Error Check ---
    throw new Error('Not impemented.'); return null;
}

