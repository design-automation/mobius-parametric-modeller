import { GIModel } from '@libs/geo-info/GIModel';
import * as THREE from 'three';

// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
import { ModalService } from './html/modal-window.service';
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

    settings: settings = {
        normals: { show: false, size: 5 },
        axes: { show: true, size: 20 },
        grid: { show: true, size: 500 },
    };
    // defalt settings, will be saved to settings when Save
    currentSettings: settings;
    // temp settings, will be replaced when Cancel
    changeSettings: settings;

    normalsEnabled = false;

    public clickedEvent: Event;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService, private modalService: ModalService) {
        //
        if (localStorage.getItem('mpm_settings') === null) {
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        this.currentSettings = this.settings;
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene(this.settings);
        }
    }

    private getSettings() {
        if (localStorage.getItem('mpm_settings') != null) {
            this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        }
    }

    childEventClicked(event: Event) {
        this.clickedEvent = event;
    }

    openModal(id: string) {
        this.modalService.open(id);
        const scene = this.dataService.getThreejsScene();
        scene.vnh !== undefined ? this.normalsEnabled = true : this.normalsEnabled = false;
        this.changeSettings = this.settings;
        console.log('Open Modal', this.settings.axes.show);
    }

    closeModal(id: string, saveSettings = false) {
        this.modalService.close(id);
        const scene = this.dataService.getThreejsScene();
        if (saveSettings) {
            this.settings = this.currentSettings;
            this.dataService.getThreejsScene().settings = this.settings;
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
            scene.axesHelper.visible = this.settings.axes.show;
        } else {
            this.settings = this.changeSettings;
            console.log('Close Modal: Cancel', this.settings.axes.show);
            scene._addAxes(this.settings.axes.size);
            scene.axesHelper.visible = this.settings.axes.show;
            scene._renderer.render(scene._scene, scene._camera);
        }
    }

    settingOnChange(setting: string, value: number) {
        const scene = this.dataService.getThreejsScene();
        switch (setting) {
            case 'normals.show':
                // this.settings[_setting].show = !this.settings[_setting].show;
                // scene.vnh.visible = this.currentSettings[_setting].show;
                break;
            case 'normals.size':
                // this.currentSettings.normals.size = Number(value);
                break;
            case 'axes.show':
                // this.currentSettings.axes.show = !this.currentSettings.axes.show;
                scene.axesHelper.visible = !this.currentSettings.axes.show;
                console.log('On Change', !this.currentSettings.axes.show);
                break;
            case 'axes.size':
                // this.axesSize = Number(value);
                // scene._addAxes(this.axesSize);
                break;
            case 'grid.show':
                // this.settings[_setting].show = !this.settings[_setting].show;
                // scene.grid.visible = this.currentSettings[_setting].show;
                break;
            case 'grid.size':
                // this.gridSize = Number(value);
                // scene._addGrid(this.gridSize);
                break;
            default:
                break;
        }
        scene._renderer.render(scene._scene, scene._camera);
    }

    /**
     * setModel Sets the model in the data service.
     * @param data
     */
    // setModel(data: GIModel): void {
    //     try {
    //         this.dataService.setGIModel(data);
    //         // this.modelData = this.data;
    //     } catch (ex) {
    //         // this.modelData = undefined;
    //         console.error('Error generating model', ex);
    //     }
    // }
}

interface settings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: { show: boolean, size: number };
}
