import { IGeomJSONData, IGeomMaps, EEntType, IEntSets, TTri, TEdge, TWire, TFace,
    EEntStrToGeomMaps, TVert, TFaceTri, TPoint, TPline, TPgon, TColl } from './common';
import { GIGeom } from './GIGeom';
import * as lodash from 'lodash';
import { cloneDeepMapArr, getEntTypeStr as getEntTypeName } from './common_func';

/**
 * Class for geometry.
 */
export class GIGeomIO {
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
        if (this._geom_maps.up_posis_verts.size !== this._geom_maps.posis_ts.size) {
            throw new Error('Incorrent number of time stamps for posis.');
        }
        if (this._geom_maps.dn_points_verts.size !== this._geom_maps.points_ts.size) {
            throw new Error('Incorrent number of time stamps for points.');
        }
        if (this._geom_maps.dn_plines_wires.size !== this._geom_maps.plines_ts.size) {
            throw new Error('Incorrent number of time stamps for plines.');
        }
        if (this._geom_maps.dn_pgons_faces.size !== this._geom_maps.pgons_ts.size) {
            throw new Error('Incorrent number of time stamps for pgons.');
        }
        if (this._geom_maps.dn_colls_objs.size !== this._geom_maps.colls_ts.size) {
            throw new Error('Incorrent number of time stamps for colls.');
        }
        //
        const geom_maps = other_geom._geom_maps;
        // ======================================================================
        this._mergePosis(other_geom); // check for conflicts and merge verts
        this._mergeObjCollEnts(other_geom, EEntType.POINT); // check for conflicts
        this._mergeObjCollEnts(other_geom, EEntType.PLINE); // check for conflicts
        this._mergeObjCollEnts(other_geom, EEntType.PGON); // check for conflicts
        this._mergeObjCollEnts(other_geom, EEntType.COLL); // check for conflicts
        // ======================================================================
        this._mergeEnts(this._geom_maps.dn_verts_posis, geom_maps.dn_verts_posis);
        this._mergeEnts(this._geom_maps.dn_tris_verts, geom_maps.dn_tris_verts);
        this._mergeEnts(this._geom_maps.dn_edges_verts, geom_maps.dn_edges_verts);
        this._mergeEnts(this._geom_maps.dn_wires_edges, geom_maps.dn_wires_edges);
        this._mergeEnts(this._geom_maps.dn_faces_wires, geom_maps.dn_faces_wires);
        this._mergeEnts(this._geom_maps.dn_faces_tris, geom_maps.dn_faces_tris);
        // ======================================================================
        this._mergeEnts(this._geom_maps.up_verts_tris, geom_maps.up_verts_tris);
        this._mergeEnts(this._geom_maps.up_tris_faces, geom_maps.up_tris_faces);
        this._mergeEnts(this._geom_maps.up_verts_edges, geom_maps.up_verts_edges);
        this._mergeEnts(this._geom_maps.up_edges_wires, geom_maps.up_edges_wires);
        this._mergeEnts(this._geom_maps.up_wires_faces, geom_maps.up_wires_faces);
        this._mergeEnts(this._geom_maps.up_verts_points, geom_maps.up_verts_points);
        this._mergeEnts(this._geom_maps.up_wires_plines, geom_maps.up_wires_plines);
        this._mergeEnts(this._geom_maps.up_faces_pgons, geom_maps.up_faces_pgons);
        // ======================================================================
        this._mergeColls(this._geom_maps.up_points_colls, geom_maps.up_points_colls); // merge colls, no check for conflicts
        this._mergeColls(this._geom_maps.up_plines_colls, geom_maps.up_plines_colls); // merge colls, no check for conflicts
        this._mergeColls(this._geom_maps.up_pgons_colls, geom_maps.up_pgons_colls); // merge colls, no check for conflicts
        // ======================================================================
        // time stamp updated in _mergePosis() and _mergeObjCollEnts() methods
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
        if (this._geom_maps.up_posis_verts.size !== this._geom_maps.posis_ts.size) {
            throw new Error('Incorrent number of time stamps for posis.');
        }
        if (this._geom_maps.dn_points_verts.size !== this._geom_maps.points_ts.size) {
            throw new Error('Incorrent number of time stamps for points.');
        }
        if (this._geom_maps.dn_plines_wires.size !== this._geom_maps.plines_ts.size) {
            throw new Error('Incorrent number of time stamps for plines.');
        }
        if (this._geom_maps.dn_pgons_faces.size !== this._geom_maps.pgons_ts.size) {
            throw new Error('Incorrent number of time stamps for pgons.');
        }
        if (this._geom_maps.dn_colls_objs.size !== this._geom_maps.colls_ts.size) {
            throw new Error('Incorrent number of time stamps for colls.');
        }
        //
        this._geom_maps.dn_points_verts = new Map(geom_maps.dn_points_verts);
        this._geom_maps.dn_plines_wires = new Map(geom_maps.dn_plines_wires);
        this._geom_maps.dn_pgons_faces = new Map(geom_maps.dn_pgons_faces);
        this._geom_maps.dn_colls_objs = lodash.cloneDeep(geom_maps.dn_colls_objs);
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
        // ======================================================================
        this._geom_maps.posis_ts = new Map(geom_maps.posis_ts);
        this._geom_maps.points_ts = new Map(geom_maps.points_ts);
        this._geom_maps.plines_ts = new Map(geom_maps.plines_ts);
        this._geom_maps.pgons_ts = new Map(geom_maps.pgons_ts);
        this._geom_maps.colls_ts = new Map(geom_maps.colls_ts);
    }
    /**
     * Adds data to this model from another model.
     * The data is deep copied.
     * No conflict detection is performed.
     * Typically, this model is assumed to be empty.
     * If ent_sets is null, do nothing.
     * @param geom_maps The geom_arrays of the other model.
     */
    public dumpSelect(other_geom: GIGeom, ent_sets: IEntSets): void {
        if (ent_sets === null) { return; }
        // Check that we have correct number of time stamps
        if (this._geom_maps.up_posis_verts.size !== this._geom_maps.posis_ts.size) {
            throw new Error('Incorrent number of time stamps for posis.');
        }
        if (this._geom_maps.dn_points_verts.size !== this._geom_maps.points_ts.size) {
            throw new Error('Incorrent number of time stamps for points.');
        }
        if (this._geom_maps.dn_plines_wires.size !== this._geom_maps.plines_ts.size) {
            throw new Error('Incorrent number of time stamps for plines.');
        }
        if (this._geom_maps.dn_pgons_faces.size !== this._geom_maps.pgons_ts.size) {
            throw new Error('Incorrent number of time stamps for pgons.');
        }
        if (this._geom_maps.dn_colls_objs.size !== this._geom_maps.colls_ts.size) {
            throw new Error('Incorrent number of time stamps for colls.');
        }
        //
        const geom_maps: IGeomMaps = other_geom._geom_maps;
        // ======================================================================
        this._dumpPosiObjCollSelect(other_geom, EEntType.POSI, ent_sets.posis_i);
        this._dumpPosiObjCollSelect(other_geom, EEntType.POINT, ent_sets.points_i);
        this._dumpPosiObjCollSelect(other_geom, EEntType.PLINE, ent_sets.plines_i);
        this._dumpPosiObjCollSelect(other_geom, EEntType.PGON, ent_sets.pgons_i);
        this._dumpPosiObjCollSelect(other_geom, EEntType.COLL, ent_sets.colls_i);
        // ======================================================================
        this._dumpEntsSelect(this._geom_maps.dn_verts_posis, geom_maps.dn_verts_posis, ent_sets.verts_i);
        this._dumpEntsSelect(this._geom_maps.dn_tris_verts, geom_maps.dn_tris_verts, ent_sets.tris_i);
        this._dumpEntsSelect(this._geom_maps.dn_edges_verts, geom_maps.dn_edges_verts, ent_sets.edges_i);
        this._dumpEntsSelect(this._geom_maps.dn_wires_edges, geom_maps.dn_wires_edges, ent_sets.wires_i);
        this._dumpEntsSelect(this._geom_maps.dn_faces_wires, geom_maps.dn_faces_wires, ent_sets.faces_i);
        this._dumpEntsSelect(this._geom_maps.dn_faces_tris, geom_maps.dn_faces_tris, ent_sets.faces_i);
        // ======================================================================
        this._dumpEntsSelect(this._geom_maps.up_verts_tris,   geom_maps.up_verts_tris,   ent_sets.verts_i);
        this._dumpEntsSelect(this._geom_maps.up_tris_faces,   geom_maps.up_tris_faces,   ent_sets.tris_i);
        this._dumpEntsSelect(this._geom_maps.up_verts_edges,  geom_maps.up_verts_edges,  ent_sets.verts_i);
        this._dumpEntsSelect(this._geom_maps.up_edges_wires,  geom_maps.up_edges_wires,  ent_sets.edges_i);
        this._dumpEntsSelect(this._geom_maps.up_wires_faces,  geom_maps.up_wires_faces,  ent_sets.wires_i);
        this._dumpEntsSelect(this._geom_maps.up_verts_points, geom_maps.up_verts_points, ent_sets.verts_i);
        this._dumpEntsSelect(this._geom_maps.up_wires_plines, geom_maps.up_wires_plines, ent_sets.wires_i);
        this._dumpEntsSelect(this._geom_maps.up_faces_pgons,  geom_maps.up_faces_pgons,  ent_sets.faces_i);
        this._dumpEntsSelect(this._geom_maps.up_points_colls, geom_maps.up_points_colls, ent_sets.points_i);
        this._dumpEntsSelect(this._geom_maps.up_plines_colls, geom_maps.up_plines_colls, ent_sets.plines_i);
        this._dumpEntsSelect(this._geom_maps.up_pgons_colls,  geom_maps.up_pgons_colls,  ent_sets.pgons_i);
        // ======================================================================
        // time stamp updated in _dumpPosiObjCollSelect() method
    }
    /**
     * Adds data to this model from another model.
     * The data is deep copied.
     * The existing data in the model is not deleted.
     * The entities in the other model are renumbered.
     * @param other_geom_maps The geom_arrays of the other model.
     */
    public mergeAndPurge(other_geom_maps: IGeomMaps): Map<string, Map<number, number>> {
        // get lengths of existing entities before we start adding stuff
        // const num_posis: number = this._geom_maps.num_posis;
        const num_posis: number = this._geom_maps.up_posis_verts.size;
        const num_verts: number = this._geom_maps.dn_verts_posis.size;
        const num_tris: number = this._geom_maps.dn_tris_verts.size;
        const num_edges: number = this._geom_maps.dn_edges_verts.size;
        const num_wires: number = this._geom_maps.dn_wires_edges.size;
        const num_faces: number = this._geom_maps.dn_faces_wires.size;
        const num_points: number = this._geom_maps.dn_points_verts.size;
        const num_plines: number = this._geom_maps.dn_plines_wires.size;
        const num_pgons: number = this._geom_maps.dn_pgons_faces.size;
        const num_colls: number = this._geom_maps.dn_colls_objs.size;
        // ======================================================================
        // get maps for entities
        // positions
        const renum_posis_map: Map<number, number> = new Map();
        let posis_count = 0;
        other_geom_maps.up_posis_verts.forEach( (_, other_posi_i) => {
            renum_posis_map.set(other_posi_i, posis_count + num_posis);
            posis_count += 1;
        });
        // vertices
        const renum_verts_map: Map<number, number> = new Map();
        let vert_count = 0;
        other_geom_maps.dn_verts_posis.forEach( (_, other_vert_i) => {
            renum_verts_map.set(other_vert_i, vert_count + num_verts);
            vert_count += 1;
        });
        // triangles
        const renum_tris_map: Map<number, number> = new Map();
        let tris_count = 0;
        other_geom_maps.dn_tris_verts.forEach( (_, other_tri_i) => {
            renum_tris_map.set(other_tri_i, tris_count + num_tris);
            tris_count += 1;
        });
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        let edges_count = 0;
        other_geom_maps.dn_edges_verts.forEach( (_, other_edge_i) => {
            renum_edges_map.set(other_edge_i, edges_count + num_edges);
            edges_count += 1;
        });
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        let wires_count = 0;
        other_geom_maps.dn_wires_edges.forEach( (_, other_wire_i) => {
            renum_wires_map.set(other_wire_i, wires_count + num_wires);
            wires_count += 1;
        });
        // faces
        const renum_faces_map: Map<number, number> = new Map();
        let faces_count = 0;
        other_geom_maps.dn_faces_wires.forEach( (_, other_face_i) => {
            renum_faces_map.set(other_face_i, faces_count + num_faces);
            faces_count += 1;
        });
        // points
        const renum_points_map: Map<number, number> = new Map();
        let points_count = 0;
        other_geom_maps.dn_points_verts.forEach( (_, other_point_i) => {
            renum_points_map.set(other_point_i, points_count + num_points);
            points_count += 1;
        });
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        let plines_count = 0;
        other_geom_maps.dn_plines_wires.forEach( (_, other_wire_i) => {
            renum_plines_map.set(other_wire_i, plines_count + num_plines);
            plines_count += 1;
        });
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        let pgons_count = 0;
        other_geom_maps.dn_pgons_faces.forEach( (_, other_pgon_i) => {
            renum_pgons_map.set(other_pgon_i, pgons_count + num_pgons);
            pgons_count += 1;
        });
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        let colls_count = 0;
        other_geom_maps.dn_colls_objs.forEach( (_, other_coll_i) => {
            renum_colls_map.set(other_coll_i, colls_count + num_colls);
            colls_count += 1;
        });
        // create data to return
        const renum_maps: Map<string, Map<number, number>> = new Map();
        renum_maps.set('posis', renum_posis_map);
        renum_maps.set('verts', renum_verts_map);
        renum_maps.set('edges', renum_edges_map);
        renum_maps.set('wires', renum_wires_map);
        renum_maps.set('faces', renum_faces_map);
        renum_maps.set('points', renum_points_map);
        renum_maps.set('plines', renum_plines_map);
        renum_maps.set('pgons', renum_pgons_map);
        renum_maps.set('colls', renum_colls_map);
        // ======================================================================
        // update down arrays
        // add vertices to model
        other_geom_maps.dn_verts_posis.forEach( (other_posi_i, other_vert_i) => {
            this._geom_maps.dn_verts_posis.set(
                renum_verts_map.get(other_vert_i),
                renum_posis_map.get(other_posi_i) as TVert
            );
        });
        // add triangles to model
        other_geom_maps.dn_tris_verts.forEach( (other_verts_i, other_tri_i) => {
            this._geom_maps.dn_tris_verts.set(
                renum_tris_map.get(other_tri_i),
                other_verts_i.map( other_vert_i => renum_verts_map.get(other_vert_i)) as TTri
            );
        });
        // add edges to model
        other_geom_maps.dn_edges_verts.forEach( (other_verts_i, other_edge_i) => {
            this._geom_maps.dn_edges_verts.set(
                renum_edges_map.get(other_edge_i),
                other_verts_i.map( other_vert_i => renum_verts_map.get(other_vert_i)) as TEdge
            );
        });
        // add wires to model
        other_geom_maps.dn_wires_edges.forEach( (other_edges_i, other_wire_i) => {
            this._geom_maps.dn_wires_edges.set(
                renum_wires_map.get(other_wire_i),
                other_edges_i.map( other_edge_i => renum_edges_map.get(other_edge_i)) as TWire
            );
        });
        // add faces to model
        other_geom_maps.dn_faces_wires.forEach( (other_wires_i, other_face_i) => {
            this._geom_maps.dn_faces_wires.set(
                renum_faces_map.get(other_face_i),
                other_wires_i.map( other_wire_i => renum_wires_map.get(other_wire_i)) as TFace
            );
        });
        other_geom_maps.dn_faces_tris.forEach( (other_tris_i, other_face_i) => {
            this._geom_maps.dn_faces_tris.set(
                renum_faces_map.get(other_face_i),
                other_tris_i.map( other_tri_i => renum_tris_map.get(other_tri_i)) as TFaceTri
            );
        });
        // add points to model
        other_geom_maps.dn_points_verts.forEach( (other_vert_i, other_point_i) => {
            this._geom_maps.dn_points_verts.set(
                renum_points_map.get(other_point_i),
                renum_verts_map.get(other_vert_i) as TPoint
            );
        });
        // add plines to model
        other_geom_maps.dn_plines_wires.forEach( (other_wire_i, other_pline_i) => {
            this._geom_maps.dn_plines_wires.set(
                renum_plines_map.get(other_pline_i),
                renum_wires_map.get(other_wire_i) as TPline
            );
        });
        // add pgons to model
        other_geom_maps.dn_pgons_faces.forEach( (other_face_i, other_pgon_i) => {
            this._geom_maps.dn_pgons_faces.set(
                renum_pgons_map.get(other_pgon_i),
                renum_faces_map.get(other_face_i) as TPgon
            );
        });
        // add collections to model
        other_geom_maps.dn_colls_objs.forEach( (other_coll, other_coll_i) => {
            const parent: number = (other_coll[0] === -1) ? -1 : renum_colls_map.get(other_coll[0]);
            const coll_points_i: number[] = other_coll[1].map( point_i => renum_points_map.get(point_i));
            const coll_plines_i: number[] = other_coll[2].map( pline_i => renum_plines_map.get(pline_i));
            const coll_pgons_i: number[] = other_coll[3].map( pgon_i => renum_pgons_map.get(pgon_i));
            const new_coll: TColl = [parent, coll_points_i, coll_plines_i, coll_pgons_i];
            this._geom_maps.dn_colls_objs.set(
                renum_colls_map.get(other_coll_i),
                new_coll
            );
        });
        // ======================================================================
        // update up arrays
        // update posis to verts (they can be null or [])
        // this array is used to capture deleted posis
        other_geom_maps.up_posis_verts.forEach( (other_verts_i, other_posi_i) => {
            this._geom_maps.up_posis_verts.set(
                renum_posis_map.get(other_posi_i),
                other_verts_i.map( other_vert_i => renum_verts_map.get(other_vert_i))
            );
        });
        // update verts to tris
        other_geom_maps.up_verts_tris.forEach( (other_tris_i, other_vert_i) => {
            this._geom_maps.up_verts_tris.set(
                renum_verts_map.get(other_vert_i),
                other_tris_i.map( other_tri_i => renum_tris_map.get(other_tri_i))
            );
        });
        // update tris to faces
        other_geom_maps.up_tris_faces.forEach( (other_face_i, other_tri_i) => {
            this._geom_maps.up_tris_faces.set(
                renum_tris_map.get(other_tri_i),
                renum_faces_map.get(other_face_i)
            );
        });
        // update verts to edges
        other_geom_maps.up_verts_edges.forEach( (other_edges_i, other_vert_i) => {
            this._geom_maps.up_verts_edges.set(
                renum_verts_map.get(other_vert_i),
                other_edges_i.map( other_edge_i => renum_edges_map.get(other_edge_i))
            );
        });
        // update edges to wires
        other_geom_maps.up_edges_wires.forEach( (other_wire_i, other_edge_i) => {
            this._geom_maps.up_edges_wires.set(
                renum_edges_map.get(other_edge_i),
                renum_wires_map.get(other_wire_i)
            );
        });
        // update wires to faces
        other_geom_maps.up_wires_faces.forEach( (other_face_i, other_wire_i) => {
            this._geom_maps.up_wires_faces.set(
                renum_wires_map.get(other_wire_i),
                renum_faces_map.get(other_face_i)
            );
        });
        // update verts to points
        other_geom_maps.up_verts_points.forEach( (other_vert_i, other_point_i) => {
            this._geom_maps.up_verts_points.set(
                renum_points_map.get(other_point_i),
                renum_verts_map.get(other_vert_i)
            );
        });
        // update wires to plines
        other_geom_maps.up_wires_plines.forEach( (other_pline_i, other_wire_i) => {
            this._geom_maps.up_wires_plines.set(
                renum_wires_map.get(other_wire_i),
                renum_plines_map.get(other_pline_i)
            );
        });
        // update faces to pgons
        other_geom_maps.up_faces_pgons.forEach( (other_pgon_i, other_face_i) => {
            this._geom_maps.up_faces_pgons.set(
                renum_faces_map.get(other_face_i),
                renum_pgons_map.get(other_pgon_i)
            );
        });
        // update points to colls
        other_geom_maps.up_points_colls.forEach( (other_colls_i, other_point_i) => {
            this._geom_maps.up_points_colls.set(
                renum_points_map.get(other_point_i),
                other_colls_i.map( other_coll_i => renum_colls_map.get(other_coll_i))
            );
        });
        // update plines to colls
        other_geom_maps.up_plines_colls.forEach( (other_colls_i, other_pline_i) => {
            this._geom_maps.up_plines_colls.set(
                renum_plines_map.get(other_pline_i),
                other_colls_i.map( other_coll_i => renum_colls_map.get(other_coll_i))
            );
        });
        // update pgons to colls
        other_geom_maps.up_pgons_colls.forEach( (other_colls_i, other_pgon_i) => {
            this._geom_maps.up_pgons_colls.set(
                renum_pgons_map.get(other_pgon_i),
                other_colls_i.map( other_coll_i => renum_colls_map.get(other_coll_i))
            );
        });
        // return the maps
        return renum_maps;
    }
    /**
     * Sets the data in this model from JSON data.
     * The data is shallow copied.
     * The existing data in the model is deleted.
     * All entities get the same time stamp.
     * @param geom_data The JSON data
     */
    public setJSONData(geom_data: IGeomJSONData): void {
        // all entities get the same time stamp
        const ts: number = this._geom.modeldata.model.metadata.nextTimeStamp();
        // update the down arrays
        // add vertices to model
        this._geom_maps.dn_verts_posis = new Map();
        for (let i = 0; i < geom_data.verts.length; i++) {
            this._geom_maps.dn_verts_posis.set(geom_data.verts_i[i], geom_data.verts[i]);
        }
        // add triangles to model
        this._geom_maps.dn_tris_verts = new Map();
        for (let i = 0; i < geom_data.tris.length; i++) {
            this._geom_maps.dn_tris_verts.set(geom_data.tris_i[i], geom_data.tris[i]);
        }
        // add edges to model
        this._geom_maps.dn_edges_verts = new Map();
        for (let i = 0; i < geom_data.edges.length; i++) {
            this._geom_maps.dn_edges_verts.set(geom_data.edges_i[i], geom_data.edges[i]);
        }
        // add wires to model
        this._geom_maps.dn_wires_edges = new Map();
        for (let i = 0; i < geom_data.wires.length; i++) {
            this._geom_maps.dn_wires_edges.set(geom_data.wires_i[i], geom_data.wires[i]);
        }
        // add faces to model
        this._geom_maps.dn_faces_wires = new Map();
        this._geom_maps.dn_faces_tris = new Map();
        for (let i = 0; i < geom_data.faces.length; i++) {
            this._geom_maps.dn_faces_wires.set(geom_data.faces_i[i], geom_data.faces[i]);
            this._geom_maps.dn_faces_tris.set(geom_data.faces_i[i], geom_data.facetris[i]);
        }
        // add points to model
        this._geom_maps.dn_points_verts = new Map();
        for (let i = 0; i < geom_data.points.length; i++) {
            this._geom_maps.dn_points_verts.set(geom_data.points_i[i], geom_data.points[i]);
            this._geom.time_stamp.setEntTs(EEntType.POINT, geom_data.points_i[i], ts); // time stamp
        }
        // add plines to model
        this._geom_maps.dn_plines_wires = new Map();
        for (let i = 0; i < geom_data.plines.length; i++) {
            this._geom_maps.dn_plines_wires.set(geom_data.plines_i[i], geom_data.plines[i]);
            this._geom.time_stamp.setEntTs(EEntType.PLINE, geom_data.plines_i[i], ts); // time stamp
        }
        // add pgons to model
        this._geom_maps.dn_pgons_faces = new Map();
        for (let i = 0; i < geom_data.pgons.length; i++) {
            this._geom_maps.dn_pgons_faces.set(geom_data.pgons_i[i], geom_data.pgons[i]);
            this._geom.time_stamp.setEntTs(EEntType.PGON, geom_data.pgons_i[i], ts); // time stamp
        }
        // add collections to model
        this._geom_maps.dn_colls_objs = new Map();
        for (let i = 0; i < geom_data.colls.length; i++) {
            this._geom_maps.dn_colls_objs.set(geom_data.colls_i[i], geom_data.colls[i]);
            this._geom.time_stamp.setEntTs(EEntType.COLL, geom_data.colls_i[i], ts); // time stamp
        }
        // set selected
        this._geom.selected = geom_data.selected;
        // ========================================================================================
        // update the up arrays
        // posis->verts, create empty []
        this._geom_maps.up_posis_verts = new Map();
        for (let i = 0; i < geom_data.posis_i.length; i++) {
            this._geom_maps.up_posis_verts.set(geom_data.posis_i[i], []);
            this._geom.time_stamp.setEntTs(EEntType.POSI, geom_data.posis_i[i], ts); // time stamp
        }
        // posis->verts
        this._geom_maps.dn_verts_posis.forEach( (posi_i, vert_i) => {
            this._geom_maps.up_posis_verts.get(posi_i).push(vert_i);
        });
        // verts->tris, one to many
        this._geom_maps.up_verts_tris = new Map();
        this._geom_maps.dn_tris_verts.forEach( (vert_i_arr, tri_i) => {
            vert_i_arr.forEach( vert_i => {
                if (!this._geom_maps.up_verts_tris.has(vert_i)) {
                    this._geom_maps.up_verts_tris.set(vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(vert_i).push(tri_i);
            });
        });
        // verts->edges, one to two
        // order is important
        this._geom_maps.up_verts_edges = new Map();
        this._geom_maps.dn_edges_verts.forEach( (vert_i_arr, edge_i) => {
            vert_i_arr.forEach( (vert_i, index) => {
                if (!this._geom_maps.up_verts_edges.has(vert_i)) {
                    this._geom_maps.up_verts_edges.set(vert_i, []);
                }
                if (index === 0) {
                    this._geom_maps.up_verts_edges.get(vert_i).push(edge_i);
                } else if (index === 1) {
                    this._geom_maps.up_verts_edges.get(vert_i).splice(0, 0, edge_i);
                }
                if (index > 1) {
                    throw new Error('Import data error: Found an edge with more than two vertices.');
                }
            });
        });
        // edges->wires
        this._geom_maps.up_edges_wires = new Map();
        this._geom_maps.dn_wires_edges.forEach( (edge_i_arr, wire_i) => {
            edge_i_arr.forEach( edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, wire_i);
            });
        });
        // wires->faces
        this._geom_maps.up_wires_faces = new Map();
        this._geom_maps.dn_faces_wires.forEach( (wire_i_arr, face_i) => {
            wire_i_arr.forEach( wire_i => {
                this._geom_maps.up_wires_faces.set(wire_i, face_i);
            });
        });
        // tris->faces
        this._geom_maps.up_tris_faces = new Map();
        this._geom_maps.dn_faces_tris.forEach( (tri_i_arr, face_i) => {
            tri_i_arr.forEach( tri_i => {
                this._geom_maps.up_tris_faces.set(tri_i, face_i);
            });
        });
        // points, lines, polygons
        this._geom_maps.up_verts_points = new Map();
        this._geom_maps.dn_points_verts.forEach( (vert_i, point_i) => {
            this._geom_maps.up_verts_points.set(vert_i, point_i);
        });
        this._geom_maps.up_wires_plines = new Map();
        this._geom_maps.dn_plines_wires.forEach( (wire_i, line_i) => {
            this._geom_maps.up_wires_plines.set(wire_i, line_i);
        });
        this._geom_maps.up_faces_pgons = new Map();
        this._geom_maps.dn_pgons_faces.forEach( (face_i, pgon_i) => {
            this._geom_maps.up_faces_pgons.set(face_i, pgon_i);
        });
        // collections of points, polylines, polygons
        this._geom_maps.up_points_colls = new Map();
        this._geom_maps.up_plines_colls = new Map();
        this._geom_maps.up_pgons_colls = new Map();
        this._geom_maps.dn_colls_objs.forEach( (coll, coll_i) => {
            const [parent, point_i_arr, pline_i_arr, pgon_i_arr] = coll;
            point_i_arr.forEach( point_i => {
                if (!this._geom_maps.up_points_colls.has(point_i)) {
                    this._geom_maps.up_points_colls.set(point_i, [coll_i]);
                } else {
                    this._geom_maps.up_points_colls.get(point_i).push(coll_i);
                }
            });
            pline_i_arr.forEach( pline_i => {
                if (!this._geom_maps.up_plines_colls.has(pline_i)) {
                    this._geom_maps.up_plines_colls.set(pline_i, [coll_i]);
                } else {
                    this._geom_maps.up_plines_colls.get(pline_i).push(coll_i);
                }
            });
            pgon_i_arr.forEach( pgon_i => {
                if (!this._geom_maps.up_pgons_colls.has(pgon_i)) {
                    this._geom_maps.up_pgons_colls.set(pgon_i, [coll_i]);
                } else {
                    this._geom_maps.up_pgons_colls.get(pgon_i).push(coll_i);
                }
            });
        });
    }
    /**
     * Returns the JSON data for this model.
     * The data is shallow copied.
     */
    public getJSONData(): IGeomJSONData {
        const data: IGeomJSONData = {
            posis_i: [],
            verts: [], verts_i: [],
            tris: [], tris_i: [],
            edges: [], edges_i: [],
            wires: [], wires_i: [],
            faces: [], facetris: [], faces_i: [],
            points: [], points_i: [],
            plines: [], plines_i: [],
            pgons: [], pgons_i: [],
            colls: [], colls_i: [],
            selected: this._geom.selected
        };
        this._geom_maps.up_posis_verts.forEach( (_, i) => {
            data.posis_i.push(i);
        });
        this._geom_maps.dn_verts_posis.forEach( (ent, i) => {
            data.verts.push(ent);
            data.verts_i.push(i);
        });
        this._geom_maps.dn_tris_verts.forEach( (ent, i) => {
            data.tris.push(ent);
            data.tris_i.push(i);
        });
        this._geom_maps.dn_edges_verts.forEach( (ent, i) => {
            data.edges.push(ent);
            data.edges_i.push(i);
        });
        this._geom_maps.dn_wires_edges.forEach( (ent, i) => {
            data.wires.push(ent);
            data.wires_i.push(i);
        });
        this._geom_maps.dn_faces_wires.forEach( (ent, i) => {
            data.faces.push(ent);
            data.faces_i.push(i);
        });
        this._geom_maps.dn_faces_tris.forEach( (ent, _) => {
            data.facetris.push(ent);
        });
        this._geom_maps.dn_points_verts.forEach( (ent, i) => {
            data.points.push(ent);
            data.points_i.push(i);
        });
        this._geom_maps.dn_plines_wires.forEach( (ent, i) => {
            data.plines.push(ent);
            data.plines_i.push(i);
        });
        this._geom_maps.dn_pgons_faces.forEach( (ent, i) => {
            data.pgons.push(ent);
            data.pgons_i.push(i);
        });
        this._geom_maps.dn_colls_objs.forEach( (ent, i) => {
            data.colls.push(ent);
            data.colls_i.push(i);
        });
        return data;
    }
    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    /**
     * Merge ents, no conflict detection, deep copy.
     * @param this_map
     * @param other_map
     * @param type
     */
    private _mergeEnts(this_map: Map<number, any>, other_map: Map<number, any>): void {
        other_map.forEach( (ent, ent_i) => {
            this_map.set(ent_i, lodash.cloneDeep(ent)); // TODO change to slice() once colls have been updated
        });
    }
    /**
     * Merge objects and collections, with conflict detection, deep copy.
     * This is for merging"
     * point_i->vert_i
     * pline_i-> wire_i
     * pgon_i->face-i
     * coll_i->[parent, points_i, plines_i, pgons_i]
     * @param other_geom
     * @param ent_type
     */
    private _mergeObjCollEnts(other_geom: GIGeom, ent_type: EEntType): void {
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
                    throw new Error('Conflict merging ' + getEntTypeName(ent_type) + '.');
                }
            } else {
                this_map.set(ent_i, lodash.cloneDeep(ent)); // TODO change to slice() once colls have been updated
                this._geom.time_stamp.setEntTs(ent_type, ent_i, other_ts);
            }
        });
    }
    /**
     * Merge collections, no conflict detection, deep copy.
     * This is for merging:
     * point_i->colls_i
     * pline_i->colls_i
     * pgon_i->colls_i
     * @param other_geom
     */
    private _mergeColls(this_map: Map<number, any>, other_map: Map<number, any>): void {
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
                this_map.set(other_ent_i, lodash.cloneDeep(other_colls_i)); // TODO change to slice() once colls have been updated
            }
        });
    }
    /**
     * Merge posis, with conflict detection, deep copy.
     * This is for merging:
     * posi_i->verts_i
     * @param other_geom
     */
    private _mergePosis(other_geom: GIGeom): void {
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
     *
     * @param this_map
     * @param other_map
     * @param selected
     */
    private _dumpEntsSelect(this_map: Map<number, any>, other_map: Map<number, any>, selected: Set<number>): void {
        selected.forEach( ent_i => {
            const other_ent = other_map.get(ent_i);
            if (other_ent !== undefined) {
                this_map.set(ent_i, lodash.cloneDeep(other_ent)); // TODO change to slice() once colls have been updated
            }
        });
    }
    /**
     *
     * @param other_geom
     * @param ent_type
     * @param selected
     */
    private _dumpPosiObjCollSelect(other_geom: GIGeom, ent_type: EEntType, selected: Set<number>): void {
        // get key
        const geom_array_key: string = EEntStrToGeomMaps[ent_type];
        // get maps
        const this_map = this._geom_maps[geom_array_key];
        const other_map = other_geom._geom_maps[geom_array_key];
        // dump
        selected.forEach( ent_i => {
            const other_ent = other_map.get(ent_i);
            if (other_ent !== undefined) {
                this_map.set(ent_i, lodash.cloneDeep(other_ent)); // TODO change to slice() once colls have been updated
                const other_ts: number = other_geom.time_stamp.getEntTs(ent_type, ent_i);
                this._geom.time_stamp.setEntTs(ent_type, ent_i, other_ts);
            }
        });
    }
}
