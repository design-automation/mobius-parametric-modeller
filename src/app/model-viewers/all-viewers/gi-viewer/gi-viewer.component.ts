import { GIModel } from '@libs/geo-info/GIModel';
import { isDevMode } from '@angular/core';
import { DefaultSettings, SettingsColorMap, Locale } from './gi-viewer.settings';
import SunCalc from 'suncalc';

// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
import { ModalService } from './html/modal-window.service';
import { ColorPickerService } from 'ngx-color-picker';
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
    modelData: GIModel;

    settings: Settings = DefaultSettings;

    setting_colors = SettingsColorMap;

    normalsEnabled = false;

    columns_control;

    public clickedEvent: Event;
    public attrTableSelect: Event;
    public attrTableReset: number;

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService, private modalService: ModalService, private cpService: ColorPickerService) {
        const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        if (previous_settings === null ||
            this.hasDiffProps(previous_settings, this.settings) ||
            this.settings.version !== previous_settings.version ||
            isDevMode()) {
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }

        const singapore = Locale[0];

        const times = SunCalc.getTimes(new Date(), singapore.lat, singapore.lat);
        // console.log(times);

        const date = times.sunrise;

        const now_utc = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        console.log(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000));

        const sunrisePos = SunCalc.getPosition(now_utc, singapore.lat, singapore.lat);
        const sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;

        console.log('sunrisePos', sunrisePos);
        console.log('sunriseAzimuth', sunriseAzimuth);
        // if (localStorage.getItem('mpm_attrib_columns') !== null) {
        //     this.columns_control = JSON.parse(localStorage.getItem('mpm_attrib_columns'));
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
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene(this.settings);
        }
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
            this.dataService.getThreejsScene().settings = this.settings;
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
            document.getElementById('executeButton').click();
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
                this.settings.tjs_summary.show = !this.settings.tjs_summary.show;
                break;
            case 'wireframe.show':
                this.wireframeToggle();
                break;
            case 'day_light.show':
                this.settings.day_light.show = !this.settings.day_light.show;
                scene.daylight.visible = this.settings.day_light.show;
                break;
            case 'day_light.helper':
                this.settings.day_light.helper = !this.settings.day_light.helper;
                break;
            case 'day_light.intensity':
                this.settings.day_light.intensity = Number(value);
                scene.daylight.intensity = this.settings.day_light.intensity;
                break;
            case 'day_light.p.x':
                this.settings.day_light.position[0] = Number(value);
                scene.daylight.position.setX(this.settings.day_light.position[0]);
                break;
            case 'day_light.p.y':
                this.settings.day_light.position[1] = Number(value);
                scene.daylight.position.setY(this.settings.day_light.position[1]);
                break;
            case 'day_light.p.z':
                this.settings.day_light.position[2] = Number(value);
                scene.daylight.position.setZ(this.settings.day_light.position[2]);
                break;
            case 'day_light.size':
                this.settings.day_light.size = Number(value);
                scene.dayLightScale(this.settings.day_light.size);
                break;
            case 'ground.show':
                this.settings.ground.show = !this.settings.ground.show;
                // scene.daylight.visible = this.settings.day_light.show;
                break;
            case 'ground.width':
                this.settings.ground.width = Number(value);
                break;
            case 'ground.length':
                this.settings.ground.length = Number(value);
                break;
            case 'ground.shininess':
                this.settings.ground.shininess = Number(value);
                break;
            default:
                break;
        }
        scene._renderer.render(scene._scene, scene._camera);
    }

    resetDefault(setting, value) {
        const seg = setting.split('.');
        this.settings[seg[0]][seg[1]] = value;
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
}

interface Settings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: { show: boolean, size: number };
    positions: { show: boolean, size: number };
    tjs_summary: { show: boolean };
    wireframe: { show: boolean };
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
    day_light: {
        show: boolean,
        helper: boolean,
        intensity: number,
        position: number[],
        size: number
    };
    ground: {
        show: boolean,
        width: number,
        length: number,
        color: string,
        shininess: number
    };
    version: string;
}
