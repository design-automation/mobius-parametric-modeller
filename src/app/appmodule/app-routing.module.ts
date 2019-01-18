/**/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ViewFlowchartModule, ViewGalleryModule, ViewDashboardModule, ViewEditorModule, ViewAboutModule } from '@views';

// app-routing.module.ts (this file): for development purpose, will be used when running ng build, ng serve or npm start
// app-routing.module.prod.ts: for production purpose, will be used when running ng build --prod, ng serve --prod

// the app-routing.module.prod.ts must also be changed accordingly to any changes done in this file

const appRoutes: Routes = [
    { path: 'flowchart', loadChildren: () => ViewFlowchartModule },
    { path: 'gallery', loadChildren: () => ViewGalleryModule },
    { path: 'dashboard', loadChildren: () => ViewDashboardModule },
    { path: 'editor', loadChildren: () => ViewEditorModule },
    { path: 'about', loadChildren: () => ViewAboutModule },
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
