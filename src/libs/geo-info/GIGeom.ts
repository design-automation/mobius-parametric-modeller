import { TTri, TVert, TEdge, TWire, TFace, TColl, IGeomData, TPoint, TLine, TPgon } from './json_data';
import { GIModel } from './GIModel';
/**
 * Class for geometry.
 */
export class GIGeom {
    private model: GIModel;
    // positions
    private num_posis = 0; // The total number of positions in the model.
    private rev_posis_verts: number[][] = []; // 1 position -> many vertices
    private rev_posis_tris: number[][] = []; // 1 position -> many triangles
    // triangles
    private tris: TTri[] = []; // many triangles -> 1 position
    private rev_tris_faces: number[] = []; // 1 triangle -> 1 face
    // vertices
    private verts: TVert[] = []; // many vertices -> 1 position
    private rev_verts_edges: number[] = []; // 1 vertex -> 1 edge
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
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(model: GIModel) {
        this.model = model;
    }
    /**
     * Sets the data in this model from JSON data.
     * The existing data in the model is overwritten.
     * @param geom_data The JSON data
     */
    public setData (geom_data: IGeomData): void {
        this.tris = geom_data.triangles;
        this.verts = geom_data.vertices;
        this.edges = geom_data.edges;
        this.wires = geom_data.wires;
        this.faces = geom_data.faces;
        this.points = geom_data.points;
        this.lines = geom_data.linestrings;
        this.pgons = geom_data.polygons;
        this.colls = geom_data.collections;
        this._updateRevArrays();
        this.num_posis = this.rev_posis_verts.length;
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IGeomData {
        return {
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
     * Updates the rev arrays the create the reveres links.
     */
    private _updateRevArrays() {
        // positions
        this.tris.forEach( (pos_i_arr, tri_i) => {
            pos_i_arr.forEach( pos_i => {
                if (this.rev_posis_tris[pos_i] === undefined) {
                    this.rev_posis_tris[pos_i] = [];
                }
                this.rev_posis_verts[pos_i].push(tri_i);
            });
        });
        this.verts.forEach( (pos_i, vert_i) => {
            if (this.rev_posis_verts[pos_i] === undefined) {
                this.rev_posis_verts[pos_i] = [];
            }
            this.rev_posis_verts[pos_i].push(vert_i);
        });
        // edges, wires, faces
        this.edges.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( vert_i => {
                this.rev_verts_edges[vert_i] = edge_i;
            });
        });
        this.wires.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this.rev_edges_wires[edge_i] = wire_i;
            });
        });
        this.faces.forEach( ([wire_i_arr, tri_i_arr], face_i) => {
            wire_i_arr.forEach( wire_i => {
                this.rev_wires_faces[wire_i] = face_i;
            });
            tri_i_arr.forEach( tri_i => {
                this.rev_tris_faces[tri_i] = face_i;
            });
        });
        // points, lines, polygons
        this.points.forEach( (vert_i, point_i) => {
            this.rev_verts_points[vert_i] = point_i;
        });
        this.lines.forEach( (wire_i, line_i) => {
            this.rev_wires_lines[wire_i] = line_i;
        });
        this.pgons.forEach( (face_i, pgon_i) => {
            this.rev_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, linestrings, polygons
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
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param geom_data The JSON data
     */
    public addData(geom_data: IGeomData): void {
        // get lengths before we start adding stuff
        const num_posis2: number = this.rev_posis_verts.length;
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
        const new_triangles: TTri[] = geom_data.triangles.map(t => t.map(p => p + num_posis2 ) as TTri);
        this.tris = this.tris.concat( new_triangles );
        // Add vertices to model
        const new_verts: TVert[] = geom_data.vertices.map(p => p + num_posis2 as TVert);
        this.verts = this.verts.concat( new_verts );
        // Add edges to model
        const new_edges: TEdge[] = geom_data.edges.map(e => e.map(v => v + num_verts) as TEdge);
        this.edges = this.edges.concat( new_edges );
        // Add wires to model
        const new_wires: TWire[] = geom_data.wires.map(w => w.map(e => e + num_edges) as TWire);
        this.wires = this.wires.concat( new_wires );
        // Add faces to model
        const new_faces: TFace[] = geom_data.faces.map(f => [
            f[0].map( w => w + num_wires),
            f[1].map( t => t + num_tris)
        ] as TFace);
        this.faces = this.faces.concat( new_faces );
        // Add points to model
        const new_points: TPoint[] = geom_data.points.map(v => v + num_verts as TPoint);
        this.points = this.points.concat( new_points );
        // Add lines to model
        const new_lines: TLine[] = geom_data.linestrings.map(w => w + num_wires as TLine);
        this.lines = this.lines.concat( new_lines );
        // Add pgons to model
        const new_pgons: TPgon[] = geom_data.polygons.map(f => f + num_faces as TPgon);
        this.pgons = this.pgons.concat( new_pgons );
        // Add collections to model
        const new_colls: TColl[] = geom_data.collections.map(c => [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map( point => point + num_points),
            c[2].map( line => line + num_lines),
            c[3].map( pgon => pgon + num_pgons)
        ] as TColl);
        this.colls = this.colls.concat( new_colls );
        // Update number of positions
        this.num_posis = this.rev_posis_verts.length;
    }
    /**
     * Adds a vertex and updates the rev array.
     * @param position
     */
    private _addVertex(position: number): number {
        const vert_i: number = this.verts.push(position) - 1;
        if (this.rev_posis_verts[position] === undefined) {
            this.rev_posis_verts[position] = [];
        }
        this.rev_posis_verts[position].push(vert_i);
        return vert_i;
    }
    /**
     * Adds an edge and updates the rev array.
     * @param vertex1
     * @param vertex2
     */
    private _addEdge(vertex1: number, vertex2: number): number {
        const edge_i: number = this.edges.push([vertex1, vertex2]) - 1;
        this.rev_verts_edges[vertex1] = edge_i;
        this.rev_verts_edges[vertex2] = edge_i;
        return edge_i;
    }
    /**
     * Adds a wire and updates the rev array.
     * Edges are assumed to be sequential!
     * @param edges
     */
    private _addWire(edges: number[], close: boolean = false): number {
        const wire_i: number = this.wires.push(edges) - 1;
        edges.forEach( edge_i => this.rev_edges_wires[edge_i] = wire_i );
        return wire_i;
    }
    /**
     * Adds a face and updates the rev array.
     * Wires are assumed to be closed!
     * @param wires
     */
    private _addFace(wires: number[], holes: number[][] = []): number {
        throw new Error('NOT IMPLEMENTED');
    }
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosition(): number {
        this.num_posis += 1;
        return this.num_posis - 1;
    }
    /**
     * Adds a new point entity to the model.
     * @param position The position for the point.
     */
    public addPoint(position: number): number {
        const vert_i = this._addVertex(position);
        const point_i: number = this.points.push(vert_i) - 1;
        this.rev_verts_points[vert_i] = point_i;
        return point_i;
    }
    /**
     * Adds a new linestring entity to the model.
     * @param positions
     */
    public addLine(positions: number[], close: boolean = false): number {
        const vert_i_arr: number[] = positions.map( position => this._addVertex(position));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        if (close) {
            edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        }
        const wire_i: number = this._addWire(edges_i_arr, close);
        const line_i: number = this.lines.push(wire_i) - 1;
        this.rev_wires_lines[wire_i] = line_i;
        return line_i;
    }
    /**
     * Adds a new polygon entity to the model.
     * @param positions
     * @param holes
     */
    public addPolygon(positions: number[], holes: number[][] = []): number {
        throw new Error('NOT IMPLEMENTED');
    }
    /**
     * Adds a collection and updates the rev array.
     * @param parent
     * @param points
     * @param lines
     * @param pgons
     */
    private addColl(parent: number, points: number[], lines: number[], pgons: number[]): number {
        throw new Error('NOT IMPLEMENTED');
    }
    // ============================================================================
    // Get entities
    // ============================================================================
    public getTri(index: number): TTri {
        return this.tris[index];
    }
    public getVert(index: number): TVert {
        return this.verts[index];
    }
    public getEdge(index: number): TEdge {
        return this.edges[index];
    }
    public getWire(index: number): TWire {
        return this.wires[index];
    }
    public getFace(index: number): TFace {
        return this.faces[index];
    }
    public getPoint(index: number): TPoint {
        return this.points[index];
    }
    public getLine(index: number): TLine {
        return this.lines[index];
    }
    public getPgon(index: number): TPgon {
        return this.pgons[index];
    }
    public getColl(index: number): TColl {
        return this.colls[index];
    }
    // ============================================================================
    // Get arrays of entities
    // ============================================================================
    public getTris(): TTri[] {
        return this.tris;
    }
    public getVerts(): TVert[] {
        return this.verts;
    }
    public getEdges(): TEdge[] {
        return this.edges;
    }
    public getWires(): TWire[] {
        return this.wires;
    }
    public getFaces(): TFace[] {
        return this.faces;
    }
    public getPoints(): TPoint[] {
        return this.points;
    }
    public getLines(): TLine[] {
        return this.lines;
    }
    public getPgons(): TPgon[] {
        return this.pgons;
    }
    public getColls(): TColl[] {
        return this.colls;
    }
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    public navVertToPosi(vert: number): number {
        return this.verts[vert];
    }
    public navEdgeToVert(edge: number): number[] {
        return this.edges[edge];
    }
    public navWireToEdge(wire: number): number[] {
        return this.wires[wire];
    }
    public navFaceToWire(face: number): number[] {
        return this.faces[face][0];
    }
    public navFaceToTri(face: number): number[] {
        return this.faces[face][1];
    }
    public navPointToVert(point: number): number {
        return this.points[point];
    }
    public navLineToVert(line: number): number {
        return this.lines[line];
    }
    public navPgonToVert(pgon: number): number {
        return this.pgons[pgon];
    }
    public navCollToPoint(coll: number): number[] {
        return this.colls[coll][1];
    }
    public navCollToLine(coll: number): number[] {
        return this.colls[coll][2];
    }
    public navCollToPgon(coll: number): number[] {
        return this.colls[coll][3];
    }
    public navCollToColl(coll: number): number {
        return coll[0];
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    public navPosiToVert(posi: number): number[] {
        return this.rev_posis_verts[posi];
    }
    public navPosiToTri(posi: number): number[] {
        return this.rev_posis_tris[posi];
    }
    public NavTriToFace(tri: number): number {
        return this.rev_tris_faces[tri];
    }
    public navVrtToEdge(vert: number): number {
        return this.rev_verts_edges[vert];
    }
    public navEdgeToWire(edge: number): number {
        return this.rev_edges_wires[edge];
    }
    public navWireToFace(wire: number): number {
        return this.rev_wires_faces[wire];
    }
    public navVertToPoint(vert: number): number {
        return this.rev_verts_points[vert];
    }
    public navWireToLine(wire: number): number {
        return this.rev_wires_lines[wire];
    }
    public navFaceToPgon(face: number): number {
        return this.rev_faces_pgons[face];
    }
    public navPointToColl(point: number): number {
        return this.rev_points_colls[point];
    }
    public navLineToColl(line: number): number {
        return this.rev_lines_colls[line];
    }
    public navPgonToColl(pgon: number): number {
        return this.rev_pgons_colls[pgon];
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
}
