import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
//import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ViewEditorModule } from '@views';
import { ViewEditorComponent } from '@views';
import { ViewPublishModule } from '@views';
import { ViewPublishComponent } from '@views';
import { SharedModule } from '@shared/shared.module';
import { DataService } from '@services';
import { FlowchartComponent } from '../ngFlowchart-svg/flowchart.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    //FormsModule,
    //AppRoutingModule,
    //CoreModule,
    ViewEditorModule,
    ViewPublishModule,
    SharedModule,
  ],
  entryComponents: [ 
    ViewEditorComponent,
    ViewPublishComponent,
    FlowchartComponent,
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor () { }
}

