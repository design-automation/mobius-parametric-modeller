import { IGeomMaps, EEntType, EEntStrToGeomMaps } from './common';
import { GIGeom } from './GIGeom';
import { getEntTypeStr } from './common_func';

/**
 * Class for merging geometry from another model into this model.
 */
export class GIGeomMerge {
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
     * The existing data in the model is not deleted.
     * Conflict detection will be performed based on time stamps.
     * @param geom_maps The geom_arrays of the other model.
     */
    public merge(other_geom: GIGeom): void {
        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
        //
        const geom_maps = other_geom._geom_maps;
        // ======================================================================
        this._mergePosisCheckConflicts(other_geom); // check for conflicts and merge verts
        this._mergeEntsCheckConflicts(other_geom, EEntType.POINT); // check for conflicts
        this._mergeEntsCheckConflicts(other_geom, EEntType.PLINE); // check for conflicts
        this._mergeEntsCheckConflicts(other_geom, EEntType.PGON); // check for conflicts
        this._mergeEntsCheckConflicts(other_geom, EEntType.COLL); // check for conflicts
        // ======================================================================
        this._mergeEnts(this._geom_maps.dn_verts_posis, geom_maps.dn_verts_posis);
        this._mergeEntsDeepCopy(this._geom_maps.dn_tris_verts, geom_maps.dn_tris_verts);
        this._mergeEntsDeepCopy(this._geom_maps.dn_edges_verts, geom_maps.dn_edges_verts);
        this._mergeEntsDeepCopy(this._geom_maps.dn_wires_edges, geom_maps.dn_wires_edges);
        this._mergeEntsDeepCopy(this._geom_maps.dn_faces_wires, geom_maps.dn_faces_wires);
        this._mergeEntsDeepCopy(this._geom_maps.dn_faces_tris, geom_maps.dn_faces_tris);
        this._mergeEntsDeepCopy(this._geom_maps.dn_colls_points, geom_maps.dn_colls_points);
        this._mergeEntsDeepCopy(this._geom_maps.dn_colls_plines, geom_maps.dn_colls_plines);
        this._mergeEntsDeepCopy(this._geom_maps.dn_colls_pgons, geom_maps.dn_colls_pgons);
        // ======================================================================
        this._mergeEnts(this._geom_maps.up_verts_tris, geom_maps.up_verts_tris);
        this._mergeEnts(this._geom_maps.up_tris_faces, geom_maps.up_tris_faces);
        this._mergeEntsDeepCopy(this._geom_maps.up_verts_edges, geom_maps.up_verts_edges);
        this._mergeEnts(this._geom_maps.up_edges_wires, geom_maps.up_edges_wires);
        this._mergeEnts(this._geom_maps.up_wires_faces, geom_maps.up_wires_faces);
        this._mergeEnts(this._geom_maps.up_verts_points, geom_maps.up_verts_points);
        this._mergeEnts(this._geom_maps.up_wires_plines, geom_maps.up_wires_plines);
        this._mergeEnts(this._geom_maps.up_faces_pgons, geom_maps.up_faces_pgons);
        // ======================================================================
        this._mergeCollObjs(this._geom_maps.up_points_colls, geom_maps.up_points_colls); // merge colls, no check for conflicts
        this._mergeCollObjs(this._geom_maps.up_plines_colls, geom_maps.up_plines_colls); // merge colls, no check for conflicts
        this._mergeCollObjs(this._geom_maps.up_pgons_colls, geom_maps.up_pgons_colls); // merge colls, no check for conflicts
        // ======================================================================
        // time stamp updated in _mergePosis() and _mergeObjCollEnts() methods

        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
    }
    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    /**
     * Merge posis, with conflict detection, deep copy.
     * This is for merging:
     * posi_i->verts_i
     * @param other_geom
     */
    private _mergePosisCheckConflicts(other_geom: GIGeom): void {
        // get maps
        const this_map = this._geom_maps.up_posis_verts;
        const other_map = other_geom._geom_maps.up_posis_verts;
        // merge
        other_map.forEach( (other_verts_i, other_posi_i) => {
            const other_ts: number = other_geom.time_stamp.getEntTs(EEntType.POSI, other_posi_i);
            if (this_map.has(other_posi_i)) {
                // check time stamp
                const this_ts: number = this._geom.time_stamp.getEntTs(EEntType.POSI, other_posi_i);
                if (this_ts !== other_ts) {
                    throw new Error('Conflict merging positions.');
                }
                // merge verts
                const verts_i_set: Set<number> = new Set(this_map.get(other_posi_i));
                for (const vert_i of other_verts_i) {
                    verts_i_set.add(vert_i);
                }
                this_map.set(other_posi_i, Array.from(verts_i_set));
            } else {
                this_map.set(other_posi_i, other_verts_i.slice());
                this._geom.time_stamp.setEntTs(EEntType.POSI, other_posi_i, other_ts);
            }
        });
    }
    /**
     * Merge objects and collections, with conflict detection, deep copy.
     * This is for merging:
     * dn_points_verts
     * dn_plines_wires
     * dn_pgons_faces
     * up_colls_colls
     * @param other_geom
     * @param ent_type
     */
    private _mergeEntsCheckConflicts(other_geom: GIGeom, ent_type: EEntType): void {
        // get key
        const geom_array_key: string = EEntStrToGeomMaps[ent_type];
        // get maps
        const this_map = this._geom_maps[geom_array_key];
        const other_map = other_geom._geom_maps[geom_array_key];
        // merge
        other_map.forEach( (ent, ent_i) => {
            const other_ts: number = other_geom.time_stamp.getEntTs(ent_type, ent_i);
            if (this_map.has(ent_i)) {
                // check time stamp
                const this_ts: number = this._geom.time_stamp.getEntTs(ent_type, ent_i);
                if (this_ts !== other_ts) {
                    throw new Error('Conflict merging ' + getEntTypeStr(ent_type) + '.');
                }
            } else {
                // ent is always a number, wither a vert_i, wire_i, face_i or coll_i
                // so there is no need to do a deep copy at this level
                this_map.set(ent_i, ent);
                this._geom.time_stamp.setEntTs(ent_type, ent_i, other_ts);
            }
        });
    }
    /**
     * Merge ents, no conflict detection, deep copy.
     * The map values are not arrays, so no deep copy is required.
     * @param this_map
     * @param other_map
     * @param type
     */
    private _mergeEnts(this_map: Map<number, any>, other_map: Map<number, any>): void {
        other_map.forEach( (ent, ent_i) => {
            this_map.set(ent_i, ent);
        });
    }
    /**
     * Merge ents, no conflict detection, deep copy.
     * The map values are arrays, so deep copy is required.
     * @param this_map
     * @param other_map
     * @param type
     */
    private _mergeEntsDeepCopy(this_map: Map<number, any>, other_map: Map<number, any>): void {
        other_map.forEach( (ent, ent_i) => {
            this_map.set(ent_i, ent.slice()); // deep copy using slice()
        });
    }
    /**
     * Merge collections, no conflict detection, deep copy.
     * When merging two models, collections will be merged as a union.
     * So if the same collection exists in both models, and if the collection contents is different,
     * then this is not treated as a conflict.
     * Instead the content of the merged collection will be the union of the contents of the two collections.
     * This is for merging:
     * up_points_colls point_i->colls_i
     * up_plines_colls pline_i->colls_i
     * up_pgons_colls pgon_i->colls_i
     * @param other_geom
     */
    private _mergeCollObjs(this_map: Map<number, any>, other_map: Map<number, any>): void {
        // merge
        other_map.forEach( (other_colls_i, other_ent_i) => {
            if (this_map.has(other_ent_i)) {
                // merge colls
                const this_colls_i_set: Set<number> = new Set(this_map.get(other_ent_i));
                for (const other_coll_i of other_colls_i) {
                    this_colls_i_set.add(other_coll_i);
                }
                this_map.set(other_ent_i, Array.from(this_colls_i_set));
            } else {
                this_map.set(other_ent_i, other_colls_i.slice());
            }
        });
    }
}
