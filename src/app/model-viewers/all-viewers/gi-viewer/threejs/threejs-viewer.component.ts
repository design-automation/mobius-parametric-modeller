import { GIModel } from '@libs/geo-info/GIModel';
import { DataSubscriber } from '../data/data.subscriber';
// import @angular stuff
import { Component, OnInit, DoCheck, Injector, ElementRef } from '@angular/core';
import { DataThreejs } from '../data/data.threejs';

/**
 * A threejs viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html
 */
@Component({
    selector: 'threejs-viewer',
    templateUrl: './threejs-viewer.component.html',
    styleUrls: ['./threejs-viewer.component.scss']
})
export class ThreejsViewerComponent extends DataSubscriber implements OnInit, DoCheck {
    public _elem;
    // viewer size
    public _width: number;
    public _height: number;
    // threeJS scene data
    public _data_threejs: DataThreejs;
    // the GI model to display
    public _gi_model: GIModel;
    // num of positions, edges, triangles in threejs
    public _threejs_nums: [number, number, number];
    // flags for displayinhg text in viewer, see html
    public _no_model = false;
    public _model_error = false;
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
        // console.log('CALLING ngOnInit in THREEJS VIEWER COMPONENT');
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
        this._data_threejs = this.dataService.getThreejsScene();
        container.appendChild( this._data_threejs._renderer.domElement );
        // set the numbers of entities
        this._threejs_nums = this._data_threejs._threejs_nums;
        // ??? What is happening here?
        const self = this;
        this._data_threejs._controls.addEventListener( 'change', function() {self.render( self ); });
        self._data_threejs._renderer.render( self._data_threejs._scene, self._data_threejs._camera );
        // update the model, calles getModel() from data service
        this.updateModel();
    }
    /**
     * TODO What is "self"? why not use "this"
     * @param self
     */
    public render(self) {
        console.log('CALLING render in THREEJS VIEWER COMPONENT');
        self._data_threejs._renderer.render( self._data_threejs._scene, self._data_threejs._camera );
    }

    ngDoCheck() {
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        const width: number = container.offsetWidth;
        const height: number = container.offsetHeight;
        // this is when dimensions change
        if (width !== this._width || height !== this._height) {
            this.onResize();
        }
    }
    /**
     * Called on window resize.
     */
    public onResize(): void {
        console.log('CALLING onResize in THREEJS VIEWER COMPONENT');
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        /// check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        ///
        this._width = container.offsetWidth;
        this._height = container.offsetHeight;
        this._data_threejs._camera.aspect = this._width / this._height;
        this._data_threejs._camera.updateProjectionMatrix();
        this._data_threejs._renderer.setSize(this._width, this._height);
        console.log('ASPECT:::::', this._data_threejs._camera.aspect);
        // this.updateModel();
    }
    /**
     * Called on model updated.
     * @param message
     */
    // public notify(message: string): void {
    //     console.log('CALLING notify in THREEJS VIEWER');
    //     if (message === 'model_update' && this._data_threejs) {
    //         this.updateModel();
    //     }
    // }
    /**
     * Update the model in the viewer.
     */
    public updateModel(): void {
        // console.log('CALLING updateModel in THREEJS VIEWER COMPONENT');
        if ( !this._gi_model || !this._data_threejs ) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        }
        try {
            // Set model flags
            this._model_error = false;
            this._no_model = false;
            // set renderer size
            this._data_threejs._renderer.setSize(this._width, this._height);
            // set camera aspect ratio
            this._data_threejs._camera.aspect = this._width / this._height;
            // render the scene
            this.render(this);
            // console log the scene
            console.log('>> this.scene >>', this._data_threejs._scene);
        } catch (ex) {
            console.error('Error displaying model:', ex);
            this._model_error = true;
            this._data_threejs._text = ex;
        }
    }
}
