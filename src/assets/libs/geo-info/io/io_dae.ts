import { GIModel } from '../GIModel';
import { TColor, TNormal, TTexture, EAttribNames, Txyz, EEntType, TAttribDataTypes } from '../common';
import { area } from '@libs/geom/triangle';
import { distance } from '@libs/geom/distance';

/**
 * Import obj
 */
export function importDae(obj_str: string): GIModel {
    const model: GIModel = new GIModel();
    throw new Error('Not implemented');
    return model;
}

function getInstGeom(id: string, material_id: string): string {
    return `
                <instance_geometry url="#${id}">
                    <bind_material>
                        <technique_common>
                            <instance_material symbol="instance_material_${material_id}" target="#${material_id}">
                                <bind_vertex_input semantic="UVSET0" input_semantic="TEXCOORD" input_set="0" />
                            </instance_material>
                        </technique_common>
                    </bind_material>
                </instance_geometry>
                `;
}
function getGeomMeshPgon(id: string,
        num_posis: number, xyz_str: string, num_tri: number, indices_str: string, material_id: string): string {
    return `
        <geometry id="${id}">
            <mesh>
                <source id="${id}_positions">
                    <float_array id="${id}_positions_array" count="${num_posis}">${xyz_str}</float_array>
                    <technique_common>
                        <accessor count="${num_posis / 3}" source="#${id}_positions_array" stride="3">
                            <param name="X" type="float" />
                            <param name="Y" type="float" />
                            <param name="Z" type="float" />
                        </accessor>
                    </technique_common>
                </source>
                <vertices id="${id}_vertices">
                    <input semantic="POSITION" source="#${id}_positions" />
                </vertices>
                <triangles count="${num_tri}" material="instance_material_${material_id}">
                    <input offset="0" semantic="VERTEX" source="#${id}_vertices" />
                    <p>${indices_str}</p>
                </triangles>
            </mesh>
        </geometry>
        `;
}
function getGeomMeshPline(id: string,
        num_posis: number, xyz_str: string, num_lines: number, indices_str: string, material_id: string): string {
    return `
        <geometry id="${id}">
            <mesh>
                <source id="${id}_positions">
                    <float_array id="${id}_positions_array" count="${num_posis}">${xyz_str}</float_array>
                    <technique_common>
                        <accessor count="${num_posis / 3}" source="#${id}_positions_array" stride="3">
                            <param name="X" type="float" />
                            <param name="Y" type="float" />
                            <param name="Z" type="float" />
                        </accessor>
                    </technique_common>
                </source>
                <vertices id="${id}_vertices">
                    <input semantic="POSITION" source="#${id}_positions" />
                </vertices>
                <lines count="${num_lines}" material="instance_material_${material_id}">
                    <input offset="0" semantic="VERTEX" source="#${id}_vertices" />
                    <p>${indices_str}</p>
                </lines>
            </mesh>
        </geometry>
        `;
}
function getMaterial(id: string, effect_id: string): string {
    return `
            <material id="${id}" name="material_${id}">
                <instance_effect url="#${effect_id}" />
            </material>
        `;
}
function getPgonEffect(id: string, color: string): string {
    return `
            <effect id="${id}">
                <profile_COMMON>
                    <technique sid="COMMON">
                        <lambert>
                            <diffuse>
                                <color>${color} 1</color>
                            </diffuse>
                        </lambert>
                    </technique>
                </profile_COMMON>
            </effect>
            `;
}
function getPlineEffect(id: string, color: string): string {
    return `
            <effect id="${id}">
                <profile_COMMON>
                    <technique sid="COMMON">
                        <constant>
                            <transparent opaque="A_ONE">
                                <color>${color} 1</color>
                            </transparent>
                            <transparency>
                                <float>1</float>
                            </transparency>
                        </constant>
                    </technique>
                </profile_COMMON>
            </effect>
            `;
}
function getVisualSceneNode(id: string): string {
    return `
                <node id="${id}" name="vs_node_${id}">
                    <matrix>1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1</matrix>
                    <instance_node url="#node_${id}" />
                </node>
                `;
}
function getNodesWithInstGeoms(id: string, inst_geoms: string): string {
    return `
        <node id="node_${id}" name="lib_node_${id}">
            ${inst_geoms}
        </node>
        `;
}
/**
 * Process polygons
 */
function processColls(model: GIModel): void {
    const ssid: number = this.modeldata.active_ssid;
    const colls_map: Map<number, number[]> = new Map();
    // go through the collections
    const colls_i: number[] = model.modeldata.geom.snapshot.getEnts(ssid, EEntType.COLL);
    for (const coll_i of colls_i) {
        const parent: number = model.modeldata.geom.snapshot.getCollParent(ssid, coll_i);
        // const pgons_i: number[] = model.modeldata.geom.nav.navCollToPgon(coll_i);
        // const plines_i: number[] = model.modeldata.geom.nav.navCollToPline(coll_i);
        if ( !colls_map.has(parent) ) {
            colls_map.set(parent, []);
        }
        colls_map.get(parent).push(coll_i);
    }
    for (const coll_i of colls_map.get(null)) {
        // TODO
    }
}
function processPgonInColl(model: GIModel, pgon_i: number) {
    // TODO
}
/**
 * Process polygons
 */
function processMaterialPgon(model: GIModel, pgon_i: number, has_color_attrib: boolean,
        materials_map: Map<string, string>, material_effects_map: Map<string, string>,
        materials_rev_map: Map<string, string>): string {
    const pgon_verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
    let material_id = 'default_pgon_material';
    if (has_color_attrib) {
        let color: TColor = [0, 0, 0];
        for (const pgon_vert_i of pgon_verts_i) {
            let vert_color: TColor = model.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, pgon_vert_i, EAttribNames.COLOR) as TColor;
            if (vert_color === null || vert_color === undefined) { vert_color = [1, 1, 1]; }
            color = [color[0] + vert_color[0], color[1] + vert_color[1], color[2] + vert_color[2]];
        }
        const num_verts: number = pgon_verts_i.length;
        color = [color[0] / num_verts, color[1] / num_verts, color[2] / num_verts];
        const color_str: string = color.join(' ');
        if (materials_rev_map.has(color_str)) {
            material_id = materials_rev_map.get(color_str);
        } else {
            material_id = 'mat_' + materials_rev_map.size;
            const effect_id = material_id + '_eff';
            materials_map.set(material_id, getMaterial(material_id, effect_id));
            material_effects_map.set(effect_id, getPgonEffect(effect_id, color_str));
            materials_rev_map.set(color_str, material_id);
        }
    }
    return material_id;
}
function processGeomMeshPgon(model: GIModel, pgon_i: number, material_id: string,
        geom_meshes_map: Map<string, string>): void {
    const id = 'pg' + pgon_i;
    let xyz_str = '';
    const pgon_verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
    const vert_map: Map<number, number> = new Map();
    for (let i = 0; i < pgon_verts_i.length; i++) {
        const vert_i: number = pgon_verts_i[i];
        const posi_i: number = model.modeldata.geom.nav.navVertToPosi(vert_i);
        const xyz: Txyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyz_str += ' ' + xyz.join(' ');
        vert_map.set(posi_i, i);
    }
    let indices = '';
    const pgon_tris_i: number[] = model.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
    let num_tris = 0;
    for (const tri_i of pgon_tris_i) {
        const tri_posis_i: number[] = model.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const corners_xyzs: Txyz[] = tri_posis_i.map(tri_posi_i => model.modeldata.attribs.posis.getPosiCoords(tri_posi_i));
        const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
        if (tri_area > 0) {
            for (const tri_posi_i of tri_posis_i) {
                indices += ' ' + vert_map.get(tri_posi_i);
            }
            num_tris++;
        }
    }
    geom_meshes_map.set(id, getGeomMeshPgon(id, pgon_verts_i.length * 3, xyz_str, num_tris, indices, material_id));
}
/**
 * Process polylines
 */
function processMaterialPline(model: GIModel, pline_i: number, has_color_attrib: boolean,
        materials_map: Map<string, string>, material_effects_map: Map<string, string>,
        materials_rev_map: Map<string, string>): string {
    const pline_verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
    let material_id = 'default_pline_material';
    if (has_color_attrib) {
        let color: TColor = [0, 0, 0];
        for (const pline_vert_i of pline_verts_i) {
            let vert_color: TColor = model.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, pline_vert_i, EAttribNames.COLOR) as TColor;
            if (vert_color === null || vert_color === undefined) { vert_color = [1, 1, 1]; }
            color = [color[0] + vert_color[0], color[1] + vert_color[1], color[2] + vert_color[2]];
        }
        const num_verts: number = pline_verts_i.length;
        color = [color[0] / num_verts, color[1] / num_verts, color[2] / num_verts];
        const color_str: string = color.join(' ');
        if (materials_map.has(color_str)) {
            material_id = materials_map.get(color_str);
        } else {
            material_id = 'mat_' + materials_map.size;
            const effect_id = material_id + '_eff';
            materials_map.set(material_id, getMaterial(material_id, effect_id));
            material_effects_map.set(effect_id, getPlineEffect(effect_id, color_str));
            materials_rev_map.set(color_str, material_id);
        }
    }
    return material_id;
}
function processGeomMeshPline(model: GIModel, pline_i: number, material_id: string,
        geom_meshes_map: Map<string, string>): void {
    const id = 'pl' + pline_i;
    let xyz_str = '';
    const pline_verts_i: number[] = model.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
    const vert_map: Map<number, number> = new Map();
    for (let i = 0; i < pline_verts_i.length; i++) {
        const vert_i: number = pline_verts_i[i];
        const posi_i: number = model.modeldata.geom.nav.navVertToPosi(vert_i);
        const xyz: Txyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyz_str += ' ' + xyz.join(' ');
        vert_map.set(posi_i, i);
    }
    let indices = '';
    const pline_edges_i: number[] = model.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
    let num_edges = 0;
    for (const edge_i of pline_edges_i) {
        const edge_posis_i: number[] = model.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const ends_xyzs: Txyz[] = edge_posis_i.map(tri_posi_i => model.modeldata.attribs.posis.getPosiCoords(tri_posi_i));
        const edge_length: number = distance( ends_xyzs[0], ends_xyzs[1] );
        if (edge_length > 0) {
            for (const edge_posi_i of edge_posis_i) {
                indices += ' ' + vert_map.get(edge_posi_i);
            }
            num_edges++;
        }
    }
    geom_meshes_map.set(id, getGeomMeshPline(id, pline_verts_i.length * 3, xyz_str, num_edges, indices, material_id));
}

/**
 * Export to dae collada file
 */
export function exportDae(model: GIModel, ssid: number): string {
    // do we have color, texture, normal?
    const has_color_attrib: boolean = model.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR);
    const has_normal_attrib: boolean = model.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL);
    const has_texture_attrib: boolean = model.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.TEXTURE);
    // create maps to store all the data
    const scene_inst_geoms_map: Map<string, string> = new Map();
    const nodes_inst_geoms_map: Map<string, string[]> = new Map();
    const visual_scene_nodes_map: Map<string, string> = new Map();
    const geom_meshes_map: Map<string, string> = new Map();
    const materials_map: Map<string, string> = new Map();
    const material_effectss_map: Map<string, string> = new Map();
    // create a rev map to look up colours
    const materials_pgons_rev_map: Map<string, string> = new Map();
    const materials_plines_rev_map: Map<string, string> = new Map();
    // process the polygons that are not in a collection
    const pgons_i: number[] = model.modeldata.geom.snapshot.getEnts(ssid, EEntType.PGON);
    for (const pgon_i of pgons_i) {
        const material_id: string  = processMaterialPgon(model, pgon_i, has_color_attrib,
            materials_map, material_effectss_map, materials_pgons_rev_map);
        const id = 'pg' + pgon_i;
        processGeomMeshPgon(model, pgon_i, material_id, geom_meshes_map);
        const inst_geom = getInstGeom(id, material_id);
        const colls_i: number[] = model.modeldata.geom.nav.navPgonToColl(pgon_i);
        if (colls_i === undefined) {
            scene_inst_geoms_map.set(id, inst_geom);
        } else {
            const coll_id: string = 'co' + colls_i[0];
            if (!visual_scene_nodes_map.has(coll_id)) {
                visual_scene_nodes_map.set(coll_id, getVisualSceneNode(coll_id));
            }
            if (!nodes_inst_geoms_map.has(coll_id)) {
                nodes_inst_geoms_map.set(coll_id, []);
            }
            nodes_inst_geoms_map.get(coll_id).push(inst_geom);
        }
    }
    // process the polylines that are not in a collection
    const plines_i: number[] = model.modeldata.geom.snapshot.getEnts(ssid, EEntType.PLINE);
    for (const pline_i of plines_i) {
        const material_id: string  = processMaterialPline(model, pline_i, has_color_attrib,
            materials_map, material_effectss_map, materials_plines_rev_map);
        const id = 'pl' + pline_i;
        processGeomMeshPline(model, pline_i, material_id, geom_meshes_map);
        const inst_geom = getInstGeom(id, material_id);
        const colls_i: number[] = model.modeldata.geom.nav.navPlineToColl(pline_i);
        if (colls_i === undefined) {
            scene_inst_geoms_map.set(id, inst_geom);
        } else {
            const coll_id: string = 'co' + colls_i[0];
            if (!visual_scene_nodes_map.has(coll_id)) {
                visual_scene_nodes_map.set(coll_id, getVisualSceneNode(coll_id));
            }
            if (!nodes_inst_geoms_map.has(coll_id)) {
                nodes_inst_geoms_map.set(coll_id, []);
            }
            nodes_inst_geoms_map.get(coll_id).push(inst_geom);
        }
    }
    // create the strings for insertion into the template
    let inst_geoms = Array.from(scene_inst_geoms_map.values()).join('');
    const geom_meshes = Array.from(geom_meshes_map.values()).join('');
    const materials = Array.from(materials_map.values()).join('');
    const material_effects = Array.from(material_effectss_map.values()).join('');
    // create the strings for the collections
    inst_geoms = inst_geoms + Array.from(visual_scene_nodes_map.values()).join('');
    let nodes = '';
    const ids: string[] = Array.from(nodes_inst_geoms_map.keys());
    for (const id of ids) {
        const node_inst_geoms = nodes_inst_geoms_map.get(id).join('');
        nodes = nodes + getNodesWithInstGeoms(id, node_inst_geoms);
    }
    // main template for a dae file, returned by this function
    const template =
`<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
    <asset>
        <contributor>
            <authoring_tool>Mobius Modeller</authoring_tool>
        </contributor>
        <unit meter="1" name="meter" />
        <up_axis>Z_UP</up_axis>
    </asset>
	<library_materials>
		<material id="default_pgon_material" name="material">
			<instance_effect url="#default_pgon_effect" />
        </material>
        <material id="default_pline_material" name="material">
			<instance_effect url="#default_pline_effect" />
        </material>
        ${materials}
	</library_materials>
    <library_effects>
        <effect id="default_pgon_effect">
            <profile_COMMON>
                <technique sid="COMMON">
                    <lambert>
                        <diffuse>
                            <color>1 1 1 1</color>
                        </diffuse>
                    </lambert>
                </technique>
            </profile_COMMON>
        </effect>
        <effect id="default_pline_effect">
            <profile_COMMON>
                <technique sid="COMMON">
                    <constant>
                        <transparent opaque="A_ONE">
                            <color>0 0 0 1</color>
                        </transparent>
                        <transparency>
                            <float>1</float>
                        </transparency>
                    </constant>
                </technique>
            </profile_COMMON>
        </effect>
        ${material_effects}
    </library_effects>
    <scene>
        <instance_visual_scene url="#visual_scene" />
    </scene>
    <library_visual_scenes>
        <visual_scene id="visual_scene">
            <node name="mobius_modeller">
                ${inst_geoms}
            </node>
        </visual_scene>
    </library_visual_scenes>
    <library_nodes>
        ${nodes}
    </library_nodes>
    <library_geometries>
        ${geom_meshes}
    </library_geometries>
</COLLADA>
`;
    return template;
}
