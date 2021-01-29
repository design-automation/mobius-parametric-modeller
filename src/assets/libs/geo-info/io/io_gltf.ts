import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

import { GIModel } from '../GIModel';
import { TEntTypeIdx, IEntSets } from '../common';
import { getObjSets } from './common';
import { IThreeJS } from '../ThreejsJSON';

enum MaterialType {
    MeshBasicMaterial = 'MeshBasicMaterial',
    MeshStandardMaterial = 'MeshStandardMaterial',
    MeshLambertMaterial = 'MeshLambertMaterial',
    MeshPhongMaterial = 'MeshPhongMaterial',
    MeshPhysicalMaterial = 'MeshPhysicalMaterial'
}

/**
 *  Export GLTF
 */
export async function exportGltf(model: GIModel, entities: TEntTypeIdx[], ssid: number): Promise<string> {
    // create features from pgons, plines, points
    // const obj_sets: IEntSets = getObjSets(model, entities, ssid);
    // const export_json = '';
    // for (const pgon_i of obj_sets.pg) {
    // }
    // for (const pline_i of obj_sets.pl) {
    // }


    // return JSON.stringify(export_json, null, 2); // pretty

    // convert the model to threejs
    const scene = _convertThreeJS(model, entities, ssid);

    // export the threejs model as GLTF
    // https://threejs.org/docs/#examples/en/exporters/GLTFExporter
    const gltfExporter = new GLTFExporter();

    // GLTF exporter options
    const options = {
        trs: false,
        onlyVisible: false
    };

    // exporter parsing -> promise
    const p = new Promise<string>(resolve => {
        gltfExporter.parse( scene, function ( result ) {
            for (const material of result['materials']) {
                material['doubleSided'] = true;
            }
            const output = JSON.stringify( result, null, 2 );
            resolve(output);
        }, options );
    });
    return p;
}

/**
 *  convert GI model to threejs model
 */
function _convertThreeJS(model: GIModel, entities: TEntTypeIdx[], ssid: number): THREE.Scene {
    // Create Threejs scene
    const scene = new THREE.Scene();

    // get geometry data
    const threejs_data: IThreeJS = model.get3jsData(ssid);

    // Get materials
    const pline_material_groups = threejs_data.pline_material_groups;
    const pline_materials = threejs_data.pline_materials;
    const pgon_material_groups = threejs_data.pgon_material_groups;
    const pgon_materials = threejs_data.pgon_materials;

    // Create buffers that will be used by all geometry
    const verts_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.verts_xyz, 3);
    const normals_buffer = new THREE.Float32BufferAttribute(threejs_data.normals, 3);
    const colors_buffer = new THREE.Float32BufferAttribute(threejs_data.colors, 3);

    // add geometry to scene
    _addTris(scene, threejs_data.tri_indices, verts_xyz_buffer, colors_buffer, normals_buffer, pgon_material_groups, pgon_materials);
    _addLines(scene, threejs_data.edge_indices, verts_xyz_buffer, colors_buffer, pline_material_groups, pline_materials);
    _addPoints(scene, threejs_data.point_indices, verts_xyz_buffer, colors_buffer, [255, 255, 255], 1);

    return scene;
}

/**
 * Add threejs triangles to the scene
 */
function _addTris(scene: THREE.Scene,
        tris_i: number[], posis_buffer: THREE.Float32BufferAttribute,
        colors_buffer: THREE.Float32BufferAttribute, normals_buffer: THREE.Float32BufferAttribute,
        material_groups, materials): void {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(tris_i);
    geom.setAttribute('position', posis_buffer);
    if (normals_buffer.count > 0) {
    geom.setAttribute('normal', normals_buffer);
    }
    geom.setAttribute('color', colors_buffer);
    // const colorf = new THREE.Color(parseInt(settings.colors.face_f.replace('#', '0x'), 16));
    // const colorb = new THREE.Color(parseInt(settings.colors.face_b.replace('#', '0x'), 16));
    const colorf = new THREE.Color(parseInt('0xFFFFFF', 16));
    const colorb = new THREE.Color(parseInt('0xDDDDDD', 16));
    geom.clearGroups();
    material_groups.forEach(element => {
    geom.addGroup(element[0], element[1], element[2]);
    });
    // _buffer_geoms.push(geom);

    const material_arr = [];
    let index = 0;
    const l = materials.length;
    for (; index < l; index++) {
        const element = materials[index];
        let mat;
        if (index === 0) {
            delete element.type; element.color = colorf;
            mat = new THREE.MeshPhongMaterial(element);
        } else if (index === 1) {
            delete element.type;
            element.color = colorb;
            mat = new THREE.MeshPhongMaterial(element);
        } else {
            if (element.type === MaterialType.MeshBasicMaterial) {
                delete element.type;
                mat = new THREE.MeshBasicMaterial(element);
            } else if (element.type === MaterialType.MeshPhongMaterial) {
                delete element.type;
                mat = new THREE.MeshPhongMaterial(element);
            } else if (element.type === MaterialType.MeshPhysicalMaterial) {
                delete element.type;
                // if (settings.background.show) {
                //     element.envMap = scene.background;
                // }
                mat = new THREE.MeshPhysicalMaterial(element);
            } else if (element.type === MaterialType.MeshLambertMaterial) {
                delete element.type;
                mat = new THREE.MeshLambertMaterial(element);
            } else if (element.type === MaterialType.MeshStandardMaterial) {
                delete element.type;
                mat = new THREE.MeshStandardMaterial(element);
            }
        }
        material_arr.push(mat);
    }
    const mesh = new THREE.Mesh(geom, material_arr);
    mesh.name = 'obj_tri';

    mesh.geometry.computeBoundingSphere();
    if (normals_buffer.count === 0) {
        mesh.geometry.computeVertexNormals();
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // add mesh to scene
    scene.add(mesh);
}

/**
* Add threejs lines to the scene
*/
function _addLines(scene: THREE.Scene,
        lines_i: number[], posis_buffer: THREE.Float32BufferAttribute,
        color_buffer: THREE.Float32BufferAttribute, material_groups, materials): void {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(lines_i);
    geom.setAttribute('position', posis_buffer);
    geom.setAttribute('color', color_buffer);

    const material_arr = [];
    let index = 0;
    const l = materials.length;
    for (; index < l; index++) {
        const element = materials[index];
        if (element.type === 'LineBasicMaterial') {
            const mat = new THREE.LineBasicMaterial({
                color: element.color || 0,
                vertexColors: THREE.VertexColors
            });
            material_arr.push(mat);
        } else {
            const mat = new THREE.LineBasicMaterial({
                color: element.color || 0,
                vertexColors: THREE.VertexColors
            });
            material_arr.push(mat);
        }
    }
    material_groups.forEach(element => {
        geom.addGroup(element[0], element[1], element[2]);
    });
    const newGeom = geom.toNonIndexed();

    const line = new THREE.LineSegments(newGeom, material_arr);
    line.name = 'obj_line';
    line.computeLineDistances();
    scene.add(line);
}

/**
* Add threejs points to the scene
*/
function _addPoints(scene: THREE.Scene,
        points_i: number[], posis_buffer: THREE.Float32BufferAttribute,
        colors_buffer: THREE.Float32BufferAttribute, color: [number, number, number], size: number = 1): void {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(points_i);
    geom.setAttribute('position', posis_buffer);
    geom.setAttribute('color', colors_buffer);

    // _buffer_geoms.push(geom);
    // geom.computeBoundingSphere();
    const rgb = `rgb(${color.toString()})`;
    const mat = new THREE.PointsMaterial({
        // color: new THREE.Color(rgb),
        size: size,
        vertexColors: THREE.VertexColors,
        sizeAttenuation: false
    });
    const point = new THREE.Points(geom, mat);
    point.name = 'obj_pt';
    scene.add(point);
}
