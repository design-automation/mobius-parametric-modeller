import { multMatrix, xfromSourceTargetMatrix } from '../../geom/matrix';
import { vecAdd, vecCross, vecDiv, vecFromTo, vecMult } from '../../geom/vectors';
import { EEntType, Txyz, TEntTypeIdx, TPlane, EAttribNames } from '../common';
import * as THREE from 'three';
import { getEntIdxs, isDim0, isDim2 } from '../common_id_funcs';
import { getArrDepth } from '@assets/libs/util/arrs';
import { GIModelData } from '../GIModelData';
import { listZip } from '@assets/core/inline/_list';

// Enums
export enum _EClose {
    OPEN = 'open',
    CLOSE = 'close'
}
export enum _ELoftMethod {
    OPEN_QUADS =  'open_quads',
    CLOSED_QUADS  =  'closed_quads',
    OPEN_STRINGERS =  'open_stringers',
    CLOSED_STRINGERS  =  'closed_stringers',
    OPEN_RIBS = 'open_ribs',
    CLOSED_RIBS = 'closed_ribs',
    COPIES = 'copies'
}
export enum _EExtrudeMethod {
    QUADS =  'quads',
    STRINGERS = 'stringers',
    RIBS = 'ribs',
    COPIES = 'copies'
}
export enum _ECutMethod {
    KEEP_ABOVE =  'keep_above',
    KEEP_BELOW = 'keep_below',
    KEEP_BOTH = 'keep_both'
}

/**
 * Class for editing geometry.
 */
export class GIFuncsMake {
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
     * @param coords
     */
    public position( coords: Txyz|Txyz[]|Txyz[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
        const ssid: number = this.modeldata.active_ssid;
        const depth: number = getArrDepth(coords);
        if (depth === 1) {
            const coord1: Txyz = coords as Txyz;
            const posi_i: number = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, posi_i, EAttribNames.COORDS, coord1);
            return [EEntType.POSI, posi_i] as TEntTypeIdx;
        } else if (depth === 2) {
            const coords2: Txyz[] = coords as Txyz[];
            return coords2.map(coord => this.position(coord)) as TEntTypeIdx[];
        } else {
            const coords3: Txyz[][] = coords as Txyz[][];
            return coords3.map(coord2 => this.position(coord2)) as TEntTypeIdx[][];
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public point( ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
        const ssid: number = this.modeldata.active_ssid;
        const depth: number = getArrDepth(ents_arr);
        if (depth === 1) {
            const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx; // either a posi or something else
            if (ent_type === EEntType.POSI) {
                const point_i: number = this.modeldata.geom.add.addPoint(index);
                return [EEntType.POINT, point_i] as TEntTypeIdx;
            } else {
                const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                return posis_i.map(posi_i => this.point([EEntType.POSI, posi_i])) as TEntTypeIdx[];
            }
        } else if (depth === 2) {
            ents_arr = ents_arr as TEntTypeIdx[];
            return ents_arr.map(ents_arr_item => this.point(ents_arr_item)) as TEntTypeIdx[];
        } else { // depth > 2
            ents_arr = ents_arr as TEntTypeIdx[][];
            return ents_arr.map(ents_arr_item => this.point(ents_arr_item)) as TEntTypeIdx[][];
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param close
     */
    public polyline( ents_arr: TEntTypeIdx[]|TEntTypeIdx[][], close: _EClose): TEntTypeIdx|TEntTypeIdx[] {
        const posis_arr: TEntTypeIdx[][] = this._getPlinePosisFromEnts(ents_arr);
        return this._polyline( posis_arr, close);
    }
    private _polyline( posis_arr: TEntTypeIdx[]|TEntTypeIdx[][], close: _EClose): TEntTypeIdx|TEntTypeIdx[] {
        const depth: number = getArrDepth(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 2) {
                throw new Error('Error in make.Polyline: Polylines must have at least two positions.');
            }
            const bool_close: boolean = (close === _EClose.CLOSE);
            const posis_i: number[] = getEntIdxs(posis_arr as TEntTypeIdx[]);
            const pline_i: number = this.modeldata.geom.add.addPline(posis_i, bool_close);
            return [EEntType.PLINE, pline_i] as TEntTypeIdx;
        } else {
            posis_arr = posis_arr as TEntTypeIdx[][];
            return posis_arr.map(ents_arr_item => this._polyline( ents_arr_item, close)) as TEntTypeIdx[];
        }
    }
    private _getPlinePosisFromEnts( ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[][] {
        // check if this is a single object ID
        if (getArrDepth(ents_arr) === 1) {
            ents_arr =  [ents_arr] as TEntTypeIdx[];
        }
        // check if this is a list of posis, verts, or points
        if (getArrDepth(ents_arr) === 2 && isDim0(ents_arr[0][0])) {
            const ents_arr2: TEntTypeIdx[] = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
                if (ent_type === EEntType.POSI) {
                    ents_arr2.push(ent_arr as TEntTypeIdx);
                } else {
                    const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2] as TEntTypeIdx[][];
        }
        // now process the ents
        const posis_arrs: TEntTypeIdx[][] = [];
        for (const ent_arr of ents_arr) {
            if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr as TEntTypeIdx[]);
                continue;
            }
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            switch (ent_type) {
                case EEntType.EDGE:
                case EEntType.WIRE:
                case EEntType.PLINE:
                    const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr: TEntTypeIdx[] = posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    posis_arrs.push( posis_arr );
                    break;
                case EEntType.PGON:
                    const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i: number = wires_i[j];
                        const wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                        const wire_posis_arr: TEntTypeIdx[] = wire_posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                        posis_arrs.push( wire_posis_arr );
                    }
                    break;
                default:
                    break;
            }
        }
        return posis_arrs;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public polygon( ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
        const posis_arr: TEntTypeIdx[][] = this._getPgonPosisFromEnts(ents_arr);
        return this._polygon( posis_arr );
    }
    private _polygon( posis_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
        const depth: number = getArrDepth(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 3) {
                throw new Error('Error in make.Polygon: Polygons must have at least three positions.');
            }
            const posis_i: number[] = getEntIdxs(posis_arr as TEntTypeIdx[]);
            const pgon_i: number = this.modeldata.geom.add.addPgon(posis_i);
            return [EEntType.PGON, pgon_i] as TEntTypeIdx;
        } else {
            posis_arr = posis_arr as TEntTypeIdx[][];
            return posis_arr.map(ents_arr_item => this._polygon(ents_arr_item)) as TEntTypeIdx[];
        }
    }
    private _getPgonPosisFromEnts( ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[][] {
        // check if this is a single object ID
        if (getArrDepth(ents_arr) === 1) {
            ents_arr = [ents_arr] as TEntTypeIdx[];
        }
        // check if this is a list of posis
        if (getArrDepth(ents_arr) === 2 && ents_arr[0][0] === EEntType.POSI) {
            // ents_arr =  [ents_arr] as TEntTypeIdx[][];
            const ents_arr2: TEntTypeIdx[] = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
                if (ent_type === EEntType.POSI) {
                    ents_arr2.push(ent_arr as TEntTypeIdx);
                } else {
                    const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2] as TEntTypeIdx[][];
        }
        // now process the ents
        const posis_arrs: TEntTypeIdx[][] = [];
        for (const ent_arr of ents_arr) {
            if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr as TEntTypeIdx[]);
                continue;
            }
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            switch (ent_type) {
                case EEntType.WIRE:
                case EEntType.PLINE:
                    const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr: TEntTypeIdx[] = posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    posis_arrs.push(posis_arr);
                    break;
                case EEntType.PGON:
                    const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i: number = wires_i[j];
                        const wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                        const wire_posis_arr: TEntTypeIdx[] = wire_posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                        posis_arrs.push(wire_posis_arr);
                    }
                    break;
                default:
                    break;
            }
        }
        return posis_arrs;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    public tin( ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
        const depth: number = getArrDepth(ents_arr);
        if (depth === 2) {
            const posis_i: number[] = getEntIdxs(ents_arr as TEntTypeIdx[]);
            const vtxs_tf: Txyz[] = [];
            for (const posi_i of posis_i) {
                const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
                vtxs_tf.push(xyz);
            }
            // const tin = turf.triangulate(vtxs_tf);
            // console.log(tin);
            return null;
        } else {
            ents_arr = ents_arr as TEntTypeIdx[][];
            return ents_arr.map(ents_arr_item => this.tin(ents_arr_item)) as TEntTypeIdx[];
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arrs
     * @param divisions
     * @param method
     */
    public loft( ents_arrs: TEntTypeIdx[]|TEntTypeIdx[][], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
        const depth: number = getArrDepth(ents_arrs);
        if (depth === 2) {
            const ents_arr: TEntTypeIdx[] = ents_arrs as TEntTypeIdx[];
            switch (method) {
                case _ELoftMethod.OPEN_QUADS:
                case _ELoftMethod.CLOSED_QUADS:
                    return this._loftQuads(ents_arr, divisions, method);
                case _ELoftMethod.OPEN_STRINGERS:
                case _ELoftMethod.CLOSED_STRINGERS:
                    return this._loftStringers(ents_arr, divisions, method);
                case _ELoftMethod.OPEN_RIBS:
                case _ELoftMethod.CLOSED_RIBS:
                    return this._loftRibs(ents_arr, divisions, method);
                case _ELoftMethod.COPIES:
                    return this._loftCopies(ents_arr, divisions);
                default:
                    break;
            }
        } else if (depth === 3) {
            const all_loft_ents: TEntTypeIdx[] = [];
            for (const ents_arr of ents_arrs  as TEntTypeIdx[][]) {
                const loft_ents: TEntTypeIdx[] = this.loft(ents_arr, divisions, method);
                loft_ents.forEach( loft_ent => all_loft_ents.push(loft_ent) );
            }
            return all_loft_ents;
        }
    }
    private _loftQuads( ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
        const edges_arrs_i: number[][] = [];
        let num_edges = 0;
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
            const edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            if (edges_arrs_i.length === 0) { num_edges = edges_i.length; }
            if (edges_i.length !== num_edges) {
                throw new Error('make.Loft: Number of edges is not consistent.');
            }
            edges_arrs_i.push(edges_i);
        }
        if (method === _ELoftMethod.CLOSED_QUADS) {
            edges_arrs_i.push(edges_arrs_i[0]);
        }
        const new_pgons_i: number[] = [];
        for (let i = 0; i < edges_arrs_i.length - 1; i++) {
            const edges_i_a: number[] = edges_arrs_i[i];
            const edges_i_b: number[] = edges_arrs_i[i + 1];
            if (divisions > 0) {
                const strip_posis_map: Map<number, number[]> = new Map();
                for (let j = 0; j < num_edges; j++) {
                    const edge_i_a: number = edges_i_a[j];
                    const edge_i_b: number = edges_i_b[j];
                    // get exist two posis_i
                    const exist_posis_a_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_a);
                    const exist_posis_b_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_b);
                    // create the new posis strip if necessary
                    for (const k of [0, 1]) {
                        if (strip_posis_map.get(exist_posis_a_i[k]) === undefined) {
                            const xyz_a: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posis_a_i[k]);
                            const xyz_b: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posis_b_i[k]);
                            const extrude_vec_div: Txyz = vecDiv(vecFromTo(xyz_a, xyz_b), divisions);
                            const strip_posis_i: number[] = [exist_posis_a_i[k]];
                            for (let d = 1; d < divisions; d++) {
                                const strip_posi_i: number = this.modeldata.geom.add.addPosi();
                                const move_xyz = vecMult(extrude_vec_div, d);
                                this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz_a, move_xyz));
                                strip_posis_i.push(strip_posi_i);
                            }
                            strip_posis_i.push(exist_posis_b_i[k]);
                            strip_posis_map.set(exist_posis_a_i[k], strip_posis_i);
                        }
                    }
                    // get the two strips and make polygons
                    const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_a_i[0]);
                    const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_a_i[1]);
                    for (let k = 0; k < strip1_posis_i.length - 1; k++) {
                        const c1: number = strip1_posis_i[k];
                        const c2: number = strip2_posis_i[k];
                        const c3: number = strip2_posis_i[k + 1];
                        const c4: number = strip1_posis_i[k + 1];
                        const pgon_i: number = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                        new_pgons_i.push(pgon_i);
                    }
                }
            } else {
                for (let j = 0; j < num_edges; j++) {
                    const posis_i_a: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_a[j]);
                    const posis_i_b: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_b[j]);
                    const pgon_i: number = this.modeldata.geom.add.addPgon([posis_i_a[0], posis_i_a[1], posis_i_b[1], posis_i_b[0]]);
                    new_pgons_i.push(pgon_i);
                }
            }
        }
        return new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i]) as TEntTypeIdx[];
    }
    private _loftStringers( ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
        const posis_arrs_i: number[][] = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const is_closed: boolean = method === _ELoftMethod.CLOSED_STRINGERS;
        if (is_closed) {
            posis_arrs_i.push(posis_arrs_i[0]);
        }
        const stringer_plines_i: number[] = [];
        for (let i = 0; i < num_posis; i++) {
            const stringer_posis_i: number[] = [];
            for (let j = 0; j < posis_arrs_i.length - 1; j++) {
                stringer_posis_i.push(posis_arrs_i[j][i]);
                if (divisions > 0) {
                    const xyz1: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_arrs_i[j][i]);
                    const xyz2: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_arrs_i[j + 1][i]);
                    const vec: Txyz = vecDiv(vecFromTo(xyz1, xyz2), divisions);
                    for (let k = 1; k < divisions; k++) {
                        const new_xyz: Txyz = vecAdd(xyz1, vecMult(vec, k));
                        const new_posi_i: number = this.modeldata.geom.add.addPosi();
                        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                        stringer_posis_i.push(new_posi_i);
                    }
                }
            }
            if (!is_closed) {
                stringer_posis_i.push(posis_arrs_i[posis_arrs_i.length - 1][i]);
            }
            const pline_i: number = this.modeldata.geom.add.addPline(stringer_posis_i, is_closed);
            stringer_plines_i.push(pline_i);
        }
        return stringer_plines_i.map( pline_i => [EEntType.PLINE, pline_i]) as TEntTypeIdx[];
    }
    private _loftRibs( ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
        const posis_arrs_i: number[][] = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const is_closed: boolean = method === _ELoftMethod.CLOSED_RIBS;
        if (is_closed) {
            posis_arrs_i.push(posis_arrs_i[0]);
        }
        let ribs_is_closed = false;
        switch (ents_arr[0][0]) { // check if the first entity is closed
            case EEntType.PGON:
                ribs_is_closed = true;
                break;
            case EEntType.PLINE:
                const wire_i: number = this.modeldata.geom.nav.navPlineToWire(ents_arr[0][1]);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
                break;
            case EEntType.WIRE:
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(ents_arr[0][1]);
                break;
            default:
                break;
        }
        const rib_plines_i: number[] = [];
        for (let i = 0; i < posis_arrs_i.length - 1; i++) {
            const pline_i: number = this.modeldata.geom.add.addPline(posis_arrs_i[i], ribs_is_closed);
            rib_plines_i.push(pline_i);
            if (divisions > 0) {
                const xyzs1: Txyz[] = posis_arrs_i[i].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const xyzs2: Txyz[] = posis_arrs_i[i + 1].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const vecs: Txyz[] = [];
                for (let k = 0; k < num_posis; k++) {
                    const vec: Txyz = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const rib_posis_i: number[] = [];
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz: Txyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
                        const new_posi_i: number = this.modeldata.geom.add.addPosi();
                        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                        rib_posis_i.push(new_posi_i);
                    }
                    const new_rib_pline_i: number = this.modeldata.geom.add.addPline(rib_posis_i, ribs_is_closed);
                    rib_plines_i.push(new_rib_pline_i);
                }
            }
        }
        if (!is_closed) {
            const pline_i: number = this.modeldata.geom.add.addPline(posis_arrs_i[posis_arrs_i.length - 1], ribs_is_closed);
            rib_plines_i.push(pline_i);
        }
        return rib_plines_i.map( pline_i => [EEntType.PLINE, pline_i]) as TEntTypeIdx[];
    }
    private _loftCopies( ents_arr: TEntTypeIdx[], divisions: number): TEntTypeIdx[] {
        const posis_arrs_i: number[][] = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const copies: TEntTypeIdx[] = [];
        for (let i = 0; i < posis_arrs_i.length - 1; i++) {
            copies.push(ents_arr[i]);
            if (divisions > 0) {
                const xyzs1: Txyz[] = posis_arrs_i[i].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const xyzs2: Txyz[] = posis_arrs_i[i + 1].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const vecs: Txyz[] = [];
                for (let k = 0; k < num_posis; k++) {
                    const vec: Txyz = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const lofted_ent_arr: TEntTypeIdx = this.modeldata.funcs_common.copyGeom(ents_arr[i], true) as TEntTypeIdx;
                    this.modeldata.funcs_common.clonePosisInEnts(lofted_ent_arr, true);
                    const [lofted_ent_type, lofted_ent_i]: [number, number] = lofted_ent_arr;
                    const new_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(lofted_ent_type, lofted_ent_i);
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz: Txyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
                        this.modeldata.attribs.posis.setPosiCoords(new_posis_i[k], new_xyz);
                    }
                    copies.push(lofted_ent_arr);
                }
            }
        }
        copies.push(ents_arr[ents_arr.length - 1]);
        return copies;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param dist
     * @param divisions
     * @param method
     */
    public extrude( ents_arr: TEntTypeIdx|TEntTypeIdx[],
        dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
        // extrude
        if (method === _EExtrudeMethod.COPIES) {
            return this._extrudeCopies(ents_arr, dist, divisions);
        } else {
            return this._extrudeEdges(ents_arr, dist, divisions, method);
        }
    }
    private _extrudeEdges( ents_arr: TEntTypeIdx|TEntTypeIdx[],
            dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
        const extrude_vec: Txyz = (Array.isArray(dist) ? dist : [0, 0, dist]) as Txyz;
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
            // check if this is a collection, call this function again
            if (ent_type === EEntType.COLL) {
                return this._extrudeColl(index, extrude_vec, divisions, method);
            }
            // check if this is a position, a vertex, or a point -> pline
            if (isDim0(ent_type)) {
                return this._extrudeDim0(ent_type, index, extrude_vec, divisions);
            }
            // extrude edges -> polygons
            switch (method) {
                case _EExtrudeMethod.QUADS:
                    return this._extrudeQuads(ent_type, index, extrude_vec, divisions);
                case _EExtrudeMethod.STRINGERS:
                    return this._extrudeStringers(ent_type, index, extrude_vec, divisions);
                case _EExtrudeMethod.RIBS:
                    return this._extrudeRibs(ent_type, index, extrude_vec, divisions);
                default:
                    throw new Error('Extrude method not recognised.');
            }
        } else {
            const new_ents_arr: TEntTypeIdx[] = [];
            (ents_arr as TEntTypeIdx[]).forEach(ent_arr => {
                const result = this._extrudeEdges(ent_arr, extrude_vec, divisions, method);
                result.forEach( new_ent_arr => new_ents_arr.push(new_ent_arr));
            });
            return new_ents_arr;
        }
    }
    private _extrudeCopies( ents: TEntTypeIdx|TEntTypeIdx[],
            dist: number|Txyz, divisions: number): TEntTypeIdx[] {
        const ents_arr: TEntTypeIdx[] = (getArrDepth(ents) === 1 ? [ents] : ents) as TEntTypeIdx[];
        const extrude_vec: Txyz = (Array.isArray(dist) ? dist : [0, 0, dist]) as Txyz;
        const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
        const copies: TEntTypeIdx[] = [];
        // make the copies
        for (let i = 0; i < divisions + 1; i++) {
            // copy the list of entities
            const copied_ents_arr: TEntTypeIdx[] = this.modeldata.funcs_common.copyGeom(ents_arr, true) as TEntTypeIdx[];
            // copy the positions that belong to the list of entities
            this.modeldata.funcs_common.clonePosisInEntsAndMove(copied_ents_arr, true, vecMult(extrude_vec_div, i));
            // add to the array
            for (const copied_ent_arr of copied_ents_arr) {
                copies.push(copied_ent_arr);
            }
        }
        // return the copies
        return copies;
    }
    private _extrudeColl( index: number,
            extrude_vec: Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
        const points_i: number[] = this.modeldata.geom.nav.navCollToPoint(index);
        const res1 = points_i.map( point_i => this._extrudeEdges([EEntType.POINT, point_i], extrude_vec, divisions, method));
        const plines_i: number[] = this.modeldata.geom.nav.navCollToPline(index);
        const res2 = plines_i.map( pline_i => this._extrudeEdges([EEntType.PLINE, pline_i], extrude_vec, divisions, method));
        const pgons_i: number[] = this.modeldata.geom.nav.navCollToPgon(index);
        const res3 = pgons_i.map( pgon_i => this._extrudeEdges([EEntType.PGON, pgon_i], extrude_vec, divisions, method));
        return [].concat(res1, res2, res3);
    }
    private _extrudeDim0( ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
        const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
        const exist_posi_i: number = this.modeldata.geom.nav.navAnyToPosi(ent_type, index)[0];
        const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
        const strip_posis_i: number[] = [exist_posi_i];
        for (let i = 1; i < divisions + 1; i++) {
            const strip_posi_i: number = this.modeldata.geom.add.addPosi();
            const move_xyz = vecMult(extrude_vec_div, i);
            this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
            strip_posis_i.push(strip_posi_i);
        }
        // loft between the positions and create a single polyline
        const pline_i: number = this.modeldata.geom.add.addPline(strip_posis_i);
        return [[EEntType.PLINE, pline_i]];
    }
    private _extrudeQuads( ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
        const new_pgons_i: number[] = [];
        const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
        const edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map: Map<number, number[]> = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i: number[] = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i: number = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
            // get the two strips and make polygons
            const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_i[0]);
            const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_i[1]);
            for (let i = 0; i < strip1_posis_i.length - 1; i++) {
                const c1: number = strip1_posis_i[i];
                const c2: number = strip2_posis_i[i];
                const c3: number = strip2_posis_i[i + 1];
                const c4: number = strip1_posis_i[i + 1];
                const pgon_i: number = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                new_pgons_i.push(pgon_i);
            }
        }
        // cap the top
        if (isDim2(ent_type)) { // create a top -> polygon
            const cap_pgon_i: number = this._extrudeCap(index, strip_posis_map, divisions);
            new_pgons_i.push(cap_pgon_i);
        }
        return new_pgons_i.map(pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx);
    }
    private _extrudeStringers( ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
        const new_plines_i: number[] = [];
        const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
        const edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map: Map<number, number[]> = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i: number[] = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i: number = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
        }
        // make the stringers
        strip_posis_map.forEach(strip_posis_i => {
            const pline_i: number = this.modeldata.geom.add.addPline(strip_posis_i);
            new_plines_i.push(pline_i);
        });
        // return the stringers
        return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx);
    }
    private _extrudeRibs( ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
        const new_plines_i: number[] = [];
        const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
        const edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map: Map<number, number[]> = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i: number[] = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i: number = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
        }
        // make an array of ents to process as ribs
        let ribs_is_closed = false;
        const ribs_posis_i: number[][] = [];
        switch (ent_type) { // check if the entity is closed
            case EEntType.PGON:
                ribs_is_closed = true;
                const face_wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (const face_wire_i of face_wires_i) {
                    const face_wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, face_wire_i);
                    ribs_posis_i.push(face_wire_posis_i);
                }
                break;
            case EEntType.PLINE:
                const pline_wire_i: number = this.modeldata.geom.nav.navPlineToWire(index);
                const pline_wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, pline_wire_i);
                ribs_posis_i.push(pline_wire_posis_i);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(pline_wire_i);
                break;
            case EEntType.WIRE:
                const wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, index);
                ribs_posis_i.push(wire_posis_i);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(index);
                break;
            default:
                const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                ribs_posis_i.push(posis_i);
                break;
        }
        // make the ribs
        for (let i = 0; i < divisions + 1; i++) {
            for (const rib_posis_i of ribs_posis_i) {
                const mapped_rib_posis_i: number[] = rib_posis_i.map( rib_posi_i => strip_posis_map.get(rib_posi_i)[i] );
                const pline_i: number = this.modeldata.geom.add.addPline(mapped_rib_posis_i, ribs_is_closed);
                new_plines_i.push(pline_i);
            }
        }
        // return the ribs
        return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx);
    }
    private _extrudeCap( pgon_i: number, strip_posis_map: Map<number, number[]>, divisions: number): number {
        // get positions on boundary
        const old_wire_i: number = this.modeldata.geom.query.getPgonBoundary(pgon_i);
        const old_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_wire_i);
        const new_posis_i: number[] = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
        // get positions for holes
        const old_holes_wires_i: number[] = this.modeldata.geom.query.getPgonHoles(pgon_i);
        const new_holes_posis_i: number[][] = [];
        for (const old_hole_wire_i of old_holes_wires_i) {
            const old_hole_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_hole_wire_i);
            const new_hole_posis_i: number[] = old_hole_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
            new_holes_posis_i.push(new_hole_posis_i);
        }
        // make new polygon
        const new_pgon_i: number = this.modeldata.geom.add.addPgon( new_posis_i, new_holes_posis_i );
        return new_pgon_i;
    }
    // ================================================================================================
    /**
     *
     * @param backbone_ents
     * @param xsection_ent
     * @param divisions
     * @param method
     */
    public sweep( backbone_ents: TEntTypeIdx[], xsection_ent: TEntTypeIdx,
            divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
        // the xsection
        const [xsection_ent_type, xsection_index]: TEntTypeIdx = xsection_ent;
        let xsection_wire_i: number = null;
        if (xsection_ent_type === EEntType.WIRE) {
            xsection_wire_i = xsection_index;
        } else {
            const xsection_wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(xsection_ent_type, xsection_index);
            xsection_wire_i = xsection_wires_i[0]; // select the first wire that is found
        }
        // get all the wires and put them into an array
        const backbone_wires_i: number[] = [];
        for (const [ent_type, index] of backbone_ents) {
            if (ent_type === EEntType.WIRE) {
                backbone_wires_i.push(index);
            } else {
                const ent_wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                backbone_wires_i.push(...ent_wires_i);
            }
        }
        return this._sweep(backbone_wires_i, xsection_wire_i, divisions, method);
    }
    private _sweep( backbone_wires_i: number|number[], xsection_wire_i: number,
            divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
        if (!Array.isArray(backbone_wires_i)) {
            // extrude edges -> polygons
            switch (method) {
                case _EExtrudeMethod.QUADS:
                    return this._sweepQuads(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.STRINGERS:
                    return this._sweepStringers(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.RIBS:
                    return this._sweepRibs(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.COPIES:
                    return this._sweepCopies(backbone_wires_i, xsection_wire_i, divisions);
                default:
                    throw new Error('Extrude method not recognised.');
            }
        } else {
            const new_ents: TEntTypeIdx[] = [];
            for (const wire_i of backbone_wires_i) {
                const wire_new_ents: TEntTypeIdx[] = this._sweep(wire_i, xsection_wire_i, divisions, method);
                for (const wire_new_ent of wire_new_ents) {
                    new_ents.push(wire_new_ent);
                }
            }
            return new_ents;
        }
    }
    private _sweepQuads( backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
        const strips_posis_i: number[][] = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const backbone_is_closed: boolean = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const xsection_is_closed: boolean = this.modeldata.geom.query.isWireClosed(xsection_wire_i);
        // add row if backbone_is_closed
        if (backbone_is_closed) {
            strips_posis_i.push(strips_posis_i[0].slice());
        }
        // add a posi_i to end of each strip if xsection_is_closed
        if (xsection_is_closed) {
            for (const strip_posis_i of strips_posis_i) {
                strip_posis_i.push(strip_posis_i[0]);
            }
        }
        // create quads
        const new_pgons: TEntTypeIdx[] = [];
        for (let i = 0; i < strips_posis_i.length - 1; i++) {
            const strip1_posis_i: number[] = strips_posis_i[i];
            const strip2_posis_i: number[] = strips_posis_i[i + 1];
            for (let j = 0; j < strip1_posis_i.length - 1; j++) {
                const c1: number = strip1_posis_i[j];
                const c2: number = strip2_posis_i[j];
                const c3: number = strip2_posis_i[j + 1];
                const c4: number = strip1_posis_i[j + 1];
                const pgon_i: number = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                new_pgons.push([EEntType.PGON, pgon_i]);
            }
        }
        return new_pgons;
    }
    private _sweepStringers( backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
        const backbone_is_closed: boolean = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const ribs_posis_i: number[][] = this. _sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const stringers_posis_i: number[][] = listZip(false, ribs_posis_i);
        const plines: TEntTypeIdx[] = [];
        for (const stringer_posis_i of stringers_posis_i) {
            const pline_i: number = this.modeldata.geom.add.addPline(stringer_posis_i, backbone_is_closed);
            plines.push([EEntType.PLINE, pline_i]);
        }
        return plines;
    }
    private _sweepRibs( backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
        const xsection_is_closed: boolean = this.modeldata.geom.query.isWireClosed(xsection_wire_i);
        const ribs_posis_i: number[][] = this. _sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const plines: TEntTypeIdx[] = [];
        for (const rib_posis_i of ribs_posis_i) {
            const pline_i: number = this.modeldata.geom.add.addPline(rib_posis_i, xsection_is_closed);
            plines.push([EEntType.PLINE, pline_i]);
        }
        return plines;
    }
    private _sweepCopies( backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
        const posis_i: number[][] = this. _sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        // TODO
        throw new Error('Not implemented');
        // TODO
    }
    private _sweepPosis( backbone_wire_i: number, xsection_wire_i: number, divisions: number): number[][] {
        // get the xyzs of the cross section
        const xsextion_xyzs: Txyz[] = this.modeldata.attribs.posis.getEntCoords(EEntType.WIRE, xsection_wire_i);
        // get the xyzs of the backbone
        const wire_normal: Txyz = this.modeldata.geom.query.getWireNormal(backbone_wire_i);
        const wire_is_closed: boolean =  this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const wire_xyzs: Txyz[] = this.modeldata.attribs.posis.getEntCoords(EEntType.WIRE, backbone_wire_i);
        let plane_xyzs: Txyz[] = [];
        // if not divisions is not 1, then we need to add xyzs
        if (divisions === 1) {
            plane_xyzs = wire_xyzs;
        } else {
            if (wire_is_closed) {
                wire_xyzs.push(wire_xyzs[0]);
            }
            for (let i = 0; i < wire_xyzs.length - 1; i++) {
                const xyz0: Txyz = wire_xyzs[i];
                const xyz1: Txyz = wire_xyzs[i + 1];
                const vec: Txyz = vecFromTo(xyz0, xyz1);
                const vec_div: Txyz = vecDiv(vec, divisions);
                // create additional xyzs for planes
                plane_xyzs.push(xyz0);
                for (let j = 1; j < divisions; j++) {
                    plane_xyzs.push(vecAdd(xyz0, vecMult(vec_div, j)));
                }
            }
            if (!wire_is_closed) {
                plane_xyzs.push(wire_xyzs[wire_xyzs.length - 1]);
            }
        }
        // create the planes
        const planes: TPlane[] = this.modeldata.funcs_common.getPlanesSeq(plane_xyzs, wire_normal, wire_is_closed);
        // create the new  posis
        const XY: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
        const all_new_posis_i: number[][] = [];
        for (const plane of planes) {
            const matrix: THREE.Matrix4 = xfromSourceTargetMatrix(XY, plane);
            const xsection_posis_i: number[] = [];
            for (const xsextion_xyz of xsextion_xyzs) {
                const new_xyz: Txyz = multMatrix(xsextion_xyz, matrix);
                const posi_i: number = this.modeldata.geom.add.addPosi();
                this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
                xsection_posis_i.push(posi_i);
            }
            all_new_posis_i.push(xsection_posis_i);
        }
        // return the new posis
        return all_new_posis_i;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     * @param method
     */
    public cut(ents_arr: TEntTypeIdx[], plane: TPlane, method: _ECutMethod): [TEntTypeIdx[], TEntTypeIdx[]] {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // create the threejs entity and calc intersections
        const plane_normal: Txyz = vecCross(plane[1], plane[2]);
        const plane_tjs: THREE.Plane = new THREE.Plane();
        plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
        // get polylines and polygons
        const set_plines: Set<number> = new Set();
        const set_pgons: Set<number> = new Set();
        const edges_i: number[] = []; // all edges
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.PLINE) {
                set_plines.add(ent_i);
            } else if (ent_type === EEntType.PGON) {
                set_pgons.add(ent_i);
            } else {
                const plines: number[] = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pline of plines) { set_plines.add(pline); }
                const pgons: number[] = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pgon of pgons) { set_pgons.add(pgon); }
            }
            const ent_edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
            for (const ent_edge_i of ent_edges_i) { edges_i.push(ent_edge_i); }
        }
        const above: TEntTypeIdx[] = [];
        const below: TEntTypeIdx[] = [];
        // cut each edge and store the results
        const [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs]: [number[][], number[], THREE.Vector3[]] =
            this._cutEdges(edges_i, plane_tjs, method);
        // create array to store new posis
        const posi_to_copies: number[] = [];
        // slice polylines
        for (const exist_pline_i of Array.from(set_plines)) {
            const sliced: [number[], number[]] =
                this._cutCreateEnts(EEntType.PLINE, exist_pline_i, plane_tjs, edge_to_isect_posis,
                    posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pline_i of sliced[0]) { above.push([EEntType.PLINE, new_pline_i]); }
            for (const new_pline_i of sliced[1]) { below.push([EEntType.PLINE, new_pline_i]); }
        }
        // slice polygons
        for (const exist_pgon_i of Array.from(set_pgons)) {
            // TODO slice polygons with holes
            const sliced: [number[], number[]] =
                this._cutCreateEnts(EEntType.PGON, exist_pgon_i, plane_tjs, edge_to_isect_posis,
                    posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pgon_i of sliced[0]) { above.push([EEntType.PGON, new_pgon_i]); }
            for (const new_pgon_i of sliced[1]) { below.push([EEntType.PGON, new_pgon_i]); }
        }
        // return
        return [above, below];
    }
    // cut each edge in the input geometry and store teh intersection posi in a sparse array
    // the array is nested, the two indexes [i1][i2] is the two posi ends of the edge, the value is the isect posi
    // also returns some other data
    // if method is "both", then we need copies of the isect posis, so these are also generated
    // finally, the tjs points that are created are also returned, they are used later for checking "starts_above"
    private _cutEdges(edges_i: number[], plane_tjs: THREE.Plane, method: _ECutMethod):
            [number[][], number[], THREE.Vector3[]] {
        const ssid: number = this.modeldata.active_ssid;
        // create sparse arrays for storing data
        const posi_to_tjs: THREE.Vector3[] = []; // sparse array
        const edge_to_isect_posis: number[][] = []; // sparse array, map_posis[2][3] is the edge from posi 2 to posi 3 (and 3 to 2)
        const cut_posi_to_copies: number[] = []; // sparse array
        // loop through each edge
        const cut_edges: [number, number][] = [];
        let prev_isect_tjs: THREE.Vector3 = null;
        for (const edge_i of edges_i) {
            const edge_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i.sort();
            // get the edge isect point
            if (edge_to_isect_posis[edge_posis_i[0]] === undefined) { edge_to_isect_posis[edge_posis_i[0]] = []; }
            const posi_i: number = edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]];
            if (posi_i === undefined) {
                const posi0_tjs: THREE.Vector3 = this._cutGetTjsPoint(edge_posis_i[0], posi_to_tjs);
                const posi1_tjs: THREE.Vector3 = this._cutGetTjsPoint(edge_posis_i[1], posi_to_tjs);
                const line_tjs: THREE.Line3 = new THREE.Line3(posi0_tjs, posi1_tjs);
                const isect_tjs: THREE.Vector3 = new THREE.Vector3();
                const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
                if (result !== undefined && result !== null) {
                    const dist: number = prev_isect_tjs === null ? 1 : prev_isect_tjs.distanceTo(isect_tjs);
                    if (dist > 0) {
                        cut_edges.push([edge_posis_i[0], edge_posis_i[1]]);
                        const new_posi_i: number = this.modeldata.geom.add.addPosi();
                        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, [isect_tjs.x, isect_tjs.y, isect_tjs.z]);
                        edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]] = new_posi_i;
                        if (method === _ECutMethod.KEEP_BOTH) {
                            const copy_posi_i: number = this.modeldata.geom.add.addPosi();
                            this.modeldata.attribs.posis.setPosiCoords(copy_posi_i, [isect_tjs.x, isect_tjs.y, isect_tjs.z]);
                            cut_posi_to_copies[new_posi_i] = copy_posi_i;
                        }
                        prev_isect_tjs = isect_tjs;
                    } else {
                        edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]] = null;
                    }
                } else {
                    edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]] = null;
                }
            }
        }
        if (cut_edges.length === 1) {
            // the cut is though a single vertex, so set the intersection to null
            edge_to_isect_posis[cut_edges[0][0]][cut_edges[0][1]] = null;
            // TODO delete the new posi(s) that were created in the process
        } else if (cut_edges.length % 2 !== 0) {
            throw new Error("Error cutting: Number of edge intersections is uneven.");
        }
        return [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs] ;
    }
    // given an exist posis, returns a tjs point
    // if necessary, a new tjs point will be created
    // creates a map from exist posi to tjs
    private _cutGetTjsPoint(posi_i: number, posi_to_tjs: THREE.Vector3[]): THREE.Vector3 {
        const ssid: number = this.modeldata.active_ssid;
        if (posi_to_tjs[posi_i] !== undefined) { return posi_to_tjs[posi_i]; }
        const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
        posi_to_tjs[posi_i] = posi_tjs;
        return posi_tjs;
    }
    // given an exist posis, returns a new posi
    // if necessary, a new posi point be created
    // creates a map from exist posi to new posi
    private _cutGetPosi(posi_i: number, posi_to_copies: number[]): number {
        if (posi_to_copies[posi_i] !== undefined) { return posi_to_copies[posi_i]; }
        const new_posi_i: number = this.modeldata.geom.add.copyPosis(posi_i, true) as number;
        posi_to_copies[posi_i] = new_posi_i;
        return new_posi_i;
    }
    // given a list of exist posis, returns a list of new posi
    // if necessary, new posi will be creates
    private _cutGetPosis(posis_i: number[], posi_to_copies: number[]): number[] {
        return posis_i.map(posi_i => this._cutGetPosi(posi_i, posi_to_copies) );
    }
    // makes a copy of an existing ent
    // all posis in the exist ent will be replaced by new posis
    private _cutCopyEnt(ent_type: EEntType, ent_i: number, exist_posis_i: number[], posi_to_copies: number[]): number {
        const new_posis_i: number[] = this._cutGetPosis(exist_posis_i, posi_to_copies);
        switch (ent_type) {
            case EEntType.PLINE:
                const new_pline_i: number = this.modeldata.geom.add.copyPlines(ent_i, true) as number;
                this.modeldata.geom.edit_topo.replacePosis(ent_type, new_pline_i, new_posis_i);
                return new_pline_i;
            case EEntType.PGON:
                const new_pgon_i: number = this.modeldata.geom.add.copyPgons(ent_i, true) as number;
                this.modeldata.geom.edit_topo.replacePosis(ent_type, new_pgon_i, new_posis_i);
                return new_pgon_i;
            default:
                break;
        }
    }
    // creates new ents
    // if the ent is not cut by the plane, the ent will be copies (with new posis)
    // if the ent is cut, a new ent will be created
    private _cutCreateEnts(ent_type: EEntType, ent_i: number, plane_tjs: THREE.Plane,
            edge_to_isect_posis: number[][], posi_to_copies: number[], cut_posi_to_copies: number[], posi_to_tjs: THREE.Vector3[],
            method: _ECutMethod): [number[], number[]] {
        // get wire and posis
        const wire_i: number = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i)[0];
        const wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
        const wire_posis_ex_i: number[] = wire_posis_i.slice();
        const is_closed: boolean = this.modeldata.geom.query.isWireClosed(wire_i);
        if (is_closed) {
            wire_posis_ex_i.push(wire_posis_ex_i[0]);
        }
        const num_posis: number = wire_posis_ex_i.length;
        // create lists to store posis
        const slice_posis_i: number[][][] = [[], []];
        // analyze the first point
        const dist: number = plane_tjs.distanceToPoint(posi_to_tjs[wire_posis_ex_i[0]]);
        const start_above = dist > 0; // is the first point above the plane?
        const first = start_above ? 0 : 1; // the first list to start adding posis
        const second = 1 - first; // the second list to add posis, after you cross the plane
        let index = first;
        // for each pair of posis, get the posi_i intersection or null
        slice_posis_i[index].push([]);
        for (let i = 0; i < num_posis - 1; i++) {
            const edge_posis_i: [number, number] = [wire_posis_ex_i[i], wire_posis_ex_i[i + 1]];
            edge_posis_i.sort();
            const isect_posi_i: number = edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]];
            slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[i]);
            if (isect_posi_i !== null) {
                // add posi before cut
                if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                    const isect_posi2_i: number = cut_posi_to_copies[isect_posi_i];
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                    posi_to_copies[isect_posi2_i] = isect_posi2_i;
                } else {
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                    posi_to_copies[isect_posi_i] = isect_posi_i;
                }
                // switch
                index = 1 - index;
                slice_posis_i[index].push([]);
                // add posi after cut
                if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                    const isect_posi2_i: number = cut_posi_to_copies[isect_posi_i];
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                    posi_to_copies[isect_posi2_i] = isect_posi2_i;
                } else {
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                    posi_to_copies[isect_posi_i] = isect_posi_i;
                }
            }
        }
        // deal with cases where the entity was not cut
        // make a copy of the ent, with new posis
        if (slice_posis_i[second].length === 0) {
            if ( start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_ABOVE)) {
                return [[this._cutCopyEnt(ent_type, ent_i, wire_posis_i, posi_to_copies)], []];
            } else if ( !start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_BELOW)) {
                return [[], [this._cutCopyEnt(ent_type, ent_i, wire_posis_i, posi_to_copies)]];
            }
            return [[], []];
        }
        // update the lists, to deal with the end cases
        if (is_closed) {
            // add the last list of posis to the the first list of posis
            for (const slice_posi_i of slice_posis_i[index][slice_posis_i[index].length - 1]) {
                slice_posis_i[index][0].push(slice_posi_i);
            }
            slice_posis_i[index] = slice_posis_i[index].slice(0, -1);
        } else {
            // add the last posi to the last list
            slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[num_posis - 1]);
        }
        // make the cut entities
        const above: number[] = [];
        const below: number[] = [];
        switch (method) {
            case _ECutMethod.KEEP_BOTH:
            case _ECutMethod.KEEP_ABOVE:
                for (const posis_i of slice_posis_i[0]) {
                    if (ent_type === EEntType.PLINE) {
                        const copy_posis_i: number[] = this._cutGetPosis(posis_i, posi_to_copies);
                        above.push( this.modeldata.geom.add.addPline(copy_posis_i, false));
                    } else {
                        const copy_posis_i: number[] = this._cutGetPosis(posis_i, posi_to_copies);
                        above.push( this.modeldata.geom.add.addPgon(copy_posis_i));
                    }
                }
                break;
            default:
                break;
        }
        switch (method) {
            case _ECutMethod.KEEP_BOTH:
            case _ECutMethod.KEEP_BELOW:
                for (const posis_i of slice_posis_i[1]) {
                    if (ent_type === EEntType.PLINE) {
                        const copy_posis_i: number[] = this._cutGetPosis(posis_i, posi_to_copies);
                        below.push( this.modeldata.geom.add.addPline(copy_posis_i, false));
                    } else {
                        const copy_posis_i: number[] = this._cutGetPosis(posis_i, posi_to_copies);
                        below.push( this.modeldata.geom.add.addPgon(copy_posis_i));
                    }
                }
                break;
            default:
                break;
        }
        // retun the new entities
        return [above, below];
    }
    // ================================================================================================
}
