import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, Input } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
// import others

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
  selector: 'gi-viewer',
  templateUrl: './gi-viewer.component.html',
  styleUrls: ['./gi-viewer.component.scss']
})
export class GIViewerComponent {
    imVisible = false; // TODO what is this?
    dataservice: DataService; // TODO why is this here?
    // model data passed to the viewer
    @Input() data: GIModel;
    modelData: GIModel;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService) {
        // Do nothing
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
     * ??? what does this do?
     */
    leaflet() {
        this.imVisible = this.dataService.imVisible;
    }
}
