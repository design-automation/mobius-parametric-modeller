import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RendererRoutingModule } from './renderer-routing.module';
import { RendererComponent } from './renderer.component';

import { TextRendererComponent } from './text-renderer/text-renderer.component';
import { JSONRendererComponent } from './json-renderer/json-renderer.component';

@NgModule({
  declarations: [ TextRendererComponent, JSONRendererComponent, RendererComponent ],
  exports: [ ],
  imports: [
    CommonModule,
    FormsModule, 
    RendererRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ],
  bootstrap: [ RendererComponent ]
})
export class RendererModule {
    constructor () { }
}