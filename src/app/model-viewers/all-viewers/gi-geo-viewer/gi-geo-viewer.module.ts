import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
// import @angular stuff
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';

// import app components
import { GIGeoViewerComponent } from './gi-geo-viewer.component';

import { ModalService } from './html/modal-window.service';
import { ThreeGeoComponent } from './threejs/three-geo-viewer.component';
import { ModalWindowComponent } from './html/modal-window.component';
import { DropdownMenuComponent } from './html/dropdown-menu.component';
import { TabsComponent } from './html/tabs.component';
import { TabComponent } from './html/tab.component';

/**
 * GIViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        GIGeoViewerComponent,
        ThreeGeoComponent,
        TabComponent,
        TabsComponent,
        DropdownMenuComponent,
        ModalWindowComponent
    ],
    exports: [
        GIGeoViewerComponent
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
        ModalService
    ]
})
export class GIGeoViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GIGeoViewerModule
        };
    }
}
