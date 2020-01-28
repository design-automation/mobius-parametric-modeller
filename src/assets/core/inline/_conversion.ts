export function radToDeg(rad: number|number[]): number|number[] {
    if (Array.isArray(rad)) { return rad.map(rad_val => radToDeg(rad_val)) as number[]; }
    return rad * (180 / Math.PI);
}
export function degToRad(deg: number|number[]): number|number[] {
    if (Array.isArray(deg)) { return deg.map(deg_val => degToRad(deg_val)) as number[]; }
    return deg * (Math.PI / 180);
}
