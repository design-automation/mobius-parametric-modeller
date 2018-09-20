
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component'; 
import { SimpleNamePipe } from './simple-name.pipe';

@NgModule({
  declarations: [
    GalleryComponent,
    SimpleNamePipe
  ],
  exports: [],
  imports: [
    CommonModule, 
    GalleryRoutingModule,
    SharedModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class GalleryModule {
    constructor () { }
}
