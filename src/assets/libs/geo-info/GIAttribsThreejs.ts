import { GIModel } from './GIModel';
import { TAttribDataTypes, EEntType, IAttribsMaps, EAttribNames, EEntTypeStr } from './common';
import { GIAttribMap } from './GIAttribMap';

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
                if (attrib_name === EAttribNames.COLOUR) {
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
            const obj = {Name: key, Value: value as string};
            arr.push(obj);
        });
        // console.log(arr);
        return arr;
    }
    /**
     *
     * @param ent_type
     */
    public getAttribsForTable(ent_type: EEntType): any[] {
        // get the attribs map for this ent type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        // create a map of objects to store the data
        const data_obj_map: Map< number, { '#': number, id: string} > = new Map();
        // create the ID for each table row
        const ents_i: number[] = this._model.geom.query.getEnts(ent_type, false);
        let i = 0;
        for (const ent_i of ents_i) {
            data_obj_map.set(ent_i, { '#': i, id: `${attribs_maps_key}${ent_i}` } );
            i++;
        }
        // loop through all the attributes
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataSize();
            for (const ent_i of ents_i) {
                const attrib_value = attrib.getEntVal(ent_i);
                if ( data_size > 1 ) {
                    if (attrib_value !== undefined) {
                        (attrib_value as any[]).forEach( (v, idx) => {
                            data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = v;
                        });
                    } else {
                        for (let idx = 0; idx < data_size; idx++) {
                            data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                        }
                    }
                } else {
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                }
            }
        });
        return Array.from(data_obj_map.values());
    }

    /**
     * @param ent_type
     * @param ents_i
     */
    public getEntsVals(selected_ents: Map<string, number>, ent_type: EEntType): any[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const data_obj_map: Map< number, { '#': number, id: string} > = new Map();
        if (!selected_ents || selected_ents === undefined) {
            return [];
        }
        let i = 0;
        selected_ents.forEach(ent => {
            data_obj_map.set(ent, { '#': i, id: `${attribs_maps_key}${ent}` } );
            i++;
        });
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataSize();
            for (const ent_i of Array.from(selected_ents.values())) {
                const attrib_value = attrib.getEntVal(ent_i);
                if ( data_size > 1 ) {
                    if (attrib_value !== undefined) {
                        (attrib_value as any[]).forEach( (v, idx) => {
                            data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = v;
                        });
                    } else {
                        for (let idx = 0; idx < data_size; idx++) {
                            data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                        }
                    }
                } else {
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                }
            }
        });
        return Array.from(data_obj_map.values());
    }
}
