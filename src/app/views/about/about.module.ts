import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component'; 

@NgModule({
  declarations: [
    AboutComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    AboutRoutingModule,
    SharedModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class AboutModule {
    constructor () { }
}
