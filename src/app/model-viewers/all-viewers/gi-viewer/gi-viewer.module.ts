import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
// import @angular stuff
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSortModule} from '@angular/material/sort';
import { MatExpansionModule} from '@angular/material/expansion';

// import app components
import { GIViewerComponent } from './gi-viewer.component';
import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';

/**
 * GIViewer
 * A viewer for Geo-Info models.
 */
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
    ]
})
export class GIViewer {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GIViewer
        };
    }
}
