import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelData, IGeomPack, EEntType, Txyz, TEntAttribValuesArr, TAttribDataTypes, TEntity, TEntTypeIdx } from './common';
import { GIModelThreejs } from './GIModelThreejs';
import { type } from 'os';
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
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check();
    }
    /**
     * Compares this model and another model.
     * 
     * Polygons must have the vertices in the same order, and starting at the same position.
     * 
     * TODO: implement model attributes, need to compare values
     * TODO: implement collections, need to oompare attributes, parent id, and object ids
     * 
     * @param model The model to compare with.
     */
    public compare(model: GIModel): {matches: boolean, comment: string} {
        const result_array: {matches: boolean, comment: any} = {matches: true, comment: []};
        this.geom.compare(model, result_array);
        this.attribs.compare(model, result_array);
        const obj_ent_types: EEntType[] = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        // this model
        const this_fingerprints: string[] = [];
        for (const obj_ent_type of obj_ent_types) {
            this_fingerprints.push( this.getEntsFingerprint(obj_ent_type) );
        }
        const this_model_str: string = this_fingerprints.join('|');
        // console.log(this_model_str);
        // other model
        const other_fingerprints: string[] = [];
        for (const obj_ent_type of obj_ent_types) {
            other_fingerprints.push( model.getEntsFingerprint(obj_ent_type) );
        }
        const other_model_str: string = other_fingerprints.join('|');
        // console.log(other_model_str);
        // compare the two models
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
    // ============================================================================
    // Private methods for fingerprinting
    // ============================================================================
    /**
     * Get a fingerprint of all geometric entities of a certain type in the model
     */
    private getEntsFingerprint(ent_type: EEntType): string {
        const fingerprints: string[]  = [];
        const ents_i: number[] = this.geom.query.getEnts(ent_type, false);
        for (const ent_i of ents_i) {
            fingerprints.push(this.getEntFingerprint(ent_type, ent_i));
        }
        if (fingerprints.length === 0) { return '~'; }
        fingerprints.sort();
        return fingerprints.join('$');
    }
    /**
     * Get a fingerprint of a geometric entity
     */
    private getEntFingerprint(from_ent_type: EEntType, index: number): string {
        const fingerprints = [];
        const ent_types: EEntType[] = [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE,
            EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        for (const to_ent_type of ent_types) {
            const sub_fingerprints: string[] = [];
            if (to_ent_type <= from_ent_type) {
                const attrib_names: string[] = this.attribs.query.getAttribNames(to_ent_type);
                attrib_names.sort();
                // Wires represent holes in polygons
                // they can be in any order, so we have to sort them
                // a polygons fingerprint is a sorted set of wire fingerprints
                if (from_ent_type !== EEntType.PGON || to_ent_type > EEntType.WIRE) {
                    const sub_ents_i: number[] = this.geom.query.navAnyToAny(from_ent_type, to_ent_type, index);
                    for (const attrib_name of attrib_names) {
                        for (const sub_ent_i of sub_ents_i) {
                            const attrib_value: TAttribDataTypes = this.attribs.query.getAttribValue(to_ent_type, attrib_name, sub_ent_i);
                            sub_fingerprints.push(this.getAttribValFingerprint(attrib_value));
                        }
                    }
                } else {
                    const wires_i: number[] = this.geom.query.navAnyToWire(EEntType.PGON, index);
                    const wire_fingerprints: string[] = [];
                    for (const wire_i of wires_i) {
                        const sub_ents_i: number[] = this.geom.query.navAnyToAny(EEntType.WIRE, to_ent_type, wire_i);
                        for (const attrib_name of attrib_names) {
                            for (const sub_ent_i of sub_ents_i) {
                                const attrib_value: TAttribDataTypes = this.attribs.query.getAttribValue(
                                        to_ent_type, attrib_name, sub_ent_i);
                                wire_fingerprints.push(this.getAttribValFingerprint(attrib_value));
                            }
                        }
                    }
                    wire_fingerprints.sort();
                    for (const wire_fingerprint of wire_fingerprints) {
                        sub_fingerprints.push(wire_fingerprint);
                    }
                }
            }
            if (to_ent_type === EEntType.WIRE) {
                sub_fingerprints.sort();
            }
            fingerprints.push(sub_fingerprints.join('@'));
        }
        return fingerprints.join('#');
    }
    /**
     * Get a fingerprint of an attribute value
     */
    private getAttribValFingerprint(value: any): string {
        const precision = 1e4;
        if (value === null) { return '.'; }
        if (value === undefined) { return '.'; }
        if (typeof value === 'string') { return value; }
        if (typeof value === 'boolean') { return String(value); }
        if (typeof value === 'number') { return String(Math.round(value * precision) / precision); }
        if (Array.isArray(value)) {
            const fingerprints = [];
            for (const item of value) {
                fingerprints.push(this.getAttribValFingerprint(item));
            }
            return fingerprints.join(',');
        }
        if (typeof value === 'object') {
            let fingerprint = '';
            const prop_names: string[] = Object.getOwnPropertyNames(value);
            prop_names.sort();
            for (const prop_name of prop_names) {
                fingerprint += prop_name + '=' + this.getAttribValFingerprint(value[prop_name]);
            }
            return fingerprint;
        }
        throw new Error('Attribute value not recognised.');
    }
}
