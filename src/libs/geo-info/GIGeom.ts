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
        up_wires_lines: [],
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
            linestrings: this._geom_arrays.dn_plines_wires,
            polygons: this._geom_arrays.dn_pgons_faces,
            collections: this._geom_arrays.dn_colls_objs
        };
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays() {
        // positions
        this._geom_arrays.up_posis_verts = [];
        this._geom_arrays.dn_verts_posis.forEach( (pos_i, vert_i) => {
            if (this._geom_arrays.up_posis_verts[pos_i] === undefined) {
                this._geom_arrays.up_posis_verts[pos_i] = [];
            }
            this._geom_arrays.up_posis_verts[pos_i].push(vert_i);
        });
        // tris, edges, wires, faces
        this._geom_arrays.up_verts_tris = [];
        this._geom_arrays.dn_tris_verts.forEach( (vert_i_arr, tri_i) => {
            vert_i_arr.forEach( vert_i => {
                this._geom_arrays.up_verts_tris[vert_i] = tri_i;
            });
        });
        this._geom_arrays.up_verts_edges = [];
        this._geom_arrays.dn_edges_verts.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( vert_i => {
                this._geom_arrays.up_verts_edges[vert_i] = edge_i;
            });
        });
        this._geom_arrays.up_edges_wires = [];
        this._geom_arrays.dn_wires_edges.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this._geom_arrays.up_edges_wires[edge_i] = wire_i;
            });
        });
        this._geom_arrays.up_wires_faces = [];
        this._geom_arrays.up_tris_faces = [];
        this._geom_arrays.dn_faces_wirestris.forEach( ([wire_i_arr, tri_i_arr], face_i) => {
            wire_i_arr.forEach( wire_i => {
                this._geom_arrays.up_wires_faces[wire_i] = face_i;
            });
            tri_i_arr.forEach( tri_i => {
                this._geom_arrays.up_tris_faces[tri_i] = face_i;
            });
        });
        // points, lines, polygons
        this._geom_arrays.up_verts_points = [];
        this._geom_arrays.dn_points_verts.forEach( (vert_i, point_i) => {
            this._geom_arrays.up_verts_points[vert_i] = point_i;
        });
        this._geom_arrays.up_wires_lines = [];
        this._geom_arrays.dn_plines_wires.forEach( (wire_i, line_i) => {
            this._geom_arrays.up_wires_lines[wire_i] = line_i;
        });
        this._geom_arrays.up_faces_pgons = [];
        this._geom_arrays.dn_pgons_faces.forEach( (face_i, pgon_i) => {
            this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, linestrings, polygons
        this._geom_arrays.up_points_colls = [];
        this._geom_arrays.up_plines_colls = [];
        this._geom_arrays.up_pgons_colls = [];
        this._geom_arrays.dn_colls_objs.forEach( ([parent, point_i_arr, line_i_arr, pgon_i_arr], coll_i) => {
            point_i_arr.forEach( point_i => {
                this._geom_arrays.up_points_colls[point_i] = coll_i;
            });
            line_i_arr.forEach( line_i => {
                this._geom_arrays.up_plines_colls[line_i] = coll_i;
            });
            pgon_i_arr.forEach( pgon_i => {
                this._geom_arrays.up_pgons_colls[pgon_i] = coll_i;
            });
        });
    }
}
