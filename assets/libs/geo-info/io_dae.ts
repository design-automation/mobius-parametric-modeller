import { GIModel } from './GIModel';
import { TColor, TNormal, TTexture, EAttribNames, Txyz, EEntType } from './common';
import { ComponentFactoryResolver } from '@angular/core/src/render3';
import { area } from '@libs/geom/triangle';

/**
 * Import obj
 */
export function importDae(obj_str: string): GIModel {
    const model: GIModel = new GIModel();
    throw new Error("Not implemented");
    return model;
}

function exportGetInstGeom(id: string): string {
    return `
                <instance_geometry url="#${id}">
                    <bind_material>
                        <technique_common>
                            <instance_material symbol="default_instance_material" target="#default_material">
                                <bind_vertex_input semantic="UVSET0" input_semantic="TEXCOORD" input_set="0" />
                            </instance_material>
                        </technique_common>
                    </bind_material>
                </instance_geometry>
                `;
}
function exportGetGeomMesh(id: string, num_posis: number, xyz_str: string, num_tri: number, indices_str: string): string {
    return `
        <geometry id="${id}">
            <mesh>
                <source id="${id}_positions">
                    <float_array id="${id}_positions_array" count="${num_posis}">${xyz_str}</float_array>
                    <technique_common>
                        <accessor count="3" source="#${id}_positions_array" stride="3">
                            <param name="X" type="float" />
                            <param name="Y" type="float" />
                            <param name="Z" type="float" />
                        </accessor>
                    </technique_common>
                </source>
                <vertices id="${id}_vertices">
                    <input semantic="POSITION" source="#${id}_positions" />
                </vertices>
                <triangles count="${num_tri}" material="default_instance_material">
                    <input offset="0" semantic="VERTEX" source="#${id}_vertices" />
                    <p>${indices_str}</p>
                </triangles>
            </mesh>
        </geometry>
        `;
}

/**
 * Export to obj
 */
export function exportDae(model: GIModel): string {
    // do we have color, texture, normal?
    const has_color_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.COLOUR);
    const has_normal_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.NORMAL);
    const has_texture_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.TEXTURE);
    // create the strings for the meshes
    let inst_geoms = '';
    let geom_meshes = '';
    const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
    console.log(pgons_i.length);
    for (const pgon_i of pgons_i) {
        const id = 'pg' + pgon_i;
        let xyz_str = '';
        const pgon_verts_i: number[] = model.geom.query.navAnyToVert(EEntType.PGON, pgon_i);
        const vert_map: Map<number, number> = new Map();
        for (let i = 0; i < pgon_verts_i.length; i++) {
            const vert_i: number = pgon_verts_i[i];
            const posi_i: number = model.geom.query.navVertToPosi(vert_i);
            const xyz: Txyz = model.attribs.query.getPosiCoords(posi_i);
            xyz_str += ' ' + xyz.join(' ');
            vert_map.set(posi_i, i);
        }
        let indices = '';
        const pgon_tris_i: number[] = model.geom.query.navAnyToTri(EEntType.PGON, pgon_i);
        let num_tris = 0;
        for (const tri_i of pgon_tris_i) {
            const tri_posis_i: number[] = model.geom.query.navAnyToPosi(EEntType.TRI, tri_i);
            const corners_xyzs: Txyz[] = tri_posis_i.map(tri_posi_i => model.attribs.query.getPosiCoords(tri_posi_i));
            const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
            if (true) { //(tri_area > 0) {
                for (const tri_posi_i of tri_posis_i) {
                    indices += ' ' + vert_map.get(tri_posi_i);
                }
                num_tris++;
            }
        }
        inst_geoms = inst_geoms + exportGetInstGeom(id);
        geom_meshes = geom_meshes + exportGetGeomMesh(id, pgon_verts_i.length * 3, xyz_str, num_tris, indices);
    }
    // snippets to insert into the template
    const lib_vis_scn = `
    <library_visual_scenes>
        <visual_scene id="visual_scene">
            <node name="mobius_modeller">
                ${inst_geoms}
            </node>
        </visual_scene>
    </library_visual_scenes>
    `;
    const lib_geom = `
    <library_geometries>
        ${geom_meshes}
    </library_geometries>
    `;
    // main template for a dae file
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
		<material id="default_material" name="material">
			<instance_effect url="#default_effect" />
		</material>
	</library_materials>
    <library_effects>
        <effect id="default_effect">
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
    </library_effects>
    <scene>
        <instance_visual_scene url="#visual_scene" />
    </scene>
    ${lib_vis_scn}
    ${lib_geom}
</COLLADA>
`;
    return template;
}
