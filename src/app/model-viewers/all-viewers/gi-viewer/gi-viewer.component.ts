import { GIModel } from '@libs/geo-info/GIModel';
import * as THREE from 'three';

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

    settings: {
        normals: { show: boolean, size: number },
        axes: { show: boolean, size: number },
        grid: { show: boolean, size: number },
        positions: { show: boolean, size: number },
        tjs_summary: { show: boolean },
        colors: { viewer_bg: string }
    } = {
            normals: { show: false, size: 5 },
            axes: { show: true, size: 50 },
            grid: { show: true, size: 500 },
            positions: { show: true, size: 0.5 },
            tjs_summary: { show: false },
            colors: { viewer_bg: '#E6E6E6' }
        };

    normalsEnabled = false;

    columns_control;

    public clickedEvent: Event;
    public attrTableSelect: Event;

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService, private modalService: ModalService, private cpService: ColorPickerService) {
        //
        const previous_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        if (previous_settings === null || this.hasDiffProps(previous_settings, this.settings)) {
            localStorage.setItem('mpm_settings', JSON.stringify(this.settings));
        }

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
        return Object.keys(obj1).every(function (prop) {
            return !obj2.hasOwnProperty(prop);
        });
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
        console.log(this.settings.colors.viewer_bg);
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
            default:
                break;
        }
        scene._renderer.render(scene._scene, scene._camera);
    }

    resetDefault(setting, value) {
        const seg = setting.split('.');
        this.settings[seg[0]][seg[1]] = value;
    }

    checkColor() {
        const color = this.settings.colors.viewer_bg;
        const _color = this.cpService.hsvaToRgba(this.cpService.stringToHsva(color));
        if ((_color.r + _color.g + _color.b) / _color.a < 1.5) {
            return true;
        } else {
            return false;
        }
    }
}
