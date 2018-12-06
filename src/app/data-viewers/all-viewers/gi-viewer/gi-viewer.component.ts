import { Component, OnInit, Input, Injectable } from '@angular/core';
import { DataService } from './data/data.service';
import { GIModel } from '../../../../libs/geo-info/GIModel';
import { INode } from '@models/node';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'gi-viewer.module',
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
    setModel(data: GIModel): void {
        try {
            this.dataService.setModel(data);
        } catch (ex) {
            this.modelData = undefined;
            console.error('Error generating model');
        }
    }
    ngOnInit() {
        this.modelData = this.data;
        this.setModel(this.modelData);
    }
    ngDoCheck() {
        if (this.modelData !== this.data) {
            this.modelData = this.data;
            this.setModel(this.modelData);
        }
    }
    leaflet() {
        this.imVisible = this.dataService.imVisible;
    }
}
