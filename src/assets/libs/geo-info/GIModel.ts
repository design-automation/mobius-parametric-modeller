import { IModelJSONData, IModelJSON, IMetaJSONData, TEntTypeIdx, TId } from './common';
import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
import { idsBreak } from './id';
import { IThreeJS } from './ThreejsJSON';

/**
 * Geo-info model class.
 */
export class GIModel {
    // [x: string]: any; // TODO: What is this???
    public metadata: GIMetaData;
    public modeldata: GIModelData;
    public debug = true;
    public outputSnapshot: number;

    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(meta_data?: GIMetaData) {
        if (meta_data === undefined) {
            this.metadata = new GIMetaData();
        } else {
            this.metadata = meta_data;
        }
        this.modeldata = new GIModelData(this);
    }
    /**
     * Get the current time stamp
     */
    public getActiveSnapshot(): number {
        return this.modeldata.timestamp;
    }
    /**
     * Set the current time stamp backwards to a prevous time stamp.
     * This allows you to roll back in time after executing a global function.
     */
    public setActiveSnapshot(ssid: number): void {
        this.modeldata.timestamp = ssid;
    }
    /**
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include The other snapshots to include in the snapshot.
     */
    public nextSnapshot(include?: number[]): number {
        // increment time stamp
        this.modeldata.nextTimestamp();
        // get time stamp
        const ssid = this.modeldata.timestamp;
        // add snapshot
        this.modeldata.geom.snapshot.addSnapshot(ssid, include);
        this.modeldata.attribs.snapshot.addSnapshot(ssid, include);
        // return the new ssid
        console.log(">>> calling nextSnapshot, active ssid = ", ssid)
        return ssid;
    }
    /**
     * Add a set of ents from the specified snapshot to the active snapshot.
     * @param ssid Snapshot to copy ents from
     * @param ents The list of ents to add.
     */
    public addEntsToActiveSnapshot(ssid: number, ents: TEntTypeIdx[]) {
        const ents2: TEntTypeIdx[] = this.modeldata.geom.query.getEntsTree( ents );
        this.modeldata.geom.snapshot.addEntsToActiveSnapshot(ents2);
        this.modeldata.attribs.snapshot.addEntsToActiveSnapshot(ssid, ents2);
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

    /**
     * Set all data from a JSON string.
     * This includes both the meta data and the model data.
     * Any existing metadata will be kept, the new data gets appended.
     * Any existing model data wil be deleted.
     * @param meta
     */
    public setJSONStr(ssid: number, json_str: string): void {
        // const ssid = this.modeldata.timestamp;
        const json_data: IModelJSON = JSON.parse(json_str);
        // merge the meta data
        this.metadata.mergeJSONData(json_data);
        // set the model data
        this.modeldata.setJSONData(ssid, json_data.model_data);
    }
    /**
     * Gets all data as a JSON string.
     * This includes both the meta data and the model data.
     */
    public getJSONStr(ssid: number): string {
        // const ssid = this.modeldata.timestamp;
        const model_data: IModelJSONData = this.modeldata.getJSONData(ssid);
        const meta_data: IMetaJSONData = this.metadata.getJSONData(model_data);

        const data: IModelJSON = {
            meta_data: meta_data,
            model_data: model_data
        };
        return JSON.stringify(data);
    }
    /**
     * Sets the data in this model from a JSON data object using shallow copy.
     * Any existing data in the model is deleted.
     * @param model_json_data The JSON data.
     */
    public setModelData (ssid: number, model_json_data: IModelJSONData): void {
        // const ssid = this.modeldata.timestamp;
        this.modeldata.setJSONData(ssid, model_json_data);
    }
    /**
     * Returns the JSON data for this model using shallow copy.
     */
    public getModelData(ssid: number): IModelJSONData {
        // const ssid = this.modeldata.timestamp;
        return this.modeldata.getJSONData(ssid);
    }
    /**
     * Set the model data (geom and attribs) str.
     * @param meta
     */
    public setModelDataJSONStr(ssid: number, model_json_data_str: string): void {
        // const ssid = this.modeldata.timestamp;
        this.modeldata.setJSONData(ssid, JSON.parse(model_json_data_str));
    }
    /**
     * Get the model data (geom and attribs) str.
     */
    public getModelDataJSONStr(ssid: number): string {
        // const ssid = this.modeldata.timestamp;
        return JSON.stringify(this.modeldata.getJSONData(ssid));
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
    /**
     * Deep copies the model data from a second model into this model.
     * Meta data is assumed to be the same for both models.
     * The existing model data in this model is not deleted.
     * The Entity IDs in this model will not change.
     * The Entity IDs in the second model will change.
     * @param model_data The GI model.
     */
    public append(ssid: number, ssid2: number, model: GIModel): void {
        // const ssid = this.modeldata.timestamp;
        this.modeldata.append(ssid, ssid2, model.modeldata);
    }
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
