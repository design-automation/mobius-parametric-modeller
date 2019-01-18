import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';
import { number } from '@assets/core/modules/_mathjs';
import { EEntType } from '@assets/libs/geo-info/common';

/**
 * ThreejsScene
 */
export class DataThreejs {
    // threeJS objects
    public _scene: THREE.Scene;
    public _renderer: THREE.WebGLRenderer;
    public _camera: THREE.PerspectiveCamera;
    public _controls: THREE.OrbitControls;
    public _raycaster: THREE.Raycaster;
    public _mouse: THREE.Vector2;
    // interaction and selection
    public tri_select_map: Map<number, number>;
    public edge_select_map: Map<number, number>;
    public point_select_map: Map<number, number>;
    public selected_geoms: Map<string, number> = new Map();
    public selected_positions: Map<string, Map<string, number>> = new Map();
    public selected_vertex: Map<string, Map<string, number>> = new Map();
    public selected_face_edges: Map<string, Map<string, number>> = new Map();
    public _text: string;
    // text lables
    public ObjLabelMap: Map<string, any> = new Map();
    public _textLabels: Map<string, any> = new Map();
    // number of threejs points, lines, triangles
    public _threejs_nums: [number, number, number] = [0, 0, 0];
    // grid
    public grid: THREE.GridHelper;
    // axes
    public axesHelper: THREE.AxesHelper;
    // the GI model to display
    public _model: GIModel;

    public sceneObjs: THREE.Object3D[] = [];
    public sceneObjsSelected: Map<string, THREE.Object3D> = new Map();
    public _positions: THREE.Object3D[] = [];
    // Show Normals
    public vnh: THREE.VertexNormalsHelper;
    // Settings
    public settings: {
        normals: { show: boolean, size: number },
        axes: { show: boolean, size: number },
        grid: { show: boolean, size: number },
        positions: { show: boolean, size: number }
    };
    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: {
        normals: { show: boolean, size: number },
        axes: { show: boolean, size: number },
        grid: { show: boolean, size: number },
        positions: { show: boolean, size: number }
    }) {
        this.settings = settings;
        // scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0xcccccc);

        // renderer
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        // this._renderer.setClearColor(0xEEEEEE);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth / 1.8, window.innerHeight);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // camera settings
        this._camera = new THREE.PerspectiveCamera(50, 1, 0.01, 20000);
        // document.addEventListener( 'keypress', this.onWindowKeyPress, false );
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
        this._raycaster.linePrecision = 0.05;
        this._raycaster.params.Points.threshold = 0.1;

        // add grid and lights
        this._addGrid();
        this._addHemisphereLight();
        this._addAxes();
    }

    public addGeometry(model: GIModel, container): void {
        while (this._scene.children.length > 0) {
            this._scene.remove(this._scene.children[0]);
            this.sceneObjs = [];
        }
        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            container.removeChild(value);
        });
        this.ObjLabelMap.clear();
        this._textLabels.clear();

        this._addGrid();
        this._addHemisphereLight();
        // this._addDirectionalLight();
        this._addAxes();

        // Add geometry
        const threejs_data: IThreeJS = model.get3jsData();
        this.tri_select_map = threejs_data.triangle_select_map;
        this.edge_select_map = threejs_data.edge_select_map;
        this.point_select_map = threejs_data.point_select_map;

        // Create buffers that will be used by all geometry
        const posis_buffer = new THREE.Float32BufferAttribute(threejs_data.positions, 3);
        const normals_buffer = new THREE.Float32BufferAttribute(threejs_data.normals, 3);
        const colors_buffer = new THREE.Float32BufferAttribute(threejs_data.colors, 3);
        this._addTris(threejs_data.triangle_indices, posis_buffer, normals_buffer, colors_buffer);
        this._addLines(threejs_data.edge_indices, posis_buffer, normals_buffer);
        this._addPoints(threejs_data.point_indices, posis_buffer, colors_buffer, [255, 255, 255], 1);
        const posi_colors: number[] = [];
        if (threejs_data.colors.length === 0) {
            const numPosi = this._model.geom.query.numEnts(EEntType.POSI);
            for (let index = 0; index < numPosi; index++) {
                posi_colors.push(1, 1, 1);
            }
        }
        const check_posi_colors = threejs_data.colors.length === 0 ? posi_colors : threejs_data.colors;
        this.addPositions(check_posi_colors, this.settings.positions.size);
        const position_size = this.settings.positions.size;
        this._raycaster.params.Points.threshold = position_size > 1 ? 1 : position_size / 2;
        // const allObjs = this.getAllObjs();
        // const center = allObjs.center;
        // this.grid.position.copy(center);
        // this.axesHelper.position.copy(center);
    }

    public addPositions(all_positions_colors: number[] = null, size) {
        const all_positions = this._model.attribs.query.getAllPosisCoords();
        // @ts-ignore
        const all_positions_flat = all_positions.flat(1);
        const all_positions_indices = [];
        let index = 0;
        const l = all_positions_flat.length / 3;
        for (; index < l; index++) {
            all_positions_indices.push(index);
        }

        this._addPositions(all_positions_flat,
            all_positions_indices,
            all_positions_colors,
            [120, 120, 120],
            size);
        this._positions.map(p => p.visible = this.settings.positions.show);
    }


    public selectObjFace(ent_id: string, triangle_i: number[], positions: number[], container, label = true) {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(triangle_i);
        geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.addAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        geom.addAttribute('color', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
        const mat = new THREE.MeshPhongMaterial({
            // specular:  new THREE.Color('rgb(255, 0, 0)'), // 0xffffff,
            specular: 0x000000,
            emissive: 0xff0000,
            shininess: 20, // 250
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors,
            // wireframe: true
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        this._scene.add(mesh);
        this.selected_geoms.set(ent_id, mesh.id);
        this.sceneObjsSelected.set(ent_id, mesh);
        if (label) {
            const obj: { entity: THREE.Mesh, type: string } = { entity: mesh, type: objType.face };
            this.createLabelforObj(container, obj.entity, obj.type, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }

    private initBufferLine(positions, indices: number[], colors: [number, number, number]) {
        const geom = new THREE.BufferGeometry();
        if (indices.length > 2) {
            geom.setIndex(indices);
        } else {
            geom.setIndex([0, 1]);
        }
        geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.addAttribute('normal', new THREE.Float32BufferAttribute(Array(positions.length).fill(0), 3));
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

    public selectObjLine(ent_id: string, indices, positions, container, label = true) {
        const bg = this.initBufferLine(positions, indices, [255, 0, 0]);
        const line = new THREE.LineSegments(bg.geom, bg.mat);
        this._scene.add(line);
        this.selected_geoms.set(ent_id, line.id);
        this.sceneObjsSelected.set(ent_id, line);

        if (label) {
            const obj: { entity: THREE.LineSegments, type: string } = { entity: line, type: objType.line };
            this.createLabelforObj(container, obj.entity, obj.type, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }

    public selectEdgeByFace(parent_ent_id: string, ent_id: string, indices, positions, container, label = true) {
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
            this.sceneObjsSelected.set(ent_id, line);
            if (label) {
                const obj: { entity: THREE.LineSegments, type: string } = { entity: line, type: objType.line };
                this.createLabelforObj(container, obj.entity, obj.type, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }

    private initBufferPoint(positions: number[],
        point_indices = null,
        colors: number[] = null,
        color: [number, number, number],
        size: number = 1) {
        const geom = new THREE.BufferGeometry();
        if (point_indices) {
            geom.setIndex(point_indices);
        }
        geom.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        if (colors) {
            geom.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        } else {
            let color_data;
            if (positions.length < 3) {
                color_data = color;
            } else {
                // @ts-ignore
                color_data = Array(positions.length / 3).fill(color).flat(1);
            }
            const color_buffer = new Uint8Array(color_data);
            geom.addAttribute('color', new THREE.BufferAttribute(color_buffer, 3, true));
        }
        geom.computeBoundingSphere();
        const rgb = `rgb(${color.toString()})`;
        const mat = new THREE.PointsMaterial({
            color: new THREE.Color(rgb),
            size: size,
            vertexColors: THREE.VertexColors
        });
        const bg = { geom, mat };
        return bg;
    }

    public selectObjPoint(ent_id: string = null, point_indices, positions, container, label = true) {
        const bg = this.initBufferPoint(positions, point_indices, null, [255, 0, 0]);
        const point = new THREE.Points(bg.geom, bg.mat);
        this._scene.add(point);
        this.selected_geoms.set(ent_id, point.id);
        this.sceneObjsSelected.set(ent_id, point);
        if (label) {
            const obj: { entity: THREE.Points, type: string } = { entity: point, type: objType.point };
            this.createLabelforObj(container, obj.entity, obj.type, ent_id);
            this.ObjLabelMap.set(ent_id, obj);
        }
    }

    public selectObjPosition(parent_ent_id: string, ent_id: string, positions, container, label) {
        const bg = this.initBufferPoint(positions, null, null, [0, 60, 255], this.settings.positions.size + 0.1);
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
            this.sceneObjsSelected.set(ent_id, point);
            if (label) {
                const obj: { entity: THREE.Points, type: string } = { entity: point, type: objType.point };
                this.createLabelforObj(container, obj.entity, obj.type, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }

    public selectObjVetex(parent_ent_id: string, ent_id: string, positions, container, label) {
        const bg = this.initBufferPoint(positions, null, null, [255, 215, 0], this.settings.positions.size + 0.1);
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
            if (label) {
                const obj: { entity: THREE.Points, type: string } = { entity: point, type: objType.point };
                this.createLabelforObj(container, obj.entity, obj.type, ent_id);
                this.ObjLabelMap.set(ent_id, obj);
            }
        }
    }

    public createLabelforObj(container, obj, type: string, labelText: string) {
        const label = this._createTextLabel(container, type, labelText);
        label.setHTML(labelText);
        label.setParent(obj);
        this._textLabels.set(label.element.id, label);
        container.appendChild(label.element);
    }

    public unselectObj(ent_id, container) {
        const removing = this.selected_geoms.get(ent_id);
        // remove Geom from scene
        this._scene.remove(this._scene.getObjectById(removing));
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
        }
    }

    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Creates a hemisphere light
     */
    private _addHemisphereLight() {
        const light: THREE.HemisphereLight = new THREE.HemisphereLight(
            0xffffbb, // skyColor
            0x080820, // groundColor
            1 // intensity
        );
        this._scene.add(light);
    }
    /**
     * Creates an ambient light
     */
    private _addAmbientLight(color: string, intensity: number) {
        const light = new THREE.AmbientLight(color, intensity); // soft white light
        this._scene.add(light);
    }

    // Creates a Directional Light
    private _addDirectionalLight() {
        const light = new THREE.SpotLight(0xffffff);
        light.position.set(200, 100, 200);
        light.castShadow = true;
        this._scene.add(light);
    }
    // add axes
    public _addAxes(size: number = this.settings.axes.size) {
        let i = 0;
        const length = this._scene.children.length;
        if (length !== 0) {
            for (; i < length; i++) {
                if (this._scene.children[i]) {
                    if (this._scene.children[i].name === 'AxesHelper') {
                        this._scene.remove(this._scene.children[i]);
                    }
                }
            }
        }
        this.axesHelper = new THREE.AxesHelper(size);
        this.axesHelper.visible = this.settings.axes.show;
        if (this.axesHelper.visible) {
            this.axesHelper.name = 'AxesHelper';
            this._scene.add(this.axesHelper);
        }
        // this.axesHelper.position.set(0, 0, 0);
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
            this.grid.position.set(0, 0, 0);
            this._scene.add(this.grid);
        }
    }
    /**
     * Add threejs triangles to the scene
     */
    private _addTris(tris_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        normals_buffer: THREE.Float32BufferAttribute,
        colors_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(tris_i);
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('normal', normals_buffer);
        geom.addAttribute('color', colors_buffer);
        const mat = new THREE.MeshPhongMaterial({
            // specular:  new THREE.Color('rgb(255, 0, 0)'), // 0xffffff,
            specular: 0xffffff,
            emissive: 0xdddddd,
            shininess: 0, // 250
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors,
            // wireframe: true
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        mesh.castShadow = true;
        mesh.receiveShadow = false;

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
        normals_buffer: THREE.Float32BufferAttribute,
        size: number = 1): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex(lines_i);
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('normal', normals_buffer);
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        const mat = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: size,
            linecap: 'round', // ignored by WebGLRenderer
            linejoin: 'round' // ignored by WebGLRenderer
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
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('color', colors_buffer);
        // geom.computeBoundingSphere();
        const rgb = `rgb(${color.toString()})`;
        const mat = new THREE.PointsMaterial({
            color: new THREE.Color(rgb),
            size: size,
            vertexColors: THREE.VertexColors
        });
        const point = new THREE.Points(geom, mat);
        this.sceneObjs.push(point);
        this._scene.add(point);
        this._threejs_nums[0] = points_i.length;
    }

    private _addPositions(positions: number[],
        points_i: number[],
        colors: number[],
        color: [number, number, number],
        size: number = 1): void {
        const bg = this.initBufferPoint(positions, points_i, colors, color, size);
        const point = new THREE.Points(bg.geom, bg.mat);
        this.sceneObjs.push(point);
        this._scene.add(point);
        this._positions.push(point);
    }

    private _createTextLabel(container, type: string, labelText: string) {
        const div = document.createElement('div');
        div.id = `textLabel_${labelText}`;
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.innerHTML = '';
        div.style.top = '-1000';
        div.style.left = '-1000';
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
                this.element.style.left = coords2d.x + 'px';
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

    public lookAtObj(width: number) {
        const allObjs = this.getAllObjs();
        const selectedObjs = this.getSelectedObjs();
        if (allObjs === null && selectedObjs === null) {
            const sceneCenter = this._scene.position;
            this._camera.lookAt(sceneCenter);
            // this._camera.updateProjectionMatrix();
            this._controls.target.set(sceneCenter.x, sceneCenter.y, sceneCenter.z);
            this._controls.update();
        }

        let center = null;
        let radius = null;
        if (selectedObjs) {
            center = selectedObjs.center;
            radius = selectedObjs.radius;
        } else if (allObjs) {
            center = allObjs.center;
            radius = allObjs.radius;
        } else {
            center = this._scene.position;
            radius = 50;
        }
        // set grid and axeshelper to center of the objs
        // this.grid.position.set(center.x, center.y, 0);
        // this.axesHelper.position.set(center.x, center.y, 0);

        const fov = this._camera.fov * (Math.PI / 180);
        const vec_centre_to_pos: THREE.Vector3 = new THREE.Vector3();
        vec_centre_to_pos.subVectors(this._camera.position, center);
        const r = radius < 100 ? 200 : (radius < 500 ? 10 : 1);
        const f = 1 + (width / radius / r);
        const tmp_vec = new THREE.Vector3(Math.abs(radius / Math.sin(fov / 2) / f),
            Math.abs(radius / Math.sin(fov / 2) / f),
            Math.abs(radius / Math.sin(fov / 2)) / f);
        vec_centre_to_pos.setLength(tmp_vec.length());
        const perspectiveNewPos: THREE.Vector3 = new THREE.Vector3();
        perspectiveNewPos.addVectors(center, vec_centre_to_pos);
        const newLookAt = new THREE.Vector3(center.x, center.y, center.z);
        this._camera.position.copy(perspectiveNewPos);
        this._camera.lookAt(newLookAt);
        this._camera.updateProjectionMatrix();
        this._controls.target.set(newLookAt.x, newLookAt.y, newLookAt.z);
        this._controls.update();
    }

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

    public onWindowKeyPress(event: KeyboardEvent) {
        const nodeName = (<Element>event.target).nodeName;
        if (nodeName === 'TEXTAREA' || nodeName === 'INPUT') { return; }
        const segment_str = window.location.pathname;
        const segment_array = segment_str.split('/');
        const last_segment = segment_array[segment_array.length - 1];
        if (last_segment === 'editor') {
            // return;
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
    }
}

/**
 * objType includes point, line, face
 */

enum objType {
    point = 'point',
    line = 'line',
    face = 'face'
}
