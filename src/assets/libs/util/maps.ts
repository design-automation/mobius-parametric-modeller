/**
 * Sort Map by Key, return a Sorted Map
 * @param unsortedMap
 */
export function sortByKey(unsortedMap) {
    const keys = [];
    const sortedMap = new Map();

    unsortedMap.forEach((value, key) => {
        keys.push(key);
    });

    keys.sort((a, b) => {
        const x = Number(a.substr(2)), y = Number(b.substr(2));
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }).map(function(key) {
        sortedMap.set(key, unsortedMap.get(key));
    });
    return sortedMap;
}
