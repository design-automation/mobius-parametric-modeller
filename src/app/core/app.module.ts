import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from '../store/store';

import { AppRoutingModule } from './app-routing.module';
import { RendererModule } from '../modules/renderer/renderer.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/not-found/not-found.component';
import { MobiusViewerComponent } from './components/mobius-viewer/mobius-viewer.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    FormsModule,
    NgReduxModule,
    AppRoutingModule, 
    RendererModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MobiusViewerComponent  
  ],
  entryComponents: [ ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor (ngRedux: NgRedux<IAppState>) {
        ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
}

