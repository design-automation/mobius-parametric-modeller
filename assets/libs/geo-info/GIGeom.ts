import { GIModel } from './GIModel';
import { IGeomData, IGeomArrays } from './common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomThreejs } from './GIGeomThreejs';

/**
 * Class for geometry.
 */
export class GIGeom {
    public model: GIModel;
    //  all arrays
    private _geom_arrays: IGeomArrays = {
        num_posis: 0,
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
    public add: GIGeomAdd;
    public query: GIGeomQuery;
    public threejs: GIGeomThreejs;
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(model: GIModel) {
        this.model = model;
        this.add = new GIGeomAdd(this, this._geom_arrays);
        this.query = new GIGeomQuery(this, this._geom_arrays);
        this.threejs = new GIGeomThreejs(this, this._geom_arrays);
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IGeomData {
        return {
            num_positions: this._geom_arrays.num_posis,
            triangles: this._geom_arrays.dn_tris_verts,
            vertices: this._geom_arrays.dn_verts_posis,
            edges: this._geom_arrays.dn_edges_verts,
            wires: this._geom_arrays.dn_wires_edges,
            faces: this._geom_arrays.dn_faces_wirestris,
            points: this._geom_arrays.dn_points_verts,
            polylines: this._geom_arrays.dn_plines_wires,
            polygons: this._geom_arrays.dn_pgons_faces,
            collections: this._geom_arrays.dn_colls_objs
        };
    }
}
