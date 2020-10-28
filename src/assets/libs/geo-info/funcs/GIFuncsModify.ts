import { mirrorMatrix, multMatrix, rotateMatrix, scaleMatrix, xfromSourceTargetMatrix } from '../../geom/matrix';
import { vecAdd, vecCross, vecDiv, vecDot, vecFromTo, vecLen, vecNorm, vecSetLen, vecSum } from '../../geom/vectors';
import { EEntType, Txyz, TEntTypeIdx, TPlane, TRay } from '../common';
import { Matrix4 } from 'three';
import { getArrDepth } from '../common_id_funcs';
import { GIModelData } from '../GIModelData';


/**
 * Class for transforming geometry: move, rotate, mirror, scale, xform.
 */
export class GIFuncsModify {
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
     * @param vectors
     */
    public move(ents_arr: TEntTypeIdx[], vectors: Txyz|Txyz[]): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // process ents
        if (getArrDepth(vectors) === 1) {
            const posis_i: number[] = [];
            const vec: Txyz = vectors as Txyz;
            for (const ent_arr of ents_arr) {
                this.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]).forEach(posi_i => posis_i.push(posi_i));
            }
            const unique_posis_i: number[] = Array.from(new Set(posis_i));
            // loop
            for (const unique_posi_i of unique_posis_i) {
                const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
                const new_xyz: Txyz = vecAdd(old_xyz, vec);
                this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
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
                const ent_posis_i: number [] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                for (const ent_posi_i of ent_posis_i) {
                    posis_i.push(ent_posi_i);
                    if (! vecs_map.has(ent_posi_i)) {
                        vecs_map.set(ent_posi_i, []);
                    }
                    vecs_map.get(ent_posi_i).push(vec);
                }
            }
            // TODO entities could share positions, in which case the same position could be moved multi times
            // This could be confusing for the user

            // TODO snapshot

            for (const posi_i of posis_i) {
                const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
                const vecs: Txyz[] = vecs_map.get(posi_i);
                const vec: Txyz = vecDiv( vecSum( vecs ), vecs.length);
                const new_xyz: Txyz = vecAdd(old_xyz, vec);
                this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
            }
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param ray
     * @param angle
     */
    public rotate(ents_arr: TEntTypeIdx[], ray: TRay, angle: number): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // rotate all positions
        const posis_i: number[] = [];
        for (const ents of ents_arr) {
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ents[0], ents[1]));
        }
        const unique_posis_i: number[] = Array.from(new Set(posis_i));
        const matrix: Matrix4 = rotateMatrix(ray, angle);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz: Txyz = multMatrix(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     * @param scale
     */
    public scale(ents_arr: TEntTypeIdx[], plane: TPlane, scale: number|Txyz): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // handle scale type
        if (!Array.isArray(scale)) {
            scale = [scale, scale, scale];
        }
        // scale all positions
        const posis_i: number[] = [];
        for (const ents of ents_arr) {
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ents[0], ents[1]));
        }
        const unique_posis_i: number[] = Array.from(new Set(posis_i));
        const matrix: Matrix4 = scaleMatrix(plane, scale);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz: Txyz = multMatrix(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     */
    public mirror(ents_arr: TEntTypeIdx[], plane: TPlane): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // mirror all positions
        const posis_i: number[] = [];
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ent_type, index));
        }
        const unique_posis_i: number[] = Array.from(new Set(posis_i));
        const matrix: Matrix4 = mirrorMatrix(plane);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz: Txyz = multMatrix(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param from
     * @param to
     */
    public xform(ents_arr: TEntTypeIdx[], from: TPlane, to: TPlane): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // xform all positions
        const posis_i: number[] = [];
        for (const ents of ents_arr) {
            const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ent_type, index));
        }
        const unique_posis_i: number[] = Array.from(new Set(posis_i));
        const matrix: Matrix4 = xfromSourceTargetMatrix(from, to);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz: Txyz = multMatrix(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param dist
     */
    public offset(ents_arr: TEntTypeIdx[], dist: number): void {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // get all wires and offset
        const pgons_i: number[] = [];
        for (const ents of ents_arr) {
            const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
            const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
            for (const wire_i of wires_i) {
                this._offsetWire(wire_i, dist);
            }
            // save all pgons for re-tri
            const pgon_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, index);
            if (pgon_i.length === 1) {
                if (pgons_i.indexOf(pgon_i[0]) === -1) {
                    pgons_i.push(pgon_i[0]);
                }
            }
        }
        // re-tri all polygons
        if (pgons_i.length > 0) {
            this.modeldata.geom.edit_pgon.triPgons(pgons_i);
        }
    }
    private _offsetWire(wire_i: number, dist: number): void {
        // get the normal of the wire
        const vec_norm: Txyz = this.modeldata.geom.query.getWireNormal(wire_i);
        // if (vecLen(vec_norm) === 0) {
        //     vec_norm = [0, 0, 1];
        // }
        // loop through all edges and collect the required data
        const edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(EEntType.WIRE, wire_i).slice(); // make a copy
        const is_closed: boolean = this.modeldata.geom.query.isWireClosed(wire_i);
        // the index to these arrays is the edge_i
        let perp_vec: Txyz = null;
        let has_bad_edges = false;
        const perp_vecs: Txyz[] = [];       // index is edge_i
        const pairs_xyzs: [Txyz, Txyz][] = [];        // index is edge_i
        const pairs_posis_i: [number, number][] = [];   // index is edge_i
        for (const edge_i of edges_i) {
            const posis_i: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i) as [number, number];
            const xyzs: [Txyz, Txyz] = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i)) as [Txyz, Txyz];
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
            this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
        }
        // if this is not a closed wire we have to move first and last posis
        if (!is_closed) {
            // first posi
            const first_edge_i: number = edges_i[0];
            const first_posi_i: number = pairs_posis_i[first_edge_i][0];
            const first_old_xyz: Txyz = pairs_xyzs[first_edge_i][0];
            const first_perp_vec: Txyz =  vecSetLen(perp_vecs[first_edge_i], dist);
            const first_new_xyz: Txyz = vecAdd(first_old_xyz, first_perp_vec);
            this.modeldata.attribs.posis.setPosiCoords(first_posi_i, first_new_xyz);
            // last posi
            const last_edge_i: number = edges_i[edges_i.length - 1];
            const last_posi_i: number = pairs_posis_i[last_edge_i][1];
            const last_old_xyz: Txyz = pairs_xyzs[last_edge_i][1];
            const last_perp_vec: Txyz =  vecSetLen(perp_vecs[last_edge_i], dist);
            const last_new_xyz: Txyz = vecAdd(last_old_xyz, last_perp_vec);
            this.modeldata.attribs.posis.setPosiCoords(last_posi_i, last_new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public remesh(ents_arr: TEntTypeIdx[]): void {
        // no snapshot copy in this case
        for (const [ent_type, index] of ents_arr) {
            if (ent_type === EEntType.PGON) {
                this.modeldata.geom.edit_pgon.triPgons(index);
            } else {
                const pgons_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, index);
                this.modeldata.geom.edit_pgon.triPgons(pgons_i);
            }
        }
    }
    // ================================================================================================
}
