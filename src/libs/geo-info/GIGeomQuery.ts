
import {  EEntityTypeStr, TId, IGeomArrays, EEntStrToGeomArray } from './common';
import { isPosi, isVert, isPoint, isEdge, isWire, isPline, isFace, isPgon, isColl, idBreak } from './id';
import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
/**
 * Class for geometry.
 */
export class GIGeomQuery {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    private _attribs: GIAttribs;
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
        this._attribs = geom.model.attribs;
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
    // TODO This has been replaced by navAnyToVert
    public navLineToVert(line_i: number): number[] {
        const wire_i: number = this._geom_arrays.dn_plines_wires[line_i];
        return this.getWireVerts(wire_i);
    }
    // TODO This has been replaced by navAnyToVert
    public navPgonToVert(pgon_i: number): number[][] {
        const face_i: number = this._geom_arrays.dn_pgons_faces[pgon_i];
        const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
        return wires_i.map( wire_i => this.getWireVerts(wire_i) );
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
        } else if (isEdge(entity_str)) {
            return this.navEdgeToVert(index);
        } else if (isWire(entity_str)) {
            return this.getWireVerts(index);
        } else if (isFace(entity_str)) {
            return [].concat(...this.navFaceToWire(index).map(wire_i => this.getWireVerts(wire_i)));
        } else if (isPoint(entity_str)) {
            return  [this.navPointToVert(index)];
        } else if (isPline(entity_str)) {
            return this.navAnyToVert(entity_str, this.navPlineToWire(index));
        } else if (isPgon(entity_str)) {
            return this.navAnyToVert(entity_str, this.navPgonToFace(index));
        } else if (isColl(entity_str)) {
            const posis_i_points = this.navCollToPoint(index).map( point_i => this.navAnyToVert(entity_str, point_i) );
            const posis_i_plines = this.navCollToPline(index).map( pline_i => this.navAnyToVert(entity_str, pline_i) );
            const posis_i_pgons = this.navCollToPgon(index).map( pgon_i => this.navAnyToVert(entity_str, pgon_i) );
            const posis_i = [posis_i_points, posis_i_plines, posis_i_pgons];
            return [].concat(...posis_i);
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
        return this.navAnyToVert(entity_str, index);
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    public navPosiToVert(posi_i: number): number[] {
        return this._geom_arrays.up_posis_verts[posi_i];
    }
    public navVertToTri(vert_i: number): number {
        return this._geom_arrays.up_verts_tris[vert_i];
    }
    public navVertToEdge(vert_i: number): number {
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
        return this._geom_arrays.up_wires_lines[wire_i];
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
     * For a cloased wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     */
    private getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this._geom_arrays.dn_wires_edges[wire_i];
        const verts_i: number[] = edges_i.map(edge_i => this._geom_arrays.dn_edges_verts[edge_i][0]);
        if (this._geom_arrays.dn_edges_verts[edges_i[0]][0] !== this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
    }
    // ============================================================================
    // Get arrays of entities, these retrun arrays of string IDs
    // ============================================================================
    public getPosis(): TId[] {
        return Array.from(Array(this._geom_arrays.num_posis).keys()).map( (_, index) =>  EEntityTypeStr.POSI + index );
    }
    public getVerts(): TId[] {
        return this._geom_arrays.dn_verts_posis.map( (_, index) =>  EEntityTypeStr.VERT + index );
    }
    public getTris(): TId[] {
        return this._geom_arrays.dn_tris_verts.map( (_, index) =>  EEntityTypeStr.TRI + index );
    }
    public getEdges(): TId[] {
        return this._geom_arrays.dn_edges_verts.map( (_, index) =>  EEntityTypeStr.EDGE + index );
    }
    public getWires(): TId[] {
        return this._geom_arrays.dn_wires_edges.map( (_, index) =>  EEntityTypeStr.WIRE + index );
    }
    public getFaces(): TId[] {
        return this._geom_arrays.dn_faces_wirestris.map( (_, index) =>  EEntityTypeStr.FACE + index );
    }
    public getPoints(): TId[] {
        return this._geom_arrays.dn_points_verts.map( (_, index) =>  EEntityTypeStr.POINT + index );
    }
    public getLines(): TId[] {
        return this._geom_arrays.dn_plines_wires.map( (_, index) =>  EEntityTypeStr.PLINE + index );
    }
    public getPgons(): TId[] {
        return this._geom_arrays.dn_pgons_faces.map( (_, index) =>  EEntityTypeStr.PGON + index );
    }
    public getColls(): TId[] {
        return this._geom_arrays.dn_colls_objs.map( (_, index) =>  EEntityTypeStr.COLL + index );
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
    public numLines(): number {
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
    public has(id: TId): boolean {
        const [type_str, index]: [string, number] = idBreak(id);
        const geom_arrays_key: string = EEntStrToGeomArray[type_str];
        return (this._geom_arrays[geom_arrays_key][index] !== undefined);
    }
    /**
     * Check if a wire is closed.
     * @param wire_i
     */
    public istWireClosed(wire_i: number): boolean {
        const edges_i: number[] = this._geom_arrays.dn_wires_edges[wire_i];
        return this._geom_arrays.dn_edges_verts[edges_i[0]][0] === this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1];
    }
}
