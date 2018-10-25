import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { ViewEditorComponent } from './view-editor.component'; 
import { ProcedureEditorComponent } from './components/procedure-editor/procedure-editor.component';
import { ProcedureItemComponent } from './components/procedure-editor/procedure-item/procedure-item.component';
import { ToolsetComponent } from './components/procedure-editor/toolset/toolset.component';
import { ParameterEditorComponent } from './components/parameter-editor/parameter-editor.component';
import { InputPortEditorComponent } from './components/parameter-editor/input-port-editor/input-port-editor.component';
import { OutputPortEditorComponent } from './components/parameter-editor/output-port-editor/output-port-editor.component';
import { DataService } from '@services';

@NgModule({
  declarations: [
    ViewEditorComponent,
    ProcedureEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent,
    ParameterEditorComponent,
    InputPortEditorComponent, 
    OutputPortEditorComponent
  ],
  entryComponents: [
  ], 
  imports: [
    CommonModule, 
    SharedModule
  ],
  exports: [
    ViewEditorComponent,
  ],
  providers: []
})

export class ViewEditorModule {
  constructor () { }

}
