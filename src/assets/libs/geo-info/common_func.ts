/**
 * Makes a deep clone of map where keys are integers and values are arrays of integers.
 * @param map
 */
export function cloneDeepMapArr(map: Map<number, number[]>): Map<number, number[]> {
    const new_map: Map<number, number[]> = new Map();
    map.forEach( (value, key) => {
        new_map.set(key, value.slice());
    });
    return new_map;
}
