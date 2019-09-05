import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from './GIModel';
import { EEntType, EAttribNames,  IAttribsData, EAttribDataTypeStrs, IAttribsMaps } from './common';
import { GIAttribsIO } from './GIAttribsIO';
import { GIAttribsModify } from './GIAttribModify';

function hashCode(s: string) {
    let h: number;
    for (let i = 0; i < s.length; i++) {
          // tslint:disable-next-line:no-bitwise
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h;
}

/**
 * Class for attributes.
 */
export class GIAttribs {
    private _model: GIModel;
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
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this._model = model;
        this.io = new GIAttribsIO(model, this._attribs_maps);
        this.add = new GIAttribsAdd(model, this._attribs_maps);
        this.modify = new GIAttribsModify(model, this._attribs_maps);
        this.query = new GIAttribsQuery(model, this._attribs_maps);
        this.threejs = new GIAttribsThreejs(model, this._attribs_maps);
        this.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.LIST);
    }
    /**
     * Compares this model and another model.
     * ~
     * This model should be a subset of the other model.
     * ~
     * @param other_model The model to compare with.
     */
    compare(other_model: GIModel, check_equality: boolean,
            result: {score: number, total: number, comment: any[]}): Map<EEntType, string[]> {
        result.comment.push('Comparing attribute names and types.');
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
        const ent_type_strs: string[] = [
            'positions',
            'triangles',
            'vertices',
            'edges',
            'wires',
            'faces',
            'points',
            'polylines',
            'polygons',
            'collections',
            'model'
        ];
        // compare all attributes except model attributes
        // check that this model is a subset of other model
        // all the attributes in this model must also be in other model
        const attrib_comments: string[] = [];
        let matches = true;
        const attrib_names: Map<EEntType, string[]> = new Map();
        for (const ent_type of eny_type_array) {
            // get the attrib names
            const ent_type_str: string = ent_type_strs[ent_type];
            const this_attrib_names: string[] = this._model.attribs.query.getAttribNamesUser(ent_type);
            const other_attrib_names: string[] = other_model.attribs.query.getAttribNamesUser(ent_type);
            attrib_names.set(ent_type, this_attrib_names);
            // check that each attribute in this model exists in the other model
            for (const name1 of this_attrib_names) {
                // update the total
                result.total += 1;
                // compare names
                if (other_attrib_names.indexOf(name1) === -1 ) {
                    matches = false;
                    attrib_comments.push('The "' + name1 + '" ' + ent_type_str + ' attribute is missing.');
                } else {
                    // get the data types
                    const data_type_1: EAttribDataTypeStrs = this._model.attribs.query.getAttribDataType(ent_type, name1);
                    const data_type_2: EAttribDataTypeStrs = other_model.attribs.query.getAttribDataType(ent_type, name1);
                    // compare data types
                    if (data_type_1 !== data_type_2) {
                        matches = false;
                        attrib_comments.push('The "' + name1 + '" ' + ent_type_str + ' attribute datatype is wrong. '
                            + 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".');
                    } else {
                        // update the score
                        result.score += 1;
                    }
                }
            }
            // check if we have exact equality in attributes
            if (check_equality) {
                // update the score
                result.total += 1;
                // check that the other model does not have additional attribs
                if (other_attrib_names.length > this_attrib_names.length) {
                    const additional_attribs: string[] = [];
                    for (const other_attrib_name of other_attrib_names) {
                        if (this_attrib_names.indexOf(other_attrib_name) === -1) {
                            additional_attribs.push(other_attrib_name);
                        }
                    }
                    attrib_comments.push('There are additional ' + ent_type_str + ' attributes. ' +
                        'The following attributes are not required: [' + additional_attribs.join(',') + '].');
                } else {
                    // update the score
                    result.score += 1;
                }
            }
        }
        if (attrib_comments.length === 0) {
            attrib_comments.push('Attributes all match, both name and data type.');
        }
        // add to result
        result.comment.push(attrib_comments);
        // return the attrib names in this model
        return attrib_names;
    }
}
