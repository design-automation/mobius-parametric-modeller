import { arrAddToSet, arrRem } from '../../util/arrs';
import { EAttribNames, EEntType } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for attribute snapshot.
 */
export class GIAttribsColls {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    // ============================================================================================
    //
    // ============================================================================================
    /**
     * Get the collections of a point.
     * @param point_i
     */
    public getPointColls(point_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // TODO test performance
        return this.modeldata.geom.snapshot.getEnts(ssid, EEntType.COLL).filter( coll_i => {
            return this.getCollPoints(coll_i).indexOf(point_i) !== -1;
        });
    }
    /**
     * Get the collections of a pline.
     * @param pline_i
     */
    public getPlineColls(pline_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // TODO test performance
        return this.modeldata.geom.snapshot.getEnts(ssid, EEntType.COLL).filter( coll_i => {
            return this.getCollPlines(coll_i).indexOf(pline_i) !== -1;
        });
    }
    /**
     * Get the collections of a pgon
     * @param pgon_i
     */
    public getPgonColls(pgon_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // TODO test performance
        return this.modeldata.geom.snapshot.getEnts(ssid, EEntType.COLL).filter( coll_i => {
            return this.getCollPgons(coll_i).indexOf(pgon_i) !== -1;
        });
    }
    // ============================================================================================
    // Get entities from colls
    // ============================================================================================
    /**
     * Get the points of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPoints(coll_i: number): number[] {
        const ents_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_POINTS, ) as number[];
        if ( ents_i === undefined) { return []; }
        return Array.from(ents_i);
    }
    /**
     * Get the plines of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPlines(coll_i: number): number[] {
        const ents_i: number[] =  this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PLINES) as number[];
        if ( ents_i === undefined) { return []; }
        return Array.from(ents_i);
    }
    /**
     * Get the pgons of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPgons(coll_i: number): number[] {
        const ents_i: number[] =  this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PGONS) as number[];
        if ( ents_i === undefined) { return []; }
        return Array.from(ents_i);
    }
    /**
     * Get the children collections of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollChildren(coll_i: number): number[] {
        const ents_i: number[] =  this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_CHILDS) as number[];
        if ( ents_i === undefined) { return []; }
        return Array.from(ents_i);
    }
    /**
     * Get the parent of as copy.
     * @param coll_i
     */
    public getCollParent(coll_i: number): number {
        return this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PARENT) as number;
    }
    // ============================================================================================
    // Set entities in colls
    // ============================================================================================
    /**
     * Set the points in a collection
     * @param coll_i The index of the collection
     * @param points_i
     */
    public setCollPoints(coll_i: number, points_i: number[]): void {
        this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_POINTS, points_i);
    }
    /**
     * Set the plines in a collection
     * @param coll_i The index of the collection
     * @param plines_i
     */
    public setCollPlines(coll_i: number, plines_i: number[]): void {
        this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PLINES, plines_i);
    }
    /**
     * Set the pgons in a collection
     * @param coll_i The index of the collection
     * @param pgons_i
     */
    public setCollPgons(coll_i: number, pgons_i: number[]): void {
        this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PGONS, pgons_i);
    }
    /**
     * Set the child collections in a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The indicies of teh child collections
     */
    public setCollChildren(coll_i: number, child_colls_i: number[]): void {
        this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_CHILDS, child_colls_i);
        // set parents
        child_colls_i.forEach( child_coll_i => {
            this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, child_coll_i, EAttribNames.COLL_PARENT, coll_i);
        });
    }
    /**
     * Set the parent for a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The index of the parent collection
     */
    public setCollParent(coll_i: number, parent_coll_i: number): void {
        this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PARENT, parent_coll_i);
        // set children
        const child_colls_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, parent_coll_i, EAttribNames.COLL_CHILDS) as number[];
        if (child_colls_i === undefined) {
            this.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, parent_coll_i, EAttribNames.COLL_CHILDS, [coll_i]);
        }
        arrAddToSet(child_colls_i, coll_i);
    }
    // ============================================================================================
    // Add and remove multiple entities in colls
    // ============================================================================================
    /**
     * Set the points in a collection
     * @param coll_i The index of the collection
     * @param points_i
     */
    public addCollPoints(coll_i: number, points_i: number|number[]): void {
        points_i = Array.isArray(points_i) ? points_i : [points_i];
        const exist_points_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_POINTS) as number[];
        if (exist_points_i === undefined) {
            this.setCollPoints(coll_i, points_i);
        } else {
            points_i.forEach( point_i => arrAddToSet(exist_points_i, point_i) );
            this.setCollPoints(coll_i, exist_points_i);
        }
    }
    /**
     * Set the plines in a collection
     * @param coll_i The index of the collection
     * @param plines_i
     */
    public addCollPlines(coll_i: number, plines_i: number|number[]): void {
        plines_i = Array.isArray(plines_i) ? plines_i : [plines_i];
        const exist_plines_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PLINES) as number[];
        if (exist_plines_i === undefined) {
            this.setCollPlines(coll_i, plines_i);
        } else {
            plines_i.forEach( pline_i => arrAddToSet(exist_plines_i, pline_i) );
            this.setCollPlines(coll_i, exist_plines_i);
        }
    }
    /**
     * Set the pgons in a collection
     * @param coll_i The index of the collection
     * @param pgons_i
     */
    public addCollPgons(coll_i: number, pgons_i: number|number[]): void {
        pgons_i = Array.isArray(pgons_i) ? pgons_i : [pgons_i];
        const exist_pgons_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_PGONS) as number[];
        if (exist_pgons_i === undefined) {
            this.setCollPgons(coll_i, pgons_i);
        } else {
            pgons_i.forEach( pgon_i => arrAddToSet(exist_pgons_i, pgon_i) );
            this.setCollPgons(coll_i, exist_pgons_i);
        }
    }
    /**
     * Set the child collections in a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The indicies of teh child collections
     */
    public addCollChildren(coll_i: number, child_colls_i: number[]): void {
        child_colls_i = Array.isArray(child_colls_i) ? child_colls_i : [child_colls_i];
        const exist_child_colls_i: number[] = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_CHILDS) as number[];
        if (exist_child_colls_i === undefined) {
            this.setCollChildren(coll_i, child_colls_i);
        } else {
            child_colls_i.forEach( child_coll_i => {
                arrAddToSet(exist_child_colls_i, child_coll_i);
                this.setCollChildren(coll_i, exist_child_colls_i);
                this.setCollParent(child_coll_i, coll_i);
            });
        }
    }
    /**
     * Add entities to a collection.
     * If the entities are already in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public collAddEnts(coll_i: number, points_i: number[], plines_i: number[], pgons_i: number[], colls_i: number[]): void {
        this.addCollPoints(coll_i, points_i);
        this.addCollPlines(coll_i, plines_i);
        this.addCollPgons(coll_i, pgons_i);
        this.addCollChildren(coll_i, colls_i);
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public collRemoveEnts(coll_i: number, points_i: number[], plines_i: number[], pgons_i: number[], colls_i: number[]): void {
        const coll_points_i: number[] = this.getCollPoints(coll_i);
        if (points_i.length) {
            for (const point_i of points_i) {
                arrRem(coll_points_i, point_i);
            }
        }
        const coll_plines_i: number[] = this.getCollPlines(coll_i);
        if (plines_i.length) {
            for (const pline_i of plines_i) {
                arrRem(coll_plines_i, pline_i);
            }
        }
        const coll_pgons_i: number[] = this.getCollPgons(coll_i);
        if (pgons_i.length) {
            for (const pgon_i of pgons_i) {
                arrRem(coll_pgons_i, pgon_i);
            }
        }
        const coll_childs_i: number[] = this.getCollChildren(coll_i);
        if (colls_i.length) {
            for (const coll2_i of colls_i) {
                if (coll_i !== coll2_i) {
                    const index = arrRem(coll_childs_i, coll2_i);
                    if (index !== -1) {
                        this.setCollParent(coll2_i, null);
                    }
                }
            }
        }
    }
    // ============================================================================================
    // Coll ancestor and descendent collections
    // ============================================================================================
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    public getCollAncestors(coll_i: number): number[] {
        const ancestor_colls_i: number[] = [];
        let parent_coll_i: number = this.getCollParent(coll_i);
        while (parent_coll_i !== undefined) {
            ancestor_colls_i.push(parent_coll_i);
            parent_coll_i = this.getCollParent(parent_coll_i);
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
        const child_colls_i: number[] = this.getCollChildren(coll_i);
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
        let parent_coll_i: number = this.getCollParent(coll1_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll2_i) { return true; }
            parent_coll_i = this.getCollParent(parent_coll_i);
        }
        return false;
    }
    /**
     * Returns true if the first coll is an ancestor of the second coll.
     * @param coll_i
     */
    public isCollAncestor(coll1_i: number, coll2_i: number): boolean {
        let parent_coll_i: number = this.getCollParent(coll2_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll1_i) { return true; }
            parent_coll_i = this.getCollParent(parent_coll_i);
        }
        return false;
    }
}
