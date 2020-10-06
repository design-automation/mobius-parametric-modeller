import { TAttribDataTypes, EEntType, EAttribDataTypeStrs } from './common';
import { GIAttribMap } from './GIAttribMap';
import { GIModelData } from './GIModelData';

/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapNum extends GIAttribMap {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs) {
        super(modeldata, name, ent_type, data_type);
        this._data_length = 1;
    }
    /**
     * Returns a nested array of entities and values, like this:
     * [ [[2,4,6,8], 'hello'], [[9,10], 'world']]
     * This is the same format as used in gi-json
     * This matches the method setEntsVals()
     */
    public getEntsVals(): [number[], TAttribDataTypes][] {
        const ents_i_values: [number[], TAttribDataTypes][] = [];
        this._map_val_i_to_ents_i.forEach( (ents_i, val_i) => {
            // val_i is either 0 or 1 (false or true)
            const val: number = val_i;
            ents_i_values.push([Array.from(ents_i), val]);
        });
        return ents_i_values;
    }
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * ~
     * Returns undefined if the entity does not exist in this map.
     * ~
     * @param ent_i
     */
    public getEntVal(ents_i: number|number[]): TAttribDataTypes {
        if (!Array.isArray(ents_i)) {
            const ent_i: number = ents_i as number;
            const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            if (val_i === undefined) { return undefined; }
            return val_i;
        } else {
            return ents_i.map(ent_i => this.getEntVal(ent_i)) as TAttribDataTypes;
        }
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        if (typeof val !== 'number') {
            throw new Error('Value must be a number.');
        }
        const val_i: number = val as number;
        const ents_i: Set<number> = this._map_val_i_to_ents_i.get(val_i);
        if (ents_i === undefined) { return []; }
        return Array.from(ents_i);
    }
    /**
     * Sets the value for a given entity or entities.
     *
     * If the value is undefined, no action is taken.
     *
     * The value can be null, in which case it is equivalent to deleting the entities from this attrib map.
     *
     * @param ent_i
     * @param val
     */
    public setEntVal(ents_i: number|number[], val: TAttribDataTypes, check_type = true): void {
        // if indefined, do nothing
        if (val === undefined) { return; }
        // if null, delete
        if (val === null) {
            this.delEnt(ents_i);
            return;
        }
        // check the type
        if (check_type) {
            if (typeof val !== 'number') {
                throw new Error('Error setting attribute value. Attribute is of type "number" but the value is not a number.');
            }
        }
        // val_i is a number
        const val_i: number = val as number;
        // check it exists
        if (!this._map_val_i_to_ents_i.has(val_i)) {
            this._map_val_i_to_ents_i.set(val_i, new Set());
        }
        // an array of ents
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and set _map_ent_i_to_val_i
        ents_i.forEach( ent_i => {
            // keep the old value for later
            const old_val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            // for each ent_i, set the new val_i
            this._map_ent_i_to_val_i.set(ent_i, val_i);
            // for the value add each ent_i
            this._map_val_i_to_ents_i.get(val_i).add(ent_i);
            // clean up the old val_i
            if (old_val_i !== undefined && old_val_i !== val_i) {
                this._map_val_i_to_ents_i.get(old_val_i).delete(ent_i);
                // clean up just in case that was the last entity with this value
                this._cleanUp(old_val_i);
            }
        });
    }
    /**
     * Dumps another attrib map into this attrib map
     * Assumes tha this map is empty
     * @param attrib_map The attrib map to merge into this map
     */
    public dumpEnts(attrib_map: GIAttribMapNum, selected: Set<number>): void {
        selected.forEach(selected_ent_i => {
            if (attrib_map._map_ent_i_to_val_i.has(selected_ent_i)) {
                const val_i: number = attrib_map._map_ent_i_to_val_i.get(selected_ent_i);
                const ents_i: Set<number> = attrib_map._map_val_i_to_ents_i.get(val_i);
                // set the values in the two maps
                const to_ents_i: Set<number> = this._map_val_i_to_ents_i.get(val_i);
                ents_i.forEach( ent_i => {
                    if (!selected.has(ent_i)) {
                        to_ents_i.add(ent_i);
                        this._map_ent_i_to_val_i.set(ent_i, val_i);
                    }
                });
            }
        });
    }
}
