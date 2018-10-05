import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { ViewerContainerComponent } from './mobius-viewer.component';
import { VIEWER_ARR } from './viewers.config';

import { AngularSplitModule } from 'angular-split';
import { MatSliderModule } from '@angular/material/slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule ,NoopAnimationsModule} from '@angular/platform-browser/animations';


import { GSViewer } from './viewers/gs-viewer/gs-viewer.module';

import { GSViewerComponent } from './viewers/gs-viewer/gs-viewer.component';
import { ViewerComponent } from './viewers/gs-viewer/viewer/viewer.component';
import { SettingComponent } from './viewers/gs-viewer/setting/setting.component';
import { ToolwindowComponent } from './viewers/gs-viewer/toolwindow/toolwindow.component';
import { GroupsComponent } from './viewers/gs-viewer/toolwindow/groups.component';

import {MobiusCesium} from './viewers/mobius-cesium/mobius-cesium.module';

import { ViewerComponent as CesiumViewerComponent} from "./viewers/mobius-cesium/viewer/viewer.component";
import { SettingComponent as CesiumSettingComponent } from "./viewers/mobius-cesium/setting/setting.component";
import { DataComponent } from "./viewers/mobius-cesium/setting/visualise.component";
import { SelectComponent } from "./viewers/mobius-cesium/setting/attributes.copmponent";
import { PublishComponent } from "./viewers/mobius-cesium/setting/publish.component";
import { DisplayComponent } from "./viewers/mobius-cesium/setting/display.copmponent";
import { MobiuscesiumComponent } from './viewers/mobius-cesium/mobius-cesium.component';
//import { VisualiseComponent } from "./viewers/mobius-cesium/setting/visualise.component";
//import { AttributesComponent } from "./viewers/mobius-cesium/setting/attributes.copmponent";

@NgModule({
  declarations: [

    ViewerContainerComponent,
    ViewerComponent,
    SettingComponent,
    ToolwindowComponent,
    GroupsComponent,
    
    MobiuscesiumComponent,
    CesiumViewerComponent,
    CesiumSettingComponent,
    DataComponent,
    SelectComponent,
    PublishComponent,
    DisplayComponent,
    //VisualiseComponent,
    //AttributesComponent,
    ...VIEWER_ARR
  ],
  exports: [ ViewerContainerComponent ],
  imports: [ CommonModule, 
            FormsModule,
            GSViewer,
            MobiusCesium,

            AngularSplitModule,
            MatSliderModule,
            NgxPaginationModule,
            MatExpansionModule, 
            MatTabsModule,
            MatTooltipModule,
            MatSortModule,
            
          ],
  entryComponents: [ ...VIEWER_ARR ],
  providers: [ ]
})
export class MobiusViewerModule {
    constructor () { }
}
