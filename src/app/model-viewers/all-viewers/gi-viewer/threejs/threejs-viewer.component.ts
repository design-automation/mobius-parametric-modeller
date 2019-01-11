import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, OnInit, Input, Output, EventEmitter,
    Injector, ElementRef, DoCheck, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataThreejs } from '../data/data.threejs';
// import { IModel } from 'gs-json';
import { DataService } from '../data/data.service';
import { EEntType, EAttribNames, EEntTypeStr } from '@libs/geo-info/common';
import { DropdownMenuComponent } from '../html/dropdown-menu.component';
import { ModalService } from '../html/modal-window.service';

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
    constructor(injector: Injector, elem: ElementRef) {
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

    private initRaycaster(event) {
        const scene = this._data_threejs;
        scene._mouse.x = (event.offsetX / scene._renderer.domElement.clientWidth) * 2 - 1;
        scene._mouse.y = - (event.offsetY / scene._renderer.domElement.clientHeight) * 2 + 1;
        scene._raycaster.setFromCamera(scene._mouse, scene._camera);
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }

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
        if (event.target.tagName !== 'CANVAS') {
            const tags = document.getElementsByTagName('body');
            for (let index = 0; index < tags.length; index++) {
                tags[index].style.cursor = 'default';
            }
            return null;
        } else {
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
        // check mouse is in THREE viewer, to enable dropdown menu
        // if (event.target.tagName === 'CANVAS' && intersects.length > 0) {
        //     const pos_x = event.clientX - event.target.getBoundingClientRect().left;
        //     const pos_y = event.clientY - event.target.getBoundingClientRect().top;
        //     this.dropdownPosition = { x: pos_x, y: pos_y };
        // } else if (event.target.tagName !== 'OL') {
        //     // not clicking on Menu item, hide dropdown menu
        //     this.dropdown.visible = false;
        //     return;
        // }

        // get entities for mouse event
        const intersects = this.initRaycaster(event);

        // check intersect exist
        if (intersects.length > 0) {
            if (event.which === 1) {
                this.selectObj(intersects[0]);
                this.refreshTable(event);
            }
        } else {
            if (event.target.tagName === 'CANVAS') {
                this.unselectAll();
            }
        }
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
        this.render(this);
        this.dataService.selected_ents.forEach(map => {
            map.clear();
        });
    }


    private selectObj(intersect0: THREE.Intersection) {
        // console.log('interecting object', intersect);
        const scene = this._data_threejs;
        switch (this.SelectingEntityType.id) {
            case EEntTypeStr[EEntType.POSI]:
                if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const ent_id = `${EEntTypeStr[EEntType.POSI]}${face}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0);
                    }
                } else if (intersect0.object.type === 'LineSegments') {
                    const ent_id = `${EEntTypeStr[EEntType.POSI]}${intersect0.index / 2}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0);
                    }
                } else if (intersect0.object.type === 'Points') {
                    const ent_id = `${EEntTypeStr[EEntType.POSI]}${intersect0.index}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(intersect0);
                    }
                }
                break;
            case EEntTypeStr[EEntType.VERT]:
                this.selectVertex(intersect0);
                break;
            case EEntTypeStr[EEntType.COLL]:
                if (intersect0.object.type === 'Mesh') {
                    this.selectColl(intersect0, 'Mesh');
                } else if (intersect0.object.type === 'LineSegments') {
                    this.selectColl(intersect0, 'LineSegments');
                } else if (intersect0.object.type === 'Points') {
                    this.selectColl(intersect0, 'Points');
                }
                break;
            case EEntTypeStr[EEntType.FACE]:
                if (intersect0.object.type === 'Mesh') {
                    const face = this.model.geom.query.navTriToFace(intersect0.faceIndex);
                    const selecting = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_geoms.has(selecting)) {
                        this.unselectGeom(selecting, EEntTypeStr[EEntType.FACE]);
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
                    const selecting = `${EEntTypeStr[EEntType.PGON]}${pgon}`;
                    if (scene.selected_geoms.has(selecting)) {
                        this.unselectGeom(selecting, EEntTypeStr[EEntType.PGON]);
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
                } else {
                    this.showMessages('Edges', true);
                }
                break;
            case EEntTypeStr[EEntType.WIRE]:
                if (intersect0.object.type === 'LineSegments') {
                    const wire = this.model.geom.query.navEdgeToWire(intersect0.index / 2);
                    const ent_id = `${EEntTypeStr[EEntType.EDGE]}${wire}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.EDGE]);
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

    private selectPositions(object: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.POSI];
        const scene = this._data_threejs;
        if (object.object.type === 'Points') {
            const vert = this.model.geom.query.navPointToVert(object.index);
            const position = this.model.attribs.query.getPosiCoords(vert);
            const posi_ents = this.model.geom.query.navVertToPosi(vert);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const ent_id = `${ent_type_str}${object.index}`;
            scene.selectObjPositions(ent_id, position);
            posi_ent.set(`${ent_type_str}${posi_ents}`, posi_ents);
        } else if (object.object.type === 'LineSegments') {
            const verts = this.model.geom.query.navEdgeToVert(object.index / 2),
                positions = verts.map(v => this.model.attribs.query.getVertCoords(v)),
                posi_flat = [].concat(...positions),
                posi_ents = verts.map(v => this.model.geom.query.navVertToPosi(v));

            const ent_id = `${ent_type_str}${object.index / 2}`;
            scene.selectObjPositions(ent_id, posi_flat);
            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            posi_ents.map(posi => posi_ent.set(`${ent_type_str}${posi}`, posi));
        } else if (object.object.type === 'Mesh') {
            const face = this.model.geom.query.navTriToFace(object.faceIndex),
                tri = this.model.geom.query.navFaceToTri(face),
                verts = tri.map(index => this.model.geom.query.navTriToVert(index)),
                verts_flat = [].concat(...verts),
                posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v)),
                posis_flat = [].concat(...posis);

            const posi_ents = verts_flat.map(v => this.model.geom.query.navVertToPosi(v));

            const tri_indices = [], positions = [];
            posis_flat.map((posi, index) => {
                positions.push(this.model.attribs.query.getPosiCoords(posi));
                tri_indices.push(index);
            });
            const posi_flat = [].concat(...positions);

            const ent_id = `${ent_type_str}${object.faceIndex}`;
            scene.selectObjPositions(ent_id, posi_flat);
            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            posi_ents.map(posi => posi_ent.set(`${ent_type_str}${posi}`, posi));
        }
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
                scene.selectObjPoint(selecting, position, this.container);
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
        scene.unselectObj(ent_id, this.container);
        this.dataService.selected_ents.get(ent_type_str).delete(ent_id);
    }

    private selectPoint(point: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.POINT],
            vert = this.model.geom.query.navPointToVert(point.index),
            position = this.model.attribs.query.getPosiCoords(vert),
            ent_id = `${ent_type_str}${point.index}`;
        this._data_threejs.selectObjPoint(ent_id, position, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, point.index);
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

    private selectPLine(line: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.PLINE],
            wire = this.model.geom.query.navEdgeToWire(line.index / 2),
            pline = this.model.geom.query.navWireToPline(wire);
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
        const ent_id = `${ent_type_str}${wire}`;
        this._data_threejs.selectObjLine(ent_id, indices, posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, wire);
    }

    private selectPGon(triangle: THREE.Intersection) {
        const ent_type_str = EEntTypeStr[EEntType.PGON];
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const pgon = this.model.geom.query.navFaceToPgon(face);
        if (pgon === undefined) {
            return null;
        }
        const face1 = this.model.geom.query.navPgonToFace(pgon);
        const tri = this.model.geom.query.navFaceToTri(face1);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);

        const ent_id = `${ent_type_str}${face}`;
        this._data_threejs.selectObjFace(ent_id, tri_indices, posi_flat, this.container);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, face);
    }

    private selectColl(object: THREE.Intersection, type) {
        if (type === 'Mesh') {
            const colls = this.model.geom.query.navAnyToAny(EEntType.TRI, EEntType.COLL, object.faceIndex);
            /**
             * Show dropdown menu only when Entity belongs to more than 1 Collection.
             */
            if (this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).size === 0 && colls.length > 1) {

                this.dropdown.setItems(colls, 'co');
                this.dropdown.visible = true;
                this.dropdown.position = this.dropdownPosition;
            } else {
                this.chooseColl(colls[0]);
            }
        } else if (type === 'LineSegments') {
            // console.log('selectColl');
            // const wire = this.model.geom.query.navEdgeToWire(object.index / 2);
            // console.log(wire);
            // const coll = this.model.geom.query.navAnyToColl(EEntTypeStr[EEntType.EDGE], wire);
            // console.log(coll);
        }
    }

    private chooseColl(id: number) {
        const scene = this._data_threejs;
        const pgons = this.model.geom.query.navCollToPgon(id);
        const pgons_flat = [].concat(...pgons);
        const faces = pgons_flat.map(pgon => this.model.geom.query.navPgonToFace(pgon));
        const faces_flat = [].concat(...faces);
        const tris = faces_flat.map(face => this.model.geom.query.navFaceToTri(face));
        const tris_flat = [].concat(...tris);
        const verts = tris_flat.map(tri => this.model.geom.query.navTriToVert(tri));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntType.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);
        const attrib_val = this.model.attribs.query.getAttribValue(EEntType.COLL, EAttribNames.NAME, id);
        // const selecting = attrib_val ? attrib_val.toString() : `${EEntType.COLL}${id}`;
        const selecting = `${EEntTypeStr[EEntType.COLL]}${id}`;
        if (!scene.selected_geoms.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).set(selecting, id);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).delete(selecting);
        }
        this.render(this);
    }

    public zoomfit() {
        this._data_threejs.lookAtObj(this._width);
    }

    private selectEntityType(selection: { id: string, name: string }) {
        this.SelectingEntityType = selection;
        this.selectDropdownVisible = false;
    }

    private selectEntity(id: number) {
        this.chooseColl(id);
    }
}
