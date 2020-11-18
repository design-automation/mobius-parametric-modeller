import { TAttribDataTypes, EEntType, EAttribNames, EEntTypeStr, Txyz, TEntTypeIdx } from '../common';
import { isString } from 'util';
import { sortByKey } from '../../util/maps';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';

/**
 * Class for attributes.
 */
export class GIAttribsThreejs {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the position.
     */
    public get3jsSeqPosisCoords(ssid: number): [number[], Map<number, number>] {
        const coords_attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS);
        //
        const coords: number[][] = [];
        const posi_map: Map<number, number> = new Map();
        const posis_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.POSI);

        for (const posi_i of posis_i) {
            const tjs_index: number = coords.push( coords_attrib.getEntVal(posi_i) as number[] ) - 1;
            posi_map.set(posi_i, tjs_index);
        }
        // @ts-ignore
        return [coords.flat(1), posi_map];
    }
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the positio.
     */
    public get3jsSeqVertsCoords(ssid: number): [number[], Map<number, number>] {
        const coords_attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS);
        //
        const coords: number[][] = [];
        const vertex_map: Map<number, number> = new Map();
        const verts_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.VERT);

        for (const vert_i of verts_i) {
            const posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const tjs_index: number = coords.push( coords_attrib.getEntVal(posi_i) as number[] ) - 1;
            vertex_map.set(vert_i, tjs_index);
        }
        // @ts-ignore
        return [coords.flat(1), vertex_map];
    }
    /**
     * Get a flat array of normals values for all the vertices.
     * Verts that have been deleted will not be included
     */
    public get3jsSeqVertsNormals(ssid: number): number[] {
        if (!this.modeldata.attribs.attribs_maps.get(ssid)._v.has(EAttribNames.NORMAL)) { return null; }
        // create a sparse arrays of normals of all verts of polygons
        const verts_attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid)._v.get(EAttribNames.NORMAL);
        const normals: Txyz[] = [];
        const pgons_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.PGON);
        for (const pgon_i of pgons_i) {
            let pgon_normal: Txyz = null;
            for (const vert_i of this.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i)) {
                let normal: Txyz = verts_attrib.getEntVal(vert_i) as Txyz;
                if (normal === undefined) {
                    pgon_normal = this.modeldata.geom.snapshot.getPgonNormal(ssid, pgon_i);
                    normal = pgon_normal;
                }
                normals[vert_i] = normal;
            }
        }
        // get all the normals
        const verts_normals: TAttribDataTypes[] = [];
        const verts_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.VERT);
        for (const vert_i of verts_i) {
            if (vert_i !== undefined) {
                let normal: Txyz = normals[vert_i];
                normal = normal === undefined ? [0, 0, 0] : normal;
                verts_normals.push(normal);
            }
        }
        // @ts-ignore
        return verts_normals.flat(1);
    }

    /**
     * Get a flat array of colors values for all the vertices.
     */
    public get3jsSeqVertsColors(ssid: number): number[] {
        if (!this.modeldata.attribs.attribs_maps.get(ssid)._v.has(EAttribNames.COLOR)) { return null; }
        const verts_attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid)._v.get(EAttribNames.COLOR);
        // get all the colors
        const verts_colors: TAttribDataTypes[] = [];
        const verts_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.VERT);
        for (const vert_i of verts_i) {
            if (vert_i !== undefined) {
                const value = verts_attrib.getEntVal(vert_i) as TAttribDataTypes;
                const _value = value === undefined ? [1, 1, 1] : value;
                verts_colors.push(_value);
            }
        }
        // @ts-ignore
        return verts_colors.flat(1);
    }

    /**
     *
     */
    public getModelAttribsForTable(ssid: number): any[] {
        const attrib: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid).mo;
        if (attrib === undefined) { return []; }
        const arr = [];
        attrib.forEach((value, key) => {
            // const _value = isString(value) ? `'${value}'` : value;
            const _value = JSON.stringify(value);
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
    public getAttribsForTable(ssid: number, ent_type: EEntType): {data: any[], ents: number[]} {
        // get the attribs map for this ent type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];

        // create a map of objects to store the data
        // const data_obj_map: Map< number, { '#': number, _id: string} > = new Map();
        const data_obj_map: Map< number, {_id: string} > = new Map();

        // create the ID for each table row
        const ents_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, ent_type);

        // sessionStorage.setItem('attrib_table_ents', JSON.stringify(ents_i));
        let i = 0;
        for (const ent_i of ents_i) {
            // data_obj_map.set(ent_i, { '#': i, _id: `${attribs_maps_key}${ent_i}`} );
            data_obj_map.set(ent_i, {_id: `${attribs_maps_key}${ent_i}`} );
            if (ent_type === EEntType.COLL) {
                const coll_parent = this.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
                data_obj_map.get(ent_i)['_parent'] = coll_parent === undefined ? '' : 'co' + coll_parent;
            }
            i++;
        }
        // loop through all the attributes
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataLength();
            if (attrib.numVals() === 0) { return; }
            for (const ent_i of ents_i) {
                if (attrib_name.substr(0, 1) === '_' && attrib_name !== '_parent') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                } else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if (attrib_value && attrib_value.constructor === {}.constructor) {
                        data_obj_map.get(ent_i)[`${attrib_name}`] = JSON.stringify(attrib_value);
                    } else if ( data_size > 1 ) {
                        if (attrib_value === undefined) {
                            for (let idx = 0; idx < data_size; idx++) {
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                            }
                        } else {
                            (attrib_value as any[]).forEach( (v, idx) => {
                                const _v =  v;
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = _v;
                            });
                        }
                    } else {
                        if (ent_type === EEntType.POSI && Array.isArray(attrib_value)) {
                            if (attrib_name === 'xyz') {
                                for (let index = 0; index < attrib_value.length; index++) {
                                    const _v = Array.isArray(attrib_value[index]) ?
                                    JSON.stringify(attrib_value[index]) : attrib_value[index];
                                    data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                }
                            // if (attrib_value.length < 4) {
                            //     console.log(attrib_value)
                            //     for (let index = 0; index < attrib_value.length; index++) {
                            //         const _v = Array.isArray(attrib_value[index]) ?
                            //         JSON.stringify(attrib_value[index]) : attrib_value[index];
                            //         data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                            //     }
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
     * Gets the sub ents and attibs of an object or collection..
     * Returns an array of maps, each map is: attribname -> attrib_value
     * @param ent_type
     */
    public getEntSubAttribsForTable(ssid: number, ent_type: EEntType, ent_i: number, level: EEntType): Array<Map< string, TAttribDataTypes >> {
        const data: Array<Map< string, TAttribDataTypes >> = [];
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const data_headers: Map< string, TAttribDataTypes > = new Map();
        attribs.forEach( (attrib, attrib_name) => data_headers.set(attrib_name, attrib.getDataType()) );
        data.push(data_headers);
        data.push(this._addEntSubAttribs(ssid, ent_type, ent_i, level));
        switch (ent_type) {
            case EEntType.COLL:
                {
                    for (const coll_i of this.modeldata.geom.nav.navCollToCollChildren(ent_i)) {
                        data.push(this._addEntSubAttribs(ssid, EEntType.COLL, coll_i, level));
                    }
                }
                return data;
            case EEntType.PGON:
                {
                    for (const wire_i of this.modeldata.geom.nav.navPgonToWire(ent_i)) {
                        this._addEntSubWire(ssid, wire_i, data, level);
                    }
                }
                return data;
            case EEntType.PLINE:
                {
                    const wire_i: number = this.modeldata.geom.nav.navPlineToWire(ent_i);
                    this._addEntSubWire(ssid, wire_i, data, level);
                }
                return data;
            case EEntType.POINT:
                {
                    const vert_i: number = this.modeldata.geom.nav.navPointToVert(ent_i);
                    data.push(this._addEntSubAttribs(ssid, EEntType.VERT, vert_i, level));
                    data.push(this._addEntSubAttribs(ssid, EEntType.POSI, this.modeldata.geom.nav.navVertToPosi(vert_i), level));
                }
                return data;
            default:
                break;
        }
    }
    private _addEntSubWire(ssid: number, wire_i: number, data: Array<Map< string, TAttribDataTypes >>, level: number): void {
        data.push(this._addEntSubAttribs(ssid, EEntType.WIRE, wire_i, level));
        const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
        for (const edge_i of edges_i) {
            const [vert0_i, vert1_i]: number[] = this.modeldata.geom.nav.navEdgeToVert(edge_i);
            const posi0_i: number = this.modeldata.geom.nav.navVertToPosi(vert0_i);
            data.push(this._addEntSubAttribs(ssid, EEntType.VERT, vert0_i, level));
            data.push(this._addEntSubAttribs(ssid, EEntType.POSI, posi0_i, level));
            data.push(this._addEntSubAttribs(ssid, EEntType.EDGE, edge_i, level));
            if (edge_i === edges_i[edges_i.length - 1]) {
                const posi1_i: number = this.modeldata.geom.nav.navVertToPosi(vert1_i);
                data.push(this._addEntSubAttribs(ssid, EEntType.VERT, vert1_i, level));
                data.push(this._addEntSubAttribs(ssid, EEntType.POSI, posi1_i, level));
            }
        }
    }
    private _addEntSubAttribs(ssid: number, ent_type: number, ent_i: number, level: number): Map<string, TAttribDataTypes> {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const data_map: Map< string, TAttribDataTypes> = new Map();
        data_map.set('_id', `${attribs_maps_key}${ent_i}` );
        if (ent_type !== level) { return data_map; }
        // loop through all the attributes
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataLength();
            if (attrib.numVals() === 0) { return; }

            const attrib_value = attrib.getEntVal(ent_i);
            if (attrib_value && attrib_value.constructor === {}.constructor) {
                data_map.set(`${attrib_name}`, JSON.stringify(attrib_value));
            } else if ( data_size > 1 ) {
                // if (attrib_value === undefined) {
                //     for (let idx = 0; idx < data_size; idx++) {
                //         data_map.set(`${attrib_name}[${idx}]`] = undefined;
                //     }
                // } else {
                    (attrib_value as TAttribDataTypes[]).forEach( (v, idx) => {
                        const _v =  v;
                        data_map.set(`${attrib_name}[${idx}]`,  _v);
                    });
                // }
            } else {
                if (ent_type === EEntType.POSI && Array.isArray(attrib_value)) {
                    if (attrib_name === 'xyz') {
                        for (let index = 0; index < attrib_value.length; index++) {
                            const _v = Array.isArray(attrib_value[index]) ?
                            JSON.stringify(attrib_value[index]) : attrib_value[index];
                            data_map.set(`${attrib_name}[${index}]`, _v);
                        }
                    // if (attrib_value.length < 4) {
                    //     console.log(attrib_value)
                    //     for (let index = 0; index < attrib_value.length; index++) {
                    //         const _v = Array.isArray(attrib_value[index]) ?
                    //         JSON.stringify(attrib_value[index]) : attrib_value[index];
                    //         data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                    //     }
                    } else {
                        data_map.set(attrib_name, JSON.stringify(attrib_value));
                    }
                } else {
                    const _attrib_value = isString(attrib_value) ? `'${attrib_value}'` : attrib_value;
                    data_map.set(`${attrib_name}`, _attrib_value);
                }
            }
        });
        return data_map;
    }
    /**
     * @param ent_type
     * @param ents_i
     */
    public getEntsVals(ssid: number, selected_ents: Map<string, number>, ent_type: EEntType): any[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const data_obj_map: Map< number, { _id: string} > = new Map();
        if (!selected_ents || selected_ents === undefined) {
            return [];
        }
        let i = 0;
        const selected_ents_sorted = sortByKey(selected_ents);
        selected_ents_sorted.forEach(ent => {
            data_obj_map.set(ent, { _id: `${attribs_maps_key}${ent}` } );
            if (ent_type === EEntType.COLL) {
                const coll_parent = this.modeldata.geom.snapshot.getCollParent(ssid, ent);
                data_obj_map.get(ent)['_parent'] = coll_parent === undefined ? '' : coll_parent;
            }
            i++;
        });
        const nullAttribs = new Set();
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataLength();
            if (attrib.numVals() === 0) { return; }
            nullAttribs.add(attrib_name);
            for (const ent_i of Array.from(selected_ents.values())) {
                if (attrib_name.substr(0, 1) === '_') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                    nullAttribs.delete(attrib_name);
                } else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if (attrib_value !== undefined) { nullAttribs.delete(attrib_name); }
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
        for (const attrib of nullAttribs) {
            data_obj_map.forEach( (val, index) => {
                try {
                    // @ts-ignore
                    delete val[attrib];
                } catch (ex) {}
            });
        }
        return Array.from(data_obj_map.values());
    }
}
