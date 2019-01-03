
import {  EEntityTypeStr, IGeomArrays, EEntStrToGeomArray, TWire, TVert, TTri,
    TEdge, TFace, TPoint, TPline, TPgon, TColl, TPosi } from './common';
import { isPosi, isVert, isPoint, isEdge, isWire, isPline, isFace, isPgon, isColl, idBreak, isTri } from './id';
import { GIGeom } from './GIGeom';
/**
 * Class for geometry.
 */
export class GIGeomQuery {
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
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    public navVertToPosi(vert_i: number): number {
        return this._geom_arrays.dn_verts_posis[vert_i];
    }
    public navTriToVert(tri_i: number): number[] {
        return this._geom_arrays.dn_tris_verts[tri_i];
    }
    public navEdgeToVert(edge_i: number): number[] {
        return this._geom_arrays.dn_edges_verts[edge_i];
    }
    public navWireToEdge(wire_i: number): number[] {
        return this._geom_arrays.dn_wires_edges[wire_i];
    }
    public navFaceToWire(face_i: number): number[] {
        return this._geom_arrays.dn_faces_wirestris[face_i][0];
    }
    public navFaceToTri(face_i: number): number[] {
        return this._geom_arrays.dn_faces_wirestris[face_i][1];
    }
    public navPointToVert(point_i: number): number {
        return this._geom_arrays.dn_points_verts[point_i];
    }
    public navPlineToWire(line_i: number): number {
        return this._geom_arrays.dn_plines_wires[line_i];
    }
    public navPgonToFace(pgon_i: number): number {
        return this._geom_arrays.dn_pgons_faces[pgon_i];
    }
    public navCollToPoint(coll_i: number): number[] {
        return this._geom_arrays.dn_colls_objs[coll_i][1]; // coll points
    }
    public navCollToPline(coll_i: number): number[] {
        return this._geom_arrays.dn_colls_objs[coll_i][2]; // coll lines
    }
    public navCollToPgon(coll_i: number): number[] {
        return this._geom_arrays.dn_colls_objs[coll_i][3]; // coll pgons
    }
    public navCollToColl(coll_i: number): number {
        return coll_i[0]; // coll parent
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    public navPosiToVert(posi_i: number): number[] {
        return this._geom_arrays.up_posis_verts[posi_i];
    }
    public navVertToTri(vert_i: number): number[] {
        return this._geom_arrays.up_verts_tris[vert_i];
    }
    public navVertToEdge(vert_i: number): number[] {
        return this._geom_arrays.up_verts_edges[vert_i];
    }
    public navTriToFace(tri_i: number): number {
        return this._geom_arrays.up_tris_faces[tri_i];
    }
    public navEdgeToWire(edge_i: number): number {
        return this._geom_arrays.up_edges_wires[edge_i];
    }
    public navWireToFace(wire_i: number): number {
        return this._geom_arrays.up_wires_faces[wire_i];
    }
    public navVertToPoint(vert_i: number): number {
        return this._geom_arrays.up_verts_points[vert_i];
    }
    public navWireToLine(wire_i: number): number {
        return this._geom_arrays.up_wires_plines[wire_i];
    }
    public navFaceToPgon(face: number): number {
        return this._geom_arrays.up_faces_pgons[face];
    }
    public navPointToColl(point_i: number): number {
        return this._geom_arrays.up_points_colls[point_i];
    }
    public navLineToColl(line_i: number): number {
        return this._geom_arrays.up_plines_colls[line_i];
    }
    public navPgonToColl(pgon_i: number): number {
        return this._geom_arrays.up_pgons_colls[pgon_i];
    }
    /**
     * Returns the vertices.
     * For a closed wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     */
    private getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this._geom_arrays.dn_wires_edges[wire_i];
        const verts_i: number[] = edges_i.map(edge_i => this._geom_arrays.dn_edges_verts[edge_i][0]);
        // if wire is open, then add final vertex
        if (this._geom_arrays.dn_edges_verts[edges_i[0]][0] !== this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
    }
    // ============================================================================
    // Navigate from any level to ? (up or down)
    // ============================================================================
    /**
     * Navigate from any level to the colls
     * @param id
     */
    public navAnyToColl(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the pgons
     * @param id
     */
    public navAnyToPgon(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the plines
     * @param id
     */
    public navAnyToPline(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the points
     * @param id
     */
    public navAnyToPoint(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the faces
     * @param id
     */
    public navAnyToFace(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the wires
     * @param id
     */
    public navAnyToWire(entity_str: EEntityTypeStr, index: number): number[] {
        throw new Error("Not implemented.")
    }
    /**
     * Navigate from any level to the edges, (or up if coming from positions or vertices)
     * @param id
     */
    public navAnyToEdge(entity_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(entity_str)) {
            return [].concat(...this.navPosiToVert(index).map( vert_i => this.navVertToEdge(vert_i)));
        } else if (isVert(entity_str)) {
            return this.navVertToEdge(index);
        } else if (isTri(entity_str)) {
            throw new Error('Trinagles have no edges.');
        } else if (isEdge(entity_str)) {
            return [index];
        } else if (isWire(entity_str)) {
            return this.navWireToEdge(index);
        } else if (isFace(entity_str)) {
            return [].concat(...this.navFaceToWire(index).map(wire_i => this.navWireToEdge(wire_i)));
        } else if (isPoint(entity_str)) {
            throw new Error('Points have no edges.')
        } else if (isPline(entity_str)) {
            return this.navAnyToEdge(EEntityTypeStr.WIRE, this.navPlineToWire(index));
        } else if (isPgon(entity_str)) {
            return this.navAnyToEdge(EEntityTypeStr.FACE, this.navPgonToFace(index));
        } else if (isColl(entity_str)) {
            const edges_i_plines = this.navCollToPline(index).map( pline_i => this.navAnyToEdge(entity_str, pline_i) );
            const edges_i_pgons = this.navCollToPgon(index).map( pgon_i => this.navAnyToEdge(entity_str, pgon_i) );
            const edges_i = [edges_i_plines, edges_i_pgons];
            return [].concat(...edges_i);
        }
        throw new Error('Bad entity ID: ' + index);
    }
    /**
     * Navigate from any level down to the vertices, (or up if coming from positions)
     * @param id
     */
    public navAnyToVert(entity_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(entity_str)) {
            return this.navPosiToVert(index);
        } else if (isVert(entity_str)) {
            return [index];
        } else if (isTri(entity_str)) {
            return this.navTriToVert(index);
        } else if (isEdge(entity_str)) {
            return this.navEdgeToVert(index);
        } else if (isWire(entity_str)) {
            return this.getWireVerts(index);
        } else if (isFace(entity_str)) {
            return [].concat(...this.navFaceToWire(index).map(wire_i => this.getWireVerts(wire_i)));
        } else if (isPoint(entity_str)) {
            return  [this.navPointToVert(index)];
        } else if (isPline(entity_str)) {
            return this.navAnyToVert(EEntityTypeStr.WIRE, this.navPlineToWire(index));
        } else if (isPgon(entity_str)) {
            return this.navAnyToVert(EEntityTypeStr.FACE, this.navPgonToFace(index));
        } else if (isColl(entity_str)) {
            const verts_i_points = this.navCollToPoint(index).map( point_i => this.navAnyToVert(entity_str, point_i) );
            const verts_i_plines = this.navCollToPline(index).map( pline_i => this.navAnyToVert(entity_str, pline_i) );
            const verts_i_pgons = this.navCollToPgon(index).map( pgon_i => this.navAnyToVert(entity_str, pgon_i) );
            const verts_i = [verts_i_points, verts_i_plines, verts_i_pgons];
            return [].concat(...verts_i);
        }
        throw new Error('Bad entity ID: ' + index);
    }
    /**
     * Navigate from any level down to the positions
     * @param id
     */
    public navAnyToPosi(entity_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(entity_str)) {
            return [index];
        }
        return this.navAnyToVert(entity_str, index).map(vert_i => this.navVertToPosi(vert_i));
    }

    // ============================================================================
    // Navigate from any to any, general method
    // ============================================================================
    /**
     * Navigate from any level down to the positions
     * @param id
     */
    public navAnyToAny(from_ets: EEntityTypeStr, to_ets: EEntityTypeStr, index: number): number[] {
        // same level
        if (from_ets === to_ets) { return [index]; }
        // from -> to
        switch (to_ets) {
            case EEntityTypeStr.POSI:
                return this.navAnyToPosi(from_ets, index);
            case EEntityTypeStr.VERT:
                return this.navAnyToVert(from_ets, index);
            case EEntityTypeStr.EDGE:
                return this.navAnyToEdge(from_ets, index);
            case EEntityTypeStr.WIRE:
                return this.navAnyToWire(from_ets, index);
            case EEntityTypeStr.FACE:
                return this.navAnyToFace(from_ets, index);
            case EEntityTypeStr.POINT:
                return this.navAnyToPoint(from_ets, index);
            case EEntityTypeStr.PLINE:
                return this.navAnyToPline(from_ets, index);
            case EEntityTypeStr.PGON:
                return this.navAnyToPgon(from_ets, index);
            case EEntityTypeStr.COLL:
                return this.navAnyToColl(from_ets, index);
            default:
                throw new Error('Navigation not recognised: ' + to_ets);
        }
    }

    // ============================================================================
    // Get arrays of entities
    // ============================================================================
    public getPosis(): TPosi[] {
        return Array.from(Array(this._geom_arrays.num_posis).keys());
    }
    public getVerts(): TVert[] {
        return this._geom_arrays.dn_verts_posis;
    }
    public getTris(): TTri[] {
        return this._geom_arrays.dn_tris_verts;
    }
    public getEdges(): TEdge[] {
        return this._geom_arrays.dn_edges_verts;
    }
    public getWires(): TWire[] {
        return this._geom_arrays.dn_wires_edges;
    }
    public getFaces(): TFace[] {
        return this._geom_arrays.dn_faces_wirestris;
    }
    public getPoints(): TPoint[] {
        return this._geom_arrays.dn_points_verts;
    }
    public getLines(): TPline[] {
        return this._geom_arrays.dn_plines_wires;
    }
    public getPgons(): TPgon[] {
        return this._geom_arrays.dn_pgons_faces;
    }
    public getColls(): TColl[] {
        return this._geom_arrays.dn_colls_objs;
    }
    // ============================================================================
    // Get array lengths
    // ============================================================================
    public numPosis(): number {
        return this._geom_arrays.num_posis;
    }
    public numVerts(): number {
        return this._geom_arrays.dn_verts_posis.length;
    }
    public numEdges(): number {
        return this._geom_arrays.dn_edges_verts.length;
    }
    public numWires(): number {
        return this._geom_arrays.dn_wires_edges.length;
    }
    public numFaces(): number {
        return this._geom_arrays.dn_faces_wirestris.length;
    }
    public numCollections(): number {
        return this._geom_arrays.dn_colls_objs.length;
    }
    public numPoints(): number {
        return this._geom_arrays.dn_points_verts.length;
    }
    public numPlines(): number {
        return this._geom_arrays.dn_plines_wires.length;
    }
    public numPgons(): number {
        return this._geom_arrays.dn_pgons_faces.length;
    }
    public numColls(): number {
        return this._geom_arrays.dn_colls_objs.length;
    }
    /**
     * Check if an entity exists
     * @param id
     */
    public has(ent_type_str: EEntityTypeStr, index: number): boolean {
        const geom_arrays_key: string = EEntStrToGeomArray[ent_type_str];
        return (this._geom_arrays[geom_arrays_key][index] !== undefined);
    }
    /**
     * Check if a wire is closed.
     * @param wire_i
     */
    public istWireClosed(wire_i: number): boolean {
        // get the wire start and end verts
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this._geom.query.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this._geom.query.navEdgeToVert(end_edge_i)[1];
        // if start and end verts are the same, then wire is closed
        return (start_vert_i === end_vert_i);
    }
    /**
     * Get the parfent of a collection.
     * @param wire_i
     */
    public getCollParent(coll_i: number): number {
        return this._geom_arrays.dn_colls_objs[coll_i][0];
    }
}
