import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelData, IGeomPack } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModelThreejs } from './GIModelThreejs';
import { GIMetaData } from './GIMetaData';
import { GIModel } from './GIModel';

/**
 * Geo-info model class.
 */
export class GIModelData {
    public model: GIModel;
    public geom: GIGeom;
    public attribs: GIAttribs;
    public comparator: GIModelComparator;
    public threejs: GIModelThreejs;
    public debug = true;
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
        // if (model_data) {
        //     this.setData(model_data);
        // }
    }
    /**
     * Sets the data in this model from JSON data.
     * Any existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public setData (model_data: IModelData): IGeomPack {
        // console.log("SET DATA");
        this.attribs.io.setData(model_data.attributes); // warning: must be before this.geom.io.setData()
        const new_ents_i: IGeomPack = this.geom.io.setData(model_data.geometry);
        return new_ents_i;
    }
    /**
     * Returns the JSON data for this model.
     * This will include any deleted entities, which will be undefined.
     */
    public getData(): IModelData {
        // console.log("GET DATA");
        return {
            geometry: this.geom.io.getData(),
            attributes: this.attribs.io.getData()
        };
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are also merged.
     * @param model_data The GI model.
     */
    public merge(modeldata: GIModelData): void {
        // const geom_maps: Map<number, number>[] = this.geom.io.merge(model.modeldata.geom._geom_maps);
        // this.attribs.io.merge(model.modeldata.attribs._attribs_maps, geom_maps);
        this.geom.io.merge(modeldata.geom._geom_maps);
        this.attribs.io.merge(modeldata.attribs._attribs_maps);
        this.model.metadata = modeldata.model.metadata;
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are also merged.
     * @param model_data The GI model.
     */
    public mergeSelected(modeldata: GIModelData, gp: IGeomPack): void {
        // const geom_maps: Map<number, number>[] = this.geom.io.merge(model.modeldata.geom._geom_maps);
        // this.attribs.io.merge(model.modeldata.attribs._attribs_maps, geom_maps);
        this.geom.io.dumpSelect(modeldata.geom._geom_maps, gp);
        this.attribs.io.dumpSelect(modeldata.attribs._attribs_maps, gp);
        this.model.metadata = modeldata.model.metadata;
    }
    /**
     * Returns a clone of this model.
     * Any deleted entities will remain.
     * Entity IDs will not change.
     */
    public clone(): GIModelData {
        const clone: GIModelData = new GIModelData(this.model);
        clone.geom.io.dump(this.geom._geom_maps);
        clone.attribs.io.dump(this.attribs._attribs_maps);
        this.model.metadata = this.model.metadata;
        // clone.dump(this);
        return clone;
    }
    /**
     * Reomove deleted entities will be removed.
     */
    public purge(): GIModelData {
        const clone: GIModelData = new GIModelData(this.model);
        clone.mergeAndPurge(this);
        return clone;
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are filtered out (i.e. not merged).
     * @param model_data The GI model.
     */
    public mergeAndPurge(modeldata: GIModelData): void {
        const geom_maps: Map<number, number>[] = this.geom.io.mergeAndPurge(modeldata.geom._geom_maps);
        this.attribs.io.mergeAndPurge(modeldata.attribs._attribs_maps, geom_maps);
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
}
