import { EAttribDataTypeStrs, TAttribDataTypes, IMetaData, IMetaJSONData, IAttribJSONValues, IModelJSON, IModelJSONData } from './common';

/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    private _data: IMetaData = {
        time_stamp: 0,
        posi_count: 0,
        vert_count: 0,
        tri_count: 0,
        edge_count: 0,
        wire_count: 0,
        face_count: 0,
        point_count: 0,
        pline_count: 0,
        pgon_count: 0,
        coll_count: 0,
        attrib_values: {
            number: [[], new Map()],    // an array of numbers, and a map: string key -> array index
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
    /**
     * Get the meta data.
     * Data object is passed by reference.
     */
    public getJSONData(): IMetaJSONData {
        const data: IMetaJSONData = {
            time_stamp: this._data.time_stamp,
            posi_count: this._data.point_count,
            vert_count: this._data.vert_count,
            tri_count: this._data.tri_count,
            edge_count: this._data.edge_count,
            wire_count: this._data.wire_count,
            face_count: this._data.face_count,
            point_count: this._data.point_count,
            pline_count: this._data.pline_count,
            pgon_count: this._data.pgon_count,
            coll_count: this._data.coll_count,
            attrib_values: {
                number_vals: this._data.attrib_values.number[0],
                number_keys: Array.from(this._data.attrib_values.number[1].keys()),
                number_idxs: Array.from(this._data.attrib_values.number[1].values()),
                string_vals: this._data.attrib_values.string[0],
                string_keys: Array.from(this._data.attrib_values.string[1].keys()),
                string_idxs: Array.from(this._data.attrib_values.string[1].values()),
                list_vals: this._data.attrib_values.list[0],
                list_keys: Array.from(this._data.attrib_values.list[1].keys()),
                list_idxs: Array.from(this._data.attrib_values.list[1].values()),
                dict_vals: this._data.attrib_values.dict[0],
                dict_keys: Array.from(this._data.attrib_values.dict[1].keys()),
                dict_idxs: Array.from(this._data.attrib_values.dict[1].values()),
            }
        };
        return data;
    }
    /**
     * Merge that data into this meta data.
     * The entity counts will be updated.
     * The attribute values will be added, if they do not already exist.
     * The attribute indexes in model data will also be renumbered.
     * @param attrib_vals
     */
    public mergeJSONData(data: IModelJSON): void {
        const meta_data: IMetaJSONData = data.meta_data;
        const model_data: IModelJSONData = data.model_data;
        this._data.posi_count += meta_data.posi_count;
        this._data.vert_count += meta_data.vert_count;
        this._data.tri_count += meta_data.tri_count;
        this._data.edge_count += meta_data.edge_count;
        this._data.wire_count += meta_data.wire_count;
        this._data.face_count += meta_data.face_count;
        this._data.point_count += meta_data.point_count;
        this._data.pline_count += meta_data.pline_count;
        this._data.pgon_count += meta_data.pgon_count;
        this._data.coll_count += meta_data.coll_count;
        // update the attribute values in this meta
        // create the renumbering maps
        const attrib_vals: IAttribJSONValues = meta_data.attrib_values;
        const renum_num_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.number_vals.length; i++) {
            const other_key: string = attrib_vals.number_keys[i];
            const other_idx: number = attrib_vals.number_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.NUMBER)) {
                renum_num_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.NUMBER));
            } else {
                const other_val: number = attrib_vals.number_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.NUMBER);
                renum_num_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_str_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.string_vals.length; i++) {
            const other_key: string = attrib_vals.string_keys[i];
            const other_idx: number = attrib_vals.string_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.STRING)) {
                renum_str_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.STRING));
            } else {
                const other_val: string = attrib_vals.string_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.STRING);
                renum_str_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_list_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.list_vals.length; i++) {
            const other_key: string = attrib_vals.list_keys[i];
            const other_idx: number = attrib_vals.list_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.LIST)) {
                renum_list_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.LIST));
            } else {
                const other_val: any[] = attrib_vals.list_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.LIST);
                renum_list_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_dict_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.dict_vals.length; i++) {
            const other_key: string = attrib_vals.dict_keys[i];
            const other_idx: number = attrib_vals.dict_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.DICT)) {
                renum_dict_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.DICT));
            } else {
                const other_val: object = attrib_vals.dict_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.DICT);
                renum_dict_attrib_vals.set(other_idx, new_idx);
            }
        }
        // apply the renumbering of attribute indexes in the model data
        const renum_attrib_vals = {
            [EAttribDataTypeStrs.NUMBER]: renum_num_attrib_vals,
            [EAttribDataTypeStrs.STRING]: renum_str_attrib_vals,
            [EAttribDataTypeStrs.LIST]: renum_list_attrib_vals,
            [EAttribDataTypeStrs.DICT]: renum_dict_attrib_vals
        };
        model_data.attributes.posis.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.verts.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.edges.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.wires.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.faces.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.points.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.plines.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.pgons.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        model_data.attributes.colls.forEach( attrib => {
            attrib.data[0] = renum_attrib_vals[attrib.data_type].get(attrib.data[0]);
        });
        // no need to return the model data
    }
    // get next time stamp
    public nextTimeStamp(): number {
        const ts: number = this._data.time_stamp;
        this._data.time_stamp += 1;
        return ts;
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
    public nextFace(): number {
        const index: number = this._data.face_count;
        this._data.face_count += 1;
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
    public setNextFace(index: number): void {
        this._data.face_count = index;
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
    public addAttribByKeyVal(key: string|number, val: TAttribDataTypes, data_type: EAttribDataTypeStrs): number {
        if (this._data.attrib_values[data_type][1].has(key)) {
            return this._data.attrib_values[data_type][1].get(key);
        }
        const index = this._data.attrib_values[data_type][0].push(val) - 1;
        this._data.attrib_values[data_type][1].set(key, index);
        return index;
    }
    public getAttribValFromIdx(index: number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._data.attrib_values[data_type][0][index];
    }
    public getAttribValFromKey(key: string|number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._data.attrib_values[data_type][0][this._data.attrib_values[data_type][1].get(key)];
    }
    public getAttribIdxFromKey(key: string|number, data_type: EAttribDataTypeStrs): number {
        return this._data.attrib_values[data_type][1].get(key);
    }
    public hasAttribKey(key: string|number, data_type: EAttribDataTypeStrs): boolean {
        console.log(">>>", key, data_type, this._data)
        return this._data.attrib_values[data_type][1].has(key);
    }
    // create string for debugging
    public toDebugStr(): string {
        return '' +
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
}
