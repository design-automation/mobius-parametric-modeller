import { GIModel } from '@libs/geo-info/GIModel';
import { isDevMode, ViewChild, HostListener, OnChanges } from '@angular/core';
// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataGeoService } from '../data/data.geo.service';
import { API_MAPS, API_MAPS_KEY_MAPPING, DataGeo } from '../data/data.geo';
import { GeoSettings, geo_default_settings } from '../gi-geo-viewer.settings';
import { ModalService } from '../html/modal-window.service';
import { DataService as ThreeJSDataService } from '../../gi-viewer/data/data.service';

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'three-geo-viewer',
    templateUrl: './three-geo-viewer.component.html',
    styleUrls: ['./three-geo-viewer.component.scss'],
})
export class ThreeGeoComponent implements OnInit, OnChanges {
    // model data passed to the viewer
    @Input() model: GIModel;
    @Input() nodeIndex: number;

    public settings: GeoSettings;
    public backup_settings: GeoSettings;
    public colorLayerList: string[];
    public elevLayerList: string[];

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataGeoService, private threeJSDataService: ThreeJSDataService) {
    }

    ngOnInit() {
        if (!this.dataService.getGeoScene()) {
            const savedSettings = localStorage.getItem('geo_settings');
            if (!savedSettings) {
                this.dataService.setGeoScene(geo_default_settings);
            } else {
                this.dataService.setGeoScene(JSON.parse(savedSettings));
            }
            const data = this.dataService.getGeoScene();
            data.model = this.model;
            this.dataService.createGeoViewer(this.threeJSDataService.getThreejsScene());
        } else {
            const data = this.dataService.getGeoScene();
            const geoCont = <HTMLDivElement> document.getElementById('geo-container');
            const childCont = <HTMLDivElement> document.getElementById('threejs-geo-container');
            geoCont.removeChild(childCont);
            geoCont.appendChild(data.container);
            data.model = this.model;
            const threejsScene = this.threeJSDataService.getThreejsScene();
            if (!threejsScene.model || threejsScene.model !== this.model || threejsScene.nodeIndex !== this.nodeIndex) {
                threejsScene.model = this.model;
                threejsScene.nodeIndex = this.nodeIndex;
                threejsScene.populateScene(this.model, null);
            }
            data.refreshModel(threejsScene);
            data.view.notifyChange();
        }
    }

    ngOnChanges(changes) {
        if (changes.model || changes.nodeIndex) {
            if (this.model && this.nodeIndex) {
                // if (this.dataService.switch_page) {
                //     this.dataService.switch_page = false;
                //     return;
                // }
                // this.model.outputSnapshot = this.nodeIndex;
                const data = this.dataService.getGeoScene();
                const threejsScene = this.threeJSDataService.getThreejsScene();
                if (!threejsScene || !data) { return; }
                if (!this.model) {
                    data.removeMobiusObjs();
                    return;
                }
                if ((changes.model && !changes.model.previousValue) || (changes.nodeIndex && !changes.nodeIndex.previousValue)) { return; }
                data.model = this.model;
                if (!threejsScene.model || threejsScene.model !== this.model || threejsScene.nodeIndex !== this.nodeIndex) {
                    threejsScene.model = this.model;
                    threejsScene.nodeIndex = this.nodeIndex;
                    threejsScene.populateScene(this.model, null);
                }
                data.refreshModel(threejsScene);
                data.view.notifyChange();
            }
        }
    }
}
