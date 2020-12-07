/**
 * Maps a number from the d1 domain to the d2 domain.
 * @param num
 * @param d1
 * @param d2
 */
export function remap(debug: boolean, num: number|number[], d1: number[], d2: number[]): number|number[] {
    if (Array.isArray(num)) { return num.map(num_val => remap(debug, num_val, d1, d2)) as number[]; }
    return ( d2[0] +
        (
            ((num - d1[0]) / (d1[1] - d1[0])) * (d2[1] - d2[0])
        )
    );
}
