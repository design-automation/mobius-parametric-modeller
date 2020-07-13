import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMinimalComponent } from './view-minimal.component';

const routes: Routes = [
    {
        path: '',
        component: ViewMinimalComponent,
        children: [ ]
    }
];


@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ViewMinimalRoutingModule { }
