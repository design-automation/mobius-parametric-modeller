import { EEntityTypeStr, TTri, TVert, TEdge, TWire, TFace,
    TColl, IGeomData, TPoint, TPline, TPgon, Txyz, IGeomArrays } from './common';
import { triangulate } from '../triangulate/triangulate';
import { GIGeom } from './GIGeom';
import { isArray } from 'util';

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
    public addData(geom_data: IGeomData): void {
        // get lengths before we start adding stuff
        const num_tris: number = this._geom_arrays.dn_tris_verts.length;
        const num_verts: number = this._geom_arrays.dn_verts_posis.length;
        const num_edges: number = this._geom_arrays.dn_edges_verts.length;
        const num_wires: number = this._geom_arrays.dn_wires_edges.length;
        const num_faces: number = this._geom_arrays.dn_faces_wirestris.length;
        const num_points: number = this._geom_arrays.dn_points_verts.length;
        const num_lines: number = this._geom_arrays.dn_plines_wires.length;
        const num_pgons: number = this._geom_arrays.dn_pgons_faces.length;
        const num_colls: number = this._geom_arrays.dn_colls_objs.length;
        // Add triangles to model
        const new_triangles: TTri[] = geom_data.triangles.map(t => t.map(p => p + this._geom.query.numPosis() ) as TTri);
        this._geom_arrays.dn_tris_verts.push( ...new_triangles );
        // Add vertices to model
        const new_verts: TVert[] = geom_data.vertices.map(p => p + this._geom.query.numPosis() as TVert);
        this._geom_arrays.dn_verts_posis.push( ...new_verts );
        // Add edges to model
        const new_edges: TEdge[] = geom_data.edges.map(e => e.map(v => v + num_verts) as TEdge);
        this._geom_arrays.dn_edges_verts.push( ...new_edges );
        // Add wires to model
        const new_wires: TWire[] = geom_data.wires.map(w => w.map(e => e + num_edges) as TWire);
        this._geom_arrays.dn_wires_edges.push( ...new_wires );
        // Add faces to model
        const new_faces: TFace[] = geom_data.faces.map(f => [
            f[0].map( w => w + num_wires),
            f[1].map( t => t + num_tris)
        ] as TFace);
        this._geom_arrays.dn_faces_wirestris.push( ...new_faces );
        // Add points to model
        const new_points: TPoint[] = geom_data.points.map(v => v + num_verts as TPoint);
        this._geom_arrays.dn_points_verts.push( ...new_points );
        // Add lines to model
        const new_lines: TPline[] = geom_data.linestrings.map(w => w + num_wires as TPline);
        this._geom_arrays.dn_plines_wires.push( ...new_lines );
        // Add pgons to model
        const new_pgons: TPgon[] = geom_data.polygons.map(f => f + num_faces as TPgon);
        this._geom_arrays.dn_pgons_faces.push( ...new_pgons );
        // Add collections to model
        const new_colls: TColl[] = geom_data.collections.map(c => [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map( point => point + num_points),
            c[2].map( line => line + num_lines),
            c[3].map( pgon => pgon + num_pgons)
        ] as TColl);
        this._geom_arrays.dn_colls_objs.push( ...new_colls );
        // Update the reverse arrays
        this._updateRevArrays();
        // update the positions array
        this._geom_arrays.num_posis += geom_data.num_positions;
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
            vert_i_arr.forEach( vert_i => {
                if (this._geom_arrays.up_verts_tris[vert_i] === undefined) {
                    this._geom_arrays.up_verts_tris[vert_i] = [];
                }
                this._geom_arrays.up_verts_tris[vert_i].push(tri_i);
            });
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
     * No holes yet... TODO
     * @param wire_i
     */
    private _addTris(wire_i: number): number[] {
        // create the triangles
        const wire_verts_i: number[] = this._geom.query.navAnyToVert(EEntityTypeStr.WIRE, wire_i);
        const wire_posis_i: number[] = wire_verts_i.map( vert_i => this._geom_arrays.dn_verts_posis[vert_i] );
        const wire_coords: Txyz[] = wire_posis_i.map( posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i) );
        const tris_corners: number[][] = triangulate(wire_coords);
        const tris_verts_i: TTri[] = tris_corners.map(tri_corners => tri_corners.map( corner => wire_verts_i[corner] ) as TTri );
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
     * No holes yet... TODO
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
     * Adds a collection and updates the rev array using numeric indicies.
     * @param parent_i
     * @param points_i
     * @param lines_i
     * @param pgons_i
     */
    public addColl(parent_i: number, points_i: number[], lines_i: number[], pgons_i: number[]): number {
        // create collection
        const coll_i: number = this._geom_arrays.dn_colls_objs.push([parent_i, points_i, lines_i, pgons_i]) - 1;
        points_i.forEach( point_i => this._geom_arrays.up_points_colls[point_i] = coll_i);
        lines_i.forEach( line_i => this._geom_arrays.up_points_colls[line_i] = coll_i);
        pgons_i.forEach( pgon_i => this._geom_arrays.up_points_colls[pgon_i] = coll_i);
        return coll_i;
    }
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    public copyPosis(posis_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!isArray(posis_i)) {
            const xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(posis_i as number);
            const new_posi_i: number = this.addPosition();
            this._geom.model.attribs.add.setPosiCoords(new_posi_i, xyz);
            if (copy_attribs) {
                // TODO copy attributes
            }
            return new_posi_i;
        } else {
            return (posis_i as number[]).map(posi_i => this.copyPosis(posi_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy an object (point, polyline, polygon).
     * @param ent_type_str
     * @param index
     * @param copy_posis
     * @param copy_attribs
     */
    public copyObjs(ent_type_str: EEntityTypeStr, indices: number|number[], copy_posis: boolean, copy_attribs: boolean): number|number[] {
        if (!isArray(indices)) {
            const original_posis_i: number[] = this._geom.query.navAnyToPosi(ent_type_str, indices as number);
            let posis_i: number[] = original_posis_i;
            if (copy_posis) {
                posis_i = this.copyPosis(original_posis_i, copy_attribs) as number[];
            }
            switch (ent_type_str) {
                case EEntityTypeStr.POINT:
                    const point_i: number = this.addPoint(posis_i[0]);
                    if (copy_attribs) {
                        // TODO copy attributes
                    }
                    return point_i;
                case EEntityTypeStr.PLINE:
                    const wire_i: number = this._geom.query.navPlineToWire(indices as number);
                    const is_closed: boolean = this._geom.query.istWireClosed(wire_i);
                    const pline_i: number = this.addPline(posis_i, is_closed);
                    if (copy_attribs) {
                        // TODO copy attributes
                    }
                    return pline_i;
                case EEntityTypeStr.PGON:
                    const pgon_i: number = this.addPgon(posis_i);
                    if (copy_attribs) {
                        // TODO copy attributes
                    }
                    return pgon_i;
                default:
                    throw new Error('Cannot copy entity of this type: ' + ent_type_str);
            }
        } else {
            return (indices as number[]).map(index => this.copyObjs(ent_type_str, index, copy_posis, copy_attribs)) as number[];
        }
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
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
}
