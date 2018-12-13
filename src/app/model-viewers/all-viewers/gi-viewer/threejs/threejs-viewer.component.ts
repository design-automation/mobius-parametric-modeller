import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, OnInit, Input, Injector, ElementRef, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { DataThreejs } from '../data/data.threejs';
// import { IModel } from 'gs-json';
import { DataService } from '../data/data.service';

/**
 * A threejs viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html
 */
@Component({
    selector: 'threejs-viewer',
    templateUrl: './threejs-viewer.component.html',
    styleUrls: ['./threejs-viewer.component.scss']
})
export class ThreejsViewerComponent implements OnInit, DoCheck, OnChanges {
    @Input() model: GIModel;

    public _elem;
    // viewer size
    public _width: number;
    public _height: number;
    // DataService
    protected dataService: DataService;
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
        this._elem = elem;
        this.dataService = injector.get(DataService);
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
    }
    /**
     * TODO What is "self"? why not use "this"
     * @param self
     */
    public render(self) {
        // console.log('CALLING render in THREEJS VIEWER COMPONENT');
        self._data_threejs._renderer.render( self._data_threejs._scene, self._data_threejs._camera );
    }

    /**
     * Called when anything changes
     */
    ngDoCheck() {
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        const width: number = container.offsetWidth;
        const height: number = container.offsetHeight;

        // this is when dimensions change
        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            setTimeout(() => {
                this._data_threejs._camera.aspect = this._width / this._height;
                this._data_threejs._camera.updateProjectionMatrix();
                this._data_threejs._renderer.setSize(this._width, this._height);
                this.render(this);
            }, 10);
        }
    }

    // receive data -> model from gi-viewer component and update model in the scene
    ngOnChanges(changes: SimpleChanges) {
        if ( changes['model']) {
            if ( this.model ) {
                this.updateModel(this.model);
            }
        }
    }

    /**
     * Called on model updated.
     * @param message
     */
    /**
     * Update the model in the viewer.
     */
    public updateModel(model: GIModel): void {
        // console log the scene
        this._data_threejs = this.dataService.getThreejsScene();
        // console.log('>> this.scene >>', this._data_threejs._scene);
        // this._gi_model = this.dataService.getGIModel();
        this._gi_model = model;
        // console.log('CALLING updateModel in THREEJS VIEWER COMPONENT');
        if ( !this._gi_model) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        }
        try {
            // add geometry to the scene
            this._data_threejs.addGeometry(this._gi_model);
            // Set model flags
            this._model_error = false;
            this._no_model = false;
            this.render(this);
        } catch (ex) {
            console.error('Error displaying model:', ex);
            this._model_error = true;
            this._data_threejs._text = ex;
        }
    }
}
