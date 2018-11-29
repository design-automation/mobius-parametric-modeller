import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
// import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ViewPublishComponent, ViewPublishModule,
         ViewEditorComponent, ViewEditorModule,
         ViewGalleryComponent, ViewGalleryModule } from '@views';
import { SharedModule } from '@shared/shared.module';
import { DataService } from '@services';
import { FlowchartComponent } from '../ngFlowchart-svg/flowchart.component';
import { MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';



@NgModule({
        declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // FormsModule,
        // AppRoutingModule,
        // CoreModule,
        ViewGalleryModule,
        ViewEditorModule,
        ViewPublishModule,
        SharedModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
    ],
    entryComponents: [
        ViewEditorComponent,
        ViewPublishComponent,
        FlowchartComponent,
        ViewGalleryComponent,
    ],
    providers: [ DataService ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
        constructor () { }
}

