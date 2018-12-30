import * as three from 'three';
type Txyz = [number, number, number];
const EPS = 1e-6;

export function distance(v1: Txyz, v2: Txyz): number {
    const vec: Txyz = [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2],
    ];
    return Math.hypot(...vec);
}
