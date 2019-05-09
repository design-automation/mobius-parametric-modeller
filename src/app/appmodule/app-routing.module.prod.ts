/**/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ViewFlowchartModule, ViewGalleryModule, ViewDashboardModule, ViewEditorModule } from '@views';

// app-routing.module.ts: for development purpose, will be used when running ng build, ng serve or npm start
// app-routing.module.prod.ts (this file): for production purpose, will be used when running ng build --prod, ng serve --prod

// the app-routing.module.ts must also be changed accordingly to any changes done in this file

const appRoutes: Routes = [
    { path: 'flowchart', loadChildren: '../views/view-flowchart/view-flowchart.module#ViewFlowchartModule' },
    { path: 'gallery', loadChildren: '../views/view-gallery/view-gallery.module#ViewGalleryModule' },
    { path: 'dashboard', loadChildren: '../views/view-dashboard/view-dashboard.module#ViewDashboardModule' },
    { path: 'publish', loadChildren: '../views/view-publish/view-publish.module#ViewPublishModule' },
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
