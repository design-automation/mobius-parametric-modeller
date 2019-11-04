/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, getArrDepth, isVert, isPosi, isPoint } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot, vecNorm } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { area } from '@libs/geom/triangle';
import { checkIDs, checkCommTypes, IDcheckObj, TypeCheckObj} from '../_check_args';
import __ from 'underscore';
import * as THREE from 'three';
import { sum } from '@assets/core/inline/_mathjs';
import { min, max } from '@assets/core/inline/_math';
import { arrMakeFlat } from '@assets/libs/util/arrs';


// ================================================================================================
/**
 * xxx
 * ~
 * @param __model__
 * @param origins The origins of teh rays
 * @param directions The direction vectors
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param method Enum; raytracing method
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is [10,20].
 */
export function Raytrace(__model__: GIModel, origins: Txyz|Txyz[], directions: Txyz|Txyz[],
        entities: TId|TId[]|TId[][], limits: number|[number, number], method: _ERaytraceMethod): number[]|number[][] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Raytrace';
    const ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    // TODO
    // TODO
    // --- Error Check ---
    const origins_tjs: THREE.Vector3[] = _origins_tjs(__model__, origins);
    const directions_tjs: THREE.Vector3[] = _directions_tjs(__model__, directions);
    const meshes_tjs: THREE.Mesh[] = _meshes_tjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    return _raytrace(origins_tjs, directions_tjs, meshes_tjs, limits, method);
}
function _origins_tjs(__model__: GIModel, origins: Txyz|Txyz[]): THREE.Vector3[] {
    origins = Array.isArray(origins[0]) ? origins as Txyz[] : [origins] as Txyz[];
    return origins.map(origin => new THREE.Vector3(...origin));
}
function _directions_tjs(__model__: GIModel, directions: Txyz|Txyz[]): THREE.Vector3[] {
    directions = Array.isArray(directions[0]) ? directions as Txyz[] : [directions] as Txyz[];
    for (let i = 0; i < directions.length; i++) {
        directions[i] = vecNorm(directions[i]);
    }
    return directions.map(direction => new THREE.Vector3(...direction));
}
function _meshes_tjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh[] {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach( ent_posi_i => posis_i_set.add(ent_posi_i) );
    }
    // create tjs vectors for each posi and save them in a sparse array
    // the index to the array is the posi_i
    const posis_tjs: THREE.Vector3[] = [];
    for (const posi_i of Array.from(posis_i_set)) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        const posi_tjs = new THREE.Vector3(...xyz);
        posis_tjs[posi_i] = posi_tjs;
    }
    // get an array of all the faces
    const faces_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case EEntType.FACE:
                faces_i.push(ent_i);
                break;
            default:
                const coll_faces_i: number[] = __model__.geom.query.navAnyToFace(ent_type, ent_i);
                coll_faces_i.forEach( coll_face_i => faces_i.push(coll_face_i) );
                break;
        }
    }
    // create tjs meshes
    const meshes_tjs: THREE.Mesh[] = [];
    for (const face_i of faces_i) {
        // create the tjs geometry
        const geom_tjs = new THREE.Geometry();
        const tris_i: number[] = __model__.geom.query.navFaceToTri(face_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.TRI, tri_i);
            // add the three vertices to the geometry
            const a: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[0]]) - 1;
            const b: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[1]]) - 1;
            const c: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[2]]) - 1;
            // add the tjs tri to the geometry
            geom_tjs.faces.push( new THREE.Face3( a, b, c ) );
        }
        // create the mesh, assigning the material
        meshes_tjs.push( new THREE.Mesh(geom_tjs, mat_tjs) );
    }
    // return an array of meshes
    return meshes_tjs;
}
export enum _ERaytraceMethod {
    HIT_COUNT = 'hit_count',
    MISS_COUNT = 'miss_count',
    AVG_DIST = 'avg_distance',
    MIN_DIST = 'min_distance',
    MAX_DIST = 'max_distance',
    DIST_LIST = 'dist_list',
    ENTS_LIST = 'ents_list'
}
function _raytrace(origins_tjs: THREE.Vector3[], directions_tjs: THREE.Vector3[], meshes_tjs: THREE.Mesh[],
        limits: [number, number], method: _ERaytraceMethod): number[]|number[][] {
    const result = [];
    for (const origin_tjs of origins_tjs) {
        let result_count = 0;
        const result_dists: number[] = [];
        const result_ents: THREE.Object3D[] = [];
        for (const direction_tjs of directions_tjs) {
            const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, direction_tjs, limits[0], limits[1]);
            const isects: THREE.Intersection[] = ray_tjs.intersectObjects(meshes_tjs, false);
            // distance – distance between the origin of the ray and the intersection
            // point – point of intersection, in world coordinates
            // face – intersected face
            // faceIndex – index of the intersected face
            // object – the intersected object
            // uv - U,V coordinates at point of intersection
            // uv2 - Second set of U,V coordinates at point of intersection
            switch (method) {
                case _ERaytraceMethod.HIT_COUNT:
                    if (isects.length > 0) {
                        result_count += 1;
                    }
                    break;
                case _ERaytraceMethod.MISS_COUNT:
                    if (isects.length === 0) {
                        result_count += 1;
                    }
                    break;
                case _ERaytraceMethod.AVG_DIST:
                case _ERaytraceMethod.MIN_DIST:
                case _ERaytraceMethod.MAX_DIST:
                case _ERaytraceMethod.DIST_LIST:
                    if (isects.length > 0) {
                        result_dists.push(isects[0]['distance']);
                    }
                    break;
                case _ERaytraceMethod.ENTS_LIST:
                    if (isects.length > 0) {
                        result_ents.push(isects[0]['object']);
                    }
                    break;
            }
        }
        switch (method) {
            case _ERaytraceMethod.HIT_COUNT:
            case _ERaytraceMethod.MISS_COUNT:
                result.push(result_count);
                break;
            case _ERaytraceMethod.AVG_DIST:
                result.push(sum(result_dists) / result_dists.length);
                break;
            case _ERaytraceMethod.MIN_DIST:
                result.push(min(result_dists));
                break;
            case _ERaytraceMethod.MAX_DIST:
                result.push(max(result_dists));
                break;
            case _ERaytraceMethod.DIST_LIST:
                    result.push(result_dists);
                break;
            case _ERaytraceMethod.ENTS_LIST:
                throw new Error('Not implemented');
                break;
        }
    }
    return result;
}
