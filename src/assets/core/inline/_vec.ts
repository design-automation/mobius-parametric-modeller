import * as vec from '@libs/geom/vectors';
import { Txyz } from '@assets/libs/geo-info/common';
import { getArrDepth2 } from '@assets/libs/util/arrs';

// export const vecAdd = vec.vecAdd;
export const vecSub = vec.vecSub;
export const vecDiv = vec.vecDiv;
export const vecMult = vec.vecMult;
export const vecLen = vec.vecLen;
export const vecSetLen = vec.vecSetLen;
export const vecNorm = vec.vecNorm;
export const vecRev = vec.vecRev;
export const vecFromTo = vec.vecFromTo;
export const vecAng = vec.vecAng;
export const vecAng2 = vec.vecAng2;
export const vecDot = vec.vecDot;
export const vecCross = vec.vecCross;
export const vecRot = vec.vecRot;
export const vecEqual = vec.vecEqual;

// this is an overloaded version of the vec add function
// the same approach can be implemented for the other functions
// impact on performance?

export function vecAdd(v1: Txyz|Txyz[], v2: Txyz|Txyz[], norm: boolean = false): Txyz|Txyz[] {
    // overloaded case
    const depth1: number = getArrDepth2(v1);
    const depth2: number = getArrDepth2(v2);
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
                throw new Error('Error adding lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both v1 and v2 are Txyz
    return vec.vecAdd(v1 as Txyz, v2 as Txyz, norm) as Txyz;
}
