/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';

import * as chk from '../../_check_types';

import { TId, Txyz, EEntType, TPlane, TRay, TEntTypeIdx } from '@libs/geo-info/common';
import { GIModel } from '@libs/geo-info/GIModel';
import { idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { getArrDepth } from '@assets/libs/util/arrs';
import { vecCross} from '@libs/geom/vectors';
import { _normal } from './calc';
import * as THREE from 'three';

// ================================================================================================
/**
 * Calculates the xyz intersection between a ray and one or more polygons.
 * \n
 * The intersection between each polygon face triangle and the ray is caclulated.
 * This ignores the intersections between rays and edges (including polyline edges).
 * \n
 * @param __model__
 * @param ray A ray.
 * @param entities A polygon or list of polygons.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.RayFace(ray, polygon1)
 * @example_info Returns a list of coordinates where the ray  intersects with the polygon.
 */
export function RayFace(__model__: GIModel, ray: TRay, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.RayFace';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', ray, [chk.isRay]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList],
        //     [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray[0]), new THREE.Vector3(...ray[1]));
    return _intersectRay(__model__, ents_arr, ray_tjs);
}
function _intersectRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], ray_tjs: THREE.Ray): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        const posis_tjs: THREE.Vector3[] = [];
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
            posis_tjs[posi_i] = posi_tjs;
        }
        const isect_xyzs: Txyz[] = [];
        // triangles
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, index);
        const tris_i: number[] = [];
        for (const pgon_i of pgons_i) {
            for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
                tris_i.push(tri_i);
            }
        }
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            const tri_posis_tjs: THREE.Vector3[] = tri_posis_i.map(tri_posi_i => posis_tjs[tri_posi_i]);
            const isect_tjs: THREE.Vector3 = new THREE.Vector3();
            const result: THREE.Vector3 = ray_tjs.intersectTriangle(tri_posis_tjs[0], tri_posis_tjs[1], tri_posis_tjs[2], false, isect_tjs);
            if (result !== undefined && result !== null) {
                isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // return the intersection xyzs
        return isect_xyzs;
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectRay(__model__, ent_arr as TEntTypeIdx, ray_tjs);
            for (const isect_xyz  of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
// ================================================================================================
/**
 * Calculates the xyz intersection between a plane and a list of edges.
 * \n
 * This ignores the intersections between planes and polygon face triangles.
 * \n
 * @param __model__
 * @param plane A plane.
 * @param entities An edge or list of edges, or entities from which edges can be extracted.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.PlaneEdge(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with the edges of polyline1.
 */
export function PlaneEdge(__model__: GIModel, plane: TRay|TPlane, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.PlaneEdge';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal: Txyz = vecCross(plane[1], plane[2]);
    const plane_tjs: THREE.Plane = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
    return _intersectPlane(__model__, ents_arr, plane_tjs);

}
/**
 * Recursive intersect
 * @param __model__
 * @param ents_arr
 * @param plane_tjs
 */
function _intersectPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], plane_tjs: THREE.Plane): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            return _intersectPlaneEdge(__model__, ent_i, plane_tjs);
        } else if (ent_type < EEntType.EDGE) {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
            const edges_isect_xyzs: Txyz[] = [];
            for (const edge_i of edges_i) {
                const edge_isect_xyzs: Txyz[] = _intersectPlaneEdge(__model__, edge_i, plane_tjs);
                for (const edge_isect_xyz of edge_isect_xyzs) {
                    edges_isect_xyzs.push(edge_isect_xyz);
                }
            }
            return edges_isect_xyzs;
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            const wires_isect_xyzs: Txyz[] = [];
            for (const wire_i of wires_i) {
                const wire_isect_xyzs: Txyz[] = _intersectPlaneWire(__model__, wire_i, plane_tjs);
                for (const wire_isect_xyz of wire_isect_xyzs) {
                    wires_isect_xyzs.push(wire_isect_xyz);
                }
            }
            return wires_isect_xyzs;
        }
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectPlane(__model__, ent_arr as TEntTypeIdx, plane_tjs);
            for (const isect_xyz of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
/**
 * Calc intersection between a plane and a wire.
 * @param __model__
 * @param wire_i
 * @param plane_tjs
 */
function _intersectPlaneWire(__model__: GIModel, wire_i: number, plane_tjs: THREE.Plane): Txyz[] {
    const isect_xyzs: Txyz[] = [];
    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    // create threejs posis for all posis
    const posis_tjs: THREE.Vector3[] = [];
    for (const wire_posi_i of wire_posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(wire_posi_i);
        const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
        posis_tjs.push(posi_tjs);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        posis_tjs.push(posis_tjs[0]);
    }
    // for each pair of posis, create a threejs line and do the intersect
    for (let i = 0; i < posis_tjs.length - 1; i++) {
        const line_tjs: THREE.Line3 = new THREE.Line3(posis_tjs[i], posis_tjs[i + 1]);
        const isect_tjs: THREE.Vector3 = new THREE.Vector3();
        const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
        if (result !== undefined && result !== null) {
            isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
        }
    }
    return isect_xyzs;
}
/**
 * Calc intersection between a plane and a single edge.
 * @param __model__
 * @param edge_i
 * @param plane_tjs
 */
function _intersectPlaneEdge(__model__: GIModel, edge_i: number, plane_tjs: THREE.Plane): Txyz[] {
    const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // create threejs posis for all posis
    const xyz0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
    const xyz1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
    const posi0_tjs: THREE.Vector3 = new THREE.Vector3(...xyz0);
    const posi1_tjs: THREE.Vector3 = new THREE.Vector3(...xyz1);
    // for each pair of posis, create a threejs line and do the intersect
    const line_tjs: THREE.Line3 = new THREE.Line3(posi0_tjs, posi1_tjs);
    const isect_tjs: THREE.Vector3 = new THREE.Vector3();
    const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
    if (result !== undefined && result !== null) {
        return [[isect_tjs.x, isect_tjs.y, isect_tjs.z]];
    }
    return [];
}
