import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';
import { EEntTypeStr, EEntType } from '@libs/geo-info/common';
import { Vector3 } from 'three';
import { DataService } from '@services';
import { Vector } from '@assets/core/modules/basic/calc';
enum objType {
    point = 'point',
    line = 'line',
    face = 'face'
}
enum MaterialType {
    MeshBasicMaterial = 'MeshBasicMaterial',
    MeshStandardMaterial = 'MeshStandardMaterial',
    MeshLambertMaterial = 'MeshLambertMaterial',
    MeshPhongMaterial = 'MeshPhongMaterial',
    MeshPhysicalMaterial = 'MeshPhysicalMaterial'
}

/**
 * ThreejsScene
 */
export class DataThreejs {
    // threeJS objects
    public _scene: THREE.Scene;
    // public basic_scene: THREE.Scene;
    public _renderer: THREE.WebGLRenderer;
    public _camera;
    public _controls: any;
    public _raycaster: THREE.Raycaster;
    public _mouse: THREE.Vector2;
    // interaction and selection
    public tri_select_map: Map<number, number>;
    public edge_select_map: Map<number, number>;
    public point_select_map: Map<number, number>;
    public posis_map: Map<number, number>;
    public vertex_map: Map<number, number>;

    public selected_geoms: Map<string, number> = new Map();
    public selected_positions: Map<string, Map<string, number>> = new Map();
    public selected_vertex: Map<string, Map<string, number>> = new Map();
    public selected_face_edges: Map<string, Map<string, number>> = new Map();
    public selected_face_wires: Map<string, Map<string, number>> = new Map();
    public _text: string;
    // text labels
    public ObjLabelMap: Map<string, any> = new Map();
    public _textLabels: Map<string, any> = new Map();
    // number of threejs points, lines, triangles
    public _threejs_nums: [number, number, number] = [0, 0, 0];
    // grid
    public grid: THREE.GridHelper;
    // public grid_pos: THREE.Vector3 = new THREE.Vector3();
    // axes
    public axesHelper: THREE.AxesHelper;
    private axes_pos: THREE.Vector3 = new THREE.Vector3();
    directional_light: THREE.DirectionalLight|THREE.PointLight;
    directional_light_settings: Settings['directional_light'];
    ambient_light: THREE.AmbientLight;
    hemisphere_light: THREE.HemisphereLight;
    groundObj: THREE.Mesh;
    // the GI model to display
    public _model: GIModel;

    public sceneObjs: THREE.Object3D[] = [];
    public sceneObjsSelected: Map<string, THREE.Object3D> = new Map();
    public _positions: THREE.Object3D[] = [];
    // Show Normals
    public vnh: THREE.VertexNormalsHelper;
    // Settings
    public settings: Settings;

    // BufferGeoms
    private BufferGeoms: THREE.BufferGeometry[] = [];

    // initial origin
    private origin: Vector3 = new Vector3(0, 1, 0);
    private allObjs: THREE.Sphere;
    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: Settings, private dataService: DataService) {
        this.settings = settings;
        if (!this.settings.directional_light.type) {
            this.settings.directional_light.type = 'directional';
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }
        // scene
        this._scene = new THREE.Scene();

        // var loader = new THREE.ImageLoader();

        // for (var i = 0; i < 6; i++) {
        //     materialArray.push( new THREE.MeshBasicMaterial({
        //         map: loader.load( urls[i] ),
        //         side: THREE.BackSide
        //     }))
        // }

        // var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
        // var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        // var skybox = new THREE.Mesh( skyGeometry, skyMaterial );


        if (this.settings.background.show) {
            this.loadBackground(this.settings.background.background_set);
        } else {
            this._scene.background = new THREE.Color(this.settings.colors.viewer_bg);
        }

        // this.basic_scene = new THREE.Scene();
        // this.basic_scene.background = new THREE.Color(0xE6E6E6);

        // renderer
        this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
        this._renderer.autoClear = false;
        // this._renderer.setClearColor(0xcccccc, 0);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth / 1.8, window.innerHeight);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // camera settings
        // THREE.OrthographicCamera
        const frustumSize = 600;
        const aspect = window.innerWidth / window.innerHeight;
        // this._camera = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2,
        //     0.5 * frustumSize * aspect / 2,
        //     frustumSize / 2, frustumSize / - 2, 150, 1000 );
        this._camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000000);
        this._camera.position.x = -80;
        this._camera.position.y = -80;
        this._camera.position.z = 80;
        this._camera.aspect = 1;
        this._camera.up.set(0, 0, 1);
        this._camera.lookAt(this._scene.position);
        this._camera.updateProjectionMatrix();

        // orbit controls
        const orbit_controls = OrbitControls(THREE);
        this._controls = new orbit_controls(this._camera, this._renderer.domElement);
        this._controls.enableKeys = false;
        this._controls.update();

        // mouse
        this._mouse = new THREE.Vector2();

        // selecting
        this._raycaster = new THREE.Raycaster();
        this._raycaster.linePrecision = 0.3; // TODO this need to be set dynamically based on model size and view zoom
        this._raycaster.params.Points.threshold = 0.3; // TODO this need to be set dynamically based on model size and view zoom

        // add grid and lights
        this._addGrid();
        if (this.settings.ambient_light.show) {
            this._addAmbientLight();
        }
        if (this.settings.hemisphere_light.show) {
            this._addHemisphereLight();
        }
        if (this.settings.directional_light.show) {
            this._addDirectionalLight();
        }
        this._addAxes();
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
    /**
     *
     * @param model
     * @param container
     */
    public addGeometry(model: GIModel, container): void {
        if (this.dataService.viewerSettingsUpdated) {
            this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
            this._camera.position.copy(this.settings.camera.pos);
            this._controls.target.copy(this.settings.camera.target);
            this._camera.updateProjectionMatrix();
            this._controls.update();
            this.dataService.viewerSettingsUpdated = false;
        }
        if (this.settings.background.show) {
            this.loadBackground(this.settings.background.background_set);
        } else {
            this._scene.background = new THREE.Color(this.settings.colors.viewer_bg);
        }
        while (this._scene.children.length > 0) {
            DataThreejs.disposeObjectProperty(this._scene.children[0], 'geometry');
            // DataThreejs.disposeObjectProperty(this._scene.children[0], 'material');
            DataThreejs.disposeObjectProperty(this._scene.children[0], 'texture');
            this._scene.remove(this._scene.children[0]);
            this.sceneObjs = [];
        }
        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            container.removeChild(value);
        });
        this.ObjLabelMap.clear();
        this._textLabels.clear();

        this._addGrid();
        this._addAxes();

        // Add geometry
        const threejs_data: IThreeJS = model.threejs.get3jsData();
        // if (threejs_data.posis_indices.length === 0) {
            // this._camera.position.set(-80, -80, 80);
            // this._camera.lookAt(this._scene.position);
            // return;
        // }
        // if (this.settings.camera !== undefined) {
        //     this._camera.position.set(this.settings.camera.pos.x, this.settings.camera.pos.y, this.settings.camera.pos.z);
        // } else {
        //     this._camera.position.set(-200, -200, 200);
        // }
        // this._camera.lookAt(this._scene.position);

        this.tri_select_map = threejs_data.triangle_select_map;
        this.edge_select_map = threejs_data.edge_select_map;
        this.point_select_map = threejs_data.point_select_map;
        this.posis_map = threejs_data.posis_map;
        this.vertex_map = threejs_data.vertex_map;

        const material_groups = threejs_data.material_groups;
        const materials = threejs_data.materials;

        // Create buffers that will be used by all geometry
        const verts_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.vertex_xyz, 3);
        const normals_buffer = new THREE.Float32BufferAttribute(threejs_data.normals, 3);
        const colors_buffer = new THREE.Float32BufferAttribute(threejs_data.colors, 3);
        const posis_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.posis_xyz, 3);
        this._addTris(threejs_data.triangle_indices, verts_xyz_buffer, colors_buffer, material_groups, materials);
        this._addLines(threejs_data.edge_indices, verts_xyz_buffer, colors_buffer, normals_buffer);
        this._addPoints(threejs_data.point_indices, verts_xyz_buffer, colors_buffer, [255, 255, 255], this.settings.positions.size + 1);
        this._addPositions(threejs_data.posis_indices, posis_xyz_buffer, this.settings.colors.position, this.settings.positions.size);

        const position_size = this.settings.positions.size;
        this._raycaster.params.Points.threshold = position_size > 1 ? position_size / 3 : position_size / 4;

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
            this._scene.add(this.groundObj);
        }

        this.allObjs = this.getAllObjs();
        if (this.settings.ambient_light.show) {
            this._addAmbientLight();
        }
        if (this.settings.hemisphere_light.show) {
            this._addHemisphereLight();
        }
        if (this.settings.directional_light.show) {
            this._addDirectionalLight();
        }


        // const center = new Vector3(0, 0, 0); // allObjs.center;
        // this.axes_pos.x = center.x;
        // this.axes_pos.y = center.y;
        let grid_pos = this.settings.grid.pos;
        if (!grid_pos) {
            grid_pos = new Vector3(0, 0, 0);
        }
        this.grid.position.set(grid_pos.x, grid_pos.y, 0);
        this.axesHelper.position.set(grid_pos.x, grid_pos.y, 0.01);

        // if (threejs_data.posis_indices.length !== 0) {
        //     if (this.dataService.newFlowchart) {
        //         this.dataService.newFlowchart = false;
        //         this.origin = new Vector3(center.x, center.y, 0);
        //         // this.settings.camera.target = this.origin ;
        //         localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        //         this.axesHelper.position.set(center.x, center.y, 0.01);
        //     } else {
        //         this.axesHelper.position.set(grid_pos.x, grid_pos.y, 0.01);
        //     }
        //     // const target = new Vector3(this.settings.camera.target.x, this.settings.camera.target.y, this.settings.camera.target.z);
        //     // this._camera.position.x += target.x;
        //     // this._camera.position.y += target.y;
        //     // this._camera.position.z += target.z;
        //     // this._camera.lookAt(target);
        //     // this._camera.updateProjectionMatrix();
        //     // this._controls.target.set(target.x, target.y, target.z);
        //     // this._controls.update();
        // }

        setTimeout(() => {
            let old = document.getElementById('hud');
            if (old) {
                container.removeChild(old);
            }
            if (!this._model.attribs.query.hasAttrib(EEntType.MOD, 'hud')) { return; }
            const hud = this._model.attribs.query.getModelAttribVal('hud') as string;
            const element = this._createHud(hud).element;
            container.appendChild(element);
            old = null;
        }, 0);
    }

    /**
     *
     * @param ent_id
     * @param triangle_i
     * @param positions
     * @param container
     * @param label
     */
    public selectObjFace(ent_id: string,
        tris_i: number[],
        positions: number[],
        container,
        labelText = null) {

        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const geom = new THREE.BufferGeometry();
        geom.setIndex(tris_i);
        // geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // geom.addAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        // geom.addAttribute('color', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.setAttribute('color', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.clearGroups();
        geom.addGroup(0, tris_i.length, 0);
        geom.addGroup(0, tris_i.length, 1);
        const colorf = new THREE.Color(parseInt(this.settings.colors.face_f_s.replace('#', '0x'), 16));
        const colorb = new THREE.Color(parseInt(this.settings.colors.face_b_s.replace('#', '0x'), 16));
        const matf = new THREE.MeshPhongMaterial({
            specular: 0x000000,
            emissive: 0x000000,
            color: colorf,
            shininess: 0,
            side: THREE.FrontSide
        });
        const matb = new THREE.MeshPhongMaterial({
            specular: 0x000000,
            emissive: 0x000000,
            color: colorb,
            shininess: 0,
            side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geom, [matf, matb]);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        this._scene.add(mesh);
        this.selected_geoms.set(ent_id, mesh.id);
        this.sceneObjsSelected.set(ent_id, mesh);
        if (labelText) {
            const obj: { entity: THREE.Mesh, type: string, text: string } = { entity: mesh, type: objType.face, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
        this.BufferGeoms.push(geom);
    }

    private initBufferLine(positions, indices: number[], colors: [number, number, number]) {
        const geom = new THREE.BufferGeometry();
        if (indices.length > 2) {
            geom.setIndex(indices);
        } else {
            geom.setIndex([0, 1]);
        }
        // geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // geom.addAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        this.BufferGeoms.push(geom);
        const rgb = `rgb(${colors.toString()})`;
        const mat = new THREE.LineBasicMaterial({
            color: new THREE.Color(rgb),
            linewidth: 5,
            linecap: 'round', // ignored by WebGLRenderer
            linejoin: 'round' // ignored by WebGLRenderer
        });
        const bg = { geom, mat };
        return bg;
    }

    public selectObjLine(ent_id: string, indices, positions, container, labelText = null) {
        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        const line = new THREE.LineSegments(bg.geom, bg.mat);
        this._scene.add(line);
        this.selected_geoms.set(ent_id, line.id);
        this.sceneObjsSelected.set(ent_id, line);

        if (labelText) {
            const obj: { entity: THREE.LineSegments, type: string, text: string } = { entity: line, type: objType.line, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }

    public selectEdgeByFace(parent_ent_id: string, ent_id: string, indices, positions, container, labelText = null) {
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        if (this.selected_face_edges.get(parent_ent_id) === undefined) {
            this.selected_face_edges.set(parent_ent_id, new Map());
        }

        const check_exist: string[] = [];
        this.selected_face_edges.forEach(v => {
            v.forEach((vv, k) => {
                check_exist.push(k);
            });
        });

        this.selected_geoms.forEach((v, k) => {
            check_exist.push(k);
        });

        if (!check_exist.includes(ent_id)) {
            const line = new THREE.LineSegments(bg.geom, bg.mat);
            this._scene.add(line);
            this.selected_face_edges.get(parent_ent_id).set(ent_id, line.id);
            this.selected_geoms.set(ent_id, line.id);
            this.sceneObjsSelected.set(ent_id, line);
            if (labelText) {
                const obj: {
                    entity: THREE.LineSegments,
                    type: string,
                    text: string
                } = {
                    entity: line,
                    type: objType.line,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }

    public selectWireByFace(parent_ent_id: string, ent_id: string, indices, positions, container, labelText = null) {
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        if (this.selected_face_wires.get(parent_ent_id) === undefined) {
            this.selected_face_wires.set(parent_ent_id, new Map());
        }

        const check_exist: string[] = [];
        this.selected_face_wires.forEach(v => {
            v.forEach((vv, k) => {
                check_exist.push(k);
            });
        });

        this.selected_geoms.forEach((v, k) => {
            check_exist.push(k);
        });

        if (!check_exist.includes(ent_id)) {
            const line = new THREE.LineSegments(bg.geom, bg.mat);
            this._scene.add(line);
            this.selected_face_wires.get(parent_ent_id).set(ent_id, line.id);
            this.selected_geoms.set(ent_id, line.id);
            this.sceneObjsSelected.set(ent_id, line);
            if (labelText) {
                const obj: {
                    entity: THREE.LineSegments,
                    type: string,
                    text: string
                } = {
                    entity: line,
                    type: objType.line,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }

    private initBufferPoint(positions: number[],
        point_indices = null,
        colors: number[] = null,
        color: string,
        size: number = 1) {
        // TODO check color and colors
        const geom = new THREE.BufferGeometry();
        if (point_indices) {
            geom.setIndex(point_indices);
        }
        // geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const color_rgb = new THREE.Color(parseInt(color.replace('#', '0x'), 16));
        if (colors) {
            // geom.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        } else {
            let color_data;
            if (positions) {
                if (positions && positions.length < 3) {
                    color_data = [color_rgb.r, color_rgb.g, color_rgb.b];
                } else {
                    // @ts-ignore
                    color_data = Array(positions.length / 3).fill([color_rgb.r, color_rgb.g, color_rgb.b]).flat(1);
                }
            }
            const color_buffer = new Uint8Array(color_data);
            // geom.addAttribute('color', new THREE.BufferAttribute(color_buffer, 3, true));
            geom.setAttribute('color', new THREE.BufferAttribute(color_buffer, 3, true));
        }
        geom.computeBoundingSphere();
        this.BufferGeoms.push(geom);
        const mat = new THREE.PointsMaterial({
            color: color_rgb,
            size: size,
            sizeAttenuation: false
            // vertexColors: THREE.VertexColors
        });
        const bg = { geom, mat };
        return bg;
    }

    public selectObjPoint(ent_id: string = null, point_indices, positions, container, labelText = null) {
        if (this.selected_geoms.has(ent_id)) {
            return;
        }
        const bg = this.initBufferPoint(positions, point_indices, null, '#ff0000');
        const point = new THREE.Points(bg.geom, bg.mat);
        this._scene.add(point);
        this.selected_geoms.set(ent_id, point.id);
        this.sceneObjsSelected.set(ent_id, point);
        if (labelText) {
            const obj: { entity: THREE.Points, type: string, text: string } = { entity: point, type: objType.point, text: labelText };
            this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }

    public selectObjPosition(parent_ent_id: string, ent_id: string, positions, container, labelText = null) {
        const bg = this.initBufferPoint(positions, null, null, this.settings.colors.position_s, this.settings.positions.size + 0.1);
        if (parent_ent_id === null) {
            const point = new THREE.Points(bg.geom, bg.mat);
            this._scene.add(point);
            this.selected_geoms.set(ent_id, point.id);
            this.sceneObjsSelected.set(ent_id, point);
            if (labelText) {
                const obj: {
                    entity: THREE.Points,
                    type: string,
                    text: string
                } = {
                    entity: point,
                    type: objType.point,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        } else {
            if (this.selected_positions.get(parent_ent_id) === undefined) {
                this.selected_positions.set(parent_ent_id, new Map());
            }

            const check_exist: string[] = [];
            this.selected_positions.forEach(v => {
                v.forEach((vv, k) => {
                    check_exist.push(k);
                });
            });

            if (!check_exist.includes(ent_id)) {
                const point = new THREE.Points(bg.geom, bg.mat);
                this._scene.add(point);
                this.selected_positions.get(parent_ent_id).set(ent_id, point.id);
                this.selected_geoms.set(ent_id, point.id);
                this.sceneObjsSelected.set(ent_id, point);
                if (labelText) {
                    const obj: {
                        entity: THREE.Points,
                        type: string,
                        text: string
                    } = {
                        entity: point,
                        type: objType.point,
                        text: labelText
                    };
                    this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                    this.ObjLabelMap.set(ent_id, obj);
                }
            }
        }
    }

    public selectObjvertex(parent_ent_id: string, ent_id: string, positions, container, labelText = null) {
        const bg = this.initBufferPoint(positions, null, null, this.settings.colors.vertex_s, this.settings.positions.size + 0.1);
        if (parent_ent_id === null) {
            const point = new THREE.Points(bg.geom, bg.mat);
            this._scene.add(point);
            this.sceneObjsSelected.set(ent_id, point);
            this.selected_geoms.set(ent_id, point.id);
            if (labelText) {
                const obj: {
                    entity: THREE.Points,
                    type: string,
                    text: string
                } = {
                    entity: point,
                    type: objType.point,
                    text: labelText
                };
                this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        } else {
            if (this.selected_vertex.get(parent_ent_id) === undefined) {
                this.selected_vertex.set(parent_ent_id, new Map());
            }

            const check_exist: string[] = [];
            this.selected_vertex.forEach(v => {
                v.forEach((vv, k) => {
                    check_exist.push(k);
                });
            });

            if (!check_exist.includes(ent_id)) {
                const point = new THREE.Points(bg.geom, bg.mat);
                this._scene.add(point);
                this.selected_vertex.get(parent_ent_id).set(ent_id, point.id);
                this.sceneObjsSelected.set(ent_id, point);
                this.selected_geoms.set(ent_id, point.id);
                if (labelText) {
                    const obj: {
                        entity: THREE.Points,
                        type: string,
                        text: string
                    } = {
                        entity: point,
                        type: objType.point,
                        text: labelText
                    };
                    this.createLabelforObj(container, obj.entity, obj.type, labelText, ent_id);
                    this.ObjLabelMap.set(ent_id, obj);
                }
            }
        }
    }

    public createLabelforObj(container, obj, type: string, labelText: string, ent_id: string) {
        const label = this._createTextLabel(container, type, labelText, ent_id);
        label.setHTML(labelText);
        label.setParent(obj);
        this._textLabels.set(label.element.id, label);
        container.appendChild(label.element);
        label.updatePosition();
    }

    public unselectObj(ent_id, container) {
        const removing = this._scene.getObjectById(this.selected_geoms.get(ent_id)) ;
        // remove Geom from scene
        if (removing && removing.hasOwnProperty('dispose')) { removing['dispose'](); }
        this._scene.remove(removing);
        this.selected_geoms.delete(ent_id);
        // remove Geom from selected Objs Map
        this.sceneObjsSelected.delete(ent_id);

        this.ObjLabelMap.delete(ent_id);
        if (document.getElementById(`textLabel_${ent_id}`)) {
            container.removeChild(document.getElementById(`textLabel_${ent_id}`));
        }
    }

    public unselectObjGroup(parent_ent_id, container, group) {
        let removing;
        if (group === 'positions') {
            removing = this.selected_positions.get(parent_ent_id);
        } else if (group === 'vertex') {
            removing = this.selected_vertex.get(parent_ent_id);
        } else if (group === 'face_edges') {
            // get the removing first
            removing = this.selected_face_edges.get(parent_ent_id);
        } else if (group === 'face_wires') {
            removing = this.selected_face_wires.get(parent_ent_id);
        }
        // remove positions from scene
        removing.forEach((v, k) => {
            this._scene.remove(this._scene.getObjectById(v));
            this.ObjLabelMap.delete(k);
            if (document.getElementById(`textLabel_${k}`)) {
                container.removeChild(document.getElementById(`textLabel_${k}`));
            }
        });
        if (group === 'positions') {
            // then delete
            this.selected_positions.delete(parent_ent_id);
        } else if (group === 'vertex') {
            this.selected_vertex.delete(parent_ent_id);
        } else if (group === 'face_edges') {
            this.selected_face_edges.delete(parent_ent_id);
        } else if (group === 'face_wires') {
            this.selected_face_wires.delete(parent_ent_id);
        }
    }

    // ============================================================================
    // Private methods
    // ============================================================================

    /**
     * Creates an ambient light
     */
    private _addAmbientLight() {
        const color = new THREE.Color(parseInt(this.settings.ambient_light.color.replace('#', '0x'), 16));
        const intensity = this.settings.ambient_light.intensity;
        this.ambient_light = new THREE.AmbientLight(color, intensity); // soft white light
        this.ambient_light.castShadow = false;
        this._scene.add(this.ambient_light);
    }

    /**
     * Creates a hemisphere light
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
        this._scene.add(this.hemisphere_light);
        const helper = new THREE.HemisphereLightHelper(this.hemisphere_light, 10);
        helper.visible = this.settings.hemisphere_light.helper;
        this._scene.add(helper);
    }

    // Creates a Directional Light
    private _addDirectionalLight(): void {
        this.directional_light_settings = JSON.parse(JSON.stringify(this.settings.directional_light));
        if (this._model
        && this._model.attribs
        && this._model.attribs.query
        && this._model.attribs.query.hasModelAttrib('directional_light')) {
            const model_light_settings: any = this._model.attribs.query.getModelAttribVal('directional_light');
            if (model_light_settings.constructor === {}.constructor) {
                for (const i in model_light_settings) {
                    if (model_light_settings[i]) {
                        this.directional_light_settings[i] = model_light_settings[i];
                    }
                }
            }
        }
        if (this.directional_light_settings.type === 'directional') {
            this.directional_light = new THREE.DirectionalLight(this.directional_light_settings.color,
                this.directional_light_settings.intensity);
        } else {
            this.directional_light = new THREE.PointLight(this.directional_light_settings.color,
                this.directional_light_settings.intensity);
        }
        let distance = 0;
        if (this.allObjs) {
            distance = Math.round(this.allObjs.radius * 3);
            // this.directional_light.target = this.sceneObjs[0];
            // this.sceneObjs[0].receiveShadow = true;
        }
        this.directional_light_settings.distance = distance;
        // this.getDLPosition(distance);
        // this.directional_light.shadow.radius = 2
        this.directional_light.castShadow = this.directional_light_settings.shadow;
        this.directional_light.visible = this.directional_light_settings.show;
        // this.directional_light_settings.shadowSize = 2;
        // const shadowMapSize = this.directional_light_settings.shadowSize;
        // this.directional_light.shadow.bias = -0.00001;  // default
        this.directional_light.shadow.mapSize.width = 2048;  // default
        this.directional_light.shadow.mapSize.height = 2048; // default
        // this.directional_light.shadow.camera.visible = true;

        this.DLDistance(distance);
        this._scene.add(this.directional_light);
    }

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
        if (this._model && this._model.attribs && this._model.attribs.query
            && this._model.attribs.query.hasModelAttrib('directional_light')) {
                const model_light_settings: any = this._model.attribs.query.getModelAttribVal('directional_light');
                if (model_light_settings.constructor === {}.constructor) {
                    if (model_light_settings.hasOwnProperty('altitude')) {
                        altitude = model_light_settings.altitude;
                    }
                    if (model_light_settings.hasOwnProperty('azimuth')) {
                        azimuth = model_light_settings.azimuth;
                    }
                }
            }

        let posX = Math.cos(altitude * Math.PI * 2 / 360) * Math.cos(azimuth * Math.PI * 2 / 360) * scale,
            posY = Math.cos(altitude * Math.PI * 2 / 360) * Math.sin(azimuth * Math.PI * 2 / 360) * scale,
            posZ = Math.sin(altitude * Math.PI * 2 / 360) * scale;

        if (this.allObjs) {
            posX += this.allObjs.center.x;
            posY += this.allObjs.center.y;
            posZ += this.allObjs.center.z;
        }
        this.directional_light.position.set(posX, posY, posZ);
    }

    public DLDistance(size = null): void {
        let scale;
        if (size) {
            scale = size;
        } else {
            scale = 10000;
        }
        if (this.directional_light) {
            let i = 0;
            const length = this._scene.children.length;
            if (length !== 0) {
                for (; i < length; i++) {
                    if (this._scene.children[i]) {
                        if (this._scene.children[i].name === 'DLHelper' || this._scene.children[i].name === 'lightTarget') {
                            this._scene.children[i]['dispose']();
                            this._scene.remove(this._scene.children[i]);
                        }
                    }
                }
            }
            this.directional_light.shadow.camera.near = 0.5;
            this.directional_light.shadow.camera.far = scale * 3;

            this.directional_light.shadow.bias = -0.001;

            let helper;
            if (this.directional_light_settings.type === 'directional') {
                const cam = <THREE.OrthographicCamera> this.directional_light.shadow.camera;
                cam.left = -scale;
                cam.right = scale;
                cam.top = scale;
                cam.bottom = -scale;
                if (this.allObjs) {
                    const lightTarget = new THREE.Object3D();
                    lightTarget.position.set(this.allObjs.center.x, this.allObjs.center.y, this.allObjs.center.z);
                    lightTarget.name = 'lightTarget';
                    this._scene.add(lightTarget);
                    (<THREE.DirectionalLight>this.directional_light).target = lightTarget;
                }
                helper = new THREE.CameraHelper(this.directional_light.shadow.camera);
            } else {
                helper = new THREE.PointLightHelper( <THREE.PointLight>this.directional_light );
            }
            helper.visible = this.directional_light_settings.helper;
            helper.name = 'DLHelper';
            this._scene.add(helper);
            this.getDLPosition(scale);
            // this._renderer.render(this._scene, this._camera);
        }
    }

    public DLMapSize(size = null): void {
        let _size;
        if (size) {
            _size = 1024 * size;
        } else {
            _size = 8192;
        }
        if (this.directional_light) {
            this.directional_light.shadow.mapSize.width = _size;
            this.directional_light.shadow.mapSize.width = _size;
        }
        // this._renderer.render(this._scene, this._camera);
    }


    // add axes
    public _addAxes(size: number = this.settings.axes.size) {
        let i = 0;
        const length = this._scene.children.length;
        if (length !== 0) {
            for (; i < length; i++) {
                if (this._scene.children[i]) {
                    if (this._scene.children[i].name === 'AxesHelper') {
                        this._scene.children[i]['dispose']();
                        this._scene.remove(this._scene.children[i]);
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
            this.axesHelper.position.set(this.axes_pos.x, this.axes_pos.y, 0.01);
            this._scene.add(this.axesHelper);
        }
    }
    /**
     * Draws a grid on the XY plane.
     */
    public _addGrid(size: number = this.settings.grid.size) {
        let i = 0;
        const length = this._scene.children.length;
        for (; i < length; i++) {
            if (this._scene.children[i]) {
                if (this._scene.children[i].name === 'GridHelper') {
                    this._scene.children[i]['dispose']();
                    this._scene.remove(this._scene.children[i]);
                }
            }
        }
        this.grid = new THREE.GridHelper(size, size / 10);
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
            this.grid.position.set(pos.x, pos.y, 0);
            this._scene.add(this.grid);
        }
    }
    /**
     * Add threejs triangles to the scene
     */
    private _addTris(tris_i: number[], posis_buffer: THREE.Float32BufferAttribute,
                    // normals_buffer: THREE.Float32BufferAttribute,
                    colors_buffer: THREE.Float32BufferAttribute, material_groups, materials): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(tris_i);
        // geom.addAttribute('position', posis_buffer);
        // // geom.addAttribute('normal', normals_buffer);
        // geom.addAttribute('color', colors_buffer);
        geom.setAttribute('position', posis_buffer);
        // geom.setAttribute('normal', normals_buffer);
        geom.setAttribute('color', colors_buffer);
        const colorf = new THREE.Color(parseInt(this.settings.colors.face_f.replace('#', '0x'), 16));
        const colorb = new THREE.Color(parseInt(this.settings.colors.face_b.replace('#', '0x'), 16));
        geom.clearGroups();
        material_groups.forEach(element => {
            geom.addGroup(element[0], element[1], element[2]);
        });

        this.BufferGeoms.push(geom);

        const material_arr = [];
        let index = 0;
        const l = materials.length;
        for (; index < l; index++) {
            const element = materials[index];
            // if (this.settings.background.show) {
            //     element.envMap = this._scene.background;
            //     element.refractionRatio = 1;
            //     element.envMap.mapping = THREE.CubeRefractionMapping;
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
                    // if (this.settings.background.show) {
                    //     element.envMap = this._scene.background;
                    //     // element.refractionRatio = 1;
                    //     // element.envMap.mapping = THREE.CubeRefractionMapping;
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
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // show vertex normals
        this.vnh = new THREE.VertexNormalsHelper(mesh, this.settings.normals.size, 0x0000ff);
        this.vnh.visible = this.settings.normals.show;
        this._scene.add(this.vnh);
        this.sceneObjs.push(mesh);
        // add mesh to scene
        this._scene.add(mesh);
        this._threejs_nums[2] = tris_i.length / 3;
    }
    /**
     * Add threejs lines to the scene
     */
    private _addLines(lines_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        color_buffer: THREE.Float32BufferAttribute,
        normals_buffer: THREE.Float32BufferAttribute,
        size: number = 1): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(lines_i);
        // geom.addAttribute('position', posis_buffer);
        // geom.addAttribute('normal', normals_buffer);
        geom.setAttribute('position', posis_buffer);
        geom.setAttribute('normal', normals_buffer);
        geom.setAttribute('color', color_buffer);

        this.BufferGeoms.push(geom);
        // // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        const mat = new THREE.LineBasicMaterial({
            color: 0x000000,
            vertexColors: THREE.VertexColors
        });
        const line = new THREE.LineSegments(geom, mat);
        this.sceneObjs.push(line);
        this._scene.add(line);
        this._threejs_nums[1] = lines_i.length / 2;
    }
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
        // geom.addAttribute('position', posis_buffer);
        // geom.addAttribute('color', colors_buffer);
        geom.setAttribute('position', posis_buffer);
        geom.setAttribute('color', colors_buffer);

        this.BufferGeoms.push(geom);
        // geom.computeBoundingSphere();
        const rgb = `rgb(${color.toString()})`;
        const mat = new THREE.PointsMaterial({
            // color: new THREE.Color(rgb),
            size: size,
            vertexColors: THREE.VertexColors,
            sizeAttenuation: false
        });
        const point = new THREE.Points(geom, mat);
        this.sceneObjs.push(point);
        this._scene.add(point);
        this._threejs_nums[0] = points_i.length;
    }

    private _addPositions(points_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        color: string,
        size: number = 1): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(points_i);
        // geom.addAttribute('position', posis_buffer);
        geom.setAttribute('position', posis_buffer);
        this.BufferGeoms.push(geom);
        // geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial({
            color: new THREE.Color(parseInt(color.replace('#', '0x'), 16)),
            size: size,
            sizeAttenuation: false
            // vertexColors: THREE.VertexColors
        });
        const point = new THREE.Points(geom, mat);
        this.sceneObjs.push(point);
        this._scene.add(point);
        this._positions.push(point);
        this._positions.map(p => p.visible = this.settings.positions.show);
    }

    private _createTextLabel(container, type: string, labelText: string, ent_id: string) {
        const div = document.createElement('div');
        div.id = `textLabel_${ent_id}`;
        div.title = ent_id;
        div.setAttribute('data-index', ent_id.substr(2));
        div.className = `text-label${ent_id.substr(0, 2)}`;
        div.style.position = 'absolute';
        div.style.background = 'rgba(255, 255, 255, 0.3)';
        div.style.padding = '1px';
        div.innerHTML = labelText;
        div.style.top = '-1000';
        div.style.left = '-1000';
        div.style.whiteSpace = 'pre-line';
        const _this = this;
        return {
            element: div,
            parent: false,
            position: new THREE.Vector3(0, 0, 0),
            setHTML: function (html) {
                this.element.innerHTML = html;
            },
            setParent: function (threejsobj) {
                this.parent = threejsobj;
            },
            updatePosition: function () {
                if (this.parent) {
                    if (type === objType.point || type === objType.face) {
                        const center = this.parent.geometry.boundingSphere.center;
                        this.position.copy(center);
                    } else if (type === objType.line) {
                        const p = this.parent.geometry.getAttribute('position').array;
                        const x = (p[0] + p[3]) / 2, y = (p[1] + p[4]) / 2, z = (p[2] + p[5]) / 2;
                        const center = new THREE.Vector3(x, y, z);
                        this.position.copy(center);
                    }
                }
                const coords2d = this.get2DCoords(this.position, _this._camera);
                this.element.style.left = coords2d.x - div.clientWidth * 0.5 + 'px';
                this.element.style.top = coords2d.y + 'px';
            },
            get2DCoords: function (position, camera) {
                const vector = position.project(camera);
                vector.x = (vector.x + 1) / 2 * container.offsetWidth;
                vector.y = -(vector.y - 1) / 2 * container.offsetHeight;
                return vector;
            }
        };
    }

    public disposeWebGL() {
        this.sceneObjs.forEach(obj => {
            if (obj['dispose']) { obj['dispose'](); }
            this._scene.remove(obj);
        });
        const BufferGeoms = this.BufferGeoms;
        BufferGeoms.forEach(geom => {
            geom.dispose();
        });
        this.BufferGeoms = [];
    }

    public lookAtObj() {
        const selectedObjs = this.getSelectedObjs();
        let center = null;
        let radius = null;
        if (selectedObjs) {
            center = selectedObjs.center;
            radius = selectedObjs.radius;
            if (radius === 0) {
                radius = 10;
            }
        } else if (this.allObjs) {
            center = this.allObjs.center;
            radius = this.allObjs.radius;
            if (radius === 0) {
                radius = 10;
            }
        } else {
            center = this._scene.position;
            radius = 10;
        }

        this.cameraLookat(center, radius);
    }

    private cameraLookat(center, radius = 100) {
        const fov = this._camera.fov * (Math.PI / 180);

        const perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();

        // Find looking direction: current camera position - current control target
        // Scale looking direction to be of length: radius / sin(fov/2)
        // New camera position: scaled looking direction + center
        perspectiveNewPos.subVectors(this._camera.position, this._controls.target);
        perspectiveNewPos.setLength(radius / Math.sin(fov / 2));
        perspectiveNewPos.add(center);

        this._camera.position.copy(perspectiveNewPos);
        this._controls.target.set(center.x, center.y, center.z);
        this._camera.updateProjectionMatrix();
        this._controls.update();

        const textLabels = this._textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach((label) => {
                label.updatePosition();
            });
        }
    }

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

    private getAllObjs() {
        if (this.sceneObjs.length !== 0) {
            const objs = new THREE.Object3D();
            this.sceneObjs.map(obj => objs.children.push(obj));
            const boxHelper = new THREE.BoxHelper(objs);
            boxHelper.geometry.computeBoundingSphere();
            const boundingSphere = boxHelper.geometry.boundingSphere;
            return boundingSphere;
        } else {
            return null;
        }
    }

    public getGridPos() {
        if (this.allObjs) {
            const grd_pos = new THREE.Vector3(this.allObjs.center.x, this.allObjs.center.y, 0);
            this.grid.position.set(grd_pos.x, grd_pos.y, 0);
            return grd_pos;
        }
        const grid_pos = new THREE.Vector3(0, 0, 0);
        this.grid.position.set(0, 0, 0);
        return grid_pos;
    }

    private getSelectedObjs() {
        if (this.sceneObjsSelected.size !== 0) {
            const objs = new THREE.Object3D();
            this.sceneObjsSelected.forEach(obj => objs.children.push(obj));
            const boxHelper = new THREE.BoxHelper(objs);
            boxHelper.geometry.computeBoundingSphere();
            const boundingSphere = boxHelper.geometry.boundingSphere;
            return boundingSphere;
        } else {
            return null;
        }
    }

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

    public onWindowKeyPress(event: KeyboardEvent): boolean {
        const nodeName = (<Element>event.target).nodeName;
        if (nodeName === 'TEXTAREA' || nodeName === 'INPUT') { return false; }
        const segment_str = window.location.pathname;
        const segment_array = segment_str.split('/');
        const last_segment = segment_array[segment_array.length - 1];
        if (last_segment === 'editor') {
            return false;
        }
        if (event.ctrlKey || event.metaKey) {
            return false;
        }
        const keyCode = event.which;
        // console.log(keyCode);
        const positionDelta = 10;
        const rotationDelta = 0.02;
        const xp = this._camera.position.x;
        const yp = this._camera.position.y;
        switch (keyCode) {
            case 65: // A: move left
                this._camera.position.x -= positionDelta;
                break;
            case 68: // D: move right
                this._camera.position.x += positionDelta;
                break;
            case 87: // W: move forward
                this._camera.position.y += positionDelta;
                break;
            case 83: // S: move backward
                this._camera.position.y -= positionDelta;
                break;
            case 90: // Z: move up
                this._camera.position.z += positionDelta;
                break;
            case 88: // X: move down
                this._camera.position.z -= positionDelta;
                break;
            case 81: // Q: rotate clockwise
                this._camera.position.x = xp * Math.cos(rotationDelta) + yp * Math.sin(rotationDelta);
                this._camera.position.y = yp * Math.cos(rotationDelta) - xp * Math.sin(rotationDelta);
                this._camera.lookAt(this._scene.position);
                break;
            case 69: // E: rotate anticlockwise
                this._camera.position.x = xp * Math.cos(rotationDelta) - yp * Math.sin(rotationDelta);
                this._camera.position.y = yp * Math.cos(rotationDelta) + xp * Math.sin(rotationDelta);
                this._camera.lookAt(this._scene.position);
                break;
            case 84: // T
                this._camera.rotation.x += rotationDelta;
                break;
            case 71: // G
                this._camera.rotation.x -= rotationDelta;
                break;
            case 70: // F
                this._camera.rotation.y += rotationDelta;
                break;
            case 72: // H
                this._camera.rotation.y -= rotationDelta;
                break;
            default:
                break;
        }
        return true;
    }

    loadBackground(background_set: number) {
        const path = 'assets/img/background/bg' + background_set + '/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        const background = new THREE.CubeTextureLoader().load( urls );

        background.format = THREE.RGBFormat;
        this._scene.background = background;
        // this._renderer.render(this._scene, this._camera);
    }

}

/**
 * objType includes point, line, face
 */



interface Settings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: {
        show: boolean,
        size: number,
        pos: Vector3,
        pos_x: number,
        pos_y: number,
        pos_z: number,
    };
    background: {
        show: boolean,
        background_set: number
    };
    positions: { show: boolean, size: number };
    wireframe: { show: boolean };
    tjs_summary: { show: boolean };
    gi_summary: { show: boolean };
    camera: {
        pos: Vector3,
        pos_x: number,
        pos_y: number,
        pos_z: number,
        target: Vector3
    };
    colors: {
        viewer_bg: string,
        position: string,
        position_s: string,
        vertex_s: string,
        face_f: string,
        face_f_s: string,
        face_b: string,
        face_b_s: string
    };
    ambient_light: {
        show: boolean,
        color: string,
        intensity: number
    };
    hemisphere_light: {
        show: boolean,
        helper: boolean,
        skyColor: string,
        groundColor: string,
        intensity: number
    };
    directional_light: {
        show: boolean,
        helper: boolean,
        color: string,
        intensity: number,
        shadow: boolean,
        azimuth: number,
        altitude: number,
        distance: number,
        type: string
    };
    ground: {
        show: boolean,
        width: number,
        length: number,
        height: number,
        color: string,
        shininess: number
    };
    select: {
        selector: object,
        tab: number
    };
    version: string;
}
