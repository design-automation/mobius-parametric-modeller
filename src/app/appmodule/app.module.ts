import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from '../core/store/store';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/not-found/not-found.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    FormsModule,
    NgReduxModule,
    AppRoutingModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent
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

