import { GIModel } from '@libs/geo-info/GIModel';
import { isDevMode, ViewChild } from '@angular/core';
import { DefaultSettings, SettingsColorMap, Locale } from './gi-viewer.settings';
// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
import { DataService as MD} from '@services';
import { ModalService } from './html/modal-window.service';
import { ColorPickerService } from 'ngx-color-picker';
import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';
import { Vector3 } from 'three';
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
export class GIViewerComponent implements OnInit {
    dataservice: DataService;
    // model data passed to the viewer
    @Input() data: GIModel;

    settings: Settings = DefaultSettings;

    setting_colors = SettingsColorMap;

    normalsEnabled = false;

    temp_camera_pos = new Vector3(-80, -80, 80);

    public clickedEvent: Event;
    public attrTableSelect: Event;
    public attrTableReset: number;
    public selectSwitchOnOff: Boolean;
    public attribLabelVal: String;

    @ViewChild(ThreejsViewerComponent) threejs: ThreejsViewerComponent;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService,
        private modalService: ModalService,
        private cpService: ColorPickerService,
        private mainDataService: MD) {

        const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        const devMode = isDevMode();
        // const devMode = false;
        if (previous_settings === null ||
            this.hasDiffProps(previous_settings, this.settings) ||
            this.settings.version !== previous_settings.version ||
            devMode) {
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }
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
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene(this.settings);
        }
        localStorage.setItem('mpm_default_settings', JSON.stringify(DefaultSettings));
    }

    private getSettings() {
        if (localStorage.getItem('mpm_settings') !== null) {
            this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
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
            if (scene._threejs_nums.reduce((a, b) => a + b, 0) !== 0) {
                scene.vnh !== undefined ? this.normalsEnabled = true : this.normalsEnabled = false;
            }
        }
    }

    closeModal(id: string, save = false) {
        this.modalService.close(id);
        if (save) {
            const _selector = JSON.parse(localStorage.getItem('mpm_selecting_entity_type'));
            const _tab = Number(JSON.parse(localStorage.getItem('mpm_attrib_current_tab')));
            this.settings.select = { selector: _selector, tab: _tab };
            this.settings.camera = { pos: this.temp_camera_pos };
            this.dataService.getThreejsScene().settings = this.settings;
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
            this.threejs.updateModel(this.data);
        }
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
            case 'positions.show':
                this.settings.positions.show = !this.settings.positions.show;
                scene._positions.map(p => p.visible = this.settings.positions.show);
                break;
            case 'positions.size':
                this.settings.positions.size = Number(value);
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
            case 'camera.curr_pos':
                this.temp_camera_pos = this.dataService.getThreejsScene()._camera.position;
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
                    this.settings.ambient_light.intensity = 0.3;
                    this.settings.hemisphere_light.intensity = 0.3;
                } else {
                    this.settings.ambient_light.intensity = 0.5;
                    this.settings.hemisphere_light.intensity = 0.5;
                }
                break;
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
                setTimeout(() => {
                    scene.DLMapSize(this.settings.directional_light.shadowSize);
                }, 10);
                break;
            case 'directional_light.azimuth':
                this.settings.directional_light.azimuth = Number(value);
                scene.directionalLightMove(this.settings.directional_light.azimuth);
                break;
            case 'directional_light.altitude':
                this.settings.directional_light.altitude = Number(value);
                scene.directionalLightMove(null, this.settings.directional_light.altitude);
                break;
            case 'directional_light.distance':
                this.settings.directional_light.distance = Number(value);
                scene.DLDistance(this.settings.directional_light.distance);
                break;
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
            default:
                break;
        }
        scene._renderer.render(scene._scene, scene._camera);
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
        scene.sceneObjs.forEach(obj => {
            if (obj.type === 'Mesh') {
                this.settings.wireframe.show = !this.settings.wireframe.show;
                // @ts-ignore
                // obj.material.wireframe = this.settings.wireframe.show;
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
}

interface Settings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: { show: boolean, size: number };
    positions: { show: boolean, size: number };
    wireframe: { show: boolean };
    tjs_summary: { show: boolean };
    gi_summary: { show: boolean };
    camera: {
        pos: Vector3
    };
    colors: {
        viewer_bg: string,
        position: string,
        position_s: string,
        vertex_s: string,
        face_f: string,
        face_f_s: string,
        face_b: string,
        face_b_s: string
    };
    ambient_light: {
        show: boolean,
        color: string,
        intensity: number
    };
    hemisphere_light: {
        show: boolean,
        helper: boolean,
        skyColor: string,
        groundColor: string,
        intensity: number
    };
    directional_light: {
        show: boolean,
        helper: boolean,
        color: string,
        intensity: number,
        shadow: boolean,
        shadowSize: number,
        azimuth: number,
        altitude: number,
        distance: number
    };
    ground: {
        show: boolean,
        width: number,
        length: number,
        height: number,
        color: string,
        shininess: number
    };
    select: {
        selector: object,
        tab: number
    };
    version: string;
}
