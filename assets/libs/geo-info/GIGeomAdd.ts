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
            if (this._geom_arrays.up_plines_colls[pline_i] === undefined) {
                this._geom_arrays.up_plines_colls[pline_i] = [coll_i];
            } else {
                this._geom_arrays.up_plines_colls[pline_i].push(coll_i);
            }
        }
        for (const pgon_i of pgons_i) {
            if (this._geom_arrays.up_pgons_colls[pgon_i] === undefined) {
                this._geom_arrays.up_pgons_colls[pgon_i] = [coll_i];
            } else {
                this._geom_arrays.up_pgons_colls[pgon_i].push(coll_i);
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
    // Methods to create the topological entities
    // These methods have been made public for access from GIGeomModify
    // They should not be called externally, hence the underscore.
    // ============================================================================
    /**
     * Adds a position and updates the arrays.
     */
    public _addPosi(): number {
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
    public _addVertex(posi_i: number): number {
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
    public _addEdge(vert_i1: number, vert_i2: number): number {
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
    public _addWire(edges_i: number[], close: boolean = false): number {
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
    public _addTris(wire_i: number, hole_wires_i?: number[]): number[] {
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
    public _addFace(wire_i: number): number {
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
    public _addFaceWithHoles(wire_i: number, holes_wires_i: number[]): number {
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
}
