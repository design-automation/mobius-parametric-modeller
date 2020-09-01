import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ViewMinimalRoutingModule } from './view-minimal-routing.module';
import { ViewMinimalComponent } from './view-minimal.component';

@NgModule({
  declarations: [
    ViewMinimalComponent,
  ],
  exports: [
    ViewMinimalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ViewMinimalRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewMinimalModule {
    constructor () { }
}
