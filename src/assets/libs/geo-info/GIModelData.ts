import { GIGeom } from './geom/GIGeom';
import { GIAttribs } from './attribs/GIAttribs';
import { IModelJSONData, EEntType, EAttribNames, TEntTypeIdx, IEntSets } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModel } from './GIModel';
import { GIModelThreejs } from './GIModelThreejs';
import { GIFuncsCommon } from './funcs/GIFuncsCommon';
import { GIFuncsMake } from './funcs/GIFuncsMake';
import { GIFuncsEdit } from './funcs/GIFuncsEdit';
import { GIFuncsModify } from './funcs/GIFuncsModify';
import { idMake } from './common_id_funcs';

/**
 * Geo-info model class.
 */
export class GIModelData {
    public active_ssid = 0;
    private _max_timestamp = 0;
    public model: GIModel;
    public geom: GIGeom;
    public attribs: GIAttribs;
    public comparator: GIModelComparator;
    public threejs: GIModelThreejs;
    public debug = true;
    // functions
    public funcs_common = new GIFuncsCommon(this);
    public funcs_make = new GIFuncsMake(this);
    public funcs_edit = new GIFuncsEdit(this);
    public funcs_modify = new GIFuncsModify(this);
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(model: GIModel) {
        this.model = model;
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.comparator = new GIModelComparator(this);
        this.threejs = new GIModelThreejs(this);
        // functions
        this.funcs_common = new GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify(this);
    }
    /**
     * Imports JSOn data into this model.
     * Eexisting data in the model is not affected.
     * @param model_data The JSON data.
     */
    public importGI (model_data: IModelJSONData): void {
        // console.log("SET DATA...", model_data);
        const renum_maps: Map<number, Map<number, number>> = this.geom.imp_exp.importGI(model_data.geometry);
        this.attribs.imp_exp.importGI(model_data.attributes, renum_maps);
    }
    /**
     * Exports the JSON data for this model.
     */
    public exportGI(ents: TEntTypeIdx[]): IModelJSONData {
        let ent_sets: IEntSets;
        if (ents === null) {
            ent_sets = this.geom.snapshot.getAllEntSets(this.active_ssid);
        } else {
            ent_sets = this.geom.snapshot.getSubEntsSets( this.active_ssid, ents);
        }
        this.geom.snapshot.addTopoToSubEntsSets(ent_sets);
        // merge the two sets of posis
        // if (ent_sets.obj_ps) {
        //     for (const posi_i of ent_sets.obj_ps) { ent_sets.ps.add(posi_i); }
        // }
        // return the data
        return {
            geometry: this.geom.imp_exp.exportGI(ent_sets),
            attributes: this.attribs.imp_exp.exportGI(ent_sets)
        };
    }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check.check();
    }
    /**
     * Compares this model and another model.
     * ~
     * This is the answer model.
     * The other model is the submitted model.
     * ~
     * Both models will be modified in the process.
     * ~
     * @param model The model to compare with.
     */
    public compare(model: GIModel, normalize: boolean, check_geom_equality: boolean, check_attrib_equality: boolean):
            {percent: number, score: number, total: number, comment: string} {
        return this.comparator.compare(model, normalize, check_geom_equality, check_attrib_equality);
    }
    /**
     * Update time stamp of an object (point, pline, pgon)
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    public getObjsUpdateTs(ent_type: EEntType, ent_i: number): void {
        const ts: number = this.active_ssid;
        switch (ent_type) {
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, ts);
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach( pgon_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPline(ent_i).forEach( pline_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach( point_i => {
                    this.attribs.set.setEntAttribVal(EEntType.POINT, point_i, EAttribNames.TIMESTAMP, ts);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i]: TEntTypeIdx = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsUpdateTs(ent2_type, ent2_i);
        }
    }
    /**
     * Check time stamp of an object (point, pline, pgon) is same as current time stamp
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    public getObjsCheckTs(ent_type: EEntType, ent_i: number): void {
        const ts: number = this.active_ssid;
        switch (ent_type) {
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                if (this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP) !== ts) {
                    // const obj_ts = this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP);
                    throw new Error(
                        'An object is being edited that was created in an upstream node. ' +
                        'Objects are immutable outside the node in which they are created. ' +
                        '<ul>' +
                        '<li>The object being edited is: "' + idMake(ent_type, ent_i) + '".</li>' +
                        '</ul>' +
                        'Possible fixes:' +
                        '<ul>' +
                        '<li>In this node, before editing, clone the object using the using the make.Clone() function.</li>' +
                        '</ul>'
                    );
                }
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach( pgon_i => {
                    this.getObjsCheckTs(EEntType.PGON, pgon_i);
                });
                this.geom.nav.navCollToPline(ent_i).forEach( pline_i => {
                    this.getObjsCheckTs(EEntType.PLINE, pline_i);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach( point_i => {
                    this.getObjsCheckTs(EEntType.POINT, point_i);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i]: TEntTypeIdx = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsCheckTs(ent2_type, ent2_i);
        }
    }
    /**
     * Update time stamp of a object, or collection
     * Topo ents will throw an error
     * @param point_i
     */
    public updateEntTs(ent_type: EEntType, ent_i: number): void {
        if (ent_type >= EEntType.POINT && ent_type <= EEntType.PGON) {
            this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, this.active_ssid);
        }
    }
    /**
     * Get the timestamp of a posi
     * @param posi_i
     */
    public getEntTs(ent_type: EEntType, ent_i: number): number {
        if (ent_type < EEntType.POINT || ent_type > EEntType.PGON) { throw new Error('Get time stamp: Entity type is not valid.'); }
        return this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP ) as number;
    }
    /**
     *
     */
    public nextSnapshot() {
        this._max_timestamp += 1;
        this.active_ssid = this._max_timestamp;
    }
    /**
     *
     */
    public toStr(ssid: number): string {
        return 'SSID = ' + ssid + '\n' +
            'GEOMETRY\n' + this.geom.snapshot.toStr(ssid) +
            'ATTRIBUTES\n' + this.attribs.snapshot.toStr(ssid);
    }
}
