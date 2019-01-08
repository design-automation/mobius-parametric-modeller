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
 * @param origin The id of an face
 * @param dir_vec
 * @returns The face plane.
 */
export function Ray(__model__: GIModel, origin: TId|Txyz, dir_vec: Txyz): TRay {
    // --- Error Check ---

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
 * @param origin The id of an face
 * @param x_vec
 * @param xy_vec
 * @returns The face plane.
 */
export function Plane(__model__: GIModel, origin: TId|Txyz, x_vec: Txyz, xy_vec: Txyz): TPlane {
    // --- Error Check ---

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
 * @param plane
 * @returns The face plane.
 */
export function RayFromPlane(plane: TPlane): TRay {
    // --- Error Check ---

    // --- Error Check ---
    return [plane[0], vecCross(plane[1], plane[2])];
}
// Add, Sub, Div, Mult Vectors, these should be inline functions

/**
 * Returns a vector along an edge.
 * @param __model__
 * @param edge The id of an edge
 * @returns The vector from the start point of an edge to the end point of an edge
 */
export function GetVector(__model__: GIModel, edge_id: TId): Txyz {
    // --- Error Check ---

    // --- Error Check ---
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(edge_id);
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type_str, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecSub(end, start);
}

/**
 * Calculates the normal of a list of positions, a wire, a closed polyline, a surface, or a plane.
 * @param __model__
 * @param geometry A polygon, a face, a closed polyline, or or closed wire.
 * @returns Vector.
 * @example normal1 = calc.Normal (geometry)
 * @example_info If the input is non-planar, the output vector will be an average of all normal vector of the triangulated surfaces.
 */
export function GetNormal(__model__: GIModel, geometry: TId): Txyz {
    // --- Error Check ---
    const fn_name = 'calc.Area';
    checkIDs(fn_name, 'geometry', geometry, ['isID'], ['PGON', 'FACE', 'PLINE', 'WIRE']);
    // --- Error Check ---
    const [_, index]: [EEntityTypeStr, number] = idBreak(geometry);
    if (isPgon(geometry) || isFace(geometry)) {
        // faces, these are already triangulated
        let face_i: number = index;
        if (isPgon(geometry)) {
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
    } else if (isPline(geometry) || isWire(geometry)) {
        // wires, these need to be triangulated
        let wire_i: number = index;
        if (isPline(geometry)) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        }
        if (__model__.geom.query.istWireClosed(wire_i)) {
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

