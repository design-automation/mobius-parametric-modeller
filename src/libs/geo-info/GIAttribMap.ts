import { BiMapManyToOne } from './BiMap';
import { EAttribDataTypeStrs, TAttribDataTypes, IAttribData } from './GIJson';
//  ===============================================================================================================
//  Classes
//  ===============================================================================================================
/**
 * Geo-info attribute class.
 * The attributs are stores as key-value pairs.
 * Multiple keys point to the same values.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequentia arrays.
 * The sequential values would be ["a", "b"]
 * The sequentail keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMap {
    private name: string;
    private data_type: EAttribDataTypeStrs;
    private data_size: number;
    private bi_map: BiMapManyToOne<TAttribDataTypes>;
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(attrib_data: IAttribData) {
        this.name = attrib_data.name;
        this.data_type = attrib_data.data_type;
        this.data_size = attrib_data.data_size;
        this.bi_map = new BiMapManyToOne<TAttribDataTypes>(attrib_data.data);
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getData(): IAttribData {
        return {
            name: this.name,
            data_type: this.data_type,
            data_size: this.data_size,
            data: this.bi_map.getData()
        };
    }
    /**
     * Adds data to this attribute from JSON data.
     * The existing data in the model is not deleted.
     * @param attrib_data The JSON data.
     */
    public addData(attrib_data: IAttribData, offset: number): void {
        if (this.name !== attrib_data.name ||
            this.data_type !== attrib_data.data_type ||
            this.data_size !== attrib_data.data_size) {
            throw Error('Attributes do not match.');
        }
        attrib_data.data.forEach( keys_value => {
            keys_value[0] = keys_value[0].map(key => key + offset);
        });
        this.bi_map.addData(attrib_data.data);
    }
    /**
     * Sets a single attribute value.
     * @param key
     * @param value
     */
    public set(key: number, value: TAttribDataTypes): void {
        this.bi_map.set(key, value);
    }
    /**
     * Gets a single attribute value.
     * @param key
     */
    public get(key: number): TAttribDataTypes {
        return this.bi_map.getValue(key);
    }
    /**
     * Gets an array of keys, all of which have the same value.
     * @param value_str The string version of the value.
     * @param index
     */
    public getKeysFromValueStr(value_str: string, index: number): number[] {
        return this.bi_map.getKeysFromValueStr(value_str, index);
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
        this.bi_map.getData().forEach( (keys_value, index) => keys_value[0].forEach( key => seqKeys[key] = index ) );
        return seqKeys;
    }
    /**
     * Gets a list of all the attribute values, in sequential order.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['a', 'b']
     */
    public getSeqValues(): TAttribDataTypes[] {
        return this.bi_map.values();
    }
}
