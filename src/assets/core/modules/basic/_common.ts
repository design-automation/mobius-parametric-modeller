/**
 * Shared utility functions
 * ~
 * ~
 */

/**
 *
 */import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TRay, TEntTypeIdx, EEntTypeStr, Txy} from '@libs/geo-info/common';
import { checkArgTypes, TypeCheckObj, checkIDs, IDcheckObj} from '../_check_args';
import { getArrDepth, isColl } from '@assets/libs/geo-info/id';
import { vecDiv, vecSum, vecAvg } from '@assets/libs/geom/vectors';
import { isRay, isPlane, isVec3 } from '@assets/libs/geo-info/virtual';
import { rayFromPln } from '@assets/core/inline/_ray';
import { plnFromRay } from '@assets/core/inline/_plane';


// ================================================================================================
export function getOrigin(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): Txyz {
    if (isVec3(data)) { return data as Txyz; }
    if (isRay(data)) { return data[0] as Txyz; }
    if (isPlane(data)) { return data[0] as Txyz; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return origin as Txyz;
}
// ================================================================================================
export function getRay(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TRay {
    if (isVec3(data)) { return [data, [0, 0, 1]] as TRay; }
    if (isRay(data)) { return data as TRay; }
    if (isPlane(data)) { return rayFromPln(data as TPlane) as TRay; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]] as TRay;
}
// ================================================================================================
export function getPlane(__model__: GIModel, data: Txyz|TRay|TPlane|TId|TId[], fn_name: string): TPlane {
    if (isVec3(data)) { return [data, [1, 0, 0], [0, 1, 0]] as TPlane; }
    if (isRay(data)) { return data as TPlane; }
    if (isPlane(data)) { return plnFromRay(data as TRay) as TPlane; }
    const ents: TId|TId[] = data as TId|TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
// ================================================================================================
export function getCentoridFromEnts(__model__: GIModel, ents: TId|TId[], fn_name: string): Txyz {
    // this must be an ID or an array of IDs, so lets get the centroid
    const ent_id: TId|TId[] = origin as TId|TId[];
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'origin', ent_id,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx;
    const centroid: Txyz|Txyz[] = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid as Txyz[]) as Txyz;
    }
    return centroid as Txyz;
}
// ================================================================================================
export function getCentroid(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
        return _centroidPosis(__model__, posis_i);
    } else {
        // divide the input into posis and non posis
        ents_arr = ents_arr as TEntTypeIdx[];
        const posis_i: number[] = [];
        const np_ents_arr: TEntTypeIdx[] = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] === EEntType.POSI) {
                posis_i.push(ent_arr[1]);
            } else {
                np_ents_arr.push(ent_arr);
            }
        }
        // if we only have posis, just return one centorid
        // in all other cases return a list of centroids
        const np_cents: Txyz[] = (np_ents_arr as TEntTypeIdx[]).map( ent_arr => getCentroid(__model__, ent_arr) ) as Txyz[];
        if (posis_i.length > 0) {
            const cen_posis: Txyz = _centroidPosis(__model__, posis_i);
            if (np_cents.length === 0) {
                return cen_posis;
            } else {
                np_cents.push(cen_posis);
            }
        }
        return np_cents;
    }
}
function _centroidPosis(__model__: GIModel, posis_i: number[]): Txyz {
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}

// ================================================================================================
// ================================================================================================

