import { GIModel } from '@libs/geo-info/GIModel';

// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService } from './data/data.service';
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
export class GIViewerComponent implements OnInit{
    dataservice: DataService;
    // model data passed to the viewer
    @Input() data: GIModel;
    modelData: GIModel;
    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataService) {
        //
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        if (this.dataService.getThreejsScene() === undefined) {
            this.dataService.setThreejsScene();
        }
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
