import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewersContainerComponent } from './model-viewers-container.component';
import { VIEWER_ARR, VIEWER_MOD } from './model-viewers.config';
// viewers
import { ConsoleViewerComponent } from './all-viewers/console-viewer/console-viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/help-viewer.component';
// import { GIViewerModule } from './all-viewers/gi-viewer/gi-viewer.module';
import { MatIconModule } from '@angular/material/icon';
import { ShowdownModule } from 'ngx-showdown';

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
        MatIconModule,
        ShowdownModule,
        ...VIEWER_MOD

        // SharedModule
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
