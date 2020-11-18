import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ViewAboutRoutingModule } from './view-about-routing.module';
import { ViewAboutComponent } from './view-about.component';

@NgModule({
  declarations: [
    ViewAboutComponent,
  ],
  exports: [
    ViewAboutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ViewAboutRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewAboutModule {
    constructor () { }
}
