
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
    public navWireToPline(wire_i: number): number {
        return this._geom_arrays.up_wires_plines[wire_i];
    }
    public navFaceToPgon(face: number): number {
        return this._geom_arrays.up_faces_pgons[face];
    }
    public navPointToColl(point_i: number): number[] {
        return this._geom_arrays.up_points_colls[point_i];
    }
    public navPlineToColl(line_i: number): number[] {
        return this._geom_arrays.up_plines_colls[line_i];
    }
    public navPgonToColl(pgon_i: number): number[] {
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
     * @param ent_type_str
     * @param index
     */
    public navAnyToColl(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isColl(ent_type_str)) { return [index]; }
        const points_i: number[] = this.navAnyToPoint(ent_type_str, index);
        const colls1_i: number[] = [].concat(...points_i.map(point_i => this.navPointToColl(point_i)));
        const plines_i: number[] = this.navAnyToPline(ent_type_str, index);
        const colls2_i: number[] = [].concat(...plines_i.map(pline_i => this.navPlineToColl(pline_i)));
        const pgons_i: number[] = this.navAnyToPgon(ent_type_str, index);
        const colls3_i: number[] = [].concat(...pgons_i.map(pgon_i => this.navPgonToColl(pgon_i)));
        return Array.from(new Set([...colls1_i, ...colls2_i, ...colls3_i])).filter(coll_i => coll_i !== undefined); // remove duplicates
    }
    /**
     * Navigate from any level to the pgons
     * @param ent_type_str
     * @param index
     */
    public navAnyToPgon(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPgon(ent_type_str)) { return [index]; }
        const faces_i: number[] = this.navAnyToFace(ent_type_str, index);
        return faces_i.map( face_i => this.navFaceToPgon(face_i) ).filter(pgon_i => pgon_i !== undefined);
    }
    /**
     * Navigate from any level to the plines
     * @param ent_type_str
     * @param index
     */
    public navAnyToPline(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPline(ent_type_str)) { return [index]; }
        const wires_i: number[] = this.navAnyToWire(ent_type_str, index);
        return wires_i.map( wire_i => this.navWireToPline(wire_i) ).filter(pline_i => pline_i !== undefined);
    }
    /**
     * Navigate from any level to the points
     * @param ent_type_str
     * @param index
     */
    public navAnyToPoint(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPoint(ent_type_str)) { return [index]; }
        const verts_i: number[] = this.navAnyToVert(ent_type_str, index);
        return verts_i.map( vert_i => this.navVertToPoint(vert_i) ).filter(point_i => point_i !== undefined);
    }
    /**
     * Navigate from any level to the faces
     * @param ent_type_str
     * @param index
     */
    public navAnyToFace(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(ent_type_str)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navAnyToFace(EEntityTypeStr.VERT, vert_i) ));
        } else if (isVert(ent_type_str)) {
            const edges_i: number[] = this.navVertToEdge(index);
            return [].concat(...edges_i.map( edge_i => this.navAnyToFace(EEntityTypeStr.EDGE, edge_i) ));
        } else if (isTri(ent_type_str)) {
            return [this.navTriToFace(index)];
        } else if (isEdge(ent_type_str)) {
            const wire_i: number = this.navEdgeToWire(index);
            return this.navAnyToFace(EEntityTypeStr.WIRE, wire_i);
        } else if (isWire(ent_type_str)) {
            return [this.navWireToFace(index)];
        } else if (isFace(ent_type_str)) { // target
            return [index];
        } else if (isPoint(ent_type_str)) {
            return [];
        } else if (isPline(ent_type_str)) {
            return [];
        } else if (isPgon(ent_type_str)) {
            return [this.navPgonToFace(index)];
        } else if (isColl(ent_type_str)) {
            const pgons_i: number[] = this.navCollToPgon(index);
            return pgons_i.map(pgon_i => this.navPgonToFace(pgon_i));
        }
        throw new Error('Bad navigation: ' + ent_type_str + index);
    }
    /**
     * Navigate from any level to the wires
     * @param ent_type_str
     * @param index
     */
    public navAnyToWire(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(ent_type_str)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navAnyToWire(EEntityTypeStr.VERT, vert_i) ));
        } else if (isVert(ent_type_str)) {
            const edges_i: number[] = this.navVertToEdge(index);
            return [].concat(...edges_i.map( edge_i => this.navEdgeToWire(edge_i) ));
        } else if (isTri(ent_type_str)) {
            return [];
        } else if (isEdge(ent_type_str)) {
            return [this.navEdgeToWire(index)];
        } else if (isWire(ent_type_str)) { // target
            return [index];
        } else if (isFace(ent_type_str)) {
            return this.navFaceToWire(index);
        } else if (isPoint(ent_type_str)) {
            return [];
        } else if (isPline(ent_type_str)) {
            return [this.navPlineToWire(index)];
        } else if (isPgon(ent_type_str)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navFaceToWire(face_i);
        } else if (isColl(ent_type_str)) {
            const plines_i: number[] = this.navCollToPline(index);
            const wires1_i: number[] = [].concat(...plines_i.map(pline_i => this.navAnyToWire(EEntityTypeStr.PLINE, pline_i)));
            const pgons_i: number[] = this.navCollToPgon(index);
            const wires2_i: number[] = [].concat(...pgons_i.map(pgon_i => this.navAnyToWire(EEntityTypeStr.PGON, pgon_i)));
            return [...wires1_i, ...wires2_i];
        }
        throw new Error('Bad navigation: ' + ent_type_str + index);
    }
    /**
     * Navigate from any level to the edges
     * @param ent_type_str
     * @param index
     */
    public navAnyToEdge(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(ent_type_str)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navVertToEdge(vert_i) ));
        } else if (isVert(ent_type_str)) {
            return this.navVertToEdge(index);
        } else if (isTri(ent_type_str)) {
            return [];
        } else if (isEdge(ent_type_str)) {
            return [index];
        } else if (isWire(ent_type_str)) {
            return this.navWireToEdge(index);
        } else if (isFace(ent_type_str)) {
            const wires_i: number[] = this.navFaceToWire(index);
            return [].concat(...wires_i.map(wire_i => this.navWireToEdge(wire_i)));
        } else if (isPoint(ent_type_str)) {
            return [];
        } else if (isPline(ent_type_str)) {
            const wire_i: number = this.navPlineToWire(index);
            return this.navAnyToEdge(EEntityTypeStr.WIRE, wire_i);
        } else if (isPgon(ent_type_str)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navAnyToEdge(EEntityTypeStr.FACE, face_i);
        } else if (isColl(ent_type_str)) {
            const plines_i: number[] = this.navCollToPline(index);
            const edges1_i: number[] = [].concat(plines_i.map( pline_i => this.navAnyToEdge(EEntityTypeStr.PLINE, pline_i) ));
            const pgons_i:  number[] = this.navCollToPgon(index);
            const edges2_i: number[] = [].concat(pgons_i.map( pgon_i => this.navAnyToEdge(EEntityTypeStr.PGON, pgon_i) ));
            return [...edges1_i, ...edges2_i];
        }
        throw new Error('Bad navigation: ' + ent_type_str + index);
    }
    /**
     * Navigate from any level to the vertices
     * @param ent_type_str
     * @param index
     */
    public navAnyToVert(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(ent_type_str)) {
            return this.navPosiToVert(index);
        } else if (isVert(ent_type_str)) {
            return [index];
        } else if (isTri(ent_type_str)) {
            return this.navTriToVert(index);
        } else if (isEdge(ent_type_str)) {
            return this.navEdgeToVert(index);
        } else if (isWire(ent_type_str)) {
            return this.getWireVerts(index); // avoids duplicate verts
        } else if (isFace(ent_type_str)) {
            const wires_i: number[] = this.navFaceToWire(index);
            return [].concat(...wires_i.map(wire_i => this.getWireVerts(wire_i))); // avoids duplicate verts
        } else if (isPoint(ent_type_str)) {
            return  [this.navPointToVert(index)];
        } else if (isPline(ent_type_str)) {
            const wire_i: number = this.navPlineToWire(index);
            return this.navAnyToVert(EEntityTypeStr.WIRE, wire_i);
        } else if (isPgon(ent_type_str)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navAnyToVert(EEntityTypeStr.FACE, face_i);
        } else if (isColl(ent_type_str)) {
            const points_i: number[] = this.navCollToPoint(index);
            const verts1_i: number[] = [].concat(points_i.map( point_i => this.navAnyToVert(EEntityTypeStr.POINT, point_i) ));
            const plines_i: number[] = this.navCollToPline(index);
            const verts2_i: number[] = [].concat(plines_i.map( pline_i => this.navAnyToVert(EEntityTypeStr.PLINE, pline_i) ));
            const pgons_i:  number[] = this.navCollToPgon(index);
            const verts3_i: number[] = [].concat(pgons_i.map( pgon_i => this.navAnyToVert(EEntityTypeStr.PGON, pgon_i) ));
            return [...verts1_i, ...verts2_i, ...verts3_i];
        }
        throw new Error('Bad navigation: ' + ent_type_str + index);
    }
    /**
     * Navigate from any level to the positions
     * @param ent_type_str
     * @param index
     */
    public navAnyToPosi(ent_type_str: EEntityTypeStr, index: number): number[] {
        if (isPosi(ent_type_str)) { return [index]; }
        const verts_i: number[] = this.navAnyToVert(ent_type_str, index);
        const posis_i: number[] = verts_i.map(vert_i => this.navVertToPosi(vert_i));
        return Array.from(new Set(posis_i)); // remove duplicates
    }
    // ============================================================================
    // Navigate from any to any, general method
    // ============================================================================
    /**
     * Navigate from any level down to the positions
     * @param index
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
                throw new Error('Bad navigation: ' + to_ets + index);
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
    // Get entity indicies and numbers
    // ============================================================================
    public getEnts(ent_type_str: EEntityTypeStr): number[] {
        if (isPosi(ent_type_str)) {
            // TODO how to handle deleted positions
            return Array.from(Array(this._geom_arrays.num_posis).keys());
        }
        const geom_array_key: string = EEntStrToGeomArray[ent_type_str];
        const geom_array: any[] = this._geom_arrays[geom_array_key];
        // console.log("ent_type_str", ent_type_str);
        // console.log("geom_array_key", geom_array_key);
        // console.log("geom_array", geom_array);

        const indicies: number[] = [];
        geom_array.forEach( (entity, index) => {
            if (entity !== null && entity !== undefined) {  // skips deleted entities
                indicies.push(index);
            }
        });
        return indicies;
    }
    public numEnts(ent_type_str: EEntityTypeStr): number {
        return this.getEnts(ent_type_str).length;
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
    // ============================================================================
    // Util
    // ============================================================================
    /**
     * Check if an entity exists
     * @param index
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
