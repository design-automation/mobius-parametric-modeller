/*import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { Component } from '@angular/core';

import { ViewAboutModule, ViewGalleryModule, ViewPublishModule, ViewEditorModule } from '@views';

const appRoutes: Routes = [
  { path: 'about', loadChildren: () => ViewAboutModule },
  { path: 'gallery', loadChildren: () => ViewGalleryModule },
  { path: 'publish', loadChildren: () => ViewPublishModule },
  { path: 'editor', loadChildren: () => ViewEditorModule },
  { path: '',   redirectTo: '/about', pathMatch: 'full' },
  { path: '**', component: ViewAboutModule }
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
*/
