import { GIModel } from '@libs/geo-info/GIModel';
import { Locale, CesiumSettings, cesium_default_settings } from './gi-cesium-viewer.settings';
import { isDevMode } from '@angular/core';

// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';

// import app services
import { DataCesiumService } from './data/data.cesium.service';
import { ModalService } from './html/modal-window.service';
import { ColorPickerService } from 'ngx-color-picker';

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
        // if (localStorage.getItem('cesium_settings') !== null) {
        //     const parsedSettings = JSON.parse(localStorage.getItem('cesium_settings'));
        //     this.updateSettings(this.settings, parsedSettings);
        // }
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
    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
        const scene = this.dataService.getCesiumScene();
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
            this.modalService.open(id);
            this.backup_settings = <CesiumSettings> JSON.parse(JSON.stringify(this.settings));
            const scene = this.dataService.getCesiumScene();
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
