import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAboutComponent } from './view-about.component';

const routes: Routes = [
    {
        path: '',
        component: ViewAboutComponent,
        children: [ ]
    }
];


@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ViewAboutRoutingModule { }
