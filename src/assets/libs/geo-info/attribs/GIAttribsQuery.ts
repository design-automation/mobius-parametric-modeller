import { TAttribDataTypes, EEntType,  ESort,
    EAttribDataTypeStrs, EEntTypeStr, EFilterOperatorTypes } from '../common';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes.
 */
export class GIAttribsQuery {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Checks if an attribute with this name exists.
     * @param name
     */
    public hasModelAttrib(name: string): boolean {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attrib.has(name);
    }
    /**
     * Check if attribute exists
     * @param ent_type
     * @param name
     */
    public hasEntAttrib(ent_type: EEntType, name: string): boolean {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attribs.has(name);
    }
    /**
     * Get attrib data type. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    public getAttribDataType(ent_type: EEntType, name: string): EAttribDataTypeStrs {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase>|Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        if (ent_type === EEntType.MOD) {
            const mod_attribs: Map<string, TAttribDataTypes> = attribs as Map<string, TAttribDataTypes>;
            const value: TAttribDataTypes = mod_attribs.get(name);
            if (typeof value === 'number') {
                return EAttribDataTypeStrs.NUMBER;
            } else if (typeof value === 'string') {
                return EAttribDataTypeStrs.STRING;
            } else if (typeof value === 'boolean') {
                return EAttribDataTypeStrs.BOOLEAN;
            } else if (Array.isArray(value)) {
                return EAttribDataTypeStrs.LIST;
            } else if (typeof value === 'object') {
                return EAttribDataTypeStrs.DICT;
            }
            throw new Error('Datatype of model attribute not recognised.');
        } else {
            const ent_attribs: Map<string, GIAttribMapBase> = attribs as Map<string, GIAttribMapBase>;
            return ent_attribs.get(name).getDataType();
        }
    }
    /**
     * Get attrib data length. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    public getAttribDataLength(ent_type: EEntType, name: string): number {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase>|Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        if (ent_type === EEntType.MOD) {
            const mod_attribs: Map<string, TAttribDataTypes> = attribs as Map<string, TAttribDataTypes>;
            const value: TAttribDataTypes = mod_attribs.get(name);
            if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                return 1;
            } else if (Array.isArray(value)) {
                return value.length;
            } else if (typeof value === 'object') {
                return Object.keys(value).length;
            }
            throw new Error('Datatype of model attribute not recognised.');
        } else {
            const ent_attribs: Map<string, GIAttribMapBase> = attribs as Map<string, GIAttribMapBase>;
            return ent_attribs.get(name).getDataLength();
        }
    }
    // ============================================================================
    // Queries on attribute values
    // ============================================================================
    /**
     * Query the model using a query strings.
     * Returns a list of entities in the model.
     * @param ent_type The type of the entities being quieried.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    public filterByAttribs(ent_type: EEntType, ents_i: number[],
            name: string, idx_or_key: number|string, op_type: EFilterOperatorTypes, value: TAttribDataTypes): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // get the map that contains all the attributes for the ent_type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // do the query
        if (attribs && attribs.has(name)) {
            const attrib: GIAttribMapBase = attribs.get(name);
            let query_ents_i: number[];
            if (typeof idx_or_key === 'number') {
                query_ents_i = attrib.queryListIdxVal(ents_i, idx_or_key, op_type, value);
            } else if (typeof idx_or_key === 'string') {
                query_ents_i = attrib.queryDictKeyVal(ents_i, idx_or_key, op_type, value);
            } else {
                query_ents_i = attrib.queryVal(ents_i, op_type, value);
            }
            // return the result
            return query_ents_i;
        } else {
            throw new Error('Attribute "' + name + '" does not exist.');
            // query_ents_i = [];
        }
    }
    /**
     * Sort entities in the model based on attribute values.
     * @param ent_type The type of the entities being sorted.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    public sortByAttribs(ent_type: EEntType, ents_i: number[],
            name: string, idx_or_key: number|string, method: ESort): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // get the map that contains all the ettributes for the ent_type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (!attribs)  { throw new Error('Bad sort: Entity type does not exist.'); }
        // get the attribute from the map
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) {
            // if the attribute does not exist then no sort is performed
            return ents_i;
        }
        // create the sort copmapre function
        function _sortCompareVals(ent1_i: number, ent2_i: number): number {
            const val1: number|string|boolean = attrib.getEntVal(ent1_i) as number|string|boolean;
            const val2: number|string|boolean = attrib.getEntVal(ent2_i) as number|string|boolean;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareListIdxVals(ent1_i: number, ent2_i: number): number {
            const l1: any[] = attrib.getEntVal(ent1_i) as any[];
            const l2: any[] = attrib.getEntVal(ent2_i) as any[];
            const val1: any = (l1 !== undefined && l1 !== null) ? l1[idx_or_key] : null;
            const val2: any = (l2 !== undefined && l2 !== null) ? l2[idx_or_key] : null;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareDictKeyVals(ent1_i: number, ent2_i: number): number {
            const o1: object = attrib.getEntVal(ent1_i) as object;
            const o2: object = attrib.getEntVal(ent2_i) as object;
            const val1: any = (o1 !== undefined && o1 !== null) ? o1[idx_or_key] : null;
            const val2: any = (o2 !== undefined && o2 !== null) ? o2[idx_or_key] : null;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareLists(ent1_i: number, ent2_i: number): number {
            const l1: any[] = attrib.getEntVal(ent1_i) as any[];
            const l2: any[] = attrib.getEntVal(ent2_i) as any[];
            const len: number = l1.length > l2.length ? l1.length : l2.length;
            if (method === ESort.DESCENDING) {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) { return 1; }
                    if (l1[i] > l2[i]) { return -1; }
                }
            } else {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) { return -1; }
                    if (l1[i] > l2[i]) { return 1; }
                }
            }
            return 0;
        }
        function _sortCompareDicts(ent1_i: number, ent2_i: number): number {
            const o1: object = attrib.getEntVal(ent1_i) as object;
            const o2: object = attrib.getEntVal(ent2_i) as object;
            if (method === ESort.DESCENDING) {
                if (o1 < o2) { return 1; }
                if (o1 > o2) { return -1; }
            } else {
                if (o1 < o2) { return -1; }
                if (o1 > o2) { return 1; }
            }
            return 0;
        }
        // do the sort
        if (attrib.getDataType() === EAttribDataTypeStrs.LIST) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareLists);
            } else {
                ents_i.sort(_sortCompareListIdxVals);
            }
        } else if (attrib.getDataType() === EAttribDataTypeStrs.DICT) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareDicts);
            } else {
                ents_i.sort(_sortCompareDictKeyVals);
            }
        } else {
            ents_i.sort(_sortCompareVals);
        }
        return ents_i;
    }
}
