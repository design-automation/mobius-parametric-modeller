import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
// import @angular stuff
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';

import { MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule} from '@angular/material';
import { MatExpansionModule} from '@angular/material/expansion';

import { AttributeModule } from './attribute/attribute.module';

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
        GIViewerComponent
    ],
    imports: [
        CommonModule,
        AngularSplitModule,
        MatSliderModule,
        MatIconModule,
        NgxPaginationModule,
        MatExpansionModule,
        MatTooltipModule,
        AttributeModule
    ]
})
export class GIViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GIViewerModule
        };
    }
}
