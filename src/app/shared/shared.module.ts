/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 *
 */
import { AngularSplitModule } from 'angular-split';
// @angular stuff
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSliderModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatButtonModule, MatExpansionModule, MatSelectModule } from '@angular/material';
// app directives
import { MbFileReaderDirective } from './directives/filesys';
import { AutogrowDirective } from './directives/textarea';
// app components
import { ExecuteComponent } from './components/execute/execute.component';
import { PageNotFoundComponent } from './components/not-found/not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { AddOutputComponent } from './components/add-components/add_output.component';
import { AddNodeComponent } from './components/add-components/add_node.component';
import { AddInputComponent } from './components/add-components/add_input.component';
import { ParameterViewerComponent } from './components/parameter-viewer/parameter-viewer.component';
import { InputPortViewerComponent } from './components/parameter-viewer/input-port-viewer/input-port-viewer.component';
import { ProcedureInputViewerComponent } from './components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component';
import { NewFileComponent, SaveFileComponent, LoadFileComponent } from './components/file';
// app model viewers
import { DataViewersContainer } from '../model-viewers/model-viewers-container.module';

@NgModule({
    providers: [ ],
    declarations: [
            MbFileReaderDirective,
            AutogrowDirective,
            ExecuteComponent,
            PageNotFoundComponent,
            NavigationComponent,
            HeaderComponent,
            AddNodeComponent, AddInputComponent, AddOutputComponent,
            ParameterViewerComponent,  InputPortViewerComponent, ProcedureInputViewerComponent,
            NewFileComponent, SaveFileComponent, LoadFileComponent
        ],
    imports: [
            CommonModule,
            RouterModule,
            MatSliderModule, MatCheckboxModule,
            DataViewersContainer,
            AngularSplitModule,
            FormsModule,
            MatMenuModule,
            MatIconModule,
            MatButtonModule,
        ],
    entryComponents: [  ],
    exports: [
            FormsModule,
            MatMenuModule,
            MatIconModule,
            MatButtonModule,
            MatSliderModule,
            MatExpansionModule,
            MatSelectModule,
            DataViewersContainer,
            AngularSplitModule,
            MbFileReaderDirective,
            AutogrowDirective,
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
export class SharedModule {
    constructor(@Optional() @SkipSelf() shared: SharedModule) {
        /*
        /// Prevents any module apart from AppModule from re-importing
        if(shared){
            throw new Error("Core Module has already been imported");
        }
        */
    }
}
