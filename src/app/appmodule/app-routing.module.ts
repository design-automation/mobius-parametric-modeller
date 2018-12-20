/**/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ViewFlowchartModule, ViewGalleryModule, ViewDashboardModule, ViewEditorModule } from '@views';

const appRoutes: Routes = [
    { path: 'flowchart', loadChildren: () => ViewFlowchartModule },
    { path: 'gallery', loadChildren: () => ViewGalleryModule },
    { path: 'dashboard', loadChildren: () => ViewDashboardModule },
    { path: 'editor', loadChildren: () => ViewEditorModule },
    { path: '',     redirectTo: '/gallery', pathMatch: 'full' },
    { path: '**', component: ViewGalleryModule }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- debugging purposes only
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
