import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { Component } from '@angular/core';

import { AboutModule, GalleryModule, ViewerModule, EditorModule } from '@views';

const appRoutes: Routes = [
  { path: 'about', loadChildren: () => AboutModule },
  { path: 'gallery', loadChildren: () => GalleryModule },
  { path: 'viewer', loadChildren: () => ViewerModule },
  { path: 'editor', loadChildren: () => EditorModule },
  { path: '',   redirectTo: '/about', pathMatch: 'full' },
  { path: '**', component: AboutModule }
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

