import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import {
    Component, OnInit, Input, Output, EventEmitter,
    Injector, ElementRef, DoCheck, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { DataThreejs } from '../data/data.threejs';
// import { IModel } from 'gs-json';
import { DataService } from '../data/data.service';
import { EEntType, EAttribNames, EEntTypeStr, Txyz } from '@libs/geo-info/common';
import { DropdownMenuComponent } from '../html/dropdown-menu.component';
import { ModalService } from '../html/modal-window.service';
import { ThreeJSViewerService } from './threejs-viewer.service';

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
    @Output() eventClicked = new EventEmitter<Event>();
    @Input() model: GIModel;
    @ViewChild(DropdownMenuComponent) dropdown = new DropdownMenuComponent();

    protected modalWindow: ModalService;
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
    public needSelect = false;
    // current entity type enabled for selection
    public SelectingEntityType: { id: string, name: string } = { id: EEntTypeStr[EEntType.FACE], name: 'Faces' };
    public selectDropdownVisible = false;
    public selections = [
        { id: EEntTypeStr[EEntType.POSI], name: 'Positions' }, { id: EEntTypeStr[EEntType.VERT], name: 'Vetex' },
        { id: EEntTypeStr[EEntType.EDGE], name: 'Edges' }, { id: EEntTypeStr[EEntType.WIRE], name: 'Wires' },
        { id: EEntTypeStr[EEntType.FACE], name: 'Faces' }, { id: EEntTypeStr[EEntType.POINT], name: 'Points' },
        { id: EEntTypeStr[EEntType.PLINE], name: 'Polylines' }, { id: EEntTypeStr[EEntType.PGON], name: 'Polygons' },
        { id: EEntTypeStr[EEntType.COLL], name: 'Collections' }];

    public dropdownPosition = { x: 0, y: 0 };

    private isDown = false;
    private lastX: number;
    private lastY: number;
    private dragHash: number;
    private shiftKeyPressed = false;
    /**
     * Creates a new viewer,
     * @param injector
     * @param elem
     */
    constructor(injector: Injector, elem: ElementRef, private threeJSViewerService: ThreeJSViewerService) {
        this._elem = elem;
        this.dataService = injector.get(DataService);
        this.modalWindow = injector.get(ModalService);
    }
    /**
     * Called when the viewer is initialised.
     */
    ngOnInit() {
        this.dropdown.items = [];
        this.dropdown.visible = false;
        this.dropdown.position = { x: 0, y: 0 };
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
        this.threeJSViewerService.DataThreejs = this._data_threejs;
        this.container.appendChild(this._data_threejs._renderer.domElement);
        // set the numbers of entities
        this._threejs_nums = this._data_threejs._threejs_nums;
        // ??? What is happening here?
        const self = this;
        this._data_threejs._controls.addEventListener('change', function () { self.render(self); });
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);

        if (this._data_threejs.ObjLabelMap.size !== 0) {
            this._data_threejs.ObjLabelMap.forEach((obj, label) => {
                this._data_threejs.createLabelforObj(this.container, obj.entity, obj.type, label);
            });
        }

        if (localStorage.getItem('mpm_selecting_entity_type') === null) {
            localStorage.setItem('mpm_selecting_entity_type', JSON.stringify(this.SelectingEntityType));
        } else {
            this.getSelectingEntityType();
        }
    }
    /**
     * @param self
     */
    public render(self) {
        // console.log('CALLING render in THREEJS VIEWER COMPONENT');
        const textLabels = this._data_threejs._textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach((label) => {
                label.updatePosition();
            });
        }
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);
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
        if (changes['model']) {
            if (this.model) {
                this.updateModel(this.model);
            }
        }
    }

    /**
     * Update the model in the viewer.
     */
    public async updateModel(model: GIModel) {
        this._data_threejs = this.dataService.getThreejsScene();
        if (!model) {
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

    // private initRaycaster(event) {
    //     const scene = this._data_threejs;
    //     scene._mouse.x = (event.offsetX / scene._renderer.domElement.clientWidth) * 2 - 1;
    //     scene._mouse.y = - (event.offsetY / scene._renderer.domElement.clientHeight) * 2 + 1;
    //     scene._raycaster.setFromCamera(scene._mouse, scene._camera);
    //     return scene._raycaster.intersectObjects(scene.sceneObjs);
    // }

    private onMouseUp(event) {
        if (event.target.tagName !== 'CANVAS') {
            return null;
        } else {
            if (this.dragHash < 5) {
                this.onUserAction(event);
            } else {
                // this._data_threejs._controls.enabled = true;
            }
            this.isDown = false;
        }
    }

    public onMouseMove(event) {
        const tags = document.getElementsByTagName('body');
        const length = tags.length;
        if (event.target.tagName !== 'CANVAS') {
            let index = 0;
            for (; index < length; index++) {
                tags[index].style.cursor = 'default';
            }
            return null;
        } else {
            const intersects = this.threeJSViewerService.initRaycaster(event);
            if (intersects.length > 0) {
                let index = 0;
                for (; index < length; index++) {
                    tags[index].style.cursor = 'pointer';
                }
            } else {
                let index = 0;
                for (; index < length; index++) {
                    tags[index].style.cursor = 'default';
                }
            }

            if (!this.isDown) { return; }
            // event.preventDefault();
            const mouseX = event.clientX - event.target.getBoundingClientRect().left;
            const mouseY = event.clientY - event.target.getBoundingClientRect().top;

            // Put your mousemove stuff here
            const dx = mouseX - this.lastX;
            const dy = mouseY - this.lastY;
            this.lastX = mouseX;
            this.lastY = mouseY;

            // accumulate the drag distance
            // (used in mouseup to see if this is a drag or click)
            this.dragHash += Math.abs(dx) + Math.abs(dy);

            if (this.dragHash > 4) {
                // dragging
            }
        }
    }

    private onMouseDown(event) {
        if (event.target.tagName !== 'CANVAS') {
            return null;
        } else {
            event.stopPropagation();

            this.lastX = event.clientX - event.target.getBoundingClientRect().left;
            this.lastY = event.clientY - event.target.getBoundingClientRect().top;

            // Put your mousedown stuff here
            this.dragHash = 0;
            this.isDown = true;
        }
    }

    private onKeyDown(event) {
        const scene = this._data_threejs;
        // keyboard control for camera
        scene.onWindowKeyPress(event);
        if (event.shiftKey) {
            this.shiftKeyPressed = true;
        }
        this.render(this);
    }

    private onKeyUp(event) {
        this.shiftKeyPressed = false;
    }

    public onUserAction(event) {
        // get entities for mouse event
        const intersects = this.threeJSViewerService.initRaycaster(event);

        // check intersect exist
        if (intersects.length > 0) {
            if (event.which === 1) {
                // check mouse event triggered in THREE viewer, then enable dropdown menu
                if (event.target.tagName === 'CANVAS') {
                    const pos_x = event.clientX - event.target.getBoundingClientRect().left;
                    const pos_y = event.clientY - event.target.getBoundingClientRect().top;
                    this.dropdownPosition = { x: pos_x, y: pos_y };
                }
                this.selectObj(intersects[0]);
                // intersects[0].material.emissive.setHex( 0xff0000 );
            }
        } else {
            if (event.target.tagName === 'CANVAS') {
                this.unselectAll();
                if (event.target.tagName !== 'OL') {
                    // not clicking on Menu item, hide dropdown menu
                    this.dropdown.visible = false;
                    // return;
                }
            }
        }
        this.refreshTable(event);
    }

    private refreshTable(event: Event) {
        this.eventClicked.emit(event);
    }

    private unselectAll() {
        const scene = this._data_threejs;
        const selectings = Array.from(scene.selected_geoms.keys());
        for (const selecting of selectings) {
            scene.unselectObj(selecting, this.container);
        }
        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            this.container.removeChild(value);
        });
        this._data_threejs._textLabels.clear();

        this.dataService.selected_ents.forEach(map => {
            map.clear();
        });
        this.refreshTable(event);
        scene.sceneObjsSelected.clear();
        // if (this.SelectingEntityType.id === EEntTypeStr[EEntType.COLL]) {
        //     document.getElementById('executeButton').click();
        // }
        const positions = Array.from(scene.selected_positions.keys());
        for (const posi of positions) {
            scene.unselectObjGroup(posi, this.container, 'positions');
        }

        const edges = Array.from(scene.selected_face_edges.keys());
        for (const edge of edges) {
            scene.unselectObjGroup(edge, this.container, 'face_edges');
        }

        this.render(this);
    }

    private getSelectingEntityType() {
        if (localStorage.getItem('mpm_selecting_entity_type') != null) {
            this.SelectingEntityType = JSON.parse(localStorage.getItem('mpm_selecting_entity_type'));
        }
    }

    private selectObj(intersect0: THREE.Intersection) {
        // console.log('interecting object', intersect);
        const scene = this._data_threejs;
        this.getSelectingEntityType();
        switch (this.SelectingEntityType.id) {
            case EEntTypeStr[EEntType.POSI]:
                if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const ent_id = `_f_posi${face}`;
                    if (scene.selected_positions.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0, ent_id);
                    }
                } else if (intersect0.object.type === 'LineSegments') {
                    const ent_id = `_e_posi${intersect0.index / 2}`;
                    if (scene.selected_positions.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0, ent_id);
                    }
                } else if (intersect0.object.type === 'Points') {
                    const ent_id = `_pt_posi${intersect0.index}`;
                    if (scene.selected_positions.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0, ent_id);
                    }
                }
                // console.log(scene.selected_positions);
                break;
            case EEntTypeStr[EEntType.VERT]:
                this.selectVertex(intersect0);
                break;
            case EEntTypeStr[EEntType.COLL]:
                if (!this.shiftKeyPressed) {
                    this.unselectAll();
                }
                this.selectColl(intersect0, intersect0.object.type);
                break;
            case EEntTypeStr[EEntType.FACE]:
                if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const ent_id = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.FACE]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectFace(intersect0);
                    }
                } else {
                    this.showMessages('Faces', true);
                }
                break;
            case EEntTypeStr[EEntType.PGON]:
                if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const pgon = this.model.geom.query.navFaceToPgon(face);
                    const ent_id = `${EEntTypeStr[EEntType.PGON]}${pgon}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.PGON]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPGon(intersect0);
                    }
                } else {
                    this.showMessages('Polygons', true);
                }
                break;
            case EEntTypeStr[EEntType.EDGE]:
                if (intersect0.object.type === 'LineSegments') {
                    const ent_id = `${EEntTypeStr[EEntType.EDGE]}${intersect0.index / 2}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.EDGE]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectEdge(intersect0);
                    }
                } else if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const ent_id = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_face_edges.has(ent_id)) {
                        this.unselectGeom(ent_id, 'face_edges');
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectEdgeByFace(intersect0, ent_id);
                    }
                } else {
                    this.showMessages('Edges', true);
                }
                break;
            case EEntTypeStr[EEntType.WIRE]:
                if (intersect0.object.type === 'LineSegments') {
                    const wire = this.model.geom.query.navEdgeToWire(intersect0.index / 2);
                    const ent_id = `${EEntTypeStr[EEntType.WIRE]}${wire}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.WIRE]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectWire(intersect0);
                    }
                } else {
                    this.showMessages('Wires', true);
                }
                break;
            case EEntTypeStr[EEntType.PLINE]:
                if (intersect0.object.type === 'LineSegments') {
                    const wire = this.model.geom.query.navEdgeToWire(intersect0.index / 2);
                    const pline = this.model.geom.query.navWireToPline(wire);
                    const ent_id = `${EEntTypeStr[EEntType.PLINE]}${pline}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.PLINE]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPLine(intersect0);
                    }
                } else {
                    this.showMessages('Polylines', true);
                }
                break;
            case EEntTypeStr[EEntType.POINT]:
                if (intersect0.object.type === 'Points') {
                    const ent_id = `${EEntTypeStr[EEntType.POINT]}${intersect0.index}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POINT]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPoint(intersect0);
                    }
                } else {
                    this.showMessages('Points', true);
                }
                break;
            default:
                this.showMessages('Please choose an Entity type.', true, 'custom');
                break;
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

    private showMessages(msg: string, needSelect: boolean = false, mode: string = 'notice') {
        switch (mode) {
            case 'custom':
                this.message = msg;
                break;
            case 'notice':
                this.message = `Please Select ${msg}`;
                break;
            default:
                break;
        }
        this.needSelect = needSelect;
        this.messageVisible = true;
        setTimeout(() => {
            this.messageVisible = false;
        }, 3000);
    }

    private selectPositions(object: THREE.Intersection, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.POSI];
        const scene = this._data_threejs;
        const posi_ent = this.dataService.selected_ents.get(ent_type_str);
        if (object.object.type === 'Points') {
            const position = this.model.attribs.query.getPosiCoords(object.index);
            const posi_ents = this.model.geom.query.navVertToPosi(object.index);
            const ent_id = `${ent_type_str}${object.index}`;
            scene.selectObjPosition(parent_ent_id, ent_id, position, this.container, true);
            posi_ent.set(ent_id, posi_ents);
            this.dataService.selected_positions.set(`${parent_ent_id}`, [ent_id]);
        } else if (object.object.type === 'LineSegments') {
            const verts = this.model.geom.query.navEdgeToVert(object.index / 2);
            const posis = verts.map(v => this.model.geom.query.navVertToPosi(v));
            const children = [];
            posis.map(posi => {
                const position = this.model.attribs.query.getPosiCoords(posi);
                scene.selectObjPosition(parent_ent_id, `${ent_type_str}${posi}`, position, this.container, true);
                posi_ent.set(`${ent_type_str}${posi}`, posi);
                children.push(`${ent_type_str}${posi}`);
            });
            this.dataService.selected_positions.set(`${parent_ent_id}`, children);
        } else if (object.object.type === 'Mesh') {
            const face = this.model.geom.query.navTriToFace(object.faceIndex),
                tris = this.model.geom.query.navFaceToTri(face),
                posis = tris.map(tri => this.model.geom.query.navAnyToPosi(EEntType.TRI, tri)),
                posi_flat = [].concat(...posis);

            const uniqPositions = this.uniq(posi_flat);
            const children = [];
            uniqPositions.map(posi => {
                const position = this.model.attribs.query.getPosiCoords(posi);
                scene.selectObjPosition(parent_ent_id, `${ent_type_str}${posi}`, position, this.container, true);
                posi_ent.set(`${ent_type_str}${posi}`, posi);
                children.push(`${ent_type_str}${posi}`);
            });
            this.dataService.selected_positions.set(`${parent_ent_id}`, children);
        }
    }

    private uniq(a) {
        const seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    private selectVertex(object: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.VERT];
        const scene = this._data_threejs;
        if (object.object.type === 'Points') {
            const vert = this.model.geom.query.navPointToVert(object.index),
                position = this.model.attribs.query.getPosiCoords(vert);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntTypeStr[EEntType.POINT]}${object.index}`;
            if (!scene.selected_geoms.has(selecting)) {
                // scene.selectObjPoint(selecting, position, this.container);
                posi_ent.set(`${EEntTypeStr[EEntType.POSI]}${vert}`, vert);
            } else {
                scene.unselectObj(selecting, this.container);
                posi_ent.delete(`${ent_type_str}${vert}`);
            }
        } else if (object.object.type === 'LineSegments') {
            const verts = this.model.geom.query.navEdgeToVert(object.index / 2);
            const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
            const posi_flat = [].concat(...positions);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntTypeStr[EEntType.EDGE]}${object.index / 2}`;
            if (!scene.selected_geoms.has(selecting)) {
                scene.selectObjLine(selecting, [], posi_flat, this.container);
                verts.map(vert => posi_ent.set(`${ent_type_str}${vert}`, vert));
            } else {
                scene.unselectObj(selecting, this.container);
                verts.map(vert => posi_ent.delete(`${ent_type_str}${vert}`));
            }
        } else if (object.object.type === 'Mesh') {
            const face = this.model.geom.query.navTriToFace(object.faceIndex),
                tris = this.model.geom.query.navFaceToTri(face),
                verts = tris.map(tri => this.model.geom.query.navTriToVert(tri)),
                verts_flat = [].concat(...verts),
                posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v)),
                posis_flat = [].concat(...posis);

            const tri_indices = [];
            const positions = [];
            posis_flat.map((posi, index) => {
                positions.push(this.model.attribs.query.getPosiCoords(posi));
                tri_indices.push(index);
            });
            const posi_flat = [].concat(...positions);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntType.FACE}${face}`;
            if (!scene.selected_geoms.has(selecting)) {
                scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
                verts_flat.map(vert => posi_ent.set(`${ent_type_str}${vert}`, vert));
            } else {
                scene.unselectObj(selecting, this.container);
                verts_flat.map(vert => posi_ent.delete(`${ent_type_str}${vert}`));
            }
        }
    }

    private unselectGeom(ent_id: string, ent_type_str: string) {
        const scene = this._data_threejs;
        if (ent_type_str === EEntTypeStr[EEntType.POSI]) {
            scene.unselectObjGroup(ent_id, this.container, 'positions');
            const children = this.dataService.selected_positions.get(ent_id);
            children.forEach(c => {
                this.dataService.selected_ents.get(EEntTypeStr[EEntType.POSI]).delete(c);
            });
            this.dataService.selected_positions.delete(ent_id);

        } else if (ent_type_str === 'face_edges') {
            scene.unselectObjGroup(ent_id, this.container, 'face_edges');
            const children = this.dataService.selected_face_edges.get(ent_id);
            children.forEach(c => {
                this.dataService.selected_ents.get(EEntTypeStr[EEntType.EDGE]).delete(c);
            });
            this.dataService.selected_face_edges.delete(ent_id);

        } else {
            scene.unselectObj(ent_id, this.container);
            this.dataService.selected_ents.get(ent_type_str).delete(ent_id);
        }
    }

    private selectEdge(line: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.EDGE],
            verts = this.model.geom.query.navEdgeToVert(line.index / 2),
            positions = verts.map(v => this.model.attribs.query.getVertCoords(v)),
            posi_flat = [].concat(...positions),
            ent_id = `${ent_type_str}${line.index / 2}`;
        this._data_threejs.selectObjLine(ent_id, [], posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, line.index / 2);
    }

    private selectEdgeByFace(object: THREE.Intersection, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.EDGE],
            face = this.model.geom.query.navTriToFace(object.faceIndex),
            edges = this.model.geom.query.navAnyToAny(EEntType.FACE, EEntType.EDGE, face);
        const children = [];
        edges.map(edge => {
            const ent_id = `${ent_type_str}${edge}`;
            children.push(ent_id);
            const vert = this.model.geom.query.navEdgeToVert(edge);
            const position = [];
            const indices = [];
            vert.map((v, i) => {
                position.push(this.model.attribs.query.getVertCoords(v));
                indices.push(i);
            });
            const posi_flat = [].concat(...position);
            this._data_threejs.selectEdgeByFace(parent_ent_id, ent_id, indices, posi_flat, this.container);
            this.dataService.selected_ents.get(ent_type_str).set(ent_id, edge);
        });
        this.dataService.selected_face_edges.set(`${parent_ent_id}`, children);
    }


    private selectWire(line: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.EDGE],
            wire = this.model.geom.query.navEdgeToWire(line.index / 2),
            edges = this.model.geom.query.navWireToEdge(wire),
            verts = edges.map(e => this.model.geom.query.navEdgeToVert(e)),
            verts_flat = [].concat(...[].concat(...verts)),
            indices = [],
            positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions),
            ent_id = `${ent_type_str}${wire}`;
        this._data_threejs.selectObjLine(ent_id, indices, posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, wire);
    }

    private selectFace(object: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.FACE],
            face = this.model.geom.query.navTriToFace(object.faceIndex),
            tri = this.model.geom.query.navFaceToTri(face),
            verts = tri.map(index => this.model.geom.query.navTriToVert(index)),
            verts_flat = [].concat(...verts),
            posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v)),
            posis_flat = [].concat(...posis),
            tri_indices = [],
            positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions),
            ent_id = `${ent_type_str}${face}`;
        this._data_threejs.selectObjFace(ent_id, tri_indices, posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, face);
    }

    private selectPoint(point: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.POINT];

        const result = this.getPointPosis(point.index);
        const point_indices = result.point_indices;
        const point_posi = result.posi_flat;
        const ent_id = `${ent_type_str}${point.index}`;
        this._data_threejs.selectObjPoint(ent_id, point_indices, point_posi, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, point.index);
    }

    private selectPLine(line: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.PLINE],
            wire = this.model.geom.query.navEdgeToWire(line.index / 2);
        const result = this.getPLinePosis(wire);
        if (result) {
            const posi_flat = result.posi_flat;
            const indices = result.indices;
            const ent_id = `${ent_type_str}${wire}`;
            this._data_threejs.selectObjLine(ent_id, indices, posi_flat, this.container);
            this.dataService.selected_ents.get(ent_type_str).set(ent_id, wire);
        } else {
            this.showMessages('Please Select a Polyline', false, 'custom');
        }
    }

    private selectPGon(triangle: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.PGON];
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const result = this.getPGonPosis(face);
        const posi_flat = result.posi_flat;
        const tri_indices = result.indices;

        const ent_id = `${ent_type_str}${face}`;
        this._data_threejs.selectObjFace(ent_id, tri_indices, posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, face);
    }

    /**
     * get point positions for collections
     * @param points
     */

    private getPointPosis(point1: number = null, points: number[] = null) {
        let verts_flat: number[] = null;
        if (point1 !== null) {
            verts_flat = [this.model.geom.query.navPointToVert(point1)];
        }
        if (points !== null) {
            const verts = points.map(p => this.model.geom.query.navPointToVert(p));
            verts_flat = [].concat(...verts);
        }

        const point_indices: number[] = [];
        const positions: Txyz[] = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getPosiCoords(v));
            point_indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const result = { posi_flat, point_indices };
        return result;
    }

    /**
     * get pline positions for selectPLine or collections
     * @param wire1
     * @param plines
     */

    private getPLinePosis(wire1: number = null, plines: number[] = null) {
        let wires_flat: number[] = null;
        if (wire1 !== null) {
            const _pline = this.model.geom.query.navWireToPline(wire1);
            if (_pline === undefined) {
                return null;
            }
            wires_flat = [this.model.geom.query.navPlineToWire(_pline)];
        }
        if (plines !== null) {
            const wires = plines.map(pl => this.model.geom.query.navPlineToWire(pl));
            wires_flat = [].concat(...wires);
        }

        const edges = wires_flat.map(w => this.model.geom.query.navWireToEdge(w));
        const edges_flat = [].concat(...edges);
        const verts = edges_flat.map(e => this.model.geom.query.navEdgeToVert(e));
        const verts_flat = [].concat(...[].concat(...verts));
        const indices = [];
        const positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const result = { posi_flat, indices };
        return result;
    }

    /**
     * get pgon positions for selectPGon or collections
     * @param face1
     * @param pgons
     */

    private getPGonPosis(face1: number = null, pgons: number[] = null) {
        let faces_flat: number[] = null;
        if (face1 !== null) {
            const _pgon = this.model.geom.query.navFaceToPgon(face1);
            if (_pgon === undefined) {
                return null;
            }
            faces_flat = [this.model.geom.query.navPgonToFace(_pgon)];
        }
        if (pgons !== null) {
            const faces = pgons.map(pgon => this.model.geom.query.navPgonToFace(pgon));
            faces_flat = [].concat(...faces);
        }
        const tris = faces_flat.map(face => this.model.geom.query.navFaceToTri(face));
        const tris_flat = [].concat(...tris);
        const verts = tris_flat.map(tri => this.model.geom.query.navTriToVert(tri));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v));
        const posis_flat = [].concat(...posis);
        const indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            indices.push(index);
        });
        const posi_flat = [].concat(...positions);
        const result = { posi_flat, indices };
        return result;
    }

    private selectColl(object: THREE.Intersection, type) {
        let colls = [];
        if (type === 'Mesh') {
            colls = this.model.geom.query.navAnyToAny(EEntType.TRI, EEntType.COLL, object.faceIndex);
        } else if (type === 'LineSegments') {
            colls = this.model.geom.query.navAnyToAny(EEntType.EDGE, EEntType.COLL, object.index / 2);
        } else if (type === 'Points') {
            const vert = this.model.geom.query.navVertToPoint(object.index);
            colls = this.model.geom.query.navAnyToAny(EEntType.POINT, EEntType.COLL, vert);
        }
        /**
         * Show dropdown menu only when Entity belongs to more than 1 Collection.
         */
        if (this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).size === 0 && colls.length > 1) {
            this.dropdown.setItems(colls, 'co');
            this.dropdown.visible = true;
            this.dropdown.position = this.dropdownPosition;
        } else if (colls.length === 1) {
            this.chooseColl(colls[0]);
        } else {
            this.showMessages('No Collections Available', true, 'custom');
        }
    }

    private chooseColl(id: number) {
        const scene = this._data_threejs;
        const pgons = this.model.geom.query.navCollToPgon(id);
        const pgons_flat = [].concat(...pgons);
        const pgonResult = this.getPGonPosis(null, pgons_flat);
        const pgons_posi = pgonResult.posi_flat;
        const pgons_indices = pgonResult.indices;

        const coll_id = `${EEntTypeStr[EEntType.COLL]}${id}`;
        if (pgons_indices.length !== 0) {
            const attrib_val = this.model.attribs.query.getAttribValue(EEntType.COLL, EAttribNames.NAME, id);
            // const selecting = attrib_val ? attrib_val.toString() : `${EEntType.COLL}${id}`;
            const pgon_id = `${EEntTypeStr[EEntType.COLL]}_pg_${id}`;
            scene.selectObjFace(pgon_id, pgons_indices, pgons_posi, this.container, false);
        }

        const plines = this.model.geom.query.navCollToPline(id);
        const plines_flat = [].concat(...plines);
        const plineResult = this.getPLinePosis(null, plines_flat);
        const plines_posi = plineResult.posi_flat;
        const plines_indices = plineResult.indices;
        if (plines_indices.length !== 0) {
            const pline_id = `${EEntTypeStr[EEntType.COLL]}_pl_${id}`;
            scene.selectObjLine(pline_id, plines_indices, plines_posi, this.container, false);
        }

        const points = this.model.geom.query.navCollToPoint(id);
        const points_flat = [].concat(...points);
        const pointResult = this.getPointPosis(null, points_flat);
        const point_posi = pointResult.posi_flat;
        const point_indices = pointResult.point_indices;
        if (point_indices.length !== 0) {
            const point_id = `${EEntTypeStr[EEntType.COLL]}_pt_${id}`;
            scene.selectObjPoint(point_id, point_indices, point_posi, this.container, false);
        }

        this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).set(coll_id, id);
        this.refreshTable(null);
        this.render(this);
    }

    public zoomfit() {
        this._data_threejs.lookAtObj(this._width);
    }

    private selectEntityType(selection: { id: string, name: string }) {
        this.SelectingEntityType = selection;
        localStorage.setItem('mpm_selecting_entity_type', JSON.stringify(selection));
        this.selectDropdownVisible = false;
    }

    private selectEntity(id: number) {
        this.chooseColl(id);
    }
}
