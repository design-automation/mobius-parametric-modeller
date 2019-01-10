import { TId, Txyz, EEntityTypeStr, TPlane, TRay } from '@libs/geo-info/common';
import { checkCommTypes, checkIDs } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idBreak } from '@libs/geo-info/id';
import { vecSub, vecMakeOrtho, vecNorm, vecCross, vecAdd, vecMult } from '@libs/geom/vectors';

// ================================================================================================
/**
 * Create a ray, centered at the origin.
 * @param __model__
 * @param origin Origin of Ray: Position/Vertex/Point/Coordinate
 * @param dir_vec Direction of Ray: Vector/List of three numbers
 * @returns [origin, vector]: [[x,y,z],[x',y',z']]
 */
export function Ray(__model__: GIModel, origin: TId|Txyz, dir_vec: Txyz): TRay {
    // --- Error Check ---
    const fn_name = 'vector.Ray';
    checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'dir_vec', dir_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type_str, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(dir_vec)
    ];
}
// ================================================================================================
/**
 * Create a plane, centered at the origin.
 * @param __model__
 * @param origin Origin of Plane: Position/Vertex/Point/Coordinate
 * @param x_vec First plane determining vector: Vector/List of three numbers
 * @param xy_vec Second plane determining vector: Vector/List of three numbers
 * @returns [origin, vector, vector]: [[x,y,z],[x',y',z'],[x",y",z"]]
 */
export function Plane(__model__: GIModel, origin: TId|Txyz, x_vec: Txyz, xy_vec: Txyz): TPlane {
    // --- Error Check ---
    const fn_name = 'vector.Plane';
    checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'x_vec', x_vec, ['isVector']);
    checkCommTypes(fn_name, 'xy_vec', xy_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type_str, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(x_vec),
        vecNorm(vecMakeOrtho(xy_vec, x_vec))
    ];
}
// ================================================================================================
/**
 * Create a ray, from a plane.
 * The direction will be along the z axis
 * @param __model__
 * @param plane Plane/list of list of three numbers: [origin, vector, vector]
 * @returns Ray Normal to the plane at plane origin [origin, vector]: [[x,y,z],[x',y',z']]
 */
export function RayFromPlane(plane: TPlane): TRay {
    // --- Error Check ---
    checkCommTypes('vector.RayFromPlane', 'origin', origin, ['isOrigin']);
    // --- Error Check ---
    return [plane[0], vecCross(plane[1], plane[2])];
}
// ================================================================================================
/**
 * Returns a plane of a face.
 * @param __model__
 * @param edge The id of an face
 * @returns The face plane.
 */
export function GetRay(__model__: GIModel, edge: TId): TPlane {
    // --- Error Check ---
    checkIDs('vector.GetRay', 'edge', edge, ['isID'], ['EDGE']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
/**
 * Returns a plane of a face.
 * @param __model__
 * @param face The id of an face
 * @returns The face plane.
 */
export function GetPlane(__model__: GIModel, face: TId): TPlane {
    // --- Error Check ---
    checkIDs('vector.GetPlane', 'face', face, ['isID'], ['FACE']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
// ================================================================================================
/**
 * Visualises a ray by adding geometry to the model.
 * @param __model__
 * @param ray A list of two list of three coordinates [origin, vector]: [[x,y,z],[x',y',z']]
 * @returns A points and a line representing the ray. (The point is tha start point of the ray.)
 * @example ray1 = util.RayGeom([[1,2,3],[0,0,1]])
 */
export function VisRay(__model__: GIModel, ray: TRay, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'make.RayGeom';
    checkCommTypes(fn_name, 'ray', ray, ['isRay']);
    checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
    const origin: Txyz = ray[0];
    const vec: Txyz = vecMult(ray[1], scale);
    const end: Txyz = vecAdd(origin, vec);
    // create orign point
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create pline
    const end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(end_posi_i, end);
    const pline_i = __model__.geom.add.addPline([origin_posi_i, end_posi_i]);
    // return the geometry IDs
    return [EEntityTypeStr.POINT + point_i, EEntityTypeStr.PLINE + pline_i];
}
// ================================================================================================
/**
 * Visualises a plane by adding geometry to the model.
 * @param __model__
 * @param plane A list of lists
 * @returns A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)
 * @example plane1 = util.PlaneGeom(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function VisPlane(__model__: GIModel, plane: TPlane, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'make.PlaneGeom';
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
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create the x axis
    const x_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(x_end_posi_i, x_end);
    const x_pline_i = __model__.geom.add.addPline([origin_posi_i, x_end_posi_i]);
    // create the y axis
    const y_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(y_end_posi_i, y_end);
    const y_pline_i = __model__.geom.add.addPline([origin_posi_i, y_end_posi_i]);
    // create pline for plane
    const corner_posis_i: number[] = [];
    for (const corner of plane_corners) {
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setPosiCoords(posi_i, corner);
        corner_posis_i.push(posi_i);
    }
    const plane_i = __model__.geom.add.addPline(corner_posis_i, true);
    // return the geometry IDs
    return [
        EEntityTypeStr.POINT + point_i,
        EEntityTypeStr.PLINE + x_pline_i, EEntityTypeStr.PLINE + y_pline_i,
        EEntityTypeStr.PLINE + plane_i
    ];
}
// ================================================================================================
