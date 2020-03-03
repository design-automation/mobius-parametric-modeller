/**
 * Shared utility functions
 * ~
 * ~
 */

/**
 *
 */
import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TRay, TEntTypeIdx, EEntTypeStr, Txy} from '@libs/geo-info/common';
import { checkArgTypes, TypeCheckObj, checkIDs, IDcheckObj} from '../_check_args';
import { getArrDepth, isColl } from '@assets/libs/geo-info/id';
import { vecDiv, vecSum, vecAvg, vecFromTo, vecLen, vecCross, vecNorm, vecAdd, vecSetLen, vecDot } from '@assets/libs/geom/vectors';
import { isRay, isPlane, isVec3 } from '@assets/libs/geo-info/virtual';
import { rayFromPln } from '@assets/core/inline/_ray';
import { plnFromRay } from '@assets/core/inline/_plane';
const EPS = 1e-8;

// ================================================================================================
export function getOrigin(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): Txyz {
    if (isVec3(data)) { return data as Txyz; }
    if (isRay(data)) { return data[0] as Txyz; }
    if (isPlane(data)) { return data[0] as Txyz; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return origin as Txyz;
}
// ================================================================================================
export function getRay(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TRay {
    if (isVec3(data)) { return [data, [0, 0, 1]] as TRay; }
    if (isRay(data)) { return data as TRay; }
    if (isPlane(data)) { return rayFromPln(data as TPlane) as TRay; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]] as TRay;
}
// ================================================================================================
export function getPlane(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TPlane {
    if (isVec3(data)) { return [data, [1, 0, 0], [0, 1, 0]] as TPlane; }
    if (isRay(data)) { return plnFromRay(data as TRay) as TPlane; }
    if (isPlane(data)) { return data as TPlane; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
// ================================================================================================
export function getCentoridFromEnts(__model__: GIModel, ents: TId|TId[], fn_name: string): Txyz {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'ents', ents,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx;
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
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, index);
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
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
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

