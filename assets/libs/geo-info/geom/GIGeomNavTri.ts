
import {  IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the triangles in the geometry data structure.
 */
export class GIGeomNavTri {
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
    // Navigate tirangles - down
    // ============================================================================
    /**
     * Never none
     * @param tri_i
     */
    public navTriToVert(tri_i: number): number[] {
        return this._geom_maps.dn_tris_verts.get(tri_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param tri_i
     */
    public navTriToPosi(tri_i: number): number[] {
        const verts_i: number[] = this._geom_maps.dn_tris_verts.get(tri_i);
        return verts_i.map( vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
    }
    /**
     * Never none
     * @param pgon_i
     */
    public navPgonToTri(pgon_i: number): number[] {
        return this._geom_maps.dn_pgons_tris.get(pgon_i); // WARNING BY REF
    }
    // ============================================================================
    // Navigate tirangles - up
    // ============================================================================
    /**
     * Returns undefined if none
     * @param vert_i
     */
    public navVertToTri(vert_i: number): number[] {
        return this._geom_maps.up_verts_tris.get(vert_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param tri_i
     */
    public navTriToPgon(tri_i: number): number {
        return this._geom_maps.up_tris_pgons.get(tri_i);
    }
    /**
     * Never none
     * @param tri_i
     */
    public navTriToColl(tri_i: number): number[] {
        const pgon_i: number = this._geom_maps.up_tris_pgons.get(tri_i);
        return this.modeldata.geom.nav.navPgonToColl(pgon_i);
    }
    // /**
    //  *
    //  * @param ent_type
    //  * @param ent_i
    //  */
    // private _navUpAnyToTri(ent_type: EEntType, ent_i: number): number[] {
    //     if (ent_type > EEntType.TRI) { throw new Error(); }
    //     if (ent_type === EEntType.TRI) { return [ent_i]; }
    //     if (ent_type === EEntType.POSI) {
    //         const tris_i: number[] = [];
    //         for (const vert_i of this._geom_maps.up_posis_verts.get(ent_i)) {
    //             for (const tri_i of this._geom_maps.up_verts_tris.get(vert_i)) {
    //                 if (tri_i !== undefined) { tris_i.push(tri_i); }
    //             }
    //         }
    //         return tris_i;
    //     }
    //     if (ent_type === EEntType.VERT) {
    //         const tris_i: number[] = [];
    //         for (const tri_i of this._geom_maps.up_verts_tris.get(ent_i)) {
    //             if (tri_i !== undefined) { tris_i.push(tri_i); }
    //         }
    //         return tris_i;
    //     }
    //     return []; // nothing
    // }
    // /**
    //  * Tri is between between vert and edge, tri = 2
    //  * Returns [] if none.
    //  * @param
    //  */
    // private _navDnAnyToTri(ent_type: EEntType, ent_i: number): number[] {
    //     if (ent_type < EEntType.TRI) { throw new Error(); }
    //     if (ent_type === EEntType.TRI) { return [ent_i]; }
    //     if (ent_type === EEntType.PGON) {
    //         const tris_i: number[] = [];
    //         for (const tri_i of this._geom_maps.dn_pgons_tris.get(ent_i)) {
    //             tris_i.push( tri_i );
    //         }
    //         return tris_i;
    //     }
    //     if (ent_type === EEntType.COLL) {
    //         const tris_i: number[] = [];
    //         for (const pgon_i of this.navCollToPgon(ent_i)) {
    //             for (const tri_i of this._geom_maps.dn_pgons_tris.get(pgon_i)) {
    //                 tris_i.push( tri_i );
    //             }
    //         }
    //         return tris_i;
    //     }
    //     return []; // everything except pogons and colls
    // }
}
