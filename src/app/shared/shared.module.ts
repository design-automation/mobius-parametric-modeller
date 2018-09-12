/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 * 
 */

import { NgModule, SkipSelf, Optional } from "@angular/core";
import { MbFileReaderDirective } from "./directives/filesys";

@NgModule({
    providers: [/* GLOBAL SERVICES */],
    declarations: [ MbFileReaderDirective ],
    exports: [ MbFileReaderDirective ]
})
export class SharedModule{
    constructor(@Optional() @SkipSelf() shared: SharedModule){

        /// Prevents any module apart from AppModule from re-importing
        if(shared){
            throw new Error("Core Module has already been imported")
        }
    }
}