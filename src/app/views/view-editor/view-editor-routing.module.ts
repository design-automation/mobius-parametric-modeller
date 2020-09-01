import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEditorComponent } from './view-editor.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEditorComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: '../../mobius-viewer/mobius-viewer.module#MobiusViewerModule',
      // }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEditorRoutingModule { }
