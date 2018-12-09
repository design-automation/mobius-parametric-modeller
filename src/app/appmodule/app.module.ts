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
// import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@shared/shared.module';
// import app components
import { AppComponent } from './app.component';
import { ViewPublishComponent} from '../views/view-publish/view-publish.component';
import { ViewPublishModule} from '../views/view-publish/view-publish.module';
import { ViewEditorComponent} from '../views/view-editor/view-editor.component';
import { ViewEditorModule} from '../views/view-editor/view-editor.module';
import { ViewGalleryComponent} from '../views/view-gallery/view-gallery.component';
import { ViewGalleryModule } from '../views/view-gallery/view-gallery.module';
import { ViewFlowchartComponent } from '../views/view-flowchart/view-flowchart.component';

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
        ViewPublishModule,
        SharedModule,
    ],
    entryComponents: [
        ViewEditorComponent,
        ViewPublishComponent,
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

