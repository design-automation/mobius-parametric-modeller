import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ViewPublishRoutingModule } from './view-publish-routing.module';
import { ViewPublishComponent } from './view-publish.component';

@NgModule({
  declarations: [
    ViewPublishComponent
  ],
  exports: [
    ViewPublishComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewPublishModule {
    constructor () { }
}
