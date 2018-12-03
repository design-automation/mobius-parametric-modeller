import { BiMapManyToOne } from './BiMap';
import { EAttribDataTypeStrs, TAttribDataTypes, IAttribData } from './json_data';
//  ===============================================================================================================
//  Classes
//  ===============================================================================================================
/**
 * Geo-info attribute class.
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
    constructor(attrib_data?: IAttribData) {
        if (attrib_data) {
            this.setData(attrib_data);
        }
    }
    /**
     * Sets data in this attribute from JSON data.
     * The existing data in the model is deleted.
     * @param attrib_data The JSON data.
     */
    public setData(attrib_data: IAttribData): void {
        this.name = attrib_data.name;
        this.data_type = attrib_data.data_type;
        this.data_size = attrib_data.data_size;
        this.bi_map = new BiMapManyToOne<TAttribDataTypes>(attrib_data.data);
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
        attrib_data.data.map(item => [item[0].map(i => i + offset), item[1]]);
        this.bi_map.addData(attrib_data.data);
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getData(): IAttribData {
        return {
            name: this.name,
            data_type: this.data_type,
            data_size: this.data_size,
            data: Array.from( this.bi_map.getData() )
        };
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
}
