import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { AngularSplitModule } from 'angular-split';
import { MatExpansionModule, MatIconModule, MatListModule } from '@angular/material';
import { NgFlowchart } from '../ngFlowchart'; 

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component'; 
import { ProcedureEditorComponent } from './components/procedure-editor/procedure-editor.component';
import { ProcedureItemComponent } from './components/procedure-editor/procedure-item/procedure-item.component';
import { ToolsetComponent } from './components/procedure-editor/toolset/toolset.component';



@NgModule({
  declarations: [
    EditorComponent,
    ProcedureEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    FormsModule,
    EditorRoutingModule, 
    SharedModule, 
    AngularSplitModule, 
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    NgFlowchart
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class EditorModule {
    constructor () { }
}
