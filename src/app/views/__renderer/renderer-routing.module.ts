import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendererComponent } from './renderer.component';
import { TextRendererComponent } from './text-renderer/text-renderer.component';
import { JSONRendererComponent } from './json-renderer/json-renderer.component';

const routes: Routes = [
  { 
  	path: '', component: RendererComponent,
    children: [
      { path: '', redirectTo: 'text', pathMatch: 'full' },
      { path: 'text', component: TextRendererComponent },
      { path: 'json', component: JSONRendererComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendererRoutingModule { }