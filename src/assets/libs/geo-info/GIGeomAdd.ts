import { EEntType, TTri, TFace, Txyz, IGeomMaps, TAttribDataTypes } from './common';
import { triangulate } from '../triangulate/triangulate';
import { GIGeom } from './GIGeom';
import { vecAdd } from '../geom/vectors';

/**
 * Class for geometry.
 */
export class GIGeomAdd {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    // ============================================================================
    // Add geometry
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosi(): number {
        // in this case, there are no down arrays
        // because posis are the bottom of the hierarchy
        // update up arrays
        const posi_i: number = this._geom.modeldata.model.metadata.nextPosi();
        this._geom_maps.up_posis_verts.set(posi_i, []);
        // time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        this._geom_maps.posis_ts.set(posi_i, ts);
        // return entity number
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
        const point_i: number = this._geom.modeldata.model.metadata.nextPoint();
        this._geom_maps.dn_points_verts.set(point_i, vert_i);
        this._geom_maps.up_verts_points.set(vert_i, point_i);
        // time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        this._geom_maps.posis_ts.set(posi_i, ts);
        // return entity number
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
        const pline_i: number = this._geom.modeldata.model.metadata.nextPline();
        this._geom_maps.dn_plines_wires.set(pline_i, wire_i);
        this._geom_maps.up_wires_plines.set(wire_i, pline_i);
        // time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        this._geom_maps.plines_ts.set(pline_i, ts);
        // return entity number
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
        const pgon_i: number = this._geom.modeldata.model.metadata.nextPgon();
        this._geom_maps.dn_pgons_faces.set(pgon_i, face_i);
        this._geom_maps.up_faces_pgons.set(face_i, pgon_i);
        // time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        this._geom_maps.pgons_ts.set(pgon_i, ts);
        // return entity number
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
        parent_i = parent_i === null ? -1 : parent_i;
        // create collection
        const coll_i: number = this._geom.modeldata.model.metadata.nextColl();
        this._geom_maps.dn_colls_points.set(coll_i, points_i);
        this._geom_maps.dn_colls_plines.set(coll_i, plines_i);
        this._geom_maps.dn_colls_pgons.set(coll_i, pgons_i);
        this._geom_maps.up_colls_colls.set(coll_i, parent_i);
        for (const point_i of points_i) {
            if (!this._geom_maps.up_points_colls.has(point_i)) {
                this._geom_maps.up_points_colls.set(point_i, [coll_i]);
            } else {
                this._geom_maps.up_points_colls.get(point_i).push(coll_i);
            }
        }
        for (const pline_i of plines_i) {
            if (!this._geom_maps.up_plines_colls.has(pline_i)) {
                this._geom_maps.up_plines_colls.set(pline_i, [coll_i]);
            } else {
                this._geom_maps.up_plines_colls.get(pline_i).push(coll_i);
            }
        }
        for (const pgon_i of pgons_i) {
            if (!this._geom_maps.up_pgons_colls.has(pgon_i)) {
                this._geom_maps.up_pgons_colls.set(pgon_i, [coll_i]);
            } else {
                this._geom_maps.up_pgons_colls.get(pgon_i).push(coll_i);
            }
        }
        // time stamp
        const ts: number = this._geom.modeldata.model.metadata.getTimeStamp();
        this._geom_maps.colls_ts.set(coll_i, ts);
        // return entity number
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
    public copyMovePosis(posis_i: number|number[], move_vector: Txyz, copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i)) {
            const posi_i: number = posis_i as number;
            const xyz: Txyz = this._geom.modeldata.attribs.query.getPosiCoords(posi_i);
            const new_posi_i: number = this.addPosi();
            this._geom.modeldata.attribs.add.setPosiCoords(new_posi_i, vecAdd(xyz, move_vector));
            if (copy_attribs) {
                const attrib_names: string[] = this._geom.modeldata.attribs.query.getAttribNames(EEntType.POSI);
                for (const attrib_name of attrib_names) {
                    if (attrib_name !== 'xyz') {
                        const value: TAttribDataTypes =
                            this._geom.modeldata.attribs.query.getAttribVal(EEntType.POSI, attrib_name, posis_i) as TAttribDataTypes;
                        this._geom.modeldata.attribs.add.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
                    }
                }
            }
            return new_posi_i;
        } else {
            return (posis_i as number[]).map(posi_i => this.copyPosis(posi_i, copy_attribs)) as number[];
        }
    }
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    public copyPosis(posis_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i)) {
            const posi_i: number = posis_i as number;
            const xyz: Txyz = this._geom.modeldata.attribs.query.getPosiCoords(posi_i);
            const new_posi_i: number = this.addPosi();
            this._geom.modeldata.attribs.add.setPosiCoords(new_posi_i, xyz);
            if (copy_attribs) {
                const attrib_names: string[] = this._geom.modeldata.attribs.query.getAttribNames(EEntType.POSI);
                for (const attrib_name of attrib_names) {
                    const value: TAttribDataTypes =
                        this._geom.modeldata.attribs.query.getAttribVal(EEntType.POSI, attrib_name, posis_i) as TAttribDataTypes;
                    this._geom.modeldata.attribs.add.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
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
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.POINT, old_point_i);
            const new_point_i: number = this.addPoint(posis_i[0]);
            if (copy_attribs) {
                this._geom.modeldata.attribs.add.copyAttribs(EEntType.POINT, old_point_i, new_point_i);
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
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, old_pline_i);
            const wire_i: number = this._geom.nav.navPlineToWire(old_pline_i);
            const is_closed: boolean = this._geom.query.isWireClosed(wire_i);
            const new_pline_i: number = this.addPline(posis_i, is_closed);
            if (copy_attribs) {
                this._geom.modeldata.attribs.add.copyAttribs(EEntType.PLINE, old_pline_i, new_pline_i);
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
            const wires_i: number[] = this._geom.nav.navAnyToWire(EEntType.PGON, old_pgon_i);
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[0] as number);
            let new_pgon_i: number;
            if (wires_i.length === 1) {
                new_pgon_i = this.addPgon(posis_i);
            } else {
                const holes_posis_i: number[][] = [];
                for (let i = 1; i < wires_i.length; i++) {
                    const hole_posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[i] as number);
                    holes_posis_i.push(hole_posis_i);
                }
                new_pgon_i = this.addPgon(posis_i, holes_posis_i);
            }
            if (copy_attribs) {
                this._geom.modeldata.attribs.add.copyAttribs(EEntType.PGON, old_pgon_i, new_pgon_i);
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
            const points_i: number[] = this._geom.nav.navCollToPoint(old_coll_i);
            const res1 = this.copyPoints(points_i, copy_attribs) as number[];
            const plines_i: number[] = this._geom.nav.navCollToPline(old_coll_i);
            const res2 = this.copyPlines(plines_i, copy_attribs) as number[];
            const pgons_i: number[] = this._geom.nav.navCollToPgon(old_coll_i);
            const res3 = this.copyPgons(pgons_i, copy_attribs) as number[];
            const parent: number = this._geom.query.getCollParent(old_coll_i);
            // add the new collection
            const new_coll_i: number = this.addColl(parent, res1, res2, res3);
            // copy the attributes from old collection to new collection
            if (copy_attribs) {
                this._geom.modeldata.attribs.add.copyAttribs(EEntType.COLL, old_coll_i, new_coll_i);
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
     * Adds a vertex and updates the arrays.
     * @param posi_i
     */
    public _addVertex(posi_i: number): number {
        // update down arrays
        const vert_i: number = this._geom.modeldata.model.metadata.nextVert();
        this._geom_maps.dn_verts_posis.set(vert_i, posi_i);
        // update up arrays
        this._geom_maps.up_posis_verts.get(posi_i).push(vert_i);
        // return the numeric index of the vertex
        return vert_i;
    }
    /**
     * Adds an edge from v1 to v2 and updates the up and down arrays.
     * Each vertex passed into this function can have zero or one edges.
     * The new edge is added to v1 and v2
     * Any existing edges are not affected
     * @param vert_i1
     * @param vert_i2
     */
    public _addEdge(vert_i1: number, vert_i2: number): number {
        // update down arrays
        const edge_i: number = this._geom.modeldata.model.metadata.nextEdge();
        this._geom_maps.dn_edges_verts.set(edge_i, [vert_i1, vert_i2]);
        // assume there are three edges, prev, edge_i, next
        // for vert_i1, [prev, edge_i] or [edge_i]
        // update up arrays for the start vertex
        if (!this._geom_maps.up_verts_edges.has(vert_i1)) {
            this._geom_maps.up_verts_edges.set(vert_i1, []);
        }
        switch (this._geom_maps.up_verts_edges.get(vert_i1).length) {
            case 0:
                this._geom_maps.up_verts_edges.set(vert_i1, [edge_i]); // [edge_i]
                break;
            case 1:
                this._geom_maps.up_verts_edges.get(vert_i1)[1] = edge_i; // [prev, edge_i]
                break;
            case 2:
                throw new Error('Vertex must have just zero or one edges.');
            default:
                throw new Error('Vertex has wrong number of edges.');
        }
        // for vert_i2, [edge_i, next] or [edge_i]
        // update up arrays for the end vertex
        if (!this._geom_maps.up_verts_edges.has(vert_i2)) {
            this._geom_maps.up_verts_edges.set(vert_i2, []);
        }
        switch (this._geom_maps.up_verts_edges.get(vert_i2).length) {
            case 0:
                this._geom_maps.up_verts_edges.set(vert_i2, [edge_i]); // [edge_i]
                break;
            case 1:
                const next_edge_i: number = this._geom_maps.up_verts_edges.get(vert_i2)[0];
                this._geom_maps.up_verts_edges.set(vert_i2, [edge_i, next_edge_i]); // [edge_i, next]
                break;
            case 2:
                throw new Error('Vertex must have just zero or one edges.');
            default:
                throw new Error('Vertex has wrong number of edges.');
        }
        // return the numeric index of the edge
        return edge_i;
    }
    /**
     * Adds a wire and updates the arrays.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    public _addWire(edges_i: number[], close: boolean = false): number {
        // update down arrays
        const wire_i: number = this._geom.modeldata.model.metadata.nextWire();
        this._geom_maps.dn_wires_edges.set(wire_i, edges_i);
        // update up arrays
        edges_i.forEach( edge_i => this._geom_maps.up_edges_wires.set(edge_i, wire_i) );
        // return the numeric index of the wire
        return wire_i;
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
        const face: TFace = [wire_i];
        // update down arrays
        const face_i: number = this._geom.modeldata.model.metadata.nextFace();
        this._geom_maps.dn_faces_wires.set(face_i, face);
        this._geom_maps.dn_faces_tris.set(face_i, tris_i);
        // update up arrays
        this._geom_maps.up_wires_faces.set(wire_i, face_i);
        tris_i.forEach( tri_i => this._geom_maps.up_tris_faces.set(tri_i, face_i) );
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
        const face: TFace = [wire_i].concat(holes_wires_i);
        // update down arrays
        const face_i: number = this._geom.modeldata.model.metadata.nextFace();
        this._geom_maps.dn_faces_wires.set(face_i, face);
        this._geom_maps.dn_faces_tris.set(face_i, tris_i);
        // update up arrays
        face.forEach(face_wire_i => this._geom_maps.up_wires_faces.set(face_wire_i, face_i) );
        tris_i.forEach( tri_i => this._geom_maps.up_tris_faces.set(tri_i, face_i) );
        // return the numeric index of the face
        return face_i;
    }
    /**
     * Adds trangles and updates the arrays.
     * Wires are assumed to be closed!
     * This updates the trie->verts and the verts->tris
     * This does not update the face to which this wire belongs!
     * @param wire_i
     */
    public _addTris(wire_i: number, hole_wires_i?: number[]): number[] {
        // save all verts
        const all_verts_i: number[] = [];
        // get the coords of the outer perimeter edge
        const wire_verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.WIRE, wire_i);
        wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
        const wire_posis_i: number[] = wire_verts_i.map(
            vert_i => this._geom_maps.dn_verts_posis.get(vert_i) );
        const wire_coords: Txyz[] = wire_posis_i.map(
            posi_i => this._geom.modeldata.attribs.query.getPosiCoords(posi_i) );
        // get the coords of the holes
        const all_hole_coords: Txyz[][] = [];
        if (hole_wires_i !== undefined) {
            for (const hole_wire_i of hole_wires_i) {
                const hole_wire_verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.WIRE, hole_wire_i);
                hole_wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
                const hole_wire_posis_i: number[] = hole_wire_verts_i.map(
                    vert_i => this._geom_maps.dn_verts_posis.get(vert_i) );
                const hole_wire_coords: Txyz[] = hole_wire_posis_i.map(
                    posi_i => this._geom.modeldata.attribs.query.getPosiCoords(posi_i) );
                all_hole_coords.push(hole_wire_coords);
            }
        }
        // create the triangles
        const tris_corners: number[][] = triangulate(wire_coords, all_hole_coords);
        const tris_verts_i: TTri[] = tris_corners.map(
            tri_corners => tri_corners.map( corner => all_verts_i[corner] ) as TTri );
        // update down arrays, tris->verts
        const tris_i: number[] = [];
        for (const tri_verts_i of tris_verts_i) {
            const tri_i: number = this._geom.modeldata.model.metadata.nextTri();
            this._geom_maps.dn_tris_verts.set(tri_i, tri_verts_i);
            tris_i.push(tri_i);
        }
        // update up arrays, verts->tris
        for (let i = 0; i < tris_verts_i.length; i++) {
            const tri_verts_i: TTri = tris_verts_i[i];
            const tri_i: number = tris_i[i];
            for (const tri_vert_i of tri_verts_i) {
                if (!this._geom_maps.up_verts_tris.has(tri_vert_i) ) {
                    this._geom_maps.up_verts_tris.set(tri_vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(tri_vert_i).push(tri_i);
            }
        }
        // return an array of numeric indices of the triangles
        return tris_i;
    }
}
