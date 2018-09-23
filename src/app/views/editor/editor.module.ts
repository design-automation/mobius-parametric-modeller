import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component'; 
import { ProcedureEditorComponent } from './components/procedure-editor/procedure-editor.component';
import { ProcedureItemComponent } from './components/procedure-editor/procedure-item/procedure-item.component';
import { ToolsetComponent } from './components/procedure-editor/toolset/toolset.component';
import { ParameterEditorComponent } from './components/parameter-editor/parameter-editor.component';
import { InputPortEditorComponent } from './components/parameter-editor/input-port-editor/input-port-editor.component';
import { OutputPortEditorComponent } from './components/parameter-editor/output-port-editor/output-port-editor.component';


@NgModule({
  declarations: [
    EditorComponent,
    ProcedureEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent,
    ParameterEditorComponent,
    InputPortEditorComponent, 
    OutputPortEditorComponent
  ],
  exports: [],
  imports: [
    CommonModule, 
    EditorRoutingModule, 
    SharedModule
  ],
  providers: [ ]
})
export class EditorModule {
    constructor () { }
}
