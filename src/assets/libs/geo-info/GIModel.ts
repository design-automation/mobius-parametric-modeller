import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelData, IGeomPack, EEntType } from './common';
import { GIModelThreejs } from './GIModelThreejs';
/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any; // TODO: What is this???
    public geom: GIGeom;
    public attribs: GIAttribs;
    public threejs: GIModelThreejs;
    /**
     * Creates a model.
     * @param model_data The JSON data
     */
    constructor(model_data?: IModelData) {
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.threejs = new GIModelThreejs(this);
        if (model_data) {
            this.setData(model_data);
        }
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * @param model_data The GI model.
     */
    public merge(model: GIModel): void {
        this.attribs.io.merge(model.attribs._attribs_maps); // warning: must be before this.geom.io.merge()
        this.geom.io.merge(model.geom._geom_arrays);
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
     */
    public getData(): IModelData {
        return {
            geometry: this.geom.io.getData(),
            attributes: this.attribs.io.getData()
        };
    }
    /**
     * Compares this model and another model.
     * @param model The model to compare with.
     */
    public compare(model: GIModel): {matches: boolean, comment: string} {
        const result: {matches: boolean, comment: string} = {matches: true, comment: ''};
        this.geom.compare(model, result);
        this.attribs.compare(model, result);
        if (result.matches) {
            result.comment = 'Models match.';
        } else {
            result.comment = 'Models do not match.\n' + result.comment;
        }
        return result;
    }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check();
    }
}
