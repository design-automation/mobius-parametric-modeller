import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { SharedModule } from '@shared/shared.module';

import { MatSliderModule, MatCheckboxModule } from '@angular/material';
import { AngularSplitModule } from 'angular-split';
import { NgFlowchart } from '../ngFlowchart'; 



import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component'; 
import { ProcedureEditorComponent } from './components/procedure-editor/procedure-editor.component';
import { ProcedureItemComponent } from './components/procedure-editor/procedure-item/procedure-item.component';
import { ToolsetComponent } from './components/procedure-editor/toolset/toolset.component';
import { ParameterEditorComponent } from './components/parameter-editor/parameter-editor.component';
import { InputPortEditorComponent } from './components/parameter-editor/input-port-editor/input-port-editor.component';
import { InputPortViewerComponent } from './components/parameter-viewer/input-port-viewer/input-port-viewer.component';
import { OutputPortEditorComponent } from './components/parameter-editor/output-port-editor/output-port-editor.component';
import { ParameterViewerComponent } from './components/parameter-viewer/parameter-viewer.component';


@NgModule({
  declarations: [
    EditorComponent,
    ProcedureEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent,
    ParameterEditorComponent,
    ParameterViewerComponent,
    InputPortEditorComponent, 
    InputPortViewerComponent, 
    OutputPortEditorComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    FormsModule,
    EditorRoutingModule, 
    SharedModule, 
    AngularSplitModule, 
    NgFlowchart, 
    MatSliderModule, MatCheckboxModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class EditorModule {
    constructor () { }
}
