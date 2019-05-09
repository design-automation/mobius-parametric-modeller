import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewGalleryComponent } from './view-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: ViewGalleryComponent,
    children: []
  }
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ViewGalleryRoutingModule { }
