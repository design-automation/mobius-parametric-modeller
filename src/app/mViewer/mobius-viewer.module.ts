import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { ViewerContainerComponent } from './mobius-viewer.component';
import { VIEWER_ARR } from './viewers.config';

import { GSViewer } from './viewers/gsviewer/gsviewer.module';

import {MobiusCesium} from './viewers/mobius-cesium/mobius-cesium.module';
import { TextViewerComponent} from './viewers';
import { ConsoleViewerComponent } from './viewers';
//import { VisualiseComponent } from "./viewers/mobius-cesium/setting/visualise.component";
//import { AttributesComponent } from "./viewers/mobius-cesium/setting/attributes.copmponent";

@NgModule({
  declarations: [
    ViewerContainerComponent,
    TextViewerComponent,
    ConsoleViewerComponent,
  ],
  exports: [ ViewerContainerComponent ],
  imports: [ CommonModule, 
            FormsModule,
            GSViewer,
            MobiusCesium,
          ],
  entryComponents: [
    ...VIEWER_ARR 
  ],
  providers: [ ]
})
export class MobiusViewerModule {
    constructor () { }
}
