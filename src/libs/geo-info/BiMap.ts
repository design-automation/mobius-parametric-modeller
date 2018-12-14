/**
 * A bi-directional map that stores many-to-one key value mappings.
 * Multiple keys point to the same value.
 * Both the keys and values must be unique.
 * The keys are integers, the values can be any type.
 */
export class BiMapManyToOne<V> {
    private readonly kv_map = new Map<number, V>();
    private readonly vk_map = new Map<string, number[]>();
    /**
     * Creates a new bi-directional many-to-one map.
     * If the data is provided, it will be added to the map.
     * @param data
     */
    constructor(data?: Array<[number[], V]>) {
        if (data) {
            this.addData(data);
        }
    }
    /**
     * Populate the data in this map with an array.
     * For example, [[1,3], 'a'],[[0,4], 'b']
     * @param data
     */
    public addData(data: Array<[number[], V]>): void {
        data.forEach(keys_value => {
            keys_value[0].forEach(key => this.set(key, keys_value[1]));
        });
    }
    /**
     * Set a single key-value pair.
     * @param key
     * @param value
     */
    public set(key: number, value: V): void {
        const value_str: string = JSON.stringify(value);
        if (!this.vk_map.has(value_str)) {
            this.vk_map.set(value_str, [key]);
        } else {
            if (this.vk_map.get(value_str).indexOf(key) === -1) {
                this.vk_map.get(value_str).push(key);
            }
        }
        this.kv_map.set(key, value);
    }
    /**
     * Returns an array of all values.
     */
    public values(): Array<V> {
        return Array.from(this.kv_map.values());
    }
    /**
     * Returns an array of all keys.
     */
    public keys(): number[] {
        return Array.from(this.kv_map.keys());
    }
    /**
     * Returns an array of keys that point to this value.
     * @param value
     */
    public getKeys(value: V): number[] {
        const value_str: string = JSON.stringify(value);
        return this.vk_map.get(value_str);
    }
    /**
     * Returns an array of keys that point to this value.
     * @param value The string version of the value.
     */
    public getKeysFromValueStr(value_str: string, index: number): number[] {
        let keys: number[];
        if (index < 0) {
            keys = this.vk_map.get(value_str);
            if (!keys) { keys = []; }
            return keys;
        }
        // the value has an index
        keys = [];
        this.values().forEach( value_from_map => {
            if (JSON.stringify( value_from_map[index]) === value_str) {
                keys.push(...this.getKeys(value_from_map));  // THIS IS AN UGLY HACK :(:(:( TODO...
            }
        });
        return keys;
    }
    /**
     * Returns the value to which this key points.
     * @param key
     */
    public getValue(key: number): V {
      return this.kv_map.get(key);
    }
    /**
     * Returns true if the map contains the key.
     * @param key
     */
    public hasKey(key: number): boolean {
        return this.kv_map.has(key);
    }
    /**
     * Returns true if the map contains the value.
     * @param value
     */
    public hasValue(value: V): boolean {
        const value_str: string = JSON.stringify(value);
        return this.vk_map.has(value_str);
    }
    /**
     * Returns true if the map contains the value.
     * @param value_str The string version of the value.
     */
    public hasValueStrValue(value_str: string): boolean {
        return this.vk_map.has(value_str);
    }
    /**
     * Total number of keys.
     */
    public numKeys(): number {
        return this.kv_map.size;
    }
    /**
     * Total number of values.
     */
    public numValues(): number {
        return this.vk_map.size;
    }
    /**
     * Return a a data array.
     * For example, [[1,3], 'a'],[[0,4], 'b']
     */
    public getData(): Array<[number[], V]> {
        const data: Array<[number[], V]> = [];
        this.vk_map.forEach( (keys, value_str) => {
            const value = JSON.parse(value_str); // TODO This is not good <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            data.push([keys, value]);
        });
        return data;
    }
}
