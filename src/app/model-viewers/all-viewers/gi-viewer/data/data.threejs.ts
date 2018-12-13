import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';

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
    public _select_visible = 'Objs';
    public _text: string;
    // number of threejs points, lines, triangles
    public _threejs_nums: [number, number, number] = [0, 0, 0];
    // grid
    public _grid_show = true;
    public _grid_center = [0, 0, 0];
    // the GI model to display
    public _model: GIModel;
    /**
     * Constructs a new data subscriber.
     */
    constructor(model: GIModel) {
        //
        this._model = model;
        // scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color( 0xcccccc );

        // renderer
        this._renderer =  new THREE.WebGLRenderer( {antialias: true} );
        // this._renderer.setClearColor(0xEEEEEE);
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize(window.innerWidth / 1.8, window.innerHeight);

        // camera settings
        this._camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 20000 );
        this._camera.position.x = 150;
        this._camera.position.y = 100;
        this._camera.position.z = 70;
        this._camera.aspect = 1;
        this._camera.up.set(0, 0, 1);
        this._camera.lookAt( this._scene.position );
        this._camera.updateProjectionMatrix();

        // orbit controls
        const orbit_controls = OrbitControls(THREE);
        this._controls = new orbit_controls( this._camera, this._renderer.domElement );
        this._controls.enableKeys = false;
        this._controls.update();

        // mouse
        this._mouse = new THREE.Vector2();

        // selecting
        this._raycaster = new THREE.Raycaster();
        this._raycaster.linePrecision = 0.05;

        // add geometry to the scene
        if ( this._model) {
            this.addGeometry(this._model);
        } else {
            // add grid and lights
            this._addGrid();
            this._addHemisphereLight();
            this._addAxes();
        }
    }
    public addGeometry(model: GIModel): void {
        while ( this._scene.children.length > 0) {
            this._scene.remove(this._scene.children[0]);
        }
        this._addGrid();
        this._addHemisphereLight();
        this._addAxes();
        const threejs_data: IThreeJS = model.get3jsData();
        // Create buffers that will be used by all geometry
        const posis_buffer = new THREE.Float32BufferAttribute( threejs_data.positions, 3 );
        const normals_buffer = new THREE.Float32BufferAttribute( threejs_data.normals, 3 );
        const colors_buffer = new THREE.Float32BufferAttribute( threejs_data.colors, 3 );

        // Add geometry
        this._addTris(threejs_data.triangle_indices, posis_buffer, normals_buffer, colors_buffer);
        this._addLines(threejs_data.edge_indices, posis_buffer, normals_buffer);
        this._addPoints(threejs_data.point_indices, posis_buffer, colors_buffer);
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
        this._scene.add( light );
    }
    /**
     * Creates an ambient light
     */
    private _addAmbientLight(color: string, intensity: number) {
        const light = new THREE.AmbientLight( color, intensity ); // soft white light
        this._scene.add( light );
    }

    // Creates a Directional Light
    private _addDirectionalLight() {
        const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light.position.set( 0, 0, 1 ).normalize();
        this._scene.add( light );
    }
    // add axes
    private _addAxes() {
        const axesHelper = new THREE.AxisHelper( 20 );
        this._scene.add( axesHelper );
    }
    /**
     * Draws a grid on the XY plane.
     */
    private _addGrid() {
        for (let i = 0; i < this._scene.children.length; i++) {
            if (this._scene.children[i].name === 'GridHelper') {
                this._scene.remove(this._scene.children[i]);
                i = i - 1;
            }
        }
        // todo: change grid -> grid_value
        if (this._grid_show) {
            const gridhelper = new THREE.GridHelper( 500, 50);
            gridhelper.name = 'GridHelper';
            const vector = new THREE.Vector3(0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(0, 0, 0);
            this._scene.add( gridhelper);
            this._grid_center = [0, 0, 0];
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
        geom.setIndex( tris_i );
        geom.addAttribute( 'position',  posis_buffer);
        geom.addAttribute( 'normal', normals_buffer );
        geom.addAttribute( 'color', colors_buffer);
        const mat = new THREE.MeshPhongMaterial( {
            // specular:  new THREE.Color('rgb(255, 0, 0)'), // 0xffffff,
            specular: 0xffffff,
            emissive: 0xdddddd,
            shininess: 0, // 250
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors,
            // wireframe: true
        });
        const mesh: THREE.Mesh = new THREE.Mesh( geom, mat);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();

        // show vertex normals
        const vnh = new THREE.VertexNormalsHelper( mesh, 3, 0x0000ff );
        this._scene.add( vnh );

        // this._geometries.push(geom);
        // this._meshes.push(mesh);

        // add mesh to scene
        this._scene.add( mesh );
        this._threejs_nums[2] = tris_i.length / 3;
    }
    /**
     * Add threejs lines to the scene
     */
    private _addLines(lines_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        normals_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex( lines_i );
        geom.addAttribute( 'position', posis_buffer );
        geom.addAttribute( 'normal', normals_buffer);
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        const mat = new THREE.LineBasicMaterial( {
            color: 0x777777,
            linewidth: 0.1,
            linecap: 'round', // ignored by WebGLRenderer
            linejoin:  'round' // ignored by WebGLRenderer
        } );

        // this._geometries.push(geom);

        this._scene.add(new THREE.LineSegments(geom, mat) );
        this._threejs_nums[1] = lines_i.length / 2;
    }
    /**
     * Add threejs points to the scene
     */
    private _addPoints(points_i: number[],
        posis_buffer: THREE.Float32BufferAttribute,
        colors_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex( points_i );
        geom.addAttribute( 'position', posis_buffer );
        geom.addAttribute( 'color', colors_buffer );
        // geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial( {
            size: 1,
            vertexColors: THREE.VertexColors
        } );

        // this._geometries.push(geom);

        this._scene.add( new THREE.Points(geom, mat) );
        this._threejs_nums[0] = points_i.length;
    }
}
