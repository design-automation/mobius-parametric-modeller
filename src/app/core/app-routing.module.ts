import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { Component } from '@angular/core';

// import { MobiusEditorComponent } from './components/editor/editor.component';
import { PageNotFoundComponent } from './components/not-found/not-found.component';
import { AboutModule } from '../modules/about/about.module';
import { ViewerModule } from '../modules/viewer/viewer.module';
import { EditorModule } from '../modules/editor/editor.module';
//import { MobiusViewerComponent } from './components/mobius-viewer/mobius-viewer.component';
//import { MbViewerComponent } from '../modules/page-viewer/mb-viewer.module';

const appRoutes: Routes = [
  { path: 'about', loadChildren: () => AboutModule },
  { path: 'viewer', loadChildren: () => ViewerModule },
  { path: 'editor', loadChildren: () => EditorModule },
  //{ path: 'viewer', loadChildren: 'app/modules/mobius-viewer/mb-viewer.module#MbViewerModule'},
  //{ path: 'viewer', component: MobiusViewerComponent},
  //{ path: 'viewer', loadChildren: 'app/modules/renderer/renderer.module#RendererModule' },
  //{ path: 'gallery', component: MobiusGalleryComponent },
  //{ path: 'viewer/:id',      component: MobiusViewerComponent },
  { path: '',   redirectTo: '/about', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
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

