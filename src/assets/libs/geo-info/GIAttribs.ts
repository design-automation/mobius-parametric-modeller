import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from './GIModel';
import { EEntType, EAttribNames,  IAttribsJSONData, EAttribDataTypeStrs, IAttribsMaps, TAttribMap } from './common';
import { GIAttribsIO } from './GIAttribsIO';
import { GIAttribsModify } from './GIAttribModify';
import { GIModelData } from './GIModelData';

function hashCode(s: string) {
    let h: number;
    for (let i = 0; i < s.length; i++) {
          // tslint:disable-next-line:no-bitwise
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h;
}
const eny_type_array: EEntType[] = [
    EEntType.POSI,
    EEntType.VERT,
    EEntType.EDGE,
    EEntType.WIRE,
    EEntType.FACE,
    EEntType.POINT,
    EEntType.PLINE,
    EEntType.PGON,
    EEntType.COLL,
    EEntType.MOD
];
const ent_type_strs: Map<EEntType, string> = new Map([
    [EEntType.POSI, 'positions'],
    [EEntType.VERT, 'vertices'],
    [EEntType.EDGE, 'edges'],
    [EEntType.WIRE, 'wires'],
    [EEntType.FACE, 'faces'],
    [EEntType.POINT, 'points'],
    [EEntType.PLINE, 'polylines'],
    [EEntType.PGON, 'polygons'],
    [EEntType.COLL, 'collections'],
    [EEntType.MOD, 'model']
]);
/**
 * Class for attributes.
 */
export class GIAttribs {
    private _modeldata: GIModelData;
    // maps, the key is the name, the value is the attrib map clas
    public _attribs_maps: IAttribsMaps = { // TODO this should not be public
        ps: new Map(),
        _v: new Map(),
        _e: new Map(),
        _w: new Map(),
        _f: new Map(),
        pt: new Map(),
        pl: new Map(),
        pg: new Map(),
        co: new Map(),
        mo: new Map()
    };
    // sub classes with methods
    public io: GIAttribsIO;
    public add: GIAttribsAdd;
    public modify: GIAttribsModify;
    public query: GIAttribsQuery;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this._modeldata = modeldata;
        this.io = new GIAttribsIO(modeldata, this._attribs_maps);
        this.add = new GIAttribsAdd(modeldata, this._attribs_maps);
        this.modify = new GIAttribsModify(modeldata, this._attribs_maps);
        this.query = new GIAttribsQuery(modeldata, this._attribs_maps);
        this.threejs = new GIAttribsThreejs(modeldata, this._attribs_maps);
        // create xyz on posis
        this.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.LIST);
    }
    /**
     * Compares this model and another model.
     * ~
     * If check_equality=false, the max total score will be equal to the number of attributes in this model.
     * It checks that each attribute in this model exists in the other model. If it exists, 1 mark is assigned.
     * ~
     * If check_equality=true, the max score will be increased by 10, equal to the number of entity levels.
     * For each entity level, if the other model contains no additional attributes, then one mark is assigned.
     * ~
     * @param other_model The model to compare with.
     */
    compare(other_model: GIModel, result: {score: number, total: number, comment: any[]}): void {
        result.comment.push('Comparing attribute names and types.');
        // compare all attributes except model attributes
        // check that this model is a subset of other model
        // all the attributes in this model must also be in other model
        const attrib_comments: string[] = [];
        let matches = true;
        const attrib_names: Map<EEntType, string[]> = new Map();
        for (const ent_type of eny_type_array) {
            // get the attrib names
            const ent_type_str: string = ent_type_strs.get(ent_type);
            const this_attrib_names: string[] = this._modeldata.attribs.query.getAttribNames(ent_type);
            const other_attrib_names: string[] = other_model.modeldata.attribs.query.getAttribNames(ent_type);
            attrib_names.set(ent_type, this_attrib_names);
            // check that each attribute in this model exists in the other model
            for (const this_attrib_name of this_attrib_names) {
                // check is this is built in
                let is_built_in = false;
                if (this_attrib_name === 'xyz' || this_attrib_name === 'rgb' || this_attrib_name.startsWith('_')) {
                    is_built_in = true;
                }
                // update the total
                if (!is_built_in) { result.total += 1; }
                // compare names
                if (other_attrib_names.indexOf(this_attrib_name) === -1 ) {
                    matches = false;
                    attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute is missing.');
                } else {
                    // get the data types
                    const data_type_1: EAttribDataTypeStrs =
                        this._modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    const data_type_2: EAttribDataTypeStrs =
                        other_model.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    // compare data types
                    if (data_type_1 !== data_type_2) {
                        matches = false;
                        attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute datatype is wrong. '
                            + 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".');
                    } else {
                        // update the score
                        if (!is_built_in) { result.score += 1; }
                    }
                }
            }
            // check if we have exact equality in attributes
            // total marks is not updated, we deduct marks
            // check that the other model does not have additional attribs
            if (other_attrib_names.length > this_attrib_names.length) {
                const additional_attribs: string[] = [];
                for (const other_attrib_name of other_attrib_names) {
                    if (this_attrib_names.indexOf(other_attrib_name) === -1) {
                        additional_attribs.push(other_attrib_name);
                    }
                }
                attrib_comments.push('There are additional ' + ent_type_str + ' attributes. ' +
                    'The following attributes are not required: [' + additional_attribs.join(',') + ']. ');
                // update the score, deduct 1 mark
                result.score -= 1;
            } else if (other_attrib_names.length < this_attrib_names.length) {
                attrib_comments.push('Mismatch: Model has too few entities of type: ' + ent_type_strs.get(ent_type) + '.');
            } else {
                // correct
            }
        }
        if (attrib_comments.length === 0) {
            attrib_comments.push('Attributes all match, both name and data type.');
        }
        // add to result
        result.comment.push(attrib_comments);
    }
    /**
     * Generate a string for debugging
     */
    public toStr(): string {
        let result = '';
        for (const ent_type of eny_type_array) {
            const ent_type_str: string = ent_type_strs.get(ent_type);
            result += ent_type_str + ': ';
            if (ent_type === EEntType.MOD) {
                // TODO
            } else {
                const attrib_names: string[] = this.query.getAttribNames(ent_type);
                for (const attrib_name of attrib_names) {
                    result += JSON.stringify(this.query.getAttrib(ent_type, attrib_name).getJSONData());
                    result += '\n';
                }
            }
        }
        return result;
    }
}
