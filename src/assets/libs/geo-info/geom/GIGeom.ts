import { IGeomMaps, TEntTypeIdx } from '../common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomEditTopo } from './GIGeomEditTopo';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomCheck } from './GIGeomCheck';
import { GIGeomCompare } from './GIGeomCompare';
import { GIGeomEditPline } from './GIGeomEditPline';
import { GIGeomEditPgon } from './GIGeomEditPgon';
import { GIGeomNav } from './GIGeomNav';
import { GIGeomDelVert } from './GIGeomDelVert';
import { GIModelData } from '../GIModelData';
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
    public imp_exp: GIGeomImpExp;
    public add: GIGeomAdd;
    public del_vert: GIGeomDelVert;
    public edit_topo: GIGeomEditTopo;
    public edit_pline: GIGeomEditPline;
    public edit_pgon: GIGeomEditPgon;
    public nav: GIGeomNav;
    public query: GIGeomQuery;
    public check: GIGeomCheck;
    public compare: GIGeomCompare;
    public threejs: GIGeomThreejs;
    public snapshot: GIGeomSnapshot;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
        this.imp_exp = new GIGeomImpExp(modeldata, this._geom_maps);
        this.add = new GIGeomAdd(modeldata, this._geom_maps);
        this.del_vert = new GIGeomDelVert(modeldata, this._geom_maps);
        this.edit_topo = new GIGeomEditTopo(modeldata, this._geom_maps);
        this.edit_pline = new GIGeomEditPline(modeldata, this._geom_maps);
        this.edit_pgon = new GIGeomEditPgon(modeldata, this._geom_maps);
        this.nav = new GIGeomNav(modeldata, this._geom_maps);
        this.query = new GIGeomQuery(modeldata, this._geom_maps);
        this.check = new GIGeomCheck(modeldata, this._geom_maps);
        this.compare = new GIGeomCompare(modeldata, this._geom_maps);
        this.threejs = new GIGeomThreejs(modeldata, this._geom_maps);
        this.snapshot = new GIGeomSnapshot(modeldata, this._geom_maps);
        this.selected = [];
    }
    /**
     * Generate a string for debugging
     */
    public toStr(): string {
        return JSON.stringify(this.imp_exp.exportGIAll());
    }
}
