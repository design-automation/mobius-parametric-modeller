import { GIModel } from '@libs/geo-info/GIModel';
import { Locale, CesiumSettings, cesium_default_settings } from './gi-cesium-viewer.settings';
import { isDevMode } from '@angular/core';

// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';

// import app services
import { DataCesiumService } from './data/data.cesium.service';
import { ModalService } from './html/modal-window.service';
import { ColorPickerService } from 'ngx-color-picker';
import { API_MAPS, API_MAPS_KEY_MAPPING } from './data/data.cesium';

// import others

/**
 * GICesiumViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'gi-viewer',
    templateUrl: './gi-cesium-viewer.component.html',
    styleUrls: ['./gi-cesium-viewer.component.scss'],
})
export class GICesiumViewerComponent implements OnInit {
    public dataservice: DataCesiumService;
    // model data passed to the viewer
    @Input() data: GIModel;
    public modelData: GIModel;
    public settings: CesiumSettings;
    public backup_settings: CesiumSettings;
    public clickedEvent: Event;

    public layerList: string[];
    public terrainList: string[];

    public _keyMapping = API_MAPS_KEY_MAPPING;

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataCesiumService, private modalService: ModalService, private cpService: ColorPickerService) {
        // const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        const singapore = Locale[0];
        this.settings = cesium_default_settings;
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        if (localStorage.getItem('cesium_settings') !== null) {
            const parsedSettings = JSON.parse(localStorage.getItem('cesium_settings'));
            this.updateSettings(this.settings, parsedSettings);
        } else {
            localStorage.setItem('cesium_settings', JSON.stringify(this.settings));
        }

        if (this.dataService.getCesiumScene() === undefined) {
            this.dataService.setCesiumScene(this.settings);
        }
        this.dataService.createCesiumViewer();
    }
    /**
     * childEventClicked
     * @param event
     */
    childEventClicked(event: Event) {
        this.clickedEvent = event;
    }

    zoomfit() {
        const camera = this.dataService.getCesiumScene()._camera;
        const boundingSphere = camera[0];
        const cameraObj = camera[1];
        cameraObj.flyToBoundingSphere(boundingSphere, {'duration': 0});
    }

    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
        const scene = this.dataService.getCesiumScene();
        switch (setting) {
            case 'camera.pos':
                const camera_pos = this.dataService.getCesiumScene()._camera[1].position;
                this.settings.camera.pos.x = camera_pos.x;
                this.settings.camera.pos.y = camera_pos.y;
                this.settings.camera.pos.z = camera_pos.z;
                const camera_direction = this.dataService.getCesiumScene()._camera[1].direction;
                this.settings.camera.direction.x = camera_direction.x;
                this.settings.camera.direction.y = camera_direction.y;
                this.settings.camera.direction.z = camera_direction.z;
                const camera_up = this.dataService.getCesiumScene()._camera[1].up;
                this.settings.camera.up.x = camera_up.x;
                this.settings.camera.up.y = camera_up.y;
                this.settings.camera.up.z = camera_up.z;
                const camera_right = this.dataService.getCesiumScene()._camera[1].right;
                this.settings.camera.right.x = camera_right.x;
                this.settings.camera.right.y = camera_right.y;
                this.settings.camera.right.z = camera_right.z;
                break;
            case 'time.date':
                const current_time = Cesium.JulianDate.toIso8601(this.dataService.getCesiumScene()._viewer.clock.currentTime).split(':');
                this.settings.time.date = current_time[0] + ':' + current_time[1];
                break;
            case 'time.current':
                const reset_time = (new Date()).toISOString().split(':');
                this.settings.time.date = reset_time[0] + ':' + reset_time[1];
                break;
        }
    }
    /**
     *
     * @param id
     */
    public openModal(id: string) {
        if (localStorage.getItem('cesium_settings') !== null) {
            // this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        }
        if (document.body.className === 'modal-open') {
            this.modalService.close(id);
        } else {
            this.backup_settings = <CesiumSettings> JSON.parse(JSON.stringify(this.settings));
            const scene = this.dataService.getCesiumScene();
            this.layerList = scene._viewLayerProviders.map(provider => provider.name);
            this.terrainList = scene._viewTerrainProviders.map(provider => provider.name);
            this.modalService.open(id);
        }
    }
    /**
     *
     * @param id
     * @param save
     */
    public closeModal(id: string, save = false) {
        this.modalService.close(id);
        if (save) {
            this.dataService.getCesiumScene().updateSettings(this.settings);
            // document.getElementById('executeButton').click();
        } else {
            this.settings = this.backup_settings;
        }
    }

    public checkAPIKeyInput() {
        if (API_MAPS.indexOf(this.settings.imagery.layer)  !== -1) {
            if (!this.settings.imagery.apiKey[API_MAPS_KEY_MAPPING[this.settings.imagery.layer]]) {
                this.settings.imagery.apiKey[API_MAPS_KEY_MAPPING[this.settings.imagery.layer]] = '';
            }
            return true;
        }
        return false;
    }

    public onCloseModal() {
        this.settings = this.backup_settings;
        // tslint:disable-next-line: forin
        // for (const setting in this.dataService.getThreejsScene().settings) {
        //     this.settings[setting] = this.dataService.getThreejsScene().settings[setting];
        // }
        // this.threejs.updateModel(this.data);
    }

    public updateSettings(thisSettings: any, newSettings: any) {
        if (thisSettings === newSettings) { return; }
        for (const i in thisSettings) {
            if (newSettings.hasOwnProperty(i)) {
                if (thisSettings[i].constructor !== {}.constructor) {
                    thisSettings[i] = newSettings[i];
                } else {
                    this.updateSettings(thisSettings[i], newSettings[i]);
                }
            }
        }
    }
}
