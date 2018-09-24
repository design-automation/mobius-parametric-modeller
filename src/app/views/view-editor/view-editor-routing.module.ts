import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEditorComponent } from './view-editor.component';

const routes: Routes = [
  {   
    path: '', 
    component: ViewEditorComponent, 
    children: []
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEditorRoutingModule { }