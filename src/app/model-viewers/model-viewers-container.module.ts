import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewersContainerComponent } from './model-viewers-container.component';
import { VIEWER_ARR } from './model-viewers.config';
// viewers
import { TextViewerComponent } from './all-viewers/text-viewer/viewer.component';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/viewer.component';
import { GIViewerModule } from './all-viewers/gi-viewer/gi-viewer.module';
// import { ThreejsViewerComponent } from './viewers/gi-viewer/threejs/threejs-viewer.component';
// import { MobiusCesium } from './viewers/cesium-viewer/mobius-cesium.module';
// import { VisualiseComponent } from "./viewers/cesium-viewer/setting/visualise.component";
// import { AttributesComponent } from "./viewers/cesium-viewer/setting/attributes.copmponent";

/**
 * DataViewersContainer, NgModule
 */
@NgModule({
    declarations: [
        DataViewersContainerComponent,
        // TextViewerComponent,
        ConsoleViewerComponent,
        HelpViewerComponent,
    ],
    exports: [
        DataViewersContainerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        GIViewerModule,
    ],
    entryComponents: [
        ...VIEWER_ARR
    ],
    providers: [ ]
})
export class DataViewersContainer {
    /**
     * constructor
     */
    constructor () {
        // do nothing
    }
}
