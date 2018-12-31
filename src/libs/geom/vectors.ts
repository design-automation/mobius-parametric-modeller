import * as three from 'three';
type Txyz = [number, number, number];
const EPS = 1e-6;

//  Vectors using Txyz =======================================================================================================


export function vecsSub(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    const v3: Txyz = [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2],
    ];
    if (norm) {
        this.vectorNorm(v3);
    }
    return v3;
}

export function vecsAdd(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    const v3: Txyz = [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
    ];
    if (norm) {
        this.vectorNorm(v3);
    }
    return v3;
}

export function vecsSum(vecs: Txyz[], norm: boolean = false): Txyz {
    const vec_sum: Txyz = [0, 0, 0];
    for (const vec of vecs) {
        vec_sum[0] += vec[0];
        vec_sum[1] += vec[1];
        vec_sum[2] += vec[2];
    }
    if (norm) {
        this.vectorNorm(vec_sum);
    }
    return vec_sum;
}

export function vecDiv(vec: Txyz, divisor: number): Txyz {
    return [
        vec[0] / divisor,
        vec[1] / divisor,
        vec[2] / divisor
    ];
}

export function vecMult(vec: Txyz, multiplier: number): Txyz {
    return [
        vec[0] * multiplier,
        vec[1] * multiplier,
        vec[2] * multiplier
    ];
}

export function vecsCross(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    const v3: three.Vector3 = new three.Vector3();
    v3.crossVectors(new three.Vector3(...v1), new three.Vector3(...v2));
    if (norm) {v3.normalize(); }
    return v3.toArray() as Txyz;
}

export function vecNorm(v: Txyz): Txyz {
    const length: number = this.vectorLength(v);
    return [v[0] / length, v[1] / length, v[2] / length];
}

export function vecLen(v: Txyz): number {
    return Math.hypot(...v);
}
