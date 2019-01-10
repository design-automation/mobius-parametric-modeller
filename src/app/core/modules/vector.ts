import { TId, Txyz, TEdge, EEntStrToAttribMap, EEntityTypeStr, TPlane, TRay } from '@libs/geo-info/common';
import { checkCommTypes, checkIDnTypes, checkIDs } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idBreak, isPline, isWire, isPgon, isFace } from '@libs/geo-info/id';
import { vecSub, vecMakeOrtho, vecNorm, vecCross, vecAdd, vecDiv } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { normal } from '@libs/geom/triangle';

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
// Add, Sub, Div, Mult Vectors, these should be inline functions

/**
 * Returns a vector along an edge.
 * @param __model__
 * @param edge An edge
 * @returns The vector from the start point of an edge to the end point of an edge
 */
export function GetVector(__model__: GIModel, edge: TId): Txyz {
    // --- Error Check ---
    checkIDs('vector.GetVector', 'edge', edge, ['isID'], ['EDGE']);
    // --- Error Check ---
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(edge);
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type_str, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecSub(end, start);
}
/**
 * Calculates the normal of a list of positions, a wire, a closed polyline, a surface, or a plane.
 * @param __model__
 * @param entity A polygon, a face, a closed polyline, or or closed wire.
 * @returns Vector.
 * @example normal1 = calc.Normal (geometry)
 * @example_info If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.
 */
export function GetNormal(__model__: GIModel, entity: TId): Txyz {
    // --- Error Check ---
    const fn_name = 'vector.GetNormal';
    checkIDs(fn_name, 'entity', entity, ['isID'], ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    const [_, index]: [EEntityTypeStr, number] = idBreak(entity);
    if (isPgon(entity) || isFace(entity)) {
        // faces, these are already triangulated
        let face_i: number = index;
        if (isPgon(entity)) {
            face_i = __model__.geom.query.navPgonToFace(index);
        }
        const tris_i: number[] = __model__.geom.query.navFaceToTri(face_i);
        let normal_vec: Txyz = [0, 0, 0];
        for (const tri_i of tris_i) {
            const corners_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.TRI, tri_i);
            const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.attribs.query.getPosiCoords(corner_i));
            const tri_normal: Txyz = normal( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2], true);
            normal_vec = vecAdd(normal_vec, tri_normal);
        }
        return vecNorm(vecDiv(normal_vec, tris_i.length));
    } else if (isPline(entity) || isWire(entity)) {
        // wires, these need to be triangulated
        let wire_i: number = index;
        if (isPline(entity)) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        }
        if (!__model__.geom.query.istWireClosed(wire_i)) {
            throw new Error(fn_name + ': ' + 'To calculate normals, wire must be closed');
        }
        const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.WIRE, index);
        const xyzs:  Txyz[] = posis_i.map( posi_i => __model__.attribs.query.getPosiCoords(posi_i) );
        const tris: number[][] = triangulate(xyzs);
        let normal_vec: Txyz = [0, 0, 0];
        for (const tri of tris) {
            const corners_xyzs: Txyz[] = tri.map(corner_i => xyzs[corner_i]);
            const tri_normal: Txyz = normal( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2], true );
            normal_vec = vecAdd(normal_vec, tri_normal);
        }
        return vecNorm(vecDiv(normal_vec, tris.length));
    }
}

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


// /**
//  * Gets the cross product of two vectors.
//  * @param __model__
//  * @param vector1 Vector or a list of three numbers.
//  * @param vector2 Vector or a list of three numbers.
//  * @returns The vector cross product of two vectors.
//  * @example vector3 = vec.Cross(vector1, vector2)
//  */
// export function Cross(vector1: Txyz, vector2: Txyz): Txyz {
//     // --- Error Check ---
//     const fn_name = 'vec.Cross';
//     checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
//     checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
//     // --- Error Check ---
//     return mathjs.cross(vector1, vector2);
// }
// /**
//  * Returns the dot product of two vectors.
//  * @param __model__
//  * @param vector1 Vector or a list of three numbers.
//  * @param vector2 Vector or a list of three numbers.
//  * @returns The scalar dot product of two vectors.
//  * @example vector3 = vec.Dot(vector1, vector2)
//  */
// export function Dot(vector1: Txyz, vector2: Txyz): number {
//     // --- Error Check ---
//     const fn_name = 'vec.Dot';
//     checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
//     checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
//     // --- Error Check ---
//     return mathjs.dot(vector1, vector2);
// }

