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
import { checkIDs, checkArgTypes, IDcheckObj, TypeCheckObj, splitIDs} from '../_check_args';
import uscore from 'underscore';
import { sum } from '@assets/core/inline/_mathjs';
import { min, max } from '@assets/core/inline/_math';
import { arrMakeFlat, arrIdxRem } from '@assets/libs/util/arrs';
import { degToRad } from '@assets/core/inline/_conversion';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { XAXIS, YAXIS, ZAXIS } from '@assets/libs/geom/constants';
import cytoscape from 'cytoscape';
import * as THREE from 'three';
import { TypedArrayUtils } from 'three/examples/jsm/utils/TypedArrayUtils.js';

// ================================================================================================
/**
 * Finds the nearest positions within a certain maximum distance.
 * ~
 * Returns a dictionary containing the shortes paths.
 * ~
 * If 'num_neighbors' is 1, the dictionary will contain two lists:
 * 1) 'ps': a list of positions, a subset of positions from the source.
 * 2) 'neighbors': a list of neighbouring positions, a subset of positions from target.
  * ~
 * If 'num_neighbors' is greater than 1, the dictionary will contain two lists:
 * 1) 'ps': a list of positions, a subset of positions from the source.
 * 2) 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.
 * ~
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * @param target A list of positions, or entities from which positions can be extracted.
 * If null, the positions in source will be used.
 * @param max_dist The maximum distance for neighbors. If null, Infinity will be used.
 * @param max_neighbors The maximum number of neighbors to return. 
 * If null, the number of positions in target is used.
 * @returns A dictionary containing the results.
 */
export function Nearest(__model__: GIModel,
        source: TId|TId[], target: TId|TId[], max_dist: number, max_neighbors: number):
        {'ps': TId[], 'neighbors': TId[]|TId[][], 'distances': number[]|number[][]} {
    if (target === null) { target = source; } // TODO optimise
    source = arrMakeFlat(source) as TId[];
    target = arrMakeFlat(target) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        source_ents_arrs = splitIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = splitIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
    const result: [number[], number[]|number[][], number[]|number[][]] =
        _nearest(__model__, source_posis_i, target_posis_i, max_dist, max_neighbors);
    // return dictionary with results
    return {
        'ps': idsMakeFromIndicies(EEntType.POSI, result[0]) as TId[],
        'neighbors': idsMakeFromIndicies(EEntType.POSI, result[1]) as TId[][]|TId[],
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
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        map_posi_i_to_xyz.set(posi_i, xyz);
        typed_positions[ i * 4 + 0 ] = xyz[0];
        typed_positions[ i * 4 + 1 ] = xyz[1];
        typed_positions[ i * 4 + 2 ] = xyz[2];
        typed_positions[ i * 4 + 3 ] = posi_i;
    }
    const kdtree = new TypedArrayUtils.Kdtree( typed_positions, _fuseDistSq, 4 );
    // calculate teh dist squared
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
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arrs = splitIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    }
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
    let ents_arrs: TEntTypeIdx[];
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (__model__.debug) {
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        if (!__model__.attribs.query.hasModelAttrib('geolocation')) {
            throw new Error('analyze.Solar: geolocation model attribute is missing, \
                e.g. geolocation = {"latitude":12, "longitude":34}');
        } else {
            const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
            if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                latitude = geolocation['latitude'];
            } else {
                throw new Error('analyze.Solar: geolocation model attribute is missing the "latitude" key, \
                    e.g. geolocation = {"latitude":12, "longitude":34}');
            }
            if (uscore.has(geolocation, 'north')) {
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
    } else {
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        north = geolocation['north'] as Txy;
    }
    // TODO
    // TODO
    // --- Error Check ---
    const origins_tjs: [THREE.Vector3, THREE.Vector3][] = _solarOriginsTjs(__model__, origins, 0.01);
    const mesh_tjs: THREE.Mesh = _createMeshTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get the direction vectors
    const directions_tjs: THREE.Vector3[] = uscore.flatten(_solarDirectionsTjs(latitude, north, detail, method));
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
    if (__model__.debug) {
        if (!__model__.attribs.query.hasModelAttrib('geolocation')) {
            throw new Error('analyze.Solar: geolocation model attribute is missing, \
                e.g. geolocation = {"latitude":12, "longitude":34}');
        } else {
            const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
            if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                latitude = geolocation['latitude'];
            } else {
                throw new Error('analyze.Solar: geolocation model attribute is missing the "latitude" key, \
                    e.g. geolocation = {"latitude":12, "longitude":34}');
            }
            if (uscore.has(geolocation, 'north')) {
                if (Array.isArray(geolocation['north']) && geolocation['north'].length === 2) {
                    north = geolocation['north'] as Txy;
                } else {
                    throw new Error('analyze.Solar: geolocation model attribute has a "north" value with the wrong type, \
                    it should be a vector with two values, \
                    e.g. geolocation = {"latitude":12, "longitude":34, "north":[1,2]}');
                }
            }
        }
    } else {
        const geolocation = __model__.attribs.query.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        north = geolocation['north'] as Txy;
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
    DISTS = 'distances',
    COUNTS = 'counts',
    PATHS = 'paths',
    ALL = 'all'
}
/**
 * Calculates the shortest path from every position in source, to every position in target.
 * ~
 * Returns a dictionary containing the shortest paths.
 * ~
 * If 'distances' is selected, the dictionary will contain two list:
 * 1) 'source_ps': a list of start positions for eah path,
 * 2) 'distances': a list of distances, one list for each path.
 * ~
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1) 'ps': a list of positions traversed by the paths,
 * 2) 'ps_count': a list of numbers that count how often each position was traversed,
 * 3) '_e': a list of edges traversed by the paths,
 * 4) '_e_count': a list of numbers that count how often each edge was traversed.
 * ~
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1) 'ps_paths': a list of lists of positions, one list for each path,
 * 2) '_e_paths': a list of lists of edges, one list for each path.
 * ~
 * If 'all' is selected, the dictionary will contain all lists just described.
 * ~
 * The network must consist of vertices that are welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * ~
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * ~
 * @param __model__
 * @param source Path origins, positions, or entities from which positions can be extracted.
 * @param target Path destinations, positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ShortestPath(__model__: GIModel, source: TId|TId[]|TId[][][], target: TId|TId[]|TId[][],
        entities: TId|TId[]|TId[][], method: _EShortestPathMethod, result: _EShortestPathResult):
        {
            source_ps?: TId[], distances?: number[],
            _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[],
            _e_paths?: TId[][], ps_paths?: TId[][]
        } {

    source = arrMakeFlat(source) as TId[];
    target = arrMakeFlat(target) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        source_ents_arrs = splitIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = splitIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
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
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
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
                path_dists.push(dist);
            }
        }
    }
    const dict: {
        source_ps?: TId[], distances?: number[]
        _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[],
        _e_paths?: TId[][], ps_paths?: TId[][]
    } = {};
    if (return_dists) {
        dict.source_ps = idsMakeFromIndicies(EEntType.POSI, source_posis_i) as TId[];
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict._e = idsMakeFromIndicies(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict._e_count = Array.from(map_edges_i.values());
        dict.ps =  idsMakeFromIndicies(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict.ps_count =  Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict._e_paths =  idsMakeFromIndicies(EEntType.EDGE, edge_paths) as TId[][];
        dict.ps_paths =  idsMakeFromIndicies(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}

function _getUniquePosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    if (ents_arr.length === 0) { return []; }
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

/**
 * Calculates the shortest path from every position in source, to the closest position in target.
 * ~
 * Returns a dictionary containing the shortes paths.
 * ~
 * If 'distances' is selected, the dictionary will contain one list:
 * 1) 'distances': a list of distances, one list for each path.
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
* If 'all' is selected, the dictionary will contain all lists just described.
 * ~
 * The network must consist of vertices that are welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * ~
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * ~
 * @param __model__
 * @param source Path origins, positions, or entities from which positions can be extracted.
 * @param target Path destinations, positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ClosestPath(__model__: GIModel, source: TId|TId[]|TId[][][], target: TId|TId[]|TId[][],
        entities: TId|TId[]|TId[][], method: _EShortestPathMethod, result: _EShortestPathResult):
        {
            source_ps?: TId[], distances?: number[],
            _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[],
            _e_paths?: TId[][], ps_paths?: TId[][]
        } {

    source = arrMakeFlat(source) as TId[];
    target = arrMakeFlat(target) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        source_ents_arrs = splitIDs(fn_name, 'origins', source,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        target_ents_arrs = splitIDs(fn_name, 'destinations', target,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
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
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
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
        }
    }
    const dict: {
        source_ps?: TId[], distances?: number[]
        _e?: TId[], ps?: TId[], _e_count?: number[], ps_count?: number[],
        _e_paths?: TId[][], ps_paths?: TId[][]
    } = {};
    if (return_dists) {
        dict.source_ps = idsMakeFromIndicies(EEntType.POSI, source_posis_i) as TId[];
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict._e = idsMakeFromIndicies(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict._e_count = Array.from(map_edges_i.values());
        dict.ps =  idsMakeFromIndicies(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict.ps_count =  Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict._e_paths =  idsMakeFromIndicies(EEntType.EDGE, edge_paths) as TId[][];
        dict.ps_paths =  idsMakeFromIndicies(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}
// ================================================================================================
export enum _ECentralityMethod {
    DIRECTED = 'directed',
    UNDIRECTED = 'undirected'
}
// export enum _ECentralityType {
//     DEGREE = 'degree',
//     CLOSENESS = 'closeness',
//     HARMONIC = 'harmonic',
//     BETWEENNESS = 'betweenness'
// }
// /**
//  * Calculates centrality metrics for a netowrk.
//  * ~
//  * ~
//  * @param __model__
//  * @param source Positions, or entities from which positions can be extracted.
//  * @param entities The network, edges, or entities from which edges can be extracted.
//  * @param method Enum, the method to use, directed or undirected.
//  * @param cen_type Enum, the data to return, positions, edges, or both.
//  */
// export function Centrality(__model__: GIModel, source: TId|TId[]|TId[][][],
//         entities: TId|TId[]|TId[][], method: _ECentralityMethod, cen_type: _ECentralityType): any {

//     if (source === null) {
//         source = [];
//     } else {
//         source = arrMakeFlat(source) as TId[];
//     }
//     entities = arrMakeFlat(entities) as TId[];
//     // --- Error Check ---
//     const fn_name = 'analyze.Centrality';
//     let source_ents_arrs: TEntTypeIdx[] = [];
//     if (source.length > 0) {
//         source_ents_arrs = checkIDs(fn_name, 'source', source,
//             [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
//     }
//     const ents_arrs: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
//         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
//     // --- Error Check ---
//     const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
//     const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
//     const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
//         _cytoscapeGetElements2(__model__, ents_arrs, source_posis_i, directed);
//     // create the cytoscape object
//     const cy = cytoscape({
//         elements: elements,
//         headless: true,
//     });
//     let cytoscape_centrality: any;
//     const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
//     switch (cen_type) {
//         // Degree Centrality
//         case _ECentralityType.DEGREE:
//             if (directed) {
//                 const indegree: number[] = [];
//                 const outdegree: number[] = [];
//                 cytoscape_centrality = cy.elements().degreeCentralityNormalized({
//                     weight: _cytoscapeWeightFn,
//                     alpha: 1,
//                     directed: directed
//                 });
//                 for (const posi_i of posis_i) {
//                     const source_elem = cy.getElementById( posi_i.toString() );
//                     indegree.push( cytoscape_centrality.indegree(source_elem) );
//                     outdegree.push( cytoscape_centrality.outdegree(source_elem) );
//                 }
//                 return { 'indegree': indegree, 'outdegree': outdegree };
//             } else {
//                 const degree: number[] = [];
//                 cytoscape_centrality = cy.elements().degreeCentralityNormalized({
//                     weight: _cytoscapeWeightFn,
//                     alpha: 1,
//                     directed: directed
//                 });
//                 for (const posi_i of posis_i) {
//                     const source_elem = cy.getElementById( posi_i.toString() );
//                     degree.push( cytoscape_centrality.degree(source_elem) );
//                 }
//                 return { 'degree': degree };
//             }
//             break;
//         // Closeness and Harmonic centrality
//         case _ECentralityType.HARMONIC:
//         case _ECentralityType.CLOSENESS:
//             const harmonic: boolean = cen_type === _ECentralityType.HARMONIC;
//             const closeness: number[] = [];
//             cytoscape_centrality = cy.elements().closenessCentralityNormalized({
//                 weight: _cytoscapeWeightFn,
//                 harmonic: harmonic,
//                 directed: directed
//             });
//             for (const posi_i of posis_i) {
//                 const source_elem = cy.getElementById( posi_i.toString() );
//                 closeness.push( cytoscape_centrality.closeness(source_elem) );
//             }
//             return { 'closeness': closeness  };
//         // Betweenness centrality
//         case _ECentralityType.BETWEENNESS:
//             const betweenness: number[] = [];
//             cytoscape_centrality = cy.elements().betweennessCentrality({
//                 weight: _cytoscapeWeightFn,
//                 directed: directed
//             });
//             for (const posi_i of posis_i) {
//                 const source_elem = cy.getElementById( posi_i.toString() );
//                 betweenness.push( cytoscape_centrality.betweennessNormalized(source_elem) );
//             }
//             return { 'betweenness': betweenness };
//         default:
//             throw new Error('Centrality type not recognised.');
//             break;
//     }
//     return null;
// }
function _cytoscapeGetElements2(__model__: GIModel, ents_arr: TEntTypeIdx[],
    posis_i: number[], directed: boolean): [cytoscape.ElementDefinition[], number[]] {
    let has_weight_attrib = false;
    if (__model__.attribs.query.hasAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with posis_i
    const set_posis_i: Set<number> = new Set(posis_i);
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const n_edges_i: number[] = __model__.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of n_edges_i) {
            set_edges_i.add(edge_i);
        }
        const n_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
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
    return [elements, uniq_posis_i];
}

// ================================================================================================
/**
 * Calculates degree centrality for a netowrk. Values are normalized.
 * ~
 * @param __model__
 * @param source Positions, or entities from which positions can be extracted. These positions should be in teh network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param alpha The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
 * disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
 * disregards number of edges and solely uses the edge weights in the centrality calculation.
 * @param method Enum, the method to use, directed or undirected.
 * @returns A dictionary, either { degree: [...] } if 'undirected' is selected,
 * or { indegree: [...], outdegree: [...] } if 'directed' is is selected.
 */
export function CentralityDeg(__model__: GIModel, source: TId|TId[]|TId[][][],
        entities: TId|TId[]|TId[][], alpha: number, method: _ECentralityMethod): any {

    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.CentralityDeg';
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        if (source.length > 0) {
            source_ents_arrs = splitIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
        _cytoscapeGetElements2(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: elements,
        headless: true,
    });
    let cytoscape_centrality: any;
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        const indegree: number[] = [];
        const outdegree: number[] = [];
        cytoscape_centrality = cy.elements().degreeCentralityNormalized({
            weight: _cytoscapeWeightFn,
            alpha: alpha,
            directed: directed
        });
        for (const posi_i of posis_i) {
            const source_elem = cy.getElementById( posi_i.toString() );
            indegree.push( cytoscape_centrality.indegree(source_elem) );
            outdegree.push( cytoscape_centrality.outdegree(source_elem) );
        }
        return { 'indegree': indegree, 'outdegree': outdegree };
    } else {
        const degree: number[] = [];
        cytoscape_centrality = cy.elements().degreeCentralityNormalized({
            weight: _cytoscapeWeightFn,
            alpha: alpha,
            directed: directed
        });
        for (const posi_i of posis_i) {
            const source_elem = cy.getElementById( posi_i.toString() );
            degree.push( cytoscape_centrality.degree(source_elem) );
        }
        return { 'degree': degree };
    }
}
// ================================================================================================
export enum _EClosenessCentralityType {
    ARITHMETIC = 'arithmetic',
    HARMONIC = 'harmonic',
}
/**
 * Calculates closness centrality for a netowrk. Values are normalized.
 * ~
 * ~
 * @param __model__
 * @param source Positions, or entities from which positions can be extracted. These positions should be in teh network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param cen_type Enum, the data to return, positions, edges, or both.
 * @returns A list of centrality values, between 0 and 1.
 */
export function CentralityClo(__model__: GIModel, source: TId|TId[]|TId[][][],
        entities: TId|TId[]|TId[][], method: _ECentralityMethod, cen_type: _EClosenessCentralityType): number[] {

    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.CentralityClo';
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        if (source.length > 0) {
            source_ents_arrs = splitIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
        _cytoscapeGetElements2(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: elements,
        headless: true,
    });
    let cytoscape_centrality: any;
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    const harmonic: boolean = cen_type === _EClosenessCentralityType.HARMONIC;
    const closeness: number[] = [];
    cytoscape_centrality = cy.elements().closenessCentralityNormalized({
        weight: _cytoscapeWeightFn,
        harmonic: harmonic,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy.getElementById( posi_i.toString() );
        closeness.push( cytoscape_centrality.closeness(source_elem) );
    }
    return closeness;
}
// ================================================================================================

/**
 * Calculates betweenness centrality for a netowrk. Values are normalized.
 * ~
 * ~
 * @param __model__
 * @param source Positions, or entities from which positions can be extracted. These positions should be in teh network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @returns A list of centrality values, between 0 and 1.
 */
export function CentralityBtw(__model__: GIModel, source: TId|TId[]|TId[][][],
        entities: TId|TId[]|TId[][], method: _ECentralityMethod): number[] {

    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'analyze.CentralityBtw';
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    } else {
        if (source.length > 0) {
            source_ents_arrs = splitIDs(fn_name, 'source', source,
                [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        }
        ents_arrs = splitIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] =
        _cytoscapeGetElements2(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: elements,
        headless: true,
    });
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    const betweenness: number[] = [];
    const cytoscape_centrality = cy.elements().betweennessCentrality({
        weight: _cytoscapeWeightFn,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy.getElementById( posi_i.toString() );
        betweenness.push( cytoscape_centrality.betweennessNormalized(source_elem) );
    }
    return betweenness;
}

