import * as vec from '@libs/geom/vectors';
import { Txyz, TPlane } from '@assets/libs/geo-info/common';
import { getArrDepth } from '@assets/libs/util/arrs';
import { xformMatrix, multMatrix } from '@assets/libs/geom/matrix';

// export const vecAdd = vec.vecAdd;
// export const vecSub = vec.vecSub;
// export const vecDiv = vec.vecDiv;
// export const vecMult = vec.vecMult;
// export const vecSetLen = vec.vecSetLen;
// export const vecDot = vec.vecDot;
// export const vecCross = vec.vecCross;
// export const vecAng = vec.vecAng;
// export const vecFromTo = vec.vecFromTo;
// export const vecEqual = vec.vecEqual;
// export const vecAng2 = vec.vecAng2;
// export const vecRot = vec.vecRot;
// export const vecLen = vec.vecLen;
// export const vecNorm = vec.vecNorm;
// export const vecRev = vec.vecRev;

// Overloaded vector functions
// ================================================================================================
/**
 * Add multiple vectors
 * @param v 
 */
export function vecSum(debug: boolean, ...v: Txyz[]): Txyz {
    const depth1: number = getArrDepth(v);
    if (depth1 > 2) {
        // @ts-ignore
        v = v.slice().flat(depth1 - 2);
    } else if (depth1 < 2) {
        throw new Error('Error summing vectors: The vectors are bad.' + JSON.stringify(v));
    }
    // return the sum
    return vec.vecSum(v, false) as Txyz;
}
// ================================================================================================
/**
 * Adds two vectors
 * @param v1 
 * @param v2 
 * @param norm 
 */
export function vecAdd(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[], norm: boolean = false): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecAdd(v1_val as Txyz, v2 as Txyz, norm) as Txyz);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecAdd(v1 as Txyz, v2_val as Txyz, norm) as Txyz);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecAdd(v1[i] as Txyz, v2[i] as Txyz, norm) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error adding lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecAdd(v1 as Txyz, v2 as Txyz, norm) as Txyz;
}
// ================================================================================================
/**
 * Subtracts v2 from v1
 * @param v1 
 * @param v2 
 * @param norm 
 */
export function vecSub(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[], norm: boolean = false): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecSub(v1_val as Txyz, v2 as Txyz, norm) as Txyz);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecSub(v1 as Txyz, v2_val as Txyz, norm) as Txyz);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecSub(v1[i] as Txyz, v2[i] as Txyz, norm) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error adding lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecSub(v1 as Txyz, v2 as Txyz, norm) as Txyz;
}
// ================================================================================================
/**
 * Divides a vector by a numbe
 * @param v 
 * @param num 
 */
export function vecDiv(debug: boolean, v: Txyz|Txyz[], num: number|number[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    const depth2: number = getArrDepth(num);
    if (depth1 === 2 || depth2 === 1) {
        if (depth2 === 0) {
            // only vec is Txyz[]
            return (v as Txyz[]).map( v_val => vec.vecDiv(v_val as Txyz, num as number) as Txyz);
        } else if (depth1 === 1) {
            // only num is number[]
            return (num as number[]).map( num_val => vec.vecDiv(v as Txyz, num_val as number) as Txyz);
        } else {
            // vec is Txyz and num is number[], they must be equal length
            num = num as number[];
            if (v.length === num.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v.length; i++) {
                    vecs.push( vec.vecDiv(vec[i] as Txyz, num[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error dividing a lists of vectors: The list of divisors must be the same length as the list of vectors.');
            }
        }
    }
    // normal case, vec is Txyz and num is number
    return vec.vecDiv(v as Txyz, num as number) as Txyz;
}
// ================================================================================================
/**
 * Multiplies a vector by a number
 * @param v 
 * @param num 
 */
export function vecMult(debug: boolean, v: Txyz|Txyz[], num: number|number[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    const depth2: number = getArrDepth(num);
    if (depth1 === 2 || depth2 === 1) {
        if (depth2 === 0) {
            // only vec is Txyz[]
            return (v as Txyz[]).map( v_val => vec.vecMult(v_val as Txyz, num as number) as Txyz);
        } else if (depth1 === 1) {
            // only num is number[]
            return (num as number[]).map( num_val => vec.vecMult(v as Txyz, num_val as number) as Txyz);
        } else {
            // vec is Txyz and num is number[], they must be equal length
            num = num as number[];
            if (v.length === num.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v.length; i++) {
                    vecs.push( vec.vecMult(v[i] as Txyz, num[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error dividing a lists of vectors: The list of multipliers must be the same length as the list of vectors.');
            }
        }
    }
    // normal case, vec is Txyz and num is number
    return vec.vecMult(v as Txyz, num as number) as Txyz;
}
// ================================================================================================
/**
 * Sets the magnitude of a vector
 * @param v 
 * @param num 
 */
export function vecSetLen(debug: boolean, v: Txyz|Txyz[], num: number|number[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    const depth2: number = getArrDepth(num);
    if (depth1 === 2 || depth2 === 1) {
        if (depth2 === 0) {
            // only vec is Txyz[]
            return (v as Txyz[]).map( v_val => vec.vecSetLen(v_val as Txyz, num as number) as Txyz);
        } else if (depth1 === 1) {
            // only num is number[]
            return (num as number[]).map( num_val => vec.vecSetLen(v as Txyz, num_val as number) as Txyz);
        } else {
            // vec is Txyz and num is number[], they must be equal length
            num = num as number[];
            if (v.length === num.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v.length; i++) {
                    vecs.push( vec.vecSetLen(v[i] as Txyz, num[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error setting lengths for a lists of vectors: The list of vector lengths must be the same length as the list of vectors.');
            }
        }
    }
    // normal case, vec is Txyz and num is number
    return vec.vecSetLen(v as Txyz, num as number) as Txyz;
}
// ================================================================================================
/**
 * Calculates the dot product of two vectors
 * @param v1 
 * @param v2 
 */
export function vecDot(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[]): number|number[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecDot(v1_val as Txyz, v2 as Txyz) as number);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecDot(v1 as Txyz, v2_val as Txyz) as number);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const vals: number[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vals.push( vec.vecDot(v1[i] as Txyz, v2[i] as Txyz) as number );
                }
                return vals;
            } else {
                throw new Error(
                    'Error calculating dot product of two lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecDot(v1 as Txyz, v2 as Txyz) as number;
}
// ================================================================================================
/**
 * Calculates the cross product of two vectors
 * @param v1 
 * @param v2 
 */
export function vecCross(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecCross(v1_val as Txyz, v2 as Txyz) as Txyz);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecCross(v1 as Txyz, v2_val as Txyz) as Txyz);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecCross(v1[i] as Txyz, v2[i] as Txyz) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating cross product of two lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecCross(v1 as Txyz, v2 as Txyz) as Txyz;
}
// ================================================================================================
/**
 * Calculate the angle (0 to PI) between two vectors
 * @param v1 
 * @param v2 
 */
export function vecAng(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[]): number|number[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecAng(v1_val as Txyz, v2 as Txyz) as number);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecAng(v1 as Txyz, v2_val as Txyz) as number);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const angs: number[] = [];
                for (let i = 0; i < v1.length; i++) {
                    angs.push( vec.vecAng(v1[i] as Txyz, v2[i] as Txyz) as number );
                }
                return angs;
            } else {
                throw new Error(
                    'Error calculating angle between two lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecAng(v1 as Txyz, v2 as Txyz) as number;
}
// ================================================================================================
/**
 * Creates a vector between two points
 * @param xyz1 
 * @param xyz2 
 */
export function vecFromTo(debug: boolean, xyz1: Txyz|Txyz[], xyz2: Txyz|Txyz[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(xyz1);
    const depth2: number = getArrDepth(xyz2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only v1 is Txyz[]
            return (xyz1 as Txyz[]).map( v1_val => vec.vecFromTo(v1_val as Txyz, xyz2 as Txyz) as Txyz);
        } else if (depth1 === 1) {
            // only v2 is Txyz[]
            return (xyz2 as Txyz[]).map( v2_val => vec.vecFromTo(xyz1 as Txyz, v2_val as Txyz) as Txyz);
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (xyz1.length === xyz2.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < xyz1.length; i++) {
                    vecs.push( vec.vecFromTo(xyz1[i] as Txyz, xyz2[i] as Txyz) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating vectors between two between lists of coordinates: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecFromTo(xyz1 as Txyz, xyz2 as Txyz) as Txyz;
}
// ================================================================================================
/**
 * Returns true if the difference between two vectors is smaller than a specified tolerance
 * @param v1 
 * @param v2 
 * @param tol 
 */
export function vecEqual(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[], tol: number): boolean|boolean[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1 || depth2 === 1) {
            throw new Error(
                'Error calculating vector equality between multiple vectors: The two lists must be of equal length.');
        } else {
            // both v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const eq: boolean[] = [];
                for (let i = 0; i < v1.length; i++) {
                    eq.push( vec.vecEqual(v1[i] as Txyz, v2[i] as Txyz, tol) as boolean );
                }
                return eq;
            } else {
                throw new Error(
                    'Error calculating vectors between two between lists of coordinates: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecEqual(v1 as Txyz, v2 as Txyz, tol) as boolean;
}
// ================================================================================================
/**
 * Calculate the angle (0 to 2PI) between two vectors, relative to the plane normal
 * @param v1 
 * @param v2 
 * @param v3 
 */
export function vecAng2(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[], v3: Txyz|Txyz[]): number|number[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    const depth3: number = getArrDepth(v3);
    if (depth1 === 2 || depth2 === 2 || depth3 === 2) {
        if (depth2 === 1 && depth3 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecAng2(v1_val as Txyz, v2 as Txyz, v3 as Txyz) as number);
        } else if (depth1 === 1 && depth3 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecAng2(v1 as Txyz, v2_val as Txyz, v3 as Txyz) as number);
        } else if (depth1 === 1 && depth2 === 1) {
            // only v3 is Txyz[]
            return (v3 as Txyz[]).map( v3_val => vec.vecAng2(v1 as Txyz, v2 as Txyz, v3_val as Txyz) as number);
        } else if (depth1 === 1) {
            // v2 and v3 are Txyz[], they must be equal length
            if (v2.length === v3.length) {
                const angs: number[] = [];
                for (let i = 0; i < v2.length; i++) {
                    angs.push( vec.vecAng2(v1 as Txyz, v2[i] as Txyz, v3[i] as Txyz) as number );
                }
                return angs;
            } else {
                throw new Error(
                    'Error calculating angles between two between lists of vectors: The two lists must be of equal length.');
            }
        } else if (depth2 === 1) {
            // v1 and v3 are Txyz[], they must be equal length
            if (v1.length === v3.length) {
                const angs: number[] = [];
                for (let i = 0; i < v1.length; i++) {
                    angs.push( vec.vecAng2(v1[i] as Txyz, v2 as Txyz, v3[i] as Txyz) as number );
                }
                return angs;
            } else {
                throw new Error(
                    'Error calculating angles between between lists of vectors: The two lists must be of equal length.');
            }
        } else if (depth3 === 1) {
            // v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const angs: number[] = [];
                for (let i = 0; i < v1.length; i++) {
                    angs.push( vec.vecAng2(v1[i] as Txyz, v2[i] as Txyz, v3 as Txyz) as number );
                }
                return angs;
            } else {
                throw new Error(
                    'Error calculating angles between two between lists of vectors and normals: The two lists must be of equal length.');
            }
        } else {
            // all three v1 and v2 and v3 are Txyz[], they must be all equal length
            if (v1.length === v2.length && v2.length === v3.length) {
                const angs: number[] = [];
                for (let i = 0; i < v1.length; i++) {
                    angs.push( vec.vecAng2(v1[i] as Txyz, v2[i] as Txyz, v3[i] as Txyz) as number );
                }
                return angs;
            } else {
                throw new Error(
                    'Error calculating vectors between two between lists of vectors and normals: The two lists must be of equal length.');
            }
        }
    }
    // normal case, v1 and v2 and v3 are Txyz
    return vec.vecAng2(v1 as Txyz, v2 as Txyz, v3 as Txyz) as number;
}

// ================================================================================================
/**
 * Rotates one vector around another vector.
 * @param v1 
 * @param v2 
 * @param ang 
 */
export function vecRot(debug: boolean, v1: Txyz|Txyz[], v2: Txyz|Txyz[], ang: number|number[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v1);
    const depth2: number = getArrDepth(v2);
    const depth3: number = getArrDepth(ang);
    if (depth1 === 2 || depth2 === 2 || depth3 === 2) {
        if (depth2 === 1 && depth3 === 1) {
            // only v1 is Txyz[]
            return (v1 as Txyz[]).map( v1_val => vec.vecRot(v1_val as Txyz, v2 as Txyz, ang as number) as Txyz);
        } else if (depth1 === 1 && depth3 === 1) {
            // only v2 is Txyz[]
            return (v2 as Txyz[]).map( v2_val => vec.vecRot(v1 as Txyz, v2_val as Txyz, ang as number) as Txyz);
        } else if (depth1 === 1 && depth2 === 1) {
            // only ang is number[]
            return (ang as number[]).map( ang_val => vec.vecRot(v1 as Txyz, v2 as Txyz, ang_val as number) as Txyz);
        } else if (depth1 === 1) {
            // v2 is Txyz[] and ang is number[], they must be equal length
            ang = ang as number[];
            if (v2.length === ang.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v2.length; i++) {
                    vecs.push( vec.vecRot(v1 as Txyz, v2[i] as Txyz, ang[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating angles between two between lists of vectors: The two lists must be of equal length.');
            }
        } else if (depth2 === 1) {
            // v1 is Txyz[] and ang is number[], they must be equal length
            ang = ang as number[];
            if (v1.length === ang.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecRot(v1[i] as Txyz, v2 as Txyz, ang[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating angles between between lists of vectors: The two lists must be of equal length.');
            }
        } else if (depth3 === 1) {
            // v1 and v2 are Txyz[], they must be equal length
            if (v1.length === v2.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecRot(v1[i] as Txyz, v2[i] as Txyz, ang as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating angles between two between lists of vectors and normals: The two lists must be of equal length.');
            }
        } else {
            // all three v1 and v2 are Txyz[] and ang is number[], they must be all equal length
            ang = ang as number[];
            if (v1.length === v2.length && v2.length === ang.length) {
                const vecs: Txyz[] = [];
                for (let i = 0; i < v1.length; i++) {
                    vecs.push( vec.vecRot(v1[i] as Txyz, v2[i] as Txyz, ang[i] as number) as Txyz );
                }
                return vecs;
            } else {
                throw new Error(
                    'Error calculating vectors between two between lists of vectors and normals: The two lists must be of equal length.');
            }
        }
    }
    // normal case, v1 and v2 and ang are Txyz
    return vec.vecRot(v1 as Txyz, v2 as Txyz, ang as number) as Txyz;
}
// ================================================================================================
/**
 * Calculates the magnitude of a vector
 * @param v 
 */
export function vecLen(debug: boolean, v: Txyz|Txyz[]): number|number[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    if (depth1 === 2) {
        return (v as Txyz[]).map( v_val => vec.vecLen(v_val as Txyz) as number);
    }
    // normal case, vec is Txyz
    return vec.vecLen(v as Txyz) as number;
}
// ================================================================================================
/**
 * Sets the magnitude of a vector to 1
 * @param v 
 */
export function vecNorm(debug: boolean, v: Txyz|Txyz[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    if (depth1 === 2) {
        return (v as Txyz[]).map( v_val => vec.vecNorm(v_val as Txyz) as Txyz);
    }
    // normal case, vec is Txyz
    return vec.vecNorm(v as Txyz) as Txyz;
}
// ================================================================================================
/**
 * Reverses the direction of a vector
 * @param v 
 */
export function vecRev(debug: boolean, v: Txyz|Txyz[]): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    if (depth1 === 2) {
        return (v as Txyz[]).map( v_val => vec.vecRev(v_val as Txyz) as Txyz);
    }
    // normal case, vec is Txyz
    return vec.vecRev(v as Txyz) as Txyz;
}
// ================================================================================================
/**
 * Transforms a vector from a local coordinate system define by plane "p" to the global coordinate system.
 * @param v 
 * @param p 
 */
export function vecLtoG(debug: boolean, v: Txyz|Txyz[], p: TPlane|TPlane[]): Txyz|Txyz[] {
    return _vecXForm(v, p, true);
}
/**
 * Transforms a vector from the global coordinate system to a local coordinate system define by plane "p".
 * @param v 
 * @param p 
 */
export function vecGtoL(debug: boolean, v: Txyz|Txyz[], p: TPlane|TPlane[]): Txyz|Txyz[] {
    return _vecXForm(v, p, false);
}
// ================================================================================================
function _vecXForm(v: Txyz|Txyz[], p: TPlane|TPlane[], to_global: boolean): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth(v);
    const depth2: number = getArrDepth(p);
    if (depth1 === 1 && depth2 === 2) {
        // v is Txyz and p is TPlane
        return multMatrix(v as Txyz, xformMatrix(p as TPlane, to_global));
    } else if (depth1 === 2 && depth2 === 2) {
         // v is Txyz[] and p is TPlane
        const matrix = xformMatrix(p as TPlane, to_global);
        return (v as Txyz[]).map( a_v => multMatrix(a_v, matrix));
    } else if (depth1 === 1 && depth2 === 3) {
        // v is Txyz and p is TPlane[]
        const result: Txyz[] = [];
        for (const a_p of p) {
            const matrix = xformMatrix(a_p as TPlane, to_global);
            result.push(multMatrix(v as Txyz, matrix));
        }
        return result;
    } else if (depth1 === 2 && depth2 === 3) {
        // v is Txyz[] p is TPlane[], they must be equal length
        if (v.length === p.length) {
            const result: Txyz[] = [];
            for (let i = 0; i < v.length; i++) {
                const matrix = xformMatrix(p[i] as TPlane, to_global);
                result.push(multMatrix(v[i] as Txyz, matrix));
            }
            return result;
        } else {
            throw new Error(
                'Error transforming vectors: The list of vectors and list of planes must be of equal length.');
        }
    }
    throw new Error(
        'Error transforming vectors: Cannot process the input lists.');
}


