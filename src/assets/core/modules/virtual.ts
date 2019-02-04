/**
 * The `virtual` module has functions for creating virtual geometric constructs.
 * They are called 'virtual' due to the fact that they are not saved in the model.
 * Currently there are two types of virtual constructs: planes and rays.
 * Most of these functions neither make nor modify anything in the model.
 * The exception is the `Vis` functions, that generate some polylines and polygons in the model
 * to aid with visualizing these virtual constructs.
 */

/**
 *
 */

import { TId, Txyz, EEntType, TPlane, TRay, TEntTypeIdx, TBBox } from '@libs/geo-info/common';
import { checkCommTypes, checkIDs } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idsMake, idsBreak, getArrDepth } from '@libs/geo-info/id';
import { vecSub, vecMakeOrtho, vecNorm, vecCross, vecAdd, vecMult, vecFromTo, vecDiv, newellNorm, vecSum } from '@libs/geom/vectors';
import { _normal } from './calc';

// ================================================================================================
/**
 * Creates a ray, centered at the origin.
 * A ray is defined by a list of two lists, as follows: [origin, direction_vector].
 *
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
 *
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
 *
 * @param __model__
 * @param plane Plane or list of planes.
 * @returns Ray or list of rays.
 */
export function RayFromPlane(planes: TPlane|TPlane[]): TRay|TRay[] {
    // --- Error Check ---
    // checkCommTypes('virtual.RayFromPlane', 'origin', planes, ['isPlane']); //TODO accept a list of planes
    // TODO allow list of planes
    // --- Error Check ---
    return _rayFromPlane(planes);
}
// ================================================================================================
function _getRayFromEdge(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs: Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
    return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
}
function _getRayFromFace(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const plane: TPlane = _getPlane(__model__, ent_arr) as TPlane;
    return _rayFromPlane(plane) as TRay;
}
function _getRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TRay|TRay[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (ent_arr[0] === EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.FACE) {
            return _getRayFromFace(__model__, ent_arr);
        } else { // must be a polygon
            const face_i: number = __model__.geom.query.navPgonToFace(ent_arr[1]);
            return _getRayFromFace(__model__, [EEntType.FACE, face_i]);
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _getRay(__model__, ent_arr)) as TRay[];
    }
}
/**
 * Returns a ray for an edge, a face, or a polygons. For edges, it returns a ray along the edge, from teh start vertex to the end vertex
 * For a face or polygon, it returns the ray that is the z-axis of the plane.
 * ~
 * For an edge, the ray vector is not normalised. For a face or polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a face, or a polygon, or a list.
 * @returns The ray.
 */
export function GetRay(__model__: GIModel, entities: TId|TId[]): TRay|TRay[] {
    // --- Error Check ---
    const ents_arr = checkIDs('virtual.GetRay', 'entities', entities,
        ['isID', 'isIDList'], ['EDGE', 'FACE', 'PGON']) as TEntTypeIdx|TEntTypeIdx[];
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
        const normal: Txyz = _normal(__model__, ent_arr) as Txyz;
        const x_vec: Txyz = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
        const y_vec: Txyz = vecCross(normal, x_vec); // must be z-axis, x-axis
        return [origin, x_vec, y_vec] as TPlane;
    } else {
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _getPlane(__model__, ent_arr)) as TPlane[];
    }
}
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 * ~
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
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
function _getBoundingBox(__model__: GIModel, ents_arr: TEntTypeIdx[]): TBBox {
    const posis_set_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i));
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
        [corner_max[0] - corner_min[0], corner_max[1] + corner_min[1], corner_max[2] + corner_min[2]]
    ];
}
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
export function GetBBox(__model__: GIModel, entities: TId|TId[]): TBBox {
    if (!Array.isArray(entities)) { entities = [entities]; }
    // --- Error Check ---
    const ents_arr: TEntTypeIdx[] = checkIDs('virtual.BBox', 'entities', entities, ['isIDList'], null) as TEntTypeIdx[]; // all
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
// ================================================================================================
function _visRay(__model__: GIModel, rays: TRay|TRay[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(rays) === 2) {
        const ray: TRay = rays as TRay;
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
            [EEntType.POINT, point_i],
            [EEntType.PLINE, pline_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const ray of rays) {
            const ray_ents: TEntTypeIdx[] = _visRay(__model__, ray as TRay, scale);
            for (const ray_ent of ray_ents) {
                ents_arr.push(ray_ent);
            }
        }
        return ents_arr;
    }
}
/**
 * Visualises a ray by adding geometry to the model.
 *
 * @param __model__
 * @param ray A list of two list of three coordinates [origin, vector]: [[x,y,z],[x',y',z']]
 * @returns A points and a line representing the ray. (The point is tha start point of the ray.)
 * @example ray1 = virtual.visRay([[1,2,3],[0,0,1]])
 */
export function VisRay(__model__: GIModel, ray: TRay|TRay[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'virtual.visRay';
    // checkCommTypes(fn_name, 'ray', ray, ['isRay']); // TODO rays can be a list
    checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
   return idsMake(_visRay(__model__, ray, scale)) as TId[];
}
// ================================================================================================
function _visPlane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(planes) === 2) {
        const plane: TPlane = planes as TPlane;
        const origin: Txyz = plane[0];
        const x_vec: Txyz = vecMult(plane[1], scale);
        const y_vec: Txyz = vecMult(plane[2], scale);
        let x_end: Txyz = vecAdd(origin, x_vec);
        let y_end: Txyz = vecAdd(origin, y_vec);
        const z_end: Txyz = vecAdd(origin, vecMult(vecCross(x_vec, y_vec), 0.1));
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
        // create the z axis
        const z_end_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.geom.add.addPline([origin_posi_i, z_end_posi_i]);
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
            [EEntType.POINT, point_i],
            [EEntType.PLINE, x_pline_i],
            [EEntType.PLINE, y_pline_i],
            [EEntType.PLINE, z_pline_i],
            [EEntType.PLINE, plane_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const plane of planes) {
            const plane_ents: TEntTypeIdx[] = _visPlane(__model__, plane as TPlane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
/**
 * Visualises a plane by adding geometry to the model.
 *
 * @param __model__
 * @param plane A list of lists
 * @returns A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)
 * @example plane1 = virtual.visPlane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function VisPlane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'virtual.visPlane';
    // checkCommTypes(fn_name, 'planes', planes, ['isPlane']); // TODO planes can be a list
    checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
    return idsMake(_visPlane(__model__, planes, scale)) as TId[];
}
// ================================================================================================
function _visBBox(__model__: GIModel, bboxs: TBBox|TBBox[]): TEntTypeIdx[] {
    if (getArrDepth(bboxs) === 2) {
        const bbox: TBBox = bboxs as TBBox;
        const min: Txyz = bbox[1];
        const max: Txyz = bbox[2];
        // bottom
        const ps0: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps0, min);
        const ps1: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps1, [max[0], min[1], min[2]]);
        const ps2: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps2, [max[0], max[1], min[2]]);
        const ps3: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps3, [min[0], max[1], min[2]]);
        // top
        const ps4: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps4, [min[0], min[1], max[2]]);
        const ps5: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps5, [max[0], min[1], max[2]]);
        const ps6: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps6, max);
        const ps7: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps7, [min[0], max[1], max[2]]);
        // plines bottom
        const pl0 = __model__.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.geom.add.addPline([ps3, ps7]);
        // return
        return [pl0, pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11].map(pl => [EEntType.PLINE, pl]) as TEntTypeIdx[];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const bbox of bboxs) {
            const bbox_ents: TEntTypeIdx[] = _visBBox(__model__, bbox as TBBox);
            for (const bbox_ent of bbox_ents) {
                ents_arr.push(bbox_ent);
            }
        }
        return ents_arr;
    }
}
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bbox A list of lists.
 * @returns Twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function visBBox(__model__: GIModel, bbox: TBBox|TBBox): TId[] {
    // --- Error Check ---
    const fn_name = 'virtual.visBBox';
    // checkCommTypes(fn_name, 'bbox', bbox, ['isBBox']); // TODO bboxs can be a list
    // --- Error Check ---
    return  idsMake(_visBBox(__model__, bbox)) as TId[];
}
// ================================================================================================
