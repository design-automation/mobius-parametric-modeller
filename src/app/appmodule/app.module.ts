// import @angular stuff
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import app services
import { DataService } from '@services';
import { DataService as GiViewerDataService } from '../model-viewers/all-viewers/gi-viewer/data/data.service';
// import app modules
import { CoreModule } from '../core/core.module';
import { SharedModule } from '@shared/shared.module';
// import { AppRoutingModule } from './app-routing.module';
// import app components
import { AppComponent } from './app.component';
import {ViewEditorModule, ViewDashboardModule, ViewGalleryModule,
    ViewEditorComponent, ViewDashboardComponent, ViewGalleryComponent,
    ViewFlowchartComponent, ViewFlowchartModule} from '@views';
import { AppRoutingModule } from './app-routing.module';
// import { WebWorkerService } from 'ngx-web-worker';



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
        FormsModule,
        AppRoutingModule,
        CoreModule,
        ViewGalleryModule,
        ViewEditorModule,
        ViewDashboardModule,
        ViewFlowchartModule,
        SharedModule,
    ],
    entryComponents: [
        ViewEditorComponent,
        ViewDashboardComponent,
        ViewFlowchartComponent,
        ViewGalleryComponent,
    ],
    providers: [ DataService, GiViewerDataService],
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

