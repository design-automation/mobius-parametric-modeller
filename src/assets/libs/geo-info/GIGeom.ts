import { IGeomMaps, TEntTypeIdx } from './common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomEditTopo } from './GIGeomEditTopo';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomIO } from './GIGeomIO';
import { GIGeomDel } from './GIGeomDel';
import { GIGeomCheck } from './GIGeomCheck';
import { GIGeomCompare } from './GiGeomCompare';
import { GIGeomEditPline } from './GIGeomEditPline';
import { GIGeomEditPgon } from './GIGeomEditPgon';
import { GIGeomModifyColl } from './GIGeomModifyColl';
import { GIGeomNav } from './GIGeomNav';
import { GIGeomDelVert } from './GIGeomDelVert';
import { GIGeomDelEdge } from './GIGeomDelEdge';
import { GIModelData } from './GIModelData';
import { GIGeomAppend } from './GIGeomAppend';
import { GIGeomSnapshot } from './GIGeomSnapshot';
import { GIGeomThreejs } from './GIGeomThreejs';
import { GIGeomImpExp } from './GIGeomImpExp';

/**
 * Class for geometry.
 */
export class GIGeom {
    public modeldata: GIModelData;
    public selected: TEntTypeIdx[]; // entities that should become selected
    //  all arrays
    public _geom_maps: IGeomMaps = {  // TODO this should not be public
        // num_posis: 0,
        dn_verts_posis: new Map(),
        dn_tris_verts: new Map(),
        dn_edges_verts: new Map(),
        dn_wires_edges: new Map(),
        dn_faces_wires: new Map(),
        dn_faces_tris: new Map(),
        dn_points_verts: new Map(),
        dn_plines_wires: new Map(),
        dn_pgons_faces: new Map(),
        // dn_colls_points: new Map(),
        // dn_colls_plines: new Map(),
        // dn_colls_pgons: new Map(),
        up_posis_verts: new Map(),
        up_tris_faces: new Map(),
        up_verts_edges: new Map(),
        up_verts_tris: new Map(),
        up_verts_points: new Map(),
        up_edges_wires: new Map(),
        up_wires_faces: new Map(),
        up_wires_plines: new Map(),
        up_faces_pgons: new Map(),
        // up_points_colls: new Map(),
        // up_plines_colls: new Map(),
        // up_pgons_colls: new Map(),
        colls: new Set()
    };
    // sub classes with methods
    public io: GIGeomIO;
    public imp_exp: GIGeomImpExp;
    public append: GIGeomAppend;
    public add: GIGeomAdd;
    public del: GIGeomDel;
    public del_vert: GIGeomDelVert;
    public del_edge: GIGeomDelEdge;
    public modify: GIGeomEditTopo;
    public modify_pline: GIGeomEditPline;
    public modify_pgon: GIGeomEditPgon;
    public modify_coll: GIGeomModifyColl;
    public nav: GIGeomNav;
    public query: GIGeomQuery;
    public check: GIGeomCheck;
    public compare: GIGeomCompare;
    public threejs: GIGeomThreejs;
    public snapshot: GIGeomSnapshot;
    /**
     * Constructor
     */
    constructor(model: GIModelData) {
        this.modeldata = model;
        this.io = new GIGeomIO(this, this._geom_maps);
        this.imp_exp = new GIGeomImpExp(this, this._geom_maps);
        this.append = new GIGeomAppend(this, this._geom_maps);
        this.add = new GIGeomAdd(this, this._geom_maps);
        this.del = new GIGeomDel(this, this._geom_maps);
        this.del_vert = new GIGeomDelVert(this, this._geom_maps);
        this.del_edge = new GIGeomDelEdge(this, this._geom_maps);
        this.modify = new GIGeomEditTopo(this, this._geom_maps);
        this.modify_pline = new GIGeomEditPline(this, this._geom_maps);
        this.modify_pgon = new GIGeomEditPgon(this, this._geom_maps);
        this.modify_coll = new GIGeomModifyColl(this, this._geom_maps);
        this.nav = new GIGeomNav(this, this._geom_maps);
        this.query = new GIGeomQuery(this, this._geom_maps);
        this.check = new GIGeomCheck(this, this._geom_maps);
        this.compare = new GIGeomCompare(this, this._geom_maps);
        this.threejs = new GIGeomThreejs(this, this._geom_maps);
        this.snapshot = new GIGeomSnapshot(this, this._geom_maps);
        this.selected = [];
    }
    /**
     * Generate a string for debugging
     */
    public toStr(): string {
        return JSON.stringify(this.imp_exp.exportGIAll());
    }
}
