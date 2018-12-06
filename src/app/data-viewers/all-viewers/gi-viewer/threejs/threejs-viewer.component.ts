import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import { DataSubscriber } from '../data/DataSubscriber';
import { GIModel } from '../../../../../libs/geo-info/GIModel';
import { IThreeJS } from '../../../../../libs/geo-info/ThreejsJSON';
import * as THREE from 'three';

@Component({
    selector: 'threejs-viewer.component',
    templateUrl: './threejs-viewer.component.html',
    styleUrls: ['./threejs-viewer.component.css']
})
/**
 * A threejs viewer for viewing geo-info (GI) models.
 */
export class ThreejsViewerComponent extends DataSubscriber implements OnInit {
    myElement;
    // Viewer size
    width: number;
    height: number;
    // ThreeJS objects
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: THREE.OrbitControls;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    basicMat: THREE.MeshPhongMaterial;
    selectwireMat: THREE.LineBasicMaterial;
    starsGeometry: THREE.Geometry = new THREE.Geometry();
    sphere: THREE.Mesh;
    center: THREE.Vector3;
    // Data arrays
    selecting: Array<any>;
    scenechildren: Array<any>;
    textlabels: Array<any> = [];
    clickatt: Array<any>;
    // Interaction and selection
    mDownTime: number;
    mUpTime: number;
    seVisible = false;
    imVisible = false;
    SelectVisible = 'Objs';
    settingVisible = false;
    LineNo = 0;
    text: string;
    private lastChanged = undefined;
    // The GI model to display
    _model: GIModel;
    _modelshow = true;
    _updatemodel = true;
    // scene_and_maps: {
    //     scene: gs.IThreeScene,
    //     faces_map: Map<number, gs.ITopoPathData>,
    //     wires_map: Map<number, gs.ITopoPathData>,
    //     edges_map: Map<number, gs.ITopoPathData>,
    //     vertices_map: Map<number, gs.ITopoPathData>,
    //     points_map: Map<number, gs.ITopoPathData>
    // } ;

    /**
     * Creates a new viewer,
     * @param injector
     * @param myElement
     */
    constructor(injector: Injector, myElement: ElementRef) {
        super(injector);
        this.myElement = myElement;
    }
    /**
     * Called when the viewer is initialised.
     */
    ngOnInit() {
        const container = this.myElement.nativeElement.children.namedItem('container');
        // check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        //
        const width: number = container.offsetWidth; // container.clientWidth;
        const height: number = container.offsetHeight; // container.clientHeight;

        const scene: THREE.Scene = this.dataService.getScene(width, height);
        const renderer: THREE.WebGLRenderer = this.dataService.getRenderer();
        const camera: THREE.PerspectiveCamera = this.dataService.getCamera();
        const controls: THREE.OrbitControls = this.dataService.getControls();
        container.appendChild( renderer.domElement );

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
        this.width = width;
        this.height = height;
        this.updateModel();

        // todo: check and refactor what is required?
        this.selecting = this.dataService.getselecting();  // todo: should this be in the data service??
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 0.05;
        this.scenechildren = this.dataService.getscenechild();
        this.dataService.SelectVisible = this.SelectVisible;

        const geometry = new THREE.SphereGeometry( 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.5 } );
        this.sphere = new THREE.Mesh( geometry, material );
        this.sphere.visible = false;
        this.sphere.name = 'sphereInter';
        this.sphere.scale.set(0.1, 0.1, 0.1);
        this.scene.add( this.sphere );

        const self = this;
        controls.addEventListener( 'change', function() {self.render( self); });

        this.dataService.addraycaster(this.raycaster);
        this._addGrid();
        self.renderer.render( self.scene, self.camera );
    }
    /**
     * TODO What is self?
     * @param self
     */
    public render(self) {
        for (let i = 0; i < self.textlabels.length; i++) {
            self.textlabels[i].updatePosition();
        }
        if (self.dataService.clickshow !== undefined && self.clickatt !== self.dataService.clickshow) {
            self.clickatt = self.dataService.clickshow;
            self.clickshow();
        }
        // self.onDocumentMouseDown();
        self.renderer.render( self.scene, self.camera );
    }
    /**
     * Called on window resize.
     */
    public onResize(): void {
        const container = this.myElement.nativeElement.children.namedItem('container');
        /// check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        ///
        const width: number = container.offsetWidth;
        const height: number = container.offsetHeight;
        this.width = width;
        this.height = height;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }
    /**
     * Called on model updated.
     * @param message
     */
    public notify(message: string): void {
        if (message === 'model_update' && this.scene) {
            this.updateModel();
        }
    }
    /**
     * Update the model in the viewer.
     */
    public updateModel(): void {
        this._model = this.dataService.getModel() as GIModel;
        if ( !this._model || !this.scene ) {
            console.warn('Model or Scene not defined.');
            this._modelshow = false;
            return;
        }
        try {
            this._updatemodel = true;
            this._modelshow = true;
            const threejs_data: IThreeJS = this._model.get3jsData();
            // console.log('MODEL LOADED', this._model);
            // Create single positions buffer that will be used by all geometry
            const posis_buffer = new THREE.Float32BufferAttribute( threejs_data.positions, 3 );
            this._addTris(threejs_data.triangles, posis_buffer);
            this._addLines(threejs_data.lines, posis_buffer);
            this._addPoints(threejs_data.points, posis_buffer);
            // Render
            this.controls.update();
            this.render(this);
            this.dataService.getpoints = [];
        } catch (ex) {
            console.error('Error displaying model:', ex);
            this._updatemodel = false;
            this.text = ex;
        }
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Draws a grid on the XY plane.
     */
    private _addGrid() {
        for (let i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === 'GridHelper') {
                        this.scene.remove(this.scene.children[i]);
                        i = i - 1;
            }
        }
        // todo: change grid -> grid_value
        if (this.dataService.grid) {
            const gridhelper = new THREE.GridHelper( 100, 10);
            gridhelper.name = 'GridHelper';
            const vector = new THREE.Vector3(0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(0, 0, 0);
            this.scene.add( gridhelper);
            this.dataService.centerx = 0;
            this.dataService.centery = 0;
            this.dataService.centerz = 0;
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
            specular: 0xffffff, shininess: 0,
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
            // wireframe:true
        } );
        this.scene.add( new THREE.Mesh( geom, mat) );
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
        this.scene.add(new THREE.LineSegments(geom, mat) );
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
        this.scene.add( new THREE.Points(geom, mat) );
    }
}
