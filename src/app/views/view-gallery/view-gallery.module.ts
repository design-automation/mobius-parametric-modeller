
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ViewGalleryRoutingModule } from './view-gallery-routing.module';
import { ViewGalleryComponent } from './view-gallery.component';
import { SimpleNamePipe } from './simple-name.pipe';

@NgModule({
  declarations: [
    ViewGalleryComponent,
    SimpleNamePipe
  ],
  exports: [],
  imports: [
    CommonModule,
    ViewGalleryRoutingModule,
    SharedModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewGalleryModule {
    constructor () { }
}
