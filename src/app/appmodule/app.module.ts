// import @angular stuff
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import app services
import { DataService, KeyboardService } from '@services';
import { DataService as GiViewerDataService } from '../model-viewers/all-viewers/gi-viewer/data/data.service';
// import app modules
// import { CoreModule } from '@assets/core/core.module';
import { SharedModule } from '@shared/shared.module';
// import { AppRoutingModule } from './app-routing.module';
// import app components
import { AppComponent, NoCacheHeadersInterceptor } from './app.component';
import {ViewEditorModule, ViewDashboardModule, ViewGalleryModule,
    ViewEditorComponent, ViewDashboardComponent, ViewGalleryComponent,
    ViewFlowchartComponent, ViewFlowchartModule,
    ViewAboutComponent, ViewAboutModule, ViewPublishModule, ViewPublishComponent, ViewMinimalModule, ViewMinimalComponent} from '@views';
import { AppRoutingModule } from './app-routing.module';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { CytoscapeService } from '../model-viewers/all-viewers/cytoscape-viewer/service/cytoscape.service';
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
        ViewGalleryModule,
        ViewEditorModule,
        ViewDashboardModule,
        ViewPublishModule,
        ViewMinimalModule,
        ViewFlowchartModule,
        ViewAboutModule,
        SharedModule,
    ],
    entryComponents: [
        ViewEditorComponent,
        ViewDashboardComponent,
        ViewPublishComponent,
        ViewMinimalComponent,
        ViewFlowchartComponent,
        ViewGalleryComponent,
        ViewAboutComponent,
    ],
    providers: [ DataService, DataOutputService, KeyboardService,
                 GiViewerDataService, CytoscapeService,
                 GoogleAnalyticsService,
                 {
                    provide: HTTP_INTERCEPTORS,
                    useClass: NoCacheHeadersInterceptor,
                    multi: true
                 }],
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

