import { interpByNum, interpByLen } from '@libs/geom/vectors';
import { EEntType, Txyz, TEntTypeIdx, IEntSets } from '../common';
import { distance } from '@libs/geom/distance';
import { getArrDepth } from '@assets/libs/util/arrs';
import { GIModelData } from '../GIModelData';
import { TypedArrayUtils } from '@libs/TypedArrayUtils.js';
import * as THREE from 'three';

// Enums
export enum _ERingMethod {
    OPEN =  'open',
    CLOSE  =  'close'
}
export enum _EDivisorMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length',
    BY_MAX_LENGTH  =  'by_max_length',
    BY_MIN_LENGTH  =  'by_min_length'
}
export enum _EWeldMethod {
    MAKE_WELD =  'make_weld',
    BREAK_WELD  =  'break_weld',
}
/**
 * Class for editing geometry.
 */
export class GIFuncsEdit {
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
     * @param divisor
     * @param method
     */
    public divide(ents_arr: TEntTypeIdx|TEntTypeIdx[], divisor: number, method: _EDivisorMethod): TEntTypeIdx[] {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false);
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            let exist_edges_i: number[];
            if (ent_type !== EEntType.EDGE) {
                exist_edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i).slice();
            } else {
                exist_edges_i = [ent_i];
            }
            const all_new_edges_i: number[] = [];
            for (const exist_edge_i of exist_edges_i) {
                const new_edges_i: number[] = this._divideEdge(exist_edge_i, divisor, method);
                new_edges_i.forEach( new_edge_i => all_new_edges_i.push(new_edge_i) );
            }
            // return the new edges
            return all_new_edges_i.map(one_edge_i => [EEntType.EDGE, one_edge_i] as TEntTypeIdx);
        } else {
            return [].concat(...(ents_arr as TEntTypeIdx[]).map(one_edge => this.divide(one_edge, divisor, method)));
        }
    }
    private _divideEdge(edge_i: number, divisor: number, method: _EDivisorMethod): number[] {
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const start = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        const end = this.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        let new_xyzs: Txyz[];
        if (method === _EDivisorMethod.BY_NUMBER) {
            new_xyzs = interpByNum(start, end, divisor - 1);
        } else if (method === _EDivisorMethod.BY_LENGTH) {
            new_xyzs = interpByLen(start, end, divisor);
        } else if (method === _EDivisorMethod.BY_MAX_LENGTH) {
            const len: number = distance(start, end);
            if (divisor === 0) {
                new_xyzs = [];
            } else {
                const num_div: number = Math.ceil(len / divisor);
                const num_div_max: number = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = interpByNum(start, end, num_div_max);
            }
        } else { // BY_MIN_LENGTH
            if (divisor === 0) {
                new_xyzs = [];
            } else {
                const len: number = distance(start, end);
                const num_div: number = Math.floor(len / divisor);
                const num_div_min: number = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = interpByNum(start, end, num_div_min);
            }
        }
        const new_edges_i: number[] = [];
        let old_edge_i: number = edge_i;
        for (const new_xyz of new_xyzs) {
            const posi_i = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
            const new_edge_i: number = this.modeldata.geom.edit_topo.insertVertIntoWire(old_edge_i, posi_i);
            new_edges_i.push(old_edge_i);
            old_edge_i = new_edge_i;
        }
        new_edges_i.push(old_edge_i);
        return new_edges_i;
    }
    // ================================================================================================
    /**
     *
     * @param pgon_i
     * @param holes_ents_arr
     */
    public hole(pgon: TEntTypeIdx, holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[] {
        const pgon_i: number = pgon[1];
        const holes_posis_i: number[][] = this._getHolePosisFromEnts(holes_ents_arr);
        // time stamp
        this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i);
        // create the hole
        const wires_i: number[] = this.modeldata.geom.edit_pgon.cutPgonHoles(pgon_i, holes_posis_i);
        // return hole wires
        return wires_i.map(wire_i => [EEntType.WIRE, wire_i]) as TEntTypeIdx[];
    }
    private _getHolePosisFromEnts(ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): number[][] {
        const depth: number = getArrDepth(ents_arr);
        if (depth === 1) {
            const [ent_type, ent_i] = ents_arr as TEntTypeIdx;
            // we have just a single entity, must be a wire, a pline, or a pgon, so get the posis and return them
            return [this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i)];
        } else if (depth === 2) {
            ents_arr = ents_arr as TEntTypeIdx[];
            // we have a list of entites, could be a list of posis or a list of wires/plines/pgons
            // so lets check the first entity, is it a posi?
            if (ents_arr[0][0] === EEntType.POSI) {
                // we assume we have a list of posis
                const posis_i: number[] = [];
                if (ents_arr.length < 3) {
                    // TODO improve this error message, print the list of entities
                    throw new Error('The data for generating holes in a polygon is invalid. A list of positions must have at least three positions.');
                }
                for (const [ent_type, ent_i] of ents_arr) {
                    if (ent_type !== EEntType.POSI) {
                        // TODO improve this error message, print the list of entities
                        throw new Error('The list of entities for generating holes is inconsistent. A list has been found that contains a mixture of positions and other entities.');
                    }
                    posis_i.push(ent_i);
                }
                return [posis_i];
            } else {
                // we have a list of other entities
                const posis_arrs_i: number[][] = [];
                for (const [ent_type, ent_i] of ents_arr) {
                    if (ent_type === EEntType.POSI) {
                        // TODO improve this error message, print the list of entities
                        throw new Error('The data for generating holes in a polygon is inconsistent. A list has been found that contains a mixture of positions and other entities.');
                    }
                    const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                    if (posis_i.length > 2) {
                        // if there are less than 3 posis, then ignore this ent (no error)
                        posis_arrs_i.push(posis_i);
                    }
                }
                return posis_arrs_i;
            }
        } else {
            // we have some kind of nested list, so call this function recursivley
            const posis_arrs_i: number[][] = [];
            for (const a_ents_arr of ents_arr) {
                const posis_arrs2_i: number[][] = this._getHolePosisFromEnts(a_ents_arr as TEntTypeIdx[]);
                for (const posis_arr2_i of posis_arrs2_i) {
                    posis_arrs_i.push(posis_arr2_i);
                }
            }
            return posis_arrs_i;
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param method
     */
    public weld(ents_arr: TEntTypeIdx[], method: _EWeldMethod): TEntTypeIdx[] {
        // snapshot copy ents (no change to posis)
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // get unique verts
        const map: Map<number, Set<number>> = this.modeldata.geom.query.getEntsMap(ents_arr,
            [EEntType.VERT, EEntType.POINT, EEntType.PLINE, EEntType.PGON] );
        // time stamp
        map.get(EEntType.POINT).forEach( point_i => this.modeldata.getObjsCheckTs(EEntType.POINT, point_i) );
        map.get(EEntType.PLINE).forEach( pline_i => this.modeldata.getObjsCheckTs(EEntType.PLINE, pline_i) );
        map.get(EEntType.PGON).forEach( pgon_i => this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i) );
        // process ents
        const verts_i: number[] = Array.from(map.get(EEntType.VERT));
        switch (method) {
            case _EWeldMethod.BREAK_WELD:
                this.modeldata.geom.edit_topo.cloneVertPositions(verts_i);
                break;
            case _EWeldMethod.MAKE_WELD:
                this.modeldata.geom.edit_topo.mergeVertPositions(verts_i);
                break;
            default:
                break;
        }
        // TODO
        return [];
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param tolerance
     */
    public fuse(ents_arr: TEntTypeIdx[], tolerance: number): TEntTypeIdx[] {
        // const ssid: number = this.modeldata.timestamp;
        // snapshot copy ents (no change to posis)
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // get unique ents
        const map: Map<number, Set<number>> = this.modeldata.geom.query.getEntsMap(ents_arr,
            [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON] );
        // time stamp
        map.get(EEntType.POINT).forEach( point_i => this.modeldata.getObjsCheckTs(EEntType.POINT, point_i) );
        map.get(EEntType.PLINE).forEach( pline_i => this.modeldata.getObjsCheckTs(EEntType.PLINE, pline_i) );
        map.get(EEntType.PGON).forEach( pgon_i => this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i) );
        // get posis
        const posis_i: number[] = Array.from(map.get(EEntType.POSI));
        // find neighbour
        const map_posi_i_to_xyz: Map<number, Txyz> = new Map();
        const typed_positions = new Float32Array( posis_i.length * 4 );
        const typed_buff = new THREE.BufferGeometry();
        typed_buff.setAttribute( 'position', new THREE.BufferAttribute( typed_positions, 4 ) );
        for (let i = 0; i < posis_i.length; i++) {
            const posi_i: number = posis_i[i];
            const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
            map_posi_i_to_xyz.set(posi_i, xyz);
            typed_positions[ i * 4 + 0 ] = xyz[0];
            typed_positions[ i * 4 + 1 ] = xyz[1];
            typed_positions[ i * 4 + 2 ] = xyz[2];
            typed_positions[ i * 4 + 3 ] = posi_i;
        }
        const kdtree = new TypedArrayUtils.Kdtree( typed_positions, this._fuseDistSq, 4 );
        // create a neighbours list
        const nns: [number, number, number[]][] = []; // [posi_i, num_neighbours, neighbour_poisi_i]
        for (let i = 0; i < posis_i.length; i++) {
            const posi_i: number = posis_i[i];
            const nn = kdtree.nearest( map_posi_i_to_xyz.get(posi_i) as any, posis_i.length, tolerance * tolerance );
            const nn_posis_i: number[] = [];
            for (const a_nn of nn) {
                const obj: object = a_nn[0].obj;
                const nn_posi_i: number = obj[3];
                nn_posis_i.push(nn_posi_i);
            }
            nns.push([posis_i[i], nn_posis_i.length, nn_posis_i]);
        }
        // sort so that positions with most neighbours win
        nns.sort( (a, b) => b[1] - a[1] );
        // create new positions, replace posis for existing vertices
        const nns_filt: [number, number, number[]][] = []; // [posi_i, num_neighbours, neighbour_poisi_i]
        const exclude_posis_i: Set<number> = new Set(); // exclude any posis that have already been moved
        const new_posis_i: number[] = [];
        for (const nn of nns) {
            if (!exclude_posis_i.has(nn[0]) && nn[1] > 1) {
                nns_filt.push(nn);
                const new_xyz: Txyz = [0, 0, 0];
                for (const n_posi_i of nn[2]) {
                    exclude_posis_i.add(n_posi_i);
                    const xyz: Txyz = map_posi_i_to_xyz.get(n_posi_i);
                    new_xyz[0] += xyz[0];
                    new_xyz[1] += xyz[1];
                    new_xyz[2] += xyz[2];
                }
                new_xyz[0] = new_xyz[0] / nn[1];
                new_xyz[1] = new_xyz[1] / nn[1];
                new_xyz[2] = new_xyz[2] / nn[1];
                const new_posi_i: number = this.modeldata.geom.add.addPosi();
                new_posis_i.push(new_posi_i);
                this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                for (const n_posi_i of nn[2]) {
                    const verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(n_posi_i);
                    for (const vert_i of verts_i) {
                        this.modeldata.geom.edit_topo.replaceVertPosi(vert_i, new_posi_i);
                    }
                    // this.modeldata.geom.add.addPline([new_posi_i, n_posi_i], false); // temp
                }
            }
        }
        // delete the posis if they are unused
        const ssid: number = this.modeldata.active_ssid;
        this.modeldata.geom.snapshot.delUnusedPosis(ssid, Array.from(exclude_posis_i));
        // return new posis
        return new_posis_i.map(posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
    }
    private _fuseDistSq(xyz1: number[], xyz2: number[]): number {
        return Math.pow(xyz1[0] - xyz2[0], 2) +  Math.pow(xyz1[1] - xyz2[1], 2) +  Math.pow(xyz1[2] - xyz2[2], 2);
    }
    // ================================================================================================
    public ring(ents_arr: TEntTypeIdx[], method: _ERingMethod): void {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            switch (method) {
                case _ERingMethod.CLOSE:
                    this.modeldata.geom.edit_pline.closePline(ent_i);
                    break;
                case _ERingMethod.OPEN:
                    this.modeldata.geom.edit_pline.openPline(ent_i);
                    break;
                default:
                    break;
            }
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param offset
     */
    public shift(ents_arr: TEntTypeIdx[], offset: number): void {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            wires_i.forEach( wire_i => this.modeldata.geom.edit_topo.shift(wire_i, offset) );
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public reverse(ents_arr: TEntTypeIdx[]): void {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            wires_i.forEach( wire_i => this.modeldata.geom.edit_topo.reverse(wire_i) );
        }
    }
    // ================================================================================================
    /**
     * Delete ents in the model.
     * The posis in ents will only be deleted if they are not used by other ents.
     * If collectons are deleted, the contents of the collection is not deleted.
     * If topological entities are deleted, then the object may need to be cloned.
     */
    public delete(ents_arr: TEntTypeIdx|TEntTypeIdx[], invert: boolean): void {
        const ssid: number = this.modeldata.active_ssid;
        // null case
        if (ents_arr === null) { this._deleteNull(invert); return; }
        // create array
        ents_arr = (Array.isArray(ents_arr[0]) ? ents_arr : [ents_arr]) as TEntTypeIdx[];
        // empty array
        if (ents_arr.length === 0) { return; }
        // create sets
        const ent_sets: IEntSets = this.modeldata.geom.snapshot.getSubEntsSets(ssid, ents_arr);
        // console.log(">>>before");
        // Object.keys(ent_sets).forEach( key => console.log(key, Array.from(ent_sets[key])));
        if (invert) {
            this.modeldata.geom.snapshot.invertEntSets(ssid, ent_sets);
        }
        // console.log(">>>after");
        // Object.keys(ent_sets).forEach( key => console.log(key, Array.from(ent_sets[key])));
        this.modeldata.geom.snapshot.delEntSets(ssid, ent_sets);
    }
    private _deleteNull(invert: boolean): void {
        const ssid: number = this.modeldata.active_ssid;
        if (invert) {
            // delete nothing
            return;
        } else {
            // delete everything
            this.modeldata.geom.snapshot.delAllEnts(ssid);
        }
    }
    // ================================================================================================
}
