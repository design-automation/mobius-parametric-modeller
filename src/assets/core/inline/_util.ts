export function isApprox(n1: number, n2: number, t: number) {
    return Math.abs(n1 - n2) < t;
}
export function isIn(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 < v2 && v2 < v3;
}
export function isWithin(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 <= v2 && v2 <= v3;
}
