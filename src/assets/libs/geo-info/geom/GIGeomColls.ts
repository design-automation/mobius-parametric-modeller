import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for attribute snapshot.
 */
export class GIGeomColls {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================================
    // Coll ancestor and descendent collections
    // ============================================================================================
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    public getCollAncestors(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        const ancestor_colls_i: number[] = [];
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll_i);
        while (parent_coll_i !== undefined) {
            ancestor_colls_i.push(parent_coll_i);
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return ancestor_colls_i;
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    public getCollDescendents(coll_i: number): number[] {
        const descendent_colls_i: number[] = [];
        this._getCollDescendents(coll_i, descendent_colls_i);
        return descendent_colls_i;
    }
    private _getCollDescendents(coll_i: number, descendent_colls_i: number[]): void {
        const ssid: number = this.modeldata.active_ssid;
        const child_colls_i: number[] = this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
        if (child_colls_i === undefined) { return; }
        child_colls_i.forEach( coll2_i => {
            descendent_colls_i.push(coll2_i);
            this._getCollDescendents(coll2_i, descendent_colls_i);
        });
    }
    /**
     * Returns true if the first coll is a descendent of the second coll.
     * @param coll_i
     */
    public isCollDescendent(coll1_i: number, coll2_i: number): boolean {
        const ssid: number = this.modeldata.active_ssid;
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll1_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll2_i) { return true; }
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return false;
    }
    /**
     * Returns true if the first coll is an ancestor of the second coll.
     * @param coll_i
     */
    public isCollAncestor(coll1_i: number, coll2_i: number): boolean {
        const ssid: number = this.modeldata.active_ssid;
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll2_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll1_i) { return true; }
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return false;
    }
}
