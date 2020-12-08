import { vecAdd, vecCross, vecDiv, vecDot, vecFromTo, vecLen, vecNorm, vecSetLen, vecSum } from '../../geom/vectors';
import { EEntType, Txyz, TEntTypeIdx, TPlane, TRay } from '../common';
import * as THREE from 'three';
import { getArrDepth } from '../common_id_funcs';
import { GIModelData } from '../GIModelData';
const EPS = 1e-8;

/**
 * Class for editing geometry.
 */
export class GIFuncsCommon {
    // ================================================================================================
    private modeldata: GIModelData;
    // ================================================================================================
    /**
     * Constructor
     */
    constructor(model: GIModelData) {
        this.modeldata = model;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public getCentroid(ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            return this._centroidPosis(posis_i);
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
            const np_cents: Txyz[] = (np_ents_arr as TEntTypeIdx[]).map( ent_arr => this.getCentroid(ent_arr) ) as Txyz[];
            if (posis_i.length > 0) {
                const cen_posis: Txyz = this._centroidPosis(posis_i);
                if (np_cents.length === 0) {
                    return cen_posis;
                } else {
                    np_cents.push(cen_posis);
                }
            }
            return np_cents;
        }
    }
    private _centroidPosis(posis_i: number[]): Txyz {
        const unique_posis_i = Array.from(new Set(posis_i));
        const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
        return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public getCenterOfMass(ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, ent_i]: [EEntType, number] = ents_arr as TEntTypeIdx;
            const pgons_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) { return null; }
            return this._centerOfMass(pgons_i);
        } else {
            const cents: Txyz[] = [];
            ents_arr = ents_arr as TEntTypeIdx[];
            for (const [ent_type, ent_i] of ents_arr) {
                const pgons_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                if (pgons_i.length === 0) { cents.push(null); }
                cents.push(this._centerOfMass(pgons_i));
            }
            return cents;
        }
    }
    private _centerOfMass(pgons_i: number[]): Txyz {
        const face_midpoints: Txyz[] = [];
        const face_areas: number[] = [];
        let total_area = 0;
        for (const pgon_i of pgons_i) {
            const [midpoint_xyz, area]: [Txyz, number] = this._centerOfMassOfPgon( pgon_i );
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
    private _centerOfMassOfPgon(pgon_i: number): [Txyz, number] {
        const tri_midpoints: Txyz[] = [];
        const tri_areas: number[] = [];
        let total_area = 0;
        const map_posi_to_v3: Map< number, THREE.Vector3> = new Map();
        for (const tri_i of this.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
            const posis_i: number[] = this.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            const posis_v3: THREE.Vector3[] = [];
            for (const posi_i of posis_i) {
                let posi_v3: THREE.Vector3 = map_posi_to_v3.get(posi_i);
                if (posi_v3 === undefined) {
                    const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
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
   /**
    * used by sweep
    * TODO update offset code to use this as well
    * private to get a set of planes along the length of a wire.
    * The planes are orientated perpendicular to the wire.
    * @param xyzs
    * @param normal
    * @param close
    */
    public getPlanesSeq(xyzs: Txyz[], normal: Txyz, close: boolean): TPlane[] {
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
            if (vecDot(x_axis, first2_perp_vec) < EPS) { // TODO < what is a good value for this?
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
    /**
     * Copy posis, points, plines, pgons
     * @param __model__
     * @param ents_arr
     * @param copy_attributes
     */
    public copyGeom(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][],
            copy_attributes: boolean): TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][] {
        if (!Array.isArray(ents_arr[0])) {
            const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
            switch (ent_type) {
                case EEntType.COLL:
                    return [ent_type, this.modeldata.geom.add.copyColl(ent_i, copy_attributes)];
                case EEntType.PGON:
                    return [ent_type, this.modeldata.geom.add.copyPgon(ent_i, copy_attributes)];
                case EEntType.PLINE:
                    return [ent_type, this.modeldata.geom.add.copyPline(ent_i, copy_attributes)];
                case EEntType.POINT:
                    return [ent_type, this.modeldata.geom.add.copyPoint(ent_i, copy_attributes)];
                case EEntType.POSI:
                    return [ent_type, this.modeldata.geom.add.copyPosi(ent_i, copy_attributes)];
                default:
                    throw new Error('Invalid entity type for copying.');
            }
        } else {
            ents_arr = ents_arr as TEntTypeIdx[];
            // return this.copyGeom(ents_arr[0], copy_attributes);
            return ents_arr.map(ents_arr_item => this.copyGeom(ents_arr_item, copy_attributes)) as TEntTypeIdx[];
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    public clonePosisInEntsAndMove(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][],
            copy_attributes: boolean, vector: Txyz): void {
        const depth: number = getArrDepth(ents_arr);
        if (depth === 1) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        } else if (depth > 2) {
            // @ts-ignore
            ents_arr = ents_arr.flat(depth - 2) as TEntTypeIdx[];
        }
        // create the new positions
        const old_to_new_posis_i_map: Map<number, number> = new Map(); // count number of posis
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            // something may not be right here
            // if you copy a pgon + posi, if you process the pgon first you wil make a copy of the posis
            // but the posi may already be copied by the this.copyGeom function, then we get two copies of that posi
            if (ent_type === EEntType.POSI) { // positions
                const old_posi_i: number = index;
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    // do not clone, just move it
                    const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(old_posi_i);
                    this.modeldata.attribs.posis.setPosiCoords(old_posi_i, vecAdd(xyz, vector));
                    // in this case, the old posi and the new posi are the same
                    old_to_new_posis_i_map.set(old_posi_i, old_posi_i);
                }
            } else { // obj or coll
                const old_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const ent_new_posis_i: number[] = [];
                for (const old_posi_i of old_posis_i) {
                    let new_posi_i: number;
                    if (old_to_new_posis_i_map.has(old_posi_i)) {
                        new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                    } else {
                        new_posi_i = this.modeldata.geom.add.copyMovePosi(old_posi_i, vector, copy_attributes) as number;
                        old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                    }
                    ent_new_posis_i.push(new_posi_i);
                }
                this.modeldata.geom.edit_topo.replacePosis(ent_type, index, ent_new_posis_i);
            }
        }
        // return all the new points
        // const all_new_posis_i: number[] = Array.from(old_to_new_posis_i_map.values());
        // return all_new_posis_i.map( posi_i => [EEntType.POSI, posi_i] ) as TEntTypeIdx[];
    }
    /**
     * Clones position in entities. Lone positions are not cloned.
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    public clonePosisInEnts(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][], copy_attributes: boolean): void {
        const depth: number = getArrDepth(ents_arr);
        if (depth === 1) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        } else if (depth > 2) {
            // @ts-ignore
            ents_arr = ents_arr.flat(depth - 2) as TEntTypeIdx[];
        }
        // create the new positions
        const old_to_new_posis_i_map: Map<number, number> = new Map(); // count number of posis
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            // something may not be right here
            // if you copy a pgon + posi, if you process the pgon first you wil make a copy of the posis
            // but the posi may already be copied by the this.copyGeom function, then we get two copies of that posi
            if (ent_type !== EEntType.POSI) { // obj or coll
                const old_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const ent_new_posis_i: number[] = [];
                for (const old_posi_i of old_posis_i) {
                    let new_posi_i: number;
                    if (old_to_new_posis_i_map.has(old_posi_i)) {
                        new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                    } else {
                        new_posi_i = this.modeldata.geom.add.copyPosi(old_posi_i, copy_attributes) as number;
                        old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                    }
                    ent_new_posis_i.push(new_posi_i);
                }
                this.modeldata.geom.edit_topo.replacePosis(ent_type, index, ent_new_posis_i);
            }
        }
    }
    // ================================================================================================
}
