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
        // Add posis to the model
        // No need, gets done when we call _updateRevArrays
        // Add vertices to model
        for (const posi_i of geom_data.vertices) {
            if (posi_i !== null) {
                const new_vert: TVert = posi_i + num_posis as TVert;
                this._geom_arrays.dn_verts_posis.push( new_vert );
            } else {
                this._geom_arrays.dn_verts_posis.push( null );
            }
        }
        // Add triangles to model
        for (const verts_i of geom_data.triangles) {
            if (verts_i !== null) {
                const new_triangle: TTri = verts_i.map(v => v + num_verts) as TTri;
                this._geom_arrays.dn_tris_verts.push( new_triangle );
            } else {
                this._geom_arrays.dn_tris_verts.push( null );
            }
        }
        // Add edges to model
        for (const verts_i of geom_data.edges) {
            if (verts_i !== null) {
                const new_edge: TEdge = verts_i.map(v => v + num_verts) as TEdge;
                this._geom_arrays.dn_edges_verts.push( new_edge );
            } else {
                this._geom_arrays.dn_edges_verts.push( null );
            }
        }
        // Add wires to model
        for (const edges_i of geom_data.wires) {
            if (edges_i !== null) {
                const new_wire: TWire = edges_i.map(e => e + num_edges) as TWire;
                this._geom_arrays.dn_wires_edges.push( new_wire );
            } else {
                this._geom_arrays.dn_wires_edges.push( null );
            }
        }
        // Add faces to model
        for (const wires_tris_i of geom_data.faces) {
            if (wires_tris_i !== null) {
                const new_face: TFace = [
                    wires_tris_i[0].map( w => w + num_wires),
                    wires_tris_i[1].map( t => t + num_tris)
                ] as TFace;
                this._geom_arrays.dn_faces_wirestris.push( new_face );
            } else {
                this._geom_arrays.dn_faces_wirestris.push( null );
            }
        }
        // Add points to model
        for (const vert_i of geom_data.points) {
            if (vert_i !== null) {
                const new_point: TPoint = vert_i + num_verts as TPoint;
                this._geom_arrays.dn_points_verts.push( new_point );
            } else {
                this._geom_arrays.dn_points_verts.push( null );
            }
        }
        // Add lines to model
        for (const wire_i of geom_data.polylines) {
            if (wire_i !== null) {
                const new_pline: TPline = wire_i + num_wires as TPline;
                this._geom_arrays.dn_plines_wires.push( new_pline );
            } else {
                this._geom_arrays.dn_plines_wires.push( null );
            }
        }
        // Add pgons to model
        for (const face_i of geom_data.polygons) {
            if (face_i !== null) {
                const new_pgon: TPgon = face_i + num_faces as TPgon;
                this._geom_arrays.dn_pgons_faces.push( new_pgon );
            } else {
                this._geom_arrays.dn_pgons_faces.push( null );
            }
        }
        // Add collections to model
        for (const coll of geom_data.collections) {
            if (coll !== null) {
                const parent: number = (coll[0] === -1) ? -1 : coll[0] + num_colls;
                const coll_points_i: number[] = coll[1].map( point => point + num_points);
                const coll_plines_i: number[] = coll[2].map( line => line + num_plines);
                const coll_pgons_i: number[] = coll[3].map( pgon => pgon + num_pgons);
                const new_coll: TColl = [parent, coll_points_i, coll_plines_i, coll_pgons_i];
                this._geom_arrays.dn_colls_objs.push( new_coll );
            } else {
                this._geom_arrays.dn_colls_objs.push( null );
            }
        }

        // Update the reverse arrays
        this._updateRevArrays(num_posis + geom_data.num_positions);

        // return data
        const num_new_posis: number = this._geom_arrays.up_posis_verts.length - num_posis;
        const num_new_points: number = this._geom_arrays.dn_points_verts.length - num_points;
        const num_new_plines: number = this._geom_arrays.dn_plines_wires.length - num_plines;
        const num_new_pgons: number = this._geom_arrays.dn_pgons_faces.length - num_pgons;
        const num_new_colls: number = this._geom_arrays.dn_colls_objs.length - num_colls;
        return {
            posis_i:  Array.from(Array(num_new_posis).keys()).map(k => k +  num_posis),
            points_i: Array.from(Array(num_new_points).keys()).map(k => k + num_points),
            plines_i: Array.from(Array(num_new_plines).keys()).map(k => k + num_plines),
            pgons_i:  Array.from(Array(num_new_pgons).keys()).map(k => k +  num_pgons),
            colls_i:  Array.from(Array(num_new_colls).keys()).map(k => k +  num_colls)
        };
    }
    // ============================================================================
    // Private method to update the reverse arrays after addData()
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays(num_posis: number) {
        // posis->verts
        this._geom_arrays.up_posis_verts = [];
        this._geom_arrays.dn_verts_posis.forEach( (posi_i, vert_i) => {
            if (posi_i !== null) {
                if (this._geom_arrays.up_posis_verts[posi_i] === undefined) {
                    this._geom_arrays.up_posis_verts[posi_i] = [];
                }
                this._geom_arrays.up_posis_verts[posi_i].push(vert_i);
            }
        });
        // fill any undefined posis with epty arrays
        for (let posi_i = 0; posi_i < num_posis; posi_i++) {
            if (this._geom_arrays.up_posis_verts[posi_i] === undefined) {
                this._geom_arrays.up_posis_verts[posi_i] = [];
            }
        }
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
        this._geom_arrays.dn_wires_edges.forEach( (edge_i_arr, wire_i) => {
            if (edge_i_arr !== null) {
                edge_i_arr.forEach( edge_i => {
                    this._geom_arrays.up_edges_wires[edge_i] = wire_i;
                });
            }
        });
        // wires->faces, tris->faces, faces->wirestris
        this._geom_arrays.up_wires_faces = [];
        this._geom_arrays.up_tris_faces = [];
        this._geom_arrays.dn_faces_wirestris.forEach( (face, face_i) => {
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
        this._geom_arrays.dn_points_verts.forEach( (vert_i, point_i) => {
            if (vert_i !== null) {
                this._geom_arrays.up_verts_points[vert_i] = point_i;
            }
        });
        this._geom_arrays.up_wires_plines = [];
        this._geom_arrays.dn_plines_wires.forEach( (wire_i, line_i) => {
            if (wire_i !== null) {
                this._geom_arrays.up_wires_plines[wire_i] = line_i;
            }
        });
        this._geom_arrays.up_faces_pgons = [];
        this._geom_arrays.dn_pgons_faces.forEach( (face_i, pgon_i) => {
            if (face_i !== null) {
                this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
            }
        });
        // collections of points, polylines, polygons
        this._geom_arrays.up_points_colls = [];
        this._geom_arrays.up_plines_colls = [];
        this._geom_arrays.up_pgons_colls = [];
        this._geom_arrays.dn_colls_objs.forEach( (coll, coll_i) => {
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
    }
    // ============================================================================
    // Private methods to create the topological entities
    // ============================================================================
    /**
     * Adds a position and updates the arrays.
     */
    private _addPosi(): number {
        // in this case, there are no down arrays
        // because posis are the bottom of the hierarchy
        // update up arrays
        const posi_i: number = this._geom_arrays.up_posis_verts.push([]) - 1;
        // return the numeric index of the posi
        return posi_i;
    }
    /**
     * Adds a vertex and updates the arrays.
     * @param posi_i
     */
    private _addVertex(posi_i: number): number {
        // update down arrays
        const vert_i: number = this._geom_arrays.dn_verts_posis.push(posi_i) - 1;
        // update up arrays
            // if (this._geom_arrays.up_posis_verts[posi_i] === undefined) {
            //     this._geom_arrays.up_posis_verts[posi_i] = [];
            // }
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
        // return an array of numeric indices of the triangles
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
    // Add geometry
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosi(): number {
        // create posi
        const posi_i: number = this._addPosi();
        return posi_i;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_i The position for the point.
     */
    public addPoint(posi_i: number): number {
        // create vert
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i: number = this._geom_arrays.dn_points_verts.push(vert_i) - 1;
        this._geom_arrays.up_verts_points[vert_i] = point_i;
        return point_i;
    }
    /**
     * Adds a new pline entity to the model using numeric indices.
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
     * Adds a new polygon + hole entity to the model using numeric indices.
     * @param posis_id
     */
    public addPgon(posis_i: number[], holes_posis_i?: number[][]): number {
        const has_holes: boolean = (holes_posis_i !== undefined) && (holes_posis_i.length) ? true : false ;
        // create verts, edges, wire for face
        const vert_i_arr: number[] = posis_i.map( posi_i => this._addVertex(posi_i));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        const wire_i: number = this._addWire(edges_i_arr, true);
        let face_i: number;
        if (has_holes) {
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
            face_i = this._addFaceWithHoles(wire_i, holes_wires_i);
        } else {
            face_i = this._addFace(wire_i);
        }
        // create polygon
        const pgon_i: number = this._geom_arrays.dn_pgons_faces.push(face_i) - 1;
        this._geom_arrays.up_faces_pgons[face_i] = pgon_i;
        return pgon_i;
    }
    /**
     * Adds a collection and updates the rev array using numeric indices.
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
    // ============================================================================
    // Copy geometry
    // ============================================================================
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    public copyPosis(posis_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i)) {
            const posi_i: number = posis_i as number;
            const xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(posi_i);
            const new_posi_i: number = this.addPosi();
            this._geom.model.attribs.add.setPosiCoords(new_posi_i, xyz);
            if (copy_attribs) {
                const attrib_names: string[] = this._geom.model.attribs.query.getAttribNames(EEntType.POSI);
                for (const attrib_name of attrib_names) {
                    const value: TAttribDataTypes =
                        this._geom.model.attribs.query.getAttribValue(EEntType.POSI, attrib_name, posis_i) as TAttribDataTypes;
                    this._geom.model.attribs.add.setAttribValue(EEntType.POSI, new_posi_i, attrib_name, value);
                }
            }
            return new_posi_i;
        } else {
            return (posis_i as number[]).map(posi_i => this.copyPosis(posi_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy points.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPoints(points_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(points_i)) {
            const old_point_i: number = points_i as number;
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.POINT, old_point_i);
            const new_point_i: number = this.addPoint(posis_i[0]);
            if (copy_attribs) {
                this._geom.model.attribs.add.copyAttribs(EEntType.POINT, old_point_i, new_point_i);
            }
            return new_point_i;
        } else { // An array of ent_i
            return (points_i as number[]).map(point_i => this.copyPoints(point_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy plines.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPlines(plines_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(plines_i)) {
            const old_pline_i: number = plines_i as number;
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.PLINE, old_pline_i);
            const wire_i: number = this._geom.query.navPlineToWire(old_pline_i);
            const is_closed: boolean = this._geom.query.istWireClosed(wire_i);
            const new_pline_i: number = this.addPline(posis_i, is_closed);
            if (copy_attribs) {
                this._geom.model.attribs.add.copyAttribs(EEntType.PLINE, old_pline_i, new_pline_i);
            }
            return new_pline_i;
        } else { // An array of ent_i
            return (plines_i as number[]).map(pline_i => this.copyPlines(pline_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy polygons.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPgons(pgons_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(pgons_i)) {
            const old_pgon_i: number = pgons_i as number;
            const wires_i: number[] = this._geom.query.navAnyToWire(EEntType.PGON, old_pgon_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.WIRE, wires_i[0] as number);
            let new_pgon_i: number;
            if (wires_i.length === 1) {
                new_pgon_i = this.addPgon(posis_i);
            } else {
                const holes_posis_i: number[][] = [];
                for (let i = 1; i < wires_i.length; i++) {
                    const hole_posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.WIRE, wires_i[i] as number);
                    holes_posis_i.push(hole_posis_i);
                }
                new_pgon_i = this.addPgon(posis_i, holes_posis_i);
            }
            if (copy_attribs) {
                this._geom.model.attribs.add.copyAttribs(EEntType.PGON, old_pgon_i, new_pgon_i);
            }
            return new_pgon_i;
        } else { // AN array of ent_i
            return (pgons_i as number[]).map(pgon_i => this.copyPgons(pgon_i, copy_attribs)) as number[];
        }
    }
   /**
     * Copy a collection
     * TODO Copy attribs of object and topo entities
     * @param ent_type
     * @param index
     * @param copy_posis
     * @param copy_attribs
     */
    public copyColls(colls_i: number|number[], copy_attribs: boolean): number|number[] {
        // make copies
        if (!Array.isArray(colls_i)) {
            const old_coll_i: number = colls_i as number;
            // make a deep copy of the objects in the collection
            const points_i: number[] = this._geom.query.navCollToPoint(old_coll_i);
            const res1 = this.copyPoints(points_i, copy_attribs) as number[];
            const plines_i: number[] = this._geom.query.navCollToPline(old_coll_i);
            const res2 = this.copyPlines(plines_i, copy_attribs) as number[];
            const pgons_i: number[] = this._geom.query.navCollToPgon(old_coll_i);
            const res3 = this.copyPgons(pgons_i, copy_attribs) as number[];
            const parent: number = this._geom.query.getCollParent(old_coll_i);
            // add the new collection
            const new_coll_i: number = this.addColl(parent, res1, res2, res3);
            // copy the attributes from old collection to new collection
            if (copy_attribs) {
                this._geom.model.attribs.add.copyAttribs(EEntType.COLL, old_coll_i, new_coll_i);
            }
            // return the new collection
            return new_coll_i;
        } else {
            return (colls_i as number[]).map(coll_i => this.copyColls(coll_i, copy_attribs)) as number[];
        }
    }
    // ============================================================================
    // Delete geometry
    // ============================================================================
    /**
     * Del all unused posis in the model.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delUnusedPosis(posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // loop
        const deleted_posis_i: number[] = [];
        for (const posi_i of posis_i) {
            // update up arrays
            const verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
            if (verts_i.length === 0) { // only delete posis with no verts
                this._geom_arrays.up_posis_verts[posi_i] = null;
                deleted_posis_i.push(posi_i);
            }
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
    }
    /**
     * Del posis.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delPosis(posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // get all objects that use these positions and delete them
        // if (del_objs) {
        //     const points_i: number[] = [];
        //     const plines_i: number[] = [];
        //     const pgons_i: number[] = [];
        //     for (const posi_i of posis_i) {
        //         const found_points_i: number[] = this._geom.query.navAnyToPoint(EEntType.POSI, posi_i);
        //         for (const found_point_i of found_points_i) {
        //             points_i.push(found_point_i);
        //         }
        //         const found_plines_i: number[] = this._geom.query.navAnyToPline(EEntType.PLINE, posi_i);
        //         for (const found_pline_i of found_plines_i) {
        //             plines_i.push(found_pline_i);
        //         }
        //         const found_pgons_i: number[] = this._geom.query.navAnyToPgon(EEntType.PGON, posi_i);
        //         for (const found_pgon_i of found_pgons_i) {
        //             pgons_i.push(found_pgon_i);
        //         }
        //     }
        //     // this.delPoints(points_i, false); // TODO what about positions?
        //     // this.delPlines(plines_i, false); // TODO what about positions?
        //     // this.delPgons(pgons_i, false); // TODO what about positions?

        // }
        // loop
        const deleted_posis_i: number[] = [];
        for (const posi_i of posis_i) {
            // update up arrays
            const verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
            if (verts_i.length === 0) { // only delete posis with no verts
                this._geom_arrays.up_posis_verts[posi_i] = null;
                deleted_posis_i.push(posi_i);
            }
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    public delPoints(points_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POINT, points_i);
        // create array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        if (!points_i.length) { return; }
        // loop
        for (const point_i of points_i) {
            // first get all the arrays so we dont break navigation
            const verts_i: number[] = this._geom.query.navAnyToVert(EEntType.POINT, point_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.POINT, point_i);
            // delete everything by setting it to null
            verts_i.forEach( vert_i => {
                this._geom_arrays.dn_verts_posis[vert_i] = null;
                this._geom_arrays.up_verts_points[vert_i] = null;
            });
            // clean up posis up arrays point to verts that may have been deleted
            for (const posi_i of posis_i) {
                const other_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
                // loop through deleted verts
                for (const vert_i of verts_i) {
                    const i: number = other_verts_i.indexOf(vert_i);
                    if (i !== -1) { other_verts_i.splice(i, 1); }
                }
            }
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posis_i);
            }
            // down arrays
            this._geom_arrays.dn_points_verts[point_i] = null;
        }
    }
    /**
     * Del plines.
     * Pline attributes will also be deleted.
     * @param plines_i
     */
    public delPlines(plines_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.PLINE, plines_i);
        // create array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        if (!plines_i.length) { return; }
        // loop
        for (const pline_i of plines_i) {
            // first get all the arrays so we dont break navigation
            const wires_i: number[] = this._geom.query.navAnyToWire(EEntType.PLINE, pline_i);
            const edges_i: number[] = this._geom.query.navAnyToEdge(EEntType.PLINE, pline_i);
            const verts_i: number[] = this._geom.query.navAnyToVert(EEntType.PLINE, pline_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.PLINE, pline_i);
            // delete everything by setting it to null
            wires_i.forEach( wire_i => {
                this._geom_arrays.dn_wires_edges[wire_i] = null;
                this._geom_arrays.up_wires_plines[wire_i] = null;
            });
            edges_i.forEach( edge_i => {
                this._geom_arrays.dn_edges_verts[edge_i] = null;
                this._geom_arrays.up_edges_wires[edge_i] = null;
            });
            verts_i.forEach( vert_i => {
                this._geom_arrays.dn_verts_posis[vert_i] = null;
                this._geom_arrays.up_verts_edges[vert_i] = null;
            });
            // clean up posis up arrays point to verts that may have been deleted
            for (const posi_i of posis_i) {
                const other_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
                // loop through deleted verts
                for (const vert_i of verts_i) {
                    const i: number = other_verts_i.indexOf(vert_i);
                    if (i !== -1) { other_verts_i.splice(i, 1); }
                }
            }
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posis_i);
            }
            // posis_i.forEach( posi_i => this._geom_arrays.dn_faces_wirestris[posi_i] = null );
            // down arrays
            this._geom_arrays.dn_plines_wires[pline_i] = null;
        }
    }
    /**
     * Del pgons.
     * Pgon attributes will also be deleted.
     * @param pgons_i
     */
    public delPgons(pgons_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.PGON, pgons_i);
        // create array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        if (!pgons_i.length) { return; }
        // loop
        for (const pgon_i of pgons_i) {
            // first get all the arrays so we dont break navigation
            const faces_i: number[] = this._geom.query.navAnyToFace(EEntType.PGON, pgon_i);
            const wires_i: number[] = this._geom.query.navAnyToWire(EEntType.PGON, pgon_i);
            const edges_i: number[] = this._geom.query.navAnyToEdge(EEntType.PGON, pgon_i);
            const verts_i: number[] = this._geom.query.navAnyToVert(EEntType.PGON, pgon_i);
            const tris_i: number[] = this._geom.query.navAnyToTri(EEntType.PGON, pgon_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.PGON, pgon_i);
            // delete everything by setting it to null
            faces_i.forEach( face_i => {
                this._geom_arrays.dn_faces_wirestris[face_i] = null;
                this._geom_arrays.up_faces_pgons[face_i] = null;
             });
            wires_i.forEach( wire_i => {
                this._geom_arrays.dn_wires_edges[wire_i] = null;
                this._geom_arrays.up_wires_faces[wire_i] = null;
            });
            edges_i.forEach( edge_i => {
                this._geom_arrays.dn_edges_verts[edge_i] = null;
                this._geom_arrays.up_edges_wires[edge_i] = null;

            });
            verts_i.forEach( vert_i => {
                this._geom_arrays.dn_verts_posis[vert_i] = null;
                this._geom_arrays.up_verts_edges[vert_i] = null;
                this._geom_arrays.up_verts_tris[vert_i] = null;
            });
            tris_i.forEach( tri_i => {
                this._geom_arrays.dn_tris_verts[tri_i] = null;
                this._geom_arrays.up_tris_faces[tri_i] = null;
            });
            // clean up, posis up arrays point to verts that may have been deleted
            for (const posi_i of posis_i) {
                const other_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
                // loop through deleted verts
                for (const vert_i of verts_i) {
                    const i: number = other_verts_i.indexOf(vert_i);
                    if (i !== -1) { other_verts_i.splice(i, 1); }
                    if (!other_verts_i.length) { break; }
                }
            }
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posis_i);
            }
            // down arrays
            this._geom_arrays.dn_pgons_faces[pgon_i] = null;
        }
    }
    /**
     * Delete a collection.
     * Collection attributes will also be deleted.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delColls(colls_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.COLL, colls_i);
        // create array
        colls_i = (Array.isArray(colls_i)) ? colls_i : [colls_i];
        if (!colls_i.length) { return; }
        // loop
        for (const coll_i of colls_i) {
            // up arrays
            const points_i: number[] = this._geom_arrays.dn_colls_objs[coll_i][1];
            points_i.forEach(point_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_points_colls[point_i];
                other_colls_i.splice(other_colls_i.indexOf(coll_i), 1);
            });
            const plines_i: number[] = this._geom_arrays.dn_colls_objs[coll_i][2];
            plines_i.forEach(pline_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_plines_colls[pline_i];
                other_colls_i.splice(other_colls_i.indexOf(coll_i), 1);
            });
            const pgons_i: number[] = this._geom_arrays.dn_colls_objs[coll_i][3];
            pgons_i.forEach(pgon_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_pgons_colls[pgon_i];
                other_colls_i.splice(other_colls_i.indexOf(coll_i), 1);
            });
            // down arrays
            this._geom_arrays.dn_colls_objs[coll_i] = null;
        }
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Adds a new polygon entity to the model using numeric indices.
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
     * Open a wire, by deleting an edge
     * @param wire_i The wire to close.
     */
    public openWire(wire_i: number): void {
        // This deletes an edge
        throw new Error('Not implemented');
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
     * TODO copy attributes onto new positions?
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
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * The attributes ... TODO
     */
    public reverse(wire_i: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.reverse();
        // reverse the edges
        for (const edge_i of wire) {
            const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
            edge.reverse();
        }
        // if this is a face, reverse the triangles
        if (this._geom_arrays.up_wires_faces[wire_i] !== undefined) {
            const face_i: number = this._geom_arrays.up_wires_faces[wire_i];
            const face: TFace = this._geom_arrays.dn_faces_wirestris[face_i];
            for (const tri_i of face[1]) {
                const tri: TTri = this._geom_arrays.dn_tris_verts[tri_i];
                tri.reverse();
            }
        }
    }
    /**
     * Shifts the edges of a wire.
     * The attributes ... TODO
     */
    public shift(wire_i: number, offset: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.unshift.apply( wire, wire.splice( offset, wire.length ) );
    }
}
