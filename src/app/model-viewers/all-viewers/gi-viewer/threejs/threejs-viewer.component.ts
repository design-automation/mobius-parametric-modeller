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
    public messageVisible = false;
    public message: string;
    // the selectable type of entity by user, depends on the Attribute Tab
    public selectable: number;

    // right selection dropdown
    public selectingEntity: {id: string, name: string} = {id: 'A', name: 'All'};
    public selectDropdownVisible = false;
    public selections = [
        {id: 'P', name: 'Points'}, {id: 'E', name: 'Edges'}, {id: 'W', name: 'Wires'},
        {id: 'F', name: 'Faces'}, {id: 'PL', name: 'Polylines'}, {id: 'PG', name: 'Polygons'},
        {id: 'C', name: 'Collections'}, {id: 'A', name: 'All'}];
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

        if (this._data_threejs.ObjLabelMap.size !== 0) {
            this._data_threejs.ObjLabelMap.forEach((obj, label) => {
                this._data_threejs.createLabelforObj(this.container, obj.entity, obj.type, label);
            });
        }
    }
    /**
     * @param self
     */
    public render(self) {
        // console.log('CALLING render in THREEJS VIEWER COMPONENT');
        const textLabels = this._data_threejs._textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach( (label) => {
                label.updatePosition();
            });
        }
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
     * Update the model in the viewer.
     */
    public async updateModel(model: GIModel) {
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
        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            this.container.removeChild(value);
        });
        this._data_threejs._textLabels.clear();
        this.render(this);
        scene._selectedEntity.clear();
    }


    private selectObj(intersects) {
        // console.log('interecting object', intersect);
        if (intersects.length > 0) {
            const intersect0 = intersects[0];
            switch (this.selectingEntity.id) {
                case 'A':
                if (intersect0.object.type === 'Mesh') {
                    this.selectFace(intersect0);
                } else if (intersect0.object.type === 'LineSegments') {
                    this.selectEdge(intersect0);
                } else if (intersect0.object.type === 'Points') {
                    this.selectPoint(intersect0);
                }
                    break;
                case 'F':
                if (intersect0.object.type === 'Mesh') {
                    this.selectFace(intersect0);
                } else {
                    this.showMessages('Faces');
                }
                    break;
                case 'PG':
                if (intersect0.object.type === 'Mesh') {
                    this.selectPGon(intersect0);
                } else {
                    this.showMessages('Polygons');
                }
                    break;
                case 'E':
                if (intersect0.object.type === 'LineSegments') {
                    this.selectEdge(intersect0);
                } else {
                    this.showMessages('Edges');
                }
                    break;
                case 'W':
                if (intersect0.object.type === 'LineSegments') {
                    this.selectWire(intersect0);
                } else {
                    this.showMessages('Wires');
                }
                    break;
                case 'PL':
                if (intersect0.object.type === 'LineSegments') {
                    this.selectPLine(intersect0);
                } else {
                    this.showMessages('Polylines');
                }
                    break;
                case 'P':
                if (intersect0.object.type === 'Points') {
                    this.selectPoint(intersect0);
                } else {
                    this.showMessages('Points');
                }
                    break;
                default:
                    break;
            }
            // if (intersect0.object.type === 'LineSegments') {
            //     const intersect1 = intersects[1];
            //     if (intersect1 && intersect0.distance === intersect1.distance) {
            //         this.chooseLine(intersect0, intersect1);
            //         this.selectWire(intersect0);
            //     } else {
            //         this.selectEdge(intersect0);
            //         this.selectWire(intersect0);
            //     }
            // }
        }
        this.render(this);
    }

    private showMessages(tab: string) {
        this.messageVisible = true;
        this.message = `Please Select ${tab}`;
        setTimeout(() => {
            this.messageVisible = false;
        }, 3000);
    }

    private chooseLine(intersect0, intersect1) {
        this.selectEdge(intersect0);
        this.selectEdge(intersect1);
    }


    private selectPoint(point) {
        const scene = this._data_threejs;
        const vert = this.model.geom.query.navPointToVert(point.index);
        const position = this.model.attribs.query.getPosiCoords(vert);
        const selecting = `${EEntityTypeStr.POINT.replace(/[_]/g, '')}${point.index}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjPoint(selecting, position, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.POINT}${point.index}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectEdge(line) {
        const scene = this._data_threejs;
        const verts = this.model.geom.query.navEdgeToVert(line.index / 2);
        const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
        const posi_flat = [].concat(...positions);

        const selecting = `${EEntityTypeStr.EDGE.replace(/[_]/g, '')}${line.index / 2}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, [], posi_flat, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.EDGE}${line.index / 2}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectWire(line) {
        const scene = this._data_threejs;
        const wire = this.model.geom.query.navEdgeToWire(line.index / 2);
        const edges = this.model.geom.query.navWireToEdge(wire);

        const verts = edges.map(e => this.model.geom.query.navEdgeToVert(e));
        const verts_flat = [].concat(...[].concat(...verts));
        const indices = [];
        const positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const selecting = `${EEntityTypeStr.WIRE.replace(/[_]/g, '')}${wire}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, indices, posi_flat, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.WIRE}${wire}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectFace(triangle) {
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const tri = this.model.geom.query.navFaceToTri(face);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);

        const selecting = `${EEntityTypeStr.FACE.replace(/[_]/g, '')}${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.FACE}${face}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectPLine(line) {
        const scene = this._data_threejs;
        const wire = this.model.geom.query.navEdgeToWire(line.index / 2);
        const pline = this.model.geom.query.navWireToPline(wire);
        if (pline === undefined) {
            return null;
        }
        const wire1 = this.model.geom.query.navPlineToWire(pline);
        const edges = this.model.geom.query.navWireToEdge(wire1);
        const verts = edges.map(e => this.model.geom.query.navEdgeToVert(e));
        const verts_flat = [].concat(...[].concat(...verts));
        const indices = [];
        const positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const selecting = `${EEntityTypeStr.PLINE.replace(/[_]/g, '')}${wire}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, indices, posi_flat, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.PLINE}${wire}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    private selectPGon(triangle) {
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const pgon = this.model.geom.query.navFaceToPgon(face);
        if (pgon === undefined) {
            return null;
        }
        const face1 = this.model.geom.query.navPgonToFace(pgon);
        const tri = this.model.geom.query.navFaceToTri(face1);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);

        const selecting = `${EEntityTypeStr.PGON.replace(/[_]/g, '')}${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            scene._selectedEntity.set(selecting, `${EEntityTypeStr.PGON}${face}`);
        } else {
            scene.unselectObj(selecting, this.container);
            scene._selectedEntity.delete(selecting);
        }
    }

    public zoomfit() {
        this._data_threejs.lookAtObj(this._width);
    }

    private selectEntity(selection: {id: string, name: string}) {
        this.selectingEntity = selection;
        this.selectDropdownVisible = false;
    }
}
