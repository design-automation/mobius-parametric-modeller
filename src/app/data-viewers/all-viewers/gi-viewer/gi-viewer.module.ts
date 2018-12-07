import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSortModule} from '@angular/material/sort';
import { MatExpansionModule} from '@angular/material/expansion';
import { NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
// import { BrowserModule } from '@angular/platform-browser';
// data service and viewers
import { DataService } from './data/data.service';
import { GIViewerComponent } from './gi-viewer.component';
import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';

@NgModule({
    declarations: [
        GIViewerComponent,
        ThreejsViewerComponent,
    ],
    exports: [
        GIViewerComponent,
    ],
    imports: [
        CommonModule,
        AngularSplitModule,
        MatSliderModule,
        NgxPaginationModule,
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatSortModule,
    ],
    providers: [
        DataService,
    ],
})
export class GIViewer {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GIViewer,
            providers: [
                DataService
            ]
        };
    }
}
