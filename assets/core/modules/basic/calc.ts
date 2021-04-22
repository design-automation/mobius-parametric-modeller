/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';

import * as chk from '../../_check_types';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane, TBBox, Txy } from '@libs/geo-info/common';
import { idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot, vecNorm, vecSetLen } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { area } from '@libs/geom/triangle';
import uscore from 'underscore';
import { getCentroid, getCenterOfMass } from './_common';
import { rayFromPln } from '@assets/core/inline/_ray';
import { isEmptyArr, arrMakeFlat, arrMaxDepth, getArrDepth } from '@assets/libs/util/arrs';

// ================================================================================================
export enum _EDistanceMethod {
    PS_PS_DISTANCE = 'ps_to_ps_distance',
    PS_E_DISTANCE = 'ps_to_e_distance',
    PS_W_DISTANCE = 'ps_to_w_distance',
}
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum; distance method.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
 */
export function Distance(__model__: GIModel, entities1: TId|TId[], entities2: TId|TId[], method: _EDistanceMethod): number|number[] {
    if (isEmptyArr(entities1)) { return []; }
    if (isEmptyArr(entities2)) { return []; }
    if (Array.isArray(entities1)) { entities1 = arrMakeFlat(entities1); }
    entities2 = arrMakeFlat(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1: TEntTypeIdx|TEntTypeIdx[];
    let ents_arr2: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr1 = checkIDs(__model__, fn_name, 'entities1', entities1, [ID.isID, ID.isIDL1],
            null)  as TEntTypeIdx|TEntTypeIdx[];
        ents_arr2 = checkIDs(__model__, fn_name, 'entities2', entities2, [ID.isIDL1],
            null) as TEntTypeIdx[];
    } else {
        ents_arr1 = idsBreak(entities1)  as TEntTypeIdx|TEntTypeIdx[];
        ents_arr2 = idsBreak(entities2) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i: number|number[];
    if (arrMaxDepth(ents_arr1) === 1 && ents_arr1[0] === EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    } else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1 as TEntTypeIdx[]) {
            if (ent_type === EEntType.POSI) {
                from_posis_i.push(ent_i);
            } else {
                const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    from_posis_i.push(ent_posi_i);
                }
            }
        }
    }
    // get the to ent_type
    let to_ent_type: number;
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            to_ent_type = EEntType.POSI;
            break;
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            to_ent_type = EEntType.EDGE;
            break;
        default:
            break;
    }
    // get the ents and posis sets
    const set_to_ents_i: Set<number> = new Set();
    let set_to_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr2 as TEntTypeIdx[]) {
        // ents
        if (ent_type === to_ent_type) {
            set_to_ents_i.add(ent_i);
        } else {
            const sub_ents_i: number[] = __model__.modeldata.geom.nav.navAnyToAny(ent_type, to_ent_type, ent_i);
            for (const sub_ent_i of sub_ents_i) {
                set_to_ents_i.add(sub_ent_i);
            }
        }
        // posis
        if (to_ent_type !== EEntType.POSI) {
            const sub_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
            for (const sub_posi_i of sub_posis_i) {
                set_to_posis_i.add(sub_posi_i);
            }
        }
    }
    // create an array of to_ents
    const to_ents_i: number[] = Array.from(set_to_ents_i);
    // cerate a posis xyz map
    const map_posi_i_xyz: Map<number, Txyz> = new Map();
    if (to_ent_type === EEntType.POSI) { set_to_posis_i = set_to_ents_i; }
    for (const posi_i of set_to_posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_xyz.set(posi_i, xyz);
    }
    // calc the distance
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            return _distanceManyPosisToPosis(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            return _distanceManyPosisToEdges(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        default:
            break;
    }
}
function _distanceManyPosisToPosis(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
    map_posi_i_xyz: Map<number, Txyz>, method: _EDistanceMethod): number|number[] {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i as number;
        return _distancePstoPs(__model__, from_posi_i, to_ents_i, map_posi_i_xyz) as number;
    } else  {
        from_posi_i = from_posi_i as number[];
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        return from_posi_i.map( one_from => _distanceManyPosisToPosis(__model__, one_from, to_ents_i,
            map_posi_i_xyz, method) ) as number[];
    }
}
// function _distanceManyPosisToWires(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
//         method: _EDistanceMethod): number|number[] {
//     if (!Array.isArray(from_posi_i)) {
//         from_posi_i = from_posi_i as number;
//         return _distancePstoW(__model__, from_posi_i, to_ents_i) as number;
//     } else  {
//         from_posi_i = from_posi_i as number[];
//         // TODO This can be optimised
//         // There is some vector stuff that gets repeated for each posi to line dist calc
//         return from_posi_i.map( one_from => _distanceManyPosisToWires(__model__, one_from, to_ents_i, method) ) as number[];
//     }
// }
function _distanceManyPosisToEdges(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
        map_posi_i_xyz: Map<number, Txyz>, method: _EDistanceMethod): number|number[] {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i as number;
        return _distancePstoE(__model__, from_posi_i, to_ents_i, map_posi_i_xyz) as number;
    } else  {
        from_posi_i = from_posi_i as number[];
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        // Adjacent edges could be calculated once only
        return from_posi_i.map( one_from => _distanceManyPosisToEdges(__model__, one_from, to_ents_i,
            map_posi_i_xyz, method) ) as number[];
    }
}
function _distancePstoPs(__model__: GIModel, from_posi_i: number, to_posis_i: number[],
        map_posi_i_xyz: Map<number, Txyz>): number {
    const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    // loop, measure dist
    for (const to_posi_i of to_posis_i) {
        // get xyz
        const to_xyz: Txyz = map_posi_i_xyz.get(to_posi_i);
        // calc dist
        const dist: number = _distancePointToPoint(from_xyz, to_xyz);
        if (dist < min_dist) { min_dist = dist; }
    }
    return min_dist;
}
// function _distancePstoW(__model__: GIModel, from_posi_i: number, to_wires_i: number[]): number {
//     const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
//     let min_dist = Infinity;
//     const map_posi_xyz: Map<number, Txyz> = new Map();
//     for (const wire_i of to_wires_i) {
//         // get the posis
//         const to_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
//         // if closed, add first posi to end
//         if (__model__.modeldata.geom.query.isWireClosed(wire_i)) { to_posis_i.push(to_posis_i[0]); }
//         // add the first xyz to the list, this will be prev
//         let prev_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(to_posis_i[0]);
//         map_posi_xyz.set(to_posis_i[0], prev_xyz);
//         // loop, measure dist
//         for (let i = 1; i < to_posis_i.length; i++) {
//             // get xyz
//             const curr_posi_i: number = to_posis_i[i];
//             let curr_xyz: Txyz = map_posi_xyz.get(curr_posi_i);
//             if (curr_xyz === undefined) {
//                 curr_xyz = __model__.modeldata.attribs.posis.getPosiCoords(curr_posi_i);
//                 map_posi_xyz.set(curr_posi_i, curr_xyz);
//             }
//             // calc dist
//             const dist: number = _distancePointToLine(from_xyz, prev_xyz, curr_xyz);
//             if (dist < min_dist) { min_dist = dist; }
//             // next
//             prev_xyz = curr_xyz;
//         }
//     }
//     return min_dist;
// }
function _distancePstoE(__model__: GIModel, from_posi_i: number, to_edges_i: number[],
        map_posi_i_xyz: Map<number, Txyz>): number {
    const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    for (const edge_i of to_edges_i) {
        // get the posis
        const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyz_start: Txyz = map_posi_i_xyz.get(edge_posis_i[0]);
        const xyz_end: Txyz = map_posi_i_xyz.get(edge_posis_i[1]);
        // calc dist
        const dist: number = _distancePointToLine(from_xyz, xyz_start, xyz_end);
        if (dist < min_dist) { min_dist = dist; }
    }
    return min_dist;
}
function _distancePointToPoint(from: Txyz, to: Txyz) {
    const a: number = from[0] - to[0];
    const b: number = from[1] - to[1];
    const c: number = from[2] - to[2];
    return Math.sqrt(a * a + b * b + c * c);
}
function _distancePointToLine(from: Txyz, start: Txyz, end: Txyz) {
    const vec_from: Txyz = vecFromTo(start, from);
    const vec_line: Txyz = vecFromTo(start, end);
    const len: number = vecLen(vec_line);
    const vec_line_norm = vecDiv(vec_line, len);
    const dot: number = vecDot(vec_from, vec_line_norm);
    if (dot <= 0) {
        return  _distancePointToPoint(from, start);
    } else if (dot >= len) {
        return  _distancePointToPoint(from, end);
    }
    const close: Txyz = vecAdd(start, vecSetLen(vec_line, dot));
    return _distancePointToPoint(from, close);
}
// ================================================================================================
/**
 * Calculates the length of an entity.
 *
 * The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
 * This includes polylines, polygons, faces, and collections.
 *
 * Given a list of edges, wires, or polylines, a list of lengths are returned.
 *
 * Given any types of entities from which wires can be extracted, a list of lengths are returned.
 * For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
 *
 * @param __model__
 * @param entities Single or list of edges or wires or other entities from which wires can be extracted.
 * @returns Lengths, a number or list of numbers.
 * @example length1 = calc.Length(line1)
 */
export function Length(__model__: GIModel, entities: TId|TId[]): number|number[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Length';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
        [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _length(__model__, ents_arr);
}
function _length(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            return _edgeLength(__model__, index);
        } else if (ent_type === EEntType.WIRE) {
            return _wireLength(__model__, index);
        } else if (ent_type === EEntType.PLINE) {
            const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            return wires_i.map( wire_i => _wireLength(__model__, wire_i) ) as number[];
        }
    } else {
        const lengths: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _length(__model__, ents_arr) ) as number[]|number[][];
        return uscore.flatten(lengths);
    }
}
function _edgeLength(__model__: GIModel, edge_i: number): number {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
    const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
    return distance(xyz_0, xyz_1);
}
function _wireLength(__model__: GIModel, wire_i: number): number {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i]);
        const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i + 1]);
        dist += distance(xyz_0, xyz_1);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[posis_i.length - 1]);
        const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        dist += distance(xyz_0, xyz_1);
    }
    return dist;
}
// ================================================================================================
/**
 * Calculates the area of en entity.
 *
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 *
 * Given a list of entities, a list of areas are returned.
 *
 * @param __model__
 * @param entities Single or list of polygons, closed polylines, closed wires, collections.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__: GIModel, entities: TId|TId[]): number|number[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Area';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1],
        [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _area(__model__, ents_arr);
}
function _area(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, ent_i]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.PGON) {
            // faces, these are already triangulated
            const tris_i: number[] = __model__.modeldata.geom.nav_tri.navPgonToTri(ent_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
                if (corners_i.length !== 3) { continue; } // two or more verts have same posi, so area is 0
                const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.modeldata.attribs.posis.getPosiCoords(corner_i));
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2] );
                total_area += tri_area;
            }
            return total_area;
        } else if (ent_type === EEntType.PLINE || ent_type === EEntType.WIRE) {
            // wires, these need to be triangulated
            let wire_i: number = ent_i;
            if (ent_type === EEntType.PLINE) {
                wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
            }
            if (!__model__.modeldata.geom.query.isWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, ent_i);
            const xyzs:  Txyz[] = posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i) );
            const tris: number[][] = triangulate(xyzs);
            let total_area = 0;
            for (const tri of tris) {
                const corners_xyzs: Txyz[] = tri.map(corner_i => xyzs[corner_i]);
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2] );
                total_area += tri_area;
            }
            return total_area;
        } else {
            return 0;
        }
    } else {
        const areas: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _area(__model__, ents_arr) ) as number[]|number[][];
        return uscore.flatten(areas);
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 *
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 *
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
export function Vector(__model__: GIModel, entities: TId|TId[]): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1],
        [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.EDGE]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
function _vector(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
            const start: Txyz = __model__.modeldata.attribs.posis.getVertCoords(verts_i[0]);
            const end: Txyz = __model__.modeldata.attribs.posis.getVertCoords(verts_i[1]);
            // if (!start || !end) { console.log(">>>>", verts_i, start, end, __model__.modeldata.geom._geom_maps); }
            return vecSub(end, start);
        } else {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const edges_arrs: TEntTypeIdx[] = edges_i.map(edge_i => [EEntType.EDGE, edge_i] as [EEntType, number]);
            return edges_arrs.map( edges_arr => _vector(__model__, edges_arr) ) as Txyz[];
        }
    } else {
        const vectors_arrs: Txyz[]|Txyz[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _vector(__model__, ents_arr) ) as Txyz[]|Txyz[][];
        const all_vectors: Txyz[] = [];
        for (const vectors_arr of vectors_arrs) {
            if (getArrDepth(vectors_arr) === 1) {
                all_vectors.push(vectors_arr as Txyz);
            } else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr as Txyz);
                }
            }
        }
        return all_vectors;
    }
}
// ================================================================================================
export enum _ECentroidMethod {
    PS_AVERAGE = 'ps_average',
    CENTER_OF_MASS = 'center_of_mass'
}
/**
 * Calculates the centroid of an entity.
 *
 * If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
 *
 * If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 *
 * Given a list of entities, a list of centroids will be returned.
 *
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__: GIModel, entities: TId|TId[], method: _ECentroidMethod): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    switch (method) {
        case _ECentroidMethod.PS_AVERAGE:
            return getCentroid(__model__, ents_arrs);
        case _ECentroidMethod.CENTER_OF_MASS:
            return getCenterOfMass(__model__, ents_arrs);
        default:
            break;
    }
}

// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
 * by the specified scale factor.
 *
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
 *
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 *
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 *
 * For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
 *
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 *
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 *
 * If the normal cannot be calculated, [0, 0, 0] will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
export function Normal(__model__: GIModel, entities: TId|TId[], scale: number): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as  TEntTypeIdx|TEntTypeIdx[];
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
export function _normal(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], scale: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type: EEntType = (ents_arr as TEntTypeIdx)[0];
        const index: number = (ents_arr as TEntTypeIdx)[1];
        if (ent_type === EEntType.PGON) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getPgonNormal(index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === EEntType.PLINE) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getWireNormal(__model__.modeldata.geom.nav.navPlineToWire(index));
            return vecMult(norm_vec, scale);
        } else if (ent_type === EEntType.WIRE) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getWireNormal(index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === EEntType.EDGE) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navEdgeToVert(index);
            const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
            const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
            return vecMult(norm_vec, scale);
        } else if (ent_type === EEntType.VERT) {
            const norm_vec: Txyz = _vertNormal(__model__, index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === EEntType.POSI) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
                const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
                return vecMult(norm_vec, scale);
            }
            return [0, 0, 0];
        }  else if (ent_type === EEntType.POINT) {
            return [0, 0, 0];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _normal(__model__, ent_arr, scale)) as Txyz[];
    }
}
function _vertNormal(__model__: GIModel, index: number) {
    let norm_vec: Txyz;
    const edges_i: number[] = __model__.modeldata.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
        const posis1_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[1]);
        const p_mid: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[0]);
        const p_b: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis1_i[1]);
        norm_vec = vecCross( vecFromTo(p_mid, p_a), vecFromTo(p_mid, p_b), true);
        if (vecLen(norm_vec) > 0) { return norm_vec; }
    }
    const wire_i: number = __model__.modeldata.geom.nav.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.modeldata.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 *
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * evaluating at t=0 gives that xyz at the start,
 * evaluating at t=0.5 gives the xyz halfway along the polyline,
 * evaluating at t=1 gives the xyz at the end of the polyline.
 *
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 *
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 *
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example coord1 = calc.Eval (polyline1, 0.23)
 */
export function Eval(__model__: GIModel, entities: TId|TId[], t_param: number): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1 ],
            [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
function _eval(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], t_param: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.PLINE) {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges: number = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists: number[] = [];
            const xyz_pairs: Txyz[][] = [];
            for (const edge_i of edges_i) {
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
                const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                const dist: number = distance(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped: number = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair: Txyz[] = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) { dist_a = dists[i - 1]; }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return vecAdd( xyz_pair[0], vecMult(vecSub(xyz_pair[1], xyz_pair[0]), vec_len) );
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            const wires_arrs: TEntTypeIdx[] = wires_i.map(wire_i => [EEntType.WIRE, wire_i] as [EEntType, number]);
            return wires_arrs.map( wires_arr => _eval(__model__, wires_arr, t_param) ) as Txyz[];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _eval(__model__, ent_arr, t_param) ) as Txyz[];
    }
}
// ================================================================================================
/**
 * Returns a ray for an edge or a polygons.
 *
 * For edges, it returns a ray along the edge, from the start vertex to the end vertex
 *
 * For a polygon, it returns the ray that is the z-axis of the plane.
 *
 * For an edge, the ray vector is not normalised. For a polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a wirea polygon, or a list.
 * @returns The ray.
 */
export function Ray(__model__: GIModel, entities: TId|TId[]): TRay|TRay[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Ray';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
function _getRayFromEdge(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs: Txyz[] = posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
}
function _getRayFromPgon(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const plane: TPlane = _getPlane(__model__, ent_arr) as TPlane;
    return rayFromPln(false, plane) as TRay;
}
function _getRayFromEdges(__model__: GIModel, ent_arr: TEntTypeIdx): TRay[] {
    const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_arr[0], ent_arr[1]);
    return edges_i.map( edge_i => _getRayFromEdge(__model__, [EEntType.EDGE, edge_i]) ) as TRay[];
}
function _getRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TRay|TRay[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (ent_arr[0] === EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.PLINE || ent_arr[0] === EEntType.WIRE ) {
            return _getRayFromEdges(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.PGON) {
            return _getRayFromPgon(__model__, ent_arr);
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _getRay(__model__, ent_arr)) as TRay[];
    }
}
// ================================================================================================
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 *
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities
 * @returns The plane.
 */
export function Plane(__model__: GIModel, entities: TId|TId[]): TPlane|TPlane[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Plane';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1, ID.isIDL2], null) as TEntTypeIdx|TEntTypeIdx[]; // takes in any
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _getPlane(__model__, ents_arr);
}
function _getPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TPlane|TPlane[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const unique_posis_i = Array.from(new Set(posis_i));
        if (unique_posis_i.length < 3) { throw new Error('Too few points to calculate plane.'); }
        const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const origin: Txyz = vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
        // const normal: Txyz = newellNorm(unique_xyzs);
        const normal: Txyz = _normal(__model__, ent_arr, 1) as Txyz;
        const x_vec: Txyz = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
        const y_vec: Txyz = vecCross(normal, x_vec); // must be z-axis, x-axis
        return [origin, x_vec, y_vec] as TPlane;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _getPlane(__model__, ent_arr)) as TPlane[];
    }
}
// ================================================================================================
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 *
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 *
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
export function BBox(__model__: GIModel, entities: TId|TId[]): TBBox {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'calc.BBox';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null) as TEntTypeIdx[]; // all
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
function _getBoundingBox(__model__: GIModel, ents_arr: TEntTypeIdx[]): TBBox {
    const posis_set_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    const corner_min: Txyz = [Infinity, Infinity, Infinity];
    const corner_max: Txyz = [-Infinity, -Infinity, -Infinity];
    for (const unique_xyz of unique_xyzs) {
        if (unique_xyz[0] < corner_min[0]) { corner_min[0] = unique_xyz[0]; }
        if (unique_xyz[1] < corner_min[1]) { corner_min[1] = unique_xyz[1]; }
        if (unique_xyz[2] < corner_min[2]) { corner_min[2] = unique_xyz[2]; }
        if (unique_xyz[0] > corner_max[0]) { corner_max[0] = unique_xyz[0]; }
        if (unique_xyz[1] > corner_max[1]) { corner_max[1] = unique_xyz[1]; }
        if (unique_xyz[2] > corner_max[2]) { corner_max[2] = unique_xyz[2]; }
    }
    return [
        [(corner_min[0] + corner_max[0]) / 2, (corner_min[1] + corner_max[1]) / 2, (corner_min[2] + corner_max[2]) / 2],
        corner_min,
        corner_max,
        [corner_max[0] - corner_min[0], corner_max[1] - corner_min[1], corner_max[2] - corner_min[2]]
    ];
}
// ================================================================================================
// /**
//  * Calculates the distance between a ray or plane and a list of positions.
//  *
//  * @param __model__
//  * @param ray_or_plane Ray or a plane.
//  * @param entities A position or list of positions.
//  * @param method Enum; all_distances or min_distance.
//  * @returns Distance, or list of distances.
//  * @example distance1 = virtual.Distance(ray, positions, all_distances)
//  * @example_info Returns a list of distances between the ray and each position.
//  */
// export function Distance(__model__: GIModel, ray_or_plane: TRay|TPlane, entities: TId|TId[], method: _EDistanceMethod): number|number[] {
//     // --- Error Check ---
//     const fn_name = 'virtual.Distance';
//     checkCommTypes(fn_name, 'ray_or_plane', ray_or_plane, [TypeCheckObj.isRay, TypeCheckObj.isPlane]);
//     const ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
//         [EEntType.POSI]) as TEntTypeIdx|TEntTypeIdx[];
//     // --- Error Check ---
//     const one_posi: boolean = getArrDepth(ents_arr) === 1;
//     // get the to posis_i
//     let posis_i: number|number[] = null;
//     if (one_posi) {
//         posis_i = ents_arr[1] as number;
//     } else {
//         posis_i = (ents_arr as TEntTypeIdx[]).map( ent_arr => ent_arr[1] ) as number[];
//     }
//     // get a list of distances
//     let dists: number|number[] = null;
//     if (ray_or_plane.length === 2) { // ray
//         const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray_or_plane[0]), new THREE.Vector3(...ray_or_plane[1]));
//         dists = _distanceRaytoP(__model__, ray_tjs, posis_i);
//     } else if (ray_or_plane.length === 3) { // plane
//         const plane_normal: Txyz = vecCross(ray_or_plane[1], ray_or_plane[2]);
//         const plane_tjs: THREE.Plane = new THREE.Plane();
//         plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...ray_or_plane[0]) );
//         dists = _distancePlanetoP(__model__, plane_tjs, posis_i);
//     }
//     // return either the min or the whole list
//     if (method === _EDistanceMethod.MIN_DISTANCE && !one_posi) {
//         return Math.min(...dists as number[]);
//     }
//     return dists;
// }
// function _distanceRaytoP(__model__: GIModel, ray_tjs: THREE.Ray, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return ray_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distanceRaytoP(__model__, ray_tjs, posi_i) ) as number[];
//     }
// }
// function _distancePlanetoP(__model__: GIModel, plane_tjs: THREE.Plane, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return plane_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distancePlanetoP(__model__, plane_tjs, posi_i) ) as number[];
//     }
// }
// export enum _EDistanceMethod {
//     ALL_DISTANCES = 'all_distances',
//     MIN_DISTANCE = 'min_distance'
// }
