import { TId, Txyz, EEntType, TPlane, TRay, TEntTypeIdx } from '@libs/geo-info/common';
import { checkCommTypes, checkIDs } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idsMake, idsBreak, getArrDepth } from '@libs/geo-info/id';
import { vecSub, vecMakeOrtho, vecNorm, vecCross, vecAdd, vecMult, vecFromTo, vecDiv, newellNorm, vecSum } from '@libs/geom/vectors';
import { _normal } from './calc';

// ================================================================================================
/**
 * Creates a ray, centered at the origin.
 * A ray is defined by a list of two lists, as follows: [origin, direction_vector].
 * @param __model__
 * @param origin Origin of ray: Position, Vertex, Point, or a list of three numbers
 * @param dir_vec Direction of Ray: Vector, or list of three numbers
 * @returns [origin, vector]: [[x,y,z],[x',y',z']]
 * @example virtual.Ray([1,2,3],[4,3,2])
 * @example_info Creates a ray from [1,2,3] with the vector [4,3,2].
 *
 */

export function Ray(__model__: GIModel, origin: TId|Txyz, dir_vec: Txyz): TRay {
    // --- Error Check ---
    const fn_name = 'virtual.Ray';
    const ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'dir_vec', dir_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type, index]: [EEntType, number] = ents_arr as [EEntType, number];
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(dir_vec)
    ];
}
// ================================================================================================
/**
 * Creates a plane, centered at the origin.
 * A plane is define by a list of three lists, as folows: [origin, x_vector, y_vector].
 * @param __model__
 * @param origin Origin of plane: Position, Vertex, Point, or a list of three numbers
 * @param x_vec X vector of the plane: List of three numbers
 * @param xy_vec A vector in the xy plane (parallel to teh x vector): List of three numbers
 * @returns [origin, vector, vector]: [[x,y,z],[x',y',z'],[x",y",z"]]
 * @example virtual.Plane ([1,2,3],[4,3,2],[3,3,9])
 * @example_info Creates a plane with its origin positioned at [1,2,3] and two vectors [4,3,2] and [3,3,9] lie on it.
 */

export function Plane(__model__: GIModel, origin: TId|Txyz, x_vec: Txyz, xy_vec: Txyz): TPlane {
    // --- Error Check ---
    const fn_name = 'virtual.Plane';
    const ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'x_vec', x_vec, ['isVector']);
    checkCommTypes(fn_name, 'xy_vec', xy_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type, index]: [EEntType, number] = ents_arr as [EEntType, number];
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(x_vec),
        vecNorm(vecMakeOrtho(xy_vec, x_vec))
    ];
}
// ================================================================================================
function _rayFromPlane(planes: TPlane|TPlane[]): TRay|TRay[] {
    if (getArrDepth(planes) === 2) {
        const plane: TPlane = planes as TPlane;
        return [plane[0], vecCross(plane[1], plane[2])];
    } else {
        return (planes as TPlane[]).map( plane => _rayFromPlane(plane)) as TRay[];
    }
}
/**
 * Create a ray, from a plane.
 * The direction will be along the z axis.
 * A plane is define by a list of three lists, as folows: [origin, x_vector, y_vector].
 * A ray is defined by a list of two lists, as follows: [origin, direction_vector].
 * @param __model__
 * @param plane Plane or list of planes.
 * @returns Ray or list of rays.
 */
export function RayFromPlane(plane: TPlane|TPlane[]): TRay|TRay[] {
    // --- Error Check ---
    checkCommTypes('virtual.RayFromPlane', 'origin', plane, ['isPlane']);
    // TODO allow list of planes
    // --- Error Check ---
    return _rayFromPlane(plane);
}
// ================================================================================================
function _getRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TRay|TRay[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const xyzs: Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
        return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _getRay(__model__, ent_arr)) as TRay[];
    }
}
/**
 * Returns a plane of a face.
 * @param __model__
 * @param edge The id of an edge
 * @returns The face plane.
 */
export function GetRay(__model__: GIModel, edge: TId|TId[]): TRay|TRay[] {
    // --- Error Check ---
    const ents_arr = checkIDs('virtual.GetRay', 'edge', edge, ['isID'], ['EDGE']) as TEntTypeIdx|TEntTypeIdx[]; 
    // TODO allow list of edges
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
// ================================================================================================
function _getPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TPlane|TPlane[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const unique_posis_i = Array.from(new Set(posis_i));
        if (unique_posis_i.length < 3) { throw new Error('Too few points to calculate plane.'); }
        const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
        const origin: Txyz = vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
        // const normal: Txyz = newellNorm(unique_xyzs);
        const normal: Txyz = _normal(__model__, ent_arr) as Txyz; // TODO
        const x_vec: Txyz = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
        const y_vec: Txyz = vecCross(x_vec, normal);
        return [origin, x_vec, y_vec] as TPlane;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _getPlane(__model__, ent_arr)) as TPlane[];
    }
}
/**
 * Returns a plane from a set of positions.
 * @param __model__
 * @param entities Any entities
 * @returns The plane.
 */
export function GetPlane(__model__: GIModel, entities: TId|TId[]): TPlane|TPlane[] {
    // --- Error Check ---
    const ents_arr =  checkIDs('virtual.GetPlane', 'entities', entities, ['isID', 'isIDList'], null); // takes in any
    // TODO ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    return _getPlane(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}
// ================================================================================================
/**
 * Visualises a ray by adding geometry to the model.
 * @param __model__
 * @param ray A list of two list of three coordinates [origin, vector]: [[x,y,z],[x',y',z']]
 * @returns A points and a line representing the ray. (The point is tha start point of the ray.)
 * @example ray1 = virtual.visRay([[1,2,3],[0,0,1]])
 */
export function VisRay(__model__: GIModel, ray: TRay, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'virtual.visRay';
    checkCommTypes(fn_name, 'ray', ray, ['isRay']);
    checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
    const origin: Txyz = ray[0];
    const vec: Txyz = vecMult(ray[1], scale);
    const end: Txyz = vecAdd(origin, vec);
    // create orign point
    const origin_posi_i: number = __model__.geom.add.addPosi();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create pline
    const end_posi_i: number = __model__.geom.add.addPosi();
    __model__.attribs.add.setPosiCoords(end_posi_i, end);
    const pline_i = __model__.geom.add.addPline([origin_posi_i, end_posi_i]);
    // return the geometry IDs
    return [
        idsMake([EEntType.POINT, point_i]),
        idsMake([EEntType.PLINE, pline_i])
    ] as TId[];
}
// ================================================================================================
/**
 * Visualises a plane by adding geometry to the model.
 * @param __model__
 * @param plane A list of lists
 * @returns A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)
 * @example plane1 = virtual.visPlane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function VisPlane(__model__: GIModel, plane: TPlane, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'virtual.visPlane';
    checkCommTypes(fn_name, 'plane', plane, ['isPlane']);
    checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
    const origin: Txyz = plane[0];
    const x_vec: Txyz = vecMult(plane[1], scale);
    const y_vec: Txyz = vecMult(plane[2], scale);
    let x_end: Txyz = vecAdd(origin, x_vec);
    let y_end: Txyz = vecAdd(origin, y_vec);
    const plane_corners: Txyz[] = [
        vecAdd(x_end, y_vec),
        vecSub(y_end, x_vec),
        vecSub(vecSub(origin, x_vec), y_vec),
        vecSub(x_end, y_vec),
    ];
    x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
    y_end = vecSub(y_end, vecMult(y_vec, 0.1));
    // create the point
    const origin_posi_i: number = __model__.geom.add.addPosi();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create the x axis
    const x_end_posi_i: number = __model__.geom.add.addPosi();
    __model__.attribs.add.setPosiCoords(x_end_posi_i, x_end);
    const x_pline_i = __model__.geom.add.addPline([origin_posi_i, x_end_posi_i]);
    // create the y axis
    const y_end_posi_i: number = __model__.geom.add.addPosi();
    __model__.attribs.add.setPosiCoords(y_end_posi_i, y_end);
    const y_pline_i = __model__.geom.add.addPline([origin_posi_i, y_end_posi_i]);
    // create pline for plane
    const corner_posis_i: number[] = [];
    for (const corner of plane_corners) {
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, corner);
        corner_posis_i.push(posi_i);
    }
    const plane_i = __model__.geom.add.addPline(corner_posis_i, true);
    // return the geometry IDs
    return [
        idsMake([EEntType.POINT, point_i]),
        idsMake([EEntType.PLINE, x_pline_i]),
        idsMake([EEntType.PLINE, y_pline_i]),
        idsMake([EEntType.PLINE, plane_i])
    ] as TId[];
}
// ================================================================================================
