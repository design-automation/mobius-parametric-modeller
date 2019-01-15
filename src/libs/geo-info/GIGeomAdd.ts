import { EEntType, TTri, TVert, TEdge, TWire, TFace,
    TColl, IGeomData, TPoint, TPline, TPgon, Txyz, IGeomArrays, IGeomCopy, TAttribDataTypes, IGeomPack } from './common';
import { triangulate } from '../triangulate/triangulate';
import { GIGeom } from './GIGeom';

/**
 * Class for geometry.
 */
export class GIGeomAdd {
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
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param geom_data The JSON data
     */
    public addData(geom_data: IGeomData): IGeomPack {
        // get lengths before we start adding stuff
        const num_posis: number = this._geom_arrays.num_posis;
        const num_verts: number = this._geom_arrays.dn_verts_posis.length;
        const num_tris: number = this._geom_arrays.dn_tris_verts.length;
        const num_edges: number = this._geom_arrays.dn_edges_verts.length;
        const num_wires: number = this._geom_arrays.dn_wires_edges.length;
        const num_faces: number = this._geom_arrays.dn_faces_wirestris.length;
        const num_points: number = this._geom_arrays.dn_points_verts.length;
        const num_plines: number = this._geom_arrays.dn_plines_wires.length;
        const num_pgons: number = this._geom_arrays.dn_pgons_faces.length;
        const num_colls: number = this._geom_arrays.dn_colls_objs.length;
        // Add vertices to model
        const new_verts: TVert[] = geom_data.vertices.map(p => p + num_posis as TVert);
        for (const v of new_verts) {
            this._geom_arrays.dn_verts_posis.push( v );
        }
        // Add triangles to model
        // const new_triangles: TTri[] = geom_data.triangles.map(t => t.map(v => v + num_verts) as TTri);
        // // this._geom_arrays.dn_tris_verts.push( ...new_triangles );
        // for (const v of new_triangles) {
        //     this._geom_arrays.dn_tris_verts.push( v );
        // }
        for (const triangle of geom_data.triangles) {
            if (triangle !== null) {
                const new_triangle: TTri = triangle.map(v => v + num_verts) as TTri;
                this._geom_arrays.dn_tris_verts.push( new_triangle );
            } else {
                this._geom_arrays.dn_tris_verts.push( null );
            }
        }



        // Add edges to model
        const new_edges: TEdge[] = geom_data.edges.map(e => e.map(v => v + num_verts) as TEdge);
        // this._geom_arrays.dn_edges_verts.push( ...new_edges );
        for (const v of new_edges) {
            this._geom_arrays.dn_edges_verts.push( v );
        }
        // Add wires to model
        const new_wires: TWire[] = geom_data.wires.map(w => w.map(e => e + num_edges) as TWire);
        // this._geom_arrays.dn_wires_edges.push( ...new_wires );
        for (const v of new_wires) {
            this._geom_arrays.dn_wires_edges.push( v );
        }
        // Add faces to model
        const new_faces: TFace[] = geom_data.faces.map(f => [
            f[0].map( w => w + num_wires),
            f[1].map( t => t + num_tris)
        ] as TFace);
        // this._geom_arrays.dn_faces_wirestris.push( ...new_faces );
        for (const v of new_faces) {
            this._geom_arrays.dn_faces_wirestris.push( v );
        }
        // Add points to model
        const new_points: TPoint[] = geom_data.points.map(v => v + num_verts as TPoint);
        // this._geom_arrays.dn_points_verts.push( ...new_points );
        for (const v of new_points) {
            this._geom_arrays.dn_points_verts.push( v );
        }
        // Add lines to model
        const new_plines: TPline[] = geom_data.polylines.map(w => w + num_wires as TPline);
        // this._geom_arrays.dn_plines_wires.push( ...new_plines );
        for (const v of new_plines) {
            this._geom_arrays.dn_plines_wires.push( v );
        }
        // Add pgons to model
        const new_pgons: TPgon[] = geom_data.polygons.map(f => f + num_faces as TPgon);
        // this._geom_arrays.dn_pgons_faces.push( ...new_pgons );
        for (const v of new_pgons) {
            this._geom_arrays.dn_pgons_faces.push( v );
        }
        // Add collections to model
        const new_colls: TColl[] = geom_data.collections.map(c => [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map( point => point + num_points),
            c[2].map( line => line + num_plines),
            c[3].map( pgon => pgon + num_pgons)
        ] as TColl);
        // this._geom_arrays.dn_colls_objs.push( ...new_colls );
        for (const v of new_colls) {
            this._geom_arrays.dn_colls_objs.push( v );
        }
        // Update the reverse arrays
        this._updateRevArrays();
        // update the positions array
        this._geom_arrays.num_posis += geom_data.num_positions;
        // return
        let num_new_posis = 0;
        // if (new_verts.length > 0) { num_new_posis = Math.max(...new_verts); }
        if (new_verts.length > 0) { new_verts.map(val => {
            if (val > num_new_posis) {
                num_new_posis = val;
            }
        }); }



        return {
            posis_i:  Array.from(Array(num_new_posis).keys()).map(k => k +  num_posis),
            points_i: Array.from(Array(new_points.length).keys()).map(k => k + num_points),
            plines_i: Array.from(Array(new_plines.length).keys()).map(k => k + num_plines),
            pgons_i:  Array.from(Array(new_pgons.length).keys()).map(k => k +  num_pgons),
            colls_i:  Array.from(Array(new_colls.length).keys()).map(k => k +  num_colls)
        };
    }
    // ============================================================================
    // Private method to update the reverse arrays after addData()
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays() {
        // posis->verts
        this._geom_arrays.up_posis_verts = [];
        this._geom_arrays.dn_verts_posis.forEach( (pos_i, vert_i) => {
            if (this._geom_arrays.up_posis_verts[pos_i] === undefined) {
                this._geom_arrays.up_posis_verts[pos_i] = [];
            }
            this._geom_arrays.up_posis_verts[pos_i].push(vert_i);
        });

        // verts->tris, one to many
        this._geom_arrays.up_verts_tris = [];
        this._geom_arrays.dn_tris_verts.forEach( (vert_i_arr, tri_i) => {
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
        this._geom_arrays.dn_edges_verts.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( vert_i => {
                if (this._geom_arrays.up_verts_edges[vert_i] === undefined) {
                    this._geom_arrays.up_verts_edges[vert_i] = [];
                }
                this._geom_arrays.up_verts_edges[vert_i].push(edge_i);
            });
        });
        // edges->wires
        this._geom_arrays.up_edges_wires = [];
        this._geom_arrays.dn_wires_edges.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this._geom_arrays.up_edges_wires[edge_i] = wire_i;
            });
        });
        // wires->faces, tris->faces, faces->wirestris
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
        this._geom_arrays.up_wires_plines = [];
        this._geom_arrays.dn_plines_wires.forEach( (wire_i, line_i) => {
            this._geom_arrays.up_wires_plines[wire_i] = line_i;
        });
        this._geom_arrays.up_faces_pgons = [];
        this._geom_arrays.dn_pgons_faces.forEach( (face_i, pgon_i) => {
            this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, polylines, polygons
        this._geom_arrays.up_points_colls = [];
        this._geom_arrays.up_plines_colls = [];
        this._geom_arrays.up_pgons_colls = [];
        this._geom_arrays.dn_colls_objs.forEach( ([parent, point_i_arr, pline_i_arr, pgon_i_arr], coll_i) => {
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
        });
    }
    // ============================================================================
    // Private methods to create the topological entities
    // ============================================================================
    /**
     * Adds a vertex and updates the arrays.
     * @param posi_i
     */
    private _addVertex(posi_i: number): number {
        // update down arrays
        const vert_i: number = this._geom_arrays.dn_verts_posis.push(posi_i) - 1;
        // u[date up arrays]
        if (this._geom_arrays.up_posis_verts[posi_i] === undefined) {
            this._geom_arrays.up_posis_verts[posi_i] = [];
        }
        this._geom_arrays.up_posis_verts[posi_i].push(vert_i);
        // return the numeric index of the vertex
        return vert_i;
    }
    /**
     * Adds an edge and updates the arrays.
     * @param vert_i1
     * @param vert_i2
     */
    private _addEdge(vert_i1: number, vert_i2: number): number {
        // update down arrays
        const edge_i: number = this._geom_arrays.dn_edges_verts.push([vert_i1, vert_i2]) - 1;
        // update up arrays
        if (this._geom_arrays.up_verts_edges[vert_i1] === undefined) {
            this._geom_arrays.up_verts_edges[vert_i1] = [];
        }
        this._geom_arrays.up_verts_edges[vert_i1].push(edge_i);
        if (this._geom_arrays.up_verts_edges[vert_i2] === undefined) {
            this._geom_arrays.up_verts_edges[vert_i2] = [];
        }
        this._geom_arrays.up_verts_edges[vert_i2].push(edge_i);
        // return the numeric index pf teh edge
        return edge_i;
    }
    /**
     * Adds a wire and updates the arrays.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    private _addWire(edges_i: number[], close: boolean = false): number {
        // update down arrays
        const wire_i: number = this._geom_arrays.dn_wires_edges.push(edges_i) - 1;
        // update up arrays
        edges_i.forEach( edge_i => this._geom_arrays.up_edges_wires[edge_i] = wire_i );
        // return the numeric index of the wire
        return wire_i;
    }
    /**
     * Adds trangles and updates the arrays.
     * Wires are assumed to be closed!
     * @param wire_i
     */
    private _addTris(wire_i: number, hole_wires_i?: number[]): number[] {
        // save all verts
        const all_verts_i: number[] = [];
        // get the coords of the outer perimeter edge
        const wire_verts_i: number[] = this._geom.query.navAnyToVert(EEntType.WIRE, wire_i);
        wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
        const wire_posis_i: number[] = wire_verts_i.map( vert_i => this._geom_arrays.dn_verts_posis[vert_i] );
        const wire_coords: Txyz[] = wire_posis_i.map( posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i) );
        // get the coords of the holes
        const all_hole_coords: Txyz[][] = [];
        if (hole_wires_i !== undefined) {
            for (const hole_wire_i of hole_wires_i) {
                const hole_wire_verts_i: number[] = this._geom.query.navAnyToVert(EEntType.WIRE, hole_wire_i);
                hole_wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
                const hole_wire_posis_i: number[] = hole_wire_verts_i.map( vert_i => this._geom_arrays.dn_verts_posis[vert_i] );
                const hole_wire_coords: Txyz[] = hole_wire_posis_i.map( posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i) );
                all_hole_coords.push(hole_wire_coords);
            }
        }
        // create the triangles
        const tris_corners: number[][] = triangulate(wire_coords, all_hole_coords);
        const tris_verts_i: TTri[] = tris_corners.map(tri_corners => tri_corners.map( corner => all_verts_i[corner] ) as TTri );
        // update down arrays
        const tris_i: number[] = tris_verts_i.map(tri_verts_i => this._geom_arrays.dn_tris_verts.push(tri_verts_i) - 1);
        // update up arrays
        for (let i = 0; i < tris_verts_i.length; i++) {
            const tri_verts_i: TTri = tris_verts_i[i];
            const tri_i: number = tris_i[i];
            for (const tri_vert_i of tri_verts_i) {
                if (this._geom_arrays.up_verts_tris[tri_vert_i] === undefined) {
                    this._geom_arrays.up_verts_tris[tri_vert_i] = [];
                }
                this._geom_arrays.up_verts_tris[tri_vert_i].push(tri_i);
            }
        }
        // return an array of numeric indicies of the triangles
        return tris_i;
    }
    /**
     * Adds a face and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    private _addFace(wire_i: number): number {
        // create the triangles
        const tris_i: number[] = this._addTris(wire_i);
        // create the face
        const face: TFace = [[wire_i], tris_i];
        // update down arrays
        const face_i: number = this._geom_arrays.dn_faces_wirestris.push(face) - 1;
        // update up arrays
        this._geom_arrays.up_wires_faces[wire_i] = face_i;
        tris_i.forEach( tri_i => this._geom_arrays.up_tris_faces[tri_i] = face_i );
        // return the numeric index of the face
        return face_i;
    }
    /**
     * Adds a face with a hole and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    private _addFaceWithHoles(wire_i: number, holes_wires_i: number[]): number {
        // create the triangles
        const tris_i: number[] = this._addTris(wire_i, holes_wires_i);
        // create the face
        const face_wires_i: number[] = [wire_i].concat(holes_wires_i);
        const face: TFace = [face_wires_i, tris_i];
        // update down arrays
        const face_i: number = this._geom_arrays.dn_faces_wirestris.push(face) - 1;
        // update up arrays
        face_wires_i.forEach(face_wire_i => this._geom_arrays.up_wires_faces[face_wire_i] = face_i);
        tris_i.forEach( tri_i => this._geom_arrays.up_tris_faces[tri_i] = face_i );
        // return the numeric index of the face
        return face_i;
    }
    /**
     * Adds a hole to a face and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    private _addFaceHoles(face_i: number, hole_wires_i: number[]): number {
        // get the wires and triangles arrays
        const [face_wires_i, old_face_tris_i]: [number[], number[]] = this._geom_arrays.dn_faces_wirestris[face_i];
        // get the outer wire
        const outer_wire_i: number = face_wires_i[0];
        // get the hole wires
        const all_hole_wires_i: number[] = [];
        if (face_wires_i.length > 1) {
            face_wires_i.slice(1).forEach(wire_i => all_hole_wires_i.push(wire_i));
        }
        hole_wires_i.forEach(wire_i => all_hole_wires_i.push(wire_i));
        // create the triangles
        const new_tris_i: number[] = this._addTris(outer_wire_i, all_hole_wires_i);
        // create the face
        const new_wires_i: number[] = face_wires_i.concat(hole_wires_i);
        const new_face: TFace = [new_wires_i, new_tris_i];
        // update down arrays
        this._geom_arrays.dn_faces_wirestris[face_i] = new_face;
        // update up arrays
        hole_wires_i.forEach(hole_wire_i => this._geom_arrays.up_wires_faces[hole_wire_i] = face_i);
        new_tris_i.forEach( tri_i => this._geom_arrays.up_tris_faces[tri_i] = face_i );
        // delete the old trianges
        for (const old_face_tri_i of old_face_tris_i) {
            for (const vertex_i of this._geom_arrays.dn_tris_verts[old_face_tri_i]) {
                const tris_i: number[] = this._geom_arrays.up_verts_tris[vertex_i];
                const index: number = tris_i.indexOf(old_face_tri_i);
                if (index === -1) {
                    throw new Error('There was a problem with triangulation during hole operation.');
                }
                tris_i.splice(index, 1);
            }
            this._geom_arrays.dn_tris_verts[old_face_tri_i] = null;
        }
        // TODO deal with the old triangles, stored in face_tris_i
        // TODO These are still there and are still pointing up at this face
        // TODO the have to be deleted...

        // return the numeric index of the face
        return face_i;
    }
    // ============================================================================
    // Create geometry
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosition(): number {
        this._geom_arrays.num_posis += 1;
        return this._geom_arrays.num_posis - 1;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_i The position for the point.
     */
    public addPoint(posi_i: number): number {
        // create verts
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i: number = this._geom_arrays.dn_points_verts.push(vert_i) - 1;
        this._geom_arrays.up_verts_points[vert_i] = point_i;
        return point_i;
    }
    /**
     * Adds a new pline entity to the model using numeric indicies.
     * @param posis_i
     */
    public addPline(posis_i: number[], close: boolean = false): number {
        // create verts, edges, wires
        const vert_i_arr: number[] = posis_i.map( posi_i => this._addVertex(posi_i));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        if (close) {
            edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        }
        const wire_i: number = this._addWire(edges_i_arr, close);
        // create pline
        const pline_i: number = this._geom_arrays.dn_plines_wires.push(wire_i) - 1;
        this._geom_arrays.up_wires_plines[wire_i] = pline_i;
        return pline_i;
    }
    /**
     * Adds a new polygon entity to the model using numeric indicies.
     * @param posis_id
     */
    public addPgon(posis_i: number[]): number {
        // create verts, edges, wires, faces
        const vert_i_arr: number[] = posis_i.map( posi_i => this._addVertex(posi_i));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        const wire_i: number = this._addWire(edges_i_arr, true);
        const face_i: number = this._addFace(wire_i);
        // create polygon
        const pgon_i: number = this._geom_arrays.dn_pgons_faces.push(face_i) - 1;
        this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
        return pgon_i;
    }
    /**
     * Adds a new polygon + hole entity to the model using numeric indicies.
     * @param posis_id
     */
    public addPgonWithHole(posis_i: number[], holes_posis_i: number[][]): number {
        // create verts, edges, wire for face
        const vert_i_arr: number[] = posis_i.map( posi_i => this._addVertex(posi_i));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        const wire_i: number = this._addWire(edges_i_arr, true);
        // create verts, edges, wire for holes
        const holes_wires_i: number[] = [];
        for (const hole_posis_i of holes_posis_i) {
            const hole_vert_i_arr: number[] = hole_posis_i.map( posi_i => this._addVertex(posi_i));
            const hole_edges_i_arr: number[] = [];
            for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                hole_edges_i_arr.push( this._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
            }
            hole_edges_i_arr.push( this._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
            const hole_wire_i: number = this._addWire(hole_edges_i_arr, true);
            holes_wires_i.push(hole_wire_i);
        }
        // create the new face with a hole
        const face_i: number = this._addFaceWithHoles(wire_i, holes_wires_i);
        // create polygon
        const pgon_i: number = this._geom_arrays.dn_pgons_faces.push(face_i) - 1;
        this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
        return pgon_i;
    }
    /**
     * Adds a collection and updates the rev array using numeric indicies.
     * @param parent_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public addColl(parent_i: number, points_i: number[], plines_i: number[], pgons_i: number[]): number {
        // create collection
        const coll_i: number = this._geom_arrays.dn_colls_objs.push([parent_i, points_i, plines_i, pgons_i]) - 1;
        for (const point_i of points_i) {
            if (this._geom_arrays.up_points_colls[point_i] === undefined) {
                this._geom_arrays.up_points_colls[point_i] = [coll_i];
            } else {
                this._geom_arrays.up_points_colls[point_i].push(coll_i);
            }
        }
        for (const pline_i of plines_i) {
            if (this._geom_arrays.up_points_colls[pline_i] === undefined) {
                this._geom_arrays.up_points_colls[pline_i] = [coll_i];
            } else {
                this._geom_arrays.up_points_colls[pline_i].push(coll_i);
            }
        }
        for (const pgon_i of pgons_i) {
            if (this._geom_arrays.up_points_colls[pgon_i] === undefined) {
                this._geom_arrays.up_points_colls[pgon_i] = [coll_i];
            } else {
                this._geom_arrays.up_points_colls[pgon_i].push(coll_i);
            }
        }
        return coll_i;
    }
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    public copyPosis(posis_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i)) {
            const xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(posis_i as number);
            const new_posi_i: number = this.addPosition();
            this._geom.model.attribs.add.setPosiCoords(new_posi_i, xyz);
            if (copy_attribs) {
                const attrib_names: string[] = this._geom.model.attribs.query.getAttribNames(EEntType.POSI);
                for (const attrib_name of attrib_names) {
                    const value: TAttribDataTypes =
                        this._geom.model.attribs.query.getAttribValue(EEntType.POSI, attrib_name, posis_i as number) as TAttribDataTypes;
                    this._geom.model.attribs.add.setAttribValue(EEntType.POSI, new_posi_i, attrib_name, value);
                }
            }
            return new_posi_i;
        } else {
            return (posis_i as number[]).map(posi_i => this.copyPosis(posi_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy an object (point, polyline, polygon).
     * TODO copy attribs of topo entities
     * @param ent_type
     * @param index
     * @param copy_posis
     * @param copy_attribs
     */
    public copyObjs(ent_type: EEntType, ent_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(ent_i)) {
            let posis_i: number[];
            switch (ent_type) {
                case EEntType.POINT:
                    posis_i = this._geom.query.navAnyToPosi(ent_type, ent_i as number);
                    const point_i: number = this.addPoint(posis_i[0]);
                    if (copy_attribs) {
                        this._geom.model.attribs.add.copyAttribs(ent_type, ent_i, point_i);
                    }
                    return point_i;
                case EEntType.PLINE:
                    posis_i = this._geom.query.navAnyToPosi(ent_type, ent_i as number);
                    const wire_i: number = this._geom.query.navPlineToWire(ent_i as number);
                    const is_closed: boolean = this._geom.query.istWireClosed(wire_i);
                    const pline_i: number = this.addPline(posis_i, is_closed);
                    if (copy_attribs) {
                        this._geom.model.attribs.add.copyAttribs(ent_type, ent_i, pline_i);
                    }
                    return pline_i;
                case EEntType.PGON:
                    const wires_i: number[] = this._geom.query.navAnyToWire(ent_type, ent_i as number);
                    posis_i = this._geom.query.navAnyToPosi(EEntType.WIRE, wires_i[0] as number);
                    const pgon_i: number = this.addPgon(posis_i);
                    if (copy_attribs) {
                        this._geom.model.attribs.add.copyAttribs(ent_type, ent_i, pgon_i);
                    }
                    return pgon_i;
                default:
                    throw new Error('Cannot copy entity of this type: ' + ent_type);
            }
        } else { // AN array of ent_i
            return (ent_i as number[]).map(one_ent_i => this.copyObjs(ent_type, one_ent_i, copy_attribs)) as number[];
        }
    }
   /**
     * Copy an object (point, polyline, polygon).
     * TODO Copy attribs of object and topo entities
     * @param ent_type
     * @param index
     * @param copy_posis
     * @param copy_attribs
     */
    public copyColls(coll_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(coll_i)) {
            // Make a deep copy of the objects in the collection
            const points_i: number[] = this._geom.query.navCollToPoint(coll_i);
            const res1 = this.copyObjs(EEntType.POINT, points_i, copy_attribs) as number[];
            const plines_i: number[] = this._geom.query.navCollToPline(coll_i);
            const res2 = this.copyObjs(EEntType.PLINE, plines_i, copy_attribs) as number[];
            const pgons_i: number[] = this._geom.query.navCollToPgon(coll_i);
            const res3 = this.copyObjs(EEntType.PGON, pgons_i, copy_attribs) as number[];
            const parent: number = this._geom.query.getCollParent(coll_i);
            // add the new collection
            const new_coll_i: number = this.addColl(parent, res1, res2, res3);
            // copy the attributes from old collection to new collection
            if (copy_attribs) {
                this._geom.model.attribs.add.copyAttribs(EEntType.COLL, coll_i, new_coll_i);
            }
            // return the new collection
            return new_coll_i;
        } else {
            return (coll_i as number[]).map(one_coll_i => this.copyColls(one_coll_i, copy_attribs)) as number[];
        }
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Adds a new polygon entity to the model using numeric indicies.
     * @param posis_id
     */
    public addFaceHoles(face_i: number, posis_i_arr: number[][]): number[] {
        // make the wires for the holes
        const hole_wires_i: number[] = [];
        for (const hole_posis_i of posis_i_arr) {
            const hole_vert_i_arr: number[] = hole_posis_i.map( posi_i => this._addVertex(posi_i));
            const hole_edges_i_arr: number[] = [];
            for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                hole_edges_i_arr.push( this._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
            }
            hole_edges_i_arr.push( this._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
            const hole_wire_i: number = this._addWire(hole_edges_i_arr, true);
            hole_wires_i.push(hole_wire_i);
        }
        // create the holes
        this._addFaceHoles(face_i, hole_wires_i);
        // no need to change either the up or down arrays
        // return the new wires
        return hole_wires_i;
    }
    /**
     * Close a wire
     * @param wire_i The wire to close.
     */
    public closeWire(wire_i: number): void {
        // get the wire start and end verts
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this._geom.query.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this._geom.query.navEdgeToVert(end_edge_i)[1];
        if (start_vert_i === end_vert_i) { return; }
        // add the edge to the model
        const new_edge_i: number = this._addEdge(end_vert_i, start_vert_i);
        // update the down arrays
        this._geom_arrays.dn_wires_edges[wire_i].push(new_edge_i);
        // update the up arrays
        this._geom_arrays.up_edges_wires[new_edge_i] = wire_i;
    }
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * @param wire_i The wire to close.
     */
    public insertVertIntoEdge(edge_i: number, posi_i: number): number {
        const wire_i: number = this._geom.query.navEdgeToWire(edge_i);
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const old_edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        // create one new vertex and one new edge
        const new_vert_i: number = this._addVertex(posi_i);
        const new_edge_i: number = this._addEdge(new_vert_i, old_edge[1]);
        // update the down arrays
        old_edge[1] = new_vert_i;
        wire.splice(wire.indexOf(edge_i), 1, edge_i, new_edge_i);
        // update the up arrays
        this._geom_arrays.up_edges_wires[new_edge_i] = wire_i;
        // return the new edge
        return new_edge_i;
    }
    /**
     * Delete a vertex from a wire
     * @param wire_i The wire to close.
     */
    public deleteVertWire(edge_i: number, posi_i: number): void {
        throw new Error("Not implemented.");
    }
    /**
     * Replace positions
     * @param ent_type
     * @param ent_i
     * @param new_posis_i
     */
    public replacePosis(ent_type: EEntType, ent_i: number, new_posis_i: number[]): void {
        const verts_i: number[] = this._geom.query.navAnyToVert(ent_type, ent_i);
        if (verts_i.length !== new_posis_i.length) {
            throw new Error('Replacing positions operation failed due to incorrect number of positions.');
        }
        for (let i = 0; i < verts_i.length; i++) {
            this._geom_arrays.dn_verts_posis[verts_i[i]] = new_posis_i[i];
        }
    }
    /**
     * Unweld the vertices
     * @param verts_i
     */
    public unweldVerts(verts_i: number[]): number[] {
        const exist_posis_i_map: Map<number, number> = new Map(); // posi_i -> count
        for (const vert_i of verts_i) {
            const posi_i: number = this._geom.query.navVertToPosi(vert_i);
            if (!exist_posis_i_map.has(posi_i)) {
                exist_posis_i_map.set(posi_i, 0);
            }
            const vert_count: number = exist_posis_i_map.get(posi_i);
            exist_posis_i_map.set(posi_i, vert_count + 1);
        }
        // copy positions on the perimeter and make a map
        const old_to_new_posis_i_map: Map<number, number> = new Map();
        exist_posis_i_map.forEach( (vert_count, old_posi_i) => {
            const all_old_verts_i: number[] = this._geom.query.navPosiToVert(old_posi_i);
            const all_vert_count: number = all_old_verts_i.length;
            if (vert_count !== all_vert_count) {
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    const new_posi_i: number = this.copyPosis(old_posi_i, true) as number;
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
            }
        });
        // now go through the geom again and rewire to the new posis
        for (const vert_i of verts_i) {
            const old_posi_i: number = this._geom.query.navVertToPosi(vert_i);
            let new_posi_i: number = old_posi_i;
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
            }
            // update the down arrays
            this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
            // update the up arrays
            if (this._geom_arrays.up_posis_verts[new_posi_i] === undefined) {
                this._geom_arrays.up_posis_verts[new_posi_i] = [];
            }
            this._geom_arrays.up_posis_verts[new_posi_i].push(new_posi_i);
        }
        // return all the new positions
        return Array.from(old_to_new_posis_i_map.values());
    }
}
