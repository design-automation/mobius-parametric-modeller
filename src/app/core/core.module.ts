/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 * 
 */
import { NgModule, SkipSelf, Optional } from "@angular/core";
import { DataService, ViewerService } from "@services";

@NgModule({
    imports: [ ],
    declarations: [ ],
    providers: [ DataService, ViewerService ],
    exports: [ ],
    entryComponents: []
})
export class CoreModule{
    constructor(@Optional() @SkipSelf() core: CoreModule){
        /// Prevents any module apart from AppModule from re-importing
        if(core){
            throw new Error("Core Module has already been imported");
        }
    }
}