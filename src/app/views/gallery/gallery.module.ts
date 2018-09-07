
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component'; 

@NgModule({
  declarations: [
    GalleryComponent
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
