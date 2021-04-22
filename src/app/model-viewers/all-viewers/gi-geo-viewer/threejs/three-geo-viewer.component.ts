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
import { DefaultSettings } from '../../gi-viewer/gi-viewer.settings';

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
                localStorage.setItem('geo_settings', JSON.stringify(geo_default_settings));
            } else {
                // this.dataService.setGeoScene(JSON.parse(savedSettings));
                const prevSavedSettings = JSON.parse(savedSettings);
                this.propCheck(prevSavedSettings, geo_default_settings);
                if (prevSavedSettings.imagery.apiKey) { delete prevSavedSettings.imagery.apiKey; }
                this.dataService.setGeoScene(prevSavedSettings);
                localStorage.setItem('geo_settings', JSON.stringify(prevSavedSettings));
            }
            const data = this.dataService.getGeoScene();
            data.model = this.model;
            let threeJSScene = this.threeJSDataService.getThreejsScene();
            if (!threeJSScene) {
                this.threeJSDataService.setThreejsScene(DefaultSettings);
                threeJSScene = this.threeJSDataService.getThreejsScene();
            }
            this.dataService.createGeoViewer(threeJSScene);
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

}
