import { IGeomMaps, TTri, TEdge, TWire,
    TPgonTri, TPoint, TPline, TPgon, EEntType, IEntSets, IGeomJSONData, IRenumMaps } from '../common';
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
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    public importGIRenum( gi_data: IGeomJSONData ): IRenumMaps {
        // positions
        const renum_posis_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.num_posis; i++) {
            renum_posis_map.set(i, this.modeldata.model.metadata.nextPosi());
        }
        // vertices
        const renum_verts_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.verts.length; i++) {
            renum_verts_map.set(i, this.modeldata.model.metadata.nextVert());
        }
        // triangles
        const renum_tris_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.tris.length; i++) {
            renum_tris_map.set(i, this.modeldata.model.metadata.nextTri());
        }
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.edges.length; i++) {
            renum_edges_map.set(i, this.modeldata.model.metadata.nextEdge());
        }
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.wires.length; i++) {
            renum_wires_map.set(i, this.modeldata.model.metadata.nextWire());
        }
        // points
        const renum_points_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.points.length; i++) {
            renum_points_map.set(i, this.modeldata.model.metadata.nextPoint());
        }
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.plines.length; i++) {
            renum_plines_map.set(i, this.modeldata.model.metadata.nextPline());
        }
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.pgons.length; i++) {
            renum_pgons_map.set(i, this.modeldata.model.metadata.nextPgon());
        }
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        for (let i = 0; i < gi_data.coll_pgons.length; i++) {
            renum_colls_map.set(i, this.modeldata.model.metadata.nextColl());
        }
        // return maps
        const renum_maps: IRenumMaps = {
            posis: renum_posis_map,
            verts: renum_verts_map,
            tris: renum_tris_map,
            edges: renum_edges_map,
            wires: renum_wires_map,
            points: renum_points_map,
            plines: renum_plines_map,
            pgons: renum_pgons_map,
            colls: renum_colls_map
        };
        return renum_maps;
    }
    /**
     * Import GI data into this model
     * @param other_geom_maps The geom_arrays of the other model.
     */
    public importGI(gi_data: IGeomJSONData, renum_maps: IRenumMaps): void {
        const ssid: number = this.modeldata.active_ssid;
        // posis->verts, create empty []
        for (let i = 0; i < gi_data.num_posis; i++) {
            const other_posi_i: number = renum_maps.posis.get(i);
            this._geom_maps.up_posis_verts.set(other_posi_i, []);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, other_posi_i);
        }
        // add vertices to model
        for (let i = 0; i < gi_data.verts.length; i++) {
            const other_vert_i: number = renum_maps.verts.get(i);
            const other_posi_i: number = renum_maps.posis.get(gi_data.verts[i]);
            // down
            this._geom_maps.dn_verts_posis.set(other_vert_i, other_posi_i);
            // up
            this._geom_maps.up_posis_verts.get(other_posi_i).push(other_vert_i);
        }
        // add triangles to model
        for (let i = 0; i < gi_data.tris.length; i++) {
            const other_tri_i: number = renum_maps.tris.get(i);
            const other_verts_i: TTri = gi_data.tris[i].map(other_vert_i => renum_maps.verts.get(other_vert_i) ) as TTri;
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
        for (let i = 0; i < gi_data.edges.length; i++) {
            const other_edge_i: number = renum_maps.edges.get(i);
            const other_verts_i: TEdge = gi_data.edges[i].map(other_vert_i => renum_maps.verts.get(other_vert_i) ) as TEdge;
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
        for (let i = 0; i < gi_data.wires.length; i++) {
            const other_wire_i: number = renum_maps.wires.get(i);
            const other_edges_i: TWire = gi_data.wires[i].map(other_edge_i => renum_maps.edges.get(other_edge_i) ) as TWire;
            // down
            this._geom_maps.dn_wires_edges.set(other_wire_i, other_edges_i);
            // up
            other_edges_i.forEach( edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, other_wire_i);
            });
        }
        // add points to model
        for (let i = 0; i < gi_data.points.length; i++) {
            const other_point_i: number = renum_maps.points.get(i);
            const other_vert_i: TPoint = renum_maps.verts.get(gi_data.points[i]) as TPoint;
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
        for (let i = 0; i < gi_data.plines.length; i++) {
            const other_pline_i: number = renum_maps.plines.get(i);
            const other_wire_i: TPline = renum_maps.wires.get(gi_data.plines[i]) as TPline;
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
        for (let i = 0; i < gi_data.pgons.length; i++) {
            const other_pgon_i: number = renum_maps.pgons.get(i);
            const other_wires_i: TPgon = gi_data.pgons[i].map(other_wire_i => renum_maps.wires.get(other_wire_i) ) as TPgon;
            const other_tris_i: TPgonTri = gi_data.pgontris[i].map(other_tri_i => renum_maps.tris.get(other_tri_i) ) as TPgonTri;
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
        for (let i = 0; i < gi_data.coll_pgons.length; i++) {

            // const other_coll_i: number = gi_data.colls_i[i];
            // // set
            // this._geom_maps.colls.add( renum_colls_map.get(other_coll_i) );
            // // snapshot
            // this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);

            const other_coll_i: number = renum_maps.colls.get(i);
            const other_pgons_i: number[] = gi_data.coll_pgons[i].map(coll_pgon_i => renum_maps.pgons.get(coll_pgon_i));
            const other_plines_i: number[] = gi_data.coll_plines[i].map(coll_pline_i => renum_maps.plines.get(coll_pline_i));
            const other_points_i: number[] = gi_data.coll_points[i].map(coll_point_i => renum_maps.points.get(coll_point_i));
            const other_childs_i: number[] = gi_data.coll_childs[i].map(coll_child_i => renum_maps.colls.get(coll_child_i));
            // set
            this._geom_maps.colls.add(other_coll_i);
            // snapshot (creates new empts sets of pgons, plines, points, and child collections)
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);
            // add contents of collection in this snapshot
            this.modeldata.geom.snapshot.addCollPgons(ssid, other_coll_i, other_pgons_i);
            this.modeldata.geom.snapshot.addCollPlines(ssid, other_coll_i, other_plines_i);
            this.modeldata.geom.snapshot.addCollPoints(ssid, other_coll_i, other_points_i);
            this.modeldata.geom.snapshot.addCollChildren(ssid, other_coll_i, other_childs_i);
        }
        // ========================================================================================
        // return ???
    }
    /**
     * Export GI data out of this model.
     */
    public exportGIRenum(ent_sets: IEntSets): IRenumMaps {
        let i: number;
        // posis
        const renum_posis_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.ps.forEach(ent_i => {
            renum_posis_map.set(ent_i, i);
            i += 1;
        });
        // verts
        const renum_verts_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._v.forEach(ent_i => {
            renum_verts_map.set(ent_i, i);
            i += 1;
        });
        // tris
        const renum_tris_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._t.forEach(ent_i => {
            renum_tris_map.set(ent_i, i);
            i += 1;
        });
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._e.forEach(ent_i => {
            renum_edges_map.set(ent_i, i);
            i += 1;
        });
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._w.forEach(ent_i => {
            renum_wires_map.set(ent_i, i);
            i += 1;
        });
        // points
        const renum_points_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pt.forEach(ent_i => {
            renum_points_map.set(ent_i, i);
            i += 1;
        });
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pl.forEach(ent_i => {
            renum_plines_map.set(ent_i, i);
            i += 1;
        });
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pg.forEach(ent_i => {
            renum_pgons_map.set(ent_i, i);
            i += 1;
        });
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.co.forEach(ent_i => {
            renum_colls_map.set(ent_i, i);
            i += 1;
        });
        // return maps
        const renum_maps: IRenumMaps =  {
            posis: renum_posis_map,
            verts: renum_verts_map,
            tris: renum_tris_map,
            edges: renum_edges_map,
            wires: renum_wires_map,
            points: renum_points_map,
            plines: renum_plines_map,
            pgons: renum_pgons_map,
            colls: renum_colls_map
        };
        return renum_maps;
    }
    /**
     * Export GI data out of this model.
     */
    public exportGI(ent_sets: IEntSets, renum_maps: IRenumMaps): IGeomJSONData {
        const data: IGeomJSONData = {
            num_posis: 0,
            verts: [], // verts_i: [],
            tris: [], // tris_i: [],
            edges: [], // edges_i: [],
            wires: [], // wires_i: [],
            points: [], // points_i: [],
            plines: [], // plines_i: [],
            pgons: [], pgontris: [], // pgons_i: [],
            coll_pgons: [], coll_plines: [], coll_points: [], coll_childs: [], // colls_i: [],
            selected: this.modeldata.geom.selected
        };
        // posis
        data.num_posis = renum_maps.posis.size;
        // verts
        ent_sets._v.forEach( ent_i => {
            data.verts.push(renum_maps.posis.get(this._geom_maps.dn_verts_posis.get(ent_i)) );
        });
        // tris
        ent_sets._t.forEach( ent_i => {
            data.tris.push(this._geom_maps.dn_tris_verts.get(ent_i).map(vert_i => renum_maps.verts.get(vert_i)) as TTri );
        });
        // edges
        ent_sets._e.forEach( ent_i => {
            data.edges.push(this._geom_maps.dn_edges_verts.get(ent_i).map(vert_i => renum_maps.verts.get(vert_i)) as TEdge );
        });
        // wires
        ent_sets._w.forEach( ent_i => {
            data.wires.push(this._geom_maps.dn_wires_edges.get(ent_i).map(edge_i => renum_maps.edges.get(edge_i)) as TWire );
        });
        // points
        ent_sets.pt.forEach( ent_i => {
            data.points.push(renum_maps.verts.get(this._geom_maps.dn_points_verts.get(ent_i)) );
        });
        // plines
        ent_sets.pl.forEach( ent_i => {
            data.plines.push(renum_maps.wires.get(this._geom_maps.dn_plines_wires.get(ent_i)) );
        });
        // pgons
        ent_sets.pg.forEach( ent_i => {
            data.pgons.push(this._geom_maps.dn_pgons_wires.get(ent_i).map(wire_i => renum_maps.wires.get(wire_i)) );
            data.pgontris.push(this._geom_maps.dn_pgons_tris.get(ent_i).map(tri_i => renum_maps.tris.get(tri_i)) );
        });
        // colls
        ent_sets.co.forEach( ent_i => {
            data.coll_pgons.push(this.modeldata.geom.nav.navCollToPgon(ent_i).map(pgon_i => renum_maps.pgons.get(pgon_i)) );
            data.coll_plines.push(this.modeldata.geom.nav.navCollToPline(ent_i).map(pline_i => renum_maps.plines.get(pline_i))  );
            data.coll_points.push(this.modeldata.geom.nav.navCollToPoint(ent_i).map(point_i => renum_maps.points.get(point_i))  );
            data.coll_childs.push(this.modeldata.geom.nav.navCollToCollChildren(ent_i).map(child_coll_i => renum_maps.colls.get(child_coll_i)) );
        });
        return data;
    }
}
