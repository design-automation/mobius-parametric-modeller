// import @angular stuff
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
// import app services
import { DataService } from '@services';
// import app modules
import { CoreModule } from '../core/core.module';
import { SharedModule } from '@shared/shared.module';
// import { AppRoutingModule } from './app-routing.module';
// import app components
import { AppComponent } from './app.component';
import {ViewEditorModule, ViewDashboardModule, ViewGalleryModule,
    ViewEditorComponent, ViewDashboardComponent, ViewGalleryComponent,
    ViewFlowchartComponent} from '@views';


/**
 * AppModule, the root module for the whole app.
 */
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        // FormsModule,
        // AppRoutingModule,
        // CoreModule,
        ViewGalleryModule,
        ViewEditorModule,
        ViewDashboardModule,
        SharedModule,
    ],
    entryComponents: [
        ViewEditorComponent,
        ViewDashboardComponent,
        ViewFlowchartComponent,
        ViewGalleryComponent,
    ],
    providers: [ DataService ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    /**
     * constructor
     */
    constructor () {
        // Do nothing
    }
}

