import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';

import { AboutComponent } from './about.component'; 

@NgModule({
  declarations: [
    AboutComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    AboutRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class AboutModule {
    constructor () { }
}
