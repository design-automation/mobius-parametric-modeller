import { GIModel } from '@libs/geo-info/GIModel';
import { isDevMode, ViewChild, HostListener, OnChanges } from '@angular/core';
// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService as MD } from '@services';
import { ColorPickerService } from 'ngx-color-picker';
import { Vector3, GridHelper } from 'three';
import { SplitComponent } from 'angular-split';
import { DataGeoService } from './data/data.geo.service';
import { API_MAPS, API_MAPS_KEY_MAPPING, DataGeo } from './data/data.geo';
import { GeoSettings, geo_default_settings } from './gi-geo-viewer.settings';
import { ModalService } from './html/modal-window.service';
import { DataService as ThreeJSDataService } from '../gi-viewer/data/data.service';

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'gi-geo-viewer',
    templateUrl: './gi-geo-viewer.component.html',
    styleUrls: ['./gi-geo-viewer.component.scss'],
})
export class GIGeoViewerComponent {
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;

    public settings: GeoSettings;
    public backup_settings: GeoSettings;
    public colorLayerList: string[];
    public elevLayerList: string[];

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataGeoService, private modalService: ModalService, private threeJSDataService: ThreeJSDataService) {
        this.settings = JSON.parse(JSON.stringify(geo_default_settings));
        setTimeout(() => {
            this.settings = JSON.parse(JSON.stringify(this.dataService.getGeoScene().settings));
        }, 0);
    }

    zoomfit() {
        const view = this.dataService.getGeoScene();
        const threejs = this.threeJSDataService.getThreejsScene();
        view.lookAtObj(threejs);
    }

    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
        const scene = this.threeJSDataService.getThreejsScene();
        switch (setting) {
        //     case 'camera.pos':
        //         const camera_pos = this.dataService.getThreejsScene()._camera[1].position;
        //         this.settings.camera.pos.x = camera_pos.x;
        //         this.settings.camera.pos.y = camera_pos.y;
        //         this.settings.camera.pos.z = camera_pos.z;
        //         const camera_direction = this.dataService.getThreejsScene()._camera[1].direction;
        //         this.settings.camera.direction.x = camera_direction.x;
        //         this.settings.camera.direction.y = camera_direction.y;
        //         this.settings.camera.direction.z = camera_direction.z;
        //         const camera_up = this.dataService.getThreejsScene()._camera[1].up;
        //         this.settings.camera.up.x = camera_up.x;
        //         this.settings.camera.up.y = camera_up.y;
        //         this.settings.camera.up.z = camera_up.z;
        //         const camera_right = this.dataService.getThreejsScene()._camera[1].right;
        //         this.settings.camera.right.x = camera_right.x;
        //         this.settings.camera.right.y = camera_right.y;
        //         this.settings.camera.right.z = camera_right.z;
        //         break;
            case 'time.date':
                const current_time = (new Date()).toISOString().split(':');
                this.settings.time.date = current_time[0] + ':' + current_time[1];
                break;
            case 'time.current':
                const reset_time = (new Date()).toISOString().split(':');
                this.settings.time.date = reset_time[0] + ':' + reset_time[1];
                this.dataService.getGeoScene().updateLightPos(this.settings.time.date);
                break;
        }
    }
    /**
     *
     * @param id
     */
    public openModal(id: string) {
        if (localStorage.getItem('geo_settings') !== null) {
            // this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        }
        if (document.body.className === 'modal-open') {
            this.modalService.close(id);
        } else {
            this.backup_settings = <GeoSettings> JSON.parse(JSON.stringify(this.settings));
            const scene = this.dataService.getGeoScene();
            this.colorLayerList = scene.viewColorLayers.map(layer => layer.source.attribution.name);
            // this.elevLayerList = scene.viewElevationLayers.map(provider => provider.name);
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
            this.dataService.getGeoScene().updateSettings(this.settings);
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

    public updateLighting(event) {
        this.dataService.getGeoScene().updateLightPos(event);
        this.settings.time.date = event;
    }

}
