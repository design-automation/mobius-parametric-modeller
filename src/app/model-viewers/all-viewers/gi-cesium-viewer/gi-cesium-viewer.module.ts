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
import { GICesiumViewerComponent } from './gi-cesium-viewer.component';
import { CesiumViewerComponent } from './cesium/cesium-viewer.component';
import { CesiumViewerService } from './cesium/cesium-viewer.service';

// import html components
import { TabComponent } from './html/tab.component';
import { TabsComponent } from './html/tabs.component';
import { DropdownMenuComponent } from './html/dropdown-menu.component';
import { CesiumModalWindowComponent } from './html/modal-window.component';
import { ModalService } from './html/modal-window.service';

// import { AttributeComponent } from './attribute/attribute.component';
// import { ATabComponent } from './attribute/tab.component';
// import { ATabsComponent } from './attribute/tabs.component';


/**
 * GICesiumViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        GICesiumViewerComponent,
        CesiumViewerComponent,
        TabComponent,
        TabsComponent,
        DropdownMenuComponent,
        CesiumModalWindowComponent
        // AttributeComponent,
        // ATabComponent,
        // ATabsComponent,
    ],
    exports: [
        GICesiumViewerComponent
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
        ModalService,
        CesiumViewerService
    ]
})
export class GICesiumViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: GICesiumViewerModule
        };
    }
}
