import { IEntSets, TEntTypeIdx, TId } from './common';
import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
import { idsBreak } from './common_id_funcs';
import { IThreeJS } from './ThreejsJSON';

/**
 * Geo-info model class.
 */
export class GIModel {
    // [x: string]: any; // TODO: What is this???
    public metadata: GIMetaData;
    public modeldata: GIModelData;
    public debug = true;
    // public outputSnapshot: number;

    /**
     * Constructor
     */
    constructor(meta_data?: GIMetaData) {
        if (meta_data === undefined) {
            this.metadata = new GIMetaData();
        } else {
            this.metadata = meta_data;
        }
        this.modeldata = new GIModelData(this);
        this.nextSnapshot();
    }
    /**
     * Get the current time stamp
     */
    public getActiveSnapshot(): number {
        return this.modeldata.active_ssid;
    }
    /**
     * Set the current time stamp backwards to a prevous time stamp.
     * This allows you to roll back in time after executing a global function.
     */
    public setActiveSnapshot(ssid: number): void {
        this.modeldata.active_ssid = ssid;
    }
    /**
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include The other snapshots to include in the snapshot.
     */
    public nextSnapshot(include?: number[]): number {
        // increment time stamp
        this.modeldata.nextSnapshot();
        // get time stamp
        const ssid = this.modeldata.active_ssid;
        // add snapshot
        this.modeldata.geom.snapshot.addSnapshot(ssid, include);
        this.modeldata.attribs.snapshot.addSnapshot(ssid, include);
        // return the new ssid
        return ssid;
    }
    /**
     * Add a set of ents from the specified snapshot to the active snapshot.
     * @param from_ssid Snapshot to copy ents from
     * @param ents The list of ents to add.
     */
    public addEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]) {
        // geometry
        const ents_sets: IEntSets = this.modeldata.geom.snapshot.getSubEntsSets(from_ssid, ents);
        this.modeldata.geom.snapshot.copyEntsToActiveSnapshot(from_ssid,
            this.modeldata.geom.snapshot.getSubEnts(ents_sets));
        // attributes
        // TODO needs to be optimized, we should iterate over the sets directly - it will be faster
        this.modeldata.geom.snapshot.addTopoToSubEntsSets(ents_sets);
        this.modeldata.attribs.snapshot.copyEntsToActiveSnapshot(from_ssid,
            this.modeldata.geom.snapshot.getSubEnts(ents_sets));
    }
    /**
     * Gets a set of ents from a snapshot.
     * @param ssid
     */
    public getEntsFromSnapshot(ssid: number): TEntTypeIdx[] {
        return this.modeldata.geom.snapshot.getAllEnts(ssid);
    }
    /**
     * Deletes a snapshot.
     * @param ssid
     */
    public delSnapshots(ssids: number[]) {
        for (const ssid of ssids) {
            this.modeldata.geom.snapshot.delSnapshot(ssid);
            this.modeldata.attribs.snapshot.delSnapshot(ssid);
        }
    }
    /**
     * Updates the time stamp of the entities to the current time stamp.
     * @param ents
     */
    public updateEntsTimestamp(ents: TEntTypeIdx[]): void {
        for (const [ent_type, ent_i] of ents) {
            this.modeldata.updateEntTs(ent_type, ent_i);
        }
    }
    /**
     *
     * @param gf_start_ents
     */
    public prepGlobalFunc(gf_start_ids: TId|TId[]): number {
        gf_start_ids = Array.isArray(gf_start_ids) ? gf_start_ids : [gf_start_ids];
        // @ts-ignore
        gf_start_ids = gf_start_ids.flat();
        const gf_start_ents: TEntTypeIdx[] = idsBreak(gf_start_ids) as TEntTypeIdx[];
        const curr_ss: number = this.getActiveSnapshot();
        this.nextSnapshot();

        // console.log('>>> ents to be added to gf_start_ss:\n', gf_start_ents_tree);
        this.addEntsToActiveSnapshot(curr_ss, gf_start_ents);
        // console.log('>>> gf_start_ss ents after adding:\n', this.getEntsFromSnapshot(gf_start_ss));

        return curr_ss;
    }
    /**
     *
     * @param ssid
     */
    public postGlobalFunc(curr_ss: number): void {
        const gf_end_ss: number = this.getActiveSnapshot();
        const gf_end_ents: TEntTypeIdx[] = this.getEntsFromSnapshot(gf_end_ss);
        const gf_all_ss: number[] = [];
        for (let i = gf_end_ss; i > curr_ss; i--) {
            gf_all_ss.push(i);
        }
        this.setActiveSnapshot(curr_ss);

        // console.log('>>> ents to be added to curr_ss:\n', gf_end_ents);
        this.addEntsToActiveSnapshot(gf_end_ss, gf_end_ents);
        // console.log('>>> curr_ss ents after adding:\n', this.getEntsFromSnapshot(curr_ss));

        this.delSnapshots(gf_all_ss);
    }

    // /**
    //  * Set all data from a JSON string.
    //  * This includes both the meta data and the model data.
    //  * Any existing metadata will be kept, the new data gets appended.
    //  * Any existing model data wil be deleted.
    //  * @param meta
    //  */
    // public setJSONStr(ssid: number, json_str: string): void {
    //     // const ssid = this.modeldata.timestamp;
    //     const json_data: IModelJSON = JSON.parse(json_str);
    //     // merge the meta data
    //     this.metadata.mergeJSONData(json_data);
    //     // set the model data
    //     this.modeldata.importGI(ssid, json_data.model_data);
    // }
    // /**
    //  * Gets all data as a JSON string.
    //  * This includes both the meta data and the model data.
    //  */
    // public getJSONStr(ssid: number): string {
    //     // const ssid = this.modeldata.timestamp;
    //     const model_data: IModelJSONData = this.modeldata.exportGI(ssid);
    //     const meta_data: IMetaJSONData = this.metadata.getJSONData(model_data);

    //     const data: IModelJSON = {
    //         meta_data: meta_data,
    //         model_data: model_data
    //     };
    //     return JSON.stringify(data);
    // }
    // /**
    //  * Sets the data in this model from a JSON data object using shallow copy.
    //  * Any existing data in the model is deleted.
    //  * @param model_json_data The JSON data.
    //  */
    // public setModelData (ssid: number, model_json_data: IModelJSONData): void {
    //     // const ssid = this.modeldata.timestamp;
    //     this.modeldata.importGI(ssid, model_json_data);
    // }
    // /**
    //  * Returns the JSON data for this model using shallow copy.
    //  */
    // public getModelData(ssid: number): IModelJSONData {
    //     // const ssid = this.modeldata.timestamp;
    //     return this.modeldata.exportGI(ssid);
    // }
    /**
     * Import a GI model.
     * @param meta
     */
    public importGI(model_json_data_str: string): TEntTypeIdx[] {
        return this.modeldata.importGI(JSON.parse(model_json_data_str));
    }
    /**
     * Export a GI model.
     */
    public exportGI(ents: TEntTypeIdx[]): string {
        return JSON.stringify(this.modeldata.exportGI(ents));
    }
    /**
     * Set the meta data object.
     * Data is not copied.
     * @param meta
     */
    public setMetaData(meta: GIMetaData) {
        this.metadata = meta;
    }
    /**
     * Get the meta data object.
     * Data is not copied
     */
    public getMetaData(): GIMetaData {
        return this.metadata;
    }
    // /**
    //  * Returns a deep clone of this model.
    //  * Any deleted entities will remain.
    //  * Entity IDs will not change.
    //  */
    // public clone(): GIModel {
    //     const ssid = this.modeldata.timestamp;
    //     // console.log("CLONE");
    //     const clone: GIModel = new GIModel();
    //     clone.metadata = this.metadata;
    //     clone.modeldata = this.modeldata.clone(ssid);
    //     // clone.modeldata.merge(this.modeldata);
    //     return clone;
    // }
    // /**
    //  * Deep copies the model data from a second model into this model.
    //  * Meta data is assumed to be the same for both models.
    //  * The existing model data in this model is not deleted.
    //  * Entity IDs will not change.
    //  * @param model_data The GI model.
    //  */
    // public merge(model: GIModel): void {
    //     const ssid = this.modeldata.timestamp;
    //     // console.log("MERGE");
    //     this.modeldata.merge(ssid, model.modeldata);
    // }
    // /**
    //  * Deep copies the model data from a second model into this model.
    //  * Meta data is assumed to be the same for both models.
    //  * The existing model data in this model is not deleted.
    //  * The Entity IDs in this model will not change.
    //  * The Entity IDs in the second model will change.
    //  * @param model_data The GI model.
    //  */
    // public append(ssid: number, ssid2: number, model: GIModel): void {
    //     // const ssid = this.modeldata.timestamp;
    //     this.modeldata.append(ssid, ssid2, model.modeldata);
    // }
    // /**
    //  * Renumber entities in this model.
    //  */
    // public purge(): void {
    //     const ssid = this.modeldata.timestamp;
    //     this.modeldata = this.modeldata.purge(ssid);
    // }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.modeldata.check();
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
        return this.modeldata.compare(model, normalize, check_geom_equality, check_attrib_equality);
    }
    /**
     * Get the threejs data for this model.
     */
    public get3jsData(ssid: number): IThreeJS {
        return this.modeldata.threejs.get3jsData(ssid);
    }
}
