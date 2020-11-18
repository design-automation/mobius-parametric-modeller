import { EAttribDataTypeStrs, TAttribDataTypes, IMetaData } from './common';
import * as lodash from 'lodash';

/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    private _data: IMetaData = {
        // timestamp: 0,
        posi_count: 0,
        vert_count: 0,
        tri_count: 0,
        edge_count: 0,
        wire_count: 0,
        point_count: 0,
        pline_count: 0,
        pgon_count: 0,
        coll_count: 0,
        attrib_values: {
            number: [[], new Map()],    // an array of numbers, and a map: number key -> array index
            string: [[], new Map()],    // an array of strings, and a map: string key -> array index
            list:   [[], new Map()],    // an array of lists, and a map: string key -> array index
            dict:   [[], new Map()]     // an array of dicts, and a map: string key -> array index
        }
    };
    /**
     * Constructor
     */
    constructor() {
        // console.log('CREATING META OBJECT');
    }
    // /**
    //  * Get the meta data.
    //  */
    // public getJSONData(model_data: IModelJSONData): IMetaJSONData {
    //     const data_filtered: IAttribValues = {
    //         number: [[], new Map()],
    //         string: [[], new Map()],
    //         list: [[], new Map()],
    //         dict: [[], new Map()],
    //     };
    //     // filter the metadata values
    //     // we only want the values that are actually used in this model
    //     for (const key of Object.keys(model_data.attributes)) {
    //         if (key !== 'model') {
    //             for (const attrib of model_data.attributes[key]) {
    //                 const data_type: EAttribDataTypeStrs = attrib.data_type;
    //                 if (data_type !== EAttribDataTypeStrs.BOOLEAN) {
    //                     for (const item of attrib.data) {
    //                         const attrib_idx = item[0];
    //                         const attrib_val = this._data.attrib_values[data_type][0][attrib_idx];
    //                         const attrib_key = (data_type === 'number' || data_type === 'string') ? attrib_val : JSON.stringify(attrib_val);
    //                         let new_attrib_idx: number;
    //                         if (attrib_key in data_filtered[data_type][1]) {
    //                             new_attrib_idx = data_filtered[data_type][1].get(attrib_key);
    //                         } else {
    //                             new_attrib_idx = data_filtered[data_type][0].push(attrib_val) - 1;
    //                             data_filtered[data_type][1].set(attrib_key, new_attrib_idx);
    //                         }
    //                         item[0] = new_attrib_idx;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     const data: IMetaJSONData = {
    //         // timestamp: this._data.timestamp,
    //         posi_count: this._data.posi_count,
    //         vert_count: this._data.vert_count,
    //         tri_count: this._data.tri_count,
    //         edge_count: this._data.edge_count,
    //         wire_count: this._data.wire_count,
    //         face_count: this._data.face_count,
    //         point_count: this._data.point_count,
    //         pline_count: this._data.pline_count,
    //         pgon_count: this._data.pgon_count,
    //         coll_count: this._data.coll_count,
    //         attrib_values: {
    //             number_vals: data_filtered.number[0],
    //             string_vals: data_filtered.string[0],
    //             list_vals: data_filtered.list[0],
    //             dict_vals: data_filtered.dict[0]
    //         }
    //     };
    //     return data;
    // }
    // /**
    //  * Merge that data into this meta data.
    //  * The entity counts will be updated.
    //  * The attribute values will be added, if they do not already exist.
    //  * The attribute indexes in model data will also be renumbered.
    //  * @param data
    //  */
    // public  mergeJSONData(data: IModelJSON): void {
    //     const meta_data: IMetaJSONData = data.meta_data;
    //     const model_data: IModelJSONData = data.model_data;
    //     // update the attribute values in this meta
    //     // create the renumbering maps
    //     const attrib_vals: IAttribJSONValues = meta_data.attrib_values;
    //     const renum_num_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.number_vals.length; other_idx++) {
    //         const other_key: number = attrib_vals.number_vals[other_idx];
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.NUMBER)) {
    //             renum_num_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.NUMBER));
    //         } else {
    //             const other_val: number = attrib_vals.number_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.NUMBER);
    //             renum_num_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_str_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.string_vals.length; other_idx++) {
    //         const other_key: string = attrib_vals.string_vals[other_idx];
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.STRING)) {
    //             renum_str_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.STRING));
    //         } else {
    //             const other_val: string = attrib_vals.string_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.STRING);
    //             renum_str_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_list_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.list_vals.length; other_idx++) {
    //         const other_key: string = JSON.stringify(attrib_vals.list_vals[other_idx]);
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.LIST)) {
    //             renum_list_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.LIST));
    //         } else {
    //             const other_val: any[] = attrib_vals.list_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.LIST);
    //             renum_list_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_dict_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.dict_vals.length; other_idx++) {
    //         const other_key: string = JSON.stringify(attrib_vals.dict_vals[other_idx]);
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.DICT)) {
    //             renum_dict_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.DICT));
    //         } else {
    //             const other_val: object = attrib_vals.dict_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.DICT);
    //             renum_dict_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     // apply the renumbering of attribute indexes in the model data
    //     const renum_attrib_vals: Map<string, Map<number, number>> = new Map();
    //     renum_attrib_vals.set(EAttribDataTypeStrs.NUMBER, renum_num_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.STRING, renum_str_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.LIST, renum_list_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.DICT, renum_dict_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.posis, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.verts, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.edges, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.wires, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.faces, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.points, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.plines, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.pgons, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.colls, renum_attrib_vals);
    //     // no need to return the model data
    // }
    //
    public getEntCounts(): number[] {
        return [
            this._data.posi_count,
            this._data.point_count,
            this._data.pline_count,
            this._data.pgon_count,
            this._data.coll_count
        ];
    }
    // get next index
    public nextPosi(): number {
        const index: number = this._data.posi_count;
        this._data.posi_count += 1;
        return index;
    }
    public nextVert(): number {
        const index: number = this._data.vert_count;
        this._data.vert_count += 1;
        return index;
    }
    public nextTri(): number {
        const index: number = this._data.tri_count;
        this._data.tri_count += 1;
        return index;
    }
    public nextEdge(): number {
        const index: number = this._data.edge_count;
        this._data.edge_count += 1;
        return index;
    }
    public nextWire(): number {
        const index: number = this._data.wire_count;
        this._data.wire_count += 1;
        return index;
    }
    public nextPoint(): number {
        const index: number = this._data.point_count;
        this._data.point_count += 1;
        return index;
    }
    public nextPline(): number {
        const index: number = this._data.pline_count;
        this._data.pline_count += 1;
        return index;
    }
    public nextPgon(): number {
        const index: number = this._data.pgon_count;
        this._data.pgon_count += 1;
        return index;
    }
    public nextColl(): number {
        const index: number = this._data.coll_count;
        this._data.coll_count += 1;
        return index;
    }
    // set next index
    public setNextPosi(index: number): void {
        this._data.posi_count = index;
    }
    public setNextVert(index: number): void {
        this._data.vert_count = index;
    }
    public setNextTri(index: number): void {
        this._data.tri_count = index;
    }
    public setNextEdge(index: number): void {
        this._data.edge_count = index;
    }
    public setNextWire(index: number): void {
        this._data.wire_count = index;
    }
    public setNextPoint(index: number): void {
        this._data.point_count = index;
    }
    public setNextPline(index: number): void {
        this._data.pline_count = index;
    }
    public setNextPgon(index: number): void {
        this._data.pgon_count = index;
    }
    public setNextColl(index: number): void {
        this._data.coll_count = index;
    }
    // attribute values
    public addByKeyVal(key: string|number, val: TAttribDataTypes, data_type: EAttribDataTypeStrs): number {
        if (this._data.attrib_values[data_type][1].has(key)) {
            return this._data.attrib_values[data_type][1].get(key);
        }
        const index = this._data.attrib_values[data_type][0].push(val) - 1;
        this._data.attrib_values[data_type][1].set(key, index);
        return index;
    }
    public getValFromIdx(index: number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        // TODO this is doing deep copy
        // This may not be a good idea
        const val: TAttribDataTypes =  this._data.attrib_values[data_type][0][index];
        return val;
        // if (data_type === EAttribDataTypeStrs.LIST) {
        //     return (val as any[]).slice();
        // } else if (data_type === EAttribDataTypeStrs.DICT) {
        //     return lodash.deepCopy(val as object);
        // }
        // return val;
    }
    public getIdxFromKey(key: string|number, data_type: EAttribDataTypeStrs): number {
        return this._data.attrib_values[data_type][1].get(key);
    }
    public hasKey(key: string|number, data_type: EAttribDataTypeStrs): boolean {
        return this._data.attrib_values[data_type][1].has(key);
    }
    // create string for debugging
    public toDebugStr(): string {
        return '' +
            'posi_count = ' + this._data.posi_count + '\n' +
            'vert_count = ' + this._data.vert_count + '\n' +
            'tri_count = ' + this._data.tri_count + '\n' +
            'edge_count = ' + this._data.edge_count + '\n' +
            'wire_count = ' + this._data.wire_count + '\n' +
            'point_count = ' + this._data.point_count + '\n' +
            'pline_count = ' + this._data.pline_count + '\n' +
            'pgon_count = ' + this._data.pgon_count + '\n' +
            'coll_count = ' + this._data.coll_count + '\n' +
            'number: ' +
            JSON.stringify(this._data.attrib_values['number'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['number'][1])) +
            '\nstring: ' +
            JSON.stringify(this._data.attrib_values['string'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['string'][1])) +
            '\nlist: ' +
            JSON.stringify(this._data.attrib_values['list'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['list'][1])) +
            '\ndict: ' +
            JSON.stringify(this._data.attrib_values['dict'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['dict'][1]));
    }
    // --------------------------------------------

    // /**
    //  * Helper method to renumber the indexes of the attribute values in the JSON data.
    //  * @param attribs_data the attribute data, [val_index, [list of ents]]
    //  * @param renum_attrib_vals A map of maps, old numbering -> new numbering
    //  */
    // private _renumAttribValues(attribs_data: IAttribJSONData[], renum_attrib_vals: Map<string, Map<number, number>>): void {
    //     for (const attrib_data of attribs_data) {
    //         const renum: Map<number, number> = renum_attrib_vals.get(attrib_data.data_type);
    //         for (const val_i_ents of attrib_data.data) {
    //             if (attrib_data.data_type !== EAttribDataTypeStrs.BOOLEAN) {
    //                 val_i_ents[0] = renum.get(val_i_ents[0]);
    //             }
    //         }
    //     }
    // }
}
