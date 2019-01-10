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

    settings: {
        normalsOnOff: boolean,
        axesOnOff: boolean,
        gridSize: number
    } = {
        normalsOnOff: false,
        axesOnOff: true,
        gridSize: 500
    };

    gridSize: number = this.settings.gridSize;

    public clickedEvent: Event;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService, private modalService: ModalService) {
        //
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene(this.settings);
        }
    }

    childEventClicked(event: Event) {
        this.clickedEvent = event;
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    settingChange(setting: string, value: number) {
        const scene = this.dataService.getThreejsScene();
        if (typeof this.settings[setting] === 'boolean') {
            this.settings[setting] = !this.settings[setting];
            switch (setting) {
                case 'normalsOnOff':
                scene.vnh.visible = this.settings[setting];
                    break;
                case 'axesOnOff':
                scene.axesHelper.visible = this.settings[setting];
                    break;
                default:
                    break;
            }
        } else if (typeof this.settings[setting] === 'number') {
            this.gridSize = value;
            switch (setting) {
                case 'gridSize':
                scene._addGrid(this.gridSize);
                    break;
                default:
                    break;
            }
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
