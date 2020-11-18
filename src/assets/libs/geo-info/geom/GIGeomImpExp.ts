import { IGeomMaps, TTri, TEdge, TWire,
    TPgonTri, TPoint, TPline, TPgon, EEntType, IEntSets, IGeomJSONData } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for ...
 */
export class GIGeomImpExp {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Import GI data into this model
     * @param other_geom_maps The geom_arrays of the other model.
     */
    public importGI( gi_data: IGeomJSONData ): Map<EEntType, Map<number, number>> {
        const ssid: number = this.modeldata.active_ssid;
        // ======================================================================
        // get maps for entities
        // positions
        const renum_posis_map: Map<number, number> = new Map();
        for (const other_posi_i of gi_data.posis_i) {
            renum_posis_map.set(other_posi_i, this.modeldata.model.metadata.nextPosi());
        }
        // vertices
        const renum_verts_map: Map<number, number> = new Map();
        for (const other_vert_i of gi_data.verts_i) {
            renum_verts_map.set(other_vert_i, this.modeldata.model.metadata.nextVert());
        }
        // triangles
        const renum_tris_map: Map<number, number> = new Map();
        for (const other_tri_i of gi_data.tris_i) {
            renum_tris_map.set(other_tri_i, this.modeldata.model.metadata.nextTri());
        }
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        for (const other_edge_i of gi_data.edges_i) {
            renum_edges_map.set(other_edge_i, this.modeldata.model.metadata.nextEdge());
        }
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        for (const other_wire_i of gi_data.wires_i) {
            renum_wires_map.set(other_wire_i, this.modeldata.model.metadata.nextWire());
        }
        // // faces
        // const renum_faces_map: Map<number, number> = new Map();
        // for (const other_face_i of gi_data.faces_i) {
        //     renum_faces_map.set(other_face_i, this.modeldata.model.metadata.nextFace());
        // }
        // points
        const renum_points_map: Map<number, number> = new Map();
        for (const other_point_i of gi_data.points_i) {
            renum_points_map.set(other_point_i, this.modeldata.model.metadata.nextPoint());
        }
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        for (const other_pline_i of gi_data.plines_i) {
            renum_plines_map.set(other_pline_i, this.modeldata.model.metadata.nextPline());
        }
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        for (const other_pgon_i of gi_data.pgons_i) {
            renum_pgons_map.set(other_pgon_i, this.modeldata.model.metadata.nextPgon());
        }
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        for (const other_coll_i of gi_data.colls_i) {
            renum_colls_map.set(other_coll_i, this.modeldata.model.metadata.nextColl());
        }
        // create maps to be return later
        // these maps are required when appending the attribute data
        const renum_maps: Map<EEntType, Map<number, number>> = new Map();
        renum_maps.set(EEntType.POSI, renum_posis_map);
        renum_maps.set(EEntType.VERT, renum_verts_map);
        renum_maps.set(EEntType.EDGE, renum_edges_map);
        renum_maps.set(EEntType.WIRE, renum_wires_map);
        renum_maps.set(EEntType.POINT, renum_points_map);
        renum_maps.set(EEntType.PLINE, renum_plines_map);
        renum_maps.set(EEntType.PGON, renum_pgons_map);
        renum_maps.set(EEntType.COLL, renum_colls_map);
        // ======================================================================
        // update arrays
        // posis->verts, create empty []
        for (let i = 0; i < gi_data.posis_i.length; i++) {
            const other_posi_i: number = renum_posis_map.get(gi_data.posis_i[i]);
            this._geom_maps.up_posis_verts.set(other_posi_i, []);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, other_posi_i);
        }
        // add vertices to model
        for (let i = 0; i < gi_data.verts_i.length; i++) {
            const other_vert_i: number = renum_verts_map.get(gi_data.verts_i[i]);
            const other_posi_i: number = renum_posis_map.get(gi_data.verts[i]);
            // down
            this._geom_maps.dn_verts_posis.set(other_vert_i, other_posi_i);
            // up
            this._geom_maps.up_posis_verts.get(other_posi_i).push(other_vert_i);
        }
        // add triangles to model
        for (let i = 0; i < gi_data.tris_i.length; i++) {
            const other_tri_i: number = renum_tris_map.get(gi_data.tris_i[i]);
            const other_verts_i: TTri = gi_data.tris[i].map( other_vert_i => renum_verts_map.get(other_vert_i) ) as TTri;
            // down
            this._geom_maps.dn_tris_verts.set(other_tri_i, other_verts_i);
            // up
            other_verts_i.forEach( vert_i => {
                if (!this._geom_maps.up_verts_tris.has(vert_i)) {
                    this._geom_maps.up_verts_tris.set(vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(vert_i).push(other_tri_i);
            });
        }
        // add edges to model
        for (let i = 0; i < gi_data.edges_i.length; i++) {
            const other_edge_i: number = renum_edges_map.get(gi_data.edges_i[i]);
            const other_verts_i: TEdge = gi_data.edges[i].map( other_vert_i => renum_verts_map.get(other_vert_i) ) as TEdge;
            // down
            this._geom_maps.dn_edges_verts.set(other_edge_i, other_verts_i);
            // up
            other_verts_i.forEach( (vert_i, index) => {
                if (!this._geom_maps.up_verts_edges.has(vert_i)) {
                    this._geom_maps.up_verts_edges.set(vert_i, []);
                }
                if (index === 0) {
                    this._geom_maps.up_verts_edges.get(vert_i).push(other_edge_i);
                } else if (index === 1) {
                    this._geom_maps.up_verts_edges.get(vert_i).splice(0, 0, other_edge_i);
                }
                if (index > 1) {
                    throw new Error('Import data error: Found an edge with more than two vertices.');
                }
            });
        }
        // add wires to model
        for (let i = 0; i < gi_data.wires_i.length; i++) {
            const other_wire_i: number = renum_wires_map.get(gi_data.wires_i[i]);
            const other_edges_i: TWire = gi_data.wires[i].map( other_edge_i => renum_edges_map.get(other_edge_i) ) as TWire;
            // down
            this._geom_maps.dn_wires_edges.set(other_wire_i, other_edges_i);
            // up
            other_edges_i.forEach( edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, other_wire_i);
            });
        }
        // add faces to model
        // for (let i = 0; i < gi_data.faces_i.length; i++) {
        //     const other_face_i: number = renum_faces_map.get(gi_data.faces_i[i]);
        //     const other_wires_i: TFaceTri = gi_data.faces[i].map( other_wire_i => renum_wires_map.get(other_wire_i) ) as TFace;
        //     const other_tris_i: TFaceTri = gi_data.facetris[i].map ( other_tri_i => renum_tris_map.get(other_tri_i) ) as TFaceTri;
        //     // down
        //     this._geom_maps.dn_faces_wires.set(other_face_i, other_wires_i);
        //     this._geom_maps.dn_faces_tris.set(other_face_i, other_tris_i);
        //     // up
        //     other_wires_i.forEach( wire_i => {
        //         this._geom_maps.up_wires_faces.set(wire_i, other_face_i);
        //     });
        //     other_tris_i.forEach( tri_i => {
        //         this._geom_maps.up_tris_faces.set(tri_i, other_face_i);
        //     });
        // }
        // add points to model
        for (let i = 0; i < gi_data.points_i.length; i++) {
            const other_point_i: number = renum_points_map.get(gi_data.points_i[i]);
            const other_vert_i: TPoint = renum_verts_map.get(gi_data.points[i]) as TPoint;
            // down
            this._geom_maps.dn_points_verts.set(other_point_i, other_vert_i);
            // up
            this._geom_maps.up_verts_points.set(other_vert_i, other_point_i);
            // timestamp
            this.modeldata.updateEntTs(EEntType.POINT, other_point_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POINT, other_point_i);
        }
        // add plines to model
        for (let i = 0; i < gi_data.plines_i.length; i++) {
            const other_pline_i: number = renum_plines_map.get(gi_data.plines_i[i]);
            const other_wire_i: TPline = renum_wires_map.get(gi_data.plines[i]) as TPline;
            // down
            this._geom_maps.dn_plines_wires.set(other_pline_i, other_wire_i);
            // up
            this._geom_maps.up_wires_plines.set(other_wire_i, other_pline_i);
            // timestamp
            this.modeldata.updateEntTs(EEntType.PLINE, other_pline_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PLINE, other_pline_i);
        }
        // add pgons to model
        // for (let i = 0; i < gi_data.pgons_i.length; i++) {
        //     const other_pgon_i: number = renum_pgons_map.get(gi_data.pgons_i[i]);
        //     const other_face_i: TPgon = renum_faces_map.get(gi_data.pgons[i]) as TPgon;
        //     // down
        //     this._geom_maps.dn_pgons_faces.set(other_pgon_i, other_face_i);
        //     // up
        //     this._geom_maps.up_faces_pgons.set(other_face_i, other_pgon_i);
        //     // timestamp
        //     this.modeldata.updateEntTs(EEntType.PGON, other_pgon_i);
        //     // snapshot
        //     this.modeldata.geom.snapshot.addEnt(ssid, EEntType.PGON, other_pgon_i);
        // }
        for (let i = 0; i < gi_data.pgons_i.length; i++) {
            const other_pgon_i: number = renum_pgons_map.get(gi_data.pgons_i[i]);
            const other_wires_i: TPgon = gi_data.pgons[i].map( other_wire_i => renum_wires_map.get(other_wire_i) ) as TPgon;
            const other_tris_i: TPgonTri = gi_data.pgontris[i].map ( other_tri_i => renum_tris_map.get(other_tri_i) ) as TPgonTri;
            // down
            this._geom_maps.dn_pgons_wires.set(other_pgon_i, other_wires_i);
            this._geom_maps.dn_pgons_tris.set(other_pgon_i, other_tris_i);
            // up
            other_wires_i.forEach( wire_i => {
                this._geom_maps.up_wires_pgons.set(wire_i, other_pgon_i);
            });
            other_tris_i.forEach( tri_i => {
                this._geom_maps.up_tris_pgons.set(tri_i, other_pgon_i);
            });
            // timestamp
            this.modeldata.updateEntTs(EEntType.PGON, other_pgon_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PGON, other_pgon_i);
        }
        // add colls to model
        for (let i = 0; i < gi_data.colls_i.length; i++) {
            const other_coll_i: number = gi_data.colls_i[i];
            // set
            this._geom_maps.colls.add( renum_colls_map.get(other_coll_i) );
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);
        }
        // ========================================================================================
        // return the maps
        return renum_maps;
    }
    /**
     * Export GI data out of this model.
     */
    public exportGI(ent_sets: IEntSets): IGeomJSONData {
        const data: IGeomJSONData = {
            posis_i: [],
            verts: [], verts_i: [],
            tris: [], tris_i: [],
            edges: [], edges_i: [],
            wires: [], wires_i: [],
            points: [], points_i: [],
            plines: [], plines_i: [],
            pgons: [], pgontris: [], pgons_i: [],
            colls_i: [],
            selected: this.modeldata.geom.selected
        };
        for (const ent_i of ent_sets.ps) { data.posis_i.push(ent_i); }
        for (const ent_i of ent_sets._v) {
            data.verts_i.push(ent_i);
            data.verts.push( this._geom_maps.dn_verts_posis.get(ent_i) );
        }
        for (const ent_i of ent_sets._t) {
            data.tris_i.push(ent_i);
            data.tris.push( this._geom_maps.dn_tris_verts.get(ent_i) );
        }
        for (const ent_i of ent_sets._e) {
            data.edges_i.push(ent_i);
            data.edges.push( this._geom_maps.dn_edges_verts.get(ent_i) );
        }
        for (const ent_i of ent_sets._w) {
            data.wires_i.push(ent_i);
            data.wires.push( this._geom_maps.dn_wires_edges.get(ent_i) );
        }
        // for (const ent_i of ent_sets._f) {
        //     data.faces_i.push(ent_i);
        //     data.faces.push( this._geom_maps.dn_faces_wires.get(ent_i) );
        //     data.facetris.push( this._geom_maps.dn_faces_tris.get(ent_i) );
        // }
        for (const ent_i of ent_sets.pt) {
            data.points_i.push(ent_i);
            data.points.push( this._geom_maps.dn_points_verts.get(ent_i) );
        }
        for (const ent_i of ent_sets.pl) {
            data.plines_i.push(ent_i);
            data.plines.push( this._geom_maps.dn_plines_wires.get(ent_i) );
        }
        for (const ent_i of ent_sets.pg) {
            data.pgons_i.push(ent_i);
            data.pgons.push( this._geom_maps.dn_pgons_wires.get(ent_i) );
            data.pgontris.push( this._geom_maps.dn_pgons_tris.get(ent_i) );
        }
        for (const ent_i of ent_sets.co) {
            data.colls_i.push(ent_i);
        }
        return data;
    }
    /**
     * Export GI data out of this model.
     */
    public exportGIAll(): IGeomJSONData {
        // TODO
        throw new Error("Not implemented.");
        // TODO
    }
}
