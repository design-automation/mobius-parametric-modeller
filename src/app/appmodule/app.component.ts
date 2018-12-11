import { Component, Injector, ComponentFactoryResolver, ViewContainerRef,
    ViewChild, EventEmitter, HostListener, OnInit } from '@angular/core';
import { ViewEditorComponent } from '../views/view-editor/view-editor.component';
import { ViewDashboardComponent } from '../views/view-dashboard/view-dashboard.component';
import { ViewGalleryComponent } from '../views/view-gallery/view-gallery.component';
import { IMobius } from '@models/mobius';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import * as circularJSON from 'circular-json';
import { IView } from '../model-viewers/view.interface';
import { ViewFlowchartComponent } from '../views/view-flowchart/view-flowchart.component';
import { Observable } from 'rxjs';
import { PlatformLocation } from '@angular/common'
import { Router } from '@angular/router';

// @ts-ignore
console.stdlog = console.log.bind(console);
// @ts-ignore
console.logs = [];
// @ts-ignore
console.log = function() {
    // @ts-ignore
    console.logs.push(Array.from(arguments));
    // @ts-ignore
    console.stdlog.apply(console, arguments);
};
/*

*/
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(private dataService: DataService, private injector: Injector) {}

}
