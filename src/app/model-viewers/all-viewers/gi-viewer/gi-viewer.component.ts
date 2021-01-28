import { GIModel } from '@libs/geo-info/GIModel';
import { ViewChild, HostListener, OnDestroy } from '@angular/core';
import { DefaultSettings, SettingsColorMap, Locale } from './gi-viewer.settings';
// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
import { DataService as MD } from '@services';
import { ModalService } from './html/modal-window.service';
import { ColorPickerService } from 'ngx-color-picker';
import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';
import { Vector3, GridHelper } from 'three';
import { SplitComponent } from 'angular-split';
import { ISettings } from './data/data.threejsSettings';
// import others
// import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'gi-viewer',
    templateUrl: './gi-viewer.component.html',
    styleUrls: ['./gi-viewer.component.scss'],
})
export class GIViewerComponent implements OnInit, OnDestroy {
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;

    settings: ISettings = DefaultSettings;

    setting_colors = SettingsColorMap;

    normalsEnabled = false;

    temp_camera_pos = new Vector3(-80, -80, 80);
    temp_target_pos = new Vector3(0, 0, 0);
    temp_grid_pos = new Vector3(0, 0, 0);

    public clickedEvent: Event;
    public attrTableSelect: Event;
    public attrTableReset: number;
    public selectSwitchOnOff: Boolean;
    public attribLabelVal: String;

    private settingsUpdateInterval;

    @ViewChild(ThreejsViewerComponent, { static: true }) threejs: ThreejsViewerComponent;
    @ViewChild(SplitComponent, { static: true }) viewerSplit: SplitComponent;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService,
        private modalService: ModalService,
        private cpService: ColorPickerService,
        private mainDataService: MD) {

        const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        // const devMode = isDevMode();
        const devMode = false;
        if (previous_settings === null) {
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        } else {
            this.propCheck(previous_settings, this.settings);
            localStorage.setItem('mpm_settings', JSON.stringify(previous_settings));
        }
        // if (previous_settings === null || this.hasDiffProps(previous_settings, this.settings)) {
        //     localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        // }
    }

    /**
     * Check whether the current settings has same structure with
     * the previous settings saved in local storage. If not, replace the local storage.
     * @param obj1
     * @param obj2
     */
    hasDiffProps(obj1, obj2) {
        return !Object.keys(obj2).every(e => Object.keys(obj1).includes(e));
    }

    /**
     * Check whether the current settings has same structure with
     * the previous settings saved in local storage. If not, replace the local storage.
     * @param obj1
     * @param obj2
     */
    propCheck(obj1, obj2, checkChildren = true) {
        for (const i in obj2) {
            if (!obj1.hasOwnProperty(i)) {
                obj1[i] = JSON.parse(JSON.stringify(obj2[i]));
            } else if (checkChildren && obj1[i].constructor === {}.constructor && obj2[i].constructor === {}.constructor) {
                this.propCheck(obj1[i], obj2[i], false);
            }
        }
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene(this.settings);
        }
        localStorage.setItem('mpm_default_settings', JSON.stringify(DefaultSettings));
        this.temp_camera_pos = this.dataService.getThreejsScene().perspCam.position;

        this.settingsUpdateInterval = setInterval(() => {
            if (this.mainDataService.giViewerSettingsUpdated) {
                this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
                this.dataService.getThreejsScene().settings = this.settings;
                this.threejs.updateModel(this.data);
                this.mainDataService.giViewerSettingsUpdated = false;
            }
        }, 100);
    }

    ngOnDestroy() {
        clearInterval(this.settingsUpdateInterval);
        this.settingsUpdateInterval = null;
    }

    private getSettings() {
        if (localStorage.getItem('mpm_settings') !== null) {
            this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        }
    }

    threejsAction(action: {'type': string, 'event': any}) {
        // <threejs-viewer [model]='data'
        // (eventClicked)="childEventClicked($event)"
        // [attr_table_select]='attrTableSelect'
        // [selectSwitch] = 'selectSwitchOnOff'
        // [attribLabel] = 'attribLabelVal'
        // (resetTableEvent) = "resetTable()"
        // ></threejs-viewer>
        if (action.type === 'resetTableEvent') {
            this.resetTable();
        } else if (action.type === 'eventClicked') {
            this.childEventClicked(action.event);
        }
    }

    childEventClicked(event: Event) {
        this.clickedEvent = event;
    }

    attribTableSelected(event: Event) {
        this.attrTableSelect = event;
    }

    selectSwitch(event: Boolean) {
        this.selectSwitchOnOff = event;
    }

    attribLabel(event: String) {
        this.attribLabelVal = event;
    }

    resetTable() {
        this.attrTableReset = Date.now();
    }

    openModal(id: string) {
        this.getSettings();
        if (document.body.className === 'modal-open') {
            this.modalService.close(id);
        } else {
            this.modalService.open(id);
            const scene = this.dataService.getThreejsScene();
            if (scene.threejs_nums.reduce((a, b) => a + b, 0) !== 0) {
                scene.vnh !== undefined ? this.normalsEnabled = true : this.normalsEnabled = false;
            }
        }
    }

    closeModal(id: string, save = false) {
        this.modalService.close(id);
        if (save) {
            const _tab = Number(JSON.parse(localStorage.getItem('mpm_attrib_current_tab')));
            // this.settings.select = {selector: _selector, tab: _tab, };
            this.settings.select.selector = this.dataService.selectingEntityType;
            this.settings.select.tab = _tab;
            this.settings.camera = {
                pos: this.temp_camera_pos,
                target: this.temp_target_pos,
                ortho: false
            };
            this.dataService.getThreejsScene().settings = this.settings;
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
            this.threejs.updateModel(this.data);
        } else {
            // tslint:disable-next-line: forin
            for (const setting in this.dataService.getThreejsScene().settings) {
                this.settings[setting] = this.dataService.getThreejsScene().settings[setting];
            }
            this.threejs.updateModel(this.data);
        }
        setTimeout(() => {
            this.threejs.activateRender();
        }, 100);
    }

    onCloseModal() {
        // tslint:disable-next-line: forin
        for (const setting in this.dataService.getThreejsScene().settings) {
            this.settings[setting] = this.dataService.getThreejsScene().settings[setting];
        }
        this.threejs.updateModel(this.data);
    }

    settingOnChange(setting: string, value?: number) {
        const scene = this.dataService.getThreejsScene();
        switch (setting) {
            case 'normals.show':
                this.settings.normals.show = !this.settings.normals.show;
                scene.vnh.visible = this.settings.normals.show;
                break;
            case 'normals.size':
                this.settings.normals.size = Number(value);
                break;
            case 'axes.show':
                this.settings.axes.show = !this.settings.axes.show;
                scene.axesHelper.visible = this.settings.axes.show;
                break;
            case 'axes.size':
                this.settings.axes.size = Number(value);
                scene._addAxes(Number(value));
                break;
            case 'grid.show':
                this.settings.grid.show = !this.settings.grid.show;
                scene.grid.visible = this.settings.grid.show;
                break;
            case 'grid.size':
                this.settings.grid.size = Number(value);
                scene._addGrid(this.settings.grid.size);
                break;
            case 'grid.update_pos':
                this.temp_grid_pos = this.dataService.getThreejsScene().getGridPos();
                if (this.temp_grid_pos) {
                    this.settings.grid.pos = this.temp_grid_pos;
                    this.settings.grid.pos_x = this.temp_grid_pos.x;
                    this.settings.grid.pos_y = this.temp_grid_pos.y;
                }
                break;
            case 'grid.update_pos_x':
                if (isNaN(value)) {
                    return;
                }
                this.settings.grid.pos_x = Number(value);
                this.settings.grid.pos.x = Number(value);
                break;
            case 'grid.update_pos_y':
                if (isNaN(value)) {
                    return;
                }
                this.settings.grid.pos_y = Number(value);
                this.settings.grid.pos.y = Number(value);
                break;
            case 'grid.update_pos_z':
                if (isNaN(value)) {
                    return;
                }
                this.settings.grid.pos_z = Number(value);
                this.settings.grid.pos.z = Number(value);
                break;
            case 'positions.show':
                this.settings.positions.show = !this.settings.positions.show;
                scene.positions.map(p => p.visible = this.settings.positions.show);
                break;
            case 'positions.size':
                this.settings.positions.size = Number(value);
                break;
            case 'background.show':
                this.settings.background.show = !this.settings.background.show;
                break;
            case 'background.set':
                this.settings.background.background_set = Number(value);
                break;
            case 'tjs_summary.show':
                this.settings.gi_summary.show = false;
                this.settings.tjs_summary.show = !this.settings.tjs_summary.show;
                break;
            case 'gi_summary.show':
                this.settings.tjs_summary.show = false;
                this.settings.gi_summary.show = !this.settings.gi_summary.show;
                break;
            case 'wireframe.show':
                this.wireframeToggle();
                break;
            case 'camera.pos_x':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.x = Math.round(value);
                break;
            case 'camera.pos_y':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.y = Math.round(value);
                break;
            case 'camera.pos_z':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.z = Math.round(value);
                break;
            case 'camera.get_camera_pos':
                this.temp_camera_pos = this.dataService.getThreejsScene().camera.position;
                this.settings.camera.pos = this.temp_camera_pos;
                break;
            case 'camera.target_x':
                if (isNaN(value)) {
                    return;
                }
                this.temp_target_pos.x = Math.round(value);
                break;
            case 'camera.target_y':
                if (isNaN(value)) {
                    return;
                }
                this.temp_target_pos.y = Math.round(value);
                break;
            case 'camera.target_z':
                if (isNaN(value)) {
                    return;
                }
                this.temp_target_pos.z = Math.round(value);
                break;
            case 'camera.get_target_pos':
                this.temp_target_pos = this.dataService.getThreejsScene().perspControls.target;
                this.settings.camera.target = this.temp_target_pos;
                break;
            case 'ambient_light.show': // Ambient Light
                this.settings.ambient_light.show = !this.settings.ambient_light.show;
                if (scene.ambient_light) {
                    scene.ambient_light.visible = this.settings.ambient_light.show;
                }
                break;
            case 'ambient_light.intensity':
                this.settings.ambient_light.intensity = Number(value);
                scene.ambient_light.intensity = this.settings.ambient_light.intensity;
                break;
            case 'hemisphere_light.show': // Hemisphere Light
                this.settings.hemisphere_light.show = !this.settings.hemisphere_light.show;
                if (scene.hemisphere_light) {
                    scene.hemisphere_light.visible = this.settings.hemisphere_light.show;
                }
                break;
            case 'hemisphere_light.helper':
                this.settings.hemisphere_light.helper = !this.settings.hemisphere_light.helper;
                break;
            case 'hemisphere_light.intensity':
                this.settings.hemisphere_light.intensity = Number(value);
                scene.hemisphere_light.intensity = this.settings.hemisphere_light.intensity;
                break;
            case 'directional_light.show': // Directional Light
                this.settings.directional_light.show = !this.settings.directional_light.show;
                if (scene.directional_light) {
                    scene.directional_light.visible = this.settings.directional_light.show;
                }
                if (this.settings.directional_light.show) {
                    this.settings.ambient_light.intensity = 0.15;
                    this.settings.hemisphere_light.intensity = 0.15;
                } else {
                    this.settings.ambient_light.intensity = 0.5;
                    this.settings.hemisphere_light.intensity = 0.5;
                }
                break;
            // case 'directional_light.type': // Directional Light
            //     if (this.settings.directional_light.type === 'directional') {
            //         this.settings.directional_light.type = 'point';
            //     } else {
            //         this.settings.directional_light.type = 'directional';
            //     }
            //     this.threejs.updateModel(this.data);
            //     break;
            case 'directional_light.helper':
                this.settings.directional_light.helper = !this.settings.directional_light.helper;
                break;
            case 'directional_light.intensity':
                this.settings.directional_light.intensity = Number(value);
                scene.directional_light.intensity = this.settings.directional_light.intensity;
                break;
            case 'directional_light.shadow':
                this.settings.directional_light.shadow = !this.settings.directional_light.shadow;
                break;
            case 'directional_light.shadowSize':
                this.settings.directional_light.shadowSize = Number(value);
                break;
            case 'directional_light.azimuth':
                this.settings.directional_light.azimuth = Number(value);
                scene.getDLPosition(null, this.settings.directional_light.azimuth, this.settings.directional_light.altitude);
                setTimeout(() => { this.threejs.activateRender(); }, 0);
                break;
            case 'directional_light.altitude':
                this.settings.directional_light.altitude = Number(value);
                scene.getDLPosition(null, this.settings.directional_light.azimuth, this.settings.directional_light.altitude);
                break;
            // case 'directional_light.distance':
            //     this.settings.directional_light.distance = Number(value);
            //     scene.DLDistance(this.settings.directional_light.distance);
            //     break;
            case 'ground.show':
                this.settings.ground.show = !this.settings.ground.show;
                // scene.directional_light.visible = this.settings.directional_light.show;
                break;
            case 'ground.width':
                this.settings.ground.width = Number(value);
                break;
            case 'ground.length':
                this.settings.ground.length = Number(value);
                break;
            case 'ground.height':
                this.settings.ground.height = Number(value);
                if (scene.groundObj) {
                    scene.groundObj.position.setZ(this.settings.ground.height);
                }
                break;
            case 'ground.shininess':
                this.settings.ground.shininess = Number(value);
                break;
            case 'select.ps':
                this.settings.select.enabledselector.ps = !this.settings.select.enabledselector.ps;
                break;
            case 'select._v':
                this.settings.select.enabledselector._v = !this.settings.select.enabledselector._v;
                break;
            case 'select._e':
                this.settings.select.enabledselector._e = !this.settings.select.enabledselector._e;
                break;
            case 'select._w':
                this.settings.select.enabledselector._w = !this.settings.select.enabledselector._w;
                break;
            case 'select._f':
                this.settings.select.enabledselector._f = !this.settings.select.enabledselector._f;
                break;
            case 'select.pt':
                this.settings.select.enabledselector.pt = !this.settings.select.enabledselector.pt;
                break;
            case 'select.pl':
                this.settings.select.enabledselector.pl = !this.settings.select.enabledselector.pl;
                break;
            case 'select.pg':
                this.settings.select.enabledselector.pg = !this.settings.select.enabledselector.pg;
                break;
            case 'select.co':
                this.settings.select.enabledselector.co = !this.settings.select.enabledselector.co;
                break;
            default:
                break;
        }
        this.threejs.activateRender();
    }

    // resetDefault(setting, value) {
    //     const seg = setting.split('.');
    //     this.settings[seg[0]][seg[1]] = value;
    // }

    resetToDefault() {
        const default_settings = JSON.parse(localStorage.getItem('mpm_default_settings'));
        this.settings = default_settings;
    }

    checkColor(color) {
        const _color = this.cpService.hsvaToRgba(this.cpService.stringToHsva(color));
        if ((_color.r + _color.g + _color.b) / _color.a < 1.5) {
            return true;
        } else {
            return false;
        }
    }

    wireframeToggle() {
        const scene = this.dataService.getThreejsScene();
        scene.scene_objs.forEach(obj => {
            if (obj.type === 'Mesh') {
                this.settings.wireframe.show = !this.settings.wireframe.show;
                // @ts-ignore
                obj.material.wireframe = this.settings.wireframe.show;
            }
        });
    }
    dragSplitEnd(e) {
        this.mainDataService.attribVal = e.sizes[1];
    }
    getSplit() {
        return this.mainDataService.attribVal;
    }

    checkPublish() {
        const d = document.getElementById('published');
        return d !== null;
    }

    setCamera(x = null, y = null, z = null) {
        const scene = this.dataService.getThreejsScene();
        if (x) {
            scene.perspCam.position.x = x;
        }
        if (y) {
            scene.perspCam.position.y = y;
        }
        if (z) {
            scene.perspCam.position.z = z;
        }
        scene.perspCam.lookAt(scene.scene.position);
        scene.perspCam.updateProjectionMatrix();
    }
    formatNumber(value) {
        if (!value) { value = 0; }
        return Math.round(value * 100) / 100;
    }

    @HostListener('mouseleave', [])
    onmouseleave() {
        this.viewerSplit.notify('end', this.viewerSplit.gutterSize);
    }
}

// interface Settings {
//     normals: { show: boolean, size: number };
//     axes: { show: boolean, size: number };
//     grid: {
//         show: boolean,
//         size: number,
//         pos: Vector3,
//         pos_x: number,
//         pos_y: number,
//         pos_z: number,
//     };
//     background: {
//         show: boolean,
//         background_set: number
//     };
//     positions: { show: boolean, size: number };
//     wireframe: { show: boolean };
//     tjs_summary: { show: boolean };
//     gi_summary: { show: boolean };
//     camera: {
//         pos: Vector3,
//         pos_x: number,
//         pos_y: number,
//         pos_z: number,
//         target: Vector3
//     };
//     colors: {
//         viewer_bg: string,
//         position: string,
//         position_s: string,
//         vertex_s: string,
//         face_f: string,
//         face_f_s: string,
//         face_b: string,
//         face_b_s: string
//     };
//     ambient_light: {
//         show: boolean,
//         color: string,
//         intensity: number
//     };
//     hemisphere_light: {
//         show: boolean,
//         helper: boolean,
//         skyColor: string,
//         groundColor: string,
//         intensity: number
//     };
//     directional_light: {
//         show: boolean,
//         helper: boolean,
//         color: string,
//         intensity: number,
//         shadow: boolean,
//         azimuth: number,
//         altitude: number,
//         distance: number,
//         type: string,
//         shadowSize: number
//     };
//     ground: {
//         show: boolean,
//         width: number,
//         length: number,
//         height: number,
//         color: string,
//         shininess: number
//     };
//     select: {
//         selector: object,
//         tab: number,
//         ps: boolean,
//         _v: boolean,
//         _e: boolean,
//         _w: boolean,
//         _f: boolean,
//         pt: boolean,
//         pl: boolean,
//         pg: boolean,
//         co: boolean
//     };
//     version: string;
// }
