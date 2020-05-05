import { TRay, TPlane, TBBox } from './common';

// ============================================================================


export function isXYZ(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (typeof item !== 'number') { return false; }
    }
    return true;
}
export function isRay(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 2) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
export function isPlane(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
export function isBBox(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 4) { return false; }
    for (const item of data) {
        if (!isXYZ(item)) { return false; }
    }
    return true;
}
