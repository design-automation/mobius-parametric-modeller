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
        const old_value: V = this.kv_map.get(key);
        const old_value_str: string = JSON.stringify(old_value);
        const new_value_str: string = JSON.stringify(value);
        // add the key to the vk_map
        if (!this.vk_map.has(new_value_str)) {
            this.vk_map.set(new_value_str, [key]);
        } else {
            if (this.vk_map.get(new_value_str).indexOf(key) === -1) {
                this.vk_map.get(new_value_str).push(key);
            }
        }
        // remove the key from the old vk_map
        if (this.vk_map.has(old_value_str)) {
            const keys: number[] = this.vk_map.get(old_value_str);
            const index = keys.indexOf(key, 0);
            if (index > -1) {
                keys.splice(index, 1);
            }
            // if nothing left, then delete the whole old_value_str from map
            if (keys.length === 0) {
                this.vk_map.delete(old_value_str);
            }
        }
        // set the kv_map
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
    // /**
    //  * Returns an array of keys that point to this value.
    //  * @param value The string version of the value.
    //  */
    // public getKeysFromValueStr(value_str: string): number[] {
    //     return this.vk_map.get(value_str);
    // }
    /**
     * Returns the value to which this key points.
     * @param key
     */
    public getValue(key: number): V {
        const result: V = this.kv_map.get(key); // TODO clone arrays
        return result;
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
