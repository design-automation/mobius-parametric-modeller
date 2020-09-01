/**/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ViewFlowchartModule, ViewGalleryModule, ViewDashboardModule, ViewEditorModule } from '@views';

// app-routing.module.ts: for development purpose, will be used when running ng build, ng serve or npm start
// app-routing.module.prod.ts (this file): for production purpose, will be used when running ng build --prod, ng serve --prod

// the app-routing.module.ts must also be changed accordingly to any changes done in this file

const appRoutes: Routes = [
    { path: 'flowchart', loadChildren: () => import('../views/view-flowchart/view-flowchart.module').then(m => m.ViewFlowchartModule) },
    { path: 'gallery', loadChildren: () => import('../views/view-gallery/view-gallery.module').then(m => m.ViewGalleryModule) },
    { path: 'dashboard', loadChildren: () => import('../views/view-dashboard/view-dashboard.module').then(m => m.ViewDashboardModule) },
    { path: 'publish', loadChildren: () => import('../views/view-publish/view-publish.module').then(m => m.ViewPublishModule) },
    { path: 'minimal', loadChildren: () => import('../views/view-minimal/view-minimal.module').then(m => m.ViewMinimalModule) },
    { path: 'editor', loadChildren: () => import('../views/view-editor/view-editor.module').then(m => m.ViewEditorModule) },
    { path: 'about', loadChildren: () => import('../views/view-about/view-about.module').then(m => m.ViewAboutModule) },
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
