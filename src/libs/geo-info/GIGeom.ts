import { TTri, TVert, TEdge, TWire, TFace, TColl, IGeomData, TPoint, TLine, TPgon, TCoord } from './GIJson';
import { GIModel } from './GIModel';
import { EEntityTypeStr, idBreak, idIndex, idIndicies } from './GICommon';
import { triangulate } from '../triangulate/triangulate';

/**
 * Class for geometry.
 */
export class GIGeom {
    private model: GIModel;
    // positions
    private num_posis = 0; // The total number of positions in the model.
    private rev_posis_verts: number[][] = []; // 1 position -> many vertices
    // triangles
    private tris: TTri[] = []; // 1 triangles -> 3 vertices
    private rev_tris_faces: number[] = []; // 1 tri -> 1 face
    // vertices
    private verts: TVert[] = []; // many vertices -> 1 position
    private rev_verts_edges: number[] = []; // 1 vertex -> 1 edge
    private rev_verts_tris: number[] = []; // 1 vertex -> 1 tri // TODO add code to update this
    private rev_verts_points: number[] = []; // 1 vertex -> 1 point
    // edges
    private edges: TEdge[] = []; // 1 edge -> 2 vertices
    private rev_edges_wires: number[] = []; // 1 edge -> 1 wire
    // wires
    private wires: TWire[] = []; // 1 wire -> many edges
    private rev_wires_faces: number[] = []; // 1 wire -> 1 face
    private rev_wires_lines: number[] = []; // 1 wire -> 1 line
    // faces
    private faces: TFace[] = []; // 1 face -> many wires
    private rev_faces_pgons: number[] = []; // 1 face -> 1 pgon
    // points
    private points: TPoint[] = []; // 1 point -> 1 vertex
    private rev_points_colls: number[] = []; // 1 point -> 1 collection
    // polylines
    private lines: TLine[] = []; // 1 polyline -> 1 wire
    private rev_lines_colls: number[] = []; // 1 line -> 1 collection
    // polygons
    private pgons: TPgon[] = []; // 1 polygon -> 1 face
    private rev_pgons_colls: number[] = []; // 1 pgon -> 1 collection
    // collections
    private colls: TColl[] = []; // 1 collection -> many points, many polylines, many polygons
    // all arrays
    private geom_arrs = {
        _t: this.tris,
        _v: this.verts,
        _e: this.edges,
        _w: this.wires,
        _f: this.faces,
        pt: this.points,
        ls: this.lines,
        pg: this.pgons,
        co: this.colls
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
            num_positions: this.num_posis,
            triangles: this.tris,
            vertices: this.verts,
            edges: this.edges,
            wires: this.wires,
            faces: this.faces,
            points: this.points,
            linestrings: this.lines,
            polygons: this.pgons,
            collections: this.colls
        };
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param geom_data The JSON data
     */
    public addData(geom_data: IGeomData): void {
        // get lengths before we start adding stuff
        const num_tris: number = this.tris.length;
        const num_verts: number = this.verts.length;
        const num_edges: number = this.edges.length;
        const num_wires: number = this.wires.length;
        const num_faces: number = this.faces.length;
        const num_points: number = this.points.length;
        const num_lines: number = this.lines.length;
        const num_pgons: number = this.pgons.length;
        const num_colls: number = this.colls.length;
        // Add triangles to model
        const new_triangles: TTri[] = geom_data.triangles.map(t => t.map(p => p + this.num_posis ) as TTri);
        this.tris.push( ...new_triangles );
        // Add vertices to model
        const new_verts: TVert[] = geom_data.vertices.map(p => p + this.num_posis as TVert);
        this.verts.push( ...new_verts );
        // Add edges to model
        const new_edges: TEdge[] = geom_data.edges.map(e => e.map(v => v + num_verts) as TEdge);
        this.edges.push( ...new_edges );
        // Add wires to model
        const new_wires: TWire[] = geom_data.wires.map(w => w.map(e => e + num_edges) as TWire);
        this.wires.push( ...new_wires );
        // Add faces to model
        const new_faces: TFace[] = geom_data.faces.map(f => [
            f[0].map( w => w + num_wires),
            f[1].map( t => t + num_tris)
        ] as TFace);
        this.faces.push( ...new_faces );
        // Add points to model
        const new_points: TPoint[] = geom_data.points.map(v => v + num_verts as TPoint);
        this.points.push( ...new_points );
        // Add lines to model
        const new_lines: TLine[] = geom_data.linestrings.map(w => w + num_wires as TLine);
        this.lines.push( ...new_lines );
        // Add pgons to model
        const new_pgons: TPgon[] = geom_data.polygons.map(f => f + num_faces as TPgon);
        this.pgons.push( ...new_pgons );
        // Add collections to model
        const new_colls: TColl[] = geom_data.collections.map(c => [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map( point => point + num_points),
            c[2].map( line => line + num_lines),
            c[3].map( pgon => pgon + num_pgons)
        ] as TColl);
        this.colls.push( ...new_colls );
        // Update the reverse arrays
        this._updateRevArrays();
        // update the positions array
        this.num_posis += geom_data.num_positions;
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays() {
        // positions
        this.rev_posis_verts = [];
        this.verts.forEach( (pos_i, vert_i) => {
            if (this.rev_posis_verts[pos_i] === undefined) {
                this.rev_posis_verts[pos_i] = [];
            }
            this.rev_posis_verts[pos_i].push(vert_i);
        });
        // tris, edges, wires, faces
        this.rev_verts_tris = [];
        this.tris.forEach( (vert_i_arr, tri_i) => {
            vert_i_arr.forEach( vert_i => {
                this.rev_verts_tris[vert_i] = tri_i;
            });
        });
        this.rev_verts_edges = [];
        this.edges.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( vert_i => {
                this.rev_verts_edges[vert_i] = edge_i;
            });
        });
        this.rev_edges_wires = [];
        this.wires.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this.rev_edges_wires[edge_i] = wire_i;
            });
        });
        this.rev_wires_faces = [];
        this.rev_tris_faces = [];
        this.faces.forEach( ([wire_i_arr, tri_i_arr], face_i) => {
            wire_i_arr.forEach( wire_i => {
                this.rev_wires_faces[wire_i] = face_i;
            });
            tri_i_arr.forEach( tri_i => {
                this.rev_tris_faces[tri_i] = face_i;
            });
        });
        // points, lines, polygons
        this.rev_verts_points = [];
        this.points.forEach( (vert_i, point_i) => {
            this.rev_verts_points[vert_i] = point_i;
        });
        this.rev_wires_lines = [];
        this.lines.forEach( (wire_i, line_i) => {
            this.rev_wires_lines[wire_i] = line_i;
        });
        this.rev_faces_pgons = [];
        this.pgons.forEach( (face_i, pgon_i) => {
            this.rev_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, linestrings, polygons
        this.rev_points_colls = [];
        this.rev_lines_colls = [];
        this.rev_pgons_colls = [];
        this.colls.forEach( ([parent, point_i_arr, line_i_arr, pgon_i_arr], coll_i) => {
            point_i_arr.forEach( point_i => {
                this.rev_points_colls[point_i] = coll_i;
            });
            line_i_arr.forEach( line_i => {
                this.rev_lines_colls[line_i] = coll_i;
            });
            pgon_i_arr.forEach( pgon_i => {
                this.rev_pgons_colls[pgon_i] = coll_i;
            });
        });
    }
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    private _navVertToPosi(vert: number): number {
        return this.verts[vert];
    }
    private _navEdgeToVert(edge: number): number[] {
        return this.edges[edge];
    }
    private _navWireToEdge(wire: number): number[] {
        return this.wires[wire];
    }
    private _navFaceToWire(face: number): number[] {
        return this.faces[face][0];
    }
    private _navFaceToTri(face: number): number[] {
        return this.faces[face][1];
    }
    private _navPointToVert(point: number): number {
        return this.points[point];
    }
    private _navLineToVert(line: number): number {
        return this.lines[line];
    }
    private _navPgonToVert(pgon: number): number {
        return this.pgons[pgon];
    }
    private _navCollToPoint(coll: number): number[] {
        return this.colls[coll][1]; // coll points
    }
    private _navCollToLine(coll: number): number[] {
        return this.colls[coll][2]; // coll lines
    }
    private _navCollToPgon(coll: number): number[] {
        return this.colls[coll][3]; // coll pgons
    }
    private _navCollToColl(coll: number): number {
        return coll[0]; // coll parent
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    private _navPosiToVert(posi: number): number[] {
        return this.rev_posis_verts[posi];
    }
    private _navVertToTri(vert: number): number {
        return this.rev_verts_tris[vert];
    }
    private _navVertToEdge(vert: number): number {
        return this.rev_verts_edges[vert];
    }
    private _navTriToFace(tri: number): number {
        return this.rev_tris_faces[tri];
    }
    private _navEdgeToWire(edge: number): number {
        return this.rev_edges_wires[edge];
    }
    private _navWireToFace(wire: number): number {
        return this.rev_wires_faces[wire];
    }
    private _navVertToPoint(vert: number): number {
        return this.rev_verts_points[vert];
    }
    private _navWireToLine(wire: number): number {
        return this.rev_wires_lines[wire];
    }
    private _navFaceToPgon(face: number): number {
        return this.rev_faces_pgons[face];
    }
    private _navPointToColl(point: number): number {
        return this.rev_points_colls[point];
    }
    private _navLineToColl(line: number): number {
        return this.rev_lines_colls[line];
    }
    private _navPgonToColl(pgon: number): number {
        return this.rev_pgons_colls[pgon];
    }
    // ============================================================================
    // Create the topological entities, these methods are never public
    // ============================================================================
    /**
     * Adds a vertex and updates the rev array.
     * @param posi_i
     */
    private _addVertex(posi_i: number): number {
        const vert_i: number = this.verts.push(posi_i) - 1;
        if (this.rev_posis_verts[posi_i] === undefined) {
            this.rev_posis_verts[posi_i] = [];
        }
        this.rev_posis_verts[posi_i].push(vert_i);
        return vert_i;
    }
    /**
     * Adds an edge and updates the rev array.
     * @param vert_i1
     * @param vert_i2
     */
    private _addEdge(vert_i1: number, vert_i2: number): number {
        const edge_i: number = this.edges.push([vert_i1, vert_i2]) - 1;
        this.rev_verts_edges[vert_i1] = edge_i;
        this.rev_verts_edges[vert_i2] = edge_i;
        return edge_i;
    }
    /**
     * Adds a wire and updates the rev array.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    private _addWire(edges_i: number[], close: boolean = false): number {
        const wire_i: number = this.wires.push(edges_i) - 1;
        edges_i.forEach( edge_i => this.rev_edges_wires[edge_i] = wire_i );
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
        const wire_posis_i: number[] = wire_verts_i.map( vert_i => this.verts[vert_i] );
        const wire_coords: TCoord[] = wire_posis_i.map( posi_i => this.model.attribs().getPosiCoord(posi_i) );
        const tris_corners: number[][] = triangulate(wire_coords);
        const tris_posis_i: TTri[] = tris_corners.map(tri_corners => tri_corners.map( corner => wire_verts_i[corner] ) as TTri );
        const tris_i: number[] = tris_posis_i.map(tri_posis_i => this.tris.push(tri_posis_i) - 1);
        // create the face
        const face: TFace = [[wire_i], tris_i];
        const face_i: number = this.faces.push(face);
        return face_i;
    }
    /**
     * Helper function to get check if wire is closed
     */
    private _istWireClosed(wire_i: number): boolean {
        const edges_i: number[] = this.wires[wire_i];
        return this.edges[edges_i[0]][0] === this.edges[edges_i[edges_i.length - 1]][1];
    }
    /**
     * Helper function to get the vertices of a wire
     * The function check is the wire is closed and returns correct number of vertices.
     * For a cloased wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     */
    private _getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this.wires[wire_i];
        const verts_i: number[] = edges_i.map(edge_i => this.edges[edge_i][0]);
        if (this.edges[edges_i[0]][0] !== this.edges[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this.edges[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
    }
    // ============================================================================
    // Create geometry, all these public methods return an string ID
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosition(): string {
        this.num_posis += 1;
        const i = this.num_posis - 1;
        return EEntityTypeStr.POSI + i;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_id The position for the point.
     */
    public addPoint(posi_id: string): string {
        const posi_i: number = idIndex(posi_id);
        // create verts
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i: number = this.points.push(vert_i) - 1;
        this.rev_verts_points[vert_i] = point_i;
        return EEntityTypeStr.POINT + point_i;
    }
    /**
     * Adds a new linestring entity to the model.
     * @param posis_id
     */
    public addLine(posis_id: string[], close: boolean = false): string {
        const posis_i: number[] = idIndicies(posis_id);
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
        const line_i: number = this.lines.push(wire_i) - 1;
        this.rev_wires_lines[wire_i] = line_i;
        return EEntityTypeStr.LINE + line_i;
    }
    /**
     * Adds a new polygon entity to the model.
     * @param posis_id
     */
    public addPgon(posis_id: string[]): string {
        const posis_i: number[] = idIndicies(posis_id);
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
        const pgon_i: number = this.pgons.push(face_i) - 1;
        this.rev_faces_pgons[face_i] = pgon_i;
        return EEntityTypeStr.PGON + pgon_i;
    }
    /**
     * Adds a collection and updates the rev array.
     * @param parent_id
     * @param points_id
     * @param lines_id
     * @param pgons_id
     */
    private addColl(parent_id: string, points_id: string[], lines_id: string[], pgons_id: string[]): string {
        const parent_i: number = idIndex(parent_id);
        const points_i: number[] = idIndicies(points_id);
        const lines_i: number[] = idIndicies(lines_id);
        const pgons_i: number[] = idIndicies(pgons_id);
        // create collection
        const coll_i: number = this.colls.push([parent_i, points_i, lines_i, pgons_i]) - 1;
        points_i.forEach( point_i => this.rev_points_colls[point_i] = coll_i);
        lines_i.forEach( line_i => this.rev_points_colls[line_i] = coll_i);
        pgons_i.forEach( pgon_i => this.rev_points_colls[pgon_i] = coll_i);
        return EEntityTypeStr.COLL + coll_i;
    }
    // ============================================================================
    // Check if entity exists
    // ============================================================================
    public has(id: string): boolean {
        const [type_str, index]: [string, number] = idBreak(id);
        return (this.geom_arrs[type_str][index] !== undefined);
    }
    // ============================================================================
    // Get arrays of entities, these retrun arrays of string IDs
    // ============================================================================
    public getTris(): string[] {
        return this.tris.map( (_, index) =>  EEntityTypeStr.TRI + index );
    }
    public getVerts(): string[] {
        return this.verts.map( (_, index) =>  EEntityTypeStr.VERT + index );
    }
    public getEdges(): string[] {
        return this.edges.map( (_, index) =>  EEntityTypeStr.EDGE + index );
    }
    public getWires(): string[] {
        return this.wires.map( (_, index) =>  EEntityTypeStr.WIRE + index );
    }
    public getFaces(): string[] {
        return this.faces.map( (_, index) =>  EEntityTypeStr.FACE + index );
    }
    public getPoints(): string[] {
        return this.points.map( (_, index) =>  EEntityTypeStr.POINT + index );
    }
    public getLines(): string[] {
        return this.lines.map( (_, index) =>  EEntityTypeStr.LINE + index );
    }
    public getPgons(): string[] {
        return this.pgons.map( (_, index) =>  EEntityTypeStr.PGON + index );
    }
    public getColls(): string[] {
        return this.colls.map( (_, index) =>  EEntityTypeStr.COLL + index );
    }

    // ============================================================================
    // Get array lengths
    // ============================================================================
    public numPosis(): number {
        return this.num_posis;
    }
    public numVerts(): number {
        return this.verts.length;
    }
    public numEdges(): number {
        return this.edges.length;
    }
    public numWires(): number {
        return this.wires.length;
    }
    public numFaces(): number {
        return this.faces.length;
    }
    public numCollections(): number {
        return this.colls.length;
    }
    public numPoints(): number {
        return this.points.length;
    }
    public numLines(): number {
        return this.lines.length;
    }
    public numPgons(): number {
        return this.pgons.length;
    }
    public numColls(): number {
        return this.colls.length;
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
        return this.verts;
    }
    /**
     * Returns a flat list of the sequence of verices for all the triangles.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsTris(): number[] {
        return [].concat(...this.tris);
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsEdges(): number[] {
        return [].concat(...this.edges);
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(): number[] {
        return this.points;
    }
}
