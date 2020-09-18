import { IGeomMaps, EEntType, IEntSets, TTri, TEdge, TWire, EEntStrToGeomMaps } from './common';
import { GIGeom } from './GIGeom';
import { cloneDeepMapArr } from './common_func';

/**
 * Class for dumping geometry from another model into this model.
 * When dumping, no conflict detection is preformed.
 * Typically, this model is assumed to be empty.
 */
export class GIGeomDump {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    /**
     * Adds data to this model from another model.
     * The data is deep copied.
     * No conflict detection is performed.
     * Typically, this model is assumed to be empty.
     * @param geom_maps The geom_arrays of the other model.
     */
    public dump(geom_maps: IGeomMaps): void {
        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
        // may deep copys of all maps
        this._geom_maps.dn_points_verts = new Map(geom_maps.dn_points_verts);
        this._geom_maps.dn_plines_wires = new Map(geom_maps.dn_plines_wires);
        this._geom_maps.dn_pgons_faces = new Map(geom_maps.dn_pgons_faces);
        this._geom_maps.dn_colls_points = cloneDeepMapArr(geom_maps.dn_colls_points);
        this._geom_maps.dn_colls_plines = cloneDeepMapArr(geom_maps.dn_colls_plines);
        this._geom_maps.dn_colls_pgons = cloneDeepMapArr(geom_maps.dn_colls_pgons);
        this._geom_maps.dn_verts_posis = new Map(geom_maps.dn_verts_posis);
        this._geom_maps.dn_tris_verts = cloneDeepMapArr(geom_maps.dn_tris_verts) as Map<number, TTri>;
        this._geom_maps.dn_edges_verts = cloneDeepMapArr(geom_maps.dn_edges_verts) as Map<number, TEdge>;
        this._geom_maps.dn_wires_edges = cloneDeepMapArr(geom_maps.dn_wires_edges) as Map<number, TWire>;
        this._geom_maps.dn_faces_wires = cloneDeepMapArr(geom_maps.dn_faces_wires);
        this._geom_maps.dn_faces_tris = cloneDeepMapArr(geom_maps.dn_faces_tris);
        // ======================================================================
        this._geom_maps.up_posis_verts = cloneDeepMapArr(geom_maps.up_posis_verts);
        this._geom_maps.up_verts_tris = cloneDeepMapArr(geom_maps.up_verts_tris);
        this._geom_maps.up_tris_faces = new Map(geom_maps.up_tris_faces);
        this._geom_maps.up_verts_edges = cloneDeepMapArr(geom_maps.up_verts_edges);
        this._geom_maps.up_edges_wires = new Map(geom_maps.up_edges_wires);
        this._geom_maps.up_wires_faces = new Map(geom_maps.up_wires_faces);
        this._geom_maps.up_verts_points = new Map(geom_maps.up_verts_points);
        this._geom_maps.up_wires_plines = new Map(geom_maps.up_wires_plines);
        this._geom_maps.up_faces_pgons = new Map(geom_maps.up_faces_pgons);
        this._geom_maps.up_points_colls = cloneDeepMapArr(geom_maps.up_points_colls);
        this._geom_maps.up_plines_colls = cloneDeepMapArr(geom_maps.up_plines_colls);
        this._geom_maps.up_pgons_colls = cloneDeepMapArr(geom_maps.up_pgons_colls);
        this._geom_maps.up_colls_colls = new Map(geom_maps.up_colls_colls);
        // ======================================================================
        this._geom_maps.posis_ts = new Map(geom_maps.posis_ts);
        this._geom_maps.points_ts = new Map(geom_maps.points_ts);
        this._geom_maps.plines_ts = new Map(geom_maps.plines_ts);
        this._geom_maps.pgons_ts = new Map(geom_maps.pgons_ts);
        this._geom_maps.colls_ts = new Map(geom_maps.colls_ts);
        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
    }
    /**
     * Adds data to this model from another model.
     * The data is deep copied.
     * No conflict detection is performed.
     * Typically, this model is assumed to be empty.
     * If ent_sets is null, do nothing.
     * @param geom_maps The geom_arrays of the other model.
     */
    public dumpEnts(other_geom: GIGeom, ent_sets: IEntSets): void {
        if (ent_sets === null) { return; }
        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
        //
        const geom_maps: IGeomMaps = other_geom._geom_maps;
        // ======================================================================
        this._dumpPosisTSDeepCopy(other_geom, ent_sets.posis_i, ent_sets.verts_i);
        this._dumpObjsTS(other_geom, EEntType.POINT, ent_sets.points_i);
        this._dumpObjsTS(other_geom, EEntType.PLINE, ent_sets.plines_i);
        this._dumpObjsTS(other_geom, EEntType.PGON, ent_sets.pgons_i);
        this._dumpCollsTS(other_geom, ent_sets.colls_i);
        // ======================================================================
        this._dumpEnts(this._geom_maps.dn_verts_posis, geom_maps.dn_verts_posis, ent_sets.verts_i);
        this._dumpEntsDeepCopy(this._geom_maps.dn_tris_verts, geom_maps.dn_tris_verts, ent_sets.tris_i);
        this._dumpEntsDeepCopy(this._geom_maps.dn_edges_verts, geom_maps.dn_edges_verts, ent_sets.edges_i);
        this._dumpEntsDeepCopy(this._geom_maps.dn_wires_edges, geom_maps.dn_wires_edges, ent_sets.wires_i);
        this._dumpEntsDeepCopy(this._geom_maps.dn_faces_wires, geom_maps.dn_faces_wires, ent_sets.faces_i);
        this._dumpEntsDeepCopy(this._geom_maps.dn_faces_tris, geom_maps.dn_faces_tris, ent_sets.faces_i);
        this._dumpDnCollsObjsDeepCopy(this._geom_maps.dn_colls_points, geom_maps.dn_colls_points, ent_sets.colls_i, ent_sets.points_i);
        this._dumpDnCollsObjsDeepCopy(this._geom_maps.dn_colls_plines, geom_maps.dn_colls_plines, ent_sets.colls_i, ent_sets.plines_i);
        this._dumpDnCollsObjsDeepCopy(this._geom_maps.dn_colls_pgons, geom_maps.dn_colls_pgons, ent_sets.colls_i, ent_sets.pgons_i);
        // ======================================================================
        this._dumpEntsDeepCopy(this._geom_maps.up_verts_tris,   geom_maps.up_verts_tris,   ent_sets.verts_i);
        this._dumpEnts(this._geom_maps.up_tris_faces,   geom_maps.up_tris_faces,   ent_sets.tris_i);
        this._dumpEntsDeepCopy(this._geom_maps.up_verts_edges,  geom_maps.up_verts_edges,  ent_sets.verts_i);
        this._dumpEnts(this._geom_maps.up_edges_wires,  geom_maps.up_edges_wires,  ent_sets.edges_i);
        this._dumpEnts(this._geom_maps.up_wires_faces,  geom_maps.up_wires_faces,  ent_sets.wires_i);
        this._dumpEnts(this._geom_maps.up_verts_points, geom_maps.up_verts_points, ent_sets.verts_i);
        this._dumpEnts(this._geom_maps.up_wires_plines, geom_maps.up_wires_plines, ent_sets.wires_i);
        this._dumpEnts(this._geom_maps.up_faces_pgons,  geom_maps.up_faces_pgons,  ent_sets.faces_i);
        this._dumpUpObjsCollsDeepCopy(this._geom_maps.up_points_colls, geom_maps.up_points_colls, ent_sets.points_i, ent_sets.colls_i);
        this._dumpUpObjsCollsDeepCopy(this._geom_maps.up_plines_colls, geom_maps.up_plines_colls, ent_sets.plines_i, ent_sets.colls_i);
        this._dumpUpObjsCollsDeepCopy(this._geom_maps.up_pgons_colls,  geom_maps.up_pgons_colls,  ent_sets.pgons_i, ent_sets.colls_i);
        // ======================================================================
        // time stamp updated in _dumpPosiObjCollSelect() method

        // TODO if the objs are in colls, but the colls are deleted, then the objs refs to teh colls need to be removed as well

        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
    }

    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    /**
     * Entities without time stamps
     * @param this_map
     * @param other_map
     * @param other_ents_i
     */
    private _dumpEntsDeepCopy(this_map: Map<number, number[]>, other_map: Map<number, number[]>, other_ents_i: Set<number>): void {
        other_ents_i.forEach( ent_i => {
            const other_ent = other_map.get(ent_i);
            if (other_ent !== undefined) {
                this_map.set(ent_i, other_ent.slice()); // deep copy
            }
        });
    }
    /**
     * dn_colls_points
     * dn_colls_plines
     * dn_colls_pgons
     * check that the ents in these colls actually exist
     * @param this_map
     * @param other_map
     * @param other_colls_i
     */
    private _dumpDnCollsObjsDeepCopy(this_map: Map<number, number[]>, other_map: Map<number, number[]>, other_colls_i: Set<number>,
            other_ents_i: Set<number>): void {
        other_colls_i.forEach( other_coll_i => {
            const other_coll_ents_i = other_map.get(other_coll_i);
            if (other_coll_ents_i !== undefined) {
                const coll_ents_i: number[] = other_coll_ents_i.filter( ent_i => other_ents_i.has(ent_i) ); // deep copy
                this_map.set(other_coll_i, coll_ents_i); // deep copy
            }
        });
    }
    /**
     * up_points_colls
     * up_plines_colls
     * up_pgons_colls
     * Check that the collections that the ents are referencing actually exist.
     * @param this_map
     * @param other_map
     * @param other_ents_i
     */
    private _dumpUpObjsCollsDeepCopy(this_map: Map<number,  number[]>, other_map: Map<number, number[]>, other_ents_i: Set<number>,
            other_colls_i: Set<number>): void {
        other_ents_i.forEach( ent_i => {
            const other_ent_colls_i = other_map.get(ent_i);
            if (other_ent_colls_i !== undefined) {
                const ent_colls_i: number[] = other_ent_colls_i.filter( coll_i => other_colls_i.has(coll_i) ); // deep copy
                if (ent_colls_i.length) {
                    this_map.set(ent_i, ent_colls_i);
                }
            }
        });
    }
    /**
     * Entities without time stamps
     * @param this_map
     * @param other_map
     * @param other_ents_i
     */
    private _dumpEnts(this_map: Map<number, number>, other_map: Map<number, number>, other_ents_i: Set<number>): void {
        other_ents_i.forEach( ent_i => {
            const other_ent = other_map.get(ent_i);
            if (other_ent !== undefined) {
                this_map.set(ent_i, other_ent);
            }
        });
    }
    /**
     * Posis with time stamps
     * up_posis_verts
     * check  that the verts actually exist
     * @param other_geom
     * @param ent_type
     * @param other_posis_i
     */
    private _dumpPosisTSDeepCopy(other_geom: GIGeom, other_posis_i: Set<number>, other_verts_i: Set<number>): void {
        // get maps
        const this_map = this._geom_maps.up_posis_verts;
        const other_map = other_geom._geom_maps.up_posis_verts;
        // dump
        other_posis_i.forEach( posi_i => {
            const other_posi_verts_i = other_map.get(posi_i);
            if (other_posi_verts_i !== undefined) {
                const posi_verts_i: number[] = other_posi_verts_i.filter( vert_i => other_verts_i.has(vert_i) ); // deep copy
                this_map.set(posi_i, posi_verts_i);
                const other_ts: number = other_geom.time_stamp.getEntTs(EEntType.POSI, posi_i);
                this._geom.time_stamp.setEntTs(EEntType.POSI, posi_i, other_ts);
            }
        });
    }
    /**
     * Dump objects (with time stamps) into this model
     * dn_points_verts
     * dn_plines_wires
     * dn_pgons_faces
     * @param other_geom
     * @param ent_type
     * @param other_ents_i
     */
    private _dumpObjsTS(other_geom: GIGeom, ent_type: EEntType, other_ents_i: Set<number>): void {
        // get key
        const geom_array_key: string = EEntStrToGeomMaps[ent_type];
        // get maps
        const this_map = this._geom_maps[geom_array_key];
        const other_map = other_geom._geom_maps[geom_array_key];
        // dump
        other_ents_i.forEach( ent_i => {
            const other_ent = other_map.get(ent_i);
            if (other_ent !== undefined) {
                this_map.set(ent_i, other_ent);
                const other_ts: number = other_geom.time_stamp.getEntTs(ent_type, ent_i);
                this._geom.time_stamp.setEntTs(ent_type, ent_i, other_ts);
            }
        });
    }
    /**
     * Dump collections (with time stamps) into this model
     * up_colls_colls
     * @param other_geom
     * @param ent_type
     * @param other_colls_i
     */
    private _dumpCollsTS(other_geom: GIGeom, other_colls_i: Set<number>): void {
        // get maps
        const this_map = this._geom_maps.up_colls_colls;
        const other_map = other_geom._geom_maps.up_colls_colls;
        // dump
        other_colls_i.forEach( coll_i => {
            const parent_coll_i = other_map.get(coll_i);
            if (parent_coll_i !== undefined) {
                this_map.set(coll_i, other_colls_i.has(parent_coll_i) ? parent_coll_i : -1 );
                const other_ts: number = other_geom.time_stamp.getEntTs(EEntType.COLL, coll_i);
                this._geom.time_stamp.setEntTs(EEntType.COLL, coll_i, other_ts);
            }
        });
    }
}
