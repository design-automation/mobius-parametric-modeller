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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
// app directives
import { MbFileReaderDirective } from './directives/filesys';
// app components
import { ExecuteComponent } from './components/execute/execute.component';
import { PageNotFoundComponent } from './components/not-found/not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PanelHeaderComponent } from './components/header/panel-header.component';
import { PublishHeaderComponent } from './components/header/publish-header.component';
import { AddOutputComponent } from './components/add-components/add_output.component';
import { AddNodeComponent } from './components/add-components/add_node.component';
import { AddInputComponent } from './components/add-components/add_input.component';
// import { ParameterViewerComponent } from './components/parameter-viewer/parameter-viewer.component';
// import { InputPortViewerComponent } from './components/parameter-viewer/input-port-viewer/input-port-viewer.component';
// import { ProcedureInputViewerComponent } from './components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component';
import { NewFileComponent, SaveFileComponent, LoadFileComponent } from './components/file';
import { NotificationComponent } from './components/notification/notification.component';
// app model viewers
import { DataViewersContainer } from '../model-viewers/model-viewers-container.module';
import { LoadUrlComponent } from './components/file/loadurl.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ChromeComponent } from './components/chrome/chrome.component';
import { AutogrowDirective } from './directives/textarea';
import { ProcedureInputViewerComponent } from './components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component';
import { ParameterViewerComponent } from './components/parameter-viewer/parameter-viewer.component';
import { SaveJavascriptComponent } from './components/file/savejavascript.component';
import { WindowMessageComponent } from './components/window-message/window-message.component';

@NgModule({
    providers: [ ],
    declarations: [
            MbFileReaderDirective,
            AutogrowDirective,
            ExecuteComponent,
            PageNotFoundComponent,
            NavigationComponent,
            PanelHeaderComponent,
            PublishHeaderComponent,
            NotificationComponent,
            ProcedureInputViewerComponent,
            ParameterViewerComponent,
            AddNodeComponent, AddInputComponent, AddOutputComponent,
            // ParameterViewerComponent,  InputPortViewerComponent, ProcedureInputViewerComponent,
            NewFileComponent, SaveFileComponent, LoadFileComponent, LoadUrlComponent, SaveJavascriptComponent,
            WindowMessageComponent,
            SpinnerComponent,
            ChromeComponent
        ],
    imports: [
            CommonModule,
            RouterModule,
            MatSliderModule, MatCheckboxModule,
            DataViewersContainer,
            AngularSplitModule,
            FormsModule,
            MatIconModule,
            /*
            MatMenuModule,
            MatButtonModule,
            MatExpansionModule,
            MatSelectModule,
            MatFormFieldModule,
            */
        ],
    entryComponents: [  ],
    exports: [
            FormsModule,
            MatIconModule,
            MatSliderModule,
            /*
            MatMenuModule,
            MatButtonModule,
            MatExpansionModule,
            MatSelectModule,
            MatFormFieldModule,
            */
            DataViewersContainer,
            AngularSplitModule,
            MbFileReaderDirective,
            AutogrowDirective,
            ExecuteComponent,
            PageNotFoundComponent,
            NavigationComponent,
            PanelHeaderComponent,
            PublishHeaderComponent,
            AddNodeComponent,
            AddInputComponent,
            AddOutputComponent,
            SpinnerComponent,
            ChromeComponent,
            // ParameterViewerComponent,
            NotificationComponent,
            NewFileComponent, SaveFileComponent, LoadFileComponent, LoadUrlComponent, SaveJavascriptComponent,
            WindowMessageComponent,
            ParameterViewerComponent
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
