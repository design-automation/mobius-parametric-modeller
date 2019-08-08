import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { ViewEditorComponent } from './view-editor.component';
import { ProcedureItemComponent } from './procedure-item/procedure-item.component';
import { ToolsetComponent } from './toolset/toolset.component';
import { ParameterEditorComponent } from './parameter-editor/parameter-editor.component';
import { ProcedureInputEditorComponent } from './parameter-editor/procedure-input-editor/procedure-input-editor.component';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { ViewEditorRoutingModule } from './view-editor-routing.module';

@NgModule({
  declarations: [
    ViewEditorComponent,
    ProcedureItemComponent,
    ToolsetComponent,
    ParameterEditorComponent,
    ProcedureInputEditorComponent,
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    ViewEditorRoutingModule
  ],
  exports: [
    ViewEditorComponent,
  ],
  providers: []
})

export class ViewEditorModule {
  constructor () { }

}
