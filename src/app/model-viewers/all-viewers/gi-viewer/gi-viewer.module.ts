import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
// import @angular stuff
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSortModule, MatTableModule, MatPaginatorModule} from '@angular/material';
import { MatExpansionModule} from '@angular/material/expansion';

// import app components
import { GIViewerComponent } from './gi-viewer.component';
import { ThreejsViewerComponent } from './threejs/threejs-viewer.component';
import { AttributeComponent } from './attribute/attribute.component';
/**
 * GIViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        GIViewerComponent,
        ThreejsViewerComponent,
        AttributeComponent,
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
        MatTableModule,
        MatPaginatorModule,
    ]
})
export class GIViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GIViewerModule
        };
    }
}
