import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import {
    Component, OnInit, Input, Output, EventEmitter,
    Injector, ElementRef, DoCheck, OnChanges, SimpleChanges, ViewChild, OnDestroy
} from '@angular/core';
import { DataCesium } from '../data/data.cesium';
import { DataCesiumService } from '../data/data.cesium.service';
import { CesiumViewerService } from './cesium-viewer.service';
import { ModalService } from '../html/modal-window.service';
import { DataService } from '@shared/services';

// import { IModel } from 'gs-json';
// import { DropdownMenuComponent } from '../html/dropdown-menu.component';
// import { CesiumViewerService } from './cesium-viewer.service';

/**
 * A cesium viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-cesium-viewer/gi-cesium-viewer.component.html
 */
@Component({
    selector: 'cesium-viewer',
    templateUrl: './cesium-viewer.component.html',
    styleUrls: ['./cesium-viewer.component.scss']
})
export class CesiumViewerComponent implements OnInit, DoCheck, OnChanges {
    @Output() eventClicked = new EventEmitter<Event>();
    @Input() model: GIModel;

    // protected modalWindow: ModalService;
    public container = null;
    public _elem: ElementRef;
    // viewer size
    public _width: number;
    public _height: number;
    // DataService
    protected dataService: DataCesiumService;
    // cesium scene data
    public _data_cesium: DataCesium;
    // num of positions, edges, triangles in cesium
    public _cesium_nums: [number, number, number];
    // flags for displayinhg text in viewer, see html
    public _no_model = false;
    public _model_error = false;
    public messageVisible = false;
    public message: string;
    // the selectable type of entity by user, depends on the Attribute Tab
    // public selectable: number;
    // right selection dropdown
    // public needSelect = false;
    // current entity type enabled for selection
    // public SelectingEntityType: { id: string, name: string } = { id: EEntTypeStr[EEntType.FACE], name: 'Faces' };
    // public selectDropdownVisible = false;
    // public selections = [
    //     { id: EEntTypeStr[EEntType.POSI], name: 'Positions' }, { id: EEntTypeStr[EEntType.VERT], name: 'Vertex' },
    //     { id: EEntTypeStr[EEntType.EDGE], name: 'Edges' }, { id: EEntTypeStr[EEntType.WIRE], name: 'Wires' },
    //     { id: EEntTypeStr[EEntType.FACE], name: 'Faces' }, { id: EEntTypeStr[EEntType.POINT], name: 'Points' },
    //     { id: EEntTypeStr[EEntType.PLINE], name: 'Polylines' }, { id: EEntTypeStr[EEntType.PGON], name: 'Polygons' },
    //     { id: EEntTypeStr[EEntType.COLL], name: 'Collections' }
    // ];
    // public dropdownPosition = { x: 0, y: 0 };
    // private isDown = false;
    // private lastX: number;
    // private lastY: number;
    // private dragHash: number;
    // private shiftKeyPressed = false;
    // private mouse_label: HTMLElement;

    /**
     * Creates a new viewer,
     * @param injector
     * @param elem
     */
    constructor(injector: Injector, elem: ElementRef,
                private cesiumViewerService: CesiumViewerService,
                private mainDataService: DataService) {
        this._elem = elem;
        this.dataService = injector.get(DataCesiumService);
        // this.modalWindow = injector.get(ModalService);
    }
    /**
     * Called when the viewer is initialised.
     */
    ngOnInit() {
        this.container = this._elem.nativeElement.children.namedItem('cesium-container');
        // check for container
        if (!this.container) {
            console.error('No container in Cesium Viewer');
            return;
        }
        // size of window
        this._width = this.container.offsetWidth; // container.client_width;
        this._height = this.container.offsetHeight; // container.client_height;

        this._data_cesium = this.dataService.getCesiumScene();
        this.cesiumViewerService.data_cesium = this._data_cesium;

        // this.container.appendChild(this._data_cesium._renderer.domElement);

        // ??? What is happening here?
        // const self = this;
        // this._data_cesium._controls.addEventListener('change', function () { self.render(self); });
        // self._data_cesium._renderer.render(self._data_cesium._scene, self._data_cesium._camera);

        if (localStorage.getItem('mpm_selecting_entity_type') === null) {
            // localStorage.setItem('mpm_selecting_entity_type', JSON.stringify(this.SelectingEntityType));
        } else {
            // this.getSelectingEntityType();
        }
    }
    /**
     * @param self
     */
    public render(self: CesiumViewerComponent) {
        // self._data_cesium._renderer.render(self._data_cesium._scene, self._data_cesium._camera);
    }

    /**
     * Called when anything changes
     */
    ngDoCheck() {
        if (!this.container) {
            console.error('No container in Cesium Viewer');
            return;
        }
        const width: number = this.container.offsetWidth;
        const height: number = this.container.offsetHeight;
        // this is when dimensions change
        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            setTimeout(() => {
                // this._data_cesium._camera.aspect = this._width / this._height;
                // this._data_cesium._camera.updateProjectionMatrix();
                // this._data_cesium._renderer.setSize(this._width, this._height);
                // this.render(this);
            }, 10);
        }
    }

    // receive data -> model from gi-cesium-viewer component and update model in the scene
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
        this._data_cesium = this.dataService.getCesiumScene();
        if (!model) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        } else {
            if (model !== this._data_cesium._model) {
                this._data_cesium._model = model;
                try {
                    // add geometry to the scene
                    this._data_cesium.addGeometry(model, this.container);
                    this._model_error = false;
                    this._no_model = false;
                    // this.render(this);
                } catch (ex) {
                    console.error(ex);
                    this._model_error = true;
                    this._data_cesium._text = ex;
                    this.mainDataService.notifyMessage(this._data_cesium._text);
                }
            }
        }
    }

    public onMouseUp(event) {
        // do nothing for now
    }

    public onMouseMove(event) {
        // do nothing for now
    }

    public onMouseDown(event) {
        // do nothing for now
    }

    public onKeyDown(event) {
        // do nothing for now
    }

    public onKeyUp(event) {
        // do nothing for now
    }

    public onUserAction(event) {
        // do nothing for now
    }

}
