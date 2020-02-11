import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '@services';
import { ISettings } from './data.threejsSettings';

/**
 * ThreejsScene
 */
export class DataThreejsBase {

    // threeJS objects
    public scene: THREE.Scene;

    // public basic_scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public camera;
    public controls: any;
    public raycaster: THREE.Raycaster;
    public mouse: THREE.Vector2;

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
    public text: string;

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
    public scene_objs: THREE.Object3D[] = [];
    public scene_objs_selected: Map<string, THREE.Object3D> = new Map();
    public positions: THREE.Object3D[] = [];

    // Show Normals
    public vnh: THREE.VertexNormalsHelper;

    // Settings
    public settings: ISettings;

    // initial origin
    protected origin: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

    // BufferGeoms
    protected _buffer_geoms: THREE.BufferGeometry[] = [];
    protected _all_objs_sphere: THREE.Sphere;

    /**
     * Constructs a new data subscriber.
     */
    constructor(settings: ISettings, protected dataService: DataService) {
        this.settings = settings;
        if (!this.settings.directional_light.type) {
            this.settings.directional_light.type = 'directional';
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }
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
        // camera settings
        this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000000);
        this.camera.position.x = -80;
        this.camera.position.y = -80;
        this.camera.position.z = 80;
        this.camera.aspect = 1;
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(this.scene.position);
        this.camera.updateProjectionMatrix();
        // orbit controls
        const orbit_controls = OrbitControls(THREE);
        this.controls = new orbit_controls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;
        this.controls.update();
        // mouse
        this.mouse = new THREE.Vector2();
        // selecting
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 0.3; // TODO this need to be set dynamically based on model size and view zoom
        this.raycaster.params.Points.threshold = 0.3; // TODO this need to be set dynamically based on model size and view zoom
    }
}
