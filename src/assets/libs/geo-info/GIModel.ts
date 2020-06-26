import { IModelData, IGeomPack, EEntType, Txyz, TEntAttribValuesArr, TAttribDataTypes, TEntity, TEntTypeIdx, IGeomSets } from './common';
import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
import { IThreeJS } from './ThreejsJSON';

/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any; // TODO: What is this???
    public metadata: GIMetaData;
    public modeldata: GIModelData;
    public debug = true;
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor() {
        this.metadata = new GIMetaData();
        this.modeldata = new GIModelData(this);
    }
    /**
     * Sets the data in this model from JSON data.
     * Any existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public setModelData (model_data: IModelData): IGeomPack {
        return this.modeldata.setData(model_data);
    }
    /**
     * Returns the JSON data for this model.
     * This will include any deleted entities, which will be undefined.
     */
    public getModelData(): IModelData {
        return this.modeldata.getData();
    }
    /**
     * Set the meta data object
     * @param meta
     */
    public setMetaData(meta: GIMetaData) {
        this.metadata = meta;
    }
    /**
     * Get the meta data object.
     */
    public getMetaData(): GIMetaData {
        return this.metadata;
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are also merged.
     * @param model_data The GI model.
     */
    public merge(model: GIModel): void {
        this.modeldata.merge(model.modeldata);
    }
    /**
     * Returns a clone of this model.
     * Any deleted entities will remain.
     * Entity IDs will not change.
     */
    public clone(): GIModel {
        const clone: GIModel = new GIModel();
        clone.metadata = this.metadata;
        clone.modeldata = this.modeldata.clone();
        // clone.modeldata.merge(this.modeldata);
        return clone;
    }
    /**
     * Reomove deleted entities will be removed.
     */
    public purge(): void {
        const model_copy: GIModel = new GIModel();
        model_copy.metadata = this.metadata;
        model_copy.modeldata = this.modeldata.purge();
    }
    /**
     * Delete ents in teh model.
     */
    public delete(ent_sets: IGeomSets, invert: boolean): void {
        if (ent_sets === null) {
            if (!invert) {
                this.modeldata = new GIModelData(this);
                // TODO save model attribs
            }
        } else if (invert) {
            const modeldata2 = new GIModelData(this);
            modeldata2.dumpSelect(this.modeldata, ent_sets);
            this.modeldata = modeldata2;
        } else {
            this.modeldata.geom.del.del(ent_sets);
        }
    }
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
    public get3jsData(): IThreeJS {
        return this.modeldata.threejs.get3jsData();
    }
}
