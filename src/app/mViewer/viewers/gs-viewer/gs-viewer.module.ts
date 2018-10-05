import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import {MatSliderModule } from '@angular/material/slider';
import { GSViewerComponent } from './gs-viewer.component';
import { ViewerComponent } from './viewer/viewer.component';
import { SettingComponent } from './setting/setting.component';
import { ToolwindowComponent } from './toolwindow/toolwindow.component';
import { DataService } from './data/data.service';
import { GroupsComponent } from './toolwindow/groups.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule ,NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
//import { BrowserModule } from '@angular/platform-browser';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
    imports: [ 	CommonModule,
    			AngularSplitModule,
			   	MatSliderModule,
                NgxPaginationModule,
                MatExpansionModule,
                MatTabsModule,
                MatTooltipModule,
                MatSortModule
			 ],
    exports: [ GSViewerComponent ],
    declarations: [GSViewerComponent,
    			ViewerComponent,
			    SettingComponent,
			    ToolwindowComponent,
			    GroupsComponent],
    providers: [DataService],
})
export class GSViewer {
 	
 	static forRoot(): ModuleWithProviders {
        return {
            ngModule: GSViewer,
            providers: [
                DataService
            ]
        };
    }

}