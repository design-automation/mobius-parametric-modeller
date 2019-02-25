import { GIModel } from '@libs/geo-info/GIModel';
import { Locale, CesiumSettings } from './gi-cesium-viewer.settings';
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
    public clickedEvent: Event;

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataCesiumService, private modalService: ModalService, private cpService: ColorPickerService) {
        // const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        const singapore = Locale[0];
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        if (localStorage.getItem('mpm_settings') !== null) {
            // this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
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
    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
        const scene = this.dataService.getCesiumScene();
        // scene._renderer.render(scene._scene, scene._camera);
    }
    /**
     *
     * @param id
     */
    public openModal(id: string) {
        if (localStorage.getItem('mpm_settings') !== null) {
            // this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        }
        if (document.body.className === 'modal-open') {
            this.modalService.close(id);
        } else {
            this.modalService.open(id);
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
            this.dataService.getCesiumScene().settings = this.settings;
            // localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
            // document.getElementById('executeButton').click();
        }
    }
}
