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

    public container = null;
    public _elem;
    // viewer size
    public _width: number;
    public _height: number;
    // DataService
    protected dataService: DataService;
    // threeJS scene data
    public _data_threejs: DataThreejs;
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
        this.container = this._elem.nativeElement.children.namedItem('threejs-container');
        // check for container
        if (!this.container) {
            console.error('No container in Three Viewer');
            return;
        }
        // size of window
        this._width = this.container.offsetWidth; // container.client_width;
        this._height = this.container.offsetHeight; // container.client_height;

        this._data_threejs = this.dataService.getThreejsScene();
        this.container.appendChild( this._data_threejs._renderer.domElement );
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
        // const textLabels = this._data_threejs._textLabels;
        // if (textLabels.size !== 0) {
        //     textLabels.forEach( (label) => {
        //         // label.updatePosition();
        //         let scale = label.position.distanceTo(this._data_threejs._camera.position) / 50;
        //         scale = Math.min(5, Math.max(1, scale));
        //         label.scale.set(scale, scale, scale);
        //         label.quaternion.copy(this._data_threejs._camera.quaternion);
        //     });
        // }
        self._data_threejs._renderer.render( self._data_threejs._scene, self._data_threejs._camera );
    }

    /**
     * Called when anything changes
     */
    ngDoCheck() {
        if (!this.container) {
            console.error('No container in Three Viewer');
            return;
        }
        const width: number = this.container.offsetWidth;
        const height: number = this.container.offsetHeight;

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
        this._data_threejs = this.dataService.getThreejsScene();
        if ( !model) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        } else {
            if (model !== this._data_threejs._model) {
                this._data_threejs._model = model;
                try {
                    // add geometry to the scene
                    this._data_threejs.addGeometry(model, this.container);
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
    }

    private initRaycaster(event) {
        const scene = this._data_threejs;
        scene._mouse.x = ( event.offsetX / scene._renderer.domElement.clientWidth ) * 2 - 1;
        scene._mouse.y = - ( event.offsetY / scene._renderer.domElement.clientHeight ) * 2 + 1;
        scene._raycaster.setFromCamera( scene._mouse, scene._camera );
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }

    public onDocumentMouseMove(event) {
        const intersects = this.initRaycaster(event);
        if (intersects.length > 0) {
            const tags = document.getElementsByTagName('body');
            for (let index = 0; index < tags.length; index++) {
                tags[index].style.cursor = 'pointer';
            }
        } else {
            const tags = document.getElementsByTagName('body');
            for (let index = 0; index < tags.length; index++) {
                tags[index].style.cursor = 'default';
            }
        }
    }

    public onUserAction(event) {
        const scene = this._data_threejs;
        scene.onWindowKeyPress(event);
        this.render(this);
        const intersects = this.initRaycaster(event);

        if (intersects.length > 0) {
            if (scene._selectedEntity.size === 0) {
                this.selectObj(intersects);
            } else {
                if (event.shiftKey && event.which === 1) {
                    this.selectObj(intersects);
                } else if (event.which === 1) {
                    console.log('Press Shift key to do multiple selection.');
                }
            }
        } else {
            if (event.which === 27) {
                this.unselectAll();
            }
        }
    }

    private unselectAll() {
        const scene = this._data_threejs;
        const selectings = Array.from(scene._selecting.keys());
        for (const selecting of selectings) {
            scene.unselectObj(selecting, this.container);
        }
        this.render(this);
        scene._selectedEntity.clear();
    }


    private selectObj(intersects) {
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
        // console.log(scene._selectedEntity);
        this.render(this);
    }

    private selectFace(triangle) {
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const tri = this.model.geom.query.navFaceToTri(face);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const vertP = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        console.log('verts_flat', verts_flat);
        const vertP_flat = [].concat(...vertP);
        const tri_indices = [];
        const positions = [];
        vertP_flat.map((vert) => {
            positions.push(this.model.attribs.query.getPosiCoords[vert]);
            tri_indices.push(vert);
        });
        console.log('Tri Indices', tri_indices);
        let diff = null;
        const new_indices = tri_indices.map((v, i) => {
            if (!diff) {
                diff = v - i;
            }
            return v - diff;
        });
        console.log('New Indices', new_indices);
        verts_flat.map(vert => tri_indices.push(this.model.geom.query.navVertToPosi(vert)));
        const posi_flat = [].concat(...positions);
        console.log('positions', positions);

        const selecting = `f${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, new_indices, posi_flat, container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.FACE}${face}`);
        } else {
            scene.unselectObj(selecting, container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectLine(line) {
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        const scene = this._data_threejs;
        const verts = this.model.geom.query.navEdgeToVert(line.index / 2);
        const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
        const posi_flat = [].concat(...positions);

        const selecting = `l${line.index / 2}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, posi_flat, container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.EDGE}${line.index / 2}`);
        } else {
            scene.unselectObj(selecting, container);
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
        const container = this._elem.nativeElement.children.namedItem('threejs-container');
        const scene = this._data_threejs;
        const vert = this.model.geom.query.navPointToVert(point.index);
        const position = this.model.attribs.query.getPosiCoords(vert);
        const selecting = `p${point.index}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjPoint(selecting, position, container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.VERT}${point.index}`);
        } else {
            scene.unselectObj(selecting, container);
            scene._selectedEntity.delete(selecting);
        }
    }
}
