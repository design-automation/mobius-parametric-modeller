/**
 * The `analysis` module has functions for performing various types of analysis with entities in the model.
 * These functions all return dictionaries containing the results of the analysis.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, Txyz, EEntType, TEntTypeIdx, TRay, TPlane, Txy, EAttribDataTypeStrs } from '@libs/geo-info/common';
import { idsMakeFromIdxs, idsMake, idsBreak, idMake } from '@assets/libs/geo-info/common_id_funcs';
import { distance } from '@libs/geom/distance';
import { vecAdd, vecCross, vecMult, vecNorm, vecAng2, vecSetLen, vecRot } from '@libs/geom/vectors';
import uscore from 'underscore';
import { min, max } from '@assets/core/inline/_math';
import { arrMakeFlat, getArrDepth } from '@assets/libs/util/arrs';
import { degToRad } from '@assets/core/inline/_conversion';
import { multMatrix } from '@libs/geom/matrix';
import { XAXIS, YAXIS, ZAXIS } from '@assets/libs/geom/constants';
import cytoscape from 'cytoscape';
import * as THREE from 'three';
import { TypedArrayUtils } from '@libs/TypedArrayUtils.js';
import * as Mathjs from 'mathjs';
import { createSingleMeshTjs } from '@assets/libs/geom/mesh';
import { isRay, isXYZ, isPlane } from '@assets/libs/geo-info/common_func';

// ================================================================================================
interface TRaytraceResult {
    hit_count?: number;
    miss_count?: number;
    total_dist?: number;
    min_dist?: number;
    avg_dist?: number;
    max_dist?: number;
    dist_ratio?: number;
    distances?: number[];
    hit_pgons?: TId[];
    intersections?: Txyz[];
}
export enum _ERaytraceMethod {
    STATS = 'stats',
    DISTANCES = 'distances',
    HIT_PGONS = 'hit_pgons',
    INTERSECTIONS = 'intersections',
    ALL = 'all'
}
/**
 * Shoot a set of rays into a set of obstructions, consisting of polygon faces.
 * One can imagine particles being shot from the ray origin in the ray direction, hitting the obstructions.
 * \n
 * Each ray will either hit an obstruction, or will hit no obstructions.
 * The length of the ray vector is ignored, only the ray origin and direction is taken into account.
 * Each particle shot out from a ray will travel a certain distance.
 * The minimum and maximum distance that the particle will travel is defined by the 'dist' argument.
 * \n
 * If a ray particle hits an obstruction, then the 'distance' for that ray is the distance from the ray origin
 * to the point of intersection.
 * If the ray particle does not hit an obstruction, then the 'distance' for that ray is equal to
 * the max for the 'dist' argument.
 * \n
 * Returns a dictionary containing the following data.
 * \n
 * If 'stats' is selected, the dictionary will contain the following numbers:
 * 1) 'hit_count': the total number of rays that hit an obstruction.
 * 2) 'miss_count': the total number of rays that did not hit any obstruction.
 * 3) 'total_dist': the total of all the ray distances.
 * 4) 'min_dist': the minimum distance for all the rays.
 * 5) 'max_dist': the maximum distance for all the rays.
 * 6) 'avg_dist': the average dist for all the rays.
 * 7) 'dist_ratio': the ratio of 'total_dist' to the maximum distance if not rays hit any obstructions.
  * \n
 * If 'distances' is selected, the dictionary will contain the following list:
 * 1) 'distances': A list of numbers, the distance travelled for each ray.
   * \n
 * If 'hit_pgons' is selected, the dictionary will contain the following list:
 * 1) 'hit_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon was hit.
 * \n
 * If 'intersections' is selected, the dictionary will contain the following list:
 * 1) 'intersections': A list of XYZ coords, the point of intersection where the ray hit a polygon,
 * or 'null' if no polygon was hit.
 * \n
 * If 'all' is selected, the dictionary will contain all of the above.
 * \n
 * If the input is a list of rays, the output will be a single dictionary.
 * If the list is empty (i.e. contains no rays), then 'null' is returned.
 * If the input is a list of lists of rays, then the output will be a list of dictionaries.
 * \n
 * @param __model__
 * @param rays A ray, a list of rays, or a list of lists of rays.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param dist The ray limits, one or two numbers. Either max, or [min, max].
 * @param method Enum; values to return.
 */
export function Raytrace(__model__: GIModel, rays: TRay|TRay[]|TRay[][],
        entities: TId|TId[]|TId[][], dist: number|[number, number], method: _ERaytraceMethod): TRaytraceResult|TRaytraceResult[] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Raytrace';
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        checkArgs(fn_name, 'rays', rays, [ArgCh.isRay, ArgCh.isRayL, ArgCh.isRayLL]);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgs(fn_name, 'dist', dist, [ArgCh.isNum, ArgCh.isNumL]);
        if (Array.isArray(dist)) {
            if (dist.length !== 2) { throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].'); }
            if (dist[0] >= dist[1]) { throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].'); }
        }
    } else {
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList],
        // [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const mesh: [THREE.Mesh, number[]] = createSingleMeshTjs(__model__, ents_arrs);
    dist = Array.isArray(dist) ? dist : [0, dist];
    const result = _raytraceAll(__model__, rays, mesh, dist, method);
    // cleanup
    mesh[0].geometry.dispose();
    (mesh[0].material as THREE.Material).dispose();
    // return the results
    return result;
}
function _raytraceAll(__model__: GIModel, rays: TRay|TRay[]|TRay[][],
        mesh: [THREE.Mesh, number[]], limits: [number, number],
        method: _ERaytraceMethod): TRaytraceResult|TRaytraceResult[] {
    const depth: number = getArrDepth(rays);
    if (depth < 2) {// an empty list
        return null;
    } else if (depth === 2) {// just one ray
        return _raytraceAll(__model__, [rays] as TRay[], mesh, limits, method);
    } else if (depth === 3) { // a list of rays
        const [origins_tjs, dirs_tjs]: [THREE.Vector3[], THREE.Vector3[]] =
            _raytraceOriginsDirsTjs(__model__, rays as TRay[]);
        return _raytrace(origins_tjs, dirs_tjs, mesh, limits, method) as TRaytraceResult;
    } else if (depth === 4) { // a nested list of rays
        return (rays as TRay[][]).map(a_rays => _raytraceAll(
            __model__, a_rays, mesh, limits, method)) as TRaytraceResult[];
    }
}
function _raytraceOriginsDirsTjs(__model__: GIModel, rays: TRay[]): [THREE.Vector3[], THREE.Vector3[]] {
    const origins_tjs: THREE.Vector3[] = [];
    const dirs_tjs: THREE.Vector3[] = [];
    for (const ray of rays) {
        origins_tjs.push(new THREE.Vector3(ray[0][0], ray[0][1], ray[0][2]));
        const dir = vecNorm(ray[1]);
        dirs_tjs.push(new THREE.Vector3(dir[0], dir[1], dir[2]));
    }
    return [origins_tjs, dirs_tjs];
}
function _raytrace(origins_tjs: THREE.Vector3[], dirs_tjs: THREE.Vector3[], mesh: [THREE.Mesh, number[]],
        limits: [number, number], method: _ERaytraceMethod): TRaytraceResult {
    const result: TRaytraceResult = {};
    let hit_count = 0;
    let miss_count = 0;
    const result_dists: number[] = [];
    const result_ents: TId[] = [];
    const result_isects: Txyz[] = [];
    for (let i = 0; i < origins_tjs.length; i++) {
        // get the origin and direction
        const origin_tjs = origins_tjs[i];
        const dir_tjs = dirs_tjs[i];
        // shoot
        const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
        const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh[0], false);
        // get the result
        if (isects.length === 0) {
            result_dists.push(limits[1]);
            miss_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                result_ents.push( null );
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                const origin: Txyz = origin_tjs.toArray() as Txyz;
                const dir: Txyz = dir_tjs.toArray() as Txyz;
                result_isects.push(vecAdd(origin, vecSetLen(dir, limits[1])));
            }
        } else {
            result_dists.push(isects[0]['distance']);
            hit_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                const face_i = mesh[1][isects[0].faceIndex];
                result_ents.push( idMake(EEntType.PGON, face_i) as TId );
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                const isect_tjs: THREE.Vector3 = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
    }
    if ((method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.STATS) && result_dists.length > 0) {
        result.hit_count = hit_count;
        result.miss_count = miss_count;
        result.total_dist = Mathjs.sum(result_dists);
        result.min_dist = Mathjs.min(result_dists);
        result.avg_dist = result.total_dist / result_dists.length;
        result.max_dist = Mathjs.max(result_dists);
        result.dist_ratio = result.total_dist / (result_dists.length * limits[1]);
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.DISTANCES) {
        result.distances = result_dists;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
        result.hit_pgons = result_ents;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
        result.intersections = result_isects;
    }
    return result;
}
// ================================================================================================
interface TIsovistResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    circularity?: number[];
    compactness?: number[];
    cluster?: number[];
}
/**
 * Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.
 * \n
 * The isovist is calculated by shooting rays out from the origins in a radial pattern.
 * The 'radius' argument defines the maximum radius of the isovist.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a radial pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different isovist metrics.
 * \n
 * 1) 'avg_dist': The average distance from origin to the perimeter.
 * 2) 'min_dist': The minimum distance from the origin to the perimeter.
 * 3) 'max_dist': The minimum distance from the origin to the perimeter.
 * 4) 'area': The area of the isovist.
 * 5) 'perimeter': The perimeter of the isovist.
 * 4) 'area_ratio': The ratio of the area of the isovist to the maximum area.
 * 5) 'perimeter_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
 * 6) 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
 * 7) 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
 * 8) 'cluster': The ratio of the radius of an idealized circle with the actual area of the
 * isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael Batty, 2001).
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or a list of Planes, to be used as the origins for calculating the isovists.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the isovist.
 * @param num_rays The number of rays to generate when calculating isovists.
 */
export function Isovist(__model__: GIModel, origins: TRay[]|TPlane[],
        entities: TId|TId[]|TId[][], radius: number, num_rays: number): TIsovistResult {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Isovist';
    // let origin_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        checkArgs(fn_name, 'origins', origins, [ArgCh.isRayL, ArgCh.isPlnL]);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgs(fn_name, 'dist', radius, [ArgCh.isNum, ArgCh.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) { throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].'); }
            if (radius[0] >= radius[1]) { throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].'); }
        }
    } else {
        // origin_ents_arrs = idsBreak(origins) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // create tjs origins for xyz, ray, or plane
    const origins_tjs: THREE.Vector3[] = _isovistOriginsTjs(__model__, origins, 0.1); // TODO Should we lift coords by 0.1 ???
    // create tjs directions
    const dirs_xyzs: Txyz[] = [];
    const dirs_tjs: THREE.Vector3[] = [];
    const vec: Txyz = [1, 0, 0];
    for (let i = 0; i < num_rays; i++) {
        const dir_xyz = vecRot(vec, [0, 0, 1], i * (Math.PI * 2) / num_rays);
        dirs_xyzs.push(vecSetLen(dir_xyz, radius));
        const dir_tjs: THREE.Vector3 = new THREE.Vector3(dir_xyz[0], dir_xyz[1], dir_xyz[2]);
        dirs_tjs.push(dir_tjs);
    }
    // calc max perim and area
    const ang = (2 * Math.PI) / num_rays;
    const opp = radius * Math.sin(ang / 2);
    const max_perim = num_rays * 2 * opp;
    const max_area = num_rays * radius * Math.cos(ang / 2) * opp;
    // create mesh
    const mesh: [THREE.Mesh, number[]] = createSingleMeshTjs(__model__, ents_arrs);
    // create data structure
    const result: TIsovistResult = { };
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area = [];
    result.perimeter = [];
    result.circularity = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.compactness = [];
    result.cluster = [];
    // shoot rays
    for (let i = 0; i < origins_tjs.length; i++) {
        const origin_tjs: THREE.Vector3 = origins_tjs[i];
        const result_dists: number[] = [];
        const result_isects: Txyz[] = [];
        for (let j = 0; j < dirs_tjs.length; j++) {
            const dir_tjs: THREE.Vector3 = dirs_tjs[j];
            const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh[0], false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push(vecAdd(
                    [origin_tjs.x, origin_tjs.y, origin_tjs.z], dirs_xyzs[j]
                ));
            } else {
                result_dists.push(isects[0]['distance']);
                const isect_tjs: THREE.Vector3 = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // calc the perimeter and area
        let perim = 0;
        let area = 0;
        for (let j = 0; j < num_rays; j++) {
            const j2 = j === num_rays - 1 ? 0 : j + 1;
            // calc perim
            const c = distance(result_isects[j], result_isects[j2]);
            perim += c;
            // calc area
            area += _isovistTriArea(result_dists[j], result_dists[j2], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push( avg_dist );
        result.min_dist.push( min_dist );
        result.max_dist.push( max_dist );
        result.area.push( area );
        result.perimeter.push( perim );
        result.area_ratio.push( area / max_area );
        result.perimeter_ratio.push( perim / max_perim );
        result.circularity.push( (perim * perim) / area );
        result.compactness.push( avg_dist / max_dist );
        result.cluster.push( Math.sqrt(area / Math.PI) / (perim / (2 * Math.PI)) );
    }
    // cleanup
    mesh[0].geometry.dispose();
    (mesh[0].material as THREE.Material).dispose();
    // return the results
    return result;
}
function _isovistOriginsTjs(__model__: GIModel, origins: Txyz[]|TRay[]|TPlane[], offset: number): THREE.Vector3[] {
    const vectors_tjs: THREE.Vector3[] = [];
    const is_xyz: boolean = isXYZ(origins[0]);
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz: Txyz = null;
        if (is_xyz) {
            origin_xyz = origin as Txyz;
        } else if (is_ray) {
            origin_xyz = origin[0] as Txyz;
        } else if (is_pln) {
            origin_xyz = origin[0] as Txyz;
        } else {
            throw new Error('analyze.Solar: origins arg has invalid values');
        }
        const origin_tjs: THREE.Vector3 = new THREE.Vector3(origin_xyz[0], origin_xyz[1], origin_xyz[2] + offset);
        vectors_tjs.push(origin_tjs);
    }
    return vectors_tjs;
}
function _isovistTriArea(a: number, b: number, c: number): number {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
export enum _ESkyMethod {
    WEIGHTED = 'weighted',
    UNWEIGHTED = 'unweighted',
    ALL = 'all'
}

/**
 * Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
 * The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * Each sensor has a location and direction, specified using either rays or planes.
 * The direction of the sensor specifies what is infront and what is behind the sensor.
 * For each sensor, only exposure infront of the sensor is calculated.
 * \n
 * The exposure is calculated by shooting rays in reverse.
 * from the sensor origin to a set of points on the sky dome.
 * If the rays hits an obstruction, then the sky dome is obstructed..
 * If the ray hits no obstructions, then the sky dome is not obstructed.
 * \n
 * The exposure factor at each sensor point is calculated as follows:
 * 1) Shoot rays to all sky dome points.
 * 2) If the ray hits an obstruction, assign a weight of 0 to that ray.
 * 3) If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4) Calculate the total solar expouse by adding up the weights for all rays.
 * 5) Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.
 * \n
 * If 'weighted' is selected, then
 * the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
 * Rays parallel to the sensor direction are assigned a weight of 1.
 * Rays at an oblique angle are assigned a weight equal to the cosine of the angle
 * betweeen the sensor direction and the ray.
 * \n
 * If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * \n
 * The number of rays are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing exposure results.
 * \n
 * 1) 'exposure': A list of numbers, the exposure factors.
 * \n
 * \n
 * @param __model__
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; sky method.
 */
export function Sky(__model__: GIModel, origins: Txyz[]|TRay[]|TPlane[], detail: number,
        entities: TId|TId[]|TId[][], limits: number|[number, number], method: _ESkyMethod): any {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Sky';
    let ents_arrs: TEntTypeIdx[];
    // let latitude: number = null;
    // let north: Txy = [0, 1];
    if (__model__.debug) {
        checkArgs(fn_name, 'origins', origins, [ArgCh.isXYZL, ArgCh.isRayL, ArgCh.isPlnL]);
        checkArgs(fn_name, 'detail', detail, [ArgCh.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error (fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
        // const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        // latitude = geolocation['latitude'];
        // if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        //     north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        // }
    }
    // TODO
    // TODO
    // --- Error Check ---


    const sensor_oris_dirs_tjs: [THREE.Vector3, THREE.Vector3][] = _rayOrisDirsTjs(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get the direction vectors
    const ray_dirs_tjs: THREE.Vector3[] = _skyRayDirsTjs(detail);
    // run the simulation
    const weighted: boolean = method === _ESkyMethod.WEIGHTED;
    const results: number[] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs, mesh_tjs, limits, weighted);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the result
    return { 'exposure': results };

}
function _skyRayDirsTjs(detail: number): THREE.Vector3[] {
    const hedron_tjs: THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, detail + 2);
    // calc vectors
    const vecs: THREE.Vector3[] = [];
    for (const vec of hedron_tjs.vertices) {
        // vec.applyAxisAngle(YAXIS, Math.PI / 2);
        if (vec.z > -1e-6) {
            vecs.push(vec);
        }
    }
    return vecs;
}
// ================================================================================================
export enum _ESolarMethod {
    DIRECT_WEIGHTED = 'direct_weighted',
    DIRECT_UNWEIGHTED = 'direct_unweighted',
    INDIRECT_WEIGHTED = 'indirect_weighted',
    INDIRECT_UNWEIGHTED = 'indirect_unweighted'
}
/**
 * Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied locations.
 * The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * The calculation takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
 * \n
 * Each sensor has a location and direction, specified using either rays or planes.
 * The direction of the sensor specifies what is infront and what is behind the sensor.
 * For each sensor, only exposure infront of the sensor is calculated.
 * \n
 * The exposure is calculated by shooting rays in reverse.
 * from the sensor origin to a set of points on the sky dome.
 * If the rays hits an obstruction, then the sky dome is obstructed..
 * If the ray hits no obstructions, then the sky dome is not obstructed.
 * \n
 * The exposure factor at each sensor point is calculated as follows:
 * 1) Shoot rays to all sky dome points.
 * 2) If the ray hits an obstruction, assign a wight of 0 to that ray.
 * 3) If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4) Calculate the total solar expouse by adding up the weights for all rays.
 * 5) Divide by the maximum possible solar exposure for an unobstructed sensor.
 * \n
 * The solar exposure calculation takes into account the angle of incidence of the sun ray to the sensor direction.
 * Sun rays that are hitting the sensor straight on are assigned a weight of 1.
 * Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the cosine of the angle.
 * \n
 * If 'direct_exposure' is selected, then the points on the sky dome will follow the path of the sun throughout the year.
 * If 'indirect_exposure' is selected, then the points on the sky dome will consist of points excluded by
 * the path of the sun throughout the year.
 * \n
 * The direct sky dome points cover a strip of sky where the sun travels.
 * The inderect sky dome points cover the segments of sky either side of the direct sun strip.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * The number of rays differs depending on the latitde.
 * \n
 * At latitude 0, the number of rays for 'direct' are as follows:
 * 0 = 44 rays,
 * 1 = 105 rays,
 * 2 = 510 rays,
 * 3 = 1287 rays.
 * \n
 * At latitude 0, the number of rays for 'indirect' are as follows:
 * 0 = 58 rays,
 * 1 = 204 rays,
 * 2 = 798 rays,
 * 3 = 3122 rays.
 * \n
 * The number of rays for 'sky' are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing solar exposure results.
 * \n
 * If one  of the 'direct' methods is selected, the dictionary will contain:
 * 1) 'direct': A list of numbers, the direct exposure factors.
 * \n
 * If one  of the 'indirect' methods is selected, the dictionary will contain:
 * 1) 'indirect': A list of numbers, the indirect exposure factors.
 * \n
 * \n
 * @param __model__
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; solar method.
 */
export function Sun(__model__: GIModel, origins: Txyz[]|TRay[]|TPlane[], detail: number,
        entities: TId|TId[]|TId[][], limits: number|[number, number], method: _ESolarMethod): any {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Sun';
    let ents_arrs: TEntTypeIdx[];
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (__model__.debug) {
        checkArgs(fn_name, 'origins', origins, [ArgCh.isXYZL, ArgCh.isRayL, ArgCh.isPlnL]);
        checkArgs(fn_name, 'detail', detail, [ArgCh.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error (fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        if (!__model__.modeldata.attribs.query.hasModelAttrib('geolocation')) {
            throw new Error('analyze.Solar: model attribute "geolocation" is missing, \
                e.g. @geolocation = {"latitude":12, "longitude":34}');
        } else {
            const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
            if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                latitude = geolocation['latitude'];
            } else {
                throw new Error('analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}');
            }
        }
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
            if (!Array.isArray(north) || north.length !== 2) {
                throw new Error('analyze.Solar: model has a "north" attribute with the wrong type, \
                it should be a vector with two values, \
                e.g. @north =  [1,2]');
            }
        }
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        }
    }
    // TODO
    // TODO
    // --- Error Check ---

    // TODO North direction

    const sensor_oris_dirs_tjs: [THREE.Vector3, THREE.Vector3][] = _rayOrisDirsTjs(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];


    // return the result
    const results = {};
    switch (method) {
        case _ESolarMethod.DIRECT_WEIGHTED:
        case _ESolarMethod.DIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs1: THREE.Vector3[] = uscore.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted1: boolean = method === _ESolarMethod.DIRECT_WEIGHTED;
            results['direct'] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs1, mesh_tjs, limits, weighted1) as number[];
            break;
        case _ESolarMethod.INDIRECT_WEIGHTED:
        case _ESolarMethod.INDIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs2: THREE.Vector3[] = uscore.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted2: boolean = method === _ESolarMethod.INDIRECT_WEIGHTED;
            results['indirect'] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs2, mesh_tjs, limits, weighted2) as number[];
            break;
        default:
            throw new Error('Solar method not recognised.');
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return dict
    return results;
}
function _rayOrisDirsTjs(__model__: GIModel, origins: Txyz[]|TRay[]|TPlane[], offset: number): [THREE.Vector3, THREE.Vector3][] {
    const vectors_tjs: [THREE.Vector3, THREE.Vector3][] = [];
    const is_xyz: boolean = isXYZ(origins[0]);
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz: Txyz = null;
        let normal_xyz: Txyz = null;
        if (is_xyz) {
            origin_xyz = origin as Txyz;
            normal_xyz = [0, 0, 1];
        } else if (is_ray) {
            origin_xyz = origin[0] as Txyz;
            normal_xyz = vecNorm(origin[1] as Txyz);
        } else if (is_pln) {
            origin_xyz = origin[0] as Txyz;
            normal_xyz = vecCross(origin[1] as Txyz, origin[2] as Txyz);
        } else {
            throw new Error('analyze.Solar: origins arg has invalid values');
        }
        const normal_tjs: THREE.Vector3 = new THREE.Vector3(...normal_xyz);
        const origin_offset_xyz: Txyz = vecAdd(origin_xyz, vecMult(normal_xyz, offset));
        const origin_tjs: THREE.Vector3 = new THREE.Vector3(...origin_offset_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
function _solarDirsTjs(latitude: number, north: Txy, detail: number, method: _ESolarMethod): THREE.Vector3[]|THREE.Vector3[][] {
    switch (method) {
        case _ESolarMethod.DIRECT_WEIGHTED:
        case _ESolarMethod.DIRECT_UNWEIGHTED:
            return _solarRaysDirectTjs(latitude, north, detail);
        case _ESolarMethod.INDIRECT_WEIGHTED:
        case _ESolarMethod.INDIRECT_UNWEIGHTED:
            return _solarRaysIndirectTjs(latitude, north, detail);
        // case _ESolarMethod.ALL:
        //     throw new Error('Not implemented');
        default:
            throw new Error('Solar method not recognised.');
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
function _solarRaysDirectTjs(latitude: number, north: Txy, detail: number): THREE.Vector3[][] {
    const directions: THREE.Vector3[][] = [];
    // set the level of detail
    // const day_step = [182 / 4, 182 / 5, 182 / 6, 182 / 7, 182 / 8, 182 / 9, 182 / 10][detail];
    const day_step = [182 / 3, 182 / 6, 182 / 9, 182 / 12][detail];
    const num_day_steps: number = Math.round(182 / day_step) + 1;
    // const hour_step = [0.25 * 6, 0.25 * 5, 0.25 * 4, 0.25 * 3, 0.25 * 2, 0.25 * 1, 0.25 * 0.5][detail];
    const hour_step = [0.25 * 6, 0.25 * 4, 0.25 * 1, 0.25 * 0.5][detail];
    // get the angles in radians
    const day_ang_rad: number = degToRad(false, 47) as number / 182;
    const hour_ang_rad: number = (2 * Math.PI) / 24;
    // get the atitude angle in radians
    const latitude_rad: number = degToRad(false, latitude) as number;
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
            if (sunrise_vec.z > -1e-6) {
                sunrise = hour;
                sunset = 24 - hour;
                one_day_path.push(sunrise_vec);
                break;
            }
        }
        // morning sun path, count down from midday
        for (let hour = 12; hour > sunrise; hour = hour - hour_step) {
            const am_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (am_vec.z > -1e-6) {
                one_day_path.splice(1, 0, am_vec);
            } else {
                break;
            }
        }
        // afternoon sunpath, count up from midday
        for (let hour = 12 + hour_step; hour < sunset; hour = hour + hour_step) {
            const pm_vec: THREE.Vector3 = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (pm_vec.z > -1e-6) {
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
    // console.log("num rays = ", arrMakeFlat(directions).length);
    return directions;
}
function _solarRaysIndirectTjs(latitude: number, north: Txy, detail: number): THREE.Vector3[] {
    const hedron_tjs: THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, detail + 2);
    const solar_offset = Math.cos(degToRad(false, 66.5) as number);
    // get the atitude angle in radians
    const latitude_rad: number = degToRad(false, latitude) as number;
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // calc vectors
    const indirect_vecs: THREE.Vector3[] = [];
    for (const vec of hedron_tjs.vertices) {
        if (Math.abs(vec.y) > solar_offset) {
            vec.applyAxisAngle(XAXIS, latitude_rad);
            vec.applyAxisAngle(ZAXIS, -north_rad);
            if (vec.z > -1e-6) {
                indirect_vecs.push(vec);
            }
        }
    }
    // console.log("num rays = ", indirect_vecs.length);
    return indirect_vecs;
}
// calc the max solar exposure for a point with no obstructions facing straight up
function _calcMaxExposure(directions_tjs: THREE.Vector3[], weighted: boolean): number {
    if (!weighted) { return directions_tjs.length; }
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
function _calcExposure(origins_normals_tjs: [THREE.Vector3, THREE.Vector3][],
        directions_tjs: THREE.Vector3[], mesh_tjs: THREE.Mesh,
        limits: [number, number], weighted: boolean): number[] {
    const results = [];
    const result_max: number = _calcMaxExposure(directions_tjs, weighted);
    for (const [origin_tjs, normal_tjs] of origins_normals_tjs) {
        let result = 0;
        for (const direction_tjs of directions_tjs) {
            const dot_normal_direction: number = normal_tjs.dot(direction_tjs);
            if (dot_normal_direction > 0) {
                const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, direction_tjs, limits[0], limits[1]);
                const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
                if (isects.length === 0) {
                    if (weighted) {
                        // this applies the cosine weighting rule
                        result = result + dot_normal_direction;
                    } else {
                        // this applies no cosine weighting
                        result = result + 1;
                    }
                }
            }
        }
        results.push(result / result_max);
    }
    return results;
}
// ================================================================================================
export enum _ESunPathMethod {
    DIRECT = 'direct',
    INDIRECT = 'indirect',
    SKY = 'sky'
}
/**
 * Generates a sun path, oriented according to the geolocation and north direction.
 * The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
 * Note that the solar exposure calculations do not require the sub path to be visualized.
 * \n
 * The sun path takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
 * \n
 * @param __model__
 * @param origins The origins of the rays
 * @param detail The level of detail for the analysis
 * @param radius The radius of the sun path
 * @param method Enum, the type of sky to generate.
 */
export function SkyDome(__model__: GIModel, origin: Txyz|TRay|TPlane, detail: number,
        radius: number, method: _ESunPathMethod): TId[]|TId[][] {
    // --- Error Check ---
    const fn_name = 'analyze.SkyDome';
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (__model__.debug) {
        checkArgs(fn_name, 'origin', origin, [ArgCh.isXYZ, ArgCh.isRay, ArgCh.isPln]);
        checkArgs(fn_name, 'detail', detail, [ArgCh.isInt]);
        if (detail < 0 || detail > 6) {
            throw new Error (fn_name + ': "detail" must be an integer between 0 and 6.');
        }
        checkArgs(fn_name, 'radius', radius, [ArgCh.isNum]);
        if (method !== _ESunPathMethod.SKY) {
            if (!__model__.modeldata.attribs.query.hasModelAttrib('geolocation')) {
                throw new Error('analyze.Solar: model attribute "geolocation" is missing, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}');
            } else {
                const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
                if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                    latitude = geolocation['latitude'];
                } else {
                    throw new Error('analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                        e.g. @geolocation = {"latitude":12, "longitude":34}');
                }
            }
            if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
                north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
                if (!Array.isArray(north) || north.length !== 2) {
                    throw new Error('analyze.Solar: model has a "north" attribute with the wrong type, \
                    it should be a vector with two values, \
                    e.g. @north =  [1,2]');
                }
            }
        }
    } else {
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        }
    }
    // --- Error Check ---
    // create the matrix one time
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    const origin_depth: number = getArrDepth(origin);
    if (origin_depth === 2 && origin.length === 2) {
        // origin is a ray
        matrix.makeTranslation(...origin[0] as Txyz);
    } else if (origin_depth === 2 && origin.length === 3) {
        // origin is a plane
        // matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane); // TODO xform not nceessary
        matrix.makeTranslation(...origin[0] as Txyz);
    } else {
        // origin is Txyz
        matrix.makeTranslation(...origin as Txyz);
    }
    // generate the positions on the sky dome
    switch (method) {
        case _ESunPathMethod.DIRECT:
            const rays_dirs_tjs1: THREE.Vector3[][] = _solarRaysDirectTjs(latitude, north, detail);
            return _sunPathGenPosisNested(__model__, rays_dirs_tjs1, radius, matrix);
        case _ESunPathMethod.INDIRECT:
            const rays_dirs_tjs2: THREE.Vector3[] = _solarRaysIndirectTjs(latitude, north, detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs2, radius, matrix);
        case _ESunPathMethod.SKY:
            const rays_dirs_tjs3: THREE.Vector3[] = _skyRayDirsTjs(detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs3, radius, matrix);
        default:
            throw new Error('Sunpath method not recognised.');
    }
}
function _sunPathGenPosisNested(__model__: GIModel, rays_dirs_tjs: THREE.Vector3[][],
        radius: number, matrix: THREE.Matrix4): TId[][] {
    const posis: TId[][] = [];
    for (const one_day_tjs of rays_dirs_tjs) {
        posis.push(_sunPathGenPosis(__model__, one_day_tjs, radius, matrix));
    }
    return posis;
}
function _sunPathGenPosis(__model__: GIModel, rays_dirs_tjs: THREE.Vector3[],
        radius: number, matrix: THREE.Matrix4): TId[] {
    const posis_i: number[] = [];
    for (const direction_tjs of rays_dirs_tjs) {
        let xyz: Txyz = vecMult([direction_tjs.x, direction_tjs.y, direction_tjs.z], radius);
        xyz = multMatrix(xyz, matrix);
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Finds the nearest positions within a certain maximum radius.
 * \n
 * The neighbors to each source position is calculated as follows:
 * 1) Calculate the distance to all target positions.
 * 2) Creat the neighbors set by filtering out target positions that are further than the maximum radius.
 * 3) If the number of neighbors is greater than 'max_neighbors',
 * then select the 'max_neighbors' closest target positions.
 * \n
 * Returns a dictionary containing the nearest positions.
 * \n
 * If 'num_neighbors' is 1, the dictionary will contain two lists:
 * 1) 'posis': a list of positions, a subset of positions from the source.
 * 2) 'neighbors': a list of neighbouring positions, a subset of positions from target.
  * \n
 * If 'num_neighbors' is greater than 1, the dictionary will contain two lists:
 * 1) 'posis': a list of positions, a subset of positions from the source.
 * 2) 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * @param target A list of positions, or entities from which positions can be extracted.
 * If null, the positions in source will be used.
 * @param radius The maximum distance for neighbors. If null, Infinity will be used.
 * @param max_neighbors The maximum number of neighbors to return.
 * If null, the number of positions in target is used.
 * @returns A dictionary containing the results.
 */
export function Nearest(__model__: GIModel,
        source: TId|TId[], target: TId|TId[], radius: number, max_neighbors: number):
        {'posis': TId[], 'neighbors': TId[]|TId[][], 'distances': number[]|number[][]} {
    if (target === null) { target = source; } // TODO optimise
    source = arrMakeFlat(source) as TId[];
    target = arrMakeFlat(target) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Nearest';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        target_ents_arrs  = idsBreak(target) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
    const result: [number[], number[]|number[][], number[]|number[][]] =
        _nearest(__model__, source_posis_i, target_posis_i, radius, max_neighbors);
    // return dictionary with results
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, result[0]) as TId[],
        'neighbors': idsMakeFromIdxs(EEntType.POSI, result[1]) as TId[][]|TId[],
        'distances': result[2] as number[]|number[][]
    };
}
function _fuseDistSq(xyz1: number[], xyz2: number[]): number {
    return Math.pow(xyz1[0] - xyz2[0], 2) +  Math.pow(xyz1[1] - xyz2[1], 2) +  Math.pow(xyz1[2] - xyz2[2], 2);
}
function _nearest(__model__: GIModel, source_posis_i: number[], target_posis_i: number[],
        dist: number, num_neighbors: number): [number[], number[]|number[][], number[]|number[][]] {
    // create a list of all posis
    const set_target_posis_i: Set<number> = new Set(target_posis_i);
    const set_posis_i: Set<number> = new Set(target_posis_i);
    for (const posi_i of source_posis_i) { set_posis_i.add(posi_i); }
    const posis_i: number[] = Array.from(set_posis_i);
    // get dist and num_neighbours
    if (dist === null) { dist = Infinity; }
    if (num_neighbors === null) { num_neighbors = target_posis_i.length; }
    // find neighbor
    const map_posi_i_to_xyz: Map<number, Txyz> = new Map();
    const typed_positions = new Float32Array( posis_i.length * 4 );
    const typed_buff = new THREE.BufferGeometry();
    typed_buff.setAttribute( 'position', new THREE.BufferAttribute( typed_positions, 4 ) );
    for (let i = 0; i < posis_i.length; i++) {
        const posi_i: number = posis_i[i];
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_to_xyz.set(posi_i, xyz);
        typed_positions[ i * 4 + 0 ] = xyz[0];
        typed_positions[ i * 4 + 1 ] = xyz[1];
        typed_positions[ i * 4 + 2 ] = xyz[2];
        typed_positions[ i * 4 + 3 ] = posi_i;
    }
    const kdtree = new TypedArrayUtils.Kdtree( typed_positions, _fuseDistSq, 4 );
    // calculate the dist squared
    const num_posis: number = posis_i.length;
    const dist_sq: number = dist * dist;
    // deal with special case, num_neighbors === 1
    if (num_neighbors === 1) {
        const result1: [number[], number[], number[]] = [[], [], []];
        for (const posi_i of source_posis_i) {
            const nn = kdtree.nearest( map_posi_i_to_xyz.get(posi_i) as any, num_posis, dist_sq );
            let min_dist = Infinity;
            let nn_posi_i: number;
            for (const a_nn of nn) {
                const next_nn_posi_i: number = a_nn[0].obj[3];
                if (set_target_posis_i.has(next_nn_posi_i) && a_nn[1] < min_dist) {
                    min_dist = a_nn[1];
                    nn_posi_i = next_nn_posi_i;
                }
            }
            if (nn_posi_i !== undefined) {
                result1[0].push(posi_i);
                result1[1].push(nn_posi_i);
                result1[2].push(Math.sqrt(min_dist));
            }
        }
        return result1;
    }
    // create a neighbors list
    const result: [number[], number[][], number[][]] = [[], [], []];
    for (const posi_i of source_posis_i) {
        // TODO at the moment is gets all posis since no distinction is made between source and traget
        // TODO kdtree could be optimised
        const nn = kdtree.nearest( map_posi_i_to_xyz.get(posi_i) as any, num_posis, dist_sq );
        const posis_i_dists: [number, number][] = [];
        for (const a_nn of nn) {
            const nn_posi_i: number = a_nn[0].obj[3];
            if (set_target_posis_i.has(nn_posi_i)) {
                posis_i_dists.push([nn_posi_i, a_nn[1]]);
            }
        }
        posis_i_dists.sort( (a, b) => a[1] - b[1] );
        const nn_posis_i: number[] = [];
        const nn_dists: number[] = [];
        for (const posi_i_dist  of posis_i_dists) {
            nn_posis_i.push(posi_i_dist[0]);
            nn_dists.push(Math.sqrt(posi_i_dist[1]));
            if (nn_posis_i.length === num_neighbors) { break; }
        }
        if (nn_posis_i.length > 0) {
            result[0].push(posi_i);
            result[1].push(nn_posis_i);
            result[2].push(nn_dists);
        }
    }
    return result;
}
// ================================================================================================
interface TShortestPathResult {
    source_posis?: TId[];
    distances?: number[]|number[][];
    edges?: TId[];
    posis?: TId[];
    edges_count?: number[];
    posis_count?: number[];
    edge_paths?: TId[][];
    posi_paths?: TId[][];
}
export enum _EShortestPathMethod {
    UNDIRECTED = 'undirected',
    DIRECTED = 'directed'
}
export enum _EShortestPathResult {
    DISTS = 'distances',
    COUNTS = 'counts',
    PATHS = 'paths',
    ALL = 'all'
}
/**
 * Calculates the shortest path from every source position to every target position.
 * \n
 * Paths are calculated through a network of connected edges.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * \n
 * Each edge can be assigned a weight.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * By default, all edges are assigned a weight of 1.
 * Default weights can be overridden by creating a numeric attribute on edges call 'weight'.
 * \n
 * Returns a dictionary containing the shortest paths.
 * \n
 * If 'distances' is selected, the dictionary will contain two list:
 * 1) 'source_posis': a list of start positions for eah path,
 * 2) 'distances': a list of distances, one list for each path starting at each source position.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1) 'posis': a list of positions traversed by the paths,
 * 2) 'posis_count': a list of numbers that count how often each position was traversed,
 * 3) 'edges': a list of edges traversed by the paths,
 * 4) 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1) 'posi_paths': a list of lists of positions, one list for each path,
 * 2) 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path target, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ShortestPath(__model__: GIModel, source: TId|TId[]|TId[][][], target: TId|TId[]|TId[][],
        entities: TId|TId[]|TId[][], method: _EShortestPathMethod, result: _EShortestPathResult): TShortestPathResult {

    source = source === null ? [] : arrMakeFlat(source) as TId[];
    target = target === null ? [] : arrMakeFlat(target) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        target_ents_arrs = idsBreak(target) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_dists = true;
    let return_counts = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.DISTS:
            return_paths = false;
            return_counts = false;
            break;
        case _EShortestPathResult.COUNTS:
            return_dists = false;
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_dists = false;
            return_counts = false;
            break;
        default:
            // all true
            break;
    }
    const source_posis_i: number[] = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems: any[] = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i: Map<number, number> = new Map();
    const map_posis_i: Map<number, number> = new Map();
    const posi_paths: number[][] = [];
    const edge_paths: number[][] = [];
    const all_path_dists: number[][] = [];
    for (const source_posi_i of source_posis_i) {
        const path_dists: number[] = [];
        const cy_source_elem = cy.getElementById( source_posi_i.toString() );
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed
        });
        for (const target_posi_i of target_posis_i) {
            const cy_node = cy.getElementById( target_posi_i.toString() );
            const dist: number = dijkstra.distanceTo(cy_node);
            const cy_path = dijkstra.pathTo(cy_node);
            const posi_path: number[] = [];
            const edge_path: number[] = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i: number = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        } else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i: number = cy_path_elem.data('idx2');
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
                    const posi_i: number = cy_path_elem.data('idx');
                    if (return_counts) {
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
            if (return_dists) {
                path_dists.push(dist);
            }
        }
        all_path_dists.push(path_dists);
    }
    const dict: TShortestPathResult = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i) as TId[];
        dict.distances = source_posis_i.length === 1 ? all_path_dists[0] : all_path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis =  idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict.posis_count =  Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths =  idsMakeFromIdxs(EEntType.EDGE, edge_paths) as TId[][];
        dict.posi_paths =  idsMakeFromIdxs(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}

function _getUniquePosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    if (ents_arr.length === 0) { return []; }
    const set_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    return Array.from(set_posis_i);
}
function _cytoscapeWeightFn(edge: cytoscape.EdgeSingular) {
    return edge.data('weight');
}
function _cytoscapeWeightFn2(edge: cytoscape.EdgeSingular) {
    const weight: number = edge.data('weight');
    if (weight < 1) { return 1; }
    return weight;
}
function _cytoscapeGetElements(__model__: GIModel, ents_arr: TEntTypeIdx[],
        source_posis_i: number[], target_posis_i: number[], directed: boolean): any[] {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with cource and target
    const set_posis_i: Set<number> = new Set(source_posis_i);
    for (const target_posi_i of target_posis_i) { set_posis_i.add(target_posi_i); }
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            set_edges_i.add(edge_i);
        }
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
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
            const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight') as number;
            } else {
                const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = distance(c0, c1);
            }
            elements.push( {  data: { id: 'e' + edge_i,
                source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i} } );
        }
    } else {
        // undirected
        const map_edges_ab: Map<string, any> = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id: string = 'e_' + edge_posis_i[0].toString() + '_' + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj['data']['idx2'] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            } else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight') as number;
                } else {
                    const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
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
// ================================================================================================
interface TClosestPathResult {
    source_posis?: TId[];
    distances?: number[];
    edges?: TId[];
    posis?: TId[];
    edges_count?: number[];
    posis_count?: number[];
    edge_paths?: TId[][];
    posi_paths?: TId[][];
}
/**
 * Calculates the shortest path from every position in source, to the closest position in target.
 * \n
 * This differs from the 'analyze.ShortestPath()' function. If you specify multiple target positions,
 * for each cource position,
 * the 'analyze.ShortestPath()' function will calculate multiple shortest paths,
 * i.e. the shortest path to all targets.
 * This function will caculate just one shortest path,
 * i.e. the shortest path to the closest target.
 * \n
 * Paths are calculated through a network of connected edges.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * \n
 * Each edge can be assigned a weight.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * By default, all edges are assigned a weight of 1.
 * Default weights can be overridden by creating a numeric attribute on edges call 'weight'.
 * \n
 * Returns a dictionary containing the shortes paths.
 * \n
 * If 'distances' is selected, the dictionary will contain one list:
 * 1) 'distances': a list of distances.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1) 'posis': a list of positions traversed by the paths,
 * 2) 'posis_count': a list of numbers that count how often each position was traversed.
 * 3) 'edges': a list of edges traversed by the paths,
 * 4) 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1) 'posi_paths': a list of lists of positions, one list for each path.
 * 2) 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path source, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ClosestPath(__model__: GIModel, source: TId|TId[]|TId[][][], target: TId|TId[]|TId[][],
        entities: TId|TId[]|TId[][], method: _EShortestPathMethod, result: _EShortestPathResult): TClosestPathResult {

    source = source === null ? [] : arrMakeFlat(source) as TId[];
    target = target === null ? [] : arrMakeFlat(target) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ClosestPath';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        target_ents_arrs = idsBreak(target) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_dists = true;
    let return_counts = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.DISTS:
            return_paths = false;
            return_counts = false;
            break;
        case _EShortestPathResult.COUNTS:
            return_dists = false;
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_dists = false;
            return_counts = false;
            break;
        default:
            // all true
            break;
    }
    const source_posis_i: number[] = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems: any[] = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i: Map<number, number> = new Map();
    const map_posis_i: Map<number, number> = new Map();
    const posi_paths: number[][] = [];
    const edge_paths: number[][] = [];
    const path_dists: number[] = [];
    for (const source_posi_i of source_posis_i) {
        const cy_source_elem = cy.getElementById( source_posi_i.toString() );
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed
        });
        let closest_target_posi_i: number = null;
        let closest_dist = Infinity;
        for (const target_posi_i of target_posis_i) {
            // find shortest path
            const dist: number =
                dijkstra.distanceTo( cy.getElementById( target_posi_i.toString() ) );
            if (dist < closest_dist) {
                closest_dist = dist;
                closest_target_posi_i = target_posi_i;
            }
        }
        if (closest_target_posi_i !== null) {
            // get shortest path
            const cy_path: cytoscape.CollectionReturnValue =
                dijkstra.pathTo( cy.getElementById( closest_target_posi_i.toString() ) );
            // get the data
            const posi_path: number[] = [];
            const edge_path: number[] = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i: number = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        } else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i: number = cy_path_elem.data('idx2');
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
                    const posi_i: number = cy_path_elem.data('idx');
                    if (return_counts) {
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
            if (return_dists) {
                path_dists.push(closest_dist);
            }
        } else {
            if (return_paths) {
                edge_paths.push([]);
                posi_paths.push([]);
            }
            if (return_dists) {
                path_dists.push(1e8); // TODO, cannot pas Infinity due to JSON issues
            }
        }
    }
    const dict: TClosestPathResult = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i) as TId[];
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis =  idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict.posis_count =  Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths =  idsMakeFromIdxs(EEntType.EDGE, edge_paths) as TId[][];
        dict.posi_paths =  idsMakeFromIdxs(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}
// ================================================================================================
export enum _ECentralityMethod {
    UNDIRECTED = 'undirected',
    DIRECTED = 'directed'
}
function _cyGetPosisAndElements(__model__: GIModel, ents_arr: TEntTypeIdx[],
    posis_i: number[], directed: boolean): [cytoscape.ElementDefinition[], number[]] {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with posis_i
    const set_posis_i: Set<number> = new Set(posis_i);
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const n_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of n_edges_i) {
            set_edges_i.add(edge_i);
        }
        const n_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of n_posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // all unique posis
    const uniq_posis_i: number[] =  Array.from(set_posis_i);
    // create elements
    const elements: cytoscape.ElementDefinition[] = [];
    for (const posi_i of uniq_posis_i) {
        elements.push( {  data: { id: posi_i.toString(), idx: posi_i} } );
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight') as number;
            } else {
                // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = 1; // distance(c0, c1);
            }
            elements.push( {  data: { id: 'e' + edge_i,
                source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i} } );
        }
    } else {
        // undirected
        const map_edges_ab: Map<string, any> = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id: string = 'e_' + edge_posis_i[0].toString() + '_' + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj['data']['idx2'] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            } else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight') as number;
                } else {
                    // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = 1; // distance(c0, c1);
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
    return [elements, uniq_posis_i];
}
// ================================================================================================
/**
 * Calculates degree centrality for positions in a netowrk. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Degree centrality is based on the idea that the centrality of a position in a network is related to
 * the number of direct links that it has to other positions.
 * \n
 * If 'undirected' is selected,  degree centrality is calculated by summing up the weights
 * of all edges connected to a position.
 * If 'directed' is selected, then two types of centrality are calculated: incoming degree and
 * outgoing degree.
 * Incoming degree is calculated by summing up the weights of all incoming edges connected to a position.
 * Outgoing degree is calculated by summing up the weights of all outgoing edges connected to a position.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * If 'undirected' is selected, the dictionary will contain  the following:
 * 1) 'posis': a list of position IDs.
 * 2) 'degree': a list of numbers, the values for degree centrality.
 * \n
 * If 'directed' is selected, the dictionary will contain  the following:
 * 1) 'posis': a list of position IDs.
 * 2) 'indegree': a list of numbers, the values for incoming degree centrality.
 * 3) 'outdegree': a list of numbers, the values for outgoing degree centrality.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param alpha The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
 * disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
 * disregards number of edges and solely uses the edge weights in the centrality calculation.
 * @param method Enum, the method to use, directed or undirected.
 * @returns A dictionary containing the results.
 */
export function Degree(__model__: GIModel, source: TId|TId[]|TId[][][],
        entities: TId|TId[]|TId[][], alpha: number, method: _ECentralityMethod): any {
    // source posis and network entities
    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Degree';
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, 'source', source,
                [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);

    // TODO deal with source === null

    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
        _cyGetPosisAndElements(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        return _centralityDegreeDirected(posis_i, cy_network, alpha);
    } else {
        return _centralityDegreeUndirected(posis_i, cy_network, alpha);
    }
}
function _centralityDegreeDirected(posis_i: number[], cy_network: any, alpha: number): any {
    const indegree: number[] = [];
    const outdegree: number[] = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: true
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById( posi_i.toString() );
        indegree.push( cy_centrality.indegree(source_elem) );
        outdegree.push( cy_centrality.outdegree(source_elem) );
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'indegree': indegree,
        'outdegree': outdegree
    };
}
function _centralityDegreeUndirected(posis_i: number[], cy_network: any, alpha: number) {
    const degree: number[] = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: false
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById( posi_i.toString() );
        degree.push( cy_centrality.degree(source_elem) );
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'degree': degree
    };
}
// ================================================================================================
export enum _ECentralityType {
    BETWEENNESS = 'betweenness',
    CLOSENESS = 'closeness',
    HARMONIC = 'harmonic'
}
/**
 * Calculates betweenness, closeness, and harmonic centrality
 * for positions in a netowrk. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Centralities are calculate based on distances between positions.
 * The distance between two positions is the shortest path between those positions.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Closeness centrality is calculated by inverting the sum of the distances to all other positions.
 * \n
 * Harmonic centrality is calculated by summing up the inverted distances to all other positions.
 * \n
 * Betweenness centrality os calculated in two steps.
 * First, the shortest path between every pair of nodes is calculated.
 * Second, the betweenness centrality of each node is then the total number of times the node is traversed
 * by the shortest paths.
 * \n
 * For closeness centrality, the network is first split up into connected sub-networks.
 * This is because closeness centrality cannot be calculated on networks that are not fully connected.
 * The closeness centrality is then calculated for each sub-network seperately.
 * \n
 * For harmonic centrality, care must be taken when defining custom weights.
 * Weight with zero values or very small values will result in errors or will distort the results.
 * This is due to the inversion operation: 1 / weight.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * 1) 'posis': a list of position IDs.
 * 2) 'centrality': a list of numbers, the values for centrality, either betweenness, closeness, or harmonic.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param cen_type Enum, the data to return, positions, edges, or both.
 * @returns A list of centrality values, between 0 and 1.
 */
export function Centrality(__model__: GIModel, source: TId|TId[]|TId[][][],
        entities: TId|TId[]|TId[][], method: _ECentralityMethod, cen_type: _ECentralityType): any {
    // source posis and network entities
    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.Centrality';
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, 'source', source,
                [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);

     // TODO deal with source === null

    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
        _cyGetPosisAndElements(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    // calculate the centrality
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    switch (cen_type) {
        case _ECentralityType.CLOSENESS:
            return _centralityCloseness(posis_i, cy_network, directed);
        case _ECentralityType.HARMONIC:
            return _centralityHarmonic(posis_i, cy_network, directed);
        case _ECentralityType.BETWEENNESS:
            return _centralityBetweenness(posis_i, cy_network, directed);
        default:
            throw new Error('Centrality type not recognised.');
    }
}
function _centralityCloseness(posis_i: number[], cy_network: cytoscape.Core,  directed: boolean) {
    const results: number[] = [];
    const result_posis_i: number[] = [];
    const comps: number[][] = [];
    const cy_colls: cytoscape.Collection[] = cy_network.elements().components();
    cy_colls.sort( (a, b) => b.length - a.length);
    for (const cy_coll of cy_colls) {
        const comp: number[] = [];
        const cy_centrality: any = cy_coll.closenessCentralityNormalized({
            weight: _cytoscapeWeightFn,
            harmonic: false,
            directed: directed
        });
        for (const posi_i of posis_i) {
            const source_elem = cy_coll.getElementById( posi_i.toString() );
            if (source_elem.length === 0) { continue; }
            const result = cy_centrality.closeness(source_elem);
            if (isNaN(result)) {
                throw new Error('Error calculating closeness centrality.');
            }
            result_posis_i.push(posi_i);
            comp.push(posi_i);
            results.push( result );
        }
        comps.push(comp);
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, result_posis_i),
        'centrality': results
    };
}

function _centralityHarmonic(posis_i: number[], cy_network: cytoscape.Core,  directed: boolean) {
    const results: number[] = [];
    const cy_centrality: any = cy_network.elements().closenessCentralityNormalized({
        weight: _cytoscapeWeightFn,
        harmonic: true,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById( posi_i.toString() );
        if (source_elem.length === 0) { continue; }
        const result = cy_centrality.closeness(source_elem);
        if (isNaN(result)) {
            throw new Error('Error calculating harmonic centrality.');
        }
        results.push( result );
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'centrality': results
    };
}
function _centralityBetweenness(posis_i: number[], cy_network: cytoscape.Core, directed: boolean) {
    const results: number[] = [];
    const cy_centrality = cy_network.elements().betweennessCentrality({
        weight: _cytoscapeWeightFn,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById( posi_i.toString() );
        const result = cy_centrality.betweennessNormalized(source_elem);
        if (isNaN(result)) {
            throw new Error('Error calculating betweenness centrality.');
        }
        results.push( result );
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'centrality': results
    };
}
