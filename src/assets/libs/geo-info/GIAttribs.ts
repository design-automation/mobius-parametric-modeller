import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from './GIModel';
import { EEntType, EAttribNames,  IAttribsData, EAttribDataTypeStrs, IAttribsMaps } from './common';
import { GIAttribsIO } from './GIAttribsIO';

function hashCode(s: string) {
    let h: number;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;
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
        this.query = new GIAttribsQuery(model, this._attribs_maps);
        this.threejs = new GIAttribsThreejs(model, this._attribs_maps);
        this.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    }
    /**
     * Compares this model and another model.
     * @param model The model to compare with.
     */
    compare(model: GIModel, result: {matches: boolean, comment: string}): void {
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
        for (const ent_type of eny_type_array) {
            const ent_type_str: string = ent_type_strs[ent_type];
            const attrib_names_1: string[] = this._model.attribs.query.getAttribNames(ent_type);
            const attrib_names_2: string[] = model.attribs.query.getAttribNames(ent_type);
            if (attrib_names_1.length !== attrib_names_2.length) {
                result.matches = false;
                result.comment += 'The number of ' + ent_type_str + ' attributes do not match.\n';
                for (const name2 of attrib_names_2) {
                    if (attrib_names_1.indexOf(name2) === -1 ) {
                        result.matches = false;
                        result.comment += 'There is an additional "' + name2 + '" ' + ent_type_str + ' attribute.\n';
                    }
                }
            }
            for (const name1 of attrib_names_1) {
                const data_type_1: EAttribDataTypeStrs = this._model.attribs.query.getAttribDataType(ent_type, name1);
                if (attrib_names_2.indexOf(name1) === -1 ) {
                    result.matches = false;
                    result.comment += 'The "' + name1 + '" ' + ent_type_str + ' attribute with ';
                    result.comment += 'datatype "' + data_type_1 + '" is missing.\n';
                } else {
                    const data_type_2: EAttribDataTypeStrs = model.attribs.query.getAttribDataType(ent_type, name1);
                    if (data_type_1 !== data_type_2) {
                        result.matches = false;
                        result.comment += 'The "' + name1 + '" ' + ent_type_str + ' attribute datatype is wrong. ';
                        result.comment += 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".\n';
                    }
                }
            }
        }
        // TODO compare attribute values
    }
}
