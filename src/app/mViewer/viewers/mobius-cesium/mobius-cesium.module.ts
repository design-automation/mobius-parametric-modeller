import { NgModule, ModuleWithProviders,Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MobiuscesiumComponent} from "./mobius-cesium.component";
import { ViewerComponent} from "./viewer/viewer.component";
import { DataService } from "./data/data.service";
import { AngularSplitModule } from "angular-split";
import { BrowserAnimationsModule ,NoopAnimationsModule} from "@angular/platform-browser/animations";
import { BrowserModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { MatTabsModule} from "@angular/material/tabs";
import { MatTooltipModule} from "@angular/material/tooltip";
import {MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { SettingComponent } from "./setting/setting.component";
import { DataComponent } from "./setting/visualise.component";
import { SelectComponent } from "./setting/attributes.copmponent";
import { PublishComponent } from "./setting/publish.component";
import { DisplayComponent } from "./setting/display.copmponent";


@NgModule({
    imports: [       ],
    exports: [],
    declarations: [],
    providers: [DataService],
})
export class MobiusCesium {
   static forRoot(): ModuleWithProviders {
        return {
            ngModule: MobiusCesium,
            providers: [
               DataService,
            ],
        };
    }
}


