/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 * 
 */
import { NgModule, SkipSelf, Optional } from "@angular/core";

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';


@NgModule({
    imports: [ NgReduxModule ],
    providers: [ ]
})
export class CoreModule{
    constructor(@Optional() @SkipSelf() core: CoreModule, 
                ngRedux: NgRedux<IAppState>){
        /// Prevents any module apart from AppModule from re-importing
        if(core){
            throw new Error("Core Module has already been imported");
        }

        ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
}