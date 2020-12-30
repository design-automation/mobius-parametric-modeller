import * as THREE from 'three';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';
import { EEntTypeStr, EEntType } from '@libs/geo-info/common';
import { Vector3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DataService } from '@services';
import { Vector } from '@assets/core/modules/basic/calc';
import { ISettings } from './data.threejsSettings';

import { DataThreejsLookAt } from './data.threejsLookAt';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { isArray } from 'util';

enum MaterialType {
    MeshBasicMaterial = 'MeshBasicMaterial',
    MeshStandardMaterial = 'MeshStandardMaterial',
    MeshLambertMaterial = 'MeshLambertMaterial',
    MeshPhongMaterial = 'MeshPhongMaterial',
    MeshPhysicalMaterial = 'MeshPhysicalMaterial'
}

/**
 * ThreejsScene Add
 */
export class DataThreejs extends DataThreejsLookAt {
    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: ISettings, dataService: DataService) {
        super(settings, dataService);
        // background
        if (this.settings.background.show) {
            this._loadBackground(this.settings.background.background_set);
        } else {
            this.cameraBackgrounds = null;
            this.scene.background = new THREE.Color(this.settings.colors.viewer_bg);
        }

        // add grid and lights
        this._addGrid();
        this._addAxes();
        if (this.settings.ambient_light.show) {
            this._addAmbientLight();
        }
        if (this.settings.hemisphere_light.show) {
            this._addHemisphereLight();
        }
        if (this.settings.directional_light.show) {
            this._addDirectionalLight();
        }
    }

    /**
     *
     * @param object
     * @param property
     */
    public static disposeObjectProperty(object: THREE.Object3D, property: string): void {
        if (object.hasOwnProperty(property)) {
            if (object[property].constructor === [].constructor) {
                object[property].forEach(prop => prop.dispose());
            } else {
                object[property].dispose();
            }
        }
    }

    public populateScene(model: GIModel, container): void {
        const cameraSettings = localStorage.getItem('gi_camera');
        if (cameraSettings && JSON.parse(cameraSettings)) {
            const cam = JSON.parse(cameraSettings);
            this.perspCam.position.copy(cam.pos);
            this.perspControls.target.copy(cam.target);
            this.perspCam.updateProjectionMatrix();
            this.perspControls.update();
            localStorage.setItem('gi_camera', 'null');
        }
        while (this.scene.children.length > 0) {
            DataThreejs.disposeObjectProperty(this.scene.children[0], 'geometry');
            DataThreejs.disposeObjectProperty(this.scene.children[0], 'texture');
            this.scene.remove(this.scene.children[0]);
        }
        this.scene_objs = [];
        // this._buffer_geoms = [];

        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            container.removeChild(value);
        });
        this.ObjLabelMap.clear();
        this.textLabels.clear();

        this._addGeom(model);

        const position_size = this.settings.positions.size;
        this.raycaster.params.Points.threshold = position_size > 1 ? position_size / 3 : position_size / 4;


        this._all_objs_sphere = this._getAllObjsSphere();
        this.updateCameraFOV();

        // add the axes, ground, lights, etc
        this._addEnv();

        if (!container) { return; }
        setTimeout(() => {
            // this.exportGLTF(this.scene);
            let old = document.getElementById('hud');
            if (old) {
                container.removeChild(old);
            }
            setTimeout(() => { this._getNodeSelect(); }, 10);
            if (!this.model.modeldata.attribs.query.hasEntAttrib(EEntType.MOD, 'hud')) { return; }
            const hud = this.model.modeldata.attribs.get.getModelAttribVal('hud') as string;
            const element = this._createHud(hud).element;
            container.appendChild(element);
            old = null;
        }, 0);
    }

    private _addGeom(model: GIModel): void {
        // Add geometry
        const threejs_data: IThreeJS = model.get3jsData(this.nodeIndex);
        this.tri_select_map = threejs_data.tri_select_map;
        this.edge_select_map = threejs_data.edge_select_map;
        this.point_select_map = threejs_data.point_select_map;
        this.posis_map = threejs_data.posis_map;
        this.vertex_map = threejs_data.verts_map;
        this.positions = [];

        // Get materials
        const pline_material_groups = threejs_data.pline_material_groups;
        const pline_materials = threejs_data.pline_materials;
        const pgon_material_groups = threejs_data.pgon_material_groups;
        const pgon_materials = threejs_data.pgon_materials;

        // Create buffers that will be used by all geometry
        const verts_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.verts_xyz, 3);
        const normals_buffer = new THREE.Float32BufferAttribute(threejs_data.normals, 3);
        const colors_buffer = new THREE.Float32BufferAttribute(threejs_data.colors, 3);
        const posis_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.posis_xyz, 3);
        this._addTris(threejs_data.tri_indices, verts_xyz_buffer, colors_buffer, normals_buffer, pgon_material_groups, pgon_materials);
        this._addLines(threejs_data.edge_indices, verts_xyz_buffer, colors_buffer, pline_material_groups, pline_materials);
        this._addPoints(threejs_data.point_indices, verts_xyz_buffer, colors_buffer, [255, 255, 255], this.settings.positions.size + 1);

        // if (threejs_data.timeline) {
        //     this.timelineEnabled = true;
        //     this.timeline = threejs_data.timeline.__time_points__;
        //     if (!this.current_time_point || this.timeline.indexOf(this.current_time_point) === -1) {
        //         this.current_time_point = this.timeline[this.timeline.length - 1];
        //     }
        //     this.timeline_groups = {};
        //     for (const time_point of this.timeline) {
        //         const obj_group = new THREE.Group();
        //         const timeline_data = threejs_data.timeline[time_point];
        //         const tri = this._addTimelineTris(timeline_data.triangle_indices, verts_xyz_buffer, colors_buffer,
        //                     normals_buffer, material_groups, materials);
        //         const lines = this._addTimelineLines(timeline_data.edge_indices, threejs_data.white_edge_indices,
        //                     verts_xyz_buffer, colors_buffer, normals_buffer);
        //         const points = this._addTimelinePoints(timeline_data.point_indices, verts_xyz_buffer,
        //                     colors_buffer, [255, 255, 255], this.settings.positions.size + 1);
        //         obj_group.add(tri);
        //         obj_group.add(lines[0]);
        //         obj_group.add(lines[1]);
        //         obj_group.add(points);
        //         this.timeline_groups[time_point] = obj_group;
        //     }
        //     this.scene.add(this.timeline_groups[this.current_time_point]);
        // } else {
        //     this.timelineEnabled = false;
        //     this.timeline = null;
        //     this.timeline_groups = null;
        // }

        this._addPosis(threejs_data.posis_indices, posis_xyz_buffer, this.settings.colors.position, this.settings.positions.size);

        this._addPointLabels(model);

    }


    /**
     * Add background, grid, ground
     */
    private _addEnv(): void {

        // background
        if (this.settings.background.show) {
            this._loadBackground(this.settings.background.background_set);
        } else {
            this.cameraBackgrounds = null;
            this.scene.background = new THREE.Color(this.settings.colors.viewer_bg);
        }

        // add gird and axes
        this._addGrid();
        this._addAxes();
        // const center = new THREE.Vector3(0, 0, 0); // allObjs.center;
        // this.axes_pos.x = center.x;
        // this.axes_pos.y = center.y;
        // let grid_pos = this.settings.grid.pos;
        // if (!grid_pos) {
        //     grid_pos = new Vector3(0, 0, 0);
        // }
        // this.grid.position.set(grid_pos.x, grid_pos.y, -0.01);
        // this.axesHelper.position.set(grid_pos.x, grid_pos.y, 0);

        // // settings
        // // if (num_posis !== 0) {
        //     if (this.dataService.newFlowchart) {
        //         this.dataService.newFlowchart = false;
        //         this.origin = new THREE.Vector3(center.x, center.y, 0);
        //         this.settings.camera.target = this.origin ;
        //         localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        //         this.axesHelper.position.set(center.x, center.y, 0.05);
        //     } else {
        //         this.axesHelper.position.set(this.origin.x, this.origin.y, 0.05);
        //     }
        // // }

        // ground
        const ground = this.settings.ground;
        if (ground.show) {
            const planeGeometry = new THREE.PlaneBufferGeometry(ground.width, ground.length, 32, 32);
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(parseInt(ground.color.replace('#', '0x'), 16)),
                shininess: ground.shininess,
                side: THREE.DoubleSide
            });
            this.groundObj = new THREE.Mesh(planeGeometry, planeMaterial);
            this.groundObj.position.setZ(ground.height);
            this.groundObj.receiveShadow = true;
            this.scene.add(this.groundObj);
        }

        if (this.settings.ambient_light.show) {
            this._addAmbientLight();
        }
        if (this.settings.hemisphere_light.show) {
            this._addHemisphereLight();
        }
        if (this.settings.directional_light.show) {
            this._addDirectionalLight();
        }
    }
    private _getNodeSelect(): void {
        const select_node: any = this.model.modeldata.attribs.get.getModelAttribVal('select_node');
        this.timelineEnabled = null;
        if (!select_node || !select_node.nodes) { return; }
        this.timeline_groups = select_node.nodes;
        const currentIndex = this.timeline_groups.indexOf(this.dataService.node.name);
        if (currentIndex !== -1) {
            this.timelineEnabled = 1;
            this.timelineIndex = currentIndex.toString();
            this.timelineValue = this.dataService.node.name;
            if (select_node.widget === 'dropdown') {
                this.timelineEnabled = 2;
            }
        }
        if (this.dataService.timelineDefault && select_node.default) {
            const nodeSelInput = <HTMLInputElement> document.getElementById('hidden_node_selection');
            nodeSelInput.value = select_node.default;
            (<HTMLButtonElement> document.getElementById('hidden_node_selection_button')).click();
            this.dataService.timelineDefault = false;
        }
    }
    /**
     *
     * @param scale
     * @param azimuth
     * @param altitude
     */
    public getDLPosition(scale = null, azimuth = null, altitude = null): void {
        if (!scale && scale !== 0) {
            scale = this.directional_light_settings.distance;
        }
        if (!azimuth && azimuth !== 0) {
            azimuth = this.directional_light_settings.azimuth;
        }
        if (!altitude && altitude !== 0) {
            altitude = this.directional_light_settings.altitude;
        }
        if (this.model && this.model.modeldata.attribs && this.model.modeldata.attribs.query
        && this.model.modeldata.attribs.query.hasModelAttrib('directional_light')) {
            const model_light_settings: any = this.model.modeldata.attribs.get.getModelAttribVal('directional_light');
            if (model_light_settings.constructor === {}.constructor) {
                if (model_light_settings.hasOwnProperty('altitude')) {
                    altitude = model_light_settings.altitude;
                }
                if (model_light_settings.hasOwnProperty('azimuth')) {
                    azimuth = model_light_settings.azimuth;
                }
            }
        }
        if (scale === 0) { scale = 10000; }
        let azimuth_calc = 90 - azimuth;
        if (this.model && this.model.modeldata.attribs && this.model.modeldata.attribs.query
        && this.model.modeldata.attribs.query.hasModelAttrib('north')) {
            const north_attr: number[] = this.model.modeldata.attribs.get.getModelAttribVal('north') as number[];
            const north_vec = new THREE.Vector3(north_attr[0], north_attr[1], 0);
            const y_vec = new THREE.Vector3(0, 1, 0);
            const angle = north_vec.angleTo(y_vec) * 180 / Math.PI;
            if (north_attr[0] > 0) {
                azimuth_calc -= angle;
            } else {
                azimuth_calc += angle;
            }
        }
        let posX = Math.cos(altitude * Math.PI * 2 / 360) * Math.cos(azimuth_calc * Math.PI * 2 / 360) * scale * 2,
            posY = Math.cos(altitude * Math.PI * 2 / 360) * Math.sin(azimuth_calc * Math.PI * 2 / 360) * scale * 2,
            posZ = Math.sin(altitude * Math.PI * 2 / 360) * scale * 2;

        if (this._all_objs_sphere) {
            posX += this._all_objs_sphere.center.x;
            posY += this._all_objs_sphere.center.y;
            posZ += this._all_objs_sphere.center.z;
        }
        this.directional_light.position.set(posX, posY, posZ);
    }

    /**
     * Add axes
     * @param size
     */
    public _addAxes(size: number = this.settings.axes.size) {
        let i = 0;
        const length = this.scene.children.length;
        if (length !== 0) {
            for (; i < length; i++) {
                if (this.scene.children[i]) {
                    if (this.scene.children[i].name === 'AxesHelper') {
                        this.scene.children[i]['dispose']();
                        this.scene.remove(this.scene.children[i]);
                    }
                }
            }
        }
        this.axesHelper = new THREE.AxesHelper(size);
        this.axesHelper.geometry['attributes'].color = new THREE.Int16BufferAttribute(
            [1, 0, 0, 1, 0, 0,
             0, 1, 0, 0, 1, 0,
             0, 0, 1, 0, 0, 1], 3 );
        this.axesHelper.visible = this.settings.axes.show;
        if (this.axesHelper.visible) {
            this.axesHelper.name = 'AxesHelper';
            this.axesHelper.position.set(this.axes_pos.x, this.axes_pos.y, this.axes_pos.z);
            this.axesHelper.position.set(0, 0, 0);
            this.scene.add(this.axesHelper);
        }
    }
    /**
     * Draws a grid on the XY plane.
     * @param size
     */
    public _addGrid(size: number = this.settings.grid.size) {
        let i = 0;
        const length = this.scene.children.length;
        for (; i < length; i++) {
            if (this.scene.children[i]) {
                if (this.scene.children[i].name === 'GridHelper') {
                    if (this.scene.children[i]['dispose']) {
                        this.scene.children[i]['dispose']();
                    }
                    this.scene.remove(this.scene.children[i]);
                }
            }
        }
        this.grid = new THREE.GridHelper(size, size / 10, 0x888888, 0x888888);
        this.grid.visible = this.settings.grid.show;
        // todo: change grid -> grid_value
        if (this.grid.visible) {
            this.grid.name = 'GridHelper';
            const vector = new THREE.Vector3(0, 1, 0);
            this.grid.lookAt(vector);
            let pos = this.settings.grid.pos;
            if (!pos) {
                pos = new THREE.Vector3();
            }
            if (!pos.z) {
                this.grid.position.set(pos.x, pos.y, -0.01);
            } else {
                this.grid.position.set(pos.x, pos.y, pos.z);
            }
            this.scene.add(this.grid);
        }
    }
    /**
     *
     */
    public getGridPos() {
        if (this._all_objs_sphere) {
            const grd_pos = new THREE.Vector3(this._all_objs_sphere.center.x, this._all_objs_sphere.center.y, 0);
            this.grid.position.set(grd_pos.x, grd_pos.y, -0.01);
            return grd_pos;
        }
        const grid_pos = new THREE.Vector3(0, 0, 0);
        this.grid.position.set(0, 0, -0.01);
        return grid_pos;
    }

    // ============================================================================
    // ============================================================================
    // Private methods
    // ============================================================================
    // ============================================================================
    /**
     * Create the buffer for threejs triangles
     */
    private _createTrisBuffGeom(
            tris_i_buff_attrib: THREE.BufferAttribute,
            coords_buff_attrib: THREE.BufferAttribute,
            colors_buff_attrib: THREE.BufferAttribute,
            normals_buff_attrib: THREE.BufferAttribute,
            material_groups: Uint32Array): THREE.BufferGeometry {
        const tris_geom_buff = new THREE.BufferGeometry();
        tris_geom_buff.setIndex( tris_i_buff_attrib );
        tris_geom_buff.setAttribute('position', coords_buff_attrib );
        tris_geom_buff.setAttribute('color', colors_buff_attrib );
        if (normals_buff_attrib !== null) { tris_geom_buff.setAttribute('normal', normals_buff_attrib ); }
        tris_geom_buff.clearGroups();
        for (let i = 0; i < material_groups.length; i = i + 3) {
            tris_geom_buff.addGroup(material_groups[i], material_groups[i + 1], material_groups[i + 2]);
        }
        return tris_geom_buff;
    }


    /**
     * Add threejs triangles to the scene
     */
    private _addTris(tris_i: number[], posis_buffer: THREE.Float32BufferAttribute,
                     colors_buffer: THREE.Float32BufferAttribute,
                     normals_buffer: THREE.Float32BufferAttribute,
                     material_groups, materials): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(tris_i);
        geom.setAttribute('position', posis_buffer);
        if (normals_buffer.count > 0) {
            geom.setAttribute('normal', normals_buffer);
        }
        geom.setAttribute('color', colors_buffer);
        const colorf = new THREE.Color(parseInt(this.settings.colors.face_f.replace('#', '0x'), 16));
        const colorb = new THREE.Color(parseInt(this.settings.colors.face_b.replace('#', '0x'), 16));
        geom.clearGroups();
        material_groups.forEach(element => {
            geom.addGroup(element[0], element[1], element[2]);
        });
        // this._buffer_geoms.push(geom);

        const material_arr = [];
        let index = 0;
        const l = materials.length;
        for (; index < l; index++) {
            const element = materials[index];
            // if (this.settings.background.show) {
            //     element.envMap = this.scene.background;
            //     // element.refractionRatio = 1;
            //     // element.envMap.mapping = THREE.CubeRefractionMapping;
            // }
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
                    if (this.settings.background.show) {
                        element.envMap = this.scene.background;
                    }
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

        // show vertex normals
        this.vnh = new THREE.VertexNormalsHelper(mesh, this.settings.normals.size, 0x0000ff);
        this.vnh.visible = this.settings.normals.show;
        this.scene.add(this.vnh);
        this.scene_objs.push(mesh);
        // add mesh to scene
        this.scene.add(mesh);
        this.threejs_nums[2] = tris_i.length / 3;
    }

    // ============================================================================
    /**
     * Add threejs lines to the scene
     */
    private _addLines(lines_i: number[],
                    posis_buffer: THREE.Float32BufferAttribute,
                    color_buffer: THREE.Float32BufferAttribute,
                    material_groups, materials): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(lines_i);
        geom.setAttribute('position', posis_buffer);
        geom.setAttribute('color', color_buffer);
        // this._buffer_geoms.push(geom);

        // // // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        // const mat = new THREE.LineDashedMaterial({
        //     color: 0x000000,
        //     vertexColors: THREE.VertexColors,
        //     gapSize: 0
        // });
        // const line = new THREE.LineSegments(geom, mat);
        // this.scene_objs.push(line);
        // this.scene.add(line);

        // const geom_white = new THREE.BufferGeometry();
        // geom_white.setIndex(white_line_i);
        // geom_white.setAttribute('position', posis_buffer);
        // geom_white.setAttribute('color', color_buffer);
        // // this._buffer_geoms.push(geom_white);

        // // // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        // const mat_white = new THREE.LineDashedMaterial({
        //     color: 0xFFFFFF,
        //     vertexColors: THREE.VertexColors,
        //     gapSize: 0
        // });
        // const line_white = new THREE.LineSegments(geom_white, mat_white);
        // this.scene_objs.push(line_white);
        // this.scene.add(line_white);

        // this.threejs_nums[1] = lines_i.length  / 2;


        const material_arr = [];
        let index = 0;
        const l = materials.length;
        for (; index < l; index++) {
            const element = materials[index];
            if (element.type === 'LineBasicMaterial') {
                const mat = new THREE.LineDashedMaterial({
                    color: element.color || 0,
                    vertexColors: THREE.VertexColors,
                    scale: 1,
                    dashSize: 1000,
                    gapSize: 0,
                });
                material_arr.push(mat);
            } else {
                const mat = new THREE.LineDashedMaterial({
                    color: element.color || 0,
                    scale: element.scale || 1,
                    dashSize: element.dashSize || 2,
                    gapSize: element.gapSize || 1,
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
        this.scene_objs.push(line);
        this.scene.add(line);
        this.threejs_nums[1] = lines_i.length / 2;

    }
    // ============================================================================
    /**
     * Add threejs points to the scene
     */
    private _addPoints(points_i: number[],
                        posis_buffer: THREE.Float32BufferAttribute,
                        colors_buffer: THREE.Float32BufferAttribute,
                        color: [number, number, number],
                        size: number = 1): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(points_i);
        geom.setAttribute('position', posis_buffer);
        geom.setAttribute('color', colors_buffer);

        // this._buffer_geoms.push(geom);
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
        this.scene_objs.push(point);
        this.scene.add(point);
        this.threejs_nums[0] = points_i.length;
    }
    // ============================================================================
    /**
     * Add threejs points to the scene
     */
    private _addPointLabels(model: GIModel): void {
        const labels = model.modeldata.attribs.get.getModelAttribVal('labels');
        if (!labels || !isArray(labels) || labels.length === 0) {
            return;
        }

        const matLite = new THREE.MeshBasicMaterial( {
            transparent: false,
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors
        } );
        const shapes = [];

        const fromVec = new THREE.Vector3(0, 0, 1);
        const checkVecFrom = new THREE.Vector3(1, 0, 0);

        for (const label of labels) {
            const labelText = label.text;
            const labelOrient = label.position || label.location;
            if (!labelText || !labelOrient || !isArray(labelOrient)) { continue; }
            const labelSize = label.size || 20;

            const shape = this._text_font.generateShapes( labelText, labelSize , 1);
            const geom = new THREE.ShapeBufferGeometry(shape);

            let labelPos = labelOrient[0];

            if (!isArray(labelPos)) {
                labelPos = labelOrient;
            } else {
                let toVec = new THREE.Vector3(...labelOrient[1]);
                const pVec2 = new THREE.Vector3(...labelOrient[2]);
                toVec = toVec.cross(pVec2).normalize();

                if (labelOrient[1][0] !== 0 || labelOrient[1][1] !== 0) {
                    const checkVecTo = new THREE.Vector3(labelOrient[1][0], labelOrient[1][1], 0).normalize();
                    const rotateQuat = new THREE.Quaternion();
                    rotateQuat.setFromUnitVectors(checkVecFrom, checkVecTo);
                    const rotateMat = new THREE.Matrix4(); // create one and reuse it
                    rotateMat.makeRotationFromQuaternion(rotateQuat);
                    geom.applyMatrix(rotateMat);
                }

                const quaternion = new THREE.Quaternion();
                quaternion.setFromUnitVectors(fromVec, toVec);
                const matrix = new THREE.Matrix4(); // create one and reuse it
                matrix.makeRotationFromQuaternion(quaternion);
                geom.applyMatrix(matrix);
            }
            geom.translate( labelPos[0], labelPos[1], labelPos[2]);

            let color = new THREE.Color(0);
            if (label.color  && label.color.length === 3) {
                color = new THREE.Color(`rgb(${label.color[0]}, ${label.color[1]}, ${label.color[2]})`);
            }
            const colors_buffer = new THREE.Float32BufferAttribute(geom.attributes.position.count * 3, 3);
            if (label.color && label.color.length === 3) {
                for (let i = 0; i < colors_buffer.count; i++) {
                    colors_buffer.setXYZ(i, label.color[0], label.color[1], label.color[2]);
                }
            }
            geom.setAttribute('color', colors_buffer);
            shapes.push(geom);
        }
        if (shapes.length === 0) { return; }
        const mergedGeom = BufferGeometryUtils.mergeBufferGeometries(shapes);
        const text = new THREE.Mesh(mergedGeom , matLite);
        this.scene.add(text);
        // this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.scene, this.camera);
    }


    // ============================================================================
    /**
     * Add threejs positions to the scene
     */
    private _addPosis(points_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        color: string,
        size: number = 1): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(points_i);
        // geom.addAttribute('position', posis_buffer);
        geom.setAttribute('position', posis_buffer);
        // this._buffer_geoms.push(geom);
        // geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial({
            color: new THREE.Color(parseInt(color.replace('#', '0x'), 16)),
            size: size,
            sizeAttenuation: false
            // vertexColors: THREE.VertexColors
        });
        const point = new THREE.Points(geom, mat);
        this.scene_objs.push(point);
        this.scene.add(point);
        this.positions.push(point);
        this.positions.map(p => p.visible = this.settings.positions.show);
    }
    // ============================================================================
    /**
     *
     * @param text
     */
    private _createHud(text: string) {
        const div = document.createElement('div');
        div.id = `hud`;
        div.style.position = 'absolute';
        div.style.background = 'rgba(255, 255, 255, 0.3)';
        div.style.padding = '5px';
        div.innerHTML = text;
        div.style.top = '40px';
        div.style.left = '5px';
        div.style.maxWidth = '200px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.fontSize = '14px';
        return {
            element: div
        };
    }
    /**
     *
     * @param background_set
     */
    private _loadBackground(background_set: number) {
        const path = 'assets/img/background/bg' + background_set + '/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        this.cameraBackgrounds = {};
        new THREE.CubeTextureLoader().load(urls, texture => {
            this.renderer.render(this.scene, this.camera);
            texture.format = THREE.RGBFormat;
            this.cameraBackgrounds['Persp'] = texture;
            this.scene.background = this.cameraBackgrounds[this.currentCamera];
        });
        new THREE.TextureLoader().load(path + 'nz' + format, texture => {
            this.renderer.render(this.scene, this.camera);
            texture.format = THREE.RGBFormat;
            this.cameraBackgrounds['Top'] = texture;
            this.scene.background = this.cameraBackgrounds[this.currentCamera];
        });
        new THREE.TextureLoader().load(path + 'left' + format, texture => {
            this.renderer.render(this.scene, this.camera);
            texture.format = THREE.RGBFormat;
            this.cameraBackgrounds['Left'] = texture;
            this.scene.background = this.cameraBackgrounds[this.currentCamera];
        });
        new THREE.TextureLoader().load(path + 'front' + format, texture => {
            this.renderer.render(this.scene, this.camera);
            texture.format = THREE.RGBFormat;
            this.cameraBackgrounds['Front'] = texture;
            this.scene.background = this.cameraBackgrounds[this.currentCamera];
        });

        // this._renderer.render(this._scene, this._camera);
    }

    /**
     * Create ambient light
     */
    private _addAmbientLight() {
        const color = new THREE.Color(parseInt(this.settings.ambient_light.color.replace('#', '0x'), 16));
        const intensity = this.settings.ambient_light.intensity;
        this.ambient_light = new THREE.AmbientLight(color, intensity); // soft white light
        this.ambient_light.castShadow = false;
        this.scene.add(this.ambient_light);
    }

    /**
     * Create hemisphere light
     */
    private _addHemisphereLight() {
        const skyColor = new THREE.Color(parseInt(this.settings.hemisphere_light.skyColor.replace('#', '0x'), 16));
        const groundColor = new THREE.Color(parseInt(this.settings.hemisphere_light.groundColor.replace('#', '0x'), 16));
        const intensity = this.settings.hemisphere_light.intensity;
        this.hemisphere_light = new THREE.HemisphereLight(
            skyColor, // skyColor
            groundColor, // groundColor
            intensity // intensity
        );
        this.scene.add(this.hemisphere_light);
        const helper = new THREE.HemisphereLightHelper(this.hemisphere_light, 10);
        helper.visible = this.settings.hemisphere_light.helper;
        this.scene.add(helper);
    }

    // Create Directional Light
    private _addDirectionalLight(): void {
        this.directional_light_settings = JSON.parse(JSON.stringify(this.settings.directional_light));
        if (this.model
        && this.model.modeldata.attribs
        && this.model.modeldata.attribs.query
        && this.model.modeldata.attribs.query.hasModelAttrib('directional_light')) {
            const model_light_settings: any = this.model.modeldata.attribs.get.getModelAttribVal('directional_light');
            if (model_light_settings.constructor === {}.constructor) {
                for (const i in model_light_settings) {
                    if (model_light_settings[i]) {
                        this.directional_light_settings[i] = model_light_settings[i];
                    }
                }
            }
        }

        this.directional_light = new THREE.DirectionalLight(this.directional_light_settings.color,
            this.directional_light_settings.intensity);

        // if (this.directional_light_settings.type === 'directional') {
        //     this.directional_light = new THREE.DirectionalLight(this.directional_light_settings.color,
        //         this.directional_light_settings.intensity);
        // } else {
        //     this.directional_light = new THREE.PointLight(this.directional_light_settings.color,
        //         this.directional_light_settings.intensity);
        // }
        let distance = 0;

        if (this._all_objs_sphere) {
            distance = Math.round(this._all_objs_sphere.radius);
            // if (distance < 10000) { distance = 10000; }
        }
        this.directional_light_settings.distance = distance;
        // this.getDLPosition(distance);
        this.directional_light.castShadow = this.directional_light_settings.shadow;
        this.directional_light.visible = this.directional_light_settings.show;
        // this.directional_light_settings.shadowSize = 2;
        // const shadowMapSize = this.directional_light_settings.shadowSize;
        if (this.directional_light_settings.shadowSize <= 10) {
            this.directional_light_settings.shadowSize = this.directional_light_settings.shadowSize * 512;
        }
        if (this.directional_light_settings.shadowSize < 1024) {
            this.directional_light_settings.shadowSize = 2048;
        }
        this.directional_light.shadow.mapSize.width = this.directional_light_settings.shadowSize;  // default
        this.directional_light.shadow.mapSize.height = this.directional_light_settings.shadowSize; // default
        // this.directional_light.shadow.camera.visible = true;

        this._setDLDistance(distance);
        this.scene.add(this.directional_light);
    }

    /**
     * Get the bounding sphere of all objects
     */
    private _getAllObjsSphere() {
        if (this.scene_objs.length !== 0) {
            const objs = new THREE.Object3D();
            this.scene_objs.map(obj => objs.children.push(obj));
            const boxHelper = new THREE.BoxHelper(objs);
            boxHelper.geometry.computeBoundingSphere();
            const boundingSphere = boxHelper.geometry.boundingSphere;
            return boundingSphere;
        } else {
            return null;
        }
    }
    /**
     *
     * @param size
     */
    private _setDLDistance(size = null): void {
        let scale;
        if (size) {
            scale = size;
        } else {
            scale = 10000;
        }
        if (this.directional_light) {
            let i = 0;
            const length = this.scene.children.length;
            if (length !== 0) {
                for (; i < length; i++) {
                    if (this.scene.children[i]) {
                        if (this.scene.children[i].name === 'DLHelper' || this.scene.children[i].name === 'lightTarget') {
                            this.scene.children[i]['dispose']();
                            this.scene.remove(this.scene.children[i]);
                        }
                    }
                }
            }
            this.directional_light.shadow.camera.near = 0.5;

            // let altitude = this.directional_light_settings.altitude;
            // if (altitude < 3) { altitude = 3; }
            // const altitudeOffset = Math.sin(altitude * Math.PI / 180);
            this.directional_light.shadow.camera.far = scale * 20;
            this.directional_light.shadow.bias = -0.0001;

            let helper;

            const cam = <THREE.OrthographicCamera> this.directional_light.shadow.camera;
            cam.up.set(0, 0, 1);
            cam.left = -scale;
            cam.right = scale;
            cam.top = scale;
            cam.bottom = -scale;
            if (this._all_objs_sphere) {
                const lightTarget = new THREE.Object3D();
                lightTarget.position.set(
                    this._all_objs_sphere.center.x, this._all_objs_sphere.center.y, this._all_objs_sphere.center.z);
                lightTarget.name = 'lightTarget';
                this.scene.add(lightTarget);
                (<THREE.DirectionalLight>this.directional_light).target = lightTarget;
            }
            helper = new THREE.CameraHelper(this.directional_light.shadow.camera);

            // if (this.directional_light_settings.type === 'directional') {
            //     const cam = <THREE.OrthographicCamera> this.directional_light.shadow.camera;
            //     cam.left = -scale;
            //     cam.right = scale;
            //     cam.top = scale;
            //     cam.bottom = -scale;
            //     if (this._all_objs_sphere) {
            //         const lightTarget = new THREE.Object3D();
            //         lightTarget.position.set(
            //             this._all_objs_sphere.center.x, this._all_objs_sphere.center.y, this._all_objs_sphere.center.z);
            //         lightTarget.name = 'lightTarget';
            //         this.scene.add(lightTarget);
            //         (<THREE.DirectionalLight>this.directional_light).target = lightTarget;
            //     }
            //     helper = new THREE.CameraHelper(this.directional_light.shadow.camera);
            // } else {
            //     helper = new THREE.PointLightHelper( <THREE.PointLight>this.directional_light );
            // }
            helper.visible = this.directional_light_settings.helper;
            helper.name = 'DLHelper';
            if (size) { this.scene.add(helper); }
            this.getDLPosition(scale);
        }
    }

    exportGLTF( input ) {
        let i = 0;
        input.children.splice(3, 1);
        input.children.splice(0, 1);
        while (i < input.children.length) {
            console.log(input.children[i])
            if (input.children[i].name !== '' || input.children[i].type === 'AmbientLight' ||
            input.children[i].type === 'HemisphereLight'
            // || input.children[i].type === 'LineSegments'
            ) {
                input.children.splice(i, 1);
                continue;
            }
            i++;
        }
        const gltfExporter = new GLTFExporter();
        const options = {
            trs: false,
            onlyVisible: false
        };
        gltfExporter.parse( input, function ( result ) {
                const output = JSON.stringify( result, null, 2 );
                console.log( output );
        }, options );
    }


    // ============================================================================
    // ============================================================================
    // Some old stuff
    // ============================================================================
    // ============================================================================

    // public disposeWebGL() {
    //     console.log('this._renderer.info', this._renderer.info.memory.geometries);
    //     this.sceneObjs.forEach(obj => {
    //         if (obj['dispose']) { obj['dispose'](); }
    //         this._scene.remove(obj);
    //     });
    //     const BufferGeoms = this.BufferGeoms;
    //     BufferGeoms.forEach(geom => {
    //         geom.dispose();
    //     });
    //     this.BufferGeoms = [];
    //     console.log('this._renderer.info', this._renderer.info.memory.geometries);
    // }

    // private cameraLookat(center, radius = 100) {
    //     const fov = this._camera.fov * (Math.PI / 180);
    //     const vec_centre_to_pos: THREE.Vector3 = new THREE.Vector3();
    //     vec_centre_to_pos.subVectors(this._camera.position, vec_centre_to_pos);
    //     const tmp_vec = new THREE.Vector3(Math.abs(radius / Math.sin(fov / 2)),
    //         Math.abs(radius / Math.sin(fov / 2)),
    //         Math.abs(radius / Math.sin(fov / 2)));
    //     vec_centre_to_pos.setLength(tmp_vec.length());
    //     const perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
    //     perspectiveNewPos.addVectors(center, vec_centre_to_pos);
    //     const newLookAt = this._camera.getWorldDirection(center);
    //     // this._camera.position.copy(perspectiveNewPos);
    //     this._camera.lookAt(newLookAt);
    //     this._camera.updateProjectionMatrix();
    //     this._controls.target.set(center.x, center.y, center.z);
    //     this._controls.update();
    //     const textLabels = this._textLabels;
    //     if (textLabels.size !== 0) {
    //         textLabels.forEach((label) => {
    //             label.updatePosition();
    //         });
    //     }
    // }

    // public DLMapSize(size = null): void {
    //     let _size;
    //     if (size) {
    //         _size = 1024 * size;
    //     } else {
    //         _size = 8192;
    //     }
    //     if (this.directional_light) {
    //         this.directional_light.shadow.mapSize.width = _size;
    //         this.directional_light.shadow.mapSize.width = _size;
    //     }
    //     // this._renderer.render(this._scene, this._camera);
    // }

    // public onWindowKeyPress(event: KeyboardEvent): boolean {
    //     const nodeName = (<Element>event.target).nodeName;
    //     if (nodeName === 'TEXTAREA' || nodeName === 'INPUT') { return false; }
    //     const segment_str = window.location.pathname;
    //     const segment_array = segment_str.split('/');
    //     const last_segment = segment_array[segment_array.length - 1];
    //     if (last_segment === 'editor') {
    //         return false;
    //     }
    //     if (event.ctrlKey || event.metaKey) {
    //         return false;
    //     }
    //     const keyCode = event.which;
    //     // console.log(keyCode);
    //     const positionDelta = 10;
    //     const rotationDelta = 0.02;
    //     const xp = this._camera.position.x;
    //     const yp = this._camera.position.y;
    //     switch (keyCode) {
    //         case 65: // A: move left
    //             this._camera.position.x -= positionDelta;
    //             break;
    //         case 68: // D: move right
    //             this._camera.position.x += positionDelta;
    //             break;
    //         case 87: // W: move forward
    //             this._camera.position.y += positionDelta;
    //             break;
    //         case 83: // S: move backward
    //             this._camera.position.y -= positionDelta;
    //             break;
    //         case 90: // Z: move up
    //             this._camera.position.z += positionDelta;
    //             break;
    //         case 88: // X: move down
    //             this._camera.position.z -= positionDelta;
    //             break;
    //         case 81: // Q: rotate clockwise
    //             this._camera.position.x = xp * Math.cos(rotationDelta) + yp * Math.sin(rotationDelta);
    //             this._camera.position.y = yp * Math.cos(rotationDelta) - xp * Math.sin(rotationDelta);
    //             this._camera.lookAt(this._scene.position);
    //             break;
    //         case 69: // E: rotate anticlockwise
    //             this._camera.position.x = xp * Math.cos(rotationDelta) - yp * Math.sin(rotationDelta);
    //             this._camera.position.y = yp * Math.cos(rotationDelta) + xp * Math.sin(rotationDelta);
    //             this._camera.lookAt(this._scene.position);
    //             break;
    //         case 84: // T
    //             this._camera.rotation.x += rotationDelta;
    //             break;
    //         case 71: // G
    //             this._camera.rotation.x -= rotationDelta;
    //             break;
    //         case 70: // F
    //             this._camera.rotation.y += rotationDelta;
    //             break;
    //         case 72: // H
    //             this._camera.rotation.y -= rotationDelta;
    //             break;
    //         default:
    //             break;
    //     }
    //     return true;
    // }

}

