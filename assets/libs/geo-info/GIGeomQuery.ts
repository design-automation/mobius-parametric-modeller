
import {  EEntType, IGeomArrays, EEntStrToGeomArray, TWire, Txyz } from './common';
import { isPosi, isVert, isPoint, isEdge, isWire, isPline, isFace, isPgon, isColl, isTri } from './id';
import { GIGeom } from './GIGeom';
import { vecFromTo, vecCross, vecDiv } from '../geom/vectors';
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
    // Get entity indices, and num ents
    // ============================================================================
    /**
     * Returns a list of indices for all, including ents that are null
     * @param ent_type
     */
    public getEnts(ent_type: EEntType, include_deleted: boolean): number[] {
        // get posis indices array from up array: up_posis_verts
        if (isPosi(ent_type)) {
            const posis: number[][] = this._geom_arrays.up_posis_verts;
            const posis_i: number[] = [];
            if (include_deleted) {
                for (let i = 0; i < posis.length; i++ ) {
                    const posi = posis[i];
                    if (posi !== null) {
                        posis_i.push(i);
                    } else {
                        posis_i.push(null); // TODO
                    }
                }
            } else {
                for (let i = 0; i < posis.length; i++ ) {
                    const posi = posis[i];
                    if (posi !== null) {
                        posis_i.push(i);
                    }
                }
            }
            return posis_i;
        }
        // get ents indices array from down arrays
        const geom_array_key: string = EEntStrToGeomArray[ent_type];
        const geom_array: any[] = this._geom_arrays[geom_array_key];
        const ents_i: number[] = [];
        if (include_deleted) {
            for (let i = 0; i < geom_array.length; i++ ) {
                const ent = geom_array[i];
                if (ent !== null) {
                    ents_i.push(i);
                } else {
                    ents_i.push(null); // TODO
                }
            }
        } else {
            for (let i = 0; i < geom_array.length; i++ ) {
                const ent = geom_array[i];
                if (ent !== null) {
                    ents_i.push(i);
                }
            }
        }
        return ents_i;
    }
    /**
     * Returns the number of entities
     * @param ent_type
     */
    public numEnts(ent_type: EEntType, include_deleted: boolean): number {
        return this.getEnts(ent_type, include_deleted).length;
    }
    /**
     * Returns a list of indices for all posis that have no verts
     * @param ent_type
     */
    public getUnusedPosis(include_deleted: boolean): number[] {
        // get posis indices array from up array: up_posis_verts
        const posis: number[][] = this._geom_arrays.up_posis_verts;
        const posis_i: number[] = [];
        if (include_deleted) {
            for (let i = 0; i < posis.length; i++ ) {
                const posi = posis[i];
                if (posi !== null) {
                    if (posi.length === 0) { posis_i.push(i); }
                } else {
                    posis_i.push(null);
                }
            }
        } else {
            for (let i = 0; i < posis.length; i++ ) {
                const posi = posis[i];
                if (posi !== null) {
                    if (posi.length === 0) { posis_i.push(i); }
                }
            }
        }
        return posis_i;
    }
    // ============================================================================
    // Util
    // ============================================================================
    /**
     * Check if an entity exists
     * @param ent_type
     * @param index
     */
    public entExists(ent_type: EEntType, index: number): boolean {
        const geom_arrays_key: string = EEntStrToGeomArray[ent_type];
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
     * Returns the vertices.
     * For a closed wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     * @param wire_i
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
    /**
     * Get the parent of a collection.
     * @param coll_i
     */
    public getCollParent(coll_i: number): number {
        return this._geom_arrays.dn_colls_objs[coll_i][0];
    }
    /**
     *
     * @param face_i
     */
    public getFaceBoundary(face_i: number): number {
        const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
        return wires_i[0];
    }
    /**
     *
     * @param face_i
     */
    public getFaceHoles(face_i: number): number[] {
        const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
        return wires_i.slice(1);
    }
    /**
     *
     * @param ent_i
     */
    public getCentroid(ent_type: EEntType, ent_i: number): Txyz {
        const posis_i: number[] = this.navAnyToPosi(ent_type, ent_i);
        const centroid: Txyz = [0, 0, 0];
        for (const posi_i of posis_i) {
            const xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(posi_i);
            centroid[0] += xyz[0];
            centroid[1] += xyz[1];
            centroid[2] += xyz[2];
        }
        return vecDiv(centroid, posis_i.length);
    }
    /**
     *
     * @param face_i
     */
    public getFaceNormal(face_i: number): Txyz {
        const normal: Txyz = [0, 0, 0];
        const tris_i: number[] = this._geom._geom_arrays.dn_faces_wirestris[face_i][1];
        let count = 0;
        for (const tri_i of tris_i) {
            const posis_i: number[] = this._geom_arrays.dn_tris_verts[tri_i].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyzs: Txyz[] = posis_i.map(posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(xyzs[0], xyzs[1]);
            const vec_b: Txyz = vecFromTo(xyzs[0], xyzs[2]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                count += 1;
                normal[0] += tri_normal[0];
                normal[1] += tri_normal[1];
                normal[2] += tri_normal[2];
            }
        }
        if (count === 0) { return [0, 0, 0]; }
        return vecDiv(normal, count);
    }
    /**
     *
     * @param wire_i
     */
    public getWireNormal(wire_i: number): Txyz {
        const centroid: Txyz = this.getCentroid(EEntType.WIRE, wire_i);
        const edges_i: number[] = this._geom._geom_arrays.dn_wires_edges[wire_i];
        const normal: Txyz = [0, 0, 0];
        let count = 0;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_arrays.dn_edges_verts[edge_i].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyzs: Txyz[] = posis_i.map(posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(centroid, xyzs[0]);
            const vec_b: Txyz = vecFromTo(centroid, xyzs[1]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                count += 1;
                normal[0] += tri_normal[0];
                normal[1] += tri_normal[1];
                normal[2] += tri_normal[2];
            }
        }
        if (count === 0) { return [0, 0, 0]; }
        return vecDiv(normal, count);
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
    // ============================================================================
    // Navigate from any level to ? (up or down)
    // ============================================================================
    /**
     * Navigate from any level to the colls
     * @param ent_type
     * @param index
     */
    public navAnyToColl(ent_type: EEntType, index: number): number[] {
        if (isColl(ent_type)) { return [index]; }
        const points_i: number[] = this.navAnyToPoint(ent_type, index);
        const colls1_i: number[] = [].concat(...points_i.map(point_i => this.navPointToColl(point_i)));
        const plines_i: number[] = this.navAnyToPline(ent_type, index);
        const colls2_i: number[] = [].concat(...plines_i.map(pline_i => this.navPlineToColl(pline_i)));
        const pgons_i: number[] = this.navAnyToPgon(ent_type, index);
        const colls3_i: number[] = [].concat(...pgons_i.map(pgon_i => this.navPgonToColl(pgon_i)));
        return Array.from(new Set([...colls1_i, ...colls2_i, ...colls3_i])).filter(coll_i => coll_i !== undefined); // remove duplicates
    }
    /**
     * Navigate from any level to the pgons
     * @param ent_type
     * @param index
     */
    public navAnyToPgon(ent_type: EEntType, index: number): number[] {
        if (isPgon(ent_type)) { return [index]; }
        const faces_i: number[] = this.navAnyToFace(ent_type, index);
        return faces_i.map( face_i => this.navFaceToPgon(face_i) ).filter(pgon_i => pgon_i !== undefined);
    }
    /**
     * Navigate from any level to the plines
     * @param ent_type
     * @param index
     */
    public navAnyToPline(ent_type: EEntType, index: number): number[] {
        if (isPline(ent_type)) { return [index]; }
        const wires_i: number[] = this.navAnyToWire(ent_type, index);
        return wires_i.map( wire_i => this.navWireToPline(wire_i) ).filter(pline_i => pline_i !== undefined);
    }
    /**
     * Navigate from any level to the points
     * @param ent_type
     * @param index
     */
    public navAnyToPoint(ent_type: EEntType, index: number): number[] {
        if (isPoint(ent_type)) { return [index]; }
        const verts_i: number[] = this.navAnyToVert(ent_type, index);
        return verts_i.map( vert_i => this.navVertToPoint(vert_i) ).filter(point_i => point_i !== undefined);
    }
    /**
     * Navigate from any level to the faces
     * @param ent_type
     * @param index
     */
    public navAnyToFace(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navAnyToFace(EEntType.VERT, vert_i) ));
        } else if (isVert(ent_type)) {
            const edges_i: number[] = this.navVertToEdge(index);
            return [].concat(...edges_i.map( edge_i => this.navAnyToFace(EEntType.EDGE, edge_i) ));
        } else if (isTri(ent_type)) {
            return [this.navTriToFace(index)];
        } else if (isEdge(ent_type)) {
            const wire_i: number = this.navEdgeToWire(index);
            return this.navAnyToFace(EEntType.WIRE, wire_i);
        } else if (isWire(ent_type)) {
            return [this.navWireToFace(index)];
        } else if (isFace(ent_type)) { // target
            return [index];
        } else if (isPoint(ent_type)) {
            return [];
        } else if (isPline(ent_type)) {
            return [];
        } else if (isPgon(ent_type)) {
            return [this.navPgonToFace(index)];
        } else if (isColl(ent_type)) {
            const pgons_i: number[] = this.navCollToPgon(index);
            return pgons_i.map(pgon_i => this.navPgonToFace(pgon_i));
        }
        throw new Error('Bad navigation: ' + ent_type + index);
    }
    /**
     * Navigate from any level to the wires
     * @param ent_type
     * @param index
     */
    public navAnyToWire(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navAnyToWire(EEntType.VERT, vert_i) ));
        } else if (isVert(ent_type)) {
            const edges_i: number[] = this.navVertToEdge(index);
            return [].concat(...edges_i.map( edge_i => this.navEdgeToWire(edge_i) ));
        } else if (isTri(ent_type)) {
            return [];
        } else if (isEdge(ent_type)) {
            return [this.navEdgeToWire(index)];
        } else if (isWire(ent_type)) { // target
            return [index];
        } else if (isFace(ent_type)) {
            return this.navFaceToWire(index);
        } else if (isPoint(ent_type)) {
            return [];
        } else if (isPline(ent_type)) {
            return [this.navPlineToWire(index)];
        } else if (isPgon(ent_type)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navFaceToWire(face_i);
        } else if (isColl(ent_type)) {
            const plines_i: number[] = this.navCollToPline(index);
            const wires1_i: number[] = [].concat(...plines_i.map(pline_i => this.navAnyToWire(EEntType.PLINE, pline_i)));
            const pgons_i: number[] = this.navCollToPgon(index);
            const wires2_i: number[] = [].concat(...pgons_i.map(pgon_i => this.navAnyToWire(EEntType.PGON, pgon_i)));
            return [...wires1_i, ...wires2_i];
        }
        throw new Error('Bad navigation: ' + ent_type + index);
    }
    /**
     * Navigate from any level to the edges
     * @param ent_type
     * @param index
     */
    public navAnyToEdge(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map( vert_i => this.navVertToEdge(vert_i) ));
        } else if (isVert(ent_type)) {
            return this.navVertToEdge(index);
        } else if (isTri(ent_type)) {
            return [];
        } else if (isEdge(ent_type)) {
            return [index];
        } else if (isWire(ent_type)) {
            return this.navWireToEdge(index);
        } else if (isFace(ent_type)) {
            const wires_i: number[] = this.navFaceToWire(index);
            return [].concat(...wires_i.map(wire_i => this.navWireToEdge(wire_i)));
        } else if (isPoint(ent_type)) {
            return [];
        } else if (isPline(ent_type)) {
            const wire_i: number = this.navPlineToWire(index);
            return this.navAnyToEdge(EEntType.WIRE, wire_i);
        } else if (isPgon(ent_type)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navAnyToEdge(EEntType.FACE, face_i);
        } else if (isColl(ent_type)) {
            const plines_i: number[] = this.navCollToPline(index);
            const edges1_i: number[] = [].concat(plines_i.map( pline_i => this.navAnyToEdge(EEntType.PLINE, pline_i) ));
            const pgons_i:  number[] = this.navCollToPgon(index);
            const edges2_i: number[] = [].concat(pgons_i.map( pgon_i => this.navAnyToEdge(EEntType.PGON, pgon_i) ));
            return [...edges1_i, ...edges2_i];
        }
        throw new Error('Bad navigation: ' + ent_type + index);
    }
    /**
     * Navigate from any level to the vertices
     * @param ent_type
     * @param index
     */
    public navAnyToVert(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) {
            return this.navPosiToVert(index);
        } else if (isVert(ent_type)) {
            return [index];
        } else if (isTri(ent_type)) {
            return this.navTriToVert(index);
        } else if (isEdge(ent_type)) {
            return this.navEdgeToVert(index);
        } else if (isWire(ent_type)) {
            return this.getWireVerts(index); // avoids duplicate verts
        } else if (isFace(ent_type)) {
            const wires_i: number[] = this.navFaceToWire(index);
            return [].concat(...wires_i.map(wire_i => this.getWireVerts(wire_i))); // avoids duplicate verts
        } else if (isPoint(ent_type)) {
            return  [this.navPointToVert(index)];
        } else if (isPline(ent_type)) {
            const wire_i: number = this.navPlineToWire(index);
            return this.navAnyToVert(EEntType.WIRE, wire_i);
        } else if (isPgon(ent_type)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navAnyToVert(EEntType.FACE, face_i);
        } else if (isColl(ent_type)) {
            const points_i: number[] = this.navCollToPoint(index);
            const verts1_i: number[] = [].concat(points_i.map( point_i => this.navAnyToVert(EEntType.POINT, point_i) ));
            const plines_i: number[] = this.navCollToPline(index);
            const verts2_i: number[] = [].concat(plines_i.map( pline_i => this.navAnyToVert(EEntType.PLINE, pline_i) ));
            const pgons_i:  number[] = this.navCollToPgon(index);
            const verts3_i: number[] = [].concat(pgons_i.map( pgon_i => this.navAnyToVert(EEntType.PGON, pgon_i) ));
            return [...verts1_i, ...verts2_i, ...verts3_i];
        }
        throw new Error('Bad navigation: ' + ent_type + index);
    }
    /**
     * Navigate from any level to the triangles
     * @param ent_type
     * @param index
     */
    public navAnyToTri(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) {
            const verts_i: number[] = this.navPosiToVert(index);
            return [].concat(...verts_i.map(vert_i => this.navVertToTri(vert_i)));
        } else if (isVert(ent_type)) {
            return this.navVertToTri(index);
        } else if (isTri(ent_type)) {
            return [index];
        } else if (isEdge(ent_type)) {
            return [];
        } else if (isWire(ent_type)) {
            return [];
        } else if (isFace(ent_type)) {
            return this.navFaceToTri(index);
        } else if (isPoint(ent_type)) {
            return [];
        } else if (isPline(ent_type)) {
            return [];
        } else if (isPgon(ent_type)) {
            const face_i: number = this.navPgonToFace(index);
            return this.navFaceToTri(face_i);
        } else if (isColl(ent_type)) {
            const pgons_i:  number[] = this.navCollToPgon(index);
            return [].concat(pgons_i.map( pgon_i => this.navAnyToTri(EEntType.PGON, pgon_i) ));
        }
        throw new Error('Bad navigation: ' + ent_type + index);
    }
    /**
     * Navigate from any level to the positions
     * @param ent_type
     * @param index
     */
    public navAnyToPosi(ent_type: EEntType, index: number): number[] {
        if (isPosi(ent_type)) { return [index]; }
        const verts_i: number[] = this.navAnyToVert(ent_type, index);
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
    public navAnyToAny(from_ets: EEntType, to_ets: EEntType, index: number): number[] {
        // same level
        if (from_ets === to_ets) { return [index]; }
        // from -> to
        switch (to_ets) {
            case EEntType.POSI:
                return this.navAnyToPosi(from_ets, index);
            case EEntType.VERT:
                return this.navAnyToVert(from_ets, index);
            case EEntType.EDGE:
                return this.navAnyToEdge(from_ets, index);
            case EEntType.WIRE:
                return this.navAnyToWire(from_ets, index);
            case EEntType.FACE:
                return this.navAnyToFace(from_ets, index);
            case EEntType.POINT:
                return this.navAnyToPoint(from_ets, index);
            case EEntType.PLINE:
                return this.navAnyToPline(from_ets, index);
            case EEntType.PGON:
                return this.navAnyToPgon(from_ets, index);
            case EEntType.COLL:
                return this.navAnyToColl(from_ets, index);
            default:
                throw new Error('Bad navigation: ' + to_ets + index);
        }
    }
    // ============================================================================
    // Other methods
    // ============================================================================
    /**
     * Get the welded neighbour vertices of a set of vertices.
     * @param ent_type
     * @param index
     */
    public neighbours(from_ets: EEntType, to_ets: EEntType, index: number): number[] {
        const verts_i: number[] = this.navAnyToVert(from_ets, index);
        const posis_i: number[] = this.navAnyToPosi(from_ets, index);
        const neighbour_ents_i: Set<number> = new Set();
        for (const posi_i of posis_i) {
            const found_verts_i: number[] = this.navPosiToVert(posi_i);
            for (const found_vert_i of found_verts_i) {
                if (verts_i.indexOf(found_vert_i) === -1) {
                    const found_ents_i: number[] = this.navAnyToAny(EEntType.VERT, to_ets, found_vert_i);
                    found_ents_i.forEach( found_ent_i => neighbour_ents_i.add(found_ent_i));
                }
            }
        }
        return Array.from(neighbour_ents_i);
    }

}
