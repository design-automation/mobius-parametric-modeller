/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 * 
 */

import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSliderModule, MatCheckboxModule } from '@angular/material';
import { NgFlowchartModule } from '../../app/ngFlowchart';
import { AngularSplitModule } from 'angular-split';

import { MbFileReaderDirective } from "./directives/filesys";
import { ExecuteComponent } from "./components/execute/execute.component";
import { PageNotFoundComponent } from "./components/not-found/not-found.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { HeaderComponent } from "./components/header/header.component";
import { AddOutputComponent } from "./components/add-components/add_output.component";
import { AddNodeComponent } from "./components/add-components/add_node.component";
import { AddInputComponent } from "./components/add-components/add_input.component";
import { ParameterViewerComponent } from "./components/parameter-viewer/parameter-viewer.component";
import { InputPortViewerComponent } from "./components/parameter-viewer/input-port-viewer/input-port-viewer.component";
import { NewFileComponent, SaveFileComponent, LoadFileComponent } from './components/file';

import { MobiusViewerModule } from '../mViewer/mobius-viewer.module';

@NgModule({
    providers: [ ],
    declarations: [
            MbFileReaderDirective, 
            ExecuteComponent, 
            PageNotFoundComponent, 
            NavigationComponent, 
            HeaderComponent, 
            AddNodeComponent, AddInputComponent, AddOutputComponent,
            ParameterViewerComponent,  InputPortViewerComponent, 
            NewFileComponent, SaveFileComponent, LoadFileComponent
        ],
    imports: [ 
            CommonModule, 
            RouterModule,
            MatSliderModule, MatCheckboxModule,
            NgFlowchartModule, 
            MobiusViewerModule,
            AngularSplitModule, 
            FormsModule
        ],
    entryComponents: [  ],
    exports: [  
            FormsModule,
            NgFlowchartModule, 
            MobiusViewerModule,
            AngularSplitModule,
            MbFileReaderDirective, 
            ExecuteComponent, 
            PageNotFoundComponent, 
            NavigationComponent, 
            HeaderComponent, 
            AddNodeComponent, 
            AddInputComponent,
            AddOutputComponent,
            ParameterViewerComponent,
            NewFileComponent, SaveFileComponent, LoadFileComponent
    ]
})
export class SharedModule{
    constructor(@Optional() @SkipSelf() shared: SharedModule){

        /// Prevents any module apart from AppModule from re-importing
        if(shared){
            throw new Error("Core Module has already been imported");
        }
    }
}