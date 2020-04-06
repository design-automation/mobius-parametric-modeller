/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane, Txy, XYPLANE, EAttribDataTypeStrs } from '@libs/geo-info/common';
import { isPline, isWire, isEdge, isPgon, isFace, getArrDepth, isVert, isPosi, isPoint, idsMakeFromIndicies } from '@libs/geo-info/id';
import { distance } from '@libs/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot, vecNorm, vecAng2 } from '@libs/geom/vectors';
import { triangulate } from '@libs/triangulate/triangulate';
import { area } from '@libs/geom/triangle';
import { checkIDs, checkArgTypes, IDcheckObj, TypeCheckObj} from '../_check_args';
import __ from 'underscore';
import * as THREE from 'three';
import { sum } from '@assets/core/inline/_mathjs';
import { min, max } from '@assets/core/inline/_math';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { degToRad } from '@assets/core/inline/_conversion';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { XAXIS, YAXIS, ZAXIS } from '@assets/libs/geom/constants';
import cytoscape from 'cytoscape';
import { DEFAULT_SCROLL_TIME } from '@angular/cdk/scrolling';

// ================================================================================================
// utility function
// ----
// here are three different version of the function to create the threejs mesh, used for raycasting
// the first creates multiple meshes, the second one big mesh, the third one big buffered mesh
// performance tests are not very clear, in theory the big buffered mesh should be faster,
// but it seems that is not the case, the big non-buffered mesh seems faster
// so for now that is the one that is being used
// ----
function _createMeshesTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh[] {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
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
                const coll_faces_i: number[] = __model__.geom.nav.navAnyToFace(ent_type, ent_i);
                coll_faces_i.forEach( coll_face_i => faces_i.push(coll_face_i) );
                break;
        }
    }
    // create tjs meshes
    const meshes_tjs: THREE.Mesh[] = [];
    for (const face_i of faces_i) {
        // create the tjs geometry
        const geom_tjs = new THREE.Geometry();
        const tris_i: number[] = __model__.geom.nav.navFaceToTri(face_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.TRI, tri_i);
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
    return meshes_tjs;
}
function _createMeshTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
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
                const coll_faces_i: number[] = __model__.geom.nav.navAnyToFace(ent_type, ent_i);
                coll_faces_i.forEach( coll_face_i => faces_i.push(coll_face_i) );
                break;
        }
    }
    // create tjs meshes
    const geom_tjs = new THREE.Geometry();
    for (const face_i of faces_i) {
        // create the tjs geometry
        const tris_i: number[] = __model__.geom.nav.navFaceToTri(face_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.TRI, tri_i);
            // add the three vertices to the geometry
            const a: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[0]]) - 1;
            const b: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[1]]) - 1;
            const c: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[2]]) - 1;
            // add the tjs tri to the geometry
            geom_tjs.faces.push( new THREE.Face3( a, b, c ) );
        }
        // create the mesh, assigning the material
    }
    return new THREE.Mesh(geom_tjs, mat_tjs);
}
function _createMeshBufTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach( ent_posi_i => posis_i_set.add(ent_posi_i) );
    }
    // create a flat list of xyz coords
    const xyzs_flat: number[] = [];
    const posi_i_to_xyzs_map: Map<number, number> = new Map();
    const unique_posis_i: number[] = Array.from(posis_i_set);
    for (let i = 0; i < unique_posis_i.length; i++) {
        const posi_i: number = unique_posis_i[i];
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        xyzs_flat.push(...xyz);
        posi_i_to_xyzs_map.set(posi_i, i);
    }
    // get an array of all the faces
    const faces_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case EEntType.FACE:
                faces_i.push(ent_i);
                break;
            default:
                const coll_faces_i: number[] = __model__.geom.nav.navAnyToFace(ent_type, ent_i);
                coll_faces_i.forEach( coll_face_i => faces_i.push(coll_face_i) );
                break;
        }
    }
    // create tjs meshes
    const tris_flat: number[] = [];
    for (const face_i of faces_i) {
        // create the tjs geometry
        const tris_i: number[] = __model__.geom.nav.navFaceToTri(face_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.TRI, tri_i);
            tris_flat.push( posi_i_to_xyzs_map.get( tri_posis_i[0]) );
            tris_flat.push( posi_i_to_xyzs_map.get( tri_posis_i[1]) );
            tris_flat.push( posi_i_to_xyzs_map.get( tri_posis_i[2]) );
        }
        // create the mesh, assigning the material
    }
    const geom_tjs = new THREE.BufferGeometry();
    geom_tjs.setIndex( tris_flat );
    // geom_tjs.addAttribute( 'position', new THREE.Float32BufferAttribute( xyzs_flat, 3 ) );
    geom_tjs.setAttribute( 'position', new THREE.Float32BufferAttribute( xyzs_flat, 3 ) );
    return new THREE.Mesh(geom_tjs, mat_tjs);
}
// ================================================================================================
/**
 * xxx
 * ~
 * @param __model__
 * @param origins The origins of teh rays
 * @param directions The direction vectors
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param method Enum; raytracing method
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
    const origins_tjs: THREE.Vector3[] = _raytraceOriginsTjs(__model__, origins);
    const directions_tjs: THREE.Vector3[] = _raytraceDirectionsTjs(__model__, directions);
    const mesh_tjs: THREE.Mesh = _createMeshTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    const result = _raytrace(origins_tjs, null, directions_tjs, mesh_tjs, limits, method);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return teh results
    return result;
}
function _raytraceOriginsTjs(__model__: GIModel, origins: Txyz|Txyz[]): THREE.Vector3[] {
    origins = Array.isArray(origins[0]) ? origins as Txyz[] : [origins] as Txyz[];
    return origins.map(origin => new THREE.Vector3(...origin));
}
function _raytraceDirectionsTjs(__model__: GIModel, directions: Txyz|Txyz[]): THREE.Vector3[] {
    directions = Array.isArray(directions[0]) ? directions as Txyz[] : [directions] as Txyz[];
    for (let i = 0; i < directions.length; i++) {
        directions[i] = vecNorm(directions[i]);
    }
    return directions.map(direction => new THREE.Vector3(...direction));
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
function _raytrace(origins_tjs: THREE.Vector3[], matrices_tjs: THREE.Matrix4[], directions_tjs: THREE.Vector3[], mesh_tjs: THREE.Mesh,
        limits: [number, number], method: _ERaytraceMethod): number[]|number[][] {
    const result = [];
    for (let i = 0; i < origins_tjs.length; i++) {
        const origin_tjs = origins_tjs[i];
        let result_count = 0;
        const result_dists: number[] = [];
        const result_ents: THREE.Object3D[] = [];
        for (const direction_tjs of directions_tjs) {
            let xformed_direction_tjs: THREE.Vector3 = direction_tjs;
            if (matrices_tjs) {
                xformed_direction_tjs = direction_tjs.clone();
                xformed_direction_tjs.applyMatrix4(matrices_tjs[i]);
            }
            const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, xformed_direction_tjs, limits[0], limits[1]);
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
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
// ================================================================================================
/**
 * xxx
 * ~
 * The detail parameter spacifies the number of target points that get generated along the sun paths.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * The number of points differs depending on the latitde. At latitude 0, the
 * - detail = 0 -> 45 points
 * - detail = 1 -> 66 points
 * - detail = 2 -> 91 points
 * - detail = 3 -> 136 points
 * - detail = 4 -> 225 points
 * - detail = 5 -> 490 points
 * - detail = 6  -> 1067 points
 * ~
 * @param __model__
 * @param origins The origins of the rays
 * @param detail The level of detail for the analysis
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing
 * @param method Enum; solar method
 */
export function Solar(__model__: GIModel, origins: TPlane[], detail: number,
    entities: TId|TId[]|TId[][], limits: number|[number, number], method: _ESolarMethod): number[] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Solar';
    const ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    // TODO
    // TODO
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (!__model__.attribs.query.hasModelAttrib('geolocation')) {
        throw new Error('analyze.Solar: geolocation model attribute is missing, \
            e.g. geolocation = {"latitude":12, "longitude":34}');
    } else {
        const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
        if (__.isObject(geolocation) && __.has(geolocation, 'latitude')) {
            latitude = geolocation['latitude'];
        } else {
            throw new Error('analyze.Solar: geolocation model attribute is missing the "latitude" key, \
                e.g. geolocation = {"latitude":12, "longitude":34}');
        }
        if (__.has(geolocation, 'north')) {
            if (Array.isArray(geolocation['north']) && geolocation['north'].length === 2) {
                north = geolocation['north'] as Txy;
            } else {
                throw new Error('analyze.Solar: geolocation model attribute has a "north" value with the wrong type, \
                it should be a vector with two values, \
                e.g. geolocation = {"latitude":12, "longitude":34, "north":[1,2]}');
            }
        }
    }
    if (detail > 6) {
        throw new Error('analyze.Solar: The "detail" argument is too high, the maximum is 6.');
    }
    // --- Error Check ---
    const origins_tjs: [THREE.Vector3, THREE.Vector3][] = _solarOriginsTjs(__model__, origins, 0.01);
    const mesh_tjs: THREE.Mesh = _createMeshTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get the direction vectors
    const directions_tjs: THREE.Vector3[] = __.flatten(_solarDirectionsTjs(latitude, north, detail, method));
    // run the simulation
    const results: number[] = _solarRaytrace(origins_tjs, directions_tjs, mesh_tjs, limits) as number[];
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the result
    return results;
}
export enum _ESolarMethod {
    DIRECT_EXPOSURE = 'direct_exposure',
    INDIRECT_EXPOSURE = 'indirect_exposure'
}
function _solarOriginsTjs(__model__: GIModel, origins: TRay[]|TPlane[], offset: number): [THREE.Vector3, THREE.Vector3][] {
    const vectors_tjs: [THREE.Vector3, THREE.Vector3][] = [];
    for (const origin of origins) {
        let normal_xyz: Txyz = null;
        if (origin.length === 2) {
            normal_xyz = vecNorm(origin[1]);
        } else if (origin.length === 3) {
            normal_xyz = vecCross(origin[1], origin[2]);
        } else {
            throw new Error('analyze.Solar: origins arg has invalid values');
        }
        const normal_tjs: THREE.Vector3 = new THREE.Vector3(...normal_xyz);
        const origin_xyz: Txyz = vecAdd(origin[0], vecMult(normal_xyz, offset));
        const origin_tjs: THREE.Vector3 = new THREE.Vector3(...origin_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
function _solarDirectionsTjs(latitude: number, north: Txy, detail: number, method: _ESolarMethod): THREE.Vector3[][] {
    switch (method) {
        case _ESolarMethod.DIRECT_EXPOSURE:
            return _solarDirectTjs(latitude, north, detail);
        case _ESolarMethod.DIRECT_EXPOSURE:
            throw new Error('Not implemented');
    }
}
function _solarRot(day_ang: number, day: number, hour_ang: number, hour: number, latitude: number, north: number): THREE.Vector3 {
    const vec: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
    vec.applyAxisAngle(XAXIS, day_ang * day);
    vec.applyAxisAngle(YAXIS, hour_ang * hour);
    vec.applyAxisAngle(XAXIS, latitude);
    vec.applyAxisAngle(ZAXIS, -north);
    return vec;
}
function _solarDirectTjs(latitude: number, north: Txy, detail: number): THREE.Vector3[][] {
    const directions: THREE.Vector3[][] = [];
    // set the level of detail
    const day_step = [182 / 4, 182 / 5, 182 / 6, 182 / 7, 182 / 8, 182 / 9, 182 / 10][detail];
    const num_day_steps: number = Math.round(182 / day_step) + 1;
    const hour_step = [0.25 * 6, 0.25 * 5, 0.25 * 4, 0.25 * 3, 0.25 * 2, 0.25 * 1, 0.25 * 0.5][detail];
    // get the angles in radians
    const day_ang_rad: number = degToRad(47) as number / 182;
    const hour_ang_rad: number = (2 * Math.PI) / 24;
    // get the atitude angle in radians
    const latitude_rad: number = degToRad(latitude) as number;
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // create the vectors
    for (let day_count = 0; day_count < num_day_steps; day_count++) {
        const day: number = -91 + (day_count * day_step);
        const one_day_path: THREE.Vector3[] = [];
        // get sunrise
        let sunrise = 0;
        let sunset = 0;
        for (let hour = 0; hour < 24; hour = hour + 0.1) {
            const sunrise_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (sunrise_vec.z > 0) {
                sunrise = hour;
                sunset = 24 - hour;
                one_day_path.push(sunrise_vec);
                break;
            }
        }
        // morning sun path, count down from midday
        for (let hour = 12; hour > sunrise; hour = hour - hour_step) {
            const am_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (am_vec.z > 0) {
                one_day_path.splice(1, 0, am_vec);
            } else {
                break;
            }
        }
        // afternoon sunpath, count up from midday
        for (let hour = 12 + hour_step; hour < sunset; hour = hour + hour_step) {
            const pm_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (pm_vec.z > 0) {
                one_day_path.push(pm_vec);
            } else {
                break;
            }
        }
        // sunset
        const sunset_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, sunset, latitude_rad, north_rad);
        one_day_path.push(sunset_vec);
        // add it to the list
        directions.push(one_day_path);
    }
    return directions;
}
// calc the max solar exposure for a point with no obstructions facing straight up
function _solarRaytraceMax(directions_tjs: THREE.Vector3[]): number {
    let result = 0;
    const normal_tjs: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    for (const direction_tjs of directions_tjs) {
        // calc the weighted result based on the angle between the dir and normal
        // this applies the cosine weighting rule
        const result_weighted: number = normal_tjs.dot(direction_tjs);
        if (result_weighted > 0) {
            result = result + result_weighted;
        }
    }
    return result;
}
function _solarRaytrace(origins_tjs: [THREE.Vector3, THREE.Vector3][],
        directions_tjs: THREE.Vector3[], mesh_tjs: THREE.Mesh, limits: [number, number]): number[] {
    const results = [];
    const result_max: number = _solarRaytraceMax(directions_tjs);
    for (const [origin_tjs, normal_tjs] of origins_tjs) {
        let result = 0;
        for (const direction_tjs of directions_tjs) {
            const dot_normal_direction: number = normal_tjs.dot(direction_tjs);
            if (dot_normal_direction > 0) {
                const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, direction_tjs, limits[0], limits[1]);
                const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
                if (isects.length === 0) {
                    // this applies the cosine weighting rule
                    result = result + dot_normal_direction;
                }
            }
        }
        results.push(100 * result / result_max);
    }
    return results;
}
// ================================================================================================
/**
 * xxx
 * ~
 * @param __model__
 * @param origins The origins of the rays
 * @param detail The level of detail for the analysis
 * @param radius The radius of the sun path
 * @param method Enum; solar method
 */
export function SunPath(__model__: GIModel, origin: Txyz|TPlane, detail: number, radius: number, method: _ESolarMethod): TId[] {
    // --- Error Check ---
    const fn_name = 'analyze.SunPath';
    // TODO
    // TODO
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (!__model__.attribs.query.hasModelAttrib('geolocation')) {
        throw new Error('analyze.Solar: geolocation model attribute is missing, \
            e.g. geolocation = {"latitude":12, "longitude":34}');
    } else {
        const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
        if (__.isObject(geolocation) && __.has(geolocation, 'latitude')) {
            latitude = geolocation['latitude'];
        } else {
            throw new Error('analyze.Solar: geolocation model attribute is missing the "latitude" key, \
                e.g. geolocation = {"latitude":12, "longitude":34}');
        }
        if (__.has(geolocation, 'north')) {
            if (Array.isArray(geolocation['north']) && geolocation['north'].length === 2) {
                north = geolocation['north'] as Txy;
            } else {
                throw new Error('analyze.Solar: geolocation model attribute has a "north" value with the wrong type, \
                it should be a vector with two values, \
                e.g. geolocation = {"latitude":12, "longitude":34, "north":[1,2]}');
            }
        }
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: THREE.Matrix4 = null;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    } else {
        matrix = new THREE.Matrix4();
        matrix.makeTranslation(...origin as Txyz);
    }
    // get the direction vectors
    const directions_tjs: THREE.Vector3[][] = _solarDirectionsTjs(latitude, north, detail, method);
    // run the simulation
    const posis_i: number[][] = [];
    for (const one_day_tjs of directions_tjs) {
        const one_day_posis_i: number[] = [];
        for (const direction_tjs of one_day_tjs) {
            let xyz: Txyz = vecMult([direction_tjs.x, direction_tjs.y, direction_tjs.z], radius);
            xyz = multMatrix(xyz, matrix);
            const posi_i: number = __model__.geom.add.addPosi();
            __model__.attribs.add.setPosiCoords(posi_i, xyz);
            one_day_posis_i.push(posi_i);
        }
        posis_i.push(one_day_posis_i);
    }
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
export enum _EShortestPathMethod {
    DIRECTED = 'directed',
    UNDIRECTED = 'undirected'
}
export enum _EShortestPathResult {
    COUNTS = 'counts',
    PATHS = 'paths',
    BOTH = 'both'
}
/**
 * Calculates the shortest path from ever position in source, to every position in target.
 * ~
 * Returns a dictionary containing the shortes paths.
 * ~
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1) 'ps': a list of positions traversed by the paths,
 * 2) 'ps_count': a list of numbers that count how often each position was traversed.
 * 3) '_e': a list of edges traversed by the paths,
 * 4) '_e_count': a list of numbers that count how often each edge was traversed.
 * ~
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1) 'ps_paths': a list of lists of positions, one list for each path.
 * 2) '_e_paths': a list of lists of edges, one list for each path.
 * ~
 * If 'both' is selected, the dictionary will contain all six lists just described.
 * ~
 * The network must consist of vertices that are connected or welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * ~
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * ~
 * @param __model__
 * @param source Path origins, positions, or entities from which positions can be extracted.
 * @param target Path destinations, positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undeirected.
 * @param result Enum, the data to return, positions, edges, or both.
 */
export function ShortestPath(__model__: GIModel, source: TId|TId[]|TId[][][], target: TId|TId[]|TId[][],
        entities: TId|TId[]|TId[][], method: _EShortestPathMethod, result: _EShortestPathResult):
        { _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[], _e_paths?: TId[][], ps_paths?: TId[][]} {

    source = arrMakeFlat(source) as TId[];
    target = arrMakeFlat(target) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    const source_ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'origins', source,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    const target_ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'destinations', target,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    const ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // --- Error Check ---
    const directed: boolean = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_edges = true;
    let return_posis = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.COUNTS:
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_edges = false;
            return_posis = false;
            break;
        default:
            // return_edges = false;
            // return_posis = false;
            break;
    }
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
    const elements: any[] = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: elements,
        headless: true,
    });
    const map_edges_i: Map<number, number> = new Map();
    const map_posis_i: Map<number, number> = new Map();
    const posi_paths: number[][] = [];
    const edge_paths: number[][] = [];
    for (const source_posi_i of source_posis_i) {
        const source_elem = cy.getElementById( source_posi_i.toString() );
        const dijkstra = cy.elements().dijkstra({
            root: source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed
        });
        for (const target_posi_i of target_posis_i) {
            const path = dijkstra.pathTo( cy.getElementById( target_posi_i.toString() ) );
            const posi_path: number[] = [];
            const edge_path: number[] = [];
            for (const elem of path.toArray()) {
                if (elem.isEdge()) {
                    const edge_i: number = elem.data('idx');
                    if (return_edges) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        } else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i: number = elem.data('idx2');
                            if (edge2_i !== null) {
                                if (!map_edges_i.has(edge2_i)) {
                                    map_edges_i.set(edge2_i, 1);
                                } else {
                                    map_edges_i.set(edge2_i, map_edges_i.get(edge2_i) + 1);
                                }
                            }
                        }
                    }
                    if (return_paths) {
                        edge_path.push(edge_i);
                    }
                } else {
                    const posi_i: number = elem.data('idx');
                    if (return_posis) {
                        if (!map_posis_i.has(posi_i)) {
                            map_posis_i.set(posi_i, 1);
                        } else {
                            map_posis_i.set(posi_i, map_posis_i.get(posi_i) + 1);
                        }
                    }
                    if (return_paths) {
                        posi_path.push(posi_i);
                    }
                }
            }
            if (return_paths) {
                edge_paths.push(edge_path);
                posi_paths.push(posi_path);
            }
        }
    }
    const dict: { _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[], _e_paths?: TId[][], ps_paths?: TId[][]} = {};
    if (return_edges) {
        dict['_e'] = idsMakeFromIndicies(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict['_e_count'] = Array.from(map_edges_i.values());
    }
    if (return_posis) {
        dict['ps'] =  idsMakeFromIndicies(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict['ps_count'] =  Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict['_e_paths'] =  idsMakeFromIndicies(EEntType.EDGE, edge_paths) as TId[][];
        dict['ps_paths'] =  idsMakeFromIndicies(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}

function _getUniquePosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const set_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    return Array.from(set_posis_i);
}
function _cytoscapeWeightFn(edge: cytoscape.EdgeSingular) {
    return edge.data('weight');
}
function _cytoscapeGetElements(__model__: GIModel, ents_arr: TEntTypeIdx[], 
    source_posis_i: number[], target_posis_i: number[], directed: boolean): any[] {
    let has_weight_attrib = false;
    if (__model__.attribs.query.hasAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with cource and target
    const set_posis_i: Set<number> = new Set(source_posis_i);
    for (const target_posi_i of target_posis_i) { set_posis_i.add(target_posi_i); }
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const edges_i: number[] = __model__.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            set_edges_i.add(edge_i);
        }
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // create elements
    const elements: any[] = [];
    for (const posi_i of Array.from(set_posis_i)) {
        elements.push( {  data: { id: posi_i.toString(), idx: posi_i} } );
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.attribs.query.getAttribVal(EEntType.EDGE, 'weight', edge_i) as number;
            } else {
                const c0: Txyz = __model__.attribs.query.getPosiCoords(edge_posis_i[0]);
                const c1: Txyz = __model__.attribs.query.getPosiCoords(edge_posis_i[1]);
                weight = distance(c0, c1);
            }
            elements.push( {  data: { id: 'e' + edge_i,
                source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i} } );
        }
    } else {
        // undirected
        const map_edges_ab: Map<string, any> = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id: string = 'e_' + edge_posis_i[0].toString() + '_' + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj['data']['idx2'] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            } else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.attribs.query.getAttribVal(EEntType.EDGE, 'weight', edge_i) as number;
                } else {
                    const c0: Txyz = __model__.attribs.query.getPosiCoords(edge_posis_i[0]);
                    const c1: Txyz = __model__.attribs.query.getPosiCoords(edge_posis_i[1]);
                    weight = distance(c0, c1);
                }
                const obj = {
                    data: {
                        id: undir_edge_id,
                        source: edge_posis_i[0].toString(),
                        target: edge_posis_i[1].toString(),
                        weight: weight,
                        idx: edge_i,
                        idx2: null
                    }
                };
                map_edges_ab.set(undir_edge_id, obj);
                elements.push(obj);
            }
        }
    }
    return elements;
}
