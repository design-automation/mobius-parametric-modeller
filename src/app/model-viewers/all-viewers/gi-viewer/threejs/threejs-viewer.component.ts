import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls';
import { GIModel } from '@libs/geo-info/GIModel';
import { IThreeJS } from '@libs/geo-info/ThreejsJSON';
import { DataSubscriber } from '../data/data.subscriber';
// import @angular stuff
import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import { ThreejsScene } from './../data/threejs-scene';

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
    // threeJS scene data
    _threejs_scene: ThreejsScene;
    // the GI model to display
    _gi_model: GIModel;
    // num entities
    _threejs_nums: [number, number, number];
    // what are these?
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
        console.log("CALLING ngOnInit in THREEJS VIEWER");
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        // check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        // size of window
        this._width = container.offsetWidth; // container.client_width;
        this._height = container.offsetHeight; // container.client_height;
        // get the model and scene
        this._gi_model = this.dataService.getGIModel();
        this._threejs_scene = this.dataService.getThreejsScene();
        container.appendChild( this._threejs_scene._renderer.domElement );
        // set the numbers of entities
        this._threejs_nums = this._threejs_scene._threejs_nums;
        // ??? What is heppening here?
        const self = this;
        this._threejs_scene._controls.addEventListener( 'change', function() {self.render( self ); });
        self._threejs_scene._renderer.render( self._threejs_scene._scene, self._threejs_scene._camera );
        // update the model, calles getModel() from data service
        this.updateModel();
    }
    /**
     * TODO What is "self"? why not use "this"
     * @param self
     */
    public render(self) {
        self._threejs_scene._renderer.render( self._threejs_scene._scene, self._threejs_scene._camera );
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
        this._threejs_scene._renderer.setSize(this._width, this._height);
        this._threejs_scene._camera.aspect = this._width / this._height;
        this._threejs_scene._camera.updateProjectionMatrix();
    }
    /**
     * Called on model updated.
     * @param message
     */
    public notify(message: string): void {
        console.log("CALLING notify in THREEJS VIEWER");
        if (message === 'model_update' && this._threejs_scene) {
            this.updateModel();
        }
    }
    /**
     * Update the model in the viewer.
     */
    public updateModel(): void {
        console.log("CALLING updateModel in THREEJS VIEWER");
        if ( !this._gi_model || !this._threejs_scene ) {
            console.warn('Model or Scene not defined.');
            this._modelshow = false;
            return;
        }
        try {
            // Model
            this._updatemodel = true;
            this._modelshow = true;
            // set renderer size
            this._threejs_scene._renderer.setSize(this._width, this._height);
            // set camera aspect ratio
            this._threejs_scene._camera.aspect = this._width / this._height;
            // Render
            this.render(this);
            // print
            console.log('>> this.scene >>', this._threejs_scene._scene);
        } catch (ex) {
            console.error('Error displaying model:', ex);
            this._updatemodel = false;
            this._threejs_scene._text = ex;
        }
    }
}
