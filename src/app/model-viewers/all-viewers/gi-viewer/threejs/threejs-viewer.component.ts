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
import { sortByKey } from '@libs/util/maps';
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
    @Output() resetTableEvent = new EventEmitter<number>();
    @Input() model: GIModel;
    @Input() attr_table_select: { action: string, ent_type: string, id: number };
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
    private mouse_label;
    private giSummary = [];
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
        this.mouse_label = document.getElementById('mouse_label');
        this.dropdown.items = [];
        this.dropdown.visible = false;
        this.dropdown.position = { x: 0, y: 0 };
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
                this._data_threejs.createLabelforObj(this.container, obj.entity, obj.type, obj.text, label);
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
        if (changes['attr_table_select']) {
            if (this.attr_table_select) {
                this.attrTableSelect(this.attr_table_select);
            }
        }
    }

    attrTableSelect(attrib: { action: string, ent_type: string, id: number }) {
        if (attrib.action === 'select') {
            switch (attrib.ent_type) {
                case EEntTypeStr[EEntType.POSI]:
                    this.selectPositions(attrib.id, null, null, attrib.ent_type + attrib.id);
                    break;
                case EEntTypeStr[EEntType.VERT]:
                    this.selectVertex(attrib.id, null, null, attrib.ent_type + attrib.id);
                    break;
                case EEntTypeStr[EEntType.EDGE]:
                    this.selectEdge(attrib.id);
                    break;
                case EEntTypeStr[EEntType.WIRE]:
                    this.selectWire(attrib.id);
                    break;
                case EEntTypeStr[EEntType.FACE]:
                    this.selectFace(attrib.id);
                    break;
                case EEntTypeStr[EEntType.PGON]:
                    this.selectPGon(attrib.id);
                    break;
                case EEntTypeStr[EEntType.PLINE]:
                    this.selectPLine(attrib.id);
                    break;
                case EEntTypeStr[EEntType.POINT]:
                    this.selectPoint(attrib.id);
                    break;
                case EEntTypeStr[EEntType.COLL]:
                    this.chooseColl(attrib.id);
                    break;
                default:
                    break;
            }
        } else if (attrib.action === 'unselect') {
            if (attrib.ent_type === EEntTypeStr[EEntType.COLL]) {
                const coll_children = this.dataService.selected_coll.get(attrib.ent_type + attrib.id);
                if (coll_children && coll_children.length) {
                    coll_children.forEach(child => {
                        this.unselectGeom(child, attrib.ent_type, true);
                    });
                    this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).delete(attrib.ent_type + attrib.id);
                }
            } else {
                this.unselectGeom(attrib.ent_type + attrib.id, attrib.ent_type, true);
            }
        }
        this.render(this);
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
                    // to be completed and test
                    // this._data_threejs.disposeWebGL();
                    // add geometry to the scene
                    this._data_threejs.addGeometry(model, this.container);
                    this.resetTable();
                    if (localStorage.getItem('gi_summary')) {
                        this.giSummary = JSON.parse(localStorage.getItem('gi_summary'));
                    }
                    this._model_error = false;
                    this._no_model = false;

                    // Show Flowchart Selected Entities
                    const selected = this.model.geom.selected;
                    if (selected.length) {
                        selected.forEach(s => {
                            const type = EEntTypeStr[s[0]], id = Number(s[1]);
                            this.attrTableSelect({action: 'select', ent_type: type, id: id});
                            this.dataService.selected_ents.get(type).set(`${type}${id}`, id);
                        });
                    }
                    sessionStorage.setItem('mpm_showSelected', JSON.stringify(true));

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

    onMouseUp(event) {
        if (event.target.tagName !== 'CANVAS') {
            return null;
        } else {
            if (this.dragHash < 10) {
                this.onUserAction(event);
            } else {
                // this._data_threejs._controls.enabled = true;
            }
            this.isDown = false;
        }
    }

    public onMouseMove(event) {
        const body = document.getElementsByTagName('body');

        if (event.target.tagName !== 'CANVAS') {
            body[0].style.cursor = 'default';
            // if (this.mouse_label !== null) {
            //     this.mouse_label.style.display = 'none';
            // }
            return null;
        } else {
            const intersects = this.threeJSViewerService.initRaycaster(event);
            if (intersects && intersects.length > 0) {
                body[0].style.cursor = 'pointer';
                // if (this.mouse_label !== null) {
                //     const x = event.clientX, y = event.clientY;
                //     this.mouse_label.style.top = y + 'px';
                //     this.mouse_label.style.left = (x + 15) + 'px';
                //     this.mouse_label.style.display = 'block';
                //     this.mouse_label.innerHTML = mouseLabel[intersects[0].object.type];
                // }
            } else {
                body[0].style.cursor = 'default';
                // if (this.mouse_label !== null) {
                //     this.mouse_label.style.display = 'none';
                // }
            }

            if (!this.isDown) { return; }

            // Put your mousemove stuff here
            const mouseX = event.clientX - event.target.getBoundingClientRect().left;
            const mouseY = event.clientY - event.target.getBoundingClientRect().top;
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

    onMouseDown(event) {
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

    onKeyDown(event) {
        const scene = this._data_threejs;
        // keyboard control for camera
        scene.onWindowKeyPress(event);
        if (event.shiftKey) {
            this.shiftKeyPressed = true;
        }
        this.render(this);
    }

    onKeyUp(event) {
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

    private resetTable() {
        this.resetTableEvent.emit();
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

        const vertex = Array.from(scene.selected_vertex.keys());
        for (const vert of vertex) {
            scene.unselectObjGroup(vert, this.container, 'vertex');
        }

        const edges = Array.from(scene.selected_face_edges.keys());
        for (const edge of edges) {
            scene.unselectObjGroup(edge, this.container, 'face_edges');
        }

        const wires = Array.from(scene.selected_face_wires.keys());
        for (const wire of wires) {
            scene.unselectObjGroup(wire, this.container, 'face_wires');
        }

        this.render(this);
    }

    private getSelectingEntityType() {
        if (localStorage.getItem('mpm_selecting_entity_type') != null) {
            this.SelectingEntityType = JSON.parse(localStorage.getItem('mpm_selecting_entity_type'));
        }
    }

    private selectObj(intersect0: THREE.Intersection) {
        const scene = this._data_threejs;
        this.getSelectingEntityType();
        switch (this.SelectingEntityType.id) {
            case EEntTypeStr[EEntType.POSI]:
                if (intersect0.object.type === 'Points') {
                    const posi = scene.posis_map.get(intersect0.index);
                    const ent_id = `${EEntTypeStr[EEntType.POSI]}${posi}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(posi, null, null, ent_id);
                    }
                } else if (intersect0.object.type === 'LineSegments') {
                    const edge = scene.edge_select_map.get(intersect0.index / 2);
                    const ent_id = `_e_posi${edge}`;
                    if (scene.selected_positions.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(null, edge, null, ent_id);
                    }
                } else if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const ent_id = `_f_posi${face}`;
                    if (scene.selected_positions.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POSI]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPositions(null, null, face, ent_id);
                    }
                }
                break;
            case EEntTypeStr[EEntType.VERT]:
                if (intersect0.object.type === 'Points') {
                    const vert = scene.vertex_map.get(intersect0.index);
                    const verts = this.model.geom.query.navPosiToVert(intersect0.index);
                    let point: number;
                    if (verts.length > 1) {
                        this.dropdown.setItems(verts, EEntTypeStr[EEntType.VERT]);
                        this.dropdown.visible = true;
                        this.dropdown.position = this.dropdownPosition;
                    } else {
                        point = vert;
                    }
                    const ent_id = `${EEntTypeStr[EEntType.VERT]}${point}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.VERT], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectVertex(point, null, null, ent_id);
                    }
                } else if (intersect0.object.type === 'LineSegments') {
                    const edge = scene.edge_select_map.get(intersect0.index / 2);
                    const ent_id = `_e_v${edge}`;
                    if (scene.selected_vertex.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.VERT]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectVertex(null, edge, null, ent_id);
                    }
                } else if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const ent_id = `_f_v${face}`;
                    if (scene.selected_vertex.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.VERT]);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectVertex(null, null, face, ent_id);
                    }
                }
                break;
            case EEntTypeStr[EEntType.COLL]:
                if (!this.shiftKeyPressed) {
                    this.unselectAll();
                }
                this.selectColl(intersect0, intersect0.object.type);
                break;
            case EEntTypeStr[EEntType.FACE]:
                if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const ent_id = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.FACE], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectFace(face);
                    }
                } else {
                    this.showMessages('Faces', true);
                }
                break;
            case EEntTypeStr[EEntType.PGON]:
                if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const pgon = this.model.geom.query.navFaceToPgon(face);
                    const ent_id = `${EEntTypeStr[EEntType.PGON]}${pgon}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.PGON], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectPGon(face);
                    }
                } else {
                    this.showMessages('Polygons', true);
                }
                break;
            case EEntTypeStr[EEntType.EDGE]:
                if (intersect0.object.type === 'LineSegments') {
                    const edge = scene.edge_select_map.get(intersect0.index / 2);
                    const ent_id = `${EEntTypeStr[EEntType.EDGE]}${edge}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.EDGE], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectEdge(edge);
                    }
                } else if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const ent_id = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_face_edges.has(ent_id)) {
                        this.unselectGeom(ent_id, 'face_edges');
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectEdgeByFace(face, ent_id);
                    }
                } else {
                    this.showMessages('Edges', true);
                }
                break;
            case EEntTypeStr[EEntType.WIRE]:
                if (intersect0.object.type === 'LineSegments') {
                    const edge = scene.edge_select_map.get(intersect0.index / 2),
                        wire = this.model.geom.query.navEdgeToWire(edge);
                    const ent_id = `${EEntTypeStr[EEntType.WIRE]}${edge}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.WIRE], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectWire(wire);
                    }
                } else if (intersect0.object.type === 'Mesh') {
                    const tri = scene.tri_select_map.get(intersect0.faceIndex);
                    const face = this.model.geom.query.navTriToFace(tri);
                    const ent_id = `${EEntTypeStr[EEntType.FACE]}${face}`;
                    if (scene.selected_face_wires.has(ent_id)) {
                        this.unselectGeom(ent_id, 'face_wires');
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        this.selectWireByFace(face, ent_id);
                    }
                } else {
                    this.showMessages('Wires', true);
                }
                break;
            case EEntTypeStr[EEntType.PLINE]:
                if (intersect0.object.type === 'LineSegments') {
                    const edge = scene.edge_select_map.get(intersect0.index / 2);
                    const wire = this.model.geom.query.navEdgeToWire(edge);
                    const pline = this.model.geom.query.navWireToPline(wire);
                    const ent_id = `${EEntTypeStr[EEntType.PLINE]}${pline}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.PLINE], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        if (pline) {
                            this.selectPLine(pline);
                        } else {
                            this.showMessages('Selection is not a Polyline', false, 'custom');
                        }
                    }
                } else {
                    this.showMessages('Polylines', true);
                }
                break;
            case EEntTypeStr[EEntType.POINT]:
                if (intersect0.object.type === 'Points') {
                    const vert = this.model.geom.query.navPosiToVert(intersect0.index);
                    const _point = this.model.geom.query.navVertToPoint(vert[0]);
                    const point = scene.point_select_map.get(_point);
                    const ent_id = `${EEntTypeStr[EEntType.POINT]}${point}`;
                    if (scene.selected_geoms.has(ent_id)) {
                        this.unselectGeom(ent_id, EEntTypeStr[EEntType.POINT], true);
                    } else {
                        if (!this.shiftKeyPressed) {
                            this.unselectAll();
                        }
                        if (point) {
                            this.selectPoint(point);
                        } else {
                            this.showMessages('Selection is not a Point', false, 'custom');
                        }
                    }
                } else {
                    this.showMessages('Points', true);
                }
                break;
            default:
                this.showMessages('Please choose an Entity type.', true, 'custom');
                break;
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

    private selectPositions(point: number = null, edge: number = null, face: number = null, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.POSI];
        const scene = this._data_threejs;
        const posi_ent = this.dataService.selected_ents.get(ent_type_str);
        if (point !== null) {
            const position = this.model.attribs.query.getPosiCoords(point);
            const ent_id = parent_ent_id;
            const labelText = this.indexAsLabel(ent_type_str, ent_id, point, EEntType.POSI);
            scene.selectObjPosition(null, ent_id, position, this.container, labelText);
            posi_ent.set(ent_id, point);
            this.dataService.selected_positions.set(`${parent_ent_id}`, [ent_id]);
        } else if (edge !== null) {
            const verts = this.model.geom.query.navEdgeToVert(edge);
            const posis = verts.map(v => this.model.geom.query.navVertToPosi(v));
            const children = [];
            posis.map(posi => {
                const ent_id = `${ent_type_str}${posi}`;
                const position = this.model.attribs.query.getPosiCoords(posi);
                const labelText = this.indexAsLabel(ent_type_str, ent_id, posi, EEntType.POSI);
                scene.selectObjPosition(parent_ent_id, ent_id, position, this.container, labelText);
                posi_ent.set(ent_id, posi);
                children.push(ent_id);
            });
            this.dataService.selected_positions.set(`${parent_ent_id}`, children);
        } else if (face !== null) {
            const tris = this.model.geom.query.navFaceToTri(face),
                posis = tris.map(tri => this.model.geom.query.navAnyToPosi(EEntType.TRI, tri)),
                posi_flat = [].concat(...posis);

            const uniqPositions = this.uniq(posi_flat);
            const children = [];
            uniqPositions.map(posi => {
                const ent_id = `${ent_type_str}${posi}`;
                const position = this.model.attribs.query.getPosiCoords(posi);
                const labelText = this.indexAsLabel(ent_type_str, ent_id, posi, EEntType.POSI);
                scene.selectObjPosition(parent_ent_id, ent_id, position, this.container, labelText);
                posi_ent.set(ent_id, posi);
                children.push(ent_id);
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

    private selectVertex(point: number = null, edge: number = null, face: number = null, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.VERT];
        const posi_ent = this.dataService.selected_ents.get(ent_type_str);
        const scene = this._data_threejs;
        if (point !== null) {
            const position = this.model.attribs.query.getVertCoords(point);
            const ent_id = parent_ent_id;
            const labelText = this.indexAsLabel(ent_type_str, ent_id, point, EEntType.POSI);
            scene.selectObjVetex(null, ent_id, position, this.container, labelText);
            posi_ent.set(ent_id, point);
            this.dataService.selected_vertex.set(`${parent_ent_id}`, [ent_id]);
        } else if (edge !== null) {
            const verts = this.model.geom.query.navEdgeToVert(edge);
            const children = [];
            verts.map(vert => {
                const ent_id = `${ent_type_str}${vert}`;
                const position = this.model.attribs.query.getVertCoords(vert);
                const labelText = this.indexAsLabel(ent_type_str, ent_id, vert, EEntType.VERT);
                scene.selectObjVetex(parent_ent_id, ent_id, position, this.container, labelText);
                posi_ent.set(ent_id, vert);
                children.push(ent_id);
            });
            this.dataService.selected_vertex.set(`${parent_ent_id}`, children);

        } else if (face !== null) {
            const tris = this.model.geom.query.navFaceToTri(face),
                verts = tris.map(tri => this.model.geom.query.navTriToVert(tri)),
                verts_flat = [].concat(...verts);

            const uniqVerts = this.uniq(verts_flat);
            const children = [];
            uniqVerts.map(vert => {
                const ent_id = `${ent_type_str}${vert}`;
                const position = this.model.attribs.query.getVertCoords(vert);
                const labelText = this.indexAsLabel(ent_type_str, ent_id, vert, EEntType.VERT);
                scene.selectObjVetex(parent_ent_id, ent_id, position, this.container, labelText);
                posi_ent.set(ent_id, vert);
                children.push(ent_id);
            });
            this.dataService.selected_vertex.set(`${parent_ent_id}`, children);
        }
    }

    private unselectGeom(ent_id: string, ent_type_str: string, direct = false) {
        const scene = this._data_threejs;
        if (!direct) {
            if (ent_type_str === EEntTypeStr[EEntType.POSI]) {
                scene.unselectObjGroup(ent_id, this.container, 'positions');
                const children = this.dataService.selected_positions.get(ent_id);
                children.forEach(c => {
                    this.dataService.selected_ents.get(EEntTypeStr[EEntType.POSI]).delete(c);
                });
                this.dataService.selected_positions.delete(ent_id);

            } else if (ent_type_str === EEntTypeStr[EEntType.VERT]) {
                scene.unselectObjGroup(ent_id, this.container, 'vertex');
                const children = this.dataService.selected_vertex.get(ent_id);
                children.forEach(c => {
                    this.dataService.selected_ents.get(EEntTypeStr[EEntType.VERT]).delete(c);
                });
                this.dataService.selected_vertex.delete(ent_id);

            } else if (ent_type_str === 'face_edges') {
                scene.unselectObjGroup(ent_id, this.container, 'face_edges');
                const children = this.dataService.selected_face_edges.get(ent_id);
                children.forEach(c => {
                    this.dataService.selected_ents.get(EEntTypeStr[EEntType.EDGE]).delete(c);
                });
                this.dataService.selected_face_edges.delete(ent_id);

            } else if (ent_type_str === 'face_wires') {
                scene.unselectObjGroup(ent_id, this.container, 'face_wires');
                const children = this.dataService.selected_face_wires.get(ent_id);
                children.forEach(c => {
                    this.dataService.selected_ents.get(EEntTypeStr[EEntType.WIRE]).delete(c);
                });
                this.dataService.selected_face_wires.delete(ent_id);
            }
        } else {
            scene.unselectObj(ent_id, this.container);
            this.dataService.selected_ents.get(ent_type_str).delete(ent_id);
        }
        this.render(this);
        this.refreshTable(event);
    }

    private selectEdge(line: number) {
        const ent_type_str = EEntTypeStr[EEntType.EDGE],
            verts = this.model.geom.query.navEdgeToVert(line),
            positions = verts.map(v => this.model.attribs.query.getVertCoords(v)),
            posi_flat = [].concat(...positions),
            ent_id = `${ent_type_str}${line}`;
        const labelText = this.indexAsLabel(ent_type_str, ent_id, line, EEntType.EDGE);
        this._data_threejs.selectObjLine(ent_id, [], posi_flat, this.container, labelText);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, line);
    }

    private selectEdgeByFace(face: number, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.EDGE],
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
            const labelText = this.indexAsLabel(ent_type_str, ent_id, edge, EEntType.EDGE);
            this._data_threejs.selectEdgeByFace(parent_ent_id, ent_id, indices, posi_flat, this.container, labelText);
            this.dataService.selected_ents.get(ent_type_str).set(ent_id, edge);
        });
        this.dataService.selected_face_edges.set(`${parent_ent_id}`, children);
    }

    private selectWire(wire: number) {
        const ent_type_str = EEntTypeStr[EEntType.WIRE],
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
        const labelText = this.indexAsLabel(ent_type_str, ent_id, wire, EEntType.WIRE);
        this._data_threejs.selectObjLine(ent_id, indices, posi_flat, this.container, labelText);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, wire);
    }

    private selectWireByFace(face: number, parent_ent_id: string) {
        const ent_type_str = EEntTypeStr[EEntType.WIRE],
            wires = this.model.geom.query.navFaceToWire(face);
        const children = [];
        wires.map(wire => {
            const ent_id = `${ent_type_str}${wire}`;
            children.push(ent_id);
            const edges = this.model.geom.query.navWireToEdge(wire),
                verts = edges.map(e => this.model.geom.query.navEdgeToVert(e));
            // @ts-ignore
            const verts_flat = verts.flat(1),
                indices = [],
                positions = [];
            verts_flat.map((v, i) => {
                positions.push(this.model.attribs.query.getVertCoords(v));
                indices.push(i);
            });
            const posi_flat = [].concat(...positions);
            const labelText = this.indexAsLabel(ent_type_str, ent_id, wire, EEntType.WIRE);
            this._data_threejs.selectWireByFace(parent_ent_id, ent_id, indices, posi_flat, this.container, labelText);
            this.dataService.selected_ents.get(ent_type_str).set(ent_id, wire);
        });
        this.dataService.selected_face_wires.set(`${parent_ent_id}`, children);
    }

    private selectFace(face: number) {
        const ent_type_str = EEntTypeStr[EEntType.FACE],
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

        const labelText = this.indexAsLabel(ent_type_str, ent_id, face, EEntType.FACE);
        this._data_threejs.selectObjFace(ent_id, tri_indices, posi_flat, this.container, labelText);
    }

    private indexAsLabel(ent_type_str: string, ent_id: string, id: number, type: EEntType) {
        let indexAsLabel;
        const showSelected = JSON.parse(sessionStorage.getItem('mpm_showSelected'));
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, id);
        if (showSelected) {
            const selected_ents = this.dataService.selected_ents.get(ent_type_str);
            const selected_ents_sorted = sortByKey(selected_ents);
            const arr = [];
            selected_ents_sorted.forEach(ent => {
                arr.push(ent);
            });
            indexAsLabel = String(arr.findIndex(ent => ent === id));
            sessionStorage.setItem('mpm_selected_ents_arr', JSON.stringify(arr));
        } else {
            indexAsLabel = String(this._data_threejs._model.attribs.threejs.getIdIndex(type, id));
        }
        return indexAsLabel;
    }

    private selectPoint(point: number) {
        const ent_type_str = EEntTypeStr[EEntType.POINT];
        const result = this.getPointPosis(point, null);
        const point_indices = result.point_indices;
        const point_posi = result.posi_flat;
        const ent_id = `${ent_type_str}${point}`;
        const labelText = this.indexAsLabel(ent_type_str, ent_id, point, EEntType.POINT);
        this._data_threejs.selectObjPoint(ent_id, point_indices, point_posi, this.container, labelText);
        this.dataService.selected_ents.get(ent_type_str).set(ent_id, point);
    }

    private selectPLine(pline: number) {
        const ent_type_str = EEntTypeStr[EEntType.PLINE];
        const result = this.getPLinePosis(pline);
        const ent_id = `${ent_type_str}${pline}`;
        if (result) {
            const posi_flat = result.posi_flat;
            const indices = result.indices;
            const labelText = this.indexAsLabel(ent_type_str, ent_id, pline, EEntType.PLINE);
            this._data_threejs.selectObjLine(ent_id, indices, posi_flat, this.container, labelText);
            this.dataService.selected_ents.get(ent_type_str).set(ent_id, pline);
        } else {
            this.showMessages('Please Select a Polyline', false, 'custom');
        }
    }

    private selectPGon(face: number) {
        const ent_type_str = EEntTypeStr[EEntType.PGON];
        const result = this.getPGonPosis(face);
        const posi_flat = result.posi_flat;
        const tri_indices = result.indices;

        const ent_id = `${ent_type_str}${face}`;
        const labelText = this.indexAsLabel(ent_type_str, ent_id, face, EEntType.PGON);
        this._data_threejs.selectObjFace(ent_id, tri_indices, posi_flat, this.container, labelText);
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

    private getPLinePosis(pline1: number = null, plines: number[] = null) {
        let wires_flat: number[] = null;
        if (pline1 !== null) {
            wires_flat = [this.model.geom.query.navPlineToWire(pline1)];
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
            colls = this.model.geom.query.navAnyToColl(EEntType.TRI, object.faceIndex);
        } else if (type === 'LineSegments') {
            colls = this.model.geom.query.navAnyToColl(EEntType.EDGE, object.index / 2);
        } else if (type === 'Points') {
            const vert = this.model.geom.query.navPosiToVert(object.index);
            const point = this.model.geom.query.navVertToPoint(vert[0]);
            colls = this.model.geom.query.navAnyToColl(EEntType.POINT, point);
        }
        /**
         * Show dropdown menu only when Entity belongs to more than 1 Collection.
         */
        if (this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).size === 0 && colls.length > 1) {
            this.dropdown.setItems(colls, 'co');
            this.dropdown.visible = true;
            this.dropdown.position = this.dropdownPosition;
        } else if (colls && colls.length === 1) {
            this.chooseColl(colls[0]);
        } else {
            this.showMessages('No Collections Available', false, 'custom');
        }
    }

    private chooseColl(id: number) {
        const scene = this._data_threejs;
        const coll_id = `${EEntTypeStr[EEntType.COLL]}${id}`;
        const children = [];
        const pgons = this.model.geom.query.navCollToPgon(id);
        const pgons_flat = [].concat(...pgons);

        if (pgons_flat.length) {
            const pgonResult = this.getPGonPosis(null, pgons_flat);
            const pgons_posi = pgonResult.posi_flat;
            const pgons_indices = pgonResult.indices;

            if (pgons_indices.length !== 0) {
                // const attrib_val = this.model.attribs.query.getAttribValue(EEntType.COLL, EAttribNames.NAME, id);
                // const selecting = attrib_val ? attrib_val.toString() : `${EEntType.COLL}${id}`;
                const pgon_id = `${EEntTypeStr[EEntType.COLL]}_pg_${id}`;
                scene.selectObjFace(pgon_id, pgons_indices, pgons_posi, this.container, false);
                children.push(pgon_id);
            }
        }

        const plines = this.model.geom.query.navCollToPline(id);
        const plines_flat = [].concat(...plines);
        if (plines_flat.length) {
            const plineResult = this.getPLinePosis(null, plines_flat);
            const plines_posi = plineResult.posi_flat;
            const plines_indices = plineResult.indices;
            if (plines_indices.length !== 0) {
                const pline_id = `${EEntTypeStr[EEntType.COLL]}_pl_${id}`;
                scene.selectObjLine(pline_id, plines_indices, plines_posi, this.container, false);
                children.push(pline_id);
            }
        }

        const points = this.model.geom.query.navCollToPoint(id);
        const points_flat = [].concat(...points);
        if (points_flat.length) {
            const pointResult = this.getPointPosis(null, points_flat);
            const point_posi = pointResult.posi_flat;
            const point_indices = pointResult.point_indices;
            if (point_indices.length !== 0) {
                const point_id = `${EEntTypeStr[EEntType.COLL]}_pt_${id}`;
                scene.selectObjPoint(point_id, point_indices, point_posi, this.container, false);
                children.push(point_id);
            }
        }

        this.dataService.selected_ents.get(EEntTypeStr[EEntType.COLL]).set(coll_id, id);
        this.dataService.selected_coll.set(coll_id, children);
        this.refreshTable(null);
        this.render(this);
    }

    private chooseVertex(id: number) {
        const ent_type_str = EEntTypeStr[EEntType.VERT];
        const posi_ent = this.dataService.selected_ents.get(ent_type_str);
        const scene = this._data_threejs;
        const date = new Date(), timestamp = date.getTime();
        const position = this.model.attribs.query.getVertCoords(id);
        const ent_id = `${ent_type_str}${id}`;
        scene.selectObjVetex(`_single_v${timestamp}`, ent_id, position, this.container, true);
        posi_ent.set(ent_id, id);
        this.dataService.selected_vertex.set(`_single_v${timestamp}`, [ent_id]);
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

    selectEntity(id: number) {
        if (this.SelectingEntityType.id === EEntTypeStr[EEntType.COLL]) {
            this.chooseColl(id);
        } else if (this.SelectingEntityType.id === EEntTypeStr[EEntType.VERT]) {
            this.chooseVertex(id);
        }
    }
}

enum mouseLabel {
    Mesh = 'Polygon',
    LineSegments = 'Polyline/',
    Points = 'Point/Position'
}
