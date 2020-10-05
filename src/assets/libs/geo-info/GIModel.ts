import { IModelJSONData, IEntSets, IModelJSON, IMetaJSONData, EEntType } from './common';
import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
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
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include The other snapshots to include in the snapshot.
     */
    public nextSnapshot(include?: number[]): number {
        // increment time stamp
        this.modeldata.time_stamp += 1;
        // get time stamp
        const ssid = this.modeldata.time_stamp;
        // geometry
        this.modeldata.geom.snapshot.init(ssid, include);
        // attribs
        this.modeldata.attribs.snapshot.init(ssid, include);
        // return the new ssid
        return ssid;
    }
    /**
     * Set all data from a JSON string.
     * This includes both the meta data and the model data.
     * Any existing metadata will be kept, the new data gets appended.
     * Any existing model data wil be deleted.
     * @param meta
     */
    public setJSONStr(ssid: number, json_str: string): void {
        // const ssid = this.modeldata.time_stamp;
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
        // const ssid = this.modeldata.time_stamp;
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
        // const ssid = this.modeldata.time_stamp;
        this.modeldata.setJSONData(ssid, model_json_data);
    }
    /**
     * Returns the JSON data for this model using shallow copy.
     */
    public getModelData(ssid: number): IModelJSONData {
        // const ssid = this.modeldata.time_stamp;
        return this.modeldata.getJSONData(ssid);
    }
    /**
     * Set the model data (geom and attribs) str.
     * @param meta
     */
    public setModelDataJSONStr(ssid: number, model_json_data_str: string): void {
        // const ssid = this.modeldata.time_stamp;
        this.modeldata.setJSONData(ssid, JSON.parse(model_json_data_str));
    }
    /**
     * Get the model data (geom and attribs) str.
     */
    public getModelDataJSONStr(ssid: number): string {
        // const ssid = this.modeldata.time_stamp;
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
    //     const ssid = this.modeldata.time_stamp;
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
    //     const ssid = this.modeldata.time_stamp;
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
        // const ssid = this.modeldata.time_stamp;
        this.modeldata.append(ssid, ssid2, model.modeldata);
    }
    // /**
    //  * Renumber entities in this model.
    //  */
    // public purge(): void {
    //     const ssid = this.modeldata.time_stamp;
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
