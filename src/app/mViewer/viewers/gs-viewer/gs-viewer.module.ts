import { NgModule, ModuleWithProviders } from '@angular/core';
import { DataService } from './data/data.service';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
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
