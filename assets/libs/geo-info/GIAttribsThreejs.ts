import { GIModel } from './GIModel';
import { TAttribDataTypes, EEntType, IAttribsMaps, EAttribNames, EEntTypeStr } from './common';
import { GIAttribMap } from './GIAttribMap';
import { isString } from 'util';
import { sortByKey } from '../util/maps';

/**
 * Class for attributes.
 */
export class GIAttribsThreejs {
    private _model: GIModel;
    private _attribs_maps: IAttribsMaps;
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel, attribs_maps: IAttribsMaps) {
        this._model = model;
        this._attribs_maps = attribs_maps;
    }
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the positio.
     */
    public get3jsSeqPosisCoords(): [number[], Map<number, number>] {
        const coords_attrib: GIAttribMap = this._attribs_maps.ps.get(EAttribNames.COORDS);
        //
        const coords: number[][] = [];
        const posi_map: Map<number, number> = new Map();
        const posis_i: number[] = this._model.geom.query.getEnts(EEntType.POSI, true);
        posis_i.forEach( (posi_i, gi_index) => {
            if (posi_i !== null) {
                const tjs_index: number = coords.push( coords_attrib.getEntVal(posi_i) as number[] ) - 1;
                posi_map.set(gi_index, tjs_index);
            }
        });
        // @ts-ignore
        return [coords.flat(1), posi_map];
    }
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the positio.
     */
    public get3jsSeqVertsCoords(): [number[], Map<number, number>] {
        const coords_attrib: GIAttribMap = this._attribs_maps.ps.get(EAttribNames.COORDS);
        //
        const coords: number[][] = [];
        const vertex_map: Map<number, number> = new Map();
        const verts_i: number[] = this._model.geom.query.getEnts(EEntType.VERT, true);
        verts_i.forEach( (vert_i, gi_index) => {
            if (vert_i !== null) {
                const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
                const tjs_index: number = coords.push( coords_attrib.getEntVal(posi_i) as number[] ) - 1;
                vertex_map.set(gi_index, tjs_index);
            }
        });
        // @ts-ignore
        return [coords.flat(1), vertex_map];
    }
    /**
     * Get a flat array of attribute values for all the vertices.
     * Verts that have been deleted will not be included
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    public get3jsSeqVertsAttrib(attrib_name: EAttribNames): number[] {
        if (!this._attribs_maps._v.has(attrib_name)) { return null; }
        const verts_attrib: GIAttribMap = this._attribs_maps._v.get(attrib_name);
        //
        const verts_attribs_values: TAttribDataTypes[] = [];
        const verts_i: number[] = this._model.geom.query.getEnts(EEntType.VERT, true);
        verts_i.forEach( (vert_i, gi_index) => {
            if (vert_i !== null) {
                const value = verts_attrib.getEntVal(vert_i) as TAttribDataTypes;
                if (attrib_name === EAttribNames.COLOR) {
                    const _value = value === undefined ? [1, 1, 1] : value;
                    verts_attribs_values.push(_value);
                } else {
                    verts_attribs_values.push(value);
                }
            }
        });
        // @ts-ignore
        return verts_attribs_values.flat(1);
    }
    /**
     *
     */
    public getModelAttribsForTable(): any[] {
        const attribs_maps_key: string = EEntTypeStr[ EEntType.MOD ];
        const attribs: Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        if (attribs === undefined) { return []; }
        const arr = [];
        attribs.forEach((value, key) => {
            // const _value = isString(value) ? `'${value}'` : value;
            const _value = value;
            const obj = {Name: key, Value: _value};
            arr.push(obj);
        });
        // console.log(arr);
        return arr;
    }
    /**
     *
     * @param ent_type
     */
    public getAttribsForTable(ent_type: EEntType): {data: any[], ents: number[]} {
        // get the attribs map for this ent type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];

        // create a map of objects to store the data
        // const data_obj_map: Map< number, { '#': number, _id: string} > = new Map();
        const data_obj_map: Map< number, {_id: string} > = new Map();

        // create the ID for each table row
        const ents_i: number[] = this._model.geom.query.getEnts(ent_type, false);

        // sessionStorage.setItem('attrib_table_ents', JSON.stringify(ents_i));
        let i = 0;
        for (const ent_i of ents_i) {
            // data_obj_map.set(ent_i, { '#': i, _id: `${attribs_maps_key}${ent_i}`} );
            data_obj_map.set(ent_i, {_id: `${attribs_maps_key}${ent_i}`} );
            if (ent_type === EEntType.COLL) {
                const coll_parent = this._model.geom.query.getCollParent(ent_i);
                data_obj_map.get(ent_i)['_parent'] = coll_parent === -1 ? '' : coll_parent;
            }
            i++;
        }
        // loop through all the attributes
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataLength();
            for (const ent_i of ents_i) {
                if (attrib_name.substr(0, 1) === '_' && attrib_name !== '_parent') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                } else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if ( data_size > 1 ) {
                        if (attrib_value === undefined) {
                            for (let idx = 0; idx < data_size; idx++) {
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                            }
                        } else if (attrib_value.constructor === {}.constructor) {
                            data_obj_map.get(ent_i)[`${attrib_name}`] = JSON.stringify(attrib_value);
                        } else {
                            (attrib_value as any[]).forEach( (v, idx) => {
                                const _v =  v;
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = _v;
                            });
                        }
                    } else {
                        if (ent_type === EEntType.POSI && Array.isArray(attrib_value)) {
                            if (attrib_value.length < 4) {
                                for (let index = 0; index < attrib_value.length; index++) {
                                    const _v = Array.isArray(attrib_value[index]) ?
                                    JSON.stringify(attrib_value[index]) : attrib_value[index];
                                    data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                }
                            } else {
                                data_obj_map.get(ent_i)[attrib_name] = JSON.stringify(attrib_value);
                            }
                        } else {
                            const _attrib_value = isString(attrib_value) ? `'${attrib_value}'` : attrib_value;
                            data_obj_map.get(ent_i)[`${attrib_name}`] = _attrib_value;
                        }
                    }
                }
            }
        });
        return { data: Array.from(data_obj_map.values()), ents: ents_i};
    }

    /**
     * @param ent_type
     * @param ents_i
     */
    public getEntsVals(selected_ents: Map<string, number>, ent_type: EEntType): any[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const data_obj_map: Map< number, { _id: string} > = new Map();
        if (!selected_ents || selected_ents === undefined) {
            return [];
        }
        let i = 0;
        const selected_ents_sorted = sortByKey(selected_ents);
        selected_ents_sorted.forEach(ent => {
            data_obj_map.set(ent, { _id: `${attribs_maps_key}${ent}` } );
            if (ent_type === EEntType.COLL) {
                const coll_parent = this._model.geom.query.getCollParent(ent);
                data_obj_map.get(ent)['_parent'] = coll_parent === -1 ? '' : coll_parent;
            }
            i++;
        });
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataLength();
            for (const ent_i of Array.from(selected_ents.values())) {
                if (attrib_name.substr(0, 1) === '_') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                } else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if ( data_size > 1 ) {
                        if (attrib_value === undefined) {
                            for (let idx = 0; idx < data_size; idx++) {
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                            }
                        } else if (attrib_value.constructor === {}.constructor) {
                            data_obj_map.get(ent_i)[`${attrib_name}`] = JSON.stringify(attrib_value);
                        } else {
                            (attrib_value as any[]).forEach( (v, idx) => {
                                const _v =  v;
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = _v;
                            });
                        }
                    } else {
                        if (ent_type === EEntType.POSI && Array.isArray(attrib_value)) {
                            if (attrib_value.length < 4) {
                                for (let index = 0; index < attrib_value.length; index++) {
                                    const _v = Array.isArray(attrib_value[index]) ?
                                    JSON.stringify(attrib_value[index]) : attrib_value[index];
                                    data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                }
                            } else {
                                data_obj_map.get(ent_i)[attrib_name] = JSON.stringify(attrib_value);
                            }
                        } else {
                            const _attrib_value = isString(attrib_value) ? `'${attrib_value}'` : attrib_value;
                            data_obj_map.get(ent_i)[`${attrib_name}`] = _attrib_value;
                        }
                    }
                }
            }
        });
        return Array.from(data_obj_map.values());
    }
    /**
     * TODO
     * This is confusing... will this not always return the same, i.e. id = index
     * @param ent_type
     * @param id
     */
    public getIdIndex(ent_type: EEntType, id: number) {
        const ents_i = this._model.geom.query.getEnts(ent_type, false);
        const index = ents_i.findIndex(ent_i => ent_i === id);
        console.log("calling getIdIndex in GIATtribsThreejs", id, index);
        return index;
    }
}
