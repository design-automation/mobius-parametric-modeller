import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewerComponent } from './viewer.component';

const routes: Routes = [
  {   
    path: '', 
    component: ViewerComponent, 
    children: [ ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule { }