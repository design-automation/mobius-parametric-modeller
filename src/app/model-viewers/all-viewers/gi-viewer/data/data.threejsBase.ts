import * as THREE from 'three';
// import * as OrbitControls from 'three-orbit-controls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '@services';
import { ISettings } from './data.threejsSettings';
// import { WEBVR } from 'three/examples/jsm/vr/WebVR.js';

/**
 * ThreejsScene
 */
export class DataThreejsBase {

    // threeJS objects
    public scene: THREE.Scene;

    // public basic_scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public camera;
    public perspCam: THREE.PerspectiveCamera;
    public orthoCam: THREE.OrthographicCamera;
    public controls: OrbitControls;
    public perspControls: OrbitControls;
    public orthoControls: OrbitControls;
    public orthoCamPos;
    public cameraBackgrounds;

    public currentCamera: string;

    public raycaster: THREE.Raycaster;
    public mouse: THREE.Vector2;

    // interaction and selection
    public tri_select_map: Map<number, number>;
    public edge_select_map: Map<number, number>;
    // public white_edge_select_map: Map<number, number>;
    public point_select_map: Map<number, number>;
    public point_label: any[];
    public posis_map: Map<number, number>;
    public vertex_map: Map<number, number>;

    public selected_geoms: Map<string, number> = new Map();
    public selected_positions: Map<string, Map<string, number>> = new Map();
    public selected_vertex: Map<string, Map<string, number>> = new Map();
    public selected_face_edges: Map<string, Map<string, number>> = new Map();
    public selected_face_wires: Map<string, Map<string, number>> = new Map();
    public text: string;

    // public vrEnabled: boolean = true;
    // public vr;

    // text labels
    public ObjLabelMap: Map<string, any> = new Map();
    public textLabels: Map<string, any> = new Map();

    // number of threejs points, lines, triangles
    public threejs_nums: [number, number, number] = [0, 0, 0];

    // grid
    public grid: THREE.GridHelper;

    // axes
    public axesHelper: THREE.AxesHelper;
    protected axes_pos: THREE.Vector3 = new THREE.Vector3();
    public directional_light: THREE.DirectionalLight|THREE.PointLight;
    public directional_light_settings: ISettings['directional_light'];
    public ambient_light: THREE.AmbientLight;
    public hemisphere_light: THREE.HemisphereLight;
    public groundObj: THREE.Mesh;

    // the model to display
    public model: GIModel;
    public nodeIndex: number;
    public scene_objs: THREE.Object3D[] = [];
    public scene_objs_selected: Map<string, THREE.Object3D> = new Map();
    public positions: THREE.Object3D[] = [];

    public timelineEnabled = null;
    public timelineIndex = null;
    public timelineValue = null;
    public current_time_point = null;
    public timeline_groups = null;

    // Show Normals
    public vnh: THREE.VertexNormalsHelper;

    // Settings
    public settings: ISettings;

    // initial origin
    protected origin: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

    // BufferGeoms
    // protected _buffer_geoms: THREE.BufferGeometry[] = [];
    protected _all_objs_sphere: THREE.Sphere;

    protected _text_font: THREE.Font;

    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: ISettings, protected dataService: DataService) {
        this.settings = settings;
        if (!this.settings.directional_light.type) {
            this.settings.directional_light.type = 'directional';
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }
        const textFontLoader = new THREE.FontLoader();
        textFontLoader.load( 'assets/fonts/helvetiker_regular.typeface.json', font => { this._text_font = font; });

        // scene
        this.scene = new THREE.Scene();
        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
        this.renderer.autoClear = false;
        // this._renderer.setClearColor(0xcccccc, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 1.8, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.shadowMap.type = THREE.VSMShadowMap;
        // camera settings
        this.perspCam = new THREE.PerspectiveCamera(50, 1, 0.01, 1000000);
        this.perspCam.position.x = -80;
        this.perspCam.position.y = -80;
        this.perspCam.position.z = 80;
        this.perspCam.aspect = 1;
        this.perspCam.up.set(0, 0, 1);
        this.perspCam.lookAt(this.scene.position);
        this.perspCam.updateProjectionMatrix();

        this.orthoCam = new THREE.OrthographicCamera(0, 600, 600, 0, 0.1, 2000);
        this.orthoCam.position.x = -300;
        this.orthoCam.position.y = 0;
        this.orthoCam.position.z = 0;
        this.orthoCam.up.set(0, 0, 1);
        this.orthoCam.lookAt(this.scene.position);
        this.orthoCam.updateProjectionMatrix();
        this.orthoCamPos = {};

        this.currentCamera = 'Persp';

        // orbit controls
        // const orbit_controls = OrbitControls(THREE);
        // this.controls = new orbit_controls(this.camera, this.renderer.domElement);
        this.perspControls = new OrbitControls(this.perspCam, this.renderer.domElement);
        this.perspControls.enableKeys = false;
        this.perspControls.update();

        this.orthoControls = new OrbitControls(this.orthoCam, this.renderer.domElement);
        this.orthoControls.enableKeys = false;
        // this.orthoControls.screenSpacePanning = false;
        this.orthoControls.screenSpacePanning = true;
        this.orthoControls.enableRotate = false;
        this.orthoControls.enabled = false;
        this.orthoControls.update();

        this.camera = this.perspCam;
        this.controls = this.perspControls;

        // mouse
        this.mouse = new THREE.Vector2();
        // selecting
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Line.threshold = 0.3; // TODO this need to be set dynamically based on model size and view zoom
        this.raycaster.params.Points.threshold = 0.3; // TODO this need to be set dynamically based on model size and view zoom

        // this.vr = WEBVR.createButton(this.renderer);

        setTimeout(() => {
            const threeContainer = document.getElementById('threejs-container');
            if (threeContainer) {
                const aspect = (threeContainer.clientWidth / threeContainer.clientHeight + 1) / 2;
                this.orthoCam.left = aspect * -300;
                this.orthoCam.right = aspect * 300;
                this.orthoCam.updateProjectionMatrix();
                this.orthoControls.update();
            }
        }, 0);
    }
}
