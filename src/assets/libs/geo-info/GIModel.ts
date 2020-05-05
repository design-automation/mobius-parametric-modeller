import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelData, IGeomPack, EEntType, Txyz, TEntAttribValuesArr, TAttribDataTypes, TEntity, TEntTypeIdx } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModelThreejs } from './GIModelThreejs';

/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any; // TODO: What is this???
    public geom: GIGeom;
    public attribs: GIAttribs;
    public comparator: GIModelComparator;
    public threejs: GIModelThreejs;
    public debug = true;
    /**
     * Constructor
     */
    constructor(model_data?: IModelData) {
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.comparator = new GIModelComparator(this);
        this.threejs = new GIModelThreejs(this);
        if (model_data) {
            this.setData(model_data);
        }
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are also merged.
     * @param model_data The GI model.
     */
    public merge(model: GIModel): void {
        const geom_maps: Map<number, number>[] = this.geom.io.merge(model.geom._geom_arrays);
        this.attribs.io.merge(model.attribs._attribs_maps, geom_maps);
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are filtered out (i.e. not merged).
     * @param model_data The GI model.
     */
    public mergeAndPurge(model: GIModel): void {
        const geom_maps: Map<number, number>[] = this.geom.io.mergeAndPurge(model.geom._geom_arrays);
        this.attribs.io.merge(model.attribs._attribs_maps, geom_maps);
    }
    /**
     * Sets the data in this model from JSON data.
     * Any existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public setData (model_data: IModelData): IGeomPack {
        this.attribs.io.setData(model_data.attributes); // warning: must be before this.geom.io.setData()
        const new_ents_i: IGeomPack = this.geom.io.setData(model_data.geometry);
        return new_ents_i;
    }
    /**
     * Returns the JSON data for this model.
     * This will include any deleted entities, which will be null.
     */
    public getData(make_copy = false): IModelData {
        return {
            geometry: this.geom.io.getData(make_copy),
            attributes: this.attribs.io.getData(make_copy)
        };
    }
    /**
     * Returns a copy of this model.
     * Any deleted entities will be removed.
     * Warning: entity IDs will change.
     * If you need an clone, then use clone().
     */
    public copy(): GIModel {
        const model_copy: GIModel = new GIModel();
        model_copy.mergeAndPurge(this);
        return model_copy;
    }
    /**
     * Returns a clone of this model.
     * Any deleted entities will remain.
     * Entity IDs will not change.
     */
    public clone(): GIModel {
        const model_clone: GIModel = new GIModel();
        model_clone.setData(this.getData(true)); // get data makes deep copy
        return model_clone;
    }
    /**
     * Reomove deleted entities will be removed.
     */
    public purge(): void {
        const model_copy: GIModel = new GIModel();
        model_copy.mergeAndPurge(this);
        this.setData(model_copy.getData());
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
