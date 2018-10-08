import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    FormsModule,
    AppRoutingModule,
    CoreModule,
  ],
  declarations: [
    AppComponent,
  ],
  entryComponents: [ ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor () { }
}

