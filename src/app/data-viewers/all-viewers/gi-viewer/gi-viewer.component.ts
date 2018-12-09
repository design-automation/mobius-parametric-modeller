import { GIModel } from '@libs/geo-info/GIModel';
import { INode } from '@models/node';
// import @angular stuff
import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
// import app services
import { DataService } from './data/data.service';
// import others

/**
 * GIViewerComponent
 * This component is used in /app/data-viewers/data-viewers-container.component.html
 */
@Component({
  selector: 'gi-viewer',
  templateUrl: './gi-viewer.component.html',
  styleUrls: ['./gi-viewer.component.scss']
})
export class GIViewerComponent {
    imVisible = false;
    // model data passed to the viewer
    @Input() data: GIModel;
    modelData: GIModel;
    constructor(private dataService: DataService) {
    }
    /**
     * setModel Sets the model in the data service.
     * @param data
     */
    setModel(data: GIModel): void {
        try {
            this.dataService.setModel(data);
        } catch (ex) {
            this.modelData = undefined;
            console.error('Error generating model');
        }
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        this.modelData = this.data;
        this.setModel(this.modelData);
    }
    /**
     * ngDoCheck
     */
    ngDoCheck() {
        if (this.modelData !== this.data) {
            this.modelData = this.data;
            this.setModel(this.modelData);
        }
    }
    /**
     * leaflet ???
     */
    leaflet() {
        this.imVisible = this.dataService.imVisible;
    }
}
