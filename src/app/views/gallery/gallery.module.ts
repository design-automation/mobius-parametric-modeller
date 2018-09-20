
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    GalleryRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class GalleryModule {
    constructor () { }
}
