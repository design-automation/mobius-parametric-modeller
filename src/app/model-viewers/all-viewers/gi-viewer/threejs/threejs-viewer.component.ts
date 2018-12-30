import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, OnInit, Input, Injector, ElementRef, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { DataThreejs } from '../data/data.threejs';
// import { IModel } from 'gs-json';
import { DataService } from '../data/data.service';
import { EEntityTypeStr } from '@libs/geo-info/common';

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
        // this._gi_model = this.dataService.getGIModel();
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
        for (let i = 0; i < this._data_threejs._textLabels.length; i++) {
            this._data_threejs._textLabels[i].updatePosition();
        }
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

    public onUserAction(event) {
        const scene = this._data_threejs;
        scene._mouse.x = ( event.offsetX / scene._renderer.domElement.clientWidth ) * 2 - 1;
        scene._mouse.y = - ( event.offsetY / scene._renderer.domElement.clientHeight ) * 2 + 1;
        if (scene._selectedEntity.size === 0) {
            this.selectObj();
        } else {
            if (event.shiftKey && event.which === 1) {
                this.selectObj();
            }
        }
    }

    private selectObj() {
        const scene = this._data_threejs;
        if (scene.sceneObjs.length > 0) {
            scene._raycaster.setFromCamera( scene._mouse, scene._camera );
            const intersects = scene._raycaster.intersectObjects(scene.sceneObjs);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                // console.log('interecting object', intersect);
                if (intersect !== undefined) {
                    if (intersect.object.type === 'Mesh') {
                        this.selectFace(intersect);
                    } else if (intersect.object.type === 'LineSegments') {
                        this.selectLine(intersect);
                    } else if (intersect.object.type === 'Points') {
                        this.selectPoint(intersect);
                    }
                }
                console.log(scene._selectedEntity);
                this.render(this);
            }
        }
    }

    private selectFace(triangle) {
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const tri = this.model.geom.query.navFaceToTri(face);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);

        const tri_indices = [];
        verts_flat.map(vert => tri_indices.push(this.model.geom.query.navVertToPosi(vert)));

        const positions = this.model.attribs.query.getPosisCoords();
        const posi_flat = [].concat(...positions);

        const selecting = `f${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.FACE}${face}`);
        } else {
            scene.unselectObj(selecting);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectLine(line) {
        const scene = this._data_threejs;
        const verts = this.model.geom.query.navEdgeToVert(line.index / 2);
        const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
        const posi_flat = [].concat(...positions);

        const selecting = `l${line.index / 2}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, posi_flat);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.EDGE}${line.index / 2}`);
        } else {
            scene.unselectObj(selecting);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectWire(line) {
        const scene = this._data_threejs;
        const wire = this.model.geom.query.navEdgeToWire(line.index);
        const edges = this.model.geom.query.navWireToEdge(wire);
        console.log('edges edges edges', edges);
        // const positions = verts.map(v => this.model.attribs.query.getVerTxyzByIndex(v));
        // const posi_flat = [].concat(...positions);

        // const selecting = `l${line.index / 2}`;
        // if (!scene._selecting.has(selecting)) {
        //     scene.selectObjLine(selecting, posi_flat);
        //     scene._selectedEntity.set(selecting, `${EEntityTypeStr.EDGE}${line.index / 2}`);
        // } else {
        //     scene.unselectObj(selecting);
        //     scene._selectedEntity.delete(selecting);
        // }
    }

    private selectPoint(point) {
        const scene = this._data_threejs;
        const vert = this.model.geom.query.navPointToVert(point.index);
        const position = this.model.attribs.query.getPosiCoords(vert);
        const selecting = `p${point.index}`;
        if (!scene._selecting.has(selecting)) {
            const container = this._elem.nativeElement.children.namedItem('threejs-container');
            scene.selectObjPoint(selecting, position, container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.VERT}${point.index}`);
        } else {
            scene.unselectObj(selecting);
            scene._selectedEntity.delete(selecting);
        }
    }
}
