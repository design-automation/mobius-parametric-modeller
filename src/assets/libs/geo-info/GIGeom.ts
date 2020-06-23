import { GIModel } from './GIModel';
import { IGeomArrays, TVert, TWire, TColl, TPline, TEdge, TFace, TPgon, TEntTypeIdx, EEntType, TPoint } from './common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomModify } from './GIGeomModify';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomThreejs } from './GIGeomThreejs';
import { GIGeomIO } from './GIGeomIO';
import { GIGeomDel } from './GIGeomDel';
import { GIGeomCheck } from './GIGeomCheck';
import { GIGeomCompare } from './GiGeomCompare';
import { GIGeomModifyPline } from './GIGeomModifyPline';
import { GIGeomModifyPgon } from './GIGeomModifyPgon';
import { GIGeomModifyColl } from './GIGeomModifyColl';
import { GIGeomNav } from './GIGeomNav';
import { GIGeomDelVert } from './GIGeomDelVert';
import { GIGeomDelEdge } from './GIGeomDelEdge';

/**
 * Class for geometry.
 */
export class GIGeom {
    public model: GIModel;
    public selected: TEntTypeIdx[]; // entities that should become selected
    //  all arrays
    public _geom_maps: IGeomArrays = {  // TODO this should not be public
        // num_posis: 0,
        dn_verts_posis: new Map(),
        dn_tris_verts: new Map(),
        dn_edges_verts: new Map(),
        dn_wires_edges: new Map(),
        dn_faces_wirestris: new Map(),
        dn_points_verts: new Map(),
        dn_plines_wires: new Map(),
        dn_pgons_faces: new Map(),
        dn_colls_objs: new Map(),
        up_posis_verts: new Map(),
        up_tris_faces: new Map(),
        up_verts_edges: new Map(),
        up_verts_tris: new Map(),
        up_verts_points: new Map(),
        up_edges_wires: new Map(),
        up_wires_faces: new Map(),
        up_wires_plines: new Map(),
        up_faces_pgons: new Map(),
        up_points_colls: new Map(),
        up_plines_colls: new Map(),
        up_pgons_colls: new Map()
    };
    // sub classes with methods
    public io: GIGeomIO;
    public add: GIGeomAdd;
    public del: GIGeomDel;
    public del_vert: GIGeomDelVert;
    public del_edge: GIGeomDelEdge;
    public modify: GIGeomModify;
    public modify_pline: GIGeomModifyPline;
    public modify_pgon: GIGeomModifyPgon;
    public modify_coll: GIGeomModifyColl;
    public nav: GIGeomNav;
    public query: GIGeomQuery;
    public check: GIGeomCheck;
    public compare: GIGeomCompare;
    public threejs: GIGeomThreejs;
    /**
     * Constructor
     */
    constructor(model: GIModel) {
        this.model = model;
        this.io = new GIGeomIO(this, this._geom_maps);
        this.add = new GIGeomAdd(this, this._geom_maps);
        this.del = new GIGeomDel(this, this._geom_maps);
        this.del_vert = new GIGeomDelVert(this, this._geom_maps);
        this.del_edge = new GIGeomDelEdge(this, this._geom_maps);
        this.modify = new GIGeomModify(this, this._geom_maps);
        this.modify_pline = new GIGeomModifyPline(this, this._geom_maps);
        this.modify_pgon = new GIGeomModifyPgon(this, this._geom_maps);
        this.modify_coll = new GIGeomModifyColl(this, this._geom_maps);
        this.nav = new GIGeomNav(this, this._geom_maps);
        this.query = new GIGeomQuery(this, this._geom_maps);
        this.check = new GIGeomCheck(this, this._geom_maps);
        this.compare = new GIGeomCompare(this, this._geom_maps);
        this.threejs = new GIGeomThreejs(this, this._geom_maps);
        this.selected = [];
    }
    /**
     * Generate a string for debugging
     */
    public toStr(): string {
        let result = '';
        result += JSON.stringify(this.io.getData());
        return result;
    }
}
