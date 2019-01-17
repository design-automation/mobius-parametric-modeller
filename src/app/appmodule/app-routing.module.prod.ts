/**/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ViewFlowchartModule, ViewGalleryModule, ViewDashboardModule, ViewEditorModule } from '@views';

const appRoutes: Routes = [
    { path: 'flowchart', loadChildren: '../views/view-flowchart/view-flowchart.module#ViewFlowchartModule' },
    { path: 'gallery', loadChildren: '../views/view-gallery/view-gallery.module#ViewGalleryModule' },
    { path: 'dashboard', loadChildren: '../views/view-dashboard/view-dashboard.module#ViewDashboardModule' },
    { path: 'editor', loadChildren: '../views/view-editor/view-editor.module#ViewEditorModule' },
    { path: 'about', loadChildren: '../views/view-about/view-about.module#ViewAboutModule' },
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
