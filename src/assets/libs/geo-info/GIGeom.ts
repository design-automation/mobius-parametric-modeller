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
        this.io = new GIGeomIO(this, this._geom_arrays);
        this.add = new GIGeomAdd(this, this._geom_arrays);
        this.del = new GIGeomDel(this, this._geom_arrays);
        this.del_vert = new GIGeomDelVert(this, this._geom_arrays);
        this.del_edge = new GIGeomDelEdge(this, this._geom_arrays);
        this.modify = new GIGeomModify(this, this._geom_arrays);
        this.modify_pline = new GIGeomModifyPline(this, this._geom_arrays);
        this.modify_pgon = new GIGeomModifyPgon(this, this._geom_arrays);
        this.modify_coll = new GIGeomModifyColl(this, this._geom_arrays);
        this.nav = new GIGeomNav(this, this._geom_arrays);
        this.query = new GIGeomQuery(this, this._geom_arrays);
        this.check = new GIGeomCheck(this, this._geom_arrays);
        this.compare = new GIGeomCompare(this, this._geom_arrays);
        this.threejs = new GIGeomThreejs(this, this._geom_arrays);
        this.selected = [];
    }
}
