/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 * 
 */

import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSliderModule, MatCheckboxModule } from '@angular/material';
import { NgFlowchartModule } from '../../app/ngFlowchart';
import { AngularSplitModule } from 'angular-split';

import { MbFileReaderDirective } from "./directives/filesys";
import { TextViewerComponent } from "./components/viewers/viewer-text.component";
import { ExecuteComponent } from "./components/execute/execute.component";
import { PageNotFoundComponent } from "./components/not-found/not-found.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { HeaderComponent } from "./components/header/header.component";
import { AddOutputComponent } from "./components/add-components/add_output.component";
import { AddNodeComponent } from "./components/add-components/add_node.component";
import { AddInputComponent } from "./components/add-components/add_input.component";
import { ParameterViewerComponent } from "./components/parameter-viewer/parameter-viewer.component";
import { InputPortViewerComponent } from "./components/parameter-viewer/input-port-viewer/input-port-viewer.component";

@NgModule({
    providers: [ ],
    declarations: [
            MbFileReaderDirective, 
            TextViewerComponent, 
            ExecuteComponent, 
            PageNotFoundComponent, 
            NavigationComponent, 
            HeaderComponent, 
            AddNodeComponent, 
            AddInputComponent,
            AddOutputComponent,
            ParameterViewerComponent, 
            InputPortViewerComponent
        ],
    imports: [ 
            CommonModule, 
            RouterModule,
            MatSliderModule, MatCheckboxModule,
            NgFlowchartModule, 
            AngularSplitModule
        ],
    exports: [  
            MbFileReaderDirective, 
            TextViewerComponent, 
            ExecuteComponent, 
            PageNotFoundComponent, 
            NavigationComponent, 
            HeaderComponent, 
            AddNodeComponent, 
            AddInputComponent,
            AddOutputComponent,
            ParameterViewerComponent,
            NgFlowchartModule, 
            AngularSplitModule
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