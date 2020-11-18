import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ViewDashboardRoutingModule } from './view-dashboard-routing.module';
import { ViewDashboardComponent } from './view-dashboard.component';

@NgModule({
  declarations: [
    ViewDashboardComponent,
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
