import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPublishComponent } from './view-publish.component';

const routes: Routes = [
    {
        path: '',
        component: ViewPublishComponent,
        children: [ ]
    }
];


@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ViewPublishRoutingModule { }
