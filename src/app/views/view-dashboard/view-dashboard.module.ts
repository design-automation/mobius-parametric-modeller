import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ViewDashboardRoutingModule } from './view-dashboard-routing.module';
import { ViewDashboardComponent } from './view-dashboard.component';
import { ParameterViewerComponent } from './parameter-viewer/parameter-viewer.component';
import { ProcedureInputViewerComponent } from './parameter-viewer/procedure-input-viewer/procedure-input-viewer.component';

@NgModule({
  declarations: [
    ViewDashboardComponent,
    ParameterViewerComponent,
    ProcedureInputViewerComponent
  ],
  exports: [
    ViewDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ViewDashboardRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewDashboardModule {
    constructor () { }
}
