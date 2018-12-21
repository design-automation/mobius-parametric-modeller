import { TTri, TVert, TEdge, TWire, TFace, TColl, IGeomData, TPoint, TLine, TPgon, TCoord } from './GIJson';
import { GIModel } from './GIModel';
import { TId, EEntityTypeStr, idBreak, idIndex, idIndicies } from './GICommon';
import { triangulate } from '../triangulate/triangulate';

/**
 * Class for geometry.
 */
export class GIGeom {
    private model: GIModel;
    // positions
    private _num_posis = 0; // The total number of positions in the model.
    private _rev_posis_verts: number[][] = []; // 1 position -> many vertices
    // triangles
    private _tris: TTri[] = []; // 1 triangles -> 3 vertices
    private _rev_tris_faces: number[] = []; // 1 tri -> 1 face
    // vertices
    private _verts: TVert[] = []; // many vertices -> 1 position
    private _rev_verts_edges: number[] = []; // 1 vertex -> 1 edge
    private _rev_verts_tris: number[] = []; // 1 vertex -> 1 tri // TODO add code to update this
    private _rev_verts_points: number[] = []; // 1 vertex -> 1 point
    // edges
    private _edges: TEdge[] = []; // 1 edge -> 2 vertices
    private _rev_edges_wires: number[] = []; // 1 edge -> 1 wire
    // wires
    private _wires: TWire[] = []; // 1 wire -> many edges
    private _rev_wires_faces: number[] = []; // 1 wire -> 1 face
    private _rev_wires_lines: number[] = []; // 1 wire -> 1 line
    // faces
    private _faces: TFace[] = []; // 1 face -> many wires
    private _rev_faces_pgons: number[] = []; // 1 face -> 1 pgon
    // points
    private _points: TPoint[] = []; // 1 point -> 1 vertex
    private _rev_points_colls: number[] = []; // 1 point -> 1 collection
    // polylines
    private _lines: TLine[] = []; // 1 polyline -> 1 wire
    private _rev_lines_colls: number[] = []; // 1 line -> 1 collection
    // polygons
    private _pgons: TPgon[] = []; // 1 polygon -> 1 face
    private _rev_pgons_colls: number[] = []; // 1 pgon -> 1 collection
    // collections
    private _colls: TColl[] = []; // 1 collection -> many points, many polylines, many polygons
    // all arrays
    private _geom_arrs = {
        _t: this._tris,
        _v: this._verts,
        _e: this._edges,
        _w: this._wires,
        _f: this._faces,
        pt: this._points,
        pl: this._lines,
        pg: this._pgons,
        co: this._colls
    };
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(model: GIModel) {
        this.model = model;
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IGeomData {
        return {
            num_positions: this._num_posis,
            triangles: this._tris,
            vertices: this._verts,
            edges: this._edges,
            wires: this._wires,
            faces: this._faces,
            points: this._points,
            linestrings: this._lines,
            polygons: this._pgons,
            collections: this._colls
        };
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param geom_data The JSON data
     */
    public addData(geom_data: IGeomData): void {
        // get lengths before we start adding stuff
        const num_tris: number = this._tris.length;
        const num_verts: number = this._verts.length;
        const num_edges: number = this._edges.length;
        const num_wires: number = this._wires.length;
        const num_faces: number = this._faces.length;
        const num_points: number = this._points.length;
        const num_lines: number = this._lines.length;
        const num_pgons: number = this._pgons.length;
        const num_colls: number = this._colls.length;
        // Add triangles to model
        const new_triangles: TTri[] = geom_data.triangles.map(t => t.map(p => p + this._num_posis ) as TTri);
        this._tris.push( ...new_triangles );
        // Add vertices to model
        const new_verts: TVert[] = geom_data.vertices.map(p => p + this._num_posis as TVert);
        this._verts.push( ...new_verts );
        // Add edges to model
        const new_edges: TEdge[] = geom_data.edges.map(e => e.map(v => v + num_verts) as TEdge);
        this._edges.push( ...new_edges );
        // Add wires to model
        const new_wires: TWire[] = geom_data.wires.map(w => w.map(e => e + num_edges) as TWire);
        this._wires.push( ...new_wires );
        // Add faces to model
        const new_faces: TFace[] = geom_data.faces.map(f => [
            f[0].map( w => w + num_wires),
            f[1].map( t => t + num_tris)
        ] as TFace);
        this._faces.push( ...new_faces );
        // Add points to model
        const new_points: TPoint[] = geom_data.points.map(v => v + num_verts as TPoint);
        this._points.push( ...new_points );
        // Add lines to model
        const new_lines: TLine[] = geom_data.linestrings.map(w => w + num_wires as TLine);
        this._lines.push( ...new_lines );
        // Add pgons to model
        const new_pgons: TPgon[] = geom_data.polygons.map(f => f + num_faces as TPgon);
        this._pgons.push( ...new_pgons );
        // Add collections to model
        const new_colls: TColl[] = geom_data.collections.map(c => [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map( point => point + num_points),
            c[2].map( line => line + num_lines),
            c[3].map( pgon => pgon + num_pgons)
        ] as TColl);
        this._colls.push( ...new_colls );
        // Update the reverse arrays
        this._updateRevArrays();
        // update the positions array
        this._num_posis += geom_data.num_positions;
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays() {
        // positions
        this._rev_posis_verts = [];
        this._verts.forEach( (pos_i, vert_i) => {
            if (this._rev_posis_verts[pos_i] === undefined) {
                this._rev_posis_verts[pos_i] = [];
            }
            this._rev_posis_verts[pos_i].push(vert_i);
        });
        // tris, edges, wires, faces
        this._rev_verts_tris = [];
        this._tris.forEach( (vert_i_arr, tri_i) => {
            vert_i_arr.forEach( vert_i => {
                this._rev_verts_tris[vert_i] = tri_i;
            });
        });
        this._rev_verts_edges = [];
        this._edges.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( vert_i => {
                this._rev_verts_edges[vert_i] = edge_i;
            });
        });
        this._rev_edges_wires = [];
        this._wires.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this._rev_edges_wires[edge_i] = wire_i;
            });
        });
        this._rev_wires_faces = [];
        this._rev_tris_faces = [];
        this._faces.forEach( ([wire_i_arr, tri_i_arr], face_i) => {
            wire_i_arr.forEach( wire_i => {
                this._rev_wires_faces[wire_i] = face_i;
            });
            tri_i_arr.forEach( tri_i => {
                this._rev_tris_faces[tri_i] = face_i;
            });
        });
        // points, lines, polygons
        this._rev_verts_points = [];
        this._points.forEach( (vert_i, point_i) => {
            this._rev_verts_points[vert_i] = point_i;
        });
        this._rev_wires_lines = [];
        this._lines.forEach( (wire_i, line_i) => {
            this._rev_wires_lines[wire_i] = line_i;
        });
        this._rev_faces_pgons = [];
        this._pgons.forEach( (face_i, pgon_i) => {
            this._rev_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, linestrings, polygons
        this._rev_points_colls = [];
        this._rev_lines_colls = [];
        this._rev_pgons_colls = [];
        this._colls.forEach( ([parent, point_i_arr, line_i_arr, pgon_i_arr], coll_i) => {
            point_i_arr.forEach( point_i => {
                this._rev_points_colls[point_i] = coll_i;
            });
            line_i_arr.forEach( line_i => {
                this._rev_lines_colls[line_i] = coll_i;
            });
            pgon_i_arr.forEach( pgon_i => {
                this._rev_pgons_colls[pgon_i] = coll_i;
            });
        });
    }
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    public navVertToPosi(vert_i: number): number {
        return this._verts[vert_i];
    }
    public navTriToVert(tri_i: number): number[] {
        return this._tris[tri_i];
    }
    public navEdgeToVert(edge_i: number): number[] {
        return this._edges[edge_i];
    }
    public navWireToEdge(wire_i: number): number[] {
        return this._wires[wire_i];
    }
    public navFaceToWire(face_i: number): number[] {
        return this._faces[face_i][0];
    }
    public navFaceToTri(face_i: number): number[] {
        return this._faces[face_i][1];
    }
    public navPointToVert(point_i: number): number {
        return this._points[point_i];
    }
    public navLineToWire(line_i: number): number {
        return this._lines[line_i];
    }
    public navPgonToFace(pgon_i: number): number {
        return this._pgons[pgon_i];
    }
    public navCollToPoint(coll_i: number): number[] {
        return this._colls[coll_i][1]; // coll points
    }
    public navCollToLine(coll_i: number): number[] {
        return this._colls[coll_i][2]; // coll lines
    }
    public navCollToPgon(coll_i: number): number[] {
        return this._colls[coll_i][3]; // coll pgons
    }
    public navCollToColl(coll_i: number): number {
        return coll_i[0]; // coll parent
    }
    // jump all way down to vertices
    public navLineToVert(line_i: number): number[] {
        const wire_i: number = this._lines[line_i];
        return this._getWireVerts(wire_i);
    }
    public navPgonToVert(pgon_i: number): number[][] {
        const face_i: number = this._pgons[pgon_i];
        const wires_i: number[] = this._faces[face_i][0];
        return wires_i.map( wire_i => this._getWireVerts(wire_i) );
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    public navPosiToVert(posi_i: number): number[] {
        return this._rev_posis_verts[posi_i];
    }
    public navVertToTri(vert_i: number): number {
        return this._rev_verts_tris[vert_i];
    }
    public navVertToEdge(vert_i: number): number {
        return this._rev_verts_edges[vert_i];
    }
    public navTriToFace(tri_i: number): number {
        return this._rev_tris_faces[tri_i];
    }
    public navEdgeToWire(edge_i: number): number {
        return this._rev_edges_wires[edge_i];
    }
    public navWireToFace(wire_i: number): number {
        return this._rev_wires_faces[wire_i];
    }
    public navVertToPoint(vert_i: number): number {
        return this._rev_verts_points[vert_i];
    }
    public navWireToLine(wire_i: number): number {
        return this._rev_wires_lines[wire_i];
    }
    public navFaceToPgon(face: number): number {
        return this._rev_faces_pgons[face];
    }
    public navPointToColl(point_i: number): number {
        return this._rev_points_colls[point_i];
    }
    public navLineToColl(line_i: number): number {
        return this._rev_lines_colls[line_i];
    }
    public navPgonToColl(pgon_i: number): number {
        return this._rev_pgons_colls[pgon_i];
    }
    // ============================================================================
    // Create the topological entities, these methods are never public
    // ============================================================================
    /**
     * Adds a vertex and updates the rev array.
     * @param posi_i
     */
    private _addVertex(posi_i: number): number {
        const vert_i: number = this._verts.push(posi_i) - 1;
        if (this._rev_posis_verts[posi_i] === undefined) {
            this._rev_posis_verts[posi_i] = [];
        }
        this._rev_posis_verts[posi_i].push(vert_i);
        return vert_i;
    }
    /**
     * Adds an edge and updates the rev array.
     * @param vert_i1
     * @param vert_i2
     */
    private _addEdge(vert_i1: number, vert_i2: number): number {
        const edge_i: number = this._edges.push([vert_i1, vert_i2]) - 1;
        this._rev_verts_edges[vert_i1] = edge_i;
        this._rev_verts_edges[vert_i2] = edge_i;
        return edge_i;
    }
    /**
     * Adds a wire and updates the rev array.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    private _addWire(edges_i: number[], close: boolean = false): number {
        const wire_i: number = this._wires.push(edges_i) - 1;
        edges_i.forEach( edge_i => this._rev_edges_wires[edge_i] = wire_i );
        return wire_i;
    }
    /**
     * Adds a face and updates the rev array.
     * Wires are assumed to be closed!
     * No holes yet... TODO
     * @param wire_i
     */
    private _addFace(wire_i: number): number {
        // create the triangles
        const wire_verts_i: number[] = this._getWireVerts(wire_i);
        const wire_posis_i: number[] = wire_verts_i.map( vert_i => this._verts[vert_i] );
        const wire_coords: TCoord[] = wire_posis_i.map( posi_i => this.model.attribs().getPosiCoordByIndex(posi_i) );
        const tris_corners: number[][] = triangulate(wire_coords);
        const tris_posis_i: TTri[] = tris_corners.map(tri_corners => tri_corners.map( corner => wire_verts_i[corner] ) as TTri );
        const tris_i: number[] = tris_posis_i.map(tri_posis_i => this._tris.push(tri_posis_i) - 1);
        // create the face
        const face: TFace = [[wire_i], tris_i];
        const face_i: number = this._faces.push(face);
        return face_i;
    }
    /**
     * Helper function to get check if wire is closed
     */
    private _istWireClosed(wire_i: number): boolean {
        const edges_i: number[] = this._wires[wire_i];
        return this._edges[edges_i[0]][0] === this._edges[edges_i[edges_i.length - 1]][1];
    }
    /**
     * Helper function to get the vertices of a wire
     * The function check is the wire is closed and returns correct number of vertices.
     * For a cloased wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     */
    private _getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this._wires[wire_i];
        const verts_i: number[] = edges_i.map(edge_i => this._edges[edge_i][0]);
        if (this._edges[edges_i[0]][0] !== this._edges[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this._edges[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
    }
    // ============================================================================
    // Create geometry, all these public methods return an string ID
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosition(): TId {
        this._num_posis += 1;
        return EEntityTypeStr.POSI + (this._num_posis - 1);
    }
    /**
     * Adds a new polygon entity to the model.
     * @param posi_id
     */
    public addPoint(posi_id: TId, close: boolean = false): TId {
        const posi_i: number = idIndex(posi_id);
        const point_i: number = this.addPointByIndex(posi_i);
        return EEntityTypeStr.POINT + point_i;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_id The position for the point.
     */
    public addPointByIndex(posi_i: number): number {
        // create verts
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i: number = this._points.push(vert_i) - 1;
        this._rev_verts_points[vert_i] = point_i;
        return point_i;
    }
    /**
     * Adds a new pline entity to the model.
     * @param posis_id
     */
    public addPline(posis_id: TId[], close: boolean = false): TId {
        const posis_i: number[] = idIndicies(posis_id);
        const pline_i: number = this.addPlineByIndex(posis_i);
        return EEntityTypeStr.LINE + pline_i;
    }
    /**
     * Adds a new pline entity to the model using numeric indicies.
     * @param posis_id
     */
    public addPlineByIndex(posis_i: number[], close: boolean = false): number {
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
        // create line
        const line_i: number = this._lines.push(wire_i) - 1;
        this._rev_wires_lines[wire_i] = line_i;
        return line_i;
    }
    /**
     * Adds a new polygon entity to the model.
     * @param posis_id
     */
    public addPgon(posis_id: TId[]): TId {
        const posis_i: number[] = idIndicies(posis_id);
        const pgon_i: number = this.addPgonByIndex(posis_i);
        return EEntityTypeStr.PGON + pgon_i;
    }
    /**
     * Adds a new polygon entity to the model using numeric indicies.
     * @param posis_id
     */
    public addPgonByIndex(posis_i: number[]): number {
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
        const pgon_i: number = this._pgons.push(face_i) - 1;
        this._rev_faces_pgons[face_i] = pgon_i;
        return pgon_i;
    }
    /**
     * Adds a collection and updates the rev array.
     * @param parent_id
     * @param points_id
     * @param lines_id
     * @param pgons_id
     */
    public addColl(parent_id: string, points_id: TId[], lines_id: TId[], pgons_id: TId[]): TId {
        const parent_i: number = idIndex(parent_id);
        const points_i: number[] = idIndicies(points_id);
        const lines_i: number[] = idIndicies(lines_id);
        const pgons_i: number[] = idIndicies(pgons_id);
        // create collection
        const coll_i: number = this._colls.push([parent_i, points_i, lines_i, pgons_i]) - 1;
        points_i.forEach( point_i => this._rev_points_colls[point_i] = coll_i);
        lines_i.forEach( line_i => this._rev_points_colls[line_i] = coll_i);
        pgons_i.forEach( pgon_i => this._rev_points_colls[pgon_i] = coll_i);
        return EEntityTypeStr.COLL + coll_i;
    }
    // ============================================================================
    // Check if entity exists
    // ============================================================================
    public has(id: TId): boolean {
        const [type_str, index]: [string, number] = idBreak(id);
        return (this._geom_arrs[type_str][index] !== undefined);
    }
    // ============================================================================
    // Get arrays of entities, these retrun arrays of string IDs
    // ============================================================================
    public getPosis(): TId[] {
        return Array.from(Array(this._num_posis).keys()).map( (_, index) =>  EEntityTypeStr.POSI + index );
    }
    public getVerts(): TId[] {
        return this._verts.map( (_, index) =>  EEntityTypeStr.VERT + index );
    }
    public getTris(): TId[] {
        return this._tris.map( (_, index) =>  EEntityTypeStr.TRI + index );
    }
    public getEdges(): TId[] {
        return this._edges.map( (_, index) =>  EEntityTypeStr.EDGE + index );
    }
    public getWires(): TId[] {
        return this._wires.map( (_, index) =>  EEntityTypeStr.WIRE + index );
    }
    public getFaces(): TId[] {
        return this._faces.map( (_, index) =>  EEntityTypeStr.FACE + index );
    }
    public getPoints(): TId[] {
        return this._points.map( (_, index) =>  EEntityTypeStr.POINT + index );
    }
    public getLines(): TId[] {
        return this._lines.map( (_, index) =>  EEntityTypeStr.LINE + index );
    }
    public getPgons(): TId[] {
        return this._pgons.map( (_, index) =>  EEntityTypeStr.PGON + index );
    }
    public getColls(): TId[] {
        return this._colls.map( (_, index) =>  EEntityTypeStr.COLL + index );
    }
    // ============================================================================
    // Get array lengths
    // ============================================================================
    public numPosis(): number {
        return this._num_posis;
    }
    public numVerts(): number {
        return this._verts.length;
    }
    public numEdges(): number {
        return this._edges.length;
    }
    public numWires(): number {
        return this._wires.length;
    }
    public numFaces(): number {
        return this._faces.length;
    }
    public numCollections(): number {
        return this._colls.length;
    }
    public numPoints(): number {
        return this._points.length;
    }
    public numLines(): number {
        return this._lines.length;
    }
    public numPgons(): number {
        return this._pgons.length;
    }
    public numColls(): number {
        return this._colls.length;
    }
    // ============================================================================
    // ThreeJS
    // Get arrays for threejs, these retrun arrays of indexes to positions
    // For a method to get the array of positions, see the attrib class
    // getSeqCoords()
    // ============================================================================
    /**
     * Returns a flat list of all vertices.
     * The indices in the list point to the sequential coordinates.
     */
    public get3jsVerts(): number[] {
        return this._verts;
    }
    /**
     * Returns a flat list of the sequence of verices for all the triangles.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsTris(): number[] {
        return [].concat(...this._tris);
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsEdges(): number[] {
        return [].concat(...this._edges);
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(): number[] {
        return this._points;
    }
}
