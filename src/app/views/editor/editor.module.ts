import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component'; 

@NgModule({
  declarations: [
    EditorComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    EditorRoutingModule, 
    SharedModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class EditorModule {
    constructor () { }
}
