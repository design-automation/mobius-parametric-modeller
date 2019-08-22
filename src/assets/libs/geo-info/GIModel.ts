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
        const result_array: {matches: boolean, comment: any} = {matches: true, comment: []};
        this.geom.compare(model, result_array);
        this.attribs.compare(model, result_array);
        // temporary solution for comparing models
        const this_model: IModelData = this.getData();
        this_model.geometry.selected = [];
        const other_model: IModelData = model.getData();
        other_model.geometry.selected = [];
        const this_model_str: string = JSON.stringify(this_model);
        const other_model_str: string = JSON.stringify(other_model);
        result_array.comment.push('Comparing model data.');
        if (this_model_str !== other_model_str) {
            result_array.matches = false;
            result_array.comment.push(['Differences were found in the data.']);
        } else {
            result_array.comment.push(['Everything matches.']);
        }
        // Add a final msg
        if (result_array.matches) {
            result_array.comment = ['RESULT: The two models match.'];
        } else {
            result_array.comment.push('RESULT: The two models no not match.');
        }
        // html formatting
        let formatted_str = '<ul>';
        for (const comment of result_array.comment) {
            if (Array.isArray(comment)) {
                formatted_str += '<ul>';
                    for (const sub_comment of comment) {
                        formatted_str += '<li>' + sub_comment + '</li>';
                    }
                formatted_str += '</ul>';
            } else {
                formatted_str += '<li>' + comment + '</li>';
            }
        }
        formatted_str += '</ul>';
        // return the result
        return {matches: result_array.matches, comment: formatted_str};
    }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check();
    }
}
