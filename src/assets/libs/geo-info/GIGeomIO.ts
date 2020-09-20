import { IGeomJSONData, IGeomMaps, EEntType } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for geometry.
 */
export class GIGeomIO {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    /**
     * Sets the data in this model from JSON data.
     * The data is shallow copied.
     * The existing data in the model is deleted.
     * All entities get the same time stamp.
     * @param geom_data The JSON data
     */
    public setJSONData(geom_data: IGeomJSONData): void {
        // all entities get the same time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        // update the down arrays
        // add vertices to model
        this._geom_maps.dn_verts_posis = new Map();
        for (let i = 0; i < geom_data.verts.length; i++) {
            this._geom_maps.dn_verts_posis.set(geom_data.verts_i[i], geom_data.verts[i]);
        }
        // add triangles to model
        this._geom_maps.dn_tris_verts = new Map();
        for (let i = 0; i < geom_data.tris.length; i++) {
            this._geom_maps.dn_tris_verts.set(geom_data.tris_i[i], geom_data.tris[i]);
        }
        // add edges to model
        this._geom_maps.dn_edges_verts = new Map();
        for (let i = 0; i < geom_data.edges.length; i++) {
            this._geom_maps.dn_edges_verts.set(geom_data.edges_i[i], geom_data.edges[i]);
        }
        // add wires to model
        this._geom_maps.dn_wires_edges = new Map();
        for (let i = 0; i < geom_data.wires.length; i++) {
            this._geom_maps.dn_wires_edges.set(geom_data.wires_i[i], geom_data.wires[i]);
        }
        // add faces to model
        this._geom_maps.dn_faces_wires = new Map();
        this._geom_maps.dn_faces_tris = new Map();
        for (let i = 0; i < geom_data.faces.length; i++) {
            this._geom_maps.dn_faces_wires.set(geom_data.faces_i[i], geom_data.faces[i]);
            this._geom_maps.dn_faces_tris.set(geom_data.faces_i[i], geom_data.facetris[i]);
        }
        // add points to model
        this._geom_maps.dn_points_verts = new Map();
        for (let i = 0; i < geom_data.points.length; i++) {
            this._geom_maps.dn_points_verts.set(geom_data.points_i[i], geom_data.points[i]);
            this._geom.time_stamp.setEntTs(EEntType.POINT, geom_data.points_i[i], ts); // time stamp
        }
        // add plines to model
        this._geom_maps.dn_plines_wires = new Map();
        for (let i = 0; i < geom_data.plines.length; i++) {
            this._geom_maps.dn_plines_wires.set(geom_data.plines_i[i], geom_data.plines[i]);
            this._geom.time_stamp.setEntTs(EEntType.PLINE, geom_data.plines_i[i], ts); // time stamp
        }
        // add pgons to model
        this._geom_maps.dn_pgons_faces = new Map();
        for (let i = 0; i < geom_data.pgons.length; i++) {
            this._geom_maps.dn_pgons_faces.set(geom_data.pgons_i[i], geom_data.pgons[i]);
            this._geom.time_stamp.setEntTs(EEntType.PGON, geom_data.pgons_i[i], ts); // time stamp
        }
        // add collections to model
        this._geom_maps.dn_colls_points = new Map();
        this._geom_maps.dn_colls_plines = new Map();
        this._geom_maps.dn_colls_pgons = new Map();
        this._geom_maps.up_colls_colls = new Map();
        for (let i = 0; i < geom_data.colls_i.length; i++) {
            this._geom_maps.dn_colls_points.set(geom_data.colls_i[i], geom_data.colls_points[i]);
            this._geom_maps.dn_colls_plines.set(geom_data.colls_i[i], geom_data.colls_plines[i]);
            this._geom_maps.dn_colls_pgons.set(geom_data.colls_i[i], geom_data.colls_pgons[i]);
            this._geom_maps.up_colls_colls.set(geom_data.colls_i[i], geom_data.colls_parents[i]);
            this._geom.time_stamp.setEntTs(EEntType.COLL, geom_data.colls_i[i], ts); // time stamp
        }
        // set selected
        this._geom.selected = geom_data.selected;
        // ========================================================================================
        // update the up arrays
        // posis->verts, create empty []
        this._geom_maps.up_posis_verts = new Map();
        for (let i = 0; i < geom_data.posis_i.length; i++) {
            this._geom_maps.up_posis_verts.set(geom_data.posis_i[i], []);
            this._geom.time_stamp.setEntTs(EEntType.POSI, geom_data.posis_i[i], ts); // time stamp
        }
        // posis->verts
        this._geom_maps.dn_verts_posis.forEach( (posi_i, vert_i) => {
            this._geom_maps.up_posis_verts.get(posi_i).push(vert_i);
        });
        // verts->tris, one to many
        this._geom_maps.up_verts_tris = new Map();
        this._geom_maps.dn_tris_verts.forEach( (vert_i_arr, tri_i) => {
            vert_i_arr.forEach( vert_i => {
                if (!this._geom_maps.up_verts_tris.has(vert_i)) {
                    this._geom_maps.up_verts_tris.set(vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(vert_i).push(tri_i);
            });
        });
        // verts->edges, one to two
        // order is important
        this._geom_maps.up_verts_edges = new Map();
        this._geom_maps.dn_edges_verts.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( (vert_i, index) => {
                if (!this._geom_maps.up_verts_edges.has(vert_i)) {
                    this._geom_maps.up_verts_edges.set(vert_i, []);
                }
                if (index === 0) {
                    this._geom_maps.up_verts_edges.get(vert_i).push(edge_i);
                } else if (index === 1) {
                    this._geom_maps.up_verts_edges.get(vert_i).splice(0, 0, edge_i);
                }
                if (index > 1) {
                    throw new Error('Import data error: Found an edge with more than two vertices.');
                }
            });
        });
        // edges->wires
        this._geom_maps.up_edges_wires = new Map();
        this._geom_maps.dn_wires_edges.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, wire_i);
            });
        });
        // wires->faces
        this._geom_maps.up_wires_faces = new Map();
        this._geom_maps.dn_faces_wires.forEach( (wire_i_arr, face_i) => {
            wire_i_arr.forEach( wire_i => {
                this._geom_maps.up_wires_faces.set(wire_i, face_i);
            });
        });
        // tris->faces
        this._geom_maps.up_tris_faces = new Map();
        this._geom_maps.dn_faces_tris.forEach( (tri_i_arr, face_i) => {
            tri_i_arr.forEach( tri_i => {
                this._geom_maps.up_tris_faces.set(tri_i, face_i);
            });
        });
        // points, lines, polygons
        this._geom_maps.up_verts_points = new Map();
        this._geom_maps.dn_points_verts.forEach( (vert_i, point_i) => {
            this._geom_maps.up_verts_points.set(vert_i, point_i);
        });
        this._geom_maps.up_wires_plines = new Map();
        this._geom_maps.dn_plines_wires.forEach( (wire_i, line_i) => {
            this._geom_maps.up_wires_plines.set(wire_i, line_i);
        });
        this._geom_maps.up_faces_pgons = new Map();
        this._geom_maps.dn_pgons_faces.forEach( (face_i, pgon_i) => {
            this._geom_maps.up_faces_pgons.set(face_i, pgon_i);
        });
        // collections of points, polylines, polygons
        this._geom_maps.up_points_colls = new Map();
        this._geom_maps.dn_colls_points.forEach( (point_i_arr, coll_i) => {
            point_i_arr.forEach( point_i => {
                if (!this._geom_maps.up_points_colls.has(point_i)) {
                    this._geom_maps.up_points_colls.set(point_i, [coll_i]);
                } else {
                    this._geom_maps.up_points_colls.get(point_i).push(coll_i);
                }
            });
        });
        this._geom_maps.up_plines_colls = new Map();
        this._geom_maps.dn_colls_plines.forEach( (pline_i_arr, coll_i) => {
            pline_i_arr.forEach( pline_i => {
                if (!this._geom_maps.up_plines_colls.has(pline_i)) {
                    this._geom_maps.up_plines_colls.set(pline_i, [coll_i]);
                } else {
                    this._geom_maps.up_plines_colls.get(pline_i).push(coll_i);
                }
            });
        });
        this._geom_maps.up_pgons_colls = new Map();
        this._geom_maps.dn_colls_pgons.forEach( (pgon_i_arr, coll_i) => {
            pgon_i_arr.forEach( pgon_i => {
                if (!this._geom_maps.up_pgons_colls.has(pgon_i)) {
                    this._geom_maps.up_pgons_colls.set(pgon_i, [coll_i]);
                } else {
                    this._geom_maps.up_pgons_colls.get(pgon_i).push(coll_i);
                }
            });
        });
    }
    /**
     * Returns the JSON data for this model.
     * The data is shallow copied.
     */
    public getJSONData(): IGeomJSONData {
        const data: IGeomJSONData = {
            posis_i: [],
            verts: [], verts_i: [],
            tris: [], tris_i: [],
            edges: [], edges_i: [],
            wires: [], wires_i: [],
            faces: [], facetris: [], faces_i: [],
            points: [], points_i: [],
            plines: [], plines_i: [],
            pgons: [], pgons_i: [],
            colls_points: [], colls_plines: [], colls_pgons: [], colls_parents: [], colls_i: [],
            selected: this._geom.selected
        };
        this._geom_maps.up_posis_verts.forEach( (_, i) => {
            data.posis_i.push(i);
        });
        this._geom_maps.dn_verts_posis.forEach( (ent, i) => {
            data.verts.push(ent);
            data.verts_i.push(i);
        });
        this._geom_maps.dn_tris_verts.forEach( (ent, i) => {
            data.tris.push(ent);
            data.tris_i.push(i);
        });
        this._geom_maps.dn_edges_verts.forEach( (ent, i) => {
            data.edges.push(ent);
            data.edges_i.push(i);
        });
        this._geom_maps.dn_wires_edges.forEach( (ent, i) => {
            data.wires.push(ent);
            data.wires_i.push(i);
        });
        this._geom_maps.dn_faces_wires.forEach( (ent, i) => {
            data.faces.push(ent);
            data.faces_i.push(i);
        });
        this._geom_maps.dn_faces_tris.forEach( (ent, _) => {
            data.facetris.push(ent);
        });
        // objects
        this._geom_maps.dn_points_verts.forEach( (ent, i) => {
            data.points.push(ent);
            data.points_i.push(i);
        });
        this._geom_maps.dn_plines_wires.forEach( (ent, i) => {
            data.plines.push(ent);
            data.plines_i.push(i);
        });
        this._geom_maps.dn_pgons_faces.forEach( (ent, i) => {
            data.pgons.push(ent);
            data.pgons_i.push(i);
        });
        // collections
        this._geom_maps.dn_colls_points.forEach( (ent, _) => {
            data.colls_points.push(ent);
        });
        this._geom_maps.dn_colls_plines.forEach( (ent, _) => {
            data.colls_plines.push(ent);
        });
        this._geom_maps.dn_colls_pgons.forEach( (ent, _) => {
            data.colls_pgons.push(ent);
        });
        this._geom_maps.up_colls_colls.forEach( (ent, i) => {
            data.colls_parents.push(ent);
            data.colls_i.push(i);
        });
        return data;
    }
}
