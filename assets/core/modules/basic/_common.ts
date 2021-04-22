/**
 * Shared utility functions
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TRay, TEntTypeIdx } from '@libs/geo-info/common';
import { getArrDepth } from '@assets/libs/util/arrs';
import { vecDiv, vecSum, vecAvg, vecFromTo, vecLen, vecCross, vecNorm, vecAdd, vecSetLen, vecDot } from '@assets/libs/geom/vectors';
import { isRay, isPlane, isXYZ } from '@assets/libs/geo-info/common_func';
import { rayFromPln } from '@assets/core/inline/_ray';
import { plnFromRay } from '@assets/core/inline/_plane';
import * as THREE from 'three';
const EPS = 1e-8;

// ================================================================================================
export function getOrigin(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): Txyz {
    if (isXYZ(data)) { return data as Txyz; }
    if (isRay(data)) { return data[0] as Txyz; }
    if (isPlane(data)) { return data[0] as Txyz; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return origin as Txyz;
}
// ================================================================================================
export function getRay(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TRay {
    if (isXYZ(data)) { return [data, [0, 0, 1]] as TRay; }
    if (isRay(data)) { return data as TRay; }
    if (isPlane(data)) { return rayFromPln(false, data as TPlane) as TRay; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]] as TRay;
}
// ================================================================================================
export function getPlane(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TPlane {
    if (isXYZ(data)) { return [data, [1, 0, 0], [0, 1, 0]] as TPlane; }
    if (isRay(data)) { return plnFromRay(false, data as TRay) as TPlane; }
    if (isPlane(data)) { return data as TPlane; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
// ================================================================================================
export function getCentoridFromEnts(__model__: GIModel, ents: TId|TId[], fn_name: string): Txyz {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(__model__, fn_name, 'ents', ents,
        [ID.isID, ID.isIDL1],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx;
    const centroid: Txyz|Txyz[] = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid as Txyz[]) as Txyz;
    }
    return centroid as Txyz;
}
// ================================================================================================
export function getCentroid(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
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
        const np_cents: Txyz[] = (np_ents_arr as TEntTypeIdx[]).map( ent_arr => getCentroid(__model__, ent_arr) ) as Txyz[];
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
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
// ================================================================================================
export function getCenterOfMass(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i.length === 0) { return null; }
        return _centerOfMass(__model__, pgons_i);
    } else {
        const cents: Txyz[] = [];
        ents_arr = ents_arr as TEntTypeIdx[];
        for (const [ent_type, ent_i] of ents_arr) {
            const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) { cents.push(null); }
            cents.push(_centerOfMass(__model__, pgons_i));
        }
        return cents;
    }
}
function _centerOfMass(__model__: GIModel, pgons_i: number[]): Txyz {
    const face_midpoints: Txyz[] = [];
    const face_areas: number[] = [];
    let total_area = 0;
    for (const face_i of pgons_i) {
        const [midpoint_xyz, area]: [Txyz, number] = _centerOfMassOfPgon(__model__, face_i);
        face_midpoints.push(midpoint_xyz);
        face_areas.push(area);
        total_area += area;
    }
    const cent: Txyz = [0, 0, 0];
    for (let i = 0; i < face_midpoints.length; i++) {
        const weight: number = face_areas[i] / total_area;
        cent[0] = cent[0] + face_midpoints[i][0] * weight;
        cent[1] = cent[1] + face_midpoints[i][1] * weight;
        cent[2] = cent[2] + face_midpoints[i][2] * weight;
    }
    return cent;
}
function _centerOfMassOfPgon(__model__: GIModel, pgon_i: number): [Txyz, number] {
    const tri_midpoints: Txyz[] = [];
    const tri_areas: number[] = [];
    let total_area = 0;
    const map_posi_to_v3: Map< number, THREE.Vector3> = new Map();
    for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
        const posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const posis_v3: THREE.Vector3[] = [];
        for (const posi_i of posis_i) {
            let posi_v3: THREE.Vector3 = map_posi_to_v3.get(posi_i);
            if (posi_v3 === undefined) {
                const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
            }
            posis_v3.push(posi_v3);
        }
        const tri_tjs: THREE.Triangle = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
        let midpoint: THREE.Vector3;
        midpoint = tri_tjs.getMidpoint(midpoint);
        const midpoint_xyz: Txyz = [midpoint.x, midpoint.y, midpoint.z];
        const area: number = tri_tjs.getArea();
        tri_midpoints.push(midpoint_xyz);
        tri_areas.push(area);
        total_area += area;
    }
    const cent: Txyz = [0, 0, 0];
    for (let i = 0; i < tri_midpoints.length; i++) {
        const weight: number = tri_areas[i] / total_area;
        cent[0] = cent[0] + tri_midpoints[i][0] * weight;
        cent[1] = cent[1] + tri_midpoints[i][1] * weight;
        cent[2] = cent[2] + tri_midpoints[i][2] * weight;
    }
    return [cent, total_area];
}
// ================================================================================================
// used by sweep
// TODO update offset code to use this as well
/* Function to get a set of planes along the length of a wire.
 * The planes are orientated perpendicular to the wire.
 *
 */
export function getPlanesSeq(xyzs: Txyz[], normal: Txyz, close: boolean): TPlane[] {
    normal = vecNorm(normal);
    // if closed, add a posi to the end
    if (close) {
        xyzs.splice(0, 0, xyzs[xyzs.length - 1]);
        xyzs.push(xyzs[1]);
    }
    // get the perp vectors
    let perp_vec: Txyz = null;
    let has_bad_edges = false;
    const perp_vecs: Txyz[] = []; // normalise dvectors
    for (let i = 0; i < xyzs.length - 1; i++) {
        const xyz0: Txyz = xyzs[i];
        const xyz1: Txyz = xyzs[i + 1];
        const edge_vec: Txyz = vecFromTo(xyz0, xyz1);
        if (vecLen(edge_vec) > 0) {
            perp_vec = vecCross(vecNorm(edge_vec), normal);
        } else {
            perp_vec = null;
            has_bad_edges = true;
        }
        perp_vecs.push(perp_vec);
    }
    // fix any bad pairs, by setting the perp vec to its next neighbour
    if (has_bad_edges) {
        if (perp_vecs[perp_vecs.length - 1] === null) {
            throw new Error('Error: could not process wire.');
        }
        for (let i = perp_vecs.length - 1; i >= 0; i--) {
            if (perp_vecs[i] === null) {
                perp_vecs[i] = perp_vec;
            } else {
                perp_vec = perp_vecs[i];
            }
        }
    }
    // array for planes
    const planes: TPlane[] = [];
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // first plane
        const first_xyz: Txyz = xyzs[0];
        const x_axis: Txyz = perp_vecs[0];
        const first2_perp_vec: Txyz = perp_vecs[1];
        let y_axis: Txyz = normal;
        if (vecDot(x_axis, first2_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(x_axis, first2_perp_vec);
        }
        const first_plane: TPlane = [first_xyz, x_axis, y_axis];
        planes.push(first_plane);
    }
    // loop through all the edges and create a plane at the end of the edge
    for (let i = 0; i < perp_vecs.length - 1; i++) {
        // get the xyz
        const xyz: Txyz = xyzs[i + 1];
        // get the two perpendicular vectors
        const this_perp_vec: Txyz = perp_vecs[i];
        const next_perp_vec: Txyz = perp_vecs[i + 1];
        // calc the local norm
        let y_axis: Txyz = normal;
        if (vecDot(this_perp_vec, next_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(this_perp_vec, next_perp_vec);
        }
        // calc the offset vector
        let x_axis: Txyz = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
        const dot: number = vecDot(this_perp_vec, x_axis);
        const vec_len = 1 / dot;
        x_axis = vecSetLen(x_axis, vec_len);
        // create the plane
        const plane: TPlane = [xyz, x_axis, y_axis];
        planes.push(plane);
    }
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // last plane
        const last_xyz: Txyz = xyzs[xyzs.length - 1];
        const x_axis: Txyz = perp_vecs[perp_vecs.length - 1];
        const last2_perp_vec: Txyz = perp_vecs[perp_vecs.length - 2];
        let y_axis: Txyz = normal;
        if (vecDot(last2_perp_vec, x_axis) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(last2_perp_vec, x_axis);
        }
        const last_plane: TPlane = [last_xyz, x_axis, y_axis];
        planes.push(last_plane);
    }
    // return the planes
    return planes;
}
// ================================================================================================