import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';
import { DataSubscriber } from '../data/data.subscriber';
// import @angular stuff
import { Component, OnInit, Injector, ElementRef } from '@angular/core';

/**
 * A threejs viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html
 */
@Component({
    selector: 'threejs-viewer',
    templateUrl: './threejs-viewer.component.html',
    styleUrls: ['./threejs-viewer.component.css']
})
export class ThreejsViewerComponent extends DataSubscriber implements OnInit {
    _elem;
    // viewer size
    _width: number;
    _height: number;
    // threeJS objects
    _scene: THREE.Scene;
    _renderer: THREE.WebGLRenderer;
    _camera: THREE.PerspectiveCamera;
    _controls: THREE.OrbitControls;
    _raycaster: THREE.Raycaster;
    _mouse: THREE.Vector2;
    _sphere: THREE.Mesh;
    // interaction and selection
    _select_visible = 'Objs';
    _text: string;
    // number of threejs points, lines, triangles
    _threejs_nums: [number, number, number] = [0, 0, 0];
    // grid
    _grid_show = true;
    _grid_center = [0, 0, 0];
    // the GI model to display
    _model: GIModel;
    _modelshow = true;
    _updatemodel = true;

    /**
     * Creates a new viewer,
     * @param injector
     * @param elem
     */
    constructor(injector: Injector, elem: ElementRef) {
        super(injector);
        this._elem = elem;
    }
    /**
     * Called when the viewer is initialised.
     */
    ngOnInit() {
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        // check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        // size of window
        this._width = container.offsetWidth; // container.client_width;
        this._height = container.offsetHeight; // container.client_height;
        // scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color( 0xcccccc );

        // renderer
        this._renderer =  new THREE.WebGLRenderer( {antialias: true} );
        this._renderer.setSize(this._width, this._height);
        this._renderer.setPixelRatio( window.devicePixelRatio );

        // camera settings
        const aspect_ratio: number = this._width / this._height;
        this._camera = new THREE.PerspectiveCamera( 50, aspect_ratio, 0.01, 1000 ); // 0.0001, 100000000 );
        this._camera.position.y = 10;
        this._camera.up.set(0, 0, 1);
        this._camera.lookAt( this._scene.position );
        this._camera.updateProjectionMatrix();

        // orbit controls
        const orbit_controls = OrbitControls(THREE);
        this._controls = new orbit_controls( this._camera, this._renderer.domElement );
        this._controls.enableKeys = false;
        container.appendChild( this._renderer.domElement );

        // mouse
        this._mouse = new THREE.Vector2();

        // selecting
        this._raycaster = new THREE.Raycaster();
        this._raycaster.linePrecision = 0.05;

        // add stuff to the scene
        this._addGrid();
        this._addAmbientLight();

        // update the model
        this.updateModel();

        // ??? What is heppening here?
        const self = this;
        this._controls.addEventListener( 'change', function() {self.render( self); });
        self._renderer.render( self._scene, self._camera );
    }
    /**
     * TODO What is self?
     * @param self
     */
    public render(self) {
        self._renderer.render( self._scene, self._camera );
    }
    /**
     * Called on window resize.
     */
    public onResize(): void {
        const container = this._elem.nativeElement.children.namedItem('container');
        /// check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        ///
        this._width = container.offset_width;
        this._height = container.offset_height;
        this._renderer.setSize(this._width, this._height);
        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }
    /**
     * Called on model updated.
     * @param message
     */
    public notify(message: string): void {
        if (message === 'model_update' && this._scene) {
            this.updateModel();
        }
    }
    /**
     * Update the model in the viewer.
     */
    public updateModel(): void {
        this._model = this.dataService.getModel() as GIModel;
        if ( !this._model || !this._scene ) {
            console.warn('Model or Scene not defined.');
            this._modelshow = false;
            return;
        }
        try {
            this._updatemodel = true;
            this._modelshow = true;
            const threejs_data: IThreeJS = this._model.get3jsData();
            // Create single positions buffer that will be used by all geometry
            const posis_buffer = new THREE.Float32BufferAttribute( threejs_data.positions, 3 );
            this._addTris(threejs_data.triangles, posis_buffer);
            this._addLines(threejs_data.lines, posis_buffer);
            this._addPoints(threejs_data.points, posis_buffer);
            // Render
            this._controls.update();
            this.render(this);
            // print
            console.log(">> this.scene >>", this._scene);
        } catch (ex) {
            console.error('Error displaying model:', ex);
            this._updatemodel = false;
            this._text = ex;
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
        this._scene.add( light );
    }
    /**
     * Creates an ambient light
     */
    private _addAmbientLight() {
        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this._scene.add( light );
    }

    /**
     * Creates a hidden sphere sphere.... not sure what this is for?
     */
    private _addSphere() {
        const geometry = new THREE.SphereGeometry( 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.5 } );
        this._sphere = new THREE.Mesh( geometry, material );
        this._sphere.visible = false;
        this._sphere.name = 'sphereInter';
        this._sphere.scale.set(0.1, 0.1, 0.1);
        this._scene.add( this._sphere );
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
            const gridhelper = new THREE.GridHelper( 100, 10);
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
    private _addTris(tris_i: number[], posis_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex( tris_i );
        geom.addAttribute( 'position',  posis_buffer);
        // geom.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        const mat = new THREE.MeshPhongMaterial( {
            specular:  new THREE.Color('rgb(255, 0, 0)'), // 0xffffff,
            shininess: 250,
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors
            // wireframe:true
        } );
        const mesh: THREE.Mesh = new THREE.Mesh( geom, mat);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        this._scene.add( mesh );
        this._threejs_nums[2] = tris_i.length / 3;
    }
    /**
     * Add threejs lines to the scene
     */
    private _addLines(lines_i: number[], posis_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex( lines_i );
        geom.addAttribute( 'position', posis_buffer );
        // geom.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals_flat, 3 ) );
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        const mat = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            linewidth: 1,
            linecap: 'round', // ignored by WebGLRenderer
            linejoin:  'round' // ignored by WebGLRenderer
        } );
        this._scene.add(new THREE.LineSegments(geom, mat) );
        this._threejs_nums[1] = lines_i.length / 2;
    }
    /**
     * Add threejs points to the scene
     */
    private _addPoints(points_i: number[], posis_buffer: THREE.Float32BufferAttribute): void {
        const geom = new THREE.BufferGeometry();
        geom.setIndex( points_i );
        geom.addAttribute( 'position', posis_buffer );
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        // geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial( {
            size: 0.1,
            vertexColors: THREE.VertexColors
        } );
        this._scene.add( new THREE.Points(geom, mat) );
        this._threejs_nums[0] = points_i.length;
    }
}
