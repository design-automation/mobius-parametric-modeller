import { TTri, TVert, TEdge, TWire, TFace,
    TColl, IGeomData, TPoint, TPline, TPgon, Txyz, IGeomArrays, IGeomCopy, TAttribDataTypes, IGeomPack } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for geometry.
 */
export class GIGeomIO {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted.
     * Both models may have deleted items, resulting in null values.
     * @param geom_arrays The geom_arrays of the other model.
     */
    public merge(geom_arrays: IGeomArrays): void {
        // get lengths of existing entities before we start adding stuff
        // const num_posis: number = this._geom_arrays.num_posis;
        const num_posis: number = this._geom_arrays.up_posis_verts.length;
        const num_verts: number = this._geom_arrays.dn_verts_posis.length;
        const num_tris: number = this._geom_arrays.dn_tris_verts.length;
        const num_edges: number = this._geom_arrays.dn_edges_verts.length;
        const num_wires: number = this._geom_arrays.dn_wires_edges.length;
        const num_faces: number = this._geom_arrays.dn_faces_wirestris.length;
        const num_points: number = this._geom_arrays.dn_points_verts.length;
        const num_plines: number = this._geom_arrays.dn_plines_wires.length;
        const num_pgons: number = this._geom_arrays.dn_pgons_faces.length;
        const num_colls: number = this._geom_arrays.dn_colls_objs.length;

        // for the down arrays, it is important the values are never undefined
        // undefined cannot be exported as json
        // if anything is deleted, then the value should be null

        // add vertices to model
        for (const posi_i of geom_arrays.dn_verts_posis) {
            if (posi_i === null) {
                this._geom_arrays.dn_verts_posis.push( null );
            } else {
                const new_vert: TVert = posi_i + num_posis as TVert;
                this._geom_arrays.dn_verts_posis.push( new_vert );
            }
        }
        // add triangles to model
        for (const verts_i of geom_arrays.dn_tris_verts) {
            if (verts_i === null) {
                this._geom_arrays.dn_tris_verts.push( null );
            } else {
                const new_triangle: TTri = verts_i.map(v => v + num_verts) as TTri;
                this._geom_arrays.dn_tris_verts.push( new_triangle );
            }
        }
        // add edges to model
        for (const verts_i of geom_arrays.dn_edges_verts) {
            if (verts_i === null) {
                this._geom_arrays.dn_edges_verts.push( null );
            } else {
                const new_edge: TEdge = verts_i.map(v => v + num_verts) as TEdge;
                this._geom_arrays.dn_edges_verts.push( new_edge );
            }
        }
        // add wires to model
        for (const edges_i of geom_arrays.dn_wires_edges) {
            if (edges_i === null) {
                this._geom_arrays.dn_wires_edges.push( null )
            } else {
                const new_wire: TWire = edges_i.map(e => e + num_edges) as TWire;
                this._geom_arrays.dn_wires_edges.push( new_wire );
            }
        }
        // add faces to model
        for (const wires_tris_i of geom_arrays.dn_faces_wirestris) {
            if (wires_tris_i === null) {
                this._geom_arrays.dn_faces_wirestris.push( null );
            } else {
                const new_face: TFace = [
                    wires_tris_i[0].map( w => w + num_wires),
                    wires_tris_i[1].map( t => t + num_tris)
                ] as TFace;
                this._geom_arrays.dn_faces_wirestris.push( new_face );
            }
        }
        // add points to model
        for (const vert_i of geom_arrays.dn_points_verts) {
            if (vert_i === null) {
                this._geom_arrays.dn_points_verts.push( null );
            } else {
                const new_point: TPoint = vert_i + num_verts as TPoint;
                this._geom_arrays.dn_points_verts.push( new_point );
            }
        }
        // add plines to model
        for (const wire_i of geom_arrays.dn_plines_wires) {
            if (wire_i === null) {
                this._geom_arrays.dn_plines_wires.push( null );
            } else {
                const new_pline: TPline = wire_i + num_wires as TPline;
                this._geom_arrays.dn_plines_wires.push( new_pline );
            }
        }
        // add pgons to model
        for (const face_i of geom_arrays.dn_pgons_faces) {
            if (face_i === null) {
                this._geom_arrays.dn_pgons_faces.push( null );
            } else {
                const new_pgon: TPgon = face_i + num_faces as TPgon;
                this._geom_arrays.dn_pgons_faces.push( new_pgon );
            }
        }
        // add collections to model
        for (const coll of geom_arrays.dn_colls_objs) {
            if (coll === null) {
                this._geom_arrays.dn_colls_objs.push( null );
            } else {
                const parent: number = (coll[0] === -1) ? -1 : coll[0] + num_colls;
                const coll_points_i: number[] = coll[1].map( point => point + num_points);
                const coll_plines_i: number[] = coll[2].map( line => line + num_plines);
                const coll_pgons_i: number[] = coll[3].map( pgon => pgon + num_pgons);
                const new_coll: TColl = [parent, coll_points_i, coll_plines_i, coll_pgons_i];
                this._geom_arrays.dn_colls_objs.push( new_coll );
            }
        }

        // update reverse arrays

        // undefined = no value
        // in typescript, undefined behaves in strange ways, try this
        //     const x = [0, undefined, 2, , 4];
        //     for (const i of x) { console.log("i in for loop:", i);}
        //     x.forEach(i => console.log("i in foreach loop:", i) );
        // for the undefined values, explicitly setting the value to undefined is not the same as not setting it at all
        // with a foreach loop, if there is no value, then it skips it completley
        // in this case, we want to make sure there is no value

        // update posis to verts (they can be null or [])
        for (let i = 0; i < geom_arrays.up_posis_verts.length; i++) {
            const verts_i: number[] = geom_arrays.up_posis_verts[i];
            if (verts_i === undefined) {
                continue;
            } else if (verts_i === null) {
                this._geom_arrays.up_posis_verts[i + num_posis] = null;
            } else {
                const new_verts_i: number[] = verts_i.map( vert_i => vert_i + num_verts);
                this._geom_arrays.up_posis_verts[i + num_posis] = new_verts_i;
            }
        }
        // update verts to tris
        for (let i = 0; i < geom_arrays.up_verts_tris.length; i++) {
            const tris_i: number[] = geom_arrays.up_verts_tris[i];
            if (tris_i === undefined) {
                continue;
            } else if (tris_i === null) {
                this._geom_arrays.up_verts_tris[i + num_verts] = null;
            } else {
                const new_tris_i: number[] = tris_i.map( tri_i => tri_i + num_tris);
                this._geom_arrays.up_verts_tris[i + num_verts] = new_tris_i;
            }
        }
        // update tris to faces
        for (let i = 0; i < geom_arrays.up_tris_faces.length; i++) {
            const face_i: number = geom_arrays.up_tris_faces[i];
            if (face_i === undefined) {
                continue;
            } else if (face_i === null) {
                this._geom_arrays.up_tris_faces[i + num_tris] = null;
            } else {
                const new_face_i: number = face_i + num_faces;
                this._geom_arrays.up_tris_faces[i + num_tris] = new_face_i;
            }
        }
        // update verts to edges
        for (let i = 0; i < geom_arrays.up_verts_edges.length; i++) {
            const edges_i: number[] = geom_arrays.up_verts_edges[i];
            if (edges_i === undefined) {
                continue;
            } else if (edges_i === null) {
                this._geom_arrays.up_verts_edges[i + num_verts] = null;
            } else {
                const new_edges_i: number[] = edges_i.map( edge_i => edge_i + num_edges);
                this._geom_arrays.up_verts_edges[i + num_verts] = new_edges_i;
            }
        }
        // update edges to wires
        for (let i = 0; i < geom_arrays.up_edges_wires.length; i++) {
            const wire_i: number = geom_arrays.up_edges_wires[i];
            if (wire_i === undefined) {
                continue;
            } else if (wire_i === null) {
                this._geom_arrays.up_edges_wires[i + num_edges] = null;
            } else {
                const new_wire_i: number = wire_i + num_wires;
                this._geom_arrays.up_edges_wires[i + num_edges] = new_wire_i;
            }
        }
        // update wires to faces
        for (let i = 0; i < geom_arrays.up_wires_faces.length; i++) {
            const face_i: number = geom_arrays.up_wires_faces[i];
            if (face_i === undefined) {
                continue;
            } else if (face_i === null) {
                this._geom_arrays.up_wires_faces[i + num_wires] = null;
            } else {
                const new_face_i: number = face_i + num_faces;
                this._geom_arrays.up_wires_faces[i + num_wires] = new_face_i;
            }
        }
        // update verts to points
        for (let i = 0; i < geom_arrays.up_verts_points.length; i++) {
            const point_i: number = geom_arrays.up_verts_points[i];
            if (point_i === undefined) {
                continue;
            } else if (point_i === null) {
                this._geom_arrays.up_verts_points[i + num_points] = null;
            } else {
                const new_point_i: number = point_i + num_points;
                this._geom_arrays.up_verts_points[i + num_points] = new_point_i;
            }
        }
        // update wires to plines
        for (let i = 0; i < geom_arrays.up_wires_plines.length; i++) {
            const pline_i: number = geom_arrays.up_wires_plines[i];
            if (pline_i === undefined) {
                continue;
            } else if (pline_i === null) {
                this._geom_arrays.up_wires_plines[i + num_wires] = null;
            } else {
                const new_pline_i: number = pline_i + num_plines;
                this._geom_arrays.up_wires_plines[i + num_wires] = new_pline_i;
            }
        }
        // update faces to pgons
        for (let i = 0; i < geom_arrays.up_faces_pgons.length; i++) {
            const pgon_i: number = geom_arrays.up_faces_pgons[i];
            if (pgon_i === undefined) {
                continue;
            } else if (pgon_i === null) {
                this._geom_arrays.up_faces_pgons[i + num_faces] = null;
            } else {
                const new_pgon_i: number = pgon_i + num_pgons;
                this._geom_arrays.up_faces_pgons[i + num_faces] = new_pgon_i;
            }
        }
        // update points to colls
        for (let i = 0; i < geom_arrays.up_points_colls.length; i++) {
            const colls_i: number[] = geom_arrays.up_points_colls[i];
            if (colls_i === undefined) {
                continue;
            } else if (colls_i === null) {
                this._geom_arrays.up_points_colls[i + num_points] = null;
            } else {
                const new_colls_i: number[] = colls_i.map(coll_i => coll_i + num_colls);
                this._geom_arrays.up_points_colls[i + num_points] = new_colls_i;
            }
        }
        // update plines to colls
        for (let i = 0; i < geom_arrays.up_plines_colls.length; i++) {
            const colls_i: number[] = geom_arrays.up_plines_colls[i];
            if (colls_i === undefined) {
                continue;
            } else if (colls_i === null) {
                this._geom_arrays.up_plines_colls[i + num_plines] = null;
            } else {
                const new_colls_i: number[] = colls_i.map(coll_i => coll_i + num_colls);
                this._geom_arrays.up_plines_colls[i + num_plines] = new_colls_i;
            }
        }
        // update pgons to colls
        for (let i = 0; i < geom_arrays.up_pgons_colls.length; i++) {
            const colls_i: number[] = geom_arrays.up_pgons_colls[i];
            if (colls_i === undefined) {
                continue;
            } else if (colls_i === null) {
                this._geom_arrays.up_pgons_colls[i + num_pgons] = null;
            } else {
                const new_colls_i: number[] = colls_i.map(coll_i => coll_i + num_colls);
                this._geom_arrays.up_pgons_colls[i + num_pgons] = new_colls_i;
            }
        }
    }

    /**
     * Sets the data in this model from JSON data.
     * The existing data in the model is deleted.
     * @param geom_data The JSON data
     */
    public setData(geom_data: IGeomData): IGeomPack {
        // update the down arrays
        // these are assumed never to undefined

        // add vertices to model
        this._geom_arrays.dn_verts_posis =  geom_data.vertices;
        // add triangles to model
        this._geom_arrays.dn_tris_verts =  geom_data.triangles;
        // add edges to model
        this._geom_arrays.dn_edges_verts = geom_data.edges;
        // add wires to model
        this._geom_arrays.dn_wires_edges = geom_data.wires;
        // add faces to model
        this._geom_arrays.dn_faces_wirestris = geom_data.faces;
        // add points to model
        this._geom_arrays.dn_points_verts = geom_data.points;
        // add lines to model
        this._geom_arrays.dn_plines_wires = geom_data.polylines;
        // add pgons to model
        this._geom_arrays.dn_pgons_faces = geom_data.polygons;
        // add collections to model
        this._geom_arrays.dn_colls_objs = geom_data.collections;

        // update the up arrays
        // many of the values will be undefined
        // they could be null, since we might have saved some data with deleted ents

        // fill up_posis_verts with either null or empty arrays
        // the up_posis_verts array is special, it can have no undefine values
        // its length is used to determine how many posis there are in the model
        this._geom_arrays.up_posis_verts = [];
        for (let posi_i = 0; posi_i < geom_data.num_positions; posi_i++) {
            if (this._geom.model.attribs.query.getPosiCoords(posi_i) === undefined) {
                this._geom_arrays.up_posis_verts[posi_i] = null;
            } else {
                this._geom_arrays.up_posis_verts[posi_i] = [];
            }
        }
        // posis->verts
        this._geom_arrays.dn_verts_posis.forEach( (posi_i, vert_i) => { // val, index
            if (posi_i !== null) {
                this._geom_arrays.up_posis_verts[posi_i].push(vert_i);
            }
        });
        // verts->tris, one to many
        this._geom_arrays.up_verts_tris = [];
        this._geom_arrays.dn_tris_verts.forEach( (vert_i_arr, tri_i) => { // val, index
            if (vert_i_arr !== null) {
                vert_i_arr.forEach( vert_i => {
                    if (this._geom_arrays.up_verts_tris[vert_i] === undefined) {
                        this._geom_arrays.up_verts_tris[vert_i] = [];
                    }
                    this._geom_arrays.up_verts_tris[vert_i].push(tri_i);
                });
            }
        });
        // verts->edges, one to two
        this._geom_arrays.up_verts_edges = [];
        this._geom_arrays.dn_edges_verts.forEach( (vert_i_arr, edge_i) => { // val, index
            if (vert_i_arr !== null) {
                vert_i_arr.forEach( vert_i => {
                    if (this._geom_arrays.up_verts_edges[vert_i] === undefined) {
                        this._geom_arrays.up_verts_edges[vert_i] = [];
                    }
                    this._geom_arrays.up_verts_edges[vert_i].push(edge_i);
                });
            }
        });
        // edges->wires
        this._geom_arrays.up_edges_wires = [];
        this._geom_arrays.dn_wires_edges.forEach( (edge_i_arr, wire_i) => { // val, index
            if (edge_i_arr !== null) {
                edge_i_arr.forEach( edge_i => {
                    this._geom_arrays.up_edges_wires[edge_i] = wire_i;
                });
            }
        });
        // wires->faces, tris->faces, faces->wirestris
        this._geom_arrays.up_wires_faces = [];
        this._geom_arrays.up_tris_faces = [];
        this._geom_arrays.dn_faces_wirestris.forEach( (face, face_i) => { // val, index
            if (face !== null) {
                const [wire_i_arr, tri_i_arr] = face;
                wire_i_arr.forEach( wire_i => {
                    this._geom_arrays.up_wires_faces[wire_i] = face_i;
                });
                tri_i_arr.forEach( tri_i => {
                    this._geom_arrays.up_tris_faces[tri_i] = face_i;
                });
            }
        });
        // points, lines, polygons
        this._geom_arrays.up_verts_points = [];
        this._geom_arrays.dn_points_verts.forEach( (vert_i, point_i) => { // val, index
            if (vert_i !== null) {
                this._geom_arrays.up_verts_points[vert_i] = point_i;
            }
        });
        this._geom_arrays.up_wires_plines = [];
        this._geom_arrays.dn_plines_wires.forEach( (wire_i, line_i) => { // val, index
            if (wire_i !== null) {
                this._geom_arrays.up_wires_plines[wire_i] = line_i;
            }
        });
        this._geom_arrays.up_faces_pgons = [];
        this._geom_arrays.dn_pgons_faces.forEach( (face_i, pgon_i) => { // val, index
            if (face_i !== null) {
                this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
            }
        });
        // collections of points, polylines, polygons
        this._geom_arrays.up_points_colls = [];
        this._geom_arrays.up_plines_colls = [];
        this._geom_arrays.up_pgons_colls = [];
        this._geom_arrays.dn_colls_objs.forEach( (coll, coll_i) => { // val, index
            if (coll !== null) {
                const [parent, point_i_arr, pline_i_arr, pgon_i_arr] = coll;
                point_i_arr.forEach( point_i => {
                    if (this._geom_arrays.up_points_colls[point_i] === undefined) {
                        this._geom_arrays.up_points_colls[point_i] = [coll_i];
                    } else {
                        this._geom_arrays.up_points_colls[point_i].push(coll_i);
                    }
                });
                pline_i_arr.forEach( pline_i => {
                    if (this._geom_arrays.up_plines_colls[pline_i] === undefined) {
                        this._geom_arrays.up_plines_colls[pline_i] = [coll_i];
                    } else {
                        this._geom_arrays.up_plines_colls[pline_i].push(coll_i);
                    }
                });
                pgon_i_arr.forEach( pgon_i => {
                    if (this._geom_arrays.up_pgons_colls[pgon_i] === undefined) {
                        this._geom_arrays.up_pgons_colls[pgon_i] = [coll_i];
                    } else {
                        this._geom_arrays.up_pgons_colls[pgon_i].push(coll_i);
                    }
                });
            }
        });

        // return data
        return {
            posis_i:  Array.from(Array(geom_data.num_positions).keys()), // .map(v => v + num_old_posis),
            points_i: Array.from(Array(geom_data.points.length).keys()), // .map(v => v + num_old_points),
            plines_i: Array.from(Array(geom_data.polylines.length).keys()), // .map(v => v + num_old_plines),
            pgons_i:  Array.from(Array(geom_data.polygons.length).keys()), // .map(v => v + num_old_pgons),
            colls_i:  Array.from(Array(geom_data.collections.length).keys()) // .map(v => v + num_old_colls)
        };
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IGeomData {
        return {
            num_positions: this._geom_arrays.up_posis_verts.length,
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
