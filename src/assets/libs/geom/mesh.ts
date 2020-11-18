import * as THREE from 'three';
import { GIModel } from '@libs/geo-info/GIModel';
import { TEntTypeIdx, EEntType, Txyz } from '../geo-info/common';

// ----
// here are three different version of the function to create the threejs mesh, used for raycasting
// the first creates multiple meshes, the second one big mesh, the third one big buffered mesh
// performance tests are not very clear, in theory the big buffered mesh should be faster,
// but it seems that is not the case, the big non-buffered mesh seems faster
// so for now that is the one that is being used
// ----

export function createMultipleMeshesTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh[] {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach( ent_posi_i => posis_i_set.add(ent_posi_i) );
    }
    // create tjs vectors for each posi and save them in a sparse array
    // the index to the array is the posi_i
    const posis_tjs: THREE.Vector3[] = [];
    for (const posi_i of Array.from(posis_i_set)) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const posi_tjs = new THREE.Vector3(...xyz);
        posis_tjs[posi_i] = posi_tjs;
    }
    // get an array of all the faces
    const pgons_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            default:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                coll_pgons_i.forEach( coll_pgon_i => pgons_i.push(coll_pgon_i) );
                break;
        }
    }
    // create tjs meshes
    const meshes_tjs: THREE.Mesh[] = [];
    for (const pgon_i of pgons_i) {
        // create the tjs geometry
        const geom_tjs = new THREE.Geometry();
        const tris_i: number[] = __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
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
export function createSingleMeshTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): [THREE.Mesh, number[]] {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach( ent_posi_i => posis_i_set.add(ent_posi_i) );
    }
    // create tjs vectors for each posi and save them in a sparse array
    // the index to the array is the posi_i
    const posis_tjs: THREE.Vector3[] = [];
    for (const posi_i of Array.from(posis_i_set)) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const posi_tjs = new THREE.Vector3(...xyz);
        posis_tjs[posi_i] = posi_tjs;
    }
    // get an array of all the pgons
    const pgons_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            default:
                const ent_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                ent_pgons_i.forEach( ent_pgon_i => pgons_i.push(ent_pgon_i) );
                break;
        }
    }
    // create tjs meshes
    const geom_tjs = new THREE.Geometry();
    const idx_to_pgon_i: number[] = [];
    for (const pgon_i of pgons_i) {
        // create the tjs geometry
        const tris_i: number[] = __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            // add the three vertices to the geometry
            const a: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[0]]) - 1;
            const b: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[1]]) - 1;
            const c: number = geom_tjs.vertices.push(posis_tjs[tri_posis_i[2]]) - 1;
            // add the tjs tri to the geometry
            const idx_tjs: number = geom_tjs.faces.push( new THREE.Face3( a, b, c ) ) - 1;
            idx_to_pgon_i[idx_tjs] = pgon_i;
        }
    }
    // create the mesh, assigning the material
    return [new THREE.Mesh(geom_tjs, mat_tjs), idx_to_pgon_i];
}
export function createSingleMeshBufTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): THREE.Mesh {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach( ent_posi_i => posis_i_set.add(ent_posi_i) );
    }
    // create a flat list of xyz coords
    const xyzs_flat: number[] = [];
    const posi_i_to_xyzs_map: Map<number, number> = new Map();
    const unique_posis_i: number[] = Array.from(posis_i_set);
    for (let i = 0; i < unique_posis_i.length; i++) {
        const posi_i: number = unique_posis_i[i];
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyzs_flat.push(...xyz);
        posi_i_to_xyzs_map.set(posi_i, i);
    }
    // get an array of all the pgons
    const pgons_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            default:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                coll_pgons_i.forEach( coll_pgon_i => pgons_i.push(coll_pgon_i) );
                break;
        }
    }
    // create tjs meshes
    const tris_flat: number[] = [];
    for (const pgon_i of pgons_i) {
        // create the tjs geometry
        const tris_i: number[] = __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
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
