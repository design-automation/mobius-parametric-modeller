import { BiMapManyToOne } from './BiMap';
import { EAttribDataTypeStrs, TAttribDataTypes, IAttribData } from './GIJson';
import { EQueryOperatorTypes } from './GICommon';
//  ===============================================================================================================
//  Classes
//  ===============================================================================================================
/**
 * Geo-info attribute class for one attribute.
 * The attributs are stores as key-value pairs.
 * Multiple keys point to the same values.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequentia arrays.
 * The sequential values would be ["a", "b"]
 * The sequentail keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMap {
    private _name: string;
    private _data_type: EAttribDataTypeStrs;
    private _data_size: number;
    private _bi_map: BiMapManyToOne<TAttribDataTypes>;
    private _num_entities: number; // The maximum number of possible entities for this attribute.
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(name: string, data_type: EAttribDataTypeStrs, data_size: number, num_entities: number) {
        this._name = name;
        this._data_type = data_type;
        this._data_size = data_size;
        this._bi_map = new BiMapManyToOne<TAttribDataTypes>();
        this._num_entities = num_entities;
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getData(): IAttribData {
        return {
            name: this._name,
            data_type: this._data_type,
            data_size: this._data_size,
            data: this._bi_map.getData()
        };
    }
    /**
     * Returns the number of entities for this attribute .
     */
    public getNumEntities(): number {
        return this._num_entities;
    }
    /**
     * Adds entities to this attribute from JSON data.
     * The existing attribute data in the model is not deleted.
     * @param attrib_data The JSON data for the new entities.
     */
    public addEntities(attrib_data: IAttribData, num_entities: number): void {
        if (this._name !== attrib_data.name ||
            this._data_type !== attrib_data.data_type ||
            this._data_size !== attrib_data.data_size) {
            throw Error('Attributes do not match.');
        }
        // increment all the keys by the number of entities in the existing data
        attrib_data.data.forEach( keys_value => {
            keys_value[0] = keys_value[0].map(key => key + this._num_entities);
        });
        // add the data with the new keys to the map
        this._bi_map.addData(attrib_data.data);
        // update the total number of entities
        this._num_entities += num_entities;
    }
    /**
     * Sets a single attribute value.
     * @param key
     * @param value
     */
    public set(key: number, value: TAttribDataTypes): void {
        this._bi_map.set(key, value);
    }
    /**
     * Gets a single attribute value.
     * @param key
     */
    public get(key: number): TAttribDataTypes {
        return this._bi_map.getValue(key);
    }
    /**
     * Executes a query
     * @param value_str The string version of the value.
     * @param index The index of the value
     * @param operator The operator, ==, !=, <=, >=, etc
     */
    public queryValueStr(value_str: string, operator: EQueryOperatorTypes, index?: number): number[] {
        if (index === null || index === undefined) {
            switch (operator) {
                // ==
                case EQueryOperatorTypes.IS_EQUAL:
                    return this._bi_map.getKeysFromValueStr(value_str);
                // !=
                case EQueryOperatorTypes.IS_NOT_EQUAL:
                    const keys_equal: number[] = this._bi_map.getKeysFromValueStr(value_str);
                    const keys_not_equal: number[] = [];
                    this._bi_map.keys().forEach( key => {
                        if (keys_equal.indexOf(key) === -1) {
                            keys_not_equal.push(key);
                        }
                    });
                    return keys_not_equal;
                // >
                case EQueryOperatorTypes.IS_GREATER:
                    throw new Error('IS_GREATER Not implemented');
                // >=
                case EQueryOperatorTypes.IS_GREATER_OR_EQUAL:
                    throw new Error('IS_GREATER_OR_EQUAL Not implemented');
                // <
                case EQueryOperatorTypes.IS_LESS:
                    throw new Error('IS_LESS Not implemented');
                // <=
                case EQueryOperatorTypes.IS_LESS_OR_EQUAL:
                    throw new Error('IS_LESS_OR_EQUAL Not implemented');
                default:
                    throw new Error('Query operator not found.');
            }
        }
        // TODO
        // keys = [];
        // this.values().forEach( value_from_map => {
        //     if (JSON.stringify( value_from_map[index]) === value_str) {
        //         keys.push(...this.getKeys(value_from_map));  // THIS IS AN UGLY HACK :(:(:( TODO...
        //     }
        // });
        // return keys;
        throw new Error('Queries with indexes not implemented');
    }
    /**
     * Gets a list of all the attribute keys, in sequential order.
     * The key vaues are mapped.
     * The key value gets maped to the new list position.
     * The key index gets mapped to the new value.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail keys would be [1,0,,0,1].
     */
    public getSeqKeys(): number[] {
        const seqKeys = [];
        this._bi_map.getData().forEach( (keys_value, index) => keys_value[0].forEach( key => seqKeys[key] = index ) );
        return seqKeys;
    }
    /**
     * Gets a list of all the unique attribute values.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the values would be ['a', 'b']
     */
    public getValues(): TAttribDataTypes[] {
        return this._bi_map.values();
    }
    /**
     * Gets a list of all the attribute values, in sequential order.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['b','a',,'a','b']
     */
    public getSeqValues(): TAttribDataTypes[] {
        const values: TAttribDataTypes[] = this._bi_map.values();
        return this.getSeqKeys().map(key => values[key]);
    }
}
