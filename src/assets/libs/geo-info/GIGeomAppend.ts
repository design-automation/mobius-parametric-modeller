import { IGeomMaps, TTri, TEdge, TWire, TFace,
    TVert, TFaceTri, TPoint, TPline, TPgon, EEntType } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for appending geometry from another model into this model.
 * The entities that get appended may have have new entity IDs.
 */
export class GIGeomAppend {
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
     * The entities in the other model are renumbered.
     * @param other_geom_maps The geom_arrays of the other model.
     */
    public append(other_geom_maps: IGeomMaps): Map<string, Map<number, number>> {
        // get lengths of existing entities before we start adding stuff
        // const num_posis: number = this._geom_maps.num_posis;
        // const num_posis: number = this._geom_maps.up_posis_verts.size;
        // const num_verts: number = this._geom_maps.dn_verts_posis.size;
        // const num_tris: number = this._geom_maps.dn_tris_verts.size;
        // const num_edges: number = this._geom_maps.dn_edges_verts.size;
        // const num_wires: number = this._geom_maps.dn_wires_edges.size;
        // const num_faces: number = this._geom_maps.dn_faces_wires.size;
        // const num_points: number = this._geom_maps.dn_points_verts.size;
        // const num_plines: number = this._geom_maps.dn_plines_wires.size;
        // const num_pgons: number = this._geom_maps.dn_pgons_faces.size;
        // const num_colls: number = this._geom_maps.up_colls_colls.size;
        // ======================================================================
        // get maps for entities
        // positions
        const renum_posis_map: Map<number, number> = new Map();
        let posis_count = 0;
        other_geom_maps.up_posis_verts.forEach( (_, other_posi_i) => {
            renum_posis_map.set(other_posi_i, this._geom.modeldata.model.metadata.nextPosi());
            posis_count += 1;
        });
        // vertices
        const renum_verts_map: Map<number, number> = new Map();
        let vert_count = 0;
        other_geom_maps.dn_verts_posis.forEach( (_, other_vert_i) => {
            renum_verts_map.set(other_vert_i, this._geom.modeldata.model.metadata.nextVert());
            vert_count += 1;
        });
        // triangles
        const renum_tris_map: Map<number, number> = new Map();
        let tris_count = 0;
        other_geom_maps.dn_tris_verts.forEach( (_, other_tri_i) => {
            renum_tris_map.set(other_tri_i, this._geom.modeldata.model.metadata.nextTri());
            tris_count += 1;
        });
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        let edges_count = 0;
        other_geom_maps.dn_edges_verts.forEach( (_, other_edge_i) => {
            renum_edges_map.set(other_edge_i, this._geom.modeldata.model.metadata.nextEdge());
            edges_count += 1;
        });
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        let wires_count = 0;
        other_geom_maps.dn_wires_edges.forEach( (_, other_wire_i) => {
            renum_wires_map.set(other_wire_i, this._geom.modeldata.model.metadata.nextWire());
            wires_count += 1;
        });
        // faces
        const renum_faces_map: Map<number, number> = new Map();
        let faces_count = 0;
        other_geom_maps.dn_faces_wires.forEach( (_, other_face_i) => {
            renum_faces_map.set(other_face_i, this._geom.modeldata.model.metadata.nextFace());
            faces_count += 1;
        });
        // points
        const renum_points_map: Map<number, number> = new Map();
        let points_count = 0;
        other_geom_maps.dn_points_verts.forEach( (_, other_point_i) => {
            renum_points_map.set(other_point_i, this._geom.modeldata.model.metadata.nextPoint());
            points_count += 1;
        });
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        let plines_count = 0;
        other_geom_maps.dn_plines_wires.forEach( (_, other_wire_i) => {
            renum_plines_map.set(other_wire_i, this._geom.modeldata.model.metadata.nextPline());
            plines_count += 1;
        });
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        let pgons_count = 0;
        other_geom_maps.dn_pgons_faces.forEach( (_, other_pgon_i) => {
            renum_pgons_map.set(other_pgon_i, this._geom.modeldata.model.metadata.nextPgon());
            pgons_count += 1;
        });
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        let colls_count = 0;
        other_geom_maps.up_colls_colls.forEach( (_, other_coll_i) => {
            renum_colls_map.set(other_coll_i, this._geom.modeldata.model.metadata.nextColl());
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
            const new_point_i: number = renum_points_map.get(other_point_i);
            this._geom_maps.dn_points_verts.set(
                new_point_i,
                renum_verts_map.get(other_vert_i) as TPoint
            );
            this._geom.time_stamp.updateEntTs(EEntType.POINT, new_point_i);
        });
        // add plines to model
        other_geom_maps.dn_plines_wires.forEach( (other_wire_i, other_pline_i) => {
            const new_pline_i: number = renum_plines_map.get(other_pline_i);
            this._geom_maps.dn_plines_wires.set(
                new_pline_i,
                renum_wires_map.get(other_wire_i) as TPline
            );
            this._geom.time_stamp.updateEntTs(EEntType.PLINE, new_pline_i);
        });
        // add pgons to model
        other_geom_maps.dn_pgons_faces.forEach( (other_face_i, other_pgon_i) => {
            const new_pgon_i: number = renum_pgons_map.get(other_pgon_i);
            this._geom_maps.dn_pgons_faces.set(
                new_pgon_i,
                renum_faces_map.get(other_face_i) as TPgon
            );
            this._geom.time_stamp.updateEntTs(EEntType.PGON, new_pgon_i);
        });
        // add collections to model
        other_geom_maps.dn_colls_points.forEach( (other_points_i, other_coll_i) => {
            this._geom_maps.dn_colls_points.set(
                renum_colls_map.get(other_coll_i),
                other_points_i.map( other_point_i => renum_points_map.get(other_point_i)) as number[]
            );
        });
        other_geom_maps.dn_colls_plines.forEach( (other_plines_i, other_coll_i) => {
            this._geom_maps.dn_colls_plines.set(
                renum_colls_map.get(other_coll_i),
                other_plines_i.map( other_pline_i => renum_plines_map.get(other_pline_i)) as number[]
            );
        });
        other_geom_maps.dn_colls_pgons.forEach( (other_pgons_i, other_coll_i) => {
            this._geom_maps.dn_colls_pgons.set(
                renum_colls_map.get(other_coll_i),
                other_pgons_i.map( other_pgon_i => renum_pgons_map.get(other_pgon_i)) as number[]
            );
        });
        // ======================================================================
        // update up arrays
        // update posis to verts (they can be null or [])
        // this array is used to capture deleted posis
        other_geom_maps.up_posis_verts.forEach( (other_verts_i, other_posi_i) => {
            const new_posi_i: number = renum_posis_map.get(other_posi_i);
            this._geom_maps.up_posis_verts.set(
                new_posi_i,
                other_verts_i.map( other_vert_i => renum_verts_map.get(other_vert_i))
            );
            this._geom.time_stamp.updateEntTs(EEntType.POSI, new_posi_i);
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
        // update colls to colls
        other_geom_maps.up_colls_colls.forEach( (other_parent_coll_i, other_coll_i) => {
            const new_coll_i: number = renum_colls_map.get(other_coll_i);
            this._geom_maps.up_colls_colls.set(
                new_coll_i,
                renum_colls_map.get(other_parent_coll_i),
            );
            this._geom.time_stamp.updateEntTs(EEntType.COLL, new_coll_i);
        });
        // Check that we have correct number of time stamps
        // TODO this can be deleted later
        this._geom.time_stamp.checkTimeStamps();
        // return the maps
        return renum_maps;
    }
}
