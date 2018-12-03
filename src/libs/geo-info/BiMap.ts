
/**
 * A bi-directional map that stores many-to-one key value mappings.
 * Both the keys and values must be unique.
 * The keys are integers, the values can be any type.
 */
export class BiMapManyToOne<V> {
    private readonly kv_map = new Map<number, V>();
    private readonly vk_map = new Map<V, number[]>();

    constructor(data?: Array<[number[], V]>) {
        if (data) {
            this.setData(data);
        }
    }

    public setData(data: Array<[number[], V]>): void {
        data.forEach(keys_value => {
            this.vk_map.set(keys_value[1], keys_value[0]);
            keys_value[0].forEach(key => this.kv_map.set(key, keys_value[1]));
        });
    }

    public set(key: number, value: V): void {
        if (!this.vk_map.has(value)) {
            this.vk_map.set(value, [key]);
        } else {
            if (this.vk_map.get(value).indexOf(key) === -1) {
                this.vk_map.get(value).push(key);
            }
        }
        this.kv_map.set(key, value);
    }

    public keysArrays(): Array<number[]> {
        return Array.from(this.vk_map.values());
    }

    public values(): Array<V> {
        return Array.from(this.vk_map.keys());
    }

    public keys(): number[] {
        return Array.from(this.kv_map.keys());
    }

    public getValue(key: number): V {
      return this.kv_map.get(key);
    }

    public getKeys(value: V): number[] {
      return this.vk_map.get(value);
    }

    public hasKey(key: number): boolean {
        return this.kv_map.has(key);
    }

    public hasValue(value: V): boolean {
        return this.vk_map.has(value);
    }

    public numKeys(): number {
        return this.kv_map.size;
    }

    public numValues(): number {
        return this.vk_map.size;
    }

    public getData(): Array<[number[], V]> {
        return Array.from(this.vk_map).map(value_keys => [value_keys[1], value_keys[0]]) as Array<[number[], V]>;
    }

    public addData(data: Array<[number[], V]>): void {
        data.forEach( keys_value => keys_value[0].forEach( key => this.set(key, keys_value[1])));
    }


}
