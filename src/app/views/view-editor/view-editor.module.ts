import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { ViewEditorComponent } from './view-editor.component'; 
import { ProcedureItemComponent } from './procedure-item/procedure-item.component';
import { ToolsetComponent } from './toolset/toolset.component';
import { ParameterEditorComponent } from './parameter-editor/parameter-editor.component';
import { InputPortEditorComponent } from './parameter-editor/input-port-editor/input-port-editor.component';
import { OutputPortEditorComponent } from './parameter-editor/output-port-editor/output-port-editor.component';
import { procedureInputEditorComponent } from './parameter-editor/procedure-input-editor/procedure-input-editor.component';
import { _parameterTypes} from '@modules';
import { MatSliderModule, MatIconModule, MatExpansionModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    ViewEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent,
    ParameterEditorComponent,
    InputPortEditorComponent, 
    OutputPortEditorComponent,
    procedureInputEditorComponent,
  ],
  entryComponents: [
  ], 
  imports: [
    CommonModule, 
    SharedModule,
    MatSliderModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  exports: [
    ViewEditorComponent,
  ],
  providers: []
})

export class ViewEditorModule {
  constructor () { }

}
