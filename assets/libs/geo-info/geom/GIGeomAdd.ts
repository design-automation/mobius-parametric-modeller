import { EEntType, TTri, Txyz, IGeomMaps, TAttribDataTypes, EAttribNames, TPgon } from '../common';
import { triangulate } from '../../triangulate/triangulate';
import { vecAdd } from '../../geom/vectors';
import { GIModelData } from '../GIModelData';

/**
 * Class for geometry.
 */
export class GIGeomAdd {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Add geometry
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    public addPosi(): number {
        const ssid: number = this.modeldata.active_ssid;
        // in this case, there are no down arrays
        // because posis are the bottom of the hierarchy
        // update up arrays
        const posi_i: number = this.modeldata.model.metadata.nextPosi();
        this._geom_maps.up_posis_verts.set(posi_i, []);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, posi_i);
        // return entity number
        return posi_i;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_i The position for the point.
     */
    public addPoint(posi_i: number): number {
        const ssid: number = this.modeldata.active_ssid;
        // create vert
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i: number = this.modeldata.model.metadata.nextPoint();
        this._geom_maps.dn_points_verts.set(point_i, vert_i);
        this._geom_maps.up_verts_points.set(vert_i, point_i);
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, point_i,
            EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POINT, point_i);
        // return entity number
        return point_i;
    }
    /**
     * Adds a new pline entity to the model using numeric indices.
     * @param posis_i
     */
    public addPline(posis_i: number[], close: boolean = false): number {
        const ssid: number = this.modeldata.active_ssid;
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
        const pline_i: number = this.modeldata.model.metadata.nextPline();
        this._geom_maps.dn_plines_wires.set(pline_i, wire_i);
        this._geom_maps.up_wires_plines.set(wire_i, pline_i);
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i,
            EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PLINE, pline_i);
        // return entity number
        return pline_i;
    }
    /**
     * Adds a new polygon + hole entity to the model using numeric indices.
     * @param posis_id
     */
    public addPgon(posis_i: number[], holes_posis_i?: number[][]): number {
        const ssid: number = this.modeldata.active_ssid;
        const has_holes: boolean = (holes_posis_i !== undefined) && (holes_posis_i.length) ? true : false ;
        // create verts, edges, wire for face
        const vert_i_arr: number[] = posis_i.map( posi_i => this._addVertex(posi_i));
        const edges_i_arr: number[] = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push( this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push( this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        const wire_i: number = this._addWire(edges_i_arr, true);
        let pgon_i: number;
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
            // create the new pgon with a hole
            pgon_i = this._addPgonWithHoles(wire_i, holes_wires_i);
        } else {
            // create the new pgon without a hole
            pgon_i = this._addPgonWithoutHoles(wire_i);
        }
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i,
            EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PGON, pgon_i);
        // return entity number
        return pgon_i;
    }
    /**
     * Adds a collection.
     * @param parent_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public addColl(): number {
        const ssid: number = this.modeldata.active_ssid;
        // create collection
        const coll_i: number = this.modeldata.model.metadata.nextColl();
        this._geom_maps.colls.add(coll_i);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, coll_i);
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
    public copyMovePosi(posi_i: number, move_vector: Txyz, copy_attribs: boolean): number {
        const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const new_posi_i: number = this.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, vecAdd(xyz, move_vector));
        if (copy_attribs) {
            const attrib_names: string[] = this.modeldata.attribs.getAttribNames(EEntType.POSI);
            for (const attrib_name of attrib_names) {
                if (attrib_name !== 'xyz') {
                    const value: TAttribDataTypes =
                        this.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, posi_i, attrib_name) as TAttribDataTypes;
                    this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
                }
            }
        }
        return new_posi_i;
    }
    public copyMovePosis(posis_i: number|number[], move_vector: Txyz, copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i))  { return this.copyMovePosi(posis_i, move_vector, copy_attribs); }
        return (posis_i as number[]).map(posi_i => this.copyMovePosi(posi_i, move_vector, copy_attribs)) as number[];
    }
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    public copyPosi(posi_i: number, copy_attribs: boolean): number {
        const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const new_posi_i: number = this.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, xyz);
        if (copy_attribs) {
            const attrib_names: string[] = this.modeldata.attribs.getAttribNames(EEntType.POSI);
            for (const attrib_name of attrib_names) {
                const value: TAttribDataTypes =
                    this.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, posi_i, attrib_name) as TAttribDataTypes;
                this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
            }
        }
        return new_posi_i;
    }
    public copyPosis(posis_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(posis_i))  { return this.copyPosi(posis_i, copy_attribs); }
        return (posis_i as number[]).map(posi_i => this.copyPosi(posi_i, copy_attribs)) as number[];
    }
    /**
     * Copy points.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPoint(old_point_i: number, copy_attribs: boolean): number {
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, old_point_i);
        const new_point_i: number = this.addPoint(posis_i[0]);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.POINT, old_point_i, new_point_i);
            const old_vert_i: number = this.modeldata.geom.nav.navPointToVert(old_point_i);
            const new_vert_i: number = this.modeldata.geom.nav.navPointToVert(new_point_i);
            this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_vert_i, new_vert_i);
        }
        // return the new point
        return new_point_i;
    }
    public copyPoints(points_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(points_i))  { return this.copyPoint(points_i, copy_attribs); }
        return (points_i as number[]).map(point_i => this.copyPoint(point_i, copy_attribs)) as number[];
    }
    /**
     * Copy plines.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPline(old_pline_i: number, copy_attribs: boolean): number {
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, old_pline_i);
        const wire_i: number = this.modeldata.geom.nav.navPlineToWire(old_pline_i);
        const is_closed: boolean = this.modeldata.geom.query.isWireClosed(wire_i);
        const new_pline_i: number = this.addPline(posis_i, is_closed);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.PLINE, old_pline_i, new_pline_i);
            const old_topo: [number[], number[], number[]] = this.modeldata.geom.query.getObjTopo(EEntType.PLINE, old_pline_i);
            const new_topo: [number[], number[], number[]] = this.modeldata.geom.query.getObjTopo(EEntType.PLINE, new_pline_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
            }
        }
        // return the new polyline
        return new_pline_i;
    }
    public copyPlines(plines_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(plines_i))  { return this.copyPline(plines_i, copy_attribs); }
        return (plines_i as number[]).map(pline_i => this.copyPline(pline_i, copy_attribs)) as number[];
    }
    /**
     * Copy polygon.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    public copyPgon(old_pgon_i: number, copy_attribs: boolean): number {
        const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(EEntType.PGON, old_pgon_i);
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[0] as number);
        let new_pgon_i: number;
        if (wires_i.length === 1) {
            new_pgon_i = this.addPgon(posis_i);
        } else {
            const holes_posis_i: number[][] = [];
            for (let i = 1; i < wires_i.length; i++) {
                const hole_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[i] as number);
                holes_posis_i.push(hole_posis_i);
            }
            new_pgon_i = this.addPgon(posis_i, holes_posis_i);
        }
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.PGON, old_pgon_i, new_pgon_i);
            const old_topo: [number[], number[], number[]] = this.modeldata.geom.query.getObjTopo(EEntType.PGON, old_pgon_i);
            const new_topo: [number[], number[], number[]] = this.modeldata.geom.query.getObjTopo(EEntType.PGON, new_pgon_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
            }
        }
        // return the new polygon
        return new_pgon_i;
    }
    public copyPgons(pgons_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(pgons_i))  { return this.copyPgon(pgons_i, copy_attribs); }
        return (pgons_i as number[]).map(pgon_i => this.copyPgon(pgon_i, copy_attribs)) as number[];
    }
   /**
     * Copy a collection
     * Also makes copies of all ents in the collection, and all sub collections.
     * @param ent_type
     * @param index
     * @param copy_posis
     * @param copy_attribs
     */
    public copyColl(old_coll_i: number, copy_attribs: boolean): number {
        const ssid: number = this.modeldata.active_ssid;
        // add the new collection
        const new_coll_i: number = this.addColl();
        // set the content
        const coll_points_i: number[] = this.copyPoints(this.modeldata.geom.snapshot.getCollPoints(ssid, old_coll_i), copy_attribs) as number[];
        if (coll_points_i !== undefined) { this.modeldata.geom.snapshot.addCollPoints(ssid, new_coll_i, coll_points_i); }
        const coll_plines_i: number[] = this.copyPlines(this.modeldata.geom.snapshot.getCollPlines(ssid, old_coll_i), copy_attribs) as number[];
        if (coll_plines_i !== undefined) { this.modeldata.geom.snapshot.addCollPlines(ssid, new_coll_i, coll_plines_i); }
        const coll_pgons_i: number[] = this.copyPgons(this.modeldata.geom.snapshot.getCollPgons(ssid, old_coll_i), copy_attribs) as number[];
        if (coll_pgons_i !== undefined) { this.modeldata.geom.snapshot.addCollPgons(ssid, new_coll_i, coll_pgons_i); }
        const coll_childs: number[] = this.copyColls(this.modeldata.geom.snapshot.getCollChildren(ssid, old_coll_i), copy_attribs) as number[];
        if (coll_childs !== undefined) { this.modeldata.geom.snapshot.addCollChildren(ssid, new_coll_i, coll_childs); }
        const coll_parent_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, old_coll_i);
        if (coll_parent_i !== undefined) { this.modeldata.geom.snapshot.setCollParent(ssid, new_coll_i, coll_parent_i); }
        // TODO check for infinite loop when getting coll children
        //
        // copy the attributes from old collection to new collection
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.COLL, old_coll_i, new_coll_i);
        }
        // return the new collection
        return new_coll_i;
    }
    public copyColls(colls_i: number|number[], copy_attribs: boolean): number|number[] {
        if (!Array.isArray(colls_i))  { return this.copyColl(colls_i, copy_attribs); }
        return (colls_i as number[]).map(coll_i => this.copyColl(coll_i, copy_attribs)) as number[];
    }
    // ============================================================================
    // Methods to create pgons
    // ============================================================================
    /**
     * Adds a pgon and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    public _addPgonWithoutHoles(wire_i: number): number {
        // create the triangles
        const tris_i: number[] = this._addTris(wire_i);
        // create the wires
        const wires_i: number[] = [wire_i];
        // update down arrays
        const pgon_i: number = this.modeldata.model.metadata.nextPgon();
        this._geom_maps.dn_pgons_wires.set(pgon_i, wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        this._geom_maps.up_wires_pgons.set(wire_i, pgon_i);
        tris_i.forEach( tri_i => this._geom_maps.up_tris_pgons.set(tri_i, pgon_i) );
        // return the numeric index of the face
        return pgon_i;
    }
    /**
     * Adds a face with a hole and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    public _addPgonWithHoles(wire_i: number, holes_wires_i: number[]): number {
        // create the triangles
        const tris_i: number[] = this._addTris(wire_i, holes_wires_i);
        // create the wires
        const wires_i: number[] = [wire_i].concat(holes_wires_i);
        // update down arrays
        const pgon_i: number = this.modeldata.model.metadata.nextPgon();
        this._geom_maps.dn_pgons_wires.set(pgon_i, wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        wires_i.forEach( pgon_wire_i => this._geom_maps.up_wires_pgons.set(pgon_wire_i, pgon_i) );
        tris_i.forEach( pgon_tri_i => this._geom_maps.up_tris_pgons.set(pgon_tri_i, pgon_i) );
        // return the numeric index of the face
        return pgon_i;
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
        const vert_i: number = this.modeldata.model.metadata.nextVert();
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
        const edge_i: number = this.modeldata.model.metadata.nextEdge();
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
        const wire_i: number = this.modeldata.model.metadata.nextWire();
        this._geom_maps.dn_wires_edges.set(wire_i, edges_i);
        // update up arrays
        edges_i.forEach( edge_i => this._geom_maps.up_edges_wires.set(edge_i, wire_i) );
        // return the numeric index of the wire
        return wire_i;
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
        const wire_verts_i: number[] = this.modeldata.geom.nav.navAnyToVert(EEntType.WIRE, wire_i);
        wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
        const wire_posis_i: number[] = wire_verts_i.map(
            vert_i => this._geom_maps.dn_verts_posis.get(vert_i) );
        const wire_coords: Txyz[] = wire_posis_i.map(
            posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i) );
        // get the coords of the holes
        const all_hole_coords: Txyz[][] = [];
        if (hole_wires_i !== undefined) {
            for (const hole_wire_i of hole_wires_i) {
                const hole_wire_verts_i: number[] = this.modeldata.geom.nav.navAnyToVert(EEntType.WIRE, hole_wire_i);
                hole_wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
                const hole_wire_posis_i: number[] = hole_wire_verts_i.map(
                    vert_i => this._geom_maps.dn_verts_posis.get(vert_i) );
                const hole_wire_coords: Txyz[] = hole_wire_posis_i.map(
                    posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i) );
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
            const tri_i: number = this.modeldata.model.metadata.nextTri();
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
