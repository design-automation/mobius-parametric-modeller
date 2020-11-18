// import @angular stuff
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';

// import other modules
import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
import { ColorPickerModule } from 'ngx-color-picker';

// import app components
import { CytoscapeViewerComponent } from './cytoscape-viewer.component';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { CytoscapeService } from './service/cytoscape.service';

// import { AttributeComponent } from './attribute/attribute.component';
// import { ATabComponent } from './attribute/tab.component';
// import { ATabsComponent } from './attribute/tabs.component';


/**
 * GICesiumViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        CytoscapeViewerComponent,
        CytoscapeComponent
    ],
    exports: [
        CytoscapeViewerComponent
    ],
    imports: [
        CommonModule,
        AngularSplitModule,
        MatSliderModule,
        MatIconModule,
        NgxPaginationModule,
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ColorPickerModule
    ],
    providers: [
        CytoscapeService
    ]
})
export class CytoscapeViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: CytoscapeViewerModule
        };
    }
}
