import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewFlowchartComponent } from './view-flowchart.component';

const routes: Routes = [
  {
    path: '',
    component: ViewFlowchartComponent,
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
export class ViewFlowchartRoutingModule { }
