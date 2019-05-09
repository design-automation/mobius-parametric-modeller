import { GIModel } from './GIModel';
import { IGeomArrays, TVert, TWire, TColl, TPline, TEdge, TFace, TPgon, TEntTypeIdx } from './common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomModify } from './GIGeomModify';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomThreejs } from './GIGeomThreejs';
import { GIGeomIO } from './GIGeomIO';

/**
 * Class for geometry.
 */
export class GIGeom {
    public model: GIModel;
    public selected: TEntTypeIdx[]; // entities that should become selected
    //  all arrays
    public _geom_arrays: IGeomArrays = {  // TODO this should not be public
        // num_posis: 0,
        dn_verts_posis: [],
        dn_tris_verts: [],
        dn_edges_verts: [],
        dn_wires_edges: [],
        dn_faces_wirestris: [],
        dn_points_verts: [],
        dn_plines_wires: [],
        dn_pgons_faces: [],
        dn_colls_objs: [],
        up_posis_verts: [],
        up_tris_faces: [],
        up_verts_edges: [],
        up_verts_tris: [],
        up_verts_points: [],
        up_edges_wires: [],
        up_wires_faces: [],
        up_wires_plines: [],
        up_faces_pgons: [],
        up_points_colls: [],
        up_plines_colls: [],
        up_pgons_colls: []
    };
    // sub classes with methods
    public io: GIGeomIO;
    public add: GIGeomAdd;
    public modify: GIGeomModify;
    public query: GIGeomQuery;
    public threejs: GIGeomThreejs;
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(model: GIModel) {
        this.model = model;
        this.io = new GIGeomIO(this, this._geom_arrays);
        this.add = new GIGeomAdd(this, this._geom_arrays);
        this.modify = new GIGeomModify(this, this._geom_arrays);
        this.query = new GIGeomQuery(this, this._geom_arrays);
        this.threejs = new GIGeomThreejs(this, this._geom_arrays);
        this.selected = [];
    }
    /**
     * Checks geometry for internal consistency
     */
    public check(): string[] {
        const errors: string[] = [];
        this._checkPosis().forEach( error => errors.push(error) );
        this._checkVerts().forEach( error => errors.push(error) );
        this._checkEdges().forEach( error => errors.push(error) );
        this._checkWires().forEach( error => errors.push(error) );
        this._checkFaces().forEach( error => errors.push(error) );
        this._checkPlines().forEach( error => errors.push(error) );
        this._checkPgons().forEach( error => errors.push(error) );
        return errors;
    }
    /**
     * Checks geometry for internal consistency
     */
    private _checkPosis(): string[] {
        const errors: string[] = [];
        for (let posi_i = 0; posi_i < this._geom_arrays.up_posis_verts.length; posi_i++) {
            // up
            const verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
            if (verts_i === undefined) { errors.push('Posi ' + posi_i + ': Posi->Vert undefined.'); }
            if (verts_i === null) { continue; } // deleted
            // down
            for (const vert_i of verts_i) {
                const vert: TVert = this._geom_arrays.dn_verts_posis[vert_i];
                if (vert === undefined ) { errors.push('Posi ' + posi_i + ': Vert->Posi undefined.'); }
                if (vert === null ) { errors.push('Posi ' + posi_i + ': Vert->Posi null.'); }
            }
        }
        return errors;
    }
    private _checkVerts(): string[] {
        const errors: string[] = [];
        for (let vert_i = 0; vert_i < this._geom_arrays.dn_verts_posis.length; vert_i++) {
            // down
            const vert: TVert = this._geom_arrays.dn_verts_posis[vert_i];
            if (vert === undefined) { errors.push('Vert ' + vert_i + ': Vert->Posi undefined.'); }
            if (vert === null) { continue; } // deleted
            // up
            const edges_i: number[] = this._geom_arrays.up_verts_edges[vert_i];
            if (edges_i === undefined) {
                errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                continue;
            }
            if (edges_i === null) {
                errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                continue;
            }
            for (const edge_i of edges_i) {
                if (edge_i === undefined) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                }
                if (edge_i === null) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                }
                // down
                const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
                if (edge === undefined) {
                    errors.push('Vert ' + vert_i + ': Edge->Vert undefined.');
                }
                if (edge === null) {
                    errors.push('Vert ' + vert_i + ': Edge->Vert null.');
                }
            }
        }
        return errors;
    }
    private _checkEdges(): string[] {
        const errors: string[] = [];
        for (let edge_i = 0; edge_i < this._geom_arrays.dn_edges_verts.length; edge_i++) {
            // down
            const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
            if (edge === undefined) { errors.push('Edge ' + edge_i + ': Edge->Vert undefined.'); }
            if (edge === null) { continue; } // deleted
            // up
            const wire_i: number = this._geom_arrays.up_edges_wires[edge_i];
            if (wire_i === undefined) { continue; } // no wire, must be a point
            if (wire_i === null) { errors.push('Edge ' + edge_i + ': Edge->Wire null.'); }
            // down
            const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
            if (wire === undefined) { errors.push('Edge ' + edge_i + ': Wire->Edge undefined.'); }
            if (wire === null) { errors.push('Edge ' + edge_i + ': Wire->Edge null.'); }
        }
        return errors;
    }
    private _checkWires(): string[] {
        const errors: string[] = [];
        for (let wire_i = 0; wire_i < this._geom_arrays.dn_wires_edges.length; wire_i++) {
            // down
            const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
            if (wire === undefined) { errors.push('Wire ' + wire_i + ': Wire->Edge undefined.'); }
            if (wire === null) { continue; } // deleted
            // up
            const face_i: number = this._geom_arrays.up_wires_faces[wire_i];
            const pline_i: number = this._geom_arrays.up_wires_plines[wire_i];
            if (face_i !== undefined) {
                if (face_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Face null.');
                }
                // down
                const face: TFace = this._geom_arrays.dn_faces_wirestris[face_i];
                if (face === undefined) { errors.push('Wire ' + wire_i + ': Face->Wire undefined.'); }
                if (face === null) { errors.push('Wire ' + wire_i + ': Face->Wire null.'); }
            } else if (pline_i !== undefined) {
                if (pline_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Pline null.');
                }
                // down
                const pline: TPline = this._geom_arrays.dn_plines_wires[pline_i];
                if (pline === undefined) { errors.push('Wire ' + wire_i + ': Pline->Wire undefined.'); }
                if (pline === null) { errors.push('Wire ' + wire_i + ': Pline->Wire null.'); }
            } else {
                // down
                errors.push('Wire ' + wire_i + ': Both Wire->Face and Wire->Pline undefined.');
            }
        }
        return errors;
    }
    private _checkFaces(): string[] {
        const errors: string[] = [];
        for (let face_i = 0; face_i < this._geom_arrays.dn_faces_wirestris.length; face_i++) {
            // down
            const face: TFace = this._geom_arrays.dn_faces_wirestris[face_i];
            if (face === undefined) { errors.push('Face ' + face_i + ': Face->WireTri undefined.'); }
            if (face === null) { continue; } // deleted
            // up
            const pgon_i: number = this._geom_arrays.up_faces_pgons[face_i];
            if (pgon_i === undefined) {
                errors.push('Face ' + face_i + ': Face->Pgon undefined.');
            }
            if (pgon_i === null) {
                errors.push('Face ' + face_i + ': Face->Pgon null.');
            }
            // down
            const pgon: TPgon = this._geom_arrays.dn_pgons_faces[pgon_i];
            if (pgon === undefined) { errors.push('Face ' + face_i + ': Pgon->Face undefined.'); }
            if (pgon === null) { errors.push('Face ' + face_i + ': Pgon->Face null.'); }
        }
        return errors;
    }
    private _checkPlines(): string[] {
        const errors: string[] = [];
        for (let pline_i = 0; pline_i < this._geom_arrays.dn_plines_wires.length; pline_i++) {
            // down
            const pline: TPline = this._geom_arrays.dn_plines_wires[pline_i];
            if (pline === undefined) { errors.push('Pline ' + pline_i + ': Pline->Wire undefined.'); }
            if (pline === null) { continue; } // deleted
            // up
            const colls_i: number[] = this._geom_arrays.up_plines_colls[pline_i];
            if (colls_i === undefined) { continue; } // not in coll
            for (const coll_i of colls_i) {
                if (coll_i === undefined) {
                    errors.push('Pline ' + pline_i + ': Pline->Coll undefined.');
                }
                if (coll_i === null) {
                    errors.push('Pline ' + pline_i + ': Pline->Coll null.');
                }
                // down
                const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
                if (coll === undefined) { errors.push('Pline ' + pline_i + ': Coll->Objs undefined.'); }
                if (coll === null) { errors.push('Pline ' + pline_i + ': Coll->Objs null.'); }
                if (coll[2].indexOf(pline_i) === -1) {
                    errors.push('Pline ' + pline_i + ': Coll->Pline missing.');
                }
            }
        }
        return errors;
    }
    private _checkPgons(): string[] {
        const errors: string[] = [];
        for (let pgon_i = 0; pgon_i < this._geom_arrays.dn_pgons_faces.length; pgon_i++) {
            // down
            const pgon: TPgon = this._geom_arrays.dn_pgons_faces[pgon_i];
            if (pgon === undefined) { errors.push('Pgon ' + pgon_i + ': Pgon->Face undefined.'); }
            if (pgon === null) { continue; } // deleted
            // up
            const colls_i: number[] = this._geom_arrays.up_pgons_colls[pgon_i];
            if (colls_i === undefined) { continue; } // not in coll
            for (const coll_i of colls_i) {
                if (coll_i === undefined) {
                    errors.push('Pgon ' + pgon_i + ': Pgon->Coll undefined.');
                }
                if (coll_i === null) {
                    errors.push('Pgon ' + pgon_i + ': Pgon->Coll null.');
                }
                // down
                const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
                if (coll === undefined) { errors.push('Pgon ' + pgon_i + ': Coll->Objs undefined.'); }
                if (coll === null) { errors.push('Pgon ' + pgon_i + ': Coll->Objs null.'); }
                if (coll[3].indexOf(pgon_i) === -1) {
                    errors.push('Pgon ' + pgon_i + ': Coll->Pgon missing.');
                }
            }
        }
        return errors;
    }
}
